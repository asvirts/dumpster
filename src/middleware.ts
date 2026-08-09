import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';

/**
 * Admin routes are protected by Cloudflare Access in production.
 * Locally, ADMIN_BYPASS=1 in .dev.vars allows unrestricted access.
 * We also capture Access email when present for audit trails.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isAdmin = path.startsWith('/admin');

  if (isAdmin) {
    const bypass = env.ADMIN_BYPASS === '1' || import.meta.env.DEV;
    const accessEmail =
      context.request.headers.get('Cf-Access-Authenticated-User-Email') ?? undefined;

    if (!bypass && !accessEmail) {
      // In production without Access headers, block.
      // When Access is configured, unauthenticated users never reach the Worker.
      return new Response(
        'Admin access requires Cloudflare Access. For local development set ADMIN_BYPASS=1 in .dev.vars.',
        { status: 401, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    context.locals.adminEmail = accessEmail ?? 'local-dev';
  }

  return next();
});
