import { env } from 'cloudflare:workers';
import { BRAND } from './constants';

type LeadFields = {
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string | null;
  projectSize?: string | null;
  material?: string | null;
  addressOrZip?: string | null;
  timeline?: string | null;
  notes?: string | null;
};

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
  const to = opts.to.filter(Boolean);
  if (to.length === 0) return false;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${BRAND.name} <onboarding@resend.dev>`,
        to,
        subject: opts.subject,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error('[email] Resend error', await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] send failed', err);
    return false;
  }
}

function formatLeadBody(payload: LeadFields): string {
  return [
    `Name: ${payload.seekerName}`,
    `Email: ${payload.seekerEmail}`,
    `Phone: ${payload.seekerPhone ?? '—'}`,
    `Size: ${payload.projectSize ?? '—'}`,
    `Material: ${payload.material ?? '—'}`,
    `Location: ${payload.addressOrZip ?? '—'}`,
    `Timeline: ${payload.timeline ?? '—'}`,
    `Notes: ${payload.notes ?? '—'}`,
  ].join('\n');
}

/** Admin-only alert when a quote is submitted (held for routing). */
export async function sendAdminLeadAlert(
  payload: LeadFields & { operatorName: string; leadId: string; adminUrl: string },
): Promise<boolean> {
  const adminEmail = (env as { ADMIN_NOTIFY_EMAIL?: string }).ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.info('[email] ADMIN_NOTIFY_EMAIL not set; skipping admin alert');
    return false;
  }

  return sendResend({
    to: [adminEmail],
    subject: `New held lead — ${payload.seekerName} → ${payload.operatorName}`,
    text: [
      `A new quote request is held for routing.`,
      '',
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
      `Material: ${payload.material ?? '—'}`,
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
