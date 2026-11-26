import { configureAuthKit } from '@workos/authkit-astro';

let configured: Promise<boolean> | undefined;

/**
 * Configure WorkOS AuthKit from the `astro:env` secrets (wrangler secrets in
 * production, `.dev.vars` locally). Runs once per isolate.
 *
 * Returns false when the WORKOS_* secrets are missing or invalid: the public
 * site keeps working (everyone is signed out) and the sign-in routes answer 503
 * instead of crashing.
 */
export function ensureAuthKit(): Promise<boolean> {
  configured ??= import('astro:env/server').then((env) => {
    try {
      configureAuthKit({
        clientId: env.WORKOS_CLIENT_ID ?? '',
        apiKey: env.WORKOS_API_KEY ?? '',
        redirectUri: env.WORKOS_REDIRECT_URI ?? '',
        cookiePassword: env.WORKOS_COOKIE_PASSWORD ?? '',
      });
      return true;
    } catch (err) {
      console.error('[auth] WorkOS AuthKit is not configured:', (err as Error).message);
      return false;
    }
  });
  return configured;
}

export function authNotConfigured(): Response {
  return new Response('Sign-in is not configured on this deployment (WORKOS_* secrets missing).', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/** Relative, same-site paths only (no open redirects). */
export function safeReturnTo(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  if (/[\x00-\x1f\x7f]/.test(value)) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
}
