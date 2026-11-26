import { defineMiddleware, type CloudContext } from 'void';
import type { Href } from 'void/routes';
import { loadSession, loginPath, organizationName, type AuthSession } from '../lib/auth';
import { cookieJar } from '../lib/cookies';
import type { Shared } from './shared';

declare module 'void' {
  interface CloudContextVariables {
    /** WorkOS session of the signed-in operator; set by `portalGuard` on /portal* routes. */
    auth: AuthSession;
  }
}

/**
 * Shared data on portal pages. `orgName` is extra (the portal layout's company switcher);
 * it and `hasOrg` aren't on `Shared` yet, so the portal layout reads it through this type.
 */
/** Kept as an alias; Shared now carries the portal fields. */
export type PortalShared = Shared;

/** The session set by `portalGuard`. Only call from handlers that run after the guard. */
export function portalAuth(c: CloudContext): AuthSession {
  return c.get('auth');
}

/**
 * Current URL for the sign-in returnTo. Drops the bare `?actionName` key of a page action,
 * so signing in after a rejected POST lands back on the page (as Astro's returnTo did).
 */
function returnPath(url: URL, method: string): string {
  if (method === 'GET' || method === 'HEAD' || !url.search) return url.pathname + url.search;
  const parts = url.search
    .slice(1)
    .split('&')
    .filter((p, i) => !(i === 0 && p && !p.includes('=')));
  return url.pathname + (parts.length ? `?${parts.join('&')}` : '');
}

/**
 * Per-route guard for /portal* loaders and actions (replaces Astro's `operatorAuth`
 * middleware): requires a signed-in user and, except on /portal/select-org, an active
 * company. Also seeds the shared data (`withShared` is not needed alongside it).
 */
export const portalGuard = defineMiddleware(async (c, next) => {
  const url = new URL(c.req.url);
  let auth: AuthSession | null = null;
  try {
    // May refresh an expired access token and rewrite the session cookie.
    auth = await loadSession(cookieJar(c), url);
  } catch (err) {
    console.error('[auth] could not load session', err);
  }

  if (!auth) {
    return c.redirect(loginPath(returnPath(url, c.req.method)) as Href);
  }
  if (!auth.orgId && url.pathname !== '/portal/select-org') {
    return c.redirect('/portal/select-org' as Href);
  }

  c.set('auth', auth);
  const shared: PortalShared = {
    ...c.get('shared'),
    path: url.pathname,
    search: url.search,
    userEmail: auth.user.email,
    hasOrg: Boolean(auth.orgId),
    orgName: await organizationName(auth.orgId),
  };
  c.set('shared', shared);
  await next();
});
