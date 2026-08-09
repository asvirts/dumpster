# Implementation Assumptions

Documented during DumpsterLocal MVP build (PRD v1.0, Cloudflare deploy).

1. **Brand:** Working name is DumpsterLocal until a final brand/domain is chosen.
2. **Stack deviation from PRD:** Astro 7 + Cloudflare Workers + D1 + Drizzle instead of Next.js + Vercel + Postgres. Chosen for the existing scaffold and Cloudflare deployment requirement.
3. **Geo:** City/ZIP matching via service-area tables + optional haversine distance from city center to operator HQ. No PostGIS.
4. **Demo seed data:** Priority metros ship with fictional verified operators (`is_demo = 1`) so UI and SEO structure are exerciseable. Replace before marketing production traffic.
5. **Quotes:** Single-operator leads only; multi-operator quote routing is Phase 2.
6. **Pricing:** Typical min–max ranges and notes, not live inventory or booking.
7. **Brokers:** Schema flag + hidden by default in search (`excludeBrokers` default true).
8. **Maps:** MapLibre GL + OpenFreeMap tiles (no Mapbox/Google key for MVP).
9. **Admin auth:** Cloudflare Access in production (path `/admin*`). Local/dev uses `ADMIN_BYPASS=1` in `.dev.vars` or Astro `DEV` mode.
10. **Email:** Resend optional (`RESEND_API_KEY`). Lead rows always persist; email is best-effort.
11. **Coverage:** Seeded 10 priority metros (TX/FL/CA/AZ/GA/CO). Not national on day one.
12. **Reviews / payments / self-serve portal:** Explicitly out of MVP.
13. **Guides:** Markdown content collections (not DB) for evergreen education.
14. **City intelligence:** Editable in admin (`/admin/cities`) without code deploys.
