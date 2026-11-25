import { and, desc, eq, gte, inArray, isNull, lt, ne, or, sql } from 'drizzle-orm';
import type { AppDb } from './db';
import { cities, leads, operatorServiceAreas, operators, type Lead, type Operator } from './schema';
import { MAX_MATCH_OFFERS } from './constants';
import { logAudit } from './admin';
import { sendAdminDigest, sendAdminLeadAlert, sendLeadReminder, sendSeekerConfirmation } from './email';
import {
  leadPayloadFromRow,
  leadPriceCents,
  leadPriceForMode,
  notifyLeadOffer,
  priceForLead,
  routeLeadToOperator,
  siteUrl,
} from './leads';
import { releaseLeadCheckout } from './lead-checkout';
import { tryAutoUnlock } from './auto-unlock';
import { distanceMiles } from './geo';
import { formatUsdFromCents } from './paid-unlock';
import { unsubscribeUrlFor } from './unsubscribe';
import {
  AUTO_ROUTE_GRACE_MINUTES,
  EXPAND_AFTER_HOURS,
  EXPIRE_AFTER_DAYS,
  HQ_RADIUS_MILES,
  REMINDER_AFTER_HOURS,
  extractZip,
  hoursAgoIso,
  hoursAgoSqlite,
  leadSuspicionReasons,
  rankCandidates,
} from './autopilot-rules';

export const AUTOPILOT_ACTOR = 'autopilot';
const HELD_NOTE_PREFIX = 'Autopilot held:';

type Candidate = Operator & { distanceMiles: number | null };

/** Operators that may be offered a lead: listed, reachable, not opted out. */
function eligibleConditions() {
  return [
    eq(operators.isPublished, true),
    eq(operators.isDemo, false),
    eq(operators.isBroker, false),
    eq(operators.leadEmailsOptOut, false),
    ne(operators.verificationStatus, 'rejected'),
    or(
      eq(operators.claimStatus, 'approved'),
      and(sql`${operators.email} IS NOT NULL`, ne(operators.email, '')),
    )!,
  ];
}

export function isOperatorEligible(op: Operator): boolean {
  return (
    op.isPublished &&
    !op.isDemo &&
    !op.isBroker &&
    !op.leadEmailsOptOut &&
    op.verificationStatus !== 'rejected' &&
    (op.claimStatus === 'approved' || !!op.email?.trim())
  );
}

/**
 * Operators serving the lead's city or ZIP; falls back to HQs within HQ_RADIUS_MILES
 * of the city center. Ranked so operators who can buy instantly come first.
 */
