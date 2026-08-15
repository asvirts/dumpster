import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import type { AppDb } from './db';
import { priceForLead, siteUrl, unlockLeadPaid } from './leads';
import { leads, type Lead, type Operator } from './schema';
import {
  checkoutIntegrationIdentifier,
  expireCheckoutSession,
  getStripe,
  isMissingStripeCustomer,
} from './stripe';

export type CheckoutCreateResult =
  | { ok: true; url: string; sessionId: string; reused: boolean }
  | { ok: false; error: string };

export type FulfillResult =
  | { ok: true; skipped?: boolean; pending?: boolean }
  | { ok: false; error: string };

function sessionCustomerId(session: Stripe.Checkout.Session): string | null {
  if (typeof session.customer === 'string') return session.customer;
  return session.customer?.id ?? null;
}

/**
 * Reuse an open Checkout Session when possible; otherwise expire the stale one
 * and create a new hosted session for this lead.
 */
export async function createLeadUnlockCheckout(
  db: AppDb,
  opts: {
    lead: Lead;
    operator: Operator;
    clerkOrgId: string;
  },
): Promise<CheckoutCreateResult> {
  const { lead, operator, clerkOrgId } = opts;
  if (lead.status !== 'offered' || lead.operatorId !== operator.id) {
    return { ok: false, error: 'Lead is not available to purchase.' };
  }

  const stripe = getStripe();
  const price = priceForLead(lead);
  const base = siteUrl();

  if (lead.stripeCheckoutSessionId) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(lead.stripeCheckoutSessionId);
      if (
        existing.status === 'open' &&
        existing.url &&
        existing.metadata?.leadId === lead.id &&
        existing.metadata?.operatorId === operator.id &&
        (existing.amount_total == null || existing.amount_total === price)
      ) {
        return { ok: true, url: existing.url, sessionId: existing.id, reused: true };
      }
      if (existing.status === 'open') {
        await expireCheckoutSession(existing.id);
      }
    } catch (err) {
      console.warn('[stripe] retrieve existing checkout failed', err);
    }
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    customer: operator.stripeCustomerId || undefined,
    customer_email: operator.stripeCustomerId ? undefined : operator.email || undefined,
    client_reference_id: lead.id,
    integration_identifier: checkoutIntegrationIdentifier(),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: price,
          product_data: {
            name: `Dumpster lead — ${lead.seekerName}`,
            description:
              [lead.projectSize, lead.material, lead.addressOrZip].filter(Boolean).join(' · ') ||
              'Quote lead unlock',
          },
        },
      },
    ],
    metadata: {
      leadId: lead.id,
      operatorId: operator.id,
      clerkOrgId,
      priceCents: String(price),
    },
    success_url: `${base}/portal/leads?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/portal/leads?canceled=1`,
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(params);
  } catch (err) {
    if (params.customer && isMissingStripeCustomer(err)) {
      session = await stripe.checkout.sessions.create({
        ...params,
        customer: undefined,
        customer_email: operator.email || undefined,
      });
    } else {
      console.error('[stripe] checkout create failed', err);
      return { ok: false, error: 'Checkout unavailable.' };
    }
  }

  if (!session.url) {
    return { ok: false, error: 'Checkout failed.' };
  }

  await db
    .update(leads)
    .set({ stripeCheckoutSessionId: session.id })
    .where(eq(leads.id, lead.id));

  return { ok: true, url: session.url, sessionId: session.id, reused: false };
}

export async function fulfillPaidCheckoutSession(
  db: AppDb,
  session: Stripe.Checkout.Session,
  opts?: { expectedOperatorId?: string },
): Promise<FulfillResult> {
  const leadId = session.metadata?.leadId;
  if (!leadId || (session.mode && session.mode !== 'payment')) {
    return { ok: true, skipped: true };
  }

  const operatorId = session.metadata?.operatorId;
  if (opts?.expectedOperatorId && operatorId && operatorId !== opts.expectedOperatorId) {
    return { ok: false, error: 'Checkout does not belong to this operator.' };
  }

  if (session.status === 'open') {
    return { ok: false, error: 'Checkout is not complete yet.' };
  }

  if (session.payment_status !== 'paid') {
    if (session.status === 'complete') {
      return { ok: true, pending: true };
    }
    return { ok: false, error: 'Payment was not completed.' };
  }

  const result = await unlockLeadPaid(db, {
    leadId,
    operatorId: operatorId || null,
    stripeCheckoutSessionId: session.id,
    stripeCustomerId: sessionCustomerId(session),
    amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null,
  });

  if (!result.ok) return result;
  return { ok: true };
}

export async function fulfillCheckoutSessionById(
  db: AppDb,
  sessionId: string,
  expectedOperatorId?: string,
): Promise<FulfillResult> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return fulfillPaidCheckoutSession(db, session, { expectedOperatorId });
  } catch (err) {
    console.error('[stripe] retrieve checkout for fulfill failed', err);
    return { ok: false, error: 'Could not verify checkout session.' };
  }
}

export async function releaseLeadCheckout(
  db: AppDb,
  lead: Pick<Lead, 'id' | 'stripeCheckoutSessionId'>,
): Promise<void> {
  if (!lead.stripeCheckoutSessionId) return;
  await expireCheckoutSession(lead.stripeCheckoutSessionId);
  await db.update(leads).set({ stripeCheckoutSessionId: null }).where(eq(leads.id, lead.id));
}
