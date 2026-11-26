import { and, desc, eq, inArray } from 'drizzle-orm';
import { defineHandler, defineHead, type CloudContext, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { logAudit } from '../../src/lib/admin';
import { autoBuysThisWeek } from '../../src/lib/auto-unlock';
import { clampWeeklyCap, operatorNotifyEmail, parseNotifyEmail } from '../../src/lib/autopilot-rules';
import { getDb } from '../../src/lib/db';
import { formatDate } from '../../src/lib/geo';
import { createLeadUnlockCheckout, fulfillCheckoutSessionById } from '../../src/lib/lead-checkout';
import { labelForContact, labelForMaterial } from '../../src/lib/lead-fields';
import {
  exclusiveLeadPriceCents,
  leadPriceCents,
  priceForLead,
  unlockLeadComplimentary,
} from '../../src/lib/leads';
import { formatUsdFromCents } from '../../src/lib/paid-unlock';
import { getOperatorForOrg } from '../../src/lib/portal';
import { leads, operators } from '../../src/lib/schema';
import { portalAuth, portalGuard } from '../../src/server/portal-guard';
import { portalHead } from '../../src/server/portal-head';

export const revalidate = 0;

type Body = Record<string, string | File | (string | File)[]>;

function field(body: Body, key: string): string | undefined {
  const v = body[key];
  const first = Array.isArray(v) ? v[0] : v;
  return typeof first === 'string' ? first : undefined;
}

/** Same redirects as the Astro page (303 after a POST). */
function back(c: CloudContext, query = ''): Response {
  return c.redirect(`/portal/leads${query}` as Href, 303);
}

function errQuery(message: string): string {
  return `?err=${encodeURIComponent(message)}`;
}

/** The signed-in org's approved listing, or null (then the page renders its "claim first" note). */
async function currentOperator(c: CloudContext) {
  const auth = portalAuth(c);
  return getOperatorForOrg(getDb(), auth.orgId);
}

export const loader = defineHandler(portalGuard, async (c) => {
  // The guard guarantees a signed-in user with an active company.
  const db = getDb();
  const operator = await currentOperator(c);
  const url = new URL(c.req.url);

  // Stripe Checkout success URL: fulfil here too, in case the webhook hasn't arrived.
  if (operator) {
    const sessionId = url.searchParams.get('session_id');
    if (sessionId) {
      const result = await fulfillCheckoutSessionById(db, sessionId, operator.id);
      if (result.ok && result.pending) return c.redirect('/portal/leads?ok=processing' as Href);
      if (result.ok && !result.skipped) return c.redirect('/portal/leads?ok=unlocked' as Href);
      if (!result.ok) return c.redirect(`/portal/leads${errQuery(result.error)}` as Href);
      return c.redirect('/portal/leads' as Href);
    }
  }

  const rows = operator
    ? await db
        .select()
        .from(leads)
        .where(
          and(eq(leads.operatorId, operator.id), inArray(leads.status, ['offered', 'unlocked', 'closed'])),
        )
        .orderBy(desc(leads.createdAt))
        .limit(100)
    : [];

  // Props are serialized into the page: contact details only for unlocked leads.
  const leadViews = rows.map((lead) => {
    const unlocked = lead.status === 'unlocked';
    return {
      id: lead.id,
      status: lead.status,
      createdLabel: formatDate(lead.createdAt),
      projectSize: lead.projectSize,
      materialLabel: labelForMaterial(lead.material),
      addressOrZip: lead.addressOrZip,
      timeline: lead.timeline,
      priceLabel: formatUsdFromCents(priceForLead(lead)),
      contact: unlocked
        ? {
            name: lead.seekerName,
            email: lead.seekerEmail,
            phone: lead.seekerPhone,
            preferredContactLabel: labelForContact(lead.preferredContact),
            notes: lead.notes,
          }
        : null,
    };
  });

  return {
    operator: operator
      ? {
          complimentaryLeadsRemaining: operator.complimentaryLeadsRemaining,
          leadEmailsOptOut: Boolean(operator.leadEmailsOptOut),
          leadNotifyEmail: operator.leadNotifyEmail,
          email: operator.email,
          hasCard: Boolean(operator.stripePaymentMethodId),
          cardLabel: operator.stripePaymentMethodLabel,
          autoUnlockEnabled: Boolean(operator.autoUnlockEnabled),
          autoUnlockWeeklyCap: operator.autoUnlockWeeklyCap,
        }
      : null,
    notifyEmail: operator ? operatorNotifyEmail(operator) : null,
    autoBoughtThisWeek: operator ? await autoBuysThisWeek(db, operator.id) : 0,
    defaultPriceLabel: formatUsdFromCents(leadPriceCents()),
    exclusivePriceLabel: formatUsdFromCents(exclusiveLeadPriceCents()),
    leads: leadViews,
    ok: url.searchParams.get('ok'),
    err: url.searchParams.get('err'),
    canceled: url.searchParams.get('canceled'),
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead(() => portalHead('/portal/leads'));

// --- Actions -------------------------------------------------------------------------------
// Plain `<form method="post" action="?name">` posts; each redirects (303) like the Astro page.
// With no approved listing the page just re-renders (Astro ignored those POSTs too).

async function saveNotifyEmail(c: CloudContext, body: Body) {
  const operator = await currentOperator(c);
  if (!operator) return;
  const parsed = parseNotifyEmail(field(body, 'leadNotifyEmail') ?? null);
  if (!parsed.ok) return back(c, '?err=Enter+a+valid+email+for+lead+notifications');
  const db = getDb();
  await db
    .update(operators)
    .set({ leadNotifyEmail: parsed.value, updatedAt: new Date().toISOString() })
    .where(eq(operators.id, operator.id));
  await logAudit(db, {
    action: 'lead_notify_email_update',
    entityType: 'operator',
    entityId: operator.id,
    actor: portalAuth(c).userId,
    notes: parsed.value ?? 'cleared (uses listing email)',
  });
  return back(c, '?ok=notify_saved');
}

async function saveAutobuy(c: CloudContext, body: Body) {
  const operator = await currentOperator(c);
  if (!operator) return;
  const enable = field(body, 'enabled') === '1';
  if (enable && !operator.stripePaymentMethodId) {
    return back(c, '?err=Buy+one+lead+with+a+card+first+to+save+it+for+auto-buy');
  }
  const cap = clampWeeklyCap(field(body, 'cap') ?? operator.autoUnlockWeeklyCap);
  const db = getDb();
  await db
    .update(operators)
    .set({
      autoUnlockEnabled: enable,
      autoUnlockWeeklyCap: cap,
      // Turning auto-buy on means they want lead emails again.
      ...(enable ? { leadEmailsOptOut: false } : {}),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(operators.id, operator.id));
  await logAudit(db, {
    action: enable ? 'auto_buy_enabled' : 'auto_buy_disabled',
    entityType: 'operator',
    entityId: operator.id,
    actor: portalAuth(c).userId,
    notes: `weekly cap ${cap}`,
  });
  return back(c, `?ok=${enable ? 'autobuy_on' : 'autobuy_off'}`);
}

/** Free teaser unlock (main:src/actions/index.ts `unlockLeadComplimentary`). */
async function unlockComplimentary(c: CloudContext, body: Body) {
  const operator = await currentOperator(c);
  const leadId = field(body, 'leadId');
  if (!operator || !leadId) return;
  // unlockLeadComplimentary checks the lead belongs to this operator and is `offered`.
  const result = await unlockLeadComplimentary(getDb(), {
    leadId,
    operatorId: operator.id,
    actor: portalAuth(c).userId,
  });
  if (!result.ok) return back(c, errQuery(result.error));
  return back(c, '?ok=unlocked');
}

/** Paid unlock: redirect to Stripe Checkout (main:src/actions/index.ts `createLeadCheckout`). */
async function startCheckout(c: CloudContext, body: Body) {
  const operator = await currentOperator(c);
  const leadId = field(body, 'leadId');
  if (!operator || !leadId) return;
  const db = getDb();
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!lead || lead.operatorId !== operator.id || lead.status !== 'offered') {
    return back(c, '?err=Lead+not+available');
  }
  try {
    const checkout = await createLeadUnlockCheckout(db, {
      lead,
      operator,
      orgId: portalAuth(c).orgId!,
    });
    if (!checkout.ok) return back(c, errQuery(checkout.error));
    return c.redirect(checkout.url as Href, 303);
  } catch (err) {
    console.error('[portal] checkout', err);
    return back(c, '?err=Checkout+unavailable');
  }
}

const parse = (c: CloudContext) => c.req.parseBody({ all: true }) as Promise<Body>;

export const actions = {
  notifyEmail: defineHandler(portalGuard, async (c) => saveNotifyEmail(c, await parse(c))),
  autobuy: defineHandler(portalGuard, async (c) => saveAutobuy(c, await parse(c))),
  unlockLeadComplimentary: defineHandler(portalGuard, async (c) => unlockComplimentary(c, await parse(c))),
  createLeadCheckout: defineHandler(portalGuard, async (c) => startCheckout(c, await parse(c))),
  /** Bare POST /portal/leads with `intent`, as the Astro page accepted. */
  default: defineHandler(portalGuard, async (c) => {
    const body = await parse(c);
    const intent = field(body, 'intent');
    if (intent === 'notify_email') return saveNotifyEmail(c, body);
    if (intent === 'autobuy') return saveAutobuy(c, body);
    if (intent === 'complimentary') return unlockComplimentary(c, body);
    if (intent === 'checkout') return startCheckout(c, body);
  }),
};