export async function findCandidateOperators(
  db: AppDb,
  lead: Pick<Lead, 'sourceCityId' | 'addressOrZip' | 'requestedOperatorId'>,
  opts: { exclude: Set<string>; limit: number },
): Promise<Candidate[]> {
  if (opts.limit <= 0) return [];
  const zip = extractZip(lead.addressOrZip);
  const city = lead.sourceCityId
    ? ((await db.query.cities.findFirst({ where: eq(cities.id, lead.sourceCityId) })) ?? null)
    : null;

  const areaConds = [];
  if (city) areaConds.push(eq(operatorServiceAreas.cityId, city.id));
  if (zip) areaConds.push(eq(operatorServiceAreas.zip, zip));

  // Direct quotes (operator page) carry no city: use the requested operator's area instead.
  let anchor: { lat: number; lng: number } | null = city ? { lat: city.lat, lng: city.lng } : null;
  if (!city && lead.requestedOperatorId) {
    const requested = await db.query.operators.findFirst({
      where: eq(operators.id, lead.requestedOperatorId),
    });
    if (requested?.hqLat != null && requested.hqLng != null) {
      anchor = { lat: requested.hqLat, lng: requested.hqLng };
    }
    const servedCities = await db
      .select({ cityId: operatorServiceAreas.cityId })
      .from(operatorServiceAreas)
      .where(eq(operatorServiceAreas.operatorId, lead.requestedOperatorId));
    const cityIds = [...new Set(servedCities.map((r) => r.cityId).filter(Boolean) as string[])];
    if (cityIds.length > 0) areaConds.push(inArray(operatorServiceAreas.cityId, cityIds));
  }

  let pool: Operator[] = [];
  if (areaConds.length > 0) {
    const areaRows = await db
      .select({ operatorId: operatorServiceAreas.operatorId })
      .from(operatorServiceAreas)
      .where(or(...areaConds));
    const ids = [...new Set(areaRows.map((r) => r.operatorId))].filter((id) => !opts.exclude.has(id));
    if (ids.length > 0) {
      pool = await db
        .select()
        .from(operators)
        .where(and(inArray(operators.id, ids), ...eligibleConditions()));
    }
  }

  if (pool.length < opts.limit && anchor) {
    // ~1 degree latitude = 69 miles; widen longitude by latitude.
    const dLat = HQ_RADIUS_MILES / 69;
    const dLng = HQ_RADIUS_MILES / (69 * Math.max(0.2, Math.cos((anchor.lat * Math.PI) / 180)));
    const near = await db
      .select()
      .from(operators)
      .where(
        and(
          ...eligibleConditions(),
          sql`${operators.hqLat} BETWEEN ${anchor.lat - dLat} AND ${anchor.lat + dLat}`,
          sql`${operators.hqLng} BETWEEN ${anchor.lng - dLng} AND ${anchor.lng + dLng}`,
        ),
      )
      .limit(100);
    const seen = new Set(pool.map((p) => p.id));
    for (const op of near) {
      if (seen.has(op.id) || opts.exclude.has(op.id)) continue;
      if (op.hqLat == null || op.hqLng == null) continue;
      if (distanceMiles(anchor.lat, anchor.lng, op.hqLat, op.hqLng) > HQ_RADIUS_MILES) continue;
      seen.add(op.id);
      pool.push(op);
    }
  }

  const withFacts: Candidate[] = pool.map((op) => ({
    ...op,
    distanceMiles:
      anchor && op.hqLat != null && op.hqLng != null
        ? distanceMiles(anchor.lat, anchor.lng, op.hqLat, op.hqLng)
        : null,
  }));
  return rankCandidates(
    withFacts.map((op) => ({
      ...op,
      hasSavedCard: !!op.stripePaymentMethodId,
      qualityScore: op.qualityScore ?? 50,
    })),
  ).slice(0, opts.limit);
}

/** Try auto-buy first; if the operator is not on auto-buy, send the "lead waiting" email. */
async function deliverOffer(db: AppDb, rowId: string, op: Operator): Promise<'auto-bought' | 'offered'> {
  const auto = await tryAutoUnlock(db, rowId);
  if (auto.status === 'unlocked') return 'auto-bought';
  const row = await db.query.leads.findFirst({ where: eq(leads.id, rowId) });
  if (row && row.status === 'offered') {
    const fresh = (await db.query.operators.findFirst({ where: eq(operators.id, op.id) })) ?? op;
    await notifyLeadOffer(fresh, row);
  }
  return 'offered';
}

async function offerToOperators(
  db: AppDb,
  leadId: string,
  targets: Operator[],
): Promise<{ offered: string[]; autoBought: string[] }> {
  // Offer every operator first (clones read the source row's status), then deliver.
  const rows: { rowId: string; op: Operator }[] = [];
  for (const op of targets) {
    const res = await routeLeadToOperator(db, {
      leadId,
      operatorId: op.id,
      action: 'offer',
      actor: AUTOPILOT_ACTOR,
      notify: false,
    });
    if (res.ok) rows.push({ rowId: res.leadId, op });
    else console.warn('[autopilot] route failed', leadId, op.id, res.error);
  }
  const offered: string[] = [];
  const autoBought: string[] = [];
  for (const { rowId, op } of rows) {
    const outcome = await deliverOffer(db, rowId, op);
    (outcome === 'auto-bought' ? autoBought : offered).push(op.name);
  }
  return { offered, autoBought };
}

