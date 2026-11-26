import type { APIRoute } from 'astro';
import {
  cookiePassword,
  safeReturnTo,
  setSessionCookie,
  STATE_COOKIE,
  workos,
} from '../../lib/auth';

function fail(message: string, status = 400): Response {
  return new Response(`${message}\n\nTry signing in again: /auth/login`, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/** AuthKit redirects here with ?code=…; this must match the registered Redirect URI. */
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const error = url.searchParams.get('error');
  if (error) {
    return fail(`Sign-in failed: ${url.searchParams.get('error_description') || error}`);
  }

  const code = url.searchParams.get('code');
  if (!code) return fail('Missing authorization code.');

  const [nonce, ...rest] = (url.searchParams.get('state') ?? '').split(':');
  const expected = cookies.get(STATE_COOKIE)?.value;
  cookies.delete(STATE_COOKIE, { path: '/auth' });
  if (!nonce || !expected || nonce !== expected) {
    return fail('Sign-in expired or was started in another browser.');
  }
  const returnTo = safeReturnTo(rest.join(':'), '/portal');

  try {
    const { sealedSession } = await workos().userManagement.authenticateWithCode({
      code,
      session: { sealSession: true, cookiePassword: cookiePassword() },
    });
    if (!sealedSession) return fail('Sign-in did not return a session.', 500);
    setSessionCookie(cookies, url, sealedSession);
  } catch (err) {
    console.error('[auth] code exchange failed', err);
    return fail('Could not complete sign-in.', 500);
  }

  return redirect(returnTo);
};
