import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

/** The cookie operations src/lib needs, so it stays independent of the request framework. */
export interface CookieJar {
  get(name: string): string | undefined;
  set(
    name: string,
    value: string,
    opts: { path?: string; httpOnly?: boolean; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean; maxAge?: number },
  ): void;
  delete(name: string, opts?: { path?: string }): void;
}

const SAME_SITE = { lax: 'Lax', strict: 'Strict', none: 'None' } as const;

/** Cookie jar over a Void (Hono) request context. */
export function cookieJar(c: Context): CookieJar {
  return {
    get: (name) => getCookie(c, name),
    set: (name, value, opts) =>
      setCookie(c, name, value, {
        ...opts,
        sameSite: opts.sameSite ? SAME_SITE[opts.sameSite] : undefined,
      }),
    delete: (name, opts) => {
      deleteCookie(c, name, opts);
    },
  };
}