export type RouteOutcome =
  | { status: 'routed'; offered: string[]; autoBought: string[] }
  | { status: 'held'; reasons: string[] }
  | { status: 'no_match' }
  | { status: 'skipped' };

export function describeOutcome(o: RouteOutcome): string {
  switch (o.status) {
    case 'routed': {
      const parts = [];
      if (o.autoBought.length) parts.push(`sold via auto-buy to ${o.autoBought.join(', ')}`);
      if (o.offered.length) parts.push(`offered to ${o.offered.join(', ')}`);
      return parts.join('; ') || 'routed';
    }
    case 'held':
      return `held for review (${o.reasons.join('; ')})`;
    case 'no_match':
      return 'no eligible operator yet (retrying automatically)';
    default:
      return 'already handled';
  }
}

/** Route one `new` lead with no human in the loop. Safe to call repeatedly. */
export async function autoRouteLead(db: AppDb, leadId: string): Promise<RouteOutcome> {
  let lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!lead || lead.status !== 'new') return { status: 'skipped' };

  const reasons = leadSuspicionReasons(lead);
  if (reasons.length > 0) {
    if (!lead.adminNotes?.startsWith(HELD_NOTE_PREFIX)) {
      await db
        .update(leads)
        .set({ adminNotes: `${HELD_NOTE_PREFIX} ${reasons.join('; ')}${lead.adminNotes ? `\n${lead.adminNotes}` : ''}` })
        .where(eq(leads.id, lead.id));
    }
    return { status: 'held', reasons };
  }

  if (lead.mode === 'direct' && lead.operatorId) {
    const requested = await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) });
    if (requested && isOperatorEligible(requested)) {
      if (lead.priceCents == null) {
        await db.update(leads).set({ priceCents: leadPriceForMode('direct') }).where(eq(leads.id, lead.id));
      }
      const res = await offerToOperators(db, lead.id, [requested]);
      return res.offered.length || res.autoBought.length
        ? { status: 'routed', ...res }
        : { status: 'no_match' };
    }
    // Requested operator cannot take leads: sell it as a shared match request instead.
    await db
      .update(leads)
      .set({
        mode: 'match',
        operatorId: null,
        priceCents: leadPriceForMode('match'),
        adminNotes: `${lead.adminNotes ? `${lead.adminNotes}\n` : ''}Autopilot: requested operator not reachable; converted to match request.`,
      })
      .where(and(eq(leads.id, lead.id), eq(leads.status, 'new')));
    lead = (await db.query.leads.findFirst({ where: eq(leads.id, lead.id) }))!;
  }

  if (lead.priceCents == null) {
    await db.update(leads).set({ priceCents: leadPriceForMode('match') }).where(eq(leads.id, lead.id));
  }
  // Ineligible operators (incl. an unreachable requested one) are filtered by the query.
  const targets = await findCandidateOperators(db, lead, { exclude: new Set(), limit: MAX_MATCH_OFFERS });
  if (targets.length === 0) return { status: 'no_match' };
  const res = await offerToOperators(db, lead.id, targets);
  return res.offered.length || res.autoBought.length ? { status: 'routed', ...res } : { status: 'no_match' };
}

/** Submit-time work, run from waitUntil so the seeker is not kept waiting. */
export async function processNewLead(db: AppDb, leadId: string): Promise<void> {
  let outcome: RouteOutcome;
  try {
    outcome = await autoRouteLead(db, leadId);
  } catch (err) {
    console.error('[autopilot] route on submit failed; cron will retry', leadId, err);
    outcome = { status: 'no_match' };
  }
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!lead) return;
  const requested = lead.requestedOperatorId
    ? await db.query.operators.findFirst({ where: eq(operators.id, lead.requestedOperatorId) })
    : null;

  await sendSeekerConfirmation({
    seekerName: lead.seekerName,
    seekerEmail: lead.seekerEmail,
    operatorName: lead.mode === 'direct' ? (requested?.name ?? null) : null,
    mode: lead.mode,
  });
  await sendAdminLeadAlert({
    ...leadPayloadFromRow(lead),
    operatorName: requested?.name ?? 'Match request',
    leadId,
    adminUrl: `${siteUrl()}/admin/leads/${leadId}`,
    mode: lead.mode,
    outcome: describeOutcome(outcome),
  });
}

