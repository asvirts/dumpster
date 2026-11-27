// Void project config. Worker name, D1 binding and vars carried over from the Astro wrangler.jsonc.
// Cron schedules live in crons/*.ts. Migrations stay hand-written in migrations/ and are applied
// by CI with wrangler before `void deploy --skip-migrations`.
import { defineConfig } from 'void/config';

export default defineConfig({
  routing: {
    typedRoutes: true,
    trailingSlash: false,
    // routing.redirects isn't applied on direct Cloudflare deploys: /x/ → /x and the other URL
    // fixes are done per page in withShared (src/lib/canonical-url.ts).
    // Public pages are cached for 5 minutes (ISR). Requests with cookies always bypass the cache.
    // Per-page `revalidate` exports override these patterns.
    revalidate: {
      '/portal/*': 0,
      '/admin/*': 0,
      '/auth/*': 0,
      '/search': 0,
      '/api/*': 0,
      '*': 300,
    },
  },
  head: {
    htmlAttrs: { lang: 'en' },
    bodyAttrs: { class: 'flex min-h-screen flex-col' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#121417' },
    ],
    // Shared by public, portal, admin and error pages. Fonts are self-hosted (src/styles/global.css).
    // Analytics are public-only: seoHead() in src/lib/head.ts adds them, so portal and admin
    // don't send page views.
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    script: [
      {
        // Mobile nav toggle (SiteHeader). Delegated, so it works without hydration.
        innerHTML:
          "document.addEventListener('click',function(e){var t=e.target instanceof Element&&e.target.closest('#nav-toggle');if(!t)return;var p=document.getElementById('mobile-nav');if(!p)return;var open=p.classList.toggle('hidden')===false;t.setAttribute('aria-expanded',String(open));});",
      },
    ],
  },
  worker: {
    compatibility_date: '2025-10-01',
    // global_fetch_strictly_public: Worker-to-assets same-zone fetch on workers.dev (error 1042 without it).
    compatibility_flags: ['nodejs_compat', 'global_fetch_strictly_public'],
    vars: {
      PUBLIC_SITE_NAME: 'Find A Dumpster',
      PUBLIC_SITE_URL: 'https://findadumpster.net',
      // WorkOS "Find A Dumpster" Production environment (public client ID).
      // Secrets: WORKOS_API_KEY, WORKOS_COOKIE_PASSWORD. Local .env overrides with Staging.
      WORKOS_CLIENT_ID: 'client_01M8CSW40W3D5M2EFCETV42KTD',
      LEAD_FROM_EMAIL: 'Find A Dumpster <leads@findadumpster.net>',
      // Replies land in Resend Inbound → /api/resend/inbound → /admin/replies.
      LEAD_REPLY_TO: 'leads@eeildoiint.resend.app',
    },
  },
  cloudflare: {
    name: 'findadumpster',
    // void deploy refuses to republish unless these are declared. www only redirects to the apex
    // (src/lib/canonical-url.ts); workers.dev and preview URLs are off so search engines see one host.
    routes: [
      { pattern: 'findadumpster.net', custom_domain: true },
      { pattern: 'www.findadumpster.net', custom_domain: true },
    ],
    workers_dev: false,
    preview_urls: false,
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'dumpsterlocal',
        database_id: '1c8dbaa7-18c4-4120-ae94-a47c97ac3717',
        // No migrations_dir here: `void deploy` refuses any dir but its own db/migrations.
        // Migrations run through wrangler.d1.jsonc (`pnpm db:migrate:remote`) before deploy.
      },
    ],
  },
});
