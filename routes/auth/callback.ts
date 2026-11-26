import type { Context } from 'hono';
import { defineHandler } from 'void';
import type { Href } from 'void/routes';
import { cookiePassword, safeReturnTo, setSessionCookie, STATE_COOKIE, workos } from '../../src/lib/auth';
import { cookieJar } from '../../src/lib/cookies';

// c.body (not new Response) so cookie changes made on the context are kept.
function fail(c: Context, message: string, status: 400 | 500 = 400): Response {
  return c.body(`${message}\n\nTry signing in again: /auth/login`, status, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
}

/** AuthKit redirects here with ?code=…; this must match the registered Redirect URI. */
export const GET = defineHandler(async (c) => {
  const url = new URL(c.req.url);
  const cookies = cookieJar(c);

  const error = url.searchParams.get('error');
  if (error) {
    return fail(c, `Sign-in failed: ${url.searchParams.get('error_description') || error}`);
  }

  const code = url.searchParams.get('code');
  if (!code) return fail(c, 'Missing authorization code.');

  const [nonce, ...rest] = (url.searchParams.get('state') ?? '').split(':');
  const expected = cookies.get(STATE_COOKIE);
  cookies.delete(STATE_COOKIE, { path: '/auth' });
  if (!nonce || !expected || nonce !== expected) {
    return fail(c, 'Sign-in expired or was started in another browser.');
  }
  const returnTo = safeReturnTo(rest.join(':'), '/portal');

  try {
    const { sealedSession } = await workos().userManagement.authenticateWithCode({
      code,
      session: { sealSession: true, cookiePassword: cookiePassword() },
    });
    if (!sealedSession) return fail(c, 'Sign-in did not return a session.', 500);
    setSessionCookie(cookies, url, sealedSession);
  } catch (err) {
    console.error('[auth] code exchange failed', err);
    return fail(c, 'Could not complete sign-in.', 500);
  }

  return c.redirect(returnTo as Href);
});
