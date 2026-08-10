import { env } from 'cloudflare:workers';
import { and, eq, gt, inArray, sql } from 'drizzle-orm';
import type { AppDb } from './db';
import { leads, operators, type Lead, type Operator } from './schema';
import { logAudit } from './admin';
import { sendLeadOffer, sendLeadUnlocked } from './email';
import { DEFAULT_LEAD_PRICE_CENTS } from './constants';

export function leadPriceCents(): number {
  const raw = (env as { LEAD_PRICE_CENTS?: string }).LEAD_PRICE_CENTS;
  const n = raw ? Number(raw) : DEFAULT_LEAD_PRICE_CENTS;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_LEAD_PRICE_CENTS;
}

export function siteUrl(): string {
  return (
    (env as { PUBLIC_SITE_URL?: string }).PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://findadumpster.net'
  );
}

export type LeadPayload = {
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string | null;
  projectSize?: string | null;
  material?: string | null;
  addressOrZip?: string | null;
  timeline?: string | null;
  notes?: string | null;
};

function leadPayloadFromRow(lead: Lead): LeadPayload {
  return {
    seekerName: lead.seekerName,
    seekerEmail: lead.seekerEmail,
    seekerPhone: lead.seekerPhone,
    projectSize: lead.projectSize,
    material: lead.material,
    addressOrZip: lead.addressOrZip,
    timeline: lead.timeline,
    notes: lead.notes,
  };
}

/**
 * Complimentary unlock.
 *
 * - Portal / operator path (allowReassign=false, default): lead must already be
 *   assigned to this operator and status must be `offered`. Prevents IDOR theft.
 * - Admin path (allowReassign=true): may reassign from `new`/`offered` to the target operator.
 *
 * Uses compare-and-swap updates so concurrent unlocks cannot double-spend free credits.
 */
export async function unlockLeadComplimentary(
  db: AppDb,
  opts: {
    leadId: string;
    operatorId: string;
    actor?: string | null;
    /** Admin-only: reassign lead to operatorId. Portal must leave false. */
    allowReassign?: boolean;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const allowReassign = opts.allowReassign === true;

  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };
  if (lead.status === 'unlocked') return { ok: false, error: 'Lead already unlocked' };
  if (lead.status === 'closed') return { ok: false, error: 'Lead is closed' };

  if (!allowReassign) {
    if (lead.operatorId !== opts.operatorId) {
      return { ok: false, error: 'Lead is not available to unlock.' };
    }
    if (lead.status !== 'offered') {
      return { ok: false, error: 'Lead is not available to unlock.' };
    }
  } else if (lead.status !== 'new' && lead.status !== 'offered') {
    return { ok: false, error: 'Lead cannot be unlocked in its current status' };
  }

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, opts.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  // 1) Atomically consume one complimentary credit
  const now = new Date().toISOString();
  const dec = await db
    .update(operators)
    .set({
      complimentaryLeadsRemaining: sql`max(0, ${operators.complimentaryLeadsRemaining} - 1)`,
      updatedAt: now,
    })
    .where(
      and(
        eq(operators.id, opts.operatorId),
        gt(operators.complimentaryLeadsRemaining, 0),
      ),
    )
    .returning({ id: operators.id });

  if (dec.length === 0) {
    return { ok: false, error: 'No complimentary leads remaining for this operator' };
  }

  // 2) CAS unlock the lead (only from allowed status / ownership)
  const unlockWhere = allowReassign
    ? and(eq(leads.id, opts.leadId), inArray(leads.status, ['new', 'offered']))
    : and(
        eq(leads.id, opts.leadId),
        eq(leads.operatorId, opts.operatorId),
        eq(leads.status, 'offered'),
      );

  const unlocked = await db
    .update(leads)
    .set({
      operatorId: opts.operatorId,
      status: 'unlocked',
      unlockMethod: 'complimentary',
      unlockedAt: now,
      passedBy: opts.actor ?? null,
    })
    .where(unlockWhere)
    .returning({ id: leads.id });

  if (unlocked.length === 0) {
    // Refund complimentary credit if lead race lost
    await db
      .update(operators)
      .set({
        complimentaryLeadsRemaining: sql`${operators.complimentaryLeadsRemaining} + 1`,
        updatedAt: now,
      })
      .where(eq(operators.id, opts.operatorId));
    return { ok: false, error: 'Lead is not available to unlock.' };
  }

  await sendLeadUnlocked({
    operatorName: op.name,
    operatorEmail: op.email,
    ...leadPayloadFromRow(lead),
    unlockMethod: 'complimentary',
  });

  await logAudit(db, {
    action: 'lead_unlock_complimentary',
    entityType: 'lead',
    entityId: opts.leadId,
    actor: opts.actor,
    notes: `Unlocked for operator ${op.name} (${op.id})`,
  });

  return { ok: true };
}

