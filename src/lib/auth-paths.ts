// Client-safe auth URL helpers (no WorkOS or worker imports).

/** Only same-site paths, so a crafted returnTo can't send users off-site. */
export function safeReturnTo(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  return value;
}

/** Sign-in URL for links and redirects; `returnTo` is where the user lands afterwards. */
export function loginPath(returnTo: string, opts: { signUp?: boolean } = {}): string {
  const q = new URLSearchParams({ returnTo });
  if (opts.signUp) q.set('screenHint', 'sign-up');
  return `/auth/login?${q}`;
}
