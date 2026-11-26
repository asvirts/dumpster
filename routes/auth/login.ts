import { defineHandler } from 'void';
import type { Href } from 'void/routes';
import { authConfigured, loadSession, redirectUri, safeReturnTo, STATE_COOKIE, workos } from '../../src/lib/auth';
import { cookieJar } from '../../src/lib/cookies';

/**
 * Starts AuthKit sign-in. Also registered as the environment's Initiate login URI, so
 * sign-ins that start outside the app (invitations, password resets) come through here.
 */
export const GET = defineHandler(async (c) => {
  const url = new URL(c.req.url);
  const cookies = cookieJar(c);
  const returnTo = safeReturnTo(url.searchParams.get('returnTo'), '/portal');

  // Astro's middleware loaded the session on every request; already signed in → go on.
  let signedIn = false;
  try {
    signedIn = Boolean(await loadSession(cookies, url));
  } catch (err) {
    console.error('[auth] could not load session', err);
  }
  if (signedIn) return c.redirect(returnTo as Href);

  if (!authConfigured()) {
    return c.body('Sign-in is not configured (WORKOS_* variables are missing).', 503, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
  }

  // Random nonce in a short-lived cookie, echoed back via `state`, blocks login CSRF.
  const nonce = crypto.randomUUID();
  cookies.set(STATE_COOKIE, nonce, {
    path: '/auth',
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    maxAge: 60 * 10,
  });

  const screenHint = url.searchParams.get('screenHint') === 'sign-up' ? 'sign-up' : undefined;
  const authorizationUrl = workos().userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: redirectUri(url),
    state: `${nonce}:${returnTo}`,
    screenHint,
    // Forwarded by AuthKit when it sends an invitation or password reset here.
    invitationToken: url.searchParams.get('invitation_token') ?? undefined,
    loginHint: url.searchParams.get('login_hint') ?? undefined,
  });
  return c.redirect(authorizationUrl as Href);
});
