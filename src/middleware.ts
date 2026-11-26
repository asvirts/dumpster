import { defineMiddleware, sequence } from 'astro:middleware';
import { authkitMiddleware } from '@workos/authkit-astro';
import { isLocalAdminBypass, verifyAccessJwt } from './lib/access';
import { ensureAuthKit } from './lib/workos';

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

/**
 * WorkOS AuthKit: populates `Astro.locals.auth` and refreshes the session.
 * `/portal` needs a signed-in user with an active organization (operator company).
 */
const portalAuth = authkitMiddleware(
  (auth, context) => {
    const path = context.url.pathname;
    if (path === '/portal' || path.startsWith('/portal/')) {
      if (!auth.user) {
        return auth.redirectToSignIn();
      }
      if (!auth.organizationId && path !== '/portal/select-org') {
        return context.redirect('/portal/select-org');
      }
    }
  },
  { signInPath: '/login' },
);

/** Webhooks must be able to POST here even if WorkOS keys are missing or WorkOS is down. */
const AUTH_EXEMPT_PATHS = new Set(['/api/stripe/webhook', '/api/resend/inbound']);

const workosAuth = defineMiddleware(async (context, next) => {
  if (AUTH_EXEMPT_PATHS.has(context.url.pathname)) {
    return next();
  }
  if (!context.isPrerendered) {
    await ensureAuthKit();
  }
  return (await portalAuth(context, next)) as Response;
});

export const onRequest = sequence(adminGuard, workosAuth);
