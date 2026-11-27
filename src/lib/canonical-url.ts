/** Production host. Every other public host (www, workers.dev, preview URLs) redirects here. */
export const CANONICAL_HOST = 'findadumpster.net';

/** Public sections whose slugs are always lowercase. Admin and portal ids are case-sensitive. */
const LOWERCASE_PREFIXES = ['/dumpster-rental/', '/operator/', '/guides/'];

function isAliasHost(hostname: string): boolean {
  return hostname === `www.${CANONICAL_HOST}` || hostname.endsWith('.workers.dev');
}

/**
 * Where a page request should 301 to so every page has one URL: https, the canonical host, no
 * trailing slash, lowercase public slugs. Returns null when the URL is already canonical.
 * Localhost keeps its host and scheme, so the path rules can be tried in development.
 * Only GET and HEAD redirect: form posts (page actions) keep working on any URL.
 */
export function canonicalRedirect(requestUrl: string, method: string): string | null {
  if (method !== 'GET' && method !== 'HEAD') return null;
  const url = new URL(requestUrl);
  const target = new URL(url.href);

  if (isAliasHost(url.hostname)) {
    target.protocol = 'https:';
    target.host = CANONICAL_HOST;
  } else if (url.hostname === CANONICAL_HOST && url.protocol === 'http:') {
    target.protocol = 'https:';
  }

  let path = target.pathname;
  if (path.length > 1 && path.endsWith('/')) path = path.replace(/\/+$/, '') || '/';
  if (LOWERCASE_PREFIXES.some((prefix) => path.toLowerCase().startsWith(prefix))) {
    path = path.toLowerCase();
  }
  target.pathname = path;

  return target.href === url.href ? null : target.href;
}
