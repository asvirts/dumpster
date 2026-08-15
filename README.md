# Find A Dumpster

Verified, hyper-local dumpster rental directory (MVP). Quality and verification over listing volume.

**Site:** [https://findadumpster.net](https://findadumpster.net)

**Stack:** Astro 7 · Cloudflare Workers · D1 · Drizzle · Tailwind · MapLibre

## Quick start

```sh
bun install
bun run db:setup:local   # migrate + seed (cities + seeded operators) into local D1
bun run dev              # http://localhost:4321
```

Admin (local): [http://localhost:4321/admin](http://localhost:4321/admin)  
Operator portal: [http://localhost:4321/portal](http://localhost:4321/portal)  
Local admin bypass: `.dev.vars` with `ADMIN_BYPASS=1` works only under `astro dev`. Production admin requires Cloudflare Access JWT secrets (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`). Copy `.dev.vars.example` → `.dev.vars` and fill Clerk/Stripe/Resend secrets as needed.

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run dev` | Local dev (workerd + D1) |
| `bun run build` | Production build |
| `bun run preview` | Preview Worker build |
| `bun run db:migrate:local` | Apply D1 migrations locally |
| `bun run db:seed:local` | Seed cities + seeded operators |
| `bun run db:migrate:remote` | Apply migrations to remote D1 (includes `0002_lead_capture`) |
| `bun run db:seed:remote` | Seed remote D1 (cities + seeded operators; verify before marketing) |
| `bun run deploy` | Build + `wrangler deploy` |

## Cloudflare setup

1. Create D1 database: `bunx wrangler d1 create dumpsterlocal`
2. Put the real `database_id` in `wrangler.jsonc` (replace `local-dev-placeholder`)
3. `bun run db:migrate:remote`
4. Optionally seed: `bun run db:seed:remote` (cities + seeded operators — verify all contact info before production marketing)
5. Set secrets:
   - Email: `bunx wrangler secret put RESEND_API_KEY` and optional `ADMIN_NOTIFY_EMAIL`. From-address defaults to `leads@findadumpster.net` (`LEAD_FROM_EMAIL`) — verify that domain on Resend (or later Cloudflare Email Sending).
   - Clerk: `PUBLIC_CLERK_PUBLISHABLE_KEY` (var) + `bunx wrangler secret put CLERK_SECRET_KEY`
   - Stripe: `bunx wrangler secret put STRIPE_SECRET_KEY` and `bunx wrangler secret put STRIPE_WEBHOOK_SECRET`
   - Access: `bunx wrangler secret put CF_ACCESS_TEAM_DOMAIN` (e.g. `myteam.cloudflareaccess.com`) and `bunx wrangler secret put CF_ACCESS_AUD` (Access app AUD)
   - Optional: `LEAD_PRICE_CENTS` (default `2500`)
6. Deploy: `bun run deploy`
7. **Cloudflare Access:** protect path `/admin*` with an Access application (email allowlist). The Worker verifies the Access JWT — do not rely on headers alone.
8. **Clerk:** enable Organizations; point production instance at your domain
9. **Stripe webhook:** endpoint `https://findadumpster.net/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. Paid unlock also fulfills when the operator returns to `/portal/leads?session_id=…`.

Update `PUBLIC_SITE_URL` / `site` in `astro.config.mjs` for your domain.

## Product surface

| Route | Description |
|-------|-------------|
| `/` | Home + priority cities |
| `/search` | Filters, list, map |
| `/dumpster-rental/[state]/[city]` | City landing (pricing + permits + operators) |
| `/operator/[slug]` | Profile + multi-step quote form + claim listing |
| `/compare?ids=` | Side-by-side (max 4) |
| `/guides/*` | Educational content |
| `/portal/*` | Operator leads + listing (Clerk org, after claim approval) |
| `/admin/*` | Verification, claims, lead routing, CRUD, CSV import, city notes |
| `/admin/leads` | Lead inbox (filters, CSV, route, notes) — see `docs/leads.md` |
| `/api/stripe/webhook` | Stripe Checkout completion → unlock lead |

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
