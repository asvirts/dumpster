import { defineHandler } from 'void';
import type { Href } from 'void/routes';
import { authConfigured, clearSessionCookie, cookiePassword, SESSION_COOKIE, workos } from '../../src/lib/auth';
import { cookieJar } from '../../src/lib/cookies';

const FORM_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];

/**
 * POST only. Replicates Astro's origin check (CSRF): a form POST from another origin gets
 * 403. Void checks origins for page actions only, not for routes/. Ends the WorkOS session too.
 */
export const POST = defineHandler(async (c) => {
  const url = new URL(c.req.url);
  const contentType = (c.req.header('content-type') ?? '').split(';')[0]!.trim().toLowerCase();
  if (FORM_TYPES.includes(contentType) && c.req.header('origin') !== url.origin) {
    return c.body('Cross-site POST form submissions are forbidden', 403);
  }

  const cookies = cookieJar(c);
  const sealed = cookies.get(SESSION_COOKIE);
  clearSessionCookie(cookies);
  if (!sealed || !authConfigured()) return c.redirect('/');

  try {
    const logoutUrl = await workos()
      .userManagement.loadSealedSession({ sessionData: sealed, cookiePassword: cookiePassword() })
      .getLogoutUrl({ returnTo: `${url.origin}/` });
    return c.redirect(logoutUrl as Href);
  } catch (err) {
    // Session already invalid: clearing the cookie is enough.
    console.warn('[auth] logout URL unavailable', err);
    return c.redirect('/');
  }
});
