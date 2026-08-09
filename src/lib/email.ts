import { env } from 'cloudflare:workers';

type LeadEmailPayload = {
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
};

/**
 * Best-effort email via Resend. Returns true if sent, false if skipped/failed.
 * Lead persistence is the source of truth — never throw on email failure.
 */
export async function sendLeadNotification(payload: LeadEmailPayload): Promise<boolean> {
  const apiKey = (env as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) {
    console.info('[email] RESEND_API_KEY not set; skipping email');
    return false;
  }

  const adminEmail = (env as { ADMIN_NOTIFY_EMAIL?: string }).ADMIN_NOTIFY_EMAIL;
  const to: string[] = [];
  if (payload.operatorEmail) to.push(payload.operatorEmail);
  if (adminEmail) to.push(adminEmail);
  if (to.length === 0) return false;

  const subject = `New dumpster quote request — ${payload.seekerName}`;
  const text = [
    `New quote request for ${payload.operatorName}`,
    '',
    `Name: ${payload.seekerName}`,
    `Email: ${payload.seekerEmail}`,
    `Phone: ${payload.seekerPhone ?? '—'}`,
    `Size: ${payload.projectSize ?? '—'}`,
    `Material: ${payload.material ?? '—'}`,
    `Location: ${payload.addressOrZip ?? '—'}`,
    `Timeline: ${payload.timeline ?? '—'}`,
    `Notes: ${payload.notes ?? '—'}`,
    '',
    '— DumpsterLocal',
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DumpsterLocal <onboarding@resend.dev>',
        to,
        subject,
        text,
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
