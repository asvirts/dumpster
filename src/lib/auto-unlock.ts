import { env } from 'cloudflare:workers';
import { and, eq, gte, sql } from 'drizzle-orm';
import type Stripe from 'stripe';
import type { AppDb } from './db';
import { leads, operators, type Lead, type Operator } from './schema';
import { logAudit } from './admin';
import { sendAutoBuyPaused, sendLeadUnlocked } from './email';
import { leadTagId } from './email-tags';
import { leadPayloadFromRow, priceForLead, siteUrl } from './leads';
import { expireCheckoutSession, getStripe } from './stripe';
import { hoursAgoIso } from './autopilot-rules';

export const AUTO_BUY_ACTOR = 'auto-buy';

export type AutoUnlockResult =
  | { status: 'unlocked'; paymentIntentId: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

function stripeConfigured(): boolean {
  return !!(env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY;
}

export function canAutoBuy(op: Operator): boolean {
  return (
    op.claimStatus === 'approved' &&
    op.autoUnlockEnabled &&
    !!op.stripeCustomerId &&
    !!op.stripePaymentMethodId
  );
}

export async function autoBuysThisWeek(db: AppDb, operatorId: string): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)` })
    .from(leads)
    .where(
      and(
        eq(leads.operatorId, operatorId),
        eq(leads.passedBy, AUTO_BUY_ACTOR),
        gte(leads.unlockedAt, hoursAgoIso(24 * 7)),
      ),
    );
  return row?.c ?? 0;
}

async function pauseAutoBuy(db: AppDb, op: Operator, reason: string, lead: Lead): Promise<void> {
  await db
    .update(operators)
    .set({ autoUnlockEnabled: false, updatedAt: new Date().toISOString() })
    .where(eq(operators.id, op.id));
  await sendAutoBuyPaused({
    operatorName: op.name,
    operatorEmail: op.email,
    reason,
    portalUrl: `${siteUrl()}/portal/leads`,
    refs: { leadId: leadTagId(lead), operatorId: op.id },
  });
  await logAudit(db, {
    action: 'auto_buy_paused',
    entityType: 'operator',
    entityId: op.id,
    actor: 'autopilot',
    notes: reason,
  });
}

function stripeErrorReason(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { decline_code?: string; code?: string; message?: string };
    return e.decline_code || e.code || e.message || 'card error';
  }
  return 'card error';
}

/**
 * Charge an opted-in operator's saved card off-session and unlock an offered lead.
 * Idempotent per lead+operator+price (Stripe idempotency key); refunds if the lead
 * changed hands between the charge and the unlock.
 */
export async function tryAutoUnlock(db: AppDb, leadId: string): Promise<AutoUnlockResult> {
  if (!stripeConfigured()) return { status: 'skipped', reason: 'stripe not configured' };

  const lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!lead || lead.status !== 'offered' || !lead.operatorId) {
    return { status: 'skipped', reason: 'lead not offered' };
  }
  const op = await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) });
  if (!op || !canAutoBuy(op)) return { status: 'skipped', reason: 'operator not on auto-buy' };
  if ((await autoBuysThisWeek(db, op.id)) >= op.autoUnlockWeeklyCap) {
    return { status: 'skipped', reason: 'weekly cap reached' };
  }

  const stripe = getStripe();
  const price = priceForLead(lead);
  let pi: Stripe.PaymentIntent;
  try {
    pi = await stripe.paymentIntents.create(
      {
        amount: price,
        currency: 'usd',
        customer: op.stripeCustomerId!,
        payment_method: op.stripePaymentMethodId!,
        payment_method_types: ['card'],
        off_session: true,
        confirm: true,
        description: `Dumpster lead auto-buy — ${lead.addressOrZip ?? lead.id}`,
        metadata: { leadId: lead.id, operatorId: op.id, kind: 'auto_unlock', priceCents: String(price) },
      },
      { idempotencyKey: `auto-unlock:${lead.id}:${op.id}:${price}` },
    );
  } catch (err) {
    const reason = stripeErrorReason(err);
    console.warn('[auto-buy] charge failed', op.id, lead.id, reason);
    await pauseAutoBuy(db, op, reason, lead);
    return { status: 'failed', reason };
  }

  if (pi.status !== 'succeeded') {
    try {
      await stripe.paymentIntents.cancel(pi.id);
    } catch {
      // Already terminal; nothing to release.
    }
    await pauseAutoBuy(db, op, `payment ${pi.status}`, lead);
    return { status: 'failed', reason: `payment ${pi.status}` };
  }

  const now = new Date().toISOString();
  const unlocked = await db
    .update(leads)
    .set({
      status: 'unlocked',
      unlockMethod: 'paid',
      unlockedAt: now,
      passedBy: AUTO_BUY_ACTOR,
      stripePaymentIntentId: pi.id,
    })
    .where(and(eq(leads.id, lead.id), eq(leads.status, 'offered'), eq(leads.operatorId, op.id)))
    .returning();

  if (unlocked.length === 0) {
    const again = await db.query.leads.findFirst({ where: eq(leads.id, lead.id) });
    if (again?.stripePaymentIntentId === pi.id) {
      return { status: 'unlocked', paymentIntentId: pi.id };
    }
    // Lead moved on between charge and unlock: give the money back.
    try {
      await stripe.refunds.create({ payment_intent: pi.id }, { idempotencyKey: `auto-unlock-refund:${pi.id}` });
    } catch (err) {
      console.error('[auto-buy] refund failed', pi.id, err);
    }
    return { status: 'skipped', reason: 'lead changed during charge (refunded)' };
  }

  if (lead.stripeCheckoutSessionId) {
    await expireCheckoutSession(lead.stripeCheckoutSessionId);
  }

  await sendLeadUnlocked({
    operatorName: op.name,
    operatorEmail: op.email,
    ...leadPayloadFromRow(unlocked[0]),
    unlockMethod: 'paid',
    refs: { leadId: leadTagId(unlocked[0]), operatorId: op.id },
  });
  await logAudit(db, {
    action: 'lead_unlock_auto_buy',
    entityType: 'lead',
    entityId: lead.id,
    actor: 'autopilot',
    notes: `PaymentIntent ${pi.id} for ${op.name} (${op.id})`,
  });
  return { status: 'unlocked', paymentIntentId: pi.id };
}

/**
 * After a paid Checkout, remember the card so the operator can switch on auto-buy.
 * Only cards are kept (bank debits settle asynchronously and cannot unlock instantly).
 */
export async function saveCardFromCheckout(
  db: AppDb,
  session: Stripe.Checkout.Session,
  operatorId: string,
): Promise<void> {
  const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  if (!piId || !customerId) return;
  try {
    const pi = await getStripe().paymentIntents.retrieve(piId, { expand: ['payment_method'] });
    const pm = pi.payment_method;
    if (!pm || typeof pm === 'string' || pm.type !== 'card' || !pm.card) return;
    if (pi.setup_future_usage !== 'off_session') return;
    const brand = pm.card.brand ? pm.card.brand[0].toUpperCase() + pm.card.brand.slice(1) : 'Card';
    await db
      .update(operators)
      .set({
        stripeCustomerId: customerId,
        stripePaymentMethodId: pm.id,
        stripePaymentMethodLabel: `${brand} •••• ${pm.card.last4}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(operators.id, operatorId));
  } catch (err) {
    console.warn('[auto-buy] could not save card from checkout', session.id, err);
  }
}
