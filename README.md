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
| `bun run db:migrate:remote` | Apply migrations to remote D1 |
| `bun run db:seed:remote` | Seed remote D1 (cities + seeded operators; verify before marketing) |
| `bun run deploy` | Build + `wrangler deploy` |

## Cloudflare setup

1. Create D1 database: `bunx wrangler d1 create dumpsterlocal`
2. Put the real `database_id` in `wrangler.jsonc` (replace `local-dev-placeholder`)
3. `bun run db:migrate:remote`
4. Optionally seed: `bun run db:seed:remote` (cities + seeded operators — verify all contact info before production marketing)
5. Set secrets:
   - Email: `bunx wrangler secret put RESEND_API_KEY` and optional `ADMIN_NOTIFY_EMAIL`
   - Clerk: `PUBLIC_CLERK_PUBLISHABLE_KEY` (var) + `bunx wrangler secret put CLERK_SECRET_KEY`
   - Stripe: `bunx wrangler secret put STRIPE_SECRET_KEY` and `bunx wrangler secret put STRIPE_WEBHOOK_SECRET`
   - Access: `bunx wrangler secret put CF_ACCESS_TEAM_DOMAIN` (e.g. `myteam.cloudflareaccess.com`) and `bunx wrangler secret put CF_ACCESS_AUD` (Access app AUD)
   - Optional: `LEAD_PRICE_CENTS` (default `2500`)
6. Deploy: `bun run deploy`
7. **Cloudflare Access:** protect path `/admin*` with an Access application (email allowlist). The Worker verifies the Access JWT — do not rely on headers alone.
8. **Clerk:** enable Organizations; point production instance at your domain
9. **Stripe webhook:** endpoint `https://findadumpster.net/api/stripe/webhook` for `checkout.session.completed`

Update `PUBLIC_SITE_URL` / `site` in `astro.config.mjs` for your domain.

## Product surface

| Route | Description |
|-------|-------------|
| `/` | Home + priority cities |
| `/search` | Filters, list, map |
| `/dumpster-rental/[state]/[city]` | City landing (pricing + permits + operators) |
| `/operator/[slug]` | Profile + quote form + claim listing |
| `/compare?ids=` | Side-by-side (max 4) |
| `/guides/*` | Educational content |
| `/portal/*` | Operator leads + listing (Clerk org, after claim approval) |
| `/admin/*` | Verification, claims, lead routing, CRUD, CSV import, city notes |
| `/api/stripe/webhook` | Stripe Checkout completion → unlock lead |

## Quality model

- Operators start as `pending` and stay off the public directory until verified + published
- Public “Verified · {date}” badge from `last_verified_at`
- Brokers flaggable and filtered out by default
- City pages store unique permit/pricing/special-rules content in D1

See `ASSUMPTIONS.md` and the product PRD for full requirements.
