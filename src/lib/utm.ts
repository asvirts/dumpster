import { UTM } from './constants';
import { isSafeHttpUrl, sanitizeHttpUrl } from './urls';

/**
 * Append UTM parameters to an external URL so we can attribute
 * referral traffic back to this directory.
 *
 * Only returns absolute http(s) URLs. Unsafe schemes (javascript:, data:, etc.)
 * and malformed values become null so they are never used in href.
 */
export function withUtm(url: string | null | undefined): string | null {
  const safe = sanitizeHttpUrl(url);
  if (!safe || !isSafeHttpUrl(safe)) return null;
  try {
    const u = new URL(safe);
    u.searchParams.set('utm_source', UTM.source);
    u.searchParams.set('utm_medium', UTM.medium);
    u.searchParams.set('utm_campaign', UTM.campaign);
    return u.toString();
  } catch {
    return null;
  }
}
