/** Pure helpers for replies received through Resend Inbound. No env, no DB. */

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSvixPayload(secret: string, id: string, timestamp: string, body: string): Promise<string> {
  const keyBytes = base64ToBytes(secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret);
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${timestamp}.${body}`));
  return bytesToBase64(new Uint8Array(sig));
}

/**
 * Resend signs webhooks the Svix way: HMAC-SHA256 over `${svix-id}.${svix-timestamp}.${rawBody}`
 * with the base64 key after `whsec_`; `svix-signature` is a space-separated list of `v1,<base64>`.
 */
export async function verifySvixSignature(
  secret: string,
  headers: { id: string | null; timestamp: string | null; signature: string | null },
  rawBody: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<boolean> {
  const { id, timestamp, signature } = headers;
  if (!secret || !id || !timestamp || !signature) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSeconds - ts) > SIGNATURE_TOLERANCE_SECONDS) return false;
  let expected: string;
  try {
    expected = await signSvixPayload(secret, id, timestamp, rawBody);
  } catch {
    return false;
  }
  return signature
    .split(' ')
    .map((part) => part.split(','))
    .some(([version, sig]) => version === 'v1' && !!sig && constantTimeEqual(sig, expected));
}

/** The new part of a reply: drops quoted lines and everything from "On … wrote:" / forwarded headers down. */
export function stripQuotedReply(text: string | null | undefined): string {
  const lines = (text ?? '').replace(/\r\n/g, '\n').split('\n');
  const kept: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (/^On .+wrote:$/i.test(t) || /^-{2,}\s*Original Message\s*-{2,}$/i.test(t) || /^From: .+/.test(t)) break;
    if (t === '--' || t === '-- ') break;
    if (t.startsWith('>')) continue;
    kept.push(line);
  }
  return kept.join('\n').trim();
}

/** Short "take me off the list" replies. Long messages that merely mention it are left for a human. */
export function isUnsubscribeRequest(subject: string | null | undefined, replyText: string): boolean {
  const body = replyText.trim();
  if (/^(stop|unsubscribe|remove)\.?$/i.test(body)) return true;
  if (body.length > 400) return false;
  const pattern =
    /\b(unsubscribe|remove me|remove us|take me off|take us off|stop (sending|emailing)|do not (email|contact)|don'?t (email|contact)|opt[- ]?out)\b/i;
  return pattern.test(body) || /^\s*(unsubscribe|remove me|stop)\b/i.test(subject ?? '');
}

/** Out-of-office and other machine replies. */
export function isAutoReply(subject: string | null | undefined, headers: Record<string, string> | null | undefined): boolean {
  const h = Object.fromEntries(Object.entries(headers ?? {}).map(([k, v]) => [k.toLowerCase(), String(v)]));
  const autoSubmitted = h['auto-submitted'];
  if (autoSubmitted && autoSubmitted.toLowerCase() !== 'no') return true;
  if (h['x-autoreply'] || h['x-autorespond'] || /^(auto_reply|bulk|junk|list)$/i.test(h['precedence'] ?? '')) return true;
  return /^(auto(matic)?[ -]?reply|out of (the )?office|autoreply|away:|undeliverable|delivery status notification)/i.test(
    (subject ?? '').trim(),
  );
}

/** "Jane <jane@x.com>" or "jane@x.com" → lowercase address. */
export function parseEmailAddress(raw: string | null | undefined): string | null {
  const m = (raw ?? '').match(/<([^>]+)>/) ?? (raw ?? '').match(/([^\s<>"]+@[^\s<>"]+)/);
  return m ? m[1].trim().toLowerCase() : null;
}
