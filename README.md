# Find A Dumpster

Verified, hyper-local dumpster rental directory (MVP). Quality and verification over listing volume.

**Site:** [https://findadumpster.net](https://findadumpster.net)

**Stack:** Void + Vue (Vite+) · Cloudflare Workers · D1 · Drizzle · Tailwind · MapLibre

## Quick start

```sh
pnpm install
pnpm db:setup:local   # migrate + seed (cities + seeded operators) into local D1
pnpm dev              # http://localhost:4321
```

Admin (local): [http://localhost:4321/admin](http://localhost:4321/admin)  
Operator portal: [http://localhost:4321/portal](http://localhost:4321/portal)  
Local values live in one root `.env` (never committed): `ADMIN_BYPASS=1` (works only under the dev server), WorkOS Staging, Stripe test and Resend keys as needed; `src/env.d.ts` lists every key. Production admin requires Cloudflare Access JWT secrets (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local dev (workerd + D1) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview Worker build |
| `pnpm test` | Unit tests (`vp test`) |
| `pnpm db:migrate:local` | Apply D1 migrations locally |
| `pnpm db:seed:local` | Seed cities + seeded operators |
| `pnpm db:migrate:remote` | Apply migrations to remote D1 |
| `pnpm db:seed:remote` | Seed remote D1 (cities + seeded operators; verify before marketing) |

**Deploys happen on push.** Cloudflare Workers Builds (connected to this repo) builds every push to `main` with build command `pnpm verify` (typecheck + tests) and deploy command `pnpm release`: pending D1 migrations (`pnpm db:migrate:remote`), then `void deploy --skip-migrations`. A failed check or migration stops the deploy, so code never goes live ahead of its schema. Build settings: `NODE_VERSION=24`, non-production branch builds off (Void has no preview deploys), and the build token needs **D1: Edit** in addition to the defaults. Pull requests run `.github/workflows/ci.yml`. Migrations must stay backward compatible with the code currently live (add columns and tables; don't drop or rename in the same push).

## Cloudflare setup

1. Create D1 database: `pnpm exec wrangler d1 create dumpsterlocal`
2. Put the real `database_id` in `void.config.ts` and `wrangler.d1.jsonc`
3. `pnpm db:migrate:remote`
4. Optionally seed: `pnpm db:seed:remote` (cities + seeded operators — verify all contact info before production marketing)
5. Set secrets:
   - Email: `pnpm exec wrangler secret put RESEND_API_KEY` and optional `ADMIN_NOTIFY_EMAIL`. From-address defaults to `leads@findadumpster.net` (`LEAD_FROM_EMAIL`) — verify that domain on Resend (or later Cloudflare Email Sending).
   - WorkOS (operator sign-in): `WORKOS_CLIENT_ID` is a var in `void.config.ts`; `pnpm exec wrangler secret put WORKOS_API_KEY` and `pnpm exec wrangler secret put WORKOS_COOKIE_PASSWORD` (32+ random chars), and `pnpm exec wrangler secret put WORKOS_WEBHOOK_SECRET` (from the Production webhook endpoint `https://findadumpster.net/api/workos/webhook`, event `organization.deleted`: a deleted company's listing goes back to unclaimed)
   - Stripe: `pnpm exec wrangler secret put STRIPE_SECRET_KEY` and `pnpm exec wrangler secret put STRIPE_WEBHOOK_SECRET`
   - Access: `pnpm exec wrangler secret put CF_ACCESS_TEAM_DOMAIN` (e.g. `myteam.cloudflareaccess.com`) and `pnpm exec wrangler secret put CF_ACCESS_AUD` (Access app AUD)
   - Optional: `LEAD_PRICE_CENTS` (shared, default `2500`), `LEAD_PRICE_EXCLUSIVE_CENTS` (exclusive, default `4000`)
6. Deploy: push to `main` (or `pnpm release` with `CLOUDFLARE_API_TOKEN` set)
7. **Cloudflare Access:** protect path `/admin*` with an Access application (email allowlist). The Worker verifies the Access JWT — do not rely on headers alone.
8. **WorkOS:** in the "Find A Dumpster" Production environment, register Redirect URI `https://findadumpster.net/auth/callback`, Sign-out URI `https://findadumpster.net/`, and Initiate login URI `https://findadumpster.net/auth/login`
9. **Stripe webhook:** endpoint `https://findadumpster.net/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. Paid unlock also fulfills when the operator returns to `/portal/leads?session_id=…`.

Update `PUBLIC_SITE_URL` in `void.config.ts` and `SITE_ORIGIN` in `src/lib/head.ts` for your domain.

## Autopilot

Leads route and sell themselves; see `docs/leads.md`. Cron jobs are `crons/every-15.ts` (autopilot) and `crons/daily.ts` (digest). `/admin/autopilot` shows the daily digest and can run a cycle by hand.

Production needs `RESEND_API_KEY` (verified sending domain) and `ADMIN_NOTIFY_EMAIL` for any of it to reach operators. Optional: `LEAD_PRICE_EXCLUSIVE_CENTS` (default 4000), `ADMIN_LEAD_ALERTS=1`, `LINK_SIGNING_SECRET`. Replies: `RESEND_WEBHOOK_SECRET` + `RESEND_RECEIVING_API_KEY` secrets and the `LEAD_REPLY_TO` var (see docs/leads.md → Replies; answer at `/admin/replies`).

## Product surface

| Route | Description |
|-------|-------------|
| `/` | Home + priority cities |
| `/search` | Filters, list, map |
| `/dumpster-rental/[state]/[city]` | City landing (pricing + permits + operators) |
| `/operator/[slug]` | Profile + multi-step quote form + claim listing |
| `/compare?ids=` | Side-by-side (max 4) |
| `/guides/*` | Educational content |
| `/portal/*` | Operator leads + listing (WorkOS organization, after claim approval) |
| `/admin/*` | Verification, claims, lead routing, CRUD, CSV import, city notes |
| `/admin/leads` | Lead inbox (filters, CSV, route, notes) — see `docs/leads.md` |
| `/api/stripe/webhook` | Stripe Checkout completion → unlock lead |
| `/api/workos/webhook` | WorkOS `organization.deleted` → release that company's listing claim |
| `/api/unsubscribe` | Signed operator opt-out from lead emails |
| `/admin/autopilot` | Autopilot digest + manual run |

## Quality model

- Operators start as `pending` and stay off the public directory until verified + published
- Public “Verified · {date}” badge from `last_verified_at`
- Brokers flaggable and filtered out by default
- City pages store unique permit/pricing/special-rules content in D1
- Demo/seed operators (`is_demo`) never appear in public search, city pages, or sitemap

See `ASSUMPTIONS.md` and the product PRD for full requirements.

## Launch checklist (Search Console)

After deploy, in [Google Search Console](https://search.google.com/search-console) for `https://findadumpster.net`:

1. Confirm property ownership and that **Sitemap** `https://findadumpster.net/sitemap.xml` is submitted without errors.
2. **Page indexing** — fix any soft 404 / “Crawled – currently not indexed” spikes on money pages.
3. **URL Inspection → Request indexing** for `/`, top city pages (`/dumpster-rental/{state}/{city}`), top guides, and best operator profiles.
4. Re-check **weekly** (coverage + sitemap). Ignore CTR/position noise until pages reach roughly top 10–15 with meaningful impressions (often weeks on a new domain).
5. After ~28 days, export Performance (Queries + Pages) for a real ranking/CTR pass.
