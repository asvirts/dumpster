import { env } from 'cloudflare:workers';
import { BRAND } from './constants';
import { labelForBudget, labelForContact, labelForMaterial } from './lead-fields';

type LeadFields = {
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

const RESEND_ONBOARDING = `${BRAND.name} <onboarding@resend.dev>`;

function fromAddress(): string {
  const raw = (env as { LEAD_FROM_EMAIL?: string }).LEAD_FROM_EMAIL?.trim();
  if (!raw) return `${BRAND.name} <leads@findadumpster.net>`;
  return raw.includes('<') ? raw : `${BRAND.name} <${raw}>`;
}

async function postResend(from: string, opts: {
  to: string[];
  subject: string;
  text: string;
}): Promise<{ ok: boolean; status: number; body: string }> {
  const apiKey = (env as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 0, body: 'no-key' };
  }
  const to = opts.to.filter(Boolean);
  if (to.length === 0) return { ok: false, status: 0, body: 'no-recipients' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: opts.subject,
        text: opts.text,
      }),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, status: 0, body: 'network' };
  }
}

async function sendResend(opts: {
  to: string[];
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = (env as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) {
    console.info('[email] RESEND_API_KEY not set; skipping email');
    return false;
  }

  const primary = fromAddress();
  const first = await postResend(primary, opts);
  if (first.ok) return true;

  console.error('[email] Resend error', first.status, first.body);
  if (primary !== RESEND_ONBOARDING) {
    const fallback = await postResend(RESEND_ONBOARDING, opts);
    if (fallback.ok) {
      console.info('[email] sent via onboarding@resend.dev fallback — verify leads@findadumpster.net');
      return true;
    }
    console.error('[email] fallback Resend error', fallback.status, fallback.body);
  }
  return false;
}

function formatLeadBody(payload: LeadFields): string {
  return [
    `Name: ${payload.seekerName}`,
    `Email: ${payload.seekerEmail}`,
    `Phone: ${payload.seekerPhone ?? '—'}`,
    `Preferred contact: ${labelForContact(payload.preferredContact)}`,
    `Size: ${payload.projectSize ?? '—'}`,
    `Material: ${labelForMaterial(payload.material)}`,
    `Location: ${payload.addressOrZip ?? '—'}`,
    `Timeline: ${payload.timeline ?? '—'}`,
    `Budget: ${labelForBudget(payload.budgetRange)}`,
    `Notes: ${payload.notes ?? '—'}`,
  ].join('\n');
}

/** Admin-only alert when a quote is submitted (held for routing). */
export async function sendAdminLeadAlert(
  payload: LeadFields & {
    operatorName: string;
    leadId: string;
    adminUrl: string;
    mode?: string | null;
  },
): Promise<boolean> {
  const adminEmail = (env as { ADMIN_NOTIFY_EMAIL?: string }).ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.info('[email] ADMIN_NOTIFY_EMAIL not set; skipping admin alert');
    return false;
  }

  const modeLabel = payload.mode === 'match' ? 'match request' : 'direct quote';
  return sendResend({
    to: [adminEmail],
    subject: `New held lead (${modeLabel}) — ${payload.seekerName} → ${payload.operatorName}`,
    text: [
      `A new quote request is held for routing.`,
      '',
      `Type: ${modeLabel}`,
      `Requested operator: ${payload.operatorName}`,
      `Lead ID: ${payload.leadId}`,
      `Admin: ${payload.adminUrl}`,
      '',
      formatLeadBody(payload),
      '',
      `— ${BRAND.name}`,
    ].join('\n'),
  });
}

/** Confirmation to the seeker immediately after submit (before routing). */
export async function sendSeekerConfirmation(payload: {
  seekerName: string;
  seekerEmail: string;
  operatorName?: string | null;
  mode: 'direct' | 'match';
}): Promise<boolean> {
  const who = payload.operatorName
    ? ` for ${payload.operatorName}`
    : ' from local dumpster rental operators';
  return sendResend({
    to: [payload.seekerEmail],
    subject: `We received your dumpster quote request`,
    text: [
      `Hi ${payload.seekerName},`,
      '',
      `Thanks — we received your quote request${who}.`,
      '',
      `What happens next:`,
      `1. Our team reviews the request (usually the same day).`,
      `2. We connect you with a verified local operator.`,
      `3. They’ll reach out using the phone and email you provided.`,
      '',
      `No need to reply to this email. If your plans change, just ignore any follow-up.`,
      '',
      `— ${BRAND.name}`,
      `https://findadumpster.net`,
    ].join('\n'),
  });
}

