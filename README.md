# DumpsterLocal

Verified, hyper-local dumpster rental directory (MVP). Quality and verification over listing volume.

**Stack:** Astro 7 · Cloudflare Workers · D1 · Drizzle · Tailwind · MapLibre

## Quick start

```sh
bun install
bun run db:setup:local   # migrate + seed (cities + seeded operators) into local D1
bun run dev              # http://localhost:4321
```

Admin (local): [http://localhost:4321/admin](http://localhost:4321/admin)  
Bypass is enabled via `.dev.vars` (`ADMIN_BYPASS=1`).

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
5. Set secrets if using email: `bunx wrangler secret put RESEND_API_KEY` and optional `ADMIN_NOTIFY_EMAIL`
6. Deploy: `bun run deploy`
7. **Cloudflare Access:** protect path `/admin*` with an Access application (email allowlist)

Update `PUBLIC_SITE_URL` / `site` in `astro.config.mjs` for your domain.

## Product surface

| Route | Description |
|-------|-------------|
| `/` | Home + priority cities |
| `/search` | Filters, list, map |
| `/dumpster-rental/[state]/[city]` | City landing (pricing + permits + operators) |
| `/operator/[slug]` | Profile + quote form |
| `/compare?ids=` | Side-by-side (max 4) |
| `/guides/*` | Educational content |
| `/admin/*` | Verification queue, CRUD, CSV import, leads, city notes |

## Quality model

- Operators start as `pending` and stay off the public directory until verified + published
- Public “Verified · {date}” badge from `last_verified_at`
- Brokers flaggable and filtered out by default
- City pages store unique permit/pricing/special-rules content in D1

See `ASSUMPTIONS.md` and the product PRD for full requirements.
