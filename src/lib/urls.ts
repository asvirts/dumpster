/**
 * Safe external URL helpers — prevent javascript:/data: href XSS and bad links.
 */

/** True only for absolute http(s) URLs. */
export function isSafeHttpUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize user-supplied website fields.
 * Returns null if empty or not a safe http(s) absolute URL.
 * Adds https:// when the value looks like a bare host (example.com).
 */
export function sanitizeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let raw = url.trim();
  if (!raw) return null;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) {
    raw = `https://${raw}`;
  }
  if (!isSafeHttpUrl(raw)) return null;
  try {
    return new URL(raw).toString();
  } catch {
    return null;
  }
}

/**
 * Escape JSON for embedding in <script type="application/ld+json"> so that
 * a payload cannot break out via </script> (JSON.stringify does not escape <).
 */
export function safeJsonLdStringify(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
