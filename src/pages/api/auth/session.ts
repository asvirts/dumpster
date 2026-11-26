import type { APIRoute } from 'astro';

/**
 * Client-safe session snapshot (no tokens) for the AuthKit client store. Only
 * prerendered pages (guides, 404) use it, to show signed-in header controls.
 */
export const GET: APIRoute = ({ locals }) => {
  const auth = locals.auth;
  const user = auth?.user ?? null;
  return Response.json(
    {
      user,
      sessionId: user ? auth.sessionId : null,
      organizationId: auth?.organizationId ?? null,
      role: auth?.role ?? null,
      roles: auth?.roles ?? [],
      permissions: auth?.permissions ?? [],
      entitlements: auth?.entitlements ?? [],
      featureFlags: auth?.featureFlags ?? [],
      impersonator: auth?.impersonator ?? null,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
};
