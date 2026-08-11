# Implementation Assumptions

Documented during Find A Dumpster MVP build (PRD v1.0, Cloudflare deploy), updated for paid leads + claims.

1. **Brand:** Find A Dumpster at findadumpster.net (formerly working name DumpsterLocal).
2. **Stack deviation from PRD:** Astro 7 + Cloudflare Workers + D1 + Drizzle instead of Next.js + Vercel + Postgres. Chosen for the existing scaffold and Cloudflare deployment requirement.
3. **Geo:** City/ZIP matching via service-area tables + optional haversine distance from city center to operator HQ. No PostGIS.
4. **Seeded operators:** Historical seed placeholders used 555 numbers / example.com and are marked `is_demo = 1`, unpublished. Production priority metros use web-researched real operators (`seed/real-operators-priority-metros-2026-08-11.sql`) with public phone/website; verification notes say phone call for insurance/license is still recommended. Admin `createOperator` / `updateOperator` refuse to publish 555 / example.com / SEED PLACEHOLDER contacts. Public search and sitemap exclude `is_demo`.
5. **Quotes / leads:** Seekers submit quotes on operator pages; leads are **held** (`status: new`) and emailed to admin only. Admin routes leads: complimentary unlock (one free teaser per operator) or paid offer. Multi-operator fan-out of a single seeker lead is out of scope.
6. **Pricing (directory):** Typical min–max ranges and notes, not live inventory or booking.
7. **Brokers:** Schema flag + hidden by default in search (`excludeBrokers` default true).
8. **Maps:** MapLibre GL + OpenFreeMap tiles (no Mapbox/Google key for MVP).
9. **Admin auth:** Production verifies Cloudflare Access JWT (`CF_ACCESS_TEAM_DOMAIN` + `CF_ACCESS_AUD`; header `Cf-Access-Jwt-Assertion`). Local only: `ADMIN_BYPASS=1` **and** Astro DEV mode. Do not trust the Access email header alone.
10. **Operator auth:** Clerk Organizations for claiming listings and the `/portal` dashboard. Claims require admin approval before portal access.
11. **Paid leads:** Stripe Checkout pay-per-lead (`LEAD_PRICE_CENTS`, default $25). First unlock per operator can be complimentary. Webhook at `/api/stripe/webhook`.
12. **Email:** Resend optional (`RESEND_API_KEY`). Lead rows always persist; email is best-effort.
13. **Coverage:** Seeded 10 priority metros (TX/FL/CA/AZ/GA/CO). Not national on day one.
14. **Reviews / subscriptions / Connect payouts:** Still out of scope (one-time lead unlock only).
15. **Guides:** Markdown content collections (not DB) for evergreen education.
16. **City intelligence:** Editable in admin (`/admin/cities`) without code deploys.
