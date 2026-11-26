import { defineMiddleware, sequence } from 'astro:middleware';
import { isLocalAdminBypass, verifyAccessJwt } from './lib/access';
import { loadSession, loginPath } from './lib/auth';

/**
 * Admin routes:
 * - Local: ADMIN_BYPASS=1 AND Astro DEV mode only
 * - Production: verified Cloudflare Access JWT (CF_ACCESS_TEAM_DOMAIN + CF_ACCESS_AUD)
 *
 * Never trust Cf-Access-Authenticated-User-Email alone — that header is forgeable
 * if Access is not enforced in front of the Worker.
 */
const adminGuard = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isAdmin = path.startsWith('/admin');

  if (isAdmin) {
    if (isLocalAdminBypass()) {
      context.locals.adminEmail = 'local-dev';
      return next();
    }

    const verified = await verifyAccessJwt(context.request);
    if (!verified.ok) {
      return new Response(
        `Admin access denied: ${verified.error}\n\nLocal development: set ADMIN_BYPASS=1 in .dev.vars and run \`astro dev\`.`,
        { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      );
    }
    context.locals.adminEmail = verified.email;
  }

  return next();
});

/** Webhooks must work even if WorkOS is unconfigured or down. */
const NO_SESSION_PATHS = new Set(['/api/stripe/webhook', '/api/resend/inbound', '/api/workos/webhook']);

/**
 * Operator sign-in (WorkOS AuthKit). Loads the session on every page so the header can show
 * the signed-in state; /portal requires a user and an active company (organization).
 */
const operatorAuth = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  context.locals.auth = null;
  if (NO_SESSION_PATHS.has(path)) return next();

  try {
    context.locals.auth = await loadSession(context.cookies, context.url);
  } catch (err) {
    console.error('[auth] could not load session', err);
  }

  if (path === '/portal' || path.startsWith('/portal/')) {
    const auth = context.locals.auth;
    if (!auth) {
      return context.redirect(loginPath(context.url.pathname + context.url.search));
    }
    if (!auth.orgId && path !== '/portal/select-org') {
      return context.redirect('/portal/select-org');
    }
  }
  return next();
});

export const onRequest = sequence(adminGuard, operatorAuth);