/** Full lead details after complimentary or paid unlock. */
export async function sendLeadUnlocked(
  payload: LeadFields & {
    operatorName: string;
    operatorEmail: string | null;
    unlockMethod: 'complimentary' | 'paid';
  },
): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  const label = payload.unlockMethod === 'complimentary' ? 'complimentary teaser' : 'purchased';
  return sendResend({
    to: [payload.operatorEmail],
    subject: `Lead unlocked (${label}) — ${payload.seekerName}`,
    text: [
      `Hi ${payload.operatorName},`,
      '',
      `A dumpster quote lead has been unlocked for you (${label}).`,
      '',
      formatLeadBody(payload),
      '',
      `Please follow up promptly.`,
      '',
      `— ${BRAND.name}`,
    ].join('\n'),
  });
}

/** Notify operator that a paid lead is waiting in the portal (or to claim). */
export async function sendLeadOffer(payload: {
  operatorName: string;
  operatorEmail: string | null;
  seekerName: string;
  projectSize?: string | null;
  material?: string | null;
  addressOrZip?: string | null;
  portalUrl: string;
  claimUrl: string;
  isClaimed: boolean;
  priceCents: number;
}): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  const price = `$${(payload.priceCents / 100).toFixed(2)}`;
  const cta = payload.isClaimed
    ? `Sign in to unlock this lead in your portal:\n${payload.portalUrl}`
    : `Claim your listing, then unlock this lead in the portal:\n${payload.claimUrl}\n\nPortal: ${payload.portalUrl}`;

  return sendResend({
    to: [payload.operatorEmail],
    subject: `Lead waiting — ${payload.seekerName} (${price} to unlock)`,
    text: [
      `Hi ${payload.operatorName},`,
      '',
      `A new dumpster rental lead is available for you.`,
      '',
      `Seeker: ${payload.seekerName}`,
      `Size: ${payload.projectSize ?? '—'}`,
      `Material: ${labelForMaterial(payload.material)}`,
      `Location: ${payload.addressOrZip ?? '—'}`,
      '',
      `Contact details unlock for ${price} (first lead may be complimentary).`,
      '',
      cta,
      '',
      `— ${BRAND.name}`,
    ].join('\n'),
  });
}

export async function sendClaimDecision(payload: {
  operatorName: string;
  operatorEmail: string | null;
  approved: boolean;
  portalUrl: string;
  notes?: string | null;
}): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  if (payload.approved) {
    return sendResend({
      to: [payload.operatorEmail],
      subject: `Listing claim approved — ${payload.operatorName}`,
      text: [
        `Hi ${payload.operatorName},`,
        '',
        `Your claim for this listing was approved.`,
        `Manage leads and update your listing here:`,
        payload.portalUrl,
        '',
        `— ${BRAND.name}`,
      ].join('\n'),
    });
  }
  return sendResend({
    to: [payload.operatorEmail],
    subject: `Listing claim update — ${payload.operatorName}`,
    text: [
      `Hi ${payload.operatorName},`,
      '',
      `We could not approve your listing claim at this time.`,
      payload.notes ? `Notes: ${payload.notes}` : '',
      '',
      `— ${BRAND.name}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });
}

/**
 * @deprecated Prefer sendAdminLeadAlert / sendLeadUnlocked.
 * Kept for any leftover callers; emails operator + admin.
 */
export async function sendLeadNotification(payload: {
  operatorName: string;
  operatorEmail: string | null;
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string | null;
  projectSize?: string | null;
  material?: string | null;
  addressOrZip?: string | null;
  timeline?: string | null;
  notes?: string | null;
}): Promise<boolean> {
  const adminEmail = (env as { ADMIN_NOTIFY_EMAIL?: string }).ADMIN_NOTIFY_EMAIL;
  const to: string[] = [];
  if (payload.operatorEmail) to.push(payload.operatorEmail);
  if (adminEmail) to.push(adminEmail);
  return sendResend({
    to,
    subject: `New dumpster quote request — ${payload.seekerName}`,
    text: [
      `New quote request for ${payload.operatorName}`,
      '',
      formatLeadBody(payload),
      '',
      `— ${BRAND.name}`,
    ].join('\n'),
  });
}
