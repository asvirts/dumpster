import { env } from 'cloudflare:workers';
import { and, eq, gt, gte, inArray, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { AppDb } from './db';
import { events, leads, operators, type Lead, type NewLead, type Operator } from './schema';
import { logAudit } from './admin';
import { sendAdminLeadAlert, sendLeadOffer, sendLeadUnlocked, sendSeekerConfirmation } from './email';
import { DEFAULT_LEAD_PRICE_CENTS, MAX_MATCH_OFFERS } from './constants';
import { emptyToNull, qualificationFromInput } from './lead-fields';
import { decidePaidUnlock } from './paid-unlock';

export function leadPriceCents(): number {
  const raw = (env as { LEAD_PRICE_CENTS?: string }).LEAD_PRICE_CENTS;
  const n = raw ? Number(raw) : DEFAULT_LEAD_PRICE_CENTS;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_LEAD_PRICE_CENTS;
}

export function priceForLead(lead: Pick<Lead, 'priceCents'>): number {
  return lead.priceCents && lead.priceCents > 0 ? lead.priceCents : leadPriceCents();
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
  preferredContact?: string | null;
  budgetRange?: string | null;
};

export function leadPayloadFromRow(lead: Lead): LeadPayload {
  return {
    seekerName: lead.seekerName,
    seekerEmail: lead.seekerEmail,
    seekerPhone: lead.seekerPhone,
    projectSize: lead.projectSize,
    material: lead.material,
    addressOrZip: lead.addressOrZip,
    timeline: lead.timeline,
    notes: lead.notes,
    preferredContact: lead.preferredContact,
    budgetRange: lead.budgetRange,
  };
}

const RATE_EMAIL_PER_HOUR = 5;
const RATE_IP_PER_HOUR = 8;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function hashSeekerIp(ip: string | null | undefined): Promise<string | null> {
  if (!ip || ip === 'unknown') return null;
  const salt = (env as { LEAD_IP_SALT?: string }).LEAD_IP_SALT ?? 'findadumpster-lead';
  const data = new TextEncoder().encode(`${salt}:${ip.trim()}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function clientIpFromRequest(request: Request): string | null {
  const cf = request.headers.get('CF-Connecting-IP')?.trim();
  if (cf) return cf;
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || null;
}

async function recordEvent(
  db: AppDb,
  type: string,
  path: string | null,
  payload: Record<string, unknown>,
) {
  await db.insert(events).values({
    id: nanoid(),
    type,
    path,
    queryJson: JSON.stringify(payload),
  });
}

export type CreateHeldLeadInput = {
  mode: 'direct' | 'match';
  operatorId?: string | null;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  projectSize?: string | null;
  material?: string | null;
  addressOrZip?: string | null;
  timeline?: string | null;
  notes?: string | null;
  preferredContact?: string | null;
  budgetRange?: string | null;
  howFound?: string | null;
  sourcePath?: string | null;
  sourceCityId?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
  ip?: string | null;
};

export type CreateHeldLeadResult =
  | { ok: true; leadId: string; duplicate: boolean }
  | { ok: false; error: string; code: 'NOT_FOUND' | 'TOO_MANY_REQUESTS' | 'BAD_REQUEST' };

function hoursAgoIso(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

async function isRateLimited(
  db: AppDb,
  email: string,
  ipHash: string | null,
): Promise<boolean> {
  const since = hoursAgoIso(1);
  const [emailRow] = await db
    .select({ c: sql<number>`count(*)` })
    .from(leads)
    .where(and(eq(leads.seekerEmail, email), gte(leads.createdAt, since)));
  if ((emailRow?.c ?? 0) >= RATE_EMAIL_PER_HOUR) return true;

  if (ipHash) {
    const [ipRow] = await db
      .select({ c: sql<number>`count(*)` })
      .from(leads)
      .where(and(eq(leads.seekerIpHash, ipHash), gte(leads.createdAt, since)));
    if ((ipRow?.c ?? 0) >= RATE_IP_PER_HOUR) return true;
  }
  return false;
}

async function findDuplicate(
  db: AppDb,
  input: CreateHeldLeadInput,
): Promise<Lead | null> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const email = input.seekerEmail.toLowerCase();

  if (input.mode === 'direct' && input.operatorId) {
    const row = await db.query.leads.findFirst({
      where: and(
        eq(leads.seekerEmail, email),
        or(eq(leads.operatorId, input.operatorId), eq(leads.requestedOperatorId, input.operatorId)),
        gte(leads.createdAt, since),
        inArray(leads.status, ['new', 'offered', 'unlocked']),
      ),
    });
    return row ?? null;
  }

  const conditions = [
    eq(leads.seekerEmail, email),
    eq(leads.mode, 'match'),
    gte(leads.createdAt, since),
    inArray(leads.status, ['new', 'offered', 'unlocked']),
  ];
  if (input.sourceCityId) {
    conditions.push(eq(leads.sourceCityId, input.sourceCityId));
  } else if (input.addressOrZip) {
    conditions.push(eq(leads.addressOrZip, input.addressOrZip));
  }
  const row = await db.query.leads.findFirst({ where: and(...conditions) });
  return row ?? null;
}

/**
 * Store a held lead. Operators are never emailed here — admin routes later.
 * Duplicate submissions within 24h return the existing row as success.
 */
export async function createHeldLead(
  db: AppDb,
  input: CreateHeldLeadInput,
): Promise<CreateHeldLeadResult> {
  const email = input.seekerEmail.trim().toLowerCase();
  const name = input.seekerName.trim();
  if (!name || !email) {
    return { ok: false, error: 'Name and email are required.', code: 'BAD_REQUEST' };
  }

  let operator: Operator | null = null;
  if (input.mode === 'direct') {
    if (!input.operatorId) {
      return { ok: false, error: 'Operator is required.', code: 'BAD_REQUEST' };
    }
    operator = (await db.query.operators.findFirst({
      where: eq(operators.id, input.operatorId),
    })) ?? null;
    if (!operator || !operator.isPublished) {
      return { ok: false, error: 'Operator not found or not available for quotes.', code: 'NOT_FOUND' };
    }
  }

  const ipHash = await hashSeekerIp(input.ip);
  if (await isRateLimited(db, email, ipHash)) {
    return {
      ok: false,
      error: 'Too many quote requests. Please wait and try again.',
      code: 'TOO_MANY_REQUESTS',
    };
  }

  const dup = await findDuplicate(db, { ...input, seekerEmail: email });
  if (dup) {
    await recordEvent(db, 'quote_duplicate', input.sourcePath ?? null, {
      leadId: dup.id,
      mode: input.mode,
    });
    return { ok: true, leadId: dup.id, duplicate: true };
  }

  const leadId = nanoid();
  const values: NewLead = {
    id: leadId,
    operatorId: input.mode === 'direct' ? input.operatorId! : null,
    requestedOperatorId: input.mode === 'direct' ? input.operatorId! : null,
    seekerName: name,
    seekerEmail: email,
    seekerPhone: input.seekerPhone.trim(),
    projectSize: emptyToNull(input.projectSize) ?? null,
    material: emptyToNull(input.material) ?? null,
    addressOrZip: emptyToNull(input.addressOrZip) ?? null,
    timeline: emptyToNull(input.timeline) ?? null,
    notes: emptyToNull(input.notes) ?? null,
    status: 'new',
    mode: input.mode,
    sourcePath: emptyToNull(input.sourcePath) ?? null,
    sourceCityId: emptyToNull(input.sourceCityId) ?? null,
    utmSource: emptyToNull(input.utmSource) ?? null,
    utmMedium: emptyToNull(input.utmMedium) ?? null,
    utmCampaign: emptyToNull(input.utmCampaign) ?? null,
    utmContent: emptyToNull(input.utmContent) ?? null,
    utmTerm: emptyToNull(input.utmTerm) ?? null,
    referrer: emptyToNull(input.referrer) ?? null,
    preferredContact: emptyToNull(input.preferredContact) ?? 'phone',
    budgetRange: emptyToNull(input.budgetRange) ?? null,
    howFound: emptyToNull(input.howFound) ?? null,
    qualificationJson: qualificationFromInput(input),
    seekerIpHash: ipHash,
    groupId: leadId,
  };

  await db.insert(leads).values(values);

  const payload = leadPayloadFromRow(values as Lead);
  await sendAdminLeadAlert({
    ...payload,
    operatorName: operator?.name ?? 'Match request (unassigned)',
    leadId,
    adminUrl: `${siteUrl()}/admin/leads/${leadId}`,
    mode: input.mode,
  });
  await sendSeekerConfirmation({
    seekerName: name,
    seekerEmail: email,
    operatorName: operator?.name ?? null,
    mode: input.mode,
  });

  await recordEvent(db, input.mode === 'match' ? 'quote_submit_match' : 'quote_submit', input.sourcePath ?? null, {
    leadId,
    operatorId: operator?.id ?? null,
    mode: input.mode,
  });

  return { ok: true, leadId, duplicate: false };
}

async function groupLeads(db: AppDb, groupId: string): Promise<Lead[]> {
  return db.select().from(leads).where(eq(leads.groupId, groupId));
}

function cloneValues(source: Lead, cloneId: string, operatorId: string): NewLead {
  return {
    id: cloneId,
    operatorId,
    requestedOperatorId: source.requestedOperatorId,
    seekerName: source.seekerName,
    seekerEmail: source.seekerEmail,
    seekerPhone: source.seekerPhone,
    projectSize: source.projectSize,
    material: source.material,
    addressOrZip: source.addressOrZip,
    timeline: source.timeline,
    notes: source.notes,
    status: 'new',
    mode: source.mode,
    sourcePath: source.sourcePath,
    sourceCityId: source.sourceCityId,
    utmSource: source.utmSource,
    utmMedium: source.utmMedium,
    utmCampaign: source.utmCampaign,
    utmContent: source.utmContent,
    utmTerm: source.utmTerm,
    referrer: source.referrer,
    preferredContact: source.preferredContact,
    budgetRange: source.budgetRange,
    howFound: source.howFound,
    qualificationJson: source.qualificationJson,
    seekerIpHash: source.seekerIpHash,
    groupId: source.groupId ?? source.id,
    priceCents: source.priceCents,
  };
}

/**
 * Route a held lead to an operator (admin).
 * Direct leads reassign the same row. Match leads clone up to MAX_MATCH_OFFERS.
 */
export async function routeLeadToOperator(
  db: AppDb,
  opts: {
    leadId: string;
    operatorId: string;
    action: 'offer' | 'complimentary';
    actor?: string | null;
  },
): Promise<{ ok: true; leadId: string } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };
  if (lead.status === 'unlocked') return { ok: false, error: 'Lead already unlocked' };
  if (lead.status === 'closed' || lead.status === 'spam' || lead.status === 'invalid') {
    return { ok: false, error: 'Lead is closed' };
  }

  let targetId = lead.id;
  const groupId = lead.groupId || lead.id;
  if (!lead.groupId) {
    await db.update(leads).set({ groupId }).where(eq(leads.id, lead.id));
  }

  const siblings = await groupLeads(db, groupId);
  const already = siblings.find((s) => s.operatorId === opts.operatorId);
  if (already && already.id !== lead.id) {
    return { ok: false, error: 'Already routed to this operator' };
  }

  const needsClone =
    lead.mode === 'match' &&
    !!lead.operatorId &&
    lead.operatorId !== opts.operatorId;

  if (needsClone) {
    const assigned = siblings.filter((s) => s.operatorId).length;
    if (assigned >= MAX_MATCH_OFFERS) {
      return { ok: false, error: `Maximum of ${MAX_MATCH_OFFERS} operators per request` };
    }
    const cloneId = nanoid();
    await db.insert(leads).values(cloneValues(lead, cloneId, opts.operatorId));
    targetId = cloneId;
  }

  if (opts.action === 'complimentary') {
    const result = await unlockLeadComplimentary(db, {
      leadId: targetId,
      operatorId: opts.operatorId,
      actor: opts.actor,
      allowReassign: true,
    });
    if (!result.ok) return result;
    return { ok: true, leadId: targetId };
  }

  const result = await offerLead(db, {
    leadId: targetId,
    operatorId: opts.operatorId,
    actor: opts.actor,
  });
  if (!result.ok) return result;
  return { ok: true, leadId: targetId };
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
  if (lead.status === 'closed' || lead.status === 'spam' || lead.status === 'invalid') {
    return { ok: false, error: 'Lead is closed' };
  }

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
      priceCents: lead.priceCents ?? leadPriceCents(),
    })
    .where(unlockWhere)
    .returning({ id: leads.id });

  if (unlocked.length === 0) {
    await db
      .update(operators)
      .set({
        complimentaryLeadsRemaining: sql`${operators.complimentaryLeadsRemaining} + 1`,
        updatedAt: now,
      })
      .where(eq(operators.id, opts.operatorId));
    return { ok: false, error: 'Lead is not available to unlock.' };
  }

  if (lead.stripeCheckoutSessionId) {
    const { expireCheckoutSession } = await import('./stripe');
    await expireCheckoutSession(lead.stripeCheckoutSessionId);
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
  if (lead.status === 'closed' || lead.status === 'spam' || lead.status === 'invalid') {
    return { ok: false, error: 'Lead is closed' };
  }
  if (lead.status !== 'new' && lead.status !== 'offered') {
    return { ok: false, error: 'Lead cannot be offered in its current status' };
  }

  const op = await db.query.operators.findFirst({
    where: eq(operators.id, opts.operatorId),
  });
  if (!op) return { ok: false, error: 'Operator not found' };

  const now = new Date().toISOString();
  const price = lead.priceCents ?? leadPriceCents();
  const reassigned = !!lead.operatorId && lead.operatorId !== opts.operatorId;
  if (reassigned && lead.stripeCheckoutSessionId) {
    const { expireCheckoutSession } = await import('./stripe');
    await expireCheckoutSession(lead.stripeCheckoutSessionId);
  }
  const updated = await db
    .update(leads)
    .set({
      operatorId: opts.operatorId,
      status: 'offered',
      offeredAt: now,
      passedBy: opts.actor ?? null,
      priceCents: price,
      ...(reassigned ? { stripeCheckoutSessionId: null } : {}),
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
    priceCents: price,
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

export async function resendLeadOffer(
  db: AppDb,
  opts: { leadId: string; actor?: string | null },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };
  if (lead.status !== 'offered' || !lead.operatorId) {
    return { ok: false, error: 'Lead is not currently offered to an operator' };
  }
  return offerLead(db, {
    leadId: lead.id,
    operatorId: lead.operatorId,
    actor: opts.actor,
  });
}

/**
 * Paid unlock from Stripe webhook or success-url retrieve.
 * Idempotent when already unlocked for the same session. A still-offered lead
 * can be unlocked by any paid session for this lead+operator at the frozen price.
 */
export async function unlockLeadPaid(
  db: AppDb,
  opts: {
    leadId: string;
    operatorId?: string | null;
    stripeCheckoutSessionId: string;
    stripeCustomerId?: string | null;
    /** Checkout amount_total in cents; must match frozen or current lead price when provided. */
    amountTotal?: number | null;
  },
): Promise<{ ok: true; operator: Operator; lead: Lead } | { ok: false; error: string }> {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, opts.leadId) });
  if (!lead) return { ok: false, error: 'Lead not found' };

  const decision = decidePaidUnlock(lead, {
    operatorId: opts.operatorId,
    stripeCheckoutSessionId: opts.stripeCheckoutSessionId,
    amountTotal: opts.amountTotal,
    expectedPriceCents: priceForLead(lead),
  });

  if (decision.action === 'reject') {
    return { ok: false, error: decision.error };
  }

  if (decision.action === 'already_unlocked') {
    const op = lead.operatorId
      ? await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) })
      : null;
    if (!op) return { ok: false, error: 'Operator not found' };
    return { ok: true, operator: op, lead };
  }

  if (!lead.operatorId) return { ok: false, error: 'Operator not found' };

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

export function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
