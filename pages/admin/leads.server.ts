import { and, desc, eq, gte, like, lte, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { logAudit } from '../../src/lib/admin';
import { LEAD_MODES, LEAD_STATUSES, type LeadStatus } from '../../src/lib/constants';
import { getDb } from '../../src/lib/db';
import { formatDate } from '../../src/lib/geo';
import { releaseLeadCheckout } from '../../src/lib/lead-checkout';
import { labelForMaterial } from '../../src/lib/lead-fields';
import { csvEscape, routeLeadToOperator } from '../../src/lib/leads';
import { leads, operators } from '../../src/lib/schema';
import { adminActor, adminGuard, adminHead } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

type Filters = { status: string; mode: string; operator: string; q: string; from: string; to: string };

function readFilters(c: { req: { query(name: string): string | undefined } }): Filters {
  return {
    status: c.req.query('status') ?? '',
    mode: c.req.query('mode') ?? '',
    operator: c.req.query('operator') ?? '',
    q: c.req.query('q') ?? '',
    from: c.req.query('from') ?? '',
    to: c.req.query('to') ?? '',
  };
}

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const requested = alias(operators, 'requested_op');
  const assigned = alias(operators, 'assigned_op');
  const f = readFilters(c);

  const conditions = [];
  if (f.status && (LEAD_STATUSES as readonly string[]).includes(f.status)) {
    conditions.push(eq(leads.status, f.status as LeadStatus));
  }
  if (f.mode && (LEAD_MODES as readonly string[]).includes(f.mode as (typeof LEAD_MODES)[number])) {
    conditions.push(eq(leads.mode, f.mode as (typeof LEAD_MODES)[number]));
  }
  if (f.operator) {
    conditions.push(or(eq(leads.operatorId, f.operator), eq(leads.requestedOperatorId, f.operator)));
  }
  if (f.q.trim()) {
    const likeQ = `%${f.q.trim()}%`;
    conditions.push(
      or(
        like(leads.seekerName, likeQ),
        like(leads.seekerEmail, likeQ),
        like(leads.seekerPhone, likeQ),
        like(leads.addressOrZip, likeQ),
      ),
    );
  }
  if (f.from) conditions.push(gte(leads.createdAt, `${f.from}T00:00:00.000Z`));
  if (f.to) conditions.push(lte(leads.createdAt, `${f.to}T23:59:59.999Z`));

  const where = conditions.length ? and(...conditions) : undefined;

  const baseSelect = db
    .select({
      lead: leads,
      operatorName: assigned.name,
      operatorSlug: assigned.slug,
      complimentaryRemaining: assigned.complimentaryLeadsRemaining,
      claimStatus: assigned.claimStatus,
      requestedName: requested.name,
      requestedSlug: requested.slug,
    })
    .from(leads)
    .leftJoin(assigned, eq(leads.operatorId, assigned.id))
    .leftJoin(requested, eq(leads.requestedOperatorId, requested.id));

  const rows = await (where ? baseSelect.where(where) : baseSelect).orderBy(desc(leads.createdAt)).limit(200);

  if (c.req.query('export') === 'csv') {
    const header = [
      'id',
      'createdAt',
      'status',
      'mode',
      'seekerName',
      'seekerEmail',
      'seekerPhone',
      'preferredContact',
      'addressOrZip',
      'projectSize',
      'material',
      'timeline',
      'budgetRange',
      'howFound',
      'notes',
      'assignedOperator',
      'requestedOperator',
      'sourcePath',
      'utmSource',
      'utmMedium',
      'utmCampaign',
      'groupId',
      'unlockMethod',
      'priceCents',
    ];
    const lines = [
      header.join(','),
      ...rows.map(({ lead, operatorName, requestedName }) =>
        [
          lead.id,
          lead.createdAt,
          lead.status,
          lead.mode,
          lead.seekerName,
          lead.seekerEmail,
          lead.seekerPhone,
          lead.preferredContact,
          lead.addressOrZip,
          lead.projectSize,
          lead.material,
          lead.timeline,
          lead.budgetRange,
          lead.howFound,
          lead.notes,
          operatorName,
          requestedName,
          lead.sourcePath,
          lead.utmSource,
          lead.utmMedium,
          lead.utmCampaign,
          lead.groupId,
          lead.unlockMethod,
          lead.priceCents,
        ]
          .map(csvEscape)
          .join(','),
      ),
    ];
    return new Response(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  }

  const operatorOptions = await db
    .select({
      id: operators.id,
      name: operators.name,
      complimentaryLeadsRemaining: operators.complimentaryLeadsRemaining,
      claimStatus: operators.claimStatus,
    })
    .from(operators)
    .orderBy(operators.name)
    .limit(500);

  const url = new URL(c.req.url);
  const exportQs = new URLSearchParams(url.searchParams);
  exportQs.set('export', 'csv');

  return {
    adminEmail: c.get('adminEmail'),
    filters: f,
    okMsg: c.req.query('ok') ?? null,
    errMsg: c.req.query('err') ?? null,
    exportHref: `/admin/leads?${exportQs.toString()}`,
    statuses: [...LEAD_STATUSES] as string[],
    modes: [...LEAD_MODES] as string[],
    operatorOptions,
    rows: rows.map(
      ({ lead, operatorName, operatorSlug, complimentaryRemaining, claimStatus, requestedName, requestedSlug }) => ({
        id: lead.id,
        seekerName: lead.seekerName,
        seekerEmail: lead.seekerEmail,
        seekerPhone: lead.seekerPhone,
        mode: lead.mode,
        operatorId: lead.operatorId,
        requestedOperatorId: lead.requestedOperatorId,
        operatorName,
        operatorSlug,
        complimentaryRemaining,
        claimStatus,
        requestedName,
        requestedSlug,
        sourcePath: lead.sourcePath,
        created: formatDate(lead.createdAt),
        status: lead.status,
        unlockMethod: lead.unlockMethod,
        projectSize: lead.projectSize,
        material: labelForMaterial(lead.material),
        addressOrZip: lead.addressOrZip,
        timeline: lead.timeline,
        notes: lead.notes,
      }),
    ),
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Leads'));

export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const actor = adminActor(c);
  const f = readFilters(c);
  const form = await c.req.formData();
  const id = form.get('id')?.toString();
  const intent = form.get('intent')?.toString();
  const operatorId = form.get('operatorId')?.toString();
  let flash: string | null = null;
  let flashError: string | null = null;

  if (id && intent === 'close') {
    const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (existing) await releaseLeadCheckout(db, existing);
    await db.update(leads).set({ status: 'closed' }).where(eq(leads.id, id));
    await logAudit(db, { action: 'lead_close', entityType: 'lead', entityId: id, actor });
    flash = 'Lead closed.';
  } else if (id && (intent === 'spam' || intent === 'invalid')) {
    const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (existing) await releaseLeadCheckout(db, existing);
    await db.update(leads).set({ status: intent }).where(eq(leads.id, id));
    await logAudit(db, { action: `lead_${intent}`, entityType: 'lead', entityId: id, actor });
    flash = `Lead marked ${intent}.`;
  } else if (id && intent === 'pass_complimentary' && operatorId) {
    const result = await routeLeadToOperator(db, { leadId: id, operatorId, action: 'complimentary', actor });
    if (result.ok) flash = 'Lead unlocked complimentary and emailed.';
    else flashError = result.error;
  } else if (id && intent === 'offer_paid' && operatorId) {
    const result = await routeLeadToOperator(db, { leadId: id, operatorId, action: 'offer', actor });
    if (result.ok) flash = 'Lead offered (paid unlock).';
    else flashError = result.error;
  } else if (id && intent === 'reassign' && operatorId) {
    const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (existing && existing.operatorId !== operatorId) {
      await releaseLeadCheckout(db, existing);
    }
    await db
      .update(leads)
      .set({
        operatorId,
        ...(existing && existing.operatorId !== operatorId ? { stripeCheckoutSessionId: null } : {}),
      })
      .where(eq(leads.id, id));
    await logAudit(db, {
      action: 'lead_reassign',
      entityType: 'lead',
      entityId: id,
      actor,
      notes: `Assigned to ${operatorId}`,
    });
    flash = 'Lead reassigned.';
  } else if (id && intent === 'status') {
    const status = form.get('status')?.toString() as LeadStatus | undefined;
    if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
      const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
      if (existing && existing.status === 'offered' && status !== 'offered') {
        await releaseLeadCheckout(db, existing);
      }
      await db.update(leads).set({ status }).where(eq(leads.id, id));
      flash = 'Status updated.';
    }
  }

  const params = new URLSearchParams();
  if (flash) params.set('ok', flash);
  if (flashError) params.set('err', flashError);
  for (const [k, v] of Object.entries(f)) {
    if (v) params.set(k, v);
  }
  return c.redirect(`/admin/leads?${params.toString()}` as Href, 303);
});
