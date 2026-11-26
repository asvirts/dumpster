import type { APIRoute } from 'astro';
import { authConfigured, redirectUri, safeReturnTo, STATE_COOKIE, workos } from '../../lib/auth';

/**
 * Starts AuthKit sign-in. Also registered as the environment's Initiate login URI, so
 * sign-ins that start outside the app (invitations, password resets) come through here.
 */
export const GET: APIRoute = ({ url, cookies, locals, redirect }) => {
  const returnTo = safeReturnTo(url.searchParams.get('returnTo'), '/portal');
  if (locals.auth) return redirect(returnTo);
  if (!authConfigured()) {
    return new Response('Sign-in is not configured (WORKOS_* variables are missing).', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
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
  return redirect(authorizationUrl);
};
