import type { CloudContext } from 'void';
import type { RouteUrl } from 'void/routes';
import { cookieJar } from '../lib/cookies';
import type { FormFeedback } from './shared';

/**
 * Post/redirect/get for public form actions on island pages.
 *
 * Void answers a page action on an island page with JSON (`{ success: true }`, or 422 errors) for
 * `useIslandForm`'s fetch() instead of re-rendering the page, so a native no-JS form post would
 * land on raw JSON. The actions therefore store their feedback in a short-lived cookie and 303 back
 * to the page; the loader reads (and clears) it. Requests with a Cookie bypass the ISR cache and a
 * Set-Cookie response is never cached, so the feedback render stays private to that browser.
 */

const FLASH_COOKIE = 'fd_form_flash';
const MAX_ENCODED = 3500; // stay under the ~4 KB per-cookie limit

/** Named page actions; stripped from the query when building action URLs and redirects. */
export const ACTION_KEYS = new Set(['submitQuote', 'claimListing']);

/** Current query string without action names (`?submitQuote&q=x` → `q=x`). */
export function pageQuery(url: URL): string {
  const params = new URLSearchParams(url.search);
  for (const key of ACTION_KEYS) params.delete(key);
  return params.toString();
}

function encode(fb: FormFeedback): string {
  return encodeURIComponent(JSON.stringify(fb));
}

/** Store the action's feedback (set with setFeedback) and redirect (303) back to the page. */
export function redirectWithFeedback(c: CloudContext, hash?: string): Response {
  const url = new URL(c.req.url);
  const fb = c.get('shared')?.feedback;
  if (fb) {
    let value = encode(fb);
    if (value.length > MAX_ENCODED && fb.values?.notes) {
      const { notes: _notes, ...values } = fb.values;
      value = encode({ ...fb, values });
    }
    if (value.length > MAX_ENCODED) value = encode({ ...fb, values: undefined });
    // hono/cookie encodes the value itself; hand it the raw JSON.
    cookieJar(c).set(FLASH_COOKIE, decodeURIComponent(value), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: 120,
    });
  }
  const rest = pageQuery(url);
  // Same page the action was posted to (typedRoutes can't check a runtime path).
  return c.redirect(`${url.pathname}${rest ? `?${rest}` : ''}${hash ? `#${hash}` : ''}` as RouteUrl, 303);
}

/** Feedback for one form: from the action in this request, else from the flash cookie (consumed). */
export function readFeedback(c: CloudContext, form: string): FormFeedback | null {
  const current = c.get('shared')?.feedback;
  if (current) return current.form === form ? current : null;
  const jar = cookieJar(c);
  const raw = jar.get(FLASH_COOKIE);
  if (!raw) return null;
  let fb: FormFeedback | null = null;
  try {
    const parsed = JSON.parse(raw) as FormFeedback;
    if (parsed && typeof parsed.form === 'string' && typeof parsed.ok === 'boolean') fb = parsed;
  } catch {
    /* ignore a malformed cookie */
  }
  if (!fb || fb.form === form) jar.delete(FLASH_COOKIE, { path: '/' });
  return fb && fb.form === form ? fb : null;
}
