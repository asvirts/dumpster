import { defineMiddleware, sequence } from 'astro:middleware';
import { clerkMiddleware } from '@clerk/astro/server';
import { env } from 'cloudflare:workers';

/**
 * Admin routes are protected by Cloudflare Access in production.
 * Locally, ADMIN_BYPASS=1 in .dev.vars allows unrestricted access.
 * We also capture Access email when present for audit trails.
 */
const adminGuard = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isAdmin = path.startsWith('/admin');

  if (isAdmin) {
    const bypass = env.ADMIN_BYPASS === '1' || import.meta.env.DEV;
    const accessEmail =
      context.request.headers.get('Cf-Access-Authenticated-User-Email') ?? undefined;

    if (!bypass && !accessEmail) {
      return new Response(
        'Admin access requires Cloudflare Access. For local development set ADMIN_BYPASS=1 in .dev.vars.',
        { status: 401, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    context.locals.adminEmail = accessEmail ?? 'local-dev';
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
