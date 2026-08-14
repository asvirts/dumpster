import { env } from 'cloudflare:workers';

/**
 * Optional Turnstile. If TURNSTILE_SECRET is unset, verification is skipped
 * (honeypot + rate limit still apply). When the secret is set, fail closed.
 */
export async function verifyTurnstile(opts: {
  token?: string | null;
  ip?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = (env as { TURNSTILE_SECRET?: string }).TURNSTILE_SECRET?.trim();
  if (!secret) return { ok: true };

  const token = opts.token?.trim() ?? '';
  if (!token || token.length > 4096) {
    return { ok: false, error: 'Verification failed. Refresh and try again.' };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (opts.ip) body.set('remoteip', opts.ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) {
      return { ok: false, error: 'Verification failed. Refresh and try again.' };
    }
    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, error: 'Verification failed. Refresh and try again.' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[turnstile] siteverify failed', err);
    return { ok: false, error: 'Verification failed. Refresh and try again.' };
  }
}

export function turnstileSiteKey(): string {
  return (
    (env as { PUBLIC_TURNSTILE_SITE_KEY?: string }).PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
    ''
  );
}
