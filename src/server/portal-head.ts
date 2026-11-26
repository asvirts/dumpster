import type { HeadConfig } from 'void';
import { BRAND } from '../lib/constants';
import { portalTitle } from '../lib/portal-nav';

/** <head> of the Astro PortalLayout: "{title} · Portal · {brand}", noindex, portal body class. */
export function portalHead(path: string): HeadConfig {
  return {
    title: `${portalTitle(path)} · Portal · ${BRAND.name}`,
    titleTemplate: '',
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    bodyAttrs: { class: 'min-h-screen bg-slate-100 text-ink antialiased' },
  };
}
