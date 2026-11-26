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
Local admin bypass: `.dev.vars` with `ADMIN_BYPASS=1` works only under `astro dev`. Production admin requires Cloudflare Access JWT secrets (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`). Copy `.dev.vars.example` → `.dev.vars` and fill WorkOS/Stripe/Resend secrets as needed.

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

**Deploys happen on push.** Cloudflare Workers Builds deploys every push to `main`. Its build runs `bun run build`, which first applies pending D1 migrations to production (`scripts/ci-migrate.mjs`, only when `WORKERS_CI=1`). A failed migration fails the build, so code never goes live ahead of its schema. Migrations must stay backward compatible with the code currently live (add columns and tables; don't drop or rename in the same push).

## Cloudflare setup

1. Create D1 database: `bunx wrangler d1 create dumpsterlocal`
2. Put the real `database_id` in `wrangler.jsonc` (replace `local-dev-placeholder`)
3. `bun run db:migrate:remote`
4. Optionally seed: `bun run db:seed:remote` (cities + seeded operators — verify all contact info before production marketing)
5. Set secrets:
   - Email: `bunx wrangler secret put RESEND_API_KEY` and optional `ADMIN_NOTIFY_EMAIL`. From-address defaults to `leads@findadumpster.net` (`LEAD_FROM_EMAIL`) — verify that domain on Resend (or later Cloudflare Email Sending).
   - WorkOS AuthKit (this site's own WorkOS project): `bunx wrangler secret put` each of `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI` (`https://findadumpster.net/callback`), `WORKOS_COOKIE_PASSWORD` (32+ chars, `openssl rand -base64 32`)
   - Stripe: `bunx wrangler secret put STRIPE_SECRET_KEY` and `bunx wrangler secret put STRIPE_WEBHOOK_SECRET`
   - Access: `bunx wrangler secret put CF_ACCESS_TEAM_DOMAIN` (e.g. `myteam.cloudflareaccess.com`) and `bunx wrangler secret put CF_ACCESS_AUD` (Access app AUD)
   - Optional: `LEAD_PRICE_CENTS` (shared, default `2500`), `LEAD_PRICE_EXCLUSIVE_CENTS` (exclusive, default `4000`)
6. Deploy: `bun run deploy`
7. **Cloudflare Access:** protect path `/admin*` with an Access application (email allowlist). The Worker verifies the Access JWT — do not rely on headers alone.
8. **WorkOS:** in the dashboard for this site's project, add the redirect URI `https://findadumpster.net/callback` (plus `http://localhost:4321/callback` in the staging environment), set the sign-in endpoint to `https://findadumpster.net/login` and allow the sign-out redirect `https://findadumpster.net/`. Clerk org admins import with the `admin` role (keep it, or pass `--admin-role`). See [Operator accounts](#operator-accounts-workos).
9. **Stripe webhook:** endpoint `https://findadumpster.net/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. Paid unlock also fulfills when the operator returns to `/portal/leads?session_id=…`.

Update `PUBLIC_SITE_URL` / `site` in `astro.config.mjs` for your domain.

## Autopilot

Leads route and sell themselves; see `docs/leads.md`. Cron triggers are in `wrangler.jsonc` and handled by `src/worker.ts`. `/admin/autopilot` shows the daily digest and can run a cycle by hand.

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
| `/login` · `/signup` · `/callback` · `/logout` | WorkOS AuthKit sign-in flow |
| `/admin/*` | Verification, claims, lead routing, CRUD, CSV import, city notes |
| `/admin/leads` | Lead inbox (filters, CSV, route, notes) — see `docs/leads.md` |
| `/api/stripe/webhook` | Stripe Checkout completion → unlock lead |
| `/api/unsubscribe` | Signed operator opt-out from lead emails |
| `/admin/autopilot` | Autopilot digest + manual run |

## Operator accounts (WorkOS)

Operators sign in with WorkOS AuthKit (`@workos/authkit-astro`, wired by hand in `src/middleware.ts` so the Stripe/Resend webhooks stay outside auth). An operator company is a WorkOS organization; `/portal` needs a signed-in user with an active organization, picked or created at `/portal/select-org` (`switchToOrganization`). `operators.clerk_org_id` holds the WorkOS organization id (the column kept its old name).

Moving from Clerk:

1. Clerk dashboard → Users → **Export users** (CSV with bcrypt `password_digest`).
2. Dry run, then import (needs this site's `WORKOS_API_KEY`; organizations and memberships come from the Clerk Backend API via `CLERK_SECRET_KEY`, or `--orgs-json`):
   ```sh
   WORKOS_API_KEY=sk_live_... CLERK_SECRET_KEY=sk_live_... node scripts/import-clerk-to-workos.mjs --users clerk-users.csv --dry-run
   WORKOS_API_KEY=sk_live_... CLERK_SECRET_KEY=sk_live_... node scripts/import-clerk-to-workos.mjs --users clerk-users.csv
   ```
   Users keep their password (bcrypt) and get `externalId` = Clerk user id; organizations get `externalId` = Clerk org id. Re-running skips what already exists.
3. On each sign-in (and org switch) the callback swaps Clerk ids in D1 for WorkOS ids (`src/lib/auth-remap.ts`): `operators.clerk_org_id`, `operators.claim_requested_by_user_id`, `leads.passed_by`, `admin_audit.actor`, and org ids inside `admin_audit.notes`.
4. Unsubscribe links already sent were signed with `CLERK_SECRET_KEY` if `LINK_SIGNING_SECRET` was unset: `bunx wrangler secret put LINK_SIGNING_SECRET` with the old Clerk secret value before deleting it.

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
