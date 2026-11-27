import { desc, eq } from 'drizzle-orm';
import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { logAudit } from '../../../src/lib/admin';
import { LEAD_STATUSES, MAX_MATCH_OFFERS, type LeadStatus } from '../../../src/lib/constants';
import { getDb } from '../../../src/lib/db';
import { formatDate } from '../../../src/lib/geo';
import { releaseLeadCheckout } from '../../../src/lib/lead-checkout';
import { labelForBudget, labelForContact, labelForHowFound, labelForMaterial } from '../../../src/lib/lead-fields';
import { resendLeadOffer, routeLeadToOperator } from '../../../src/lib/leads';
import { leads, operators } from '../../../src/lib/schema';
import { adminActor, adminGuard, adminHead } from '../../../src/server/admin-guard';
import { withShared } from '../../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.redirect('/admin/leads');
  const db = getDb();

  const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!lead) return new Response('Not found', { status: 404 });

  const assigned = lead.operatorId
    ? await db.query.operators.findFirst({ where: eq(operators.id, lead.operatorId) })
    : null;
  const requested = lead.requestedOperatorId
    ? await db.query.operators.findFirst({ where: eq(operators.id, lead.requestedOperatorId) })
    : null;

  const groupId = lead.groupId || lead.id;
  const group = await db.select().from(leads).where(eq(leads.groupId, groupId)).orderBy(desc(leads.createdAt));

  const operatorOptions = await db
    .select({
      id: operators.id,
      name: operators.name,
      complimentaryLeadsRemaining: operators.complimentaryLeadsRemaining,
      claimStatus: operators.claimStatus,
      email: operators.email,
    })
    .from(operators)
    .orderBy(operators.name)
    .limit(500);

  const canRoute =
    lead.status !== 'unlocked' && lead.status !== 'closed' && lead.status !== 'spam' && lead.status !== 'invalid';

  return {
    adminEmail: c.get('adminEmail'),
    okMsg: c.req.query('ok') ?? null,
    errMsg: c.req.query('err') ?? null,
    lead: {
      id: lead.id,
      mode: lead.mode,
      seekerName: lead.seekerName,
      seekerEmail: lead.seekerEmail,
      seekerPhone: lead.seekerPhone,
      created: formatDate(lead.createdAt),
      status: lead.status,
      unlockMethod: lead.unlockMethod,
      operatorId: lead.operatorId,
      preferredContact: labelForContact(lead.preferredContact),
      addressOrZip: lead.addressOrZip,
      projectSize: lead.projectSize,
      material: labelForMaterial(lead.material),
      timeline: lead.timeline,
      budget: labelForBudget(lead.budgetRange),
      howFound: labelForHowFound(lead.howFound),
      price: lead.priceCents != null ? `$${(lead.priceCents / 100).toFixed(2)}` : 'Default',
      notes: lead.notes,
      sourcePath: lead.sourcePath,
      referrer: lead.referrer,
      utm:
        [lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent, lead.utmTerm].filter(Boolean).join(' / ') ||
        '—',
      group: lead.groupId || lead.id,
      adminNotes: lead.adminNotes,
    },
    assigned: assigned ? { id: assigned.id, name: assigned.name } : null,
    requested: requested ? { id: requested.id, name: requested.name } : null,
    group: group.map((g) => ({ id: g.id, status: g.status, operatorId: g.operatorId })),
    groupAssigned: group.filter((g) => g.operatorId).length,
    maxMatchOffers: MAX_MATCH_OFFERS,
    canRoute,
    statuses: [...LEAD_STATUSES] as string[],
    operatorOptions,
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((_c, props) => adminHead(`Lead · ${props.lead.seekerName}`));

export const action = defineHandler(adminGuard, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.redirect('/admin/leads', 303);
  const db = getDb();
  const actor = adminActor(c);
  const form = await c.req.formData();
  const intent = form.get('intent')?.toString();
  const operatorId = form.get('operatorId')?.toString();
  let flash: string | null = null;
  let flashError: string | null = null;

  if (intent === 'notes') {
    await db
      .update(leads)
      .set({ adminNotes: form.get('adminNotes')?.toString() || null })
      .where(eq(leads.id, id));
    await logAudit(db, { action: 'lead_notes', entityType: 'lead', entityId: id, actor });
    flash = 'Notes saved.';
  } else if (intent === 'close') {
    const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (existing) await releaseLeadCheckout(db, existing);
    await db.update(leads).set({ status: 'closed' }).where(eq(leads.id, id));
    flash = 'Lead closed.';
  } else if (intent === 'spam' || intent === 'invalid') {
    const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
    if (existing) await releaseLeadCheckout(db, existing);
    await db.update(leads).set({ status: intent }).where(eq(leads.id, id));
    flash = `Lead marked ${intent}.`;
  } else if (intent === 'status') {
    const status = form.get('status')?.toString() as LeadStatus | undefined;
    if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
      const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
      if (existing && existing.status === 'offered' && status !== 'offered') {
        await releaseLeadCheckout(db, existing);
      }
      await db.update(leads).set({ status }).where(eq(leads.id, id));
      flash = 'Status updated.';
    }
  } else if (intent === 'resend') {
    const result = await resendLeadOffer(db, { leadId: id, actor });
    if (result.ok) flash = 'Offer email resent.';
    else flashError = result.error;
  } else if (intent === 'pass_complimentary' && operatorId) {
    const result = await routeLeadToOperator(db, { leadId: id, operatorId, action: 'complimentary', actor });
    if (result.ok) flash = 'Unlocked complimentary.';
    else flashError = result.error;
  } else if (intent === 'offer_paid' && operatorId) {
    const result = await routeLeadToOperator(db, { leadId: id, operatorId, action: 'offer', actor });
    if (result.ok) flash = result.leadId !== id ? 'Offered to additional operator.' : 'Lead offered.';
    else flashError = result.error;
  }

  const params = new URLSearchParams();
  if (flash) params.set('ok', flash);
  if (flashError) params.set('err', flashError);
  return c.redirect(`/admin/leads/${id}?${params.toString()}` as Href, 303);
});
