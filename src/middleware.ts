import { defineMiddleware, sequence } from 'astro:middleware';
import { clerkMiddleware } from '@clerk/astro/server';
import { isLocalAdminBypass, verifyAccessJwt } from './lib/access';

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

const clerkAuth = clerkMiddleware((auth, context, next) => {
  const path = context.url.pathname;
  const isPortal = path.startsWith('/portal');
  if (isPortal) {
    const { userId, orgId, redirectToSignIn } = auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: context.url.href });
    }
    if (!orgId && path !== '/portal/select-org') {
      return context.redirect('/portal/select-org');
    }
  }
  return next();
});

export const onRequest = sequence(adminGuard, clerkAuth);