export type AutopilotRunStats = {
  routed: number;
  held: number;
  unmatched: number;
  expanded: number;
  reminded: number;
  expired: number;
  errors: number;
};

/** Catch-up: `new` leads the submit path did not route (errors, or no operator at the time). */
async function routePendingLeads(db: AppDb, stats: AutopilotRunStats): Promise<void> {
  const pending = await db
    .select({ id: leads.id })
    .from(leads)
    .where(
      and(
        eq(leads.status, 'new'),
        lt(leads.createdAt, hoursAgoSqlite(AUTO_ROUTE_GRACE_MINUTES / 60)),
        gte(leads.createdAt, hoursAgoSqlite(24 * EXPIRE_AFTER_DAYS)),
      ),
    )
    .orderBy(desc(leads.createdAt))
    .limit(25);
  for (const { id } of pending) {
    try {
      const out = await autoRouteLead(db, id);
      if (out.status === 'routed') stats.routed++;
      else if (out.status === 'held') stats.held++;
      else if (out.status === 'no_match') stats.unmatched++;
    } catch (err) {
      stats.errors++;
      console.error('[autopilot] route failed', id, err);
    }
  }
}

/**
 * Offered for EXPAND_AFTER_HOURS with nobody buying: offer to more operators so the
 * seeker still gets called. Exclusive leads become shared (price drops to shared).
 */
async function expandUnboughtLeads(db: AppDb, stats: AutopilotRunStats): Promise<void> {
  const stale = await db
    .select()
    .from(leads)
    .where(
      and(
        eq(leads.status, 'offered'),
        isNull(leads.expandedAt),
        lt(leads.offeredAt, hoursAgoIso(EXPAND_AFTER_HOURS)),
        gte(leads.createdAt, hoursAgoSqlite(24 * EXPIRE_AFTER_DAYS)),
      ),
    )
    .limit(25);

  const seenGroups = new Set<string>();
  for (const lead of stale) {
    const groupId = lead.groupId || lead.id;
    if (seenGroups.has(groupId)) continue;
    seenGroups.add(groupId);
    try {
      const siblings = await db.select().from(leads).where(eq(leads.groupId, groupId));
      const now = new Date().toISOString();
      const markExpanded = () =>
        db.update(leads).set({ expandedAt: now }).where(eq(leads.groupId, groupId));

      if (siblings.some((s) => s.status === 'unlocked')) {
        await markExpanded();
        continue;
      }
      const assigned = new Set(siblings.map((s) => s.operatorId).filter(Boolean) as string[]);
      if (lead.requestedOperatorId) assigned.add(lead.requestedOperatorId);
      const room = MAX_MATCH_OFFERS - siblings.filter((s) => s.operatorId).length;
      const targets = await findCandidateOperators(db, lead, { exclude: assigned, limit: room });
      if (targets.length === 0) {
        await markExpanded();
        continue;
      }

      if (lead.mode === 'direct') {
        const shared = leadPriceCents();
        await releaseLeadCheckout(db, lead);
        await db
          .update(leads)
          .set({ mode: 'match', priceCents: Math.min(shared, priceForLead(lead)) })
          .where(and(eq(leads.id, lead.id), eq(leads.status, 'offered')));
      }
      const source = siblings.find((s) => s.id === groupId && s.status === 'offered') ?? lead;
      const res = await offerToOperators(db, source.id, targets);
      await markExpanded();
      await logAudit(db, {
        action: 'lead_expand',
        entityType: 'lead',
        entityId: lead.id,
        actor: AUTOPILOT_ACTOR,
        notes: describeOutcome({ status: 'routed', ...res }),
      });
      stats.expanded++;
    } catch (err) {
      stats.errors++;
      console.error('[autopilot] expand failed', lead.id, err);
    }
  }
}

