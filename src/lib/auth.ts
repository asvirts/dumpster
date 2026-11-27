import { env } from 'cloudflare:workers';
import { WorkOS, type User } from '@workos-inc/node';
import type { CookieJar } from './cookies';

export { loginPath, safeReturnTo } from './auth-paths';

/**
 * WorkOS AuthKit session handling.
 *
 * Sign-in is hosted by AuthKit (/auth/login → WorkOS → /auth/callback). The session is a
 * sealed (encrypted) cookie holding the access + refresh tokens. Operator companies are
 * WorkOS organizations; the session's organizationId is the "active company".
 */

export const SESSION_COOKIE = 'wos-session';
export const STATE_COOKIE = 'wos-state';

export type AuthSession = {
  userId: string;
  sessionId: string;
  /** Active WorkOS organization (operator company), if one is selected. */
  orgId: string | null;
  user: User;
};

type AuthEnv = {
  WORKOS_API_KEY?: string;
  WORKOS_CLIENT_ID?: string;
  WORKOS_COOKIE_PASSWORD?: string;
};

let client: WorkOS | null = null;

function authEnv(): AuthEnv {
  return env as AuthEnv;
}

/** True when the WorkOS keys needed for sign-in are present. */
export function authConfigured(): boolean {
  const e = authEnv();
  return Boolean(e.WORKOS_API_KEY && e.WORKOS_CLIENT_ID && e.WORKOS_COOKIE_PASSWORD);
}

export function workos(): WorkOS {
  const e = authEnv();
  if (!e.WORKOS_API_KEY || !e.WORKOS_CLIENT_ID) {
    throw new Error('WorkOS is not configured (WORKOS_API_KEY / WORKOS_CLIENT_ID).');
  }
  client ??= new WorkOS(e.WORKOS_API_KEY, { clientId: e.WORKOS_CLIENT_ID });
  return client;
}

export function cookiePassword(): string {
  const pw = authEnv().WORKOS_COOKIE_PASSWORD;
  if (!pw || pw.length < 32) {
    throw new Error('WORKOS_COOKIE_PASSWORD must be set (at least 32 characters).');
  }
  return pw;
}

/** Must match a Redirect URI registered on the WorkOS environment exactly. */
export function redirectUri(url: URL): string {
  return `${url.origin}/auth/callback`;
}

export function setSessionCookie(cookies: CookieJar, url: URL, sealed: string): void {
  cookies.set(SESSION_COOKIE, sealed, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    // Matches the environment's max session length (1 year); WorkOS enforces the real expiry.
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function clearSessionCookie(cookies: CookieJar): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

function toSession(r: {
  user: User;
  sessionId: string;
  organizationId?: string;
}): AuthSession {
  return {
    userId: r.user.id,
    sessionId: r.sessionId,
    orgId: r.organizationId ?? null,
    user: r.user,
  };
}

/**
 * Read the session cookie. Refreshes an expired access token and rewrites the cookie;
 * clears the cookie when the session is gone for good.
 */
export async function loadSession(cookies: CookieJar, url: URL): Promise<AuthSession | null> {
  const sealed = cookies.get(SESSION_COOKIE);
  if (!sealed || !authConfigured()) return null;

  const session = workos().userManagement.loadSealedSession({
    sessionData: sealed,
    cookiePassword: cookiePassword(),
  });

  const auth = await session.authenticate();
  if (auth.authenticated) return toSession(auth);
  // An expired access token (invalid_jwt) can be refreshed; anything else is a dead cookie.
  if ((auth.reason as string) !== 'invalid_jwt') {
    clearSessionCookie(cookies);
    return null;
  }

  const refreshed = await session.refresh();
  if (refreshed.authenticated && refreshed.sealedSession) {
    setSessionCookie(cookies, url, refreshed.sealedSession);
    return toSession(refreshed);
  }
  // A retryable failure (timeout, 5xx, 429) keeps the cookie for the next request.
  if (!refreshed.authenticated && !refreshed.retryable) clearSessionCookie(cookies);
  return null;
}

/**
 * Make `organizationId` the session's active company. WorkOS refuses organizations the
 * user is not an active member of, so this doubles as the membership check.
 */
export async function switchOrganization(
  cookies: CookieJar,
  url: URL,
  organizationId: string,
): Promise<boolean> {
  const sealed = cookies.get(SESSION_COOKIE);
  if (!sealed) return false;
  const session = workos().userManagement.loadSealedSession({
    sessionData: sealed,
    cookiePassword: cookiePassword(),
  });
  const refreshed = await session.refresh({ organizationId });
  if (!refreshed.authenticated || !refreshed.sealedSession) return false;
  setSessionCookie(cookies, url, refreshed.sealedSession);
  return true;
}

/** Name of an organization, or null if it can't be loaded. */
export async function organizationName(orgId: string | null | undefined): Promise<string | null> {
  if (!orgId || !authConfigured()) return null;
  try {
    return (await workos().organizations.getOrganization(orgId)).name;
  } catch (err) {
    console.warn('[auth] could not load organization', orgId, err);
    return null;
  }
}
