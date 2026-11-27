import { defineMiddleware, type CloudContext } from 'void';
import type { Href } from 'void/routes';
import { CANONICAL_HOST, canonicalRedirect } from '../lib/canonical-url';

/** Form state a public page action hands back to the re-rendered page (no-JS forms). */
export type FormFeedback = {
  /** Which form on the page this is for, e.g. 'quote' or 'claim'. */
  form: string;
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

export type Shared = {
  path: string;
  search: string;
  /** Signed-in operator's email (portal pages only; public pages are anonymous). */
  userEmail?: string | null;
  /** Portal only: active company name and whether one is selected (company switcher). */
  orgName?: string | null;
  hasOrg?: boolean;
  feedback?: FormFeedback | null;
};

declare module 'void' {
  interface CloudContextVariables {
    shared: Shared;
  }
}

/**
 * Per-route middleware (not global, see Void #808) that seeds shared data for the layout.
 * Use as the first argument of `defineHandler(withShared, loader)`.
 */
export const withShared = defineMiddleware(async (c, next) => {
  // One URL per page: https, canonical host, no trailing slash, lowercase slugs. Done here, not in
  // routing.redirects (not applied on direct Cloudflare deploys) or global middleware (Void #808).
  const redirectTo = canonicalRedirect(c.req.url, c.req.method);
  if (redirectTo) return c.redirect(redirectTo as Href, 301);

  const url = new URL(c.req.url);
  c.set('shared', { ...c.get('shared'), path: url.pathname, search: url.search });
  await next();
  if (url.protocol === 'https:' && url.hostname === CANONICAL_HOST) {
    c.header('Strict-Transport-Security', 'max-age=31536000');
  }
});

/** Set form feedback from an action; the page re-renders with it. */
export function setFeedback(c: CloudContext, feedback: FormFeedback): void {
  const url = new URL(c.req.url);
  const prev = c.get('shared') ?? { path: url.pathname, search: url.search };
  c.set('shared', { ...prev, feedback });
}