async function sendReminders(db: AppDb, stats: AutopilotRunStats): Promise<void> {
  const due = await db
    .select({ lead: leads, op: operators })
    .from(leads)
    .innerJoin(operators, eq(leads.operatorId, operators.id))
    .where(
      and(
        eq(leads.status, 'offered'),
        isNull(leads.reminderSentAt),
        lt(leads.offeredAt, hoursAgoIso(REMINDER_AFTER_HOURS)),
        gte(leads.offeredAt, hoursAgoIso(24 * EXPIRE_AFTER_DAYS)),
        eq(operators.leadEmailsOptOut, false),
      ),
    )
    .limit(50);
  for (const { lead, op } of due) {
    const now = new Date().toISOString();
    const claimed = await db
      .update(leads)
      .set({ reminderSentAt: now })
      .where(and(eq(leads.id, lead.id), isNull(leads.reminderSentAt)))
      .returning({ id: leads.id });
    if (claimed.length === 0) continue;
    const url =
      op.claimStatus === 'approved'
        ? `${siteUrl()}/portal/leads`
        : `${siteUrl()}/operator/${op.slug}#claim`;
    await sendLeadReminder({
      operatorName: op.name,
      operatorEmail: op.email,
      projectSize: lead.projectSize,
      addressOrZip: lead.addressOrZip,
      priceCents: priceForLead(lead),
      url,
      unsubscribeUrl: await unsubscribeUrlFor(op.id),
    });
    stats.reminded++;
  }
}

async function expireStaleLeads(db: AppDb, stats: AutopilotRunStats): Promise<void> {
  const stale = await db
    .select()
    .from(leads)
    .where(
      and(
        inArray(leads.status, ['new', 'offered']),
        lt(leads.createdAt, hoursAgoSqlite(24 * EXPIRE_AFTER_DAYS)),
      ),
    )
    .limit(100);
  for (const lead of stale) {
    await releaseLeadCheckout(db, lead);
    const heldAsJunk = lead.status === 'new' && lead.adminNotes?.startsWith(HELD_NOTE_PREFIX);
    const updated = await db
      .update(leads)
      .set({
        status: heldAsJunk ? 'spam' : 'closed',
        adminNotes: `${lead.adminNotes ? `${lead.adminNotes}\n` : ''}Autopilot: expired unsold after ${EXPIRE_AFTER_DAYS} days.`,
      })
      .where(and(eq(leads.id, lead.id), inArray(leads.status, ['new', 'offered'])))
      .returning({ id: leads.id });
    if (updated.length) stats.expired++;
  }
}

/** Cron entry: everything that used to need an admin. Each step is independent. */
export async function runAutopilot(db: AppDb): Promise<AutopilotRunStats> {
  const stats: AutopilotRunStats = {
    routed: 0,
    held: 0,
    unmatched: 0,
    expanded: 0,
    reminded: 0,
    expired: 0,
    errors: 0,
  };
  const steps: [string, (db: AppDb, s: AutopilotRunStats) => Promise<void>][] = [
    ['route', routePendingLeads],
    ['expand', expandUnboughtLeads],
    ['remind', sendReminders],
    ['expire', expireStaleLeads],
  ];
  for (const [name, step] of steps) {
    try {
      await step(db, stats);
    } catch (err) {
      stats.errors++;
      console.error(`[autopilot] step ${name} failed`, err);
    }
  }
  console.info('[autopilot] run', JSON.stringify(stats));
  return stats;
}

