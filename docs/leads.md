# Lead generation

Held-lead system: seekers submit quotes, rows persist immediately, **operators are not emailed until an admin routes the lead**.

## Capture

| Surface | Mode | Component |
|---|---|---|
| `/operator/[slug]#quote` | `direct` | `QuoteForm` |
| `/search`, `/dumpster-rental/[state]/[city]` | `match` | same `QuoteForm` with `mode="match"` |

Multi-step in the browser (project → contact). Without JS both steps show. Phone and ZIP/address are required.

On success:

1. Insert `leads` (`status=new`)
2. Email admin (`ADMIN_NOTIFY_EMAIL`)
3. Email seeker confirmation
4. Record `quote_submit` / `quote_submit_match` in `events`

Operators never see `new` leads in `/portal`. Portal lists `offered`, `unlocked`, and `closed` only.

## Status machine

`new` → `offered` → `unlocked` → `closed`

Terminal without unlock: `spam`, `invalid`, `closed`.

## Routing (admin-held)

- **Direct:** one row, `operatorId` set at submit. Admin offers paid or passes complimentary (may reassign).
- **Match:** `operatorId` starts null. Admin offers to up to **3** operators. Extra operators get **cloned** rows sharing `groupId`. Shared, not exclusive — each offered operator can unlock independently.

Monetization: **1 complimentary unlock per operator**, then Stripe Checkout (`LEAD_PRICE_CENTS`, default $25). Price is frozen on the lead at offer time (`price_cents`).

Paid unlock fulfills in two places (idempotent):

1. Stripe webhook `checkout.session.completed` and `checkout.session.async_payment_succeeded` at `/api/stripe/webhook`
2. Operator return to `/portal/leads?session_id={CHECKOUT_SESSION_ID}` (covers webhook delay or a missing endpoint)

An open Checkout Session is reused on repeat clicks. Re-routing or complimentary unlock expires the stale session so a later payment cannot attach to the wrong operator.

## Niche fields

`src/lib/lead-fields.ts` is the adapter:

- Universal: name, email, phone, location, timeline, notes, preferred contact, budget, how-found, UTMs, source
- Dumpster: `projectSize`, `material` (also stored in `qualification_json`)

To reuse on another directory, copy `leads.ts`, `lead-fields.ts`, `QuoteForm.astro`, and the admin/portal lead pages. Swap `NICHE_FIELDS` / `NICHE_ID`.

## Anti-spam

- Honeypot `companyWebsite` (silent success)
- Rate limit: 5 / email / hour and 8 / IP hash / hour
- Duplicate window: same email + operator (direct) or email + city/ZIP (match) within 24h returns the existing lead
- Optional Turnstile: set `PUBLIC_TURNSTILE_SITE_KEY` + secret `TURNSTILE_SECRET`

## Email

From-address: `LEAD_FROM_EMAIL` (default `Find A Dumpster <leads@findadumpster.net>`).

Sending is Resend (`RESEND_API_KEY`). If the custom from-domain is not verified, send falls back to `onboarding@resend.dev`.

To use Cloudflare Email Sending later:

1. `wrangler email sending enable findadumpster.net`
2. Add `"send_email": [{ "name": "EMAIL" }]` to `wrangler.jsonc`
3. Switch `src/lib/email.ts` to `env.EMAIL.send()` with `from: { email: "leads@findadumpster.net", name: "Find A Dumpster" }`

## Analytics

GA4 events (when `gtag` is present): `lead_form_view`, `lead_form_start`, `lead_form_submit`, `lead_form_success`.

First-party: `events` rows for search, submit, and duplicates.

## Admin

`/admin/leads` — filters (status, mode, operator, date, text), CSV export, quick route.

`/admin/leads/[id]` — full detail, notes, resend offer, match fan-out.

## Env

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Send mail |
| `ADMIN_NOTIFY_EMAIL` | New-lead alert |
| `LEAD_FROM_EMAIL` | From header |
| `LEAD_PRICE_CENTS` | Default PPL price |
| `LEAD_IP_SALT` | Optional IP hash salt |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Optional captcha |
