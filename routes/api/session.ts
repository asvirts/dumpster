import { defineHandler } from 'void';
import { loadSession, organizationName } from '../../src/lib/auth';
import { cookieJar } from '../../src/lib/cookies';

/**
 * Who is signed in, for islands on cached (anonymous) public pages: the operator page's claim box
 * renders signed out on the server and asks here after hydration. Never cached.
 */
export const GET = defineHandler(async (c) => {
  const auth = await loadSession(cookieJar(c), new URL(c.req.url));
  const orgName = auth?.orgId ? await organizationName(auth.orgId) : null;
  c.header('Cache-Control', 'private, no-store');
  c.header('X-Robots-Tag', 'noindex');
  return c.json({ signedIn: Boolean(auth), hasOrg: Boolean(auth?.orgId), orgName });
});