async function revenueSince(db: AppDb, hours: number): Promise<{ cents: number; count: number }> {
  const [row] = await db
    .select({
      cents: sql<number>`coalesce(sum(${leads.priceCents}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(leads)
    .where(
      and(
        eq(leads.status, 'unlocked'),
        eq(leads.unlockMethod, 'paid'),
        gte(leads.unlockedAt, hoursAgoIso(hours)),
      ),
    );
  return { cents: row?.cents ?? 0, count: row?.count ?? 0 };
}

export async function buildDigest(db: AppDb): Promise<{ subject: string; text: string; quiet: boolean }> {
  const [day, week, month] = await Promise.all([
    revenueSince(db, 24),
    revenueSince(db, 24 * 7),
    revenueSince(db, 24 * 30),
  ]);
  const [newLeads] = await db
    .select({ c: sql<number>`count(distinct coalesce(${leads.groupId}, ${leads.id}))` })
    .from(leads)
    .where(gte(leads.createdAt, hoursAgoSqlite(24)));
  const [autoBuys] = await db
    .select({ c: sql<number>`count(*)` })
    .from(leads)
    .where(and(eq(leads.passedBy, 'auto-buy'), gte(leads.unlockedAt, hoursAgoIso(24))));

  const waiting = await db
    .select({ id: leads.id, adminNotes: leads.adminNotes, cityName: cities.name, state: cities.state, zip: leads.addressOrZip })
    .from(leads)
    .leftJoin(cities, eq(leads.sourceCityId, cities.id))
    .where(and(eq(leads.status, 'new'), gte(leads.createdAt, hoursAgoSqlite(24 * EXPIRE_AFTER_DAYS))))
    .limit(200);
  const held = waiting.filter((w) => w.adminNotes?.startsWith(HELD_NOTE_PREFIX));
  const unmatched = waiting.filter((w) => !w.adminNotes?.startsWith(HELD_NOTE_PREFIX));
  const byCity = new Map<string, number>();
  for (const u of unmatched) {
    const key = u.cityName ? `${u.cityName}, ${u.state}` : (extractZip(u.zip) ?? 'unknown area');
    byCity.set(key, (byCity.get(key) ?? 0) + 1);
  }

  const [pendingClaims] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.claimStatus, 'pending'));
  const [autoBuyOps] = await db
    .select({ c: sql<number>`count(*)` })
    .from(operators)
    .where(eq(operators.autoUnlockEnabled, true));

  const lines = [
    `Lead revenue (paid unlocks, gross before Stripe fees)`,
    `  Last 24h: ${formatUsdFromCents(day.cents)} from ${day.count} lead(s) (${autoBuys?.c ?? 0} via auto-buy)`,
    `  Last 7d:  ${formatUsdFromCents(week.cents)} from ${week.count} lead(s)`,
    `  Last 30d: ${formatUsdFromCents(month.cents)} from ${month.count} lead(s)`,
    '',
    `New quote requests (24h): ${newLeads?.c ?? 0}`,
    `Operators on auto-buy: ${autoBuyOps?.c ?? 0}`,
    '',
  ];
  if (unmatched.length) {
    lines.push(
      `Unsold — no operator in the area yet (${unmatched.length}). Autopilot keeps retrying; listing an operator here would sell them:`,
      ...[...byCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, n]) => `  ${k}: ${n}`),
      '',
    );
  }
  if (held.length) {
    lines.push(
      `Held as likely junk (${held.length}) — no action needed; they close automatically after ${EXPIRE_AFTER_DAYS} days. Review only if you want to: ${siteUrl()}/admin/leads?status=new`,
      '',
    );
  }
  if ((pendingClaims?.c ?? 0) > 0) {
    lines.push(
      `Listing claims that could not be auto-verified (${pendingClaims?.c}): ${siteUrl()}/admin/claims`,
      `  (Claims approve instantly when the claimant's verified email matches the listing email or website domain.)`,
      '',
    );
  }
  lines.push(`— Find A Dumpster autopilot`);

  const quiet = day.count === 0 && (newLeads?.c ?? 0) === 0 && unmatched.length === 0 && held.length === 0 && (pendingClaims?.c ?? 0) === 0;
  return {
    subject: `Find A Dumpster: ${formatUsdFromCents(day.cents)} yesterday · ${formatUsdFromCents(month.cents)} last 30 days`,
    text: lines.join('\n'),
    quiet,
  };
}

/** Daily summary. Skipped on days with nothing to report. */
export async function sendDailyDigest(db: AppDb, opts: { force?: boolean } = {}): Promise<boolean> {
  const digest = await buildDigest(db);
  if (digest.quiet && !opts.force) return false;
  return sendAdminDigest(digest);
}
