/**
 * Pure autopilot decisions (no Cloudflare / Astro imports) so they can be unit-tested with bun.
 */

/** Wait this long before the cron picks up a `new` lead (the submit path routes it first). */
export const AUTO_ROUTE_GRACE_MINUTES = 5;
/** Remind an operator once about an offered lead they have not unlocked. */
export const REMINDER_AFTER_HOURS = 20;
/** Widen an unbought lead to alternate operators after this long. */
export const EXPAND_AFTER_HOURS = 24;
/** Close leads nobody bought after this long. */
export const EXPIRE_AFTER_DAYS = 10;
/** HQ radius fallback when no operator lists the city as a service area. */
export const HQ_RADIUS_MILES = 50;

export const DEFAULT_EXCLUSIVE_LEAD_PRICE_CENTS = 4000;

const JUNK_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'mailinator.com',
  'guerrillamail.com',
  'sharklasers.com',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
  'tempmail.com',
  'temp-mail.org',
  'dispostable.com',
  'maildrop.cc',
]);

const FREE_MAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'comcast.net',
  'att.net',
  'sbcglobal.net',
  'verizon.net',
  'bellsouth.net',
  'charter.net',
  'cox.net',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'mail.com',
  'zoho.com',
]);

type SuspicionInput = {
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string | null;
  notes?: string | null;
};

/**
 * Reasons to hold a lead instead of selling it. Conservative on purpose: Turnstile,
 * the honeypot and rate limits already catch most bots; this only stops leads an
 * operator would rightly ask a refund for.
 */
export function leadSuspicionReasons(lead: SuspicionInput): string[] {
  const reasons: string[] = [];
  const digits = (lead.seekerPhone ?? '').replace(/\D/g, '');
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (national.length !== 10) {
    reasons.push('phone is not a 10-digit US number');
  } else if (/^(\d)\1{9}$/.test(national) || national === '1234567890' || /^\d{3}555\d{4}$/.test(national)) {
    reasons.push('placeholder phone number');
  }

  const domain = lead.seekerEmail.split('@')[1]?.toLowerCase().trim() ?? '';
  if (!domain || JUNK_EMAIL_DOMAINS.has(domain)) {
    reasons.push('disposable or test email domain');
  }

  const urlCount = (lead.notes ?? '').match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (urlCount >= 2) reasons.push('notes contain multiple links');
  if (/https?:\/\/|www\./i.test(lead.seekerName) || lead.seekerName.length > 80) {
    reasons.push('name looks like spam');
  }
  return reasons;
}

/** First 5-digit ZIP found in a free-text address. */
export function extractZip(addressOrZip: string | null | undefined): string | null {
  const m = (addressOrZip ?? '').match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : null;
}

export type CandidateFacts = {
  id: string;
  claimStatus: string;
  autoUnlockEnabled: boolean;
  hasSavedCard: boolean;
  verificationStatus: string;
  qualityScore: number | null;
  distanceMiles: number | null;
};

/**
 * Sell first to operators who can actually buy: auto-buy enabled, then claimed,
 * then unclaimed (whose offer email doubles as a claim invite).
 */
export function candidateTier(c: CandidateFacts): number {
  if (c.claimStatus === 'approved' && c.autoUnlockEnabled && c.hasSavedCard) return 3;
  if (c.claimStatus === 'approved') return 2;
  return 1;
}

export function rankCandidates<T extends CandidateFacts>(cands: T[]): T[] {
  return [...cands].sort((a, b) => {
    const tier = candidateTier(b) - candidateTier(a);
    if (tier !== 0) return tier;
    const verified =
      Number(b.verificationStatus === 'verified') - Number(a.verificationStatus === 'verified');
    if (verified !== 0) return verified;
    const quality = (b.qualityScore ?? 50) - (a.qualityScore ?? 50);
    if (quality !== 0) return quality;
    const da = a.distanceMiles ?? Number.POSITIVE_INFINITY;
    const db = b.distanceMiles ?? Number.POSITIVE_INFINITY;
    if (da !== db) return da - db;
    return a.id.localeCompare(b.id);
  });
}

function hostOf(website: string | null | undefined): string | null {
  if (!website) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
    return url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Approve a listing claim without review when the claimant has a verified email that
 * is the listing's own email, or is on the listing website's domain (not free mail).
 */
export function claimAutoApprovable(
  operator: { email: string | null; website: string | null },
  verifiedEmails: string[],
): boolean {
  const emails = verifiedEmails.map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length === 0) return false;

  const listingEmail = operator.email?.trim().toLowerCase();
  if (listingEmail && emails.includes(listingEmail)) return true;

  const host = hostOf(operator.website);
  if (!host) return false;
  return emails.some((email) => {
    const domain = email.split('@')[1];
    if (!domain || FREE_MAIL_DOMAINS.has(domain)) return false;
    return domain === host || host.endsWith(`.${domain}`) || domain.endsWith(`.${host}`);
  });
}

export function clampWeeklyCap(raw: unknown): number {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return 10;
  return Math.min(100, Math.max(1, n));
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** HMAC-SHA256 signature for one-click links (unsubscribe). */
export async function signLinkValue(secret: string, purpose: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${purpose}:${value}`));
  return toHex(sig).slice(0, 32);
}

export async function verifyLinkValue(
  secret: string,
  purpose: string,
  value: string,
  signature: string,
): Promise<boolean> {
  const expected = await signLinkValue(secret, purpose, value);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

export function hoursAgoIso(hours: number, now = Date.now()): string {
  return new Date(now - hours * 60 * 60 * 1000).toISOString();
}

/**
 * `created_at` columns default to SQLite `datetime('now')` ("YYYY-MM-DD HH:MM:SS"), while
 * JS-written columns (offered_at, unlocked_at) are ISO ("...T...Z"). String comparison
 * between the two formats is wrong on the same calendar day (' ' < 'T'), so compare
 * `created_at` against this format.
 */
export function hoursAgoSqlite(hours: number, now = Date.now()): string {
  return hoursAgoIso(hours, now).replace('T', ' ').slice(0, 19);
}
