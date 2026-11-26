import { defineMiddleware, type CloudContext, type HeadConfig } from 'void';
import { isLocalAdminBypass, verifyAccessJwt } from '../lib/access';
import { BRAND } from '../lib/constants';

declare module 'void' {
  interface CloudContextVariables {
    /** Admin identity for /admin* (Access JWT email, or 'local-dev' under the local bypass). */
    adminEmail: string;
    /**
     * Result of an admin action that re-renders the page instead of redirecting
     * (Astro rendered these inline on POST). The page's loader reads it.
     */
    adminResult: Record<string, unknown>;
  }
}

/**
 * Per-route guard for /admin* (port of `adminGuard` from the Astro middleware).
 * - Local: ADMIN_BYPASS=1 AND Vite dev (`import.meta.env.DEV`, true under `void dev`,
 *   false in a production build) only.
 * - Production: verified Cloudflare Access JWT (CF_ACCESS_TEAM_DOMAIN + CF_ACCESS_AUD).
 *
 * Never trust Cf-Access-Authenticated-User-Email alone: that header is forgeable
 * if Access is not enforced in front of the Worker.
 *
 * Use first in every admin loader and action: `defineHandler(adminGuard, handler)`.
 */
export const adminGuard = defineMiddleware(async (c, next) => {
  if (isLocalAdminBypass()) {
    c.set('adminEmail', 'local-dev');
    return next();
  }

  const verified = await verifyAccessJwt(c.req.raw);
  if (!verified.ok) {
    return new Response(
      `Admin access denied: ${verified.error}\n\nLocal development: set ADMIN_BYPASS=1 in .env and run \`pnpm dev\`.`,
      { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
  c.set('adminEmail', verified.email);
  return next();
});

/** Audit actor, as Astro's `Astro.locals.adminEmail ?? 'admin'`. */
export function adminActor(c: CloudContext): string {
  return c.get('adminEmail') ?? 'admin';
}

/** Hand an action's result to the re-rendered page (read it in the loader). */
export function setAdminResult(c: CloudContext, result: Record<string, unknown>): void {
  c.set('adminResult', result);
}

export function getAdminResult(c: CloudContext): Record<string, unknown> | undefined {
  return c.get('adminResult');
}

/** <head> of the Astro AdminLayout: `{title} · Admin · {brand}`, noindex. */
export function adminHead(title: string): HeadConfig {
  return {
    title: `${title} · Admin · ${BRAND.name}`,
    titleTemplate: '',
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    bodyAttrs: { class: 'min-h-screen bg-slate-100 text-ink antialiased' },
  };
}