export async function offerLead(
  db: AppDb,
  opts: {
    leadId: string;
    operatorId: string;
    actor?: string | null;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };
  if (lead.status === 'unlocked') return { ok: false, error: 'Lead already unlocked' };
  if (lead.status === 'closed') return { ok: false, error: 'Lead is closed' };
  if (lead.status !== 'new' && lead.status !== 'offered') {
    return { ok: false, error: 'Lead cannot be offered in its current status' };
  }

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, opts.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  const now = new Date().toISOString();
  const updated = await db
    .update(leads)
    .set({
      operatorId: opts.operatorId,
      status: 'offered',
      offeredAt: now,
      passedBy: opts.actor ?? null,
    })
    .where(and(eq(leads.id, opts.leadId), inArray(leads.status, ['new', 'offered'])))
    .returning({ id: leads.id });

  if (updated.length === 0) {
    return { ok: false, error: 'Lead is not available to offer' };
  }

  const portalUrl = `${siteUrl()}/portal/leads`;
  const claimUrl = `${siteUrl()}/operator/${op.slug}`;
  await sendLeadOffer({
    operatorName: op.name,
    operatorEmail: op.email,
    seekerName: lead.seekerName,
    projectSize: lead.projectSize,
    material: lead.material,
    addressOrZip: lead.addressOrZip,
    portalUrl,
    claimUrl: op.claimStatus === 'approved' ? portalUrl : claimUrl,
    isClaimed: op.claimStatus === 'approved',
    priceCents: leadPriceCents(),
  });

  await logAudit(db, {
    action: 'lead_offer',
    entityType: 'lead',
    entityId: opts.leadId,
    actor: opts.actor,
    notes: `Offered to operator ${op.name} (${op.id})`,
  });

  return { ok: true };
}

/**
 * Paid unlock from Stripe webhook. Idempotent when already unlocked for the same session.
 * Binds payment to the expected operator, stored checkout session, and offered status.
 */
export async function unlockLeadPaid(
  db: AppDb,
  opts: {
    leadId: string;
    operatorId?: string | null;
    stripeCheckoutSessionId: string;
    stripeCustomerId?: string | null;
    /** Checkout amount_total in cents; must match current lead price when provided. */
    amountTotal?: number | null;
  },
): Promise<{ ok: true; operator: Operator; lead: Lead } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };

  if (lead.status === 'unlocked') {
    // Idempotent success only when this session (or unknown prior) already unlocked it
    if (
      lead.stripeCheckoutSessionId &&
      lead.stripeCheckoutSessionId !== opts.stripeCheckoutSessionId
    ) {
      return { ok: false, error: 'Lead already unlocked by a different checkout session' };
    }
    const op = await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) });
    if (!op) return { ok: false, error: 'Operator not found' };
    return { ok: true, operator: op, lead };
  }

  if (lead.status !== 'offered') {
    return { ok: false, error: `Lead is not offered (status=${lead.status})` };
  }

  if (opts.operatorId && lead.operatorId !== opts.operatorId) {
    return { ok: false, error: 'Checkout operator does not match lead assignment' };
  }

  if (
    lead.stripeCheckoutSessionId &&
    lead.stripeCheckoutSessionId !== opts.stripeCheckoutSessionId
  ) {
    return { ok: false, error: 'Checkout session does not match lead' };
  }

  if (opts.amountTotal != null) {
    const expected = leadPriceCents();
    if (opts.amountTotal !== expected) {
      return {
        ok: false,
        error: `Payment amount ${opts.amountTotal} does not match lead price ${expected}`,
      };
    }
  }

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, lead.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  const now = new Date().toISOString();
  const unlocked = await db
    .update(leads)
    .set({
      status: 'unlocked',
      unlockMethod: 'paid',
      unlockedAt: now,
      stripeCheckoutSessionId: opts.stripeCheckoutSessionId,
    })
    .where(
      and(
        eq(leads.id, opts.leadId),
        eq(leads.status, 'offered'),
        eq(leads.operatorId, lead.operatorId),
      ),
    )
    .returning();

  if (unlocked.length === 0) {
    // Concurrent unlock — re-read for idempotency
    const again = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
    if (again?.status === 'unlocked') {
      return { ok: true, operator: op, lead: again };
    }
    return { ok: false, error: 'Lead unlock race lost' };
  }

  if (opts.stripeCustomerId && !op.stripeCustomerId) {
    await db
      .update(operators)
      .set({ stripeCustomerId: opts.stripeCustomerId, updatedAt: now })
      .where(eq(operators.id, op.id));
  }

  const refreshed = unlocked[0];

  await sendLeadUnlocked({
    operatorName: op.name,
    operatorEmail: op.email,
    ...leadPayloadFromRow(refreshed),
    unlockMethod: 'paid',
  });

  await logAudit(db, {
    action: 'lead_unlock_paid',
    entityType: 'lead',
    entityId: opts.leadId,
    actor: 'stripe',
    notes: `Checkout ${opts.stripeCheckoutSessionId}`,
  });

  return { ok: true, operator: op, lead: refreshed };
}
