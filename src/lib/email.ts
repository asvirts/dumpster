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

/** "Name <addr>" → { email, name } for the Cloudflare binding (name is required there). */
function fromParts(): { email: string; name: string } {
  const raw = fromAddress();
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { email: m[2].trim(), name: m[1].trim() || BRAND.name } : { email: raw, name: BRAND.name };
}

type SendOpts = {
  to: string[];
  subject: string;
  text: string;
  /** Adds a List-Unsubscribe header (mail clients show an unsubscribe button). */
  unsubscribeUrl?: string | null;
};

type SendEmailBinding = {
  send(message: {
    from: { email: string; name: string };
    to: string[];
    subject: string;
    text: string;
    headers?: Record<string, string>;
  }): Promise<{ messageId: string }>;
};

/**
 * Cloudflare Email Sending via the `EMAIL` send_email binding (wrangler.jsonc).
 * Returns null when the binding is absent so the caller can fall back to Resend.
 */
async function sendCloudflare(opts: SendOpts): Promise<boolean | null> {
  const binding = (env as { EMAIL?: SendEmailBinding }).EMAIL;
  if (!binding) return null;
  const to = opts.to.filter(Boolean);
  if (to.length === 0) return false;

  const message = { from: fromParts(), to, subject: opts.subject, text: opts.text };
  const headers = opts.unsubscribeUrl ? { 'List-Unsubscribe': `<${opts.unsubscribeUrl}>` } : undefined;
  try {
    await binding.send(headers ? { ...message, headers } : message);
    return true;
  } catch (err) {
    const code = (err as { code?: string }).code ?? '';
    // A rejected header fails the whole send; the email matters more than the header.
    if (headers && code.startsWith('E_HEADER')) {
      console.error('[email] Cloudflare rejected List-Unsubscribe; resending without it', code);
      try {
        await binding.send(message);
        return true;
      } catch (retryErr) {
        console.error('[email] Cloudflare send failed', (retryErr as { code?: string }).code, retryErr);
        return false;
      }
    }
    console.error('[email] Cloudflare send failed', code, err);
    return false;
  }
}

async function postResend(from: string, opts: SendOpts): Promise<{ ok: boolean; status: number; body: string }> {
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
        ...(opts.unsubscribeUrl
          ? { headers: { 'List-Unsubscribe': `<${opts.unsubscribeUrl}>` } }
          : {}),
      }),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, status: 0, body: 'network' };
  }
}

async function sendEmail(opts: SendOpts): Promise<boolean> {
  const viaCloudflare = await sendCloudflare(opts);
  if (viaCloudflare) return true;
  return sendResend(opts);
}

/** Fallback transport, used only when the Cloudflare binding is missing or fails. */
async function sendResend(opts: SendOpts): Promise<boolean> {
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

function adminEmail(): string | null {
  return (env as { ADMIN_NOTIFY_EMAIL?: string }).ADMIN_NOTIFY_EMAIL || null;
}

/**
 * Per-lead FYI for the admin, sent after autopilot routed (or held) the lead.
 * Off unless ADMIN_LEAD_ALERTS=1 — the daily digest covers the same ground.
 */
export async function sendAdminLeadAlert(
  payload: LeadFields & {
    operatorName: string;
    leadId: string;
    adminUrl: string;
    mode?: string | null;
    outcome: string;
  },
): Promise<boolean> {
  const to = adminEmail();
  if (!to) {
    console.info('[email] ADMIN_NOTIFY_EMAIL not set; skipping admin alert');
    return false;
  }
  if ((env as { ADMIN_LEAD_ALERTS?: string }).ADMIN_LEAD_ALERTS !== '1') return false;

  const modeLabel = payload.mode === 'match' ? 'match request' : 'direct quote';
  return sendEmail({
    to: [to],
    subject: `New lead (${modeLabel}) — ${payload.seekerName}: ${payload.outcome}`,
    text: [
      `Autopilot: ${payload.outcome}`,
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
  return sendEmail({
    to: [payload.seekerEmail],
    subject: `We received your dumpster quote request`,
    text: [
      `Hi ${payload.seekerName},`,
      '',
      `Thanks — we received your quote request${who}.`,
      '',
      `What happens next:`,
      `1. We send your request to local dumpster rental operators that serve your area.`,
      `2. They reach out using the phone and email you provided — often the same day.`,
      `3. Compare quotes and pick the one that fits.`,
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
  return sendEmail({
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
  unsubscribeUrl?: string | null;
}): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  const price = `$${(payload.priceCents / 100).toFixed(2)}`;
  const cta = payload.isClaimed
    ? `Sign in to unlock this lead in your portal:\n${payload.portalUrl}\n\nTip: turn on auto-buy in the portal and new leads arrive with full contact details instantly.`
    : `Claim your listing (free, and instant if you sign in with this email address), then unlock this lead:\n${payload.claimUrl}\n\nPortal: ${payload.portalUrl}`;

  return sendEmail({
    to: [payload.operatorEmail],
    unsubscribeUrl: payload.unsubscribeUrl,
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
      unsubscribeFooter(payload.unsubscribeUrl),
    ].join('\n'),
  });
}

function unsubscribeFooter(url: string | null | undefined): string {
  return url ? `\nDon't want lead offers? Unsubscribe: ${url}` : '';
}

/** One nudge for an offered lead the operator has not unlocked yet. */
export async function sendLeadReminder(payload: {
  operatorName: string;
  operatorEmail: string | null;
  projectSize?: string | null;
  addressOrZip?: string | null;
  priceCents: number;
  url: string;
  unsubscribeUrl?: string | null;
}): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  const price = `$${(payload.priceCents / 100).toFixed(2)}`;
  const size = payload.projectSize ? `${payload.projectSize} ` : '';
  return sendEmail({
    to: [payload.operatorEmail],
    unsubscribeUrl: payload.unsubscribeUrl,
    subject: `Still available: dumpster lead in ${payload.addressOrZip ?? 'your area'}`,
    text: [
      `Hi ${payload.operatorName},`,
      '',
      `A customer looking for a ${size}dumpster in ${payload.addressOrZip ?? 'your service area'} is still waiting to hear from you.`,
      `Unlock their contact details for ${price}. If nobody picks the lead up soon, we offer it to other operators nearby.`,
      '',
      payload.url,
      '',
      `— ${BRAND.name}`,
      unsubscribeFooter(payload.unsubscribeUrl),
    ].join('\n'),
  });
}

/** Auto-buy charge failed; it stays off until the operator re-enables it. */
export async function sendAutoBuyPaused(payload: {
  operatorName: string;
  operatorEmail: string | null;
  reason: string;
  portalUrl: string;
}): Promise<boolean> {
  if (!payload.operatorEmail) return false;
  return sendEmail({
    to: [payload.operatorEmail],
    subject: `Auto-buy paused — ${payload.operatorName}`,
    text: [
      `Hi ${payload.operatorName},`,
      '',
      `We could not charge your saved card for a new lead (${payload.reason}), so auto-buy is paused.`,
      `The lead is still waiting in your portal. Buying it there saves the new card, and then you can turn auto-buy back on:`,
      payload.portalUrl,
      '',
      `— ${BRAND.name}`,
    ].join('\n'),
  });
}

export async function sendAdminDigest(payload: { subject: string; text: string }): Promise<boolean> {
  const to = adminEmail();
  if (!to) {
    console.info('[email] ADMIN_NOTIFY_EMAIL not set; skipping digest');
    return false;
  }
  return sendEmail({ to: [to], subject: payload.subject, text: payload.text });
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
    return sendEmail({
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
  return sendEmail({
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
  return sendEmail({
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
