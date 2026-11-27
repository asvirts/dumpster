# Rewrite plan: Astro → Void + Vue on Vite+

Agreed 2026-11-26. This file records what the rewrite should do. It does not describe the app as it runs today.

## Why

1. Move build, test, lint and format onto one VoidZero toolchain.
2. Give the operator portal and admin a richer interactive UI.

SEO stays the top priority. Public pages stay lean.

## Stack

| Area | Choice |
|---|---|
| Framework | [Void](https://void.cloud/guide/) + `@void/vue` (VoidZero, Workers-only) |
| Toolchain | Vite+ (`vp`). It bundles Vite 8 (Rolldown), Vitest, Oxlint and Oxfmt. |
| Packages / Node | pnpm via `vp install`, with Node pinned by `vp env`. bun is dropped. |
| Kept as-is | D1 + Drizzle (same database, binding `DB`, `migrations/`), Tailwind v4, MapLibre + OpenFreeMap, WorkOS AuthKit, Stripe, Resend, Cloudflare Access, Turnstile, all third-party scripts |
| Business logic | Port `src/lib` nearly unchanged. Only replace the Astro-specific seams: cookies, `locals` and actions. |
| Removed | Astro, `@astrojs/*`, the unused React, and `scripts/patch-astro-workerd.mjs` |

## Decisions

**Strategy**
- Big-bang rewrite on a branch, then one cutover on the same Worker (`findadumpster`), the same D1 database and the same domain.
- `main` is fully frozen until cutover.

**SEO**
- Exact parity at launch for every public URL, status code, response header, `<title>`, meta tag, canonical and JSON-LD block.
- There is one deliberate change: `routing.trailingSlash: false`, so `/x/` 301-redirects to `/x`. This matches the sitemap and the canonicals.
- SEO improvements ship after cutover as separate changes.

**Public pages** (home, search, city, operator, guides, compare)
- Built as `*.island.vue` pages, so they ship zero JS except for marked islands:
  - the map hydrates when it becomes visible
  - the quote form, claim form and search filters hydrate on load
- They are anonymous: no WorkOS session is read, and the header always shows a generic "Operator login" link.
- Caching uses Void ISR with `revalidate = 300`, and today's `Cache-Control` headers are kept for parity.
  - ISR is skipped for requests that carry cookies.
  - Crawlers and first-time visitors still get cached HTML.

**Forms**
- Public forms work without JS. They are hand-written `<form method="post">` elements that post to Void actions or routes.
- Validation errors come back through `shared` / `useShared()`. Void's `<Form>` component only works with JS.
- Portal and admin forms may require JS.

**Portal and admin**
- Regular hydrated pages using the Void router.
- Auth uses per-route guards (`defineHandler(guard, loader)`), never global middleware.
  - Global middleware would route every asset request through the Worker ([#808](https://github.com/voidzero-dev/void/issues/808)).

**Auth**
- Keep WorkOS AuthKit and port `src/lib/auth.ts`: sealed `wos-session` cookie, orgs as operator companies, and the `organization.deleted` webhook.
- Keep the Cloudflare Access JWT check for `/admin*`.

**Server routes**
- These move to `routes/`:
  - the Stripe, Resend and WorkOS webhooks, which read the raw body with `c.req.text()`
  - `sitemap.xml.ts`
  - `robots.txt.ts`
  - `/api/unsubscribe`
- The Astro Actions become Void actions or routes.

**Guides**
- Keep the markdown files in a content folder.
- A `pages/guides/[slug]` page loads them with `import.meta.glob` and validates frontmatter with the existing zod schema.
- It sets `head()` once and is prerendered with `getPrerenderPaths()`.

**Crons**
- `crons/every-15.ts` (autopilot) and `crons/daily.ts` (digest) use `defineScheduled`.

**Deploy**
- Cloudflare Workers Builds, already connected to the repo, deploys on push to `main`:
  - Build command `pnpm verify` (typecheck + unit tests; dependencies install automatically).
  - Deploy command `pnpm release`: `wrangler d1 migrations apply --remote`, then `void deploy --skip-migrations`.
- Pull requests run `.github/workflows/ci.yml` (typecheck, tests, build).
- Migrations stay hand-written SQL and must stay backward compatible.

**Tests**
- Port the 5 `bun test` files to `vp test`.
- Real-runtime coverage comes from Playwright running against `void dev` (workerd + local D1).

## Cutover gate

Everything below runs locally against the same snapshot of production D1:

1. Run Astro (`astro dev`) and Void (`void dev`) side by side.
2. Crawl every sitemap URL, plus the key non-indexed routes (`/compare`, `/search?…`, the 404 page, `/robots.txt`, `/sitemap.xml`, `/x/` → `/x`).
3. Diff each response's status, headers, `<head>` (title, canonical, meta, JSON-LD) and main text. The gate fails on any unexplained difference.
4. Re-run the 11 scenarios in [payments-testing.md](payments-testing.md), using Stripe test mode and WorkOS Staging, with Resend off.

The production snapshot contains seekers' personal data. Keep it in `.wrangler/` only: never commit or share it, and delete it after the gate passes.

## Cutover and rollback

1. Merge to `main`. CI deploys Void to the existing Worker.
2. If anything breaks, run `wrangler rollback` to the last Astro version. Worker versions are immutable.
3. Watch Search Console (coverage, Core Web Vitals) and Worker logs for a week.

## Known Void risks to handle

- **TypeScript 7 + Vue:** `defineProps<ImportedType>()` breaks ([#932](https://github.com/voidzero-dev/void/issues/932)). Use inline prop types until it's fixed.
- **Meta de-duplication:** meta tags are de-duplicated by name or property, so a page gets only one `og:image`. This is fine for parity.
- **JSON-LD:** `innerHTML` isn't escaped, so keep using `safeJsonLdStringify`.
- **Head updates:** scripts and `htmlAttrs` aren't updated on client-side navigation. This only affects portal and admin pages, which have no JSON-LD.
- **Duplicate canonicals:** links concatenate, so set the canonical per page only, never in config as well.
- **Error pages:** they always send `Cache-Control: no-store`.
- **Public manifest:** `.vite/manifest.json` is publicly downloadable ([#774](https://github.com/voidzero-dev/void/issues/774)).
- **Asset caching:** CSS and fonts aren't marked as immutable cache ([#881](https://github.com/voidzero-dev/void/issues/881)). Check the asset headers in the diff.
- **wrangler.jsonc:** `void deploy` moves `wrangler.jsonc` into `void.config.ts` + `void.lock.json`. It must keep:
  - the Worker name
  - the `DB` binding
  - `nodejs_compat` and `global_fetch_strictly_public`
  - the vars and secrets
- **Missing features:** there are no named environments ([#468](https://github.com/voidzero-dev/void/issues/468)) and no PR preview deployments ([#467](https://github.com/voidzero-dev/void/issues/467)).
- **Churn:** Void ships about two releases a week on pre-release Cloudflare tooling. Pin exact versions and upgrade on purpose.
