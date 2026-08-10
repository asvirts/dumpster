import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import type { AppDb } from './db';
import { leads, operators, type Lead, type Operator } from './schema';
import { logAudit } from './admin';
import {
  sendLeadOffer,
  sendLeadUnlocked,
} from './email';
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

export async function unlockLeadComplimentary(
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

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, opts.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };
  if ((op.complimentaryLeadsRemaining ?? 0) < 1) {
    return { ok: false, error: 'No complimentary leads remaining for this operator' };
  }

  const now = new Date().toISOString();
  await db
    .update(leads)
    .set({
      operatorId: opts.operatorId,
      status: 'unlocked',
      unlockMethod: 'complimentary',
      unlockedAt: now,
      passedBy: opts.actor ?? null,
    })
    .where(eq(leads.id, opts.leadId));

  const remaining = Math.max(0, (op.complimentaryLeadsRemaining ?? 0) - 1);
  await db
    .update(operators)
    .set({
      complimentaryLeadsRemaining: remaining,
      updatedAt: now,
    })
    .where(eq(operators.id, opts.operatorId));

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

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, opts.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  const now = new Date().toISOString();
  await db
    .update(leads)
    .set({
      operatorId: opts.operatorId,
      status: 'offered',
      offeredAt: now,
      passedBy: opts.actor ?? null,
    })
    .where(eq(leads.id, opts.leadId));

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

export async function unlockLeadPaid(
  db: AppDb,
  opts: {
    leadId: string;
    stripeCheckoutSessionId: string;
    stripeCustomerId?: string | null;
  },
): Promise<{ ok: true; operator: Operator; lead: Lead } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };
  if (lead.status === 'unlocked') {
    const op = await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) });
    if (!op) return { ok: false, error: 'Operator not found' };
    return { ok: true, operator: op, lead };
  }

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, lead.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  const now = new Date().toISOString();
  await db
    .update(leads)
    .set({
      status: 'unlocked',
      unlockMethod: 'paid',
      unlockedAt: now,
      stripeCheckoutSessionId: opts.stripeCheckoutSessionId,
    })
    .where(eq(leads.id, opts.leadId));

  if (opts.stripeCustomerId && !op.stripeCustomerId) {
    await db
      .update(operators)
      .set({ stripeCustomerId: opts.stripeCustomerId, updatedAt: now })
      .where(eq(operators.id, op.id));
  }

  const refreshed = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!refreshed) return { ok: false, error: 'Lead missing after unlock' };

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
