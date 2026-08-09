import { UTM } from './constants';

/**
 * Append UTM parameters to an external URL so we can attribute
 * referral traffic back to this directory.
 *
 * Only modifies absolute http/https URLs. Returns the original value
 * for null/relative/malformed inputs.
 */
export function withUtm(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // Only tag real web links
    if (!/^https?:$/.test(u.protocol)) return url;

    u.searchParams.set('utm_source', UTM.source);
    u.searchParams.set('utm_medium', UTM.medium);
    u.searchParams.set('utm_campaign', UTM.campaign);
    return u.toString();
  } catch {
    // Not a valid absolute URL — leave it alone
    return url;
  }
}
