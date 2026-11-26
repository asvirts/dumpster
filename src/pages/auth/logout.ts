import type { APIRoute } from 'astro';
import {
  authConfigured,
  clearSessionCookie,
  cookiePassword,
  SESSION_COOKIE,
  workos,
} from '../../lib/auth';

/** POST only (Astro's origin check covers CSRF). Ends the WorkOS session too. */
export const POST: APIRoute = async ({ url, cookies, redirect }) => {
  const sealed = cookies.get(SESSION_COOKIE)?.value;
  clearSessionCookie(cookies);
  if (!sealed || !authConfigured()) return redirect('/');

  try {
    const logoutUrl = await workos()
      .userManagement.loadSealedSession({ sessionData: sealed, cookiePassword: cookiePassword() })
      .getLogoutUrl({ returnTo: `${url.origin}/` });
    return redirect(logoutUrl);
  } catch (err) {
    // Session already invalid: clearing the cookie is enough.
    console.warn('[auth] logout URL unavailable', err);
    return redirect('/');
  }
};
