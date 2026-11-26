# Lead generation

Autopilot lead system: seekers submit quotes, rows persist immediately, and **autopilot routes and sells each lead with no admin step** (`src/lib/autopilot.ts`). Admin routing still works for anything you want to handle by hand.

## Capture

| Surface | Mode | Component |
|---|---|---|
| `/operator/[slug]#quote` | `direct` | `QuoteForm` |
| `/search`, `/dumpster-rental/[state]/[city]` | `match` | same `QuoteForm` with `mode="match"` |

Multi-step in the browser (project → contact). Without JS both steps show. Phone and ZIP/address are required.

On success:

1. Insert `leads` (`status=new`) and record `quote_submit` / `quote_submit_match` in `events`
2. After the response (`waitUntil`): autopilot routes the lead, then emails the seeker confirmation (and the admin, only if `ADMIN_LEAD_ALERTS=1`)

Operators never see `new` leads in `/portal`. Portal lists `offered`, `unlocked`, and `closed` only.

## Status machine

`new` → `offered` → `unlocked` → `closed`

Terminal without unlock: `spam`, `invalid`, `closed`.

## Routing (autopilot)

- **Junk filter:** leads with a non-10-digit or placeholder phone, a disposable email domain, or link spam stay `new` with an `Autopilot held:` note. They are never sold and close as `spam` after 10 days.
- **Direct:** offered to the requested operator at the **exclusive** price (`LEAD_PRICE_EXCLUSIVE_CENTS`, default $40). If that operator cannot take leads (no email, unsubscribed, broker, unpublished) the lead becomes a match request.
- **Match:** offered to up to **3** operators at the **shared** price (`LEAD_PRICE_CENTS`, default $25). Extra operators get **cloned** rows sharing `groupId`; each can unlock independently.
- **Who gets it:** published, non-demo, non-broker, not opted out, reachable (claimed or has an email). Candidates come from service areas (city or ZIP), else HQ within 50 miles; direct leads without a city use the requested operator's area. Ranked: auto-buy operators → claimed → unclaimed; then verified, quality score, distance.
- **Auto-buy:** an operator on auto-buy is charged off-session on their saved card (weekly cap) and gets full contact details instantly. Otherwise they get a "lead waiting" email. Unclaimed operators' emails double as a claim invite.

Cron (`src/worker.ts`, `wrangler.jsonc` `triggers.crons`):

| Schedule | Job |
|---|---|
| every 15 min | Route `new` leads missed at submit (errors, or no operator yet) · one reminder after 20h · after 24h unbought, offer to more operators (exclusive leads become shared) · close leads unsold after 10 days |
| 14:00 UTC daily | Admin digest: revenue 24h/7d/30d, unsold leads by area, pending claims. Skipped on quiet days. |

Run either by hand from `/admin/autopilot`. Locally: `curl "http://localhost:4321/cdn-cgi/handler/scheduled?cron=*/15+*+*+*+*"`.

Monetization: **1 complimentary unlock per operator**, then Stripe Checkout or auto-buy. Price is frozen on the lead at offer time (`price_cents`); widening an exclusive lead lowers it to the shared price and expires any open Checkout Session.

Checkout saves the card (`setup_future_usage=off_session`) so the operator can turn on auto-buy in `/portal/leads`. A declined auto-buy charge pauses auto-buy and emails the operator; the lead stays offered.

Claims approve instantly when the claimant's verified account email (WorkOS) equals the listing email or is on the listing website's domain (free-mail domains excluded). Other claims wait in `/admin/claims`.

Lead emails (offers, reminders, unlock receipts, auto-buy notices, Stripe receipt address) go to `lead_notify_email`, falling back to the public listing `email` (`operatorNotifyEmail`). A claim records the claimant's verified account email (`claim_requested_by_email`). Approval, instant or in `/admin/claims`, copies it to `lead_notify_email` and sends the approval email there. Operators change it under **Lead emails** in `/portal/leads`; blank means use the listing email. Replies from either address are matched to the operator.

Every operator email carries a signed unsubscribe link (`/api/unsubscribe`); opted-out operators are never offered leads.

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

To use Cloudflare Email Sending later (needs the Workers Paid plan; on Free it can only send to verified addresses, error `recipient_plan_restricted`):

1. `wrangler email sending enable findadumpster.net`
2. Add `"send_email": [{ "name": "EMAIL" }]` to `wrangler.jsonc`
3. Switch `src/lib/email.ts` to `env.EMAIL.send()` with `from: { email: "leads@findadumpster.net", name: "Find A Dumpster" }`

### Replies

Every email sets `reply_to` to `LEAD_REPLY_TO` (`leads@eeildoiint.resend.app`). That is the Resend account's built-in receiving domain (no DNS). The root domain's MX stays on iCloud — **never add Resend's receiving MX on findadumpster.net**; it would take mail from iCloud. A branded `reply.findadumpster.net` needs a Resend plan with another domain slot.

Resend posts `email.received` to `/api/resend/inbound` (Svix signature checked with `RESEND_WEBHOOK_SECRET`). The handler fetches the text with `RESEND_RECEIVING_API_KEY` (full access; the send-only key can't read received mail), then:

- Out-of-office / auto-submitted replies: stored, ignored.
- Short opt-out replies ("stop", "remove me", "unsubscribe"…) from a listed operator's email: operator opted out of lead emails and auto-buy, audit `operator_unsubscribe` by `email-reply`.
- Anything else: stored, admin emailed, listed under **Needs an answer** at `/admin/replies` and in the daily digest. Answers sent from that page go out from `leads@findadumpster.net`, threaded with `In-Reply-To`.

Handling is idempotent on Resend's `email_id`; a non-2xx response makes Resend retry.

## Analytics

GA4 events (when `gtag` is present): `lead_form_view`, `lead_form_start`, `lead_form_submit`, `lead_form_success`.

First-party: `events` rows for search, submit, and duplicates.

## Admin

`/admin/leads` — filters (status, mode, operator, date, text), CSV export, quick route.

`/admin/leads/[id]` — full detail, notes, resend offer, match fan-out.

## Env

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Send mail (**required** — without it no operator is ever offered a lead) |
| `ADMIN_NOTIFY_EMAIL` | Daily digest (and per-lead alerts if `ADMIN_LEAD_ALERTS=1`) |
| `LEAD_FROM_EMAIL` | From header |
| `LEAD_PRICE_CENTS` | Shared (match) price, default 2500 |
| `LEAD_PRICE_EXCLUSIVE_CENTS` | Exclusive (direct) price, default 4000 |
| `LINK_SIGNING_SECRET` | Optional unsubscribe-link key (falls back to `STRIPE_WEBHOOK_SECRET`). Set it to the old `CLERK_SECRET_KEY` value so links sent before the WorkOS move keep working |
| `LEAD_REPLY_TO` | Reply-To on every email (var; `leads@eeildoiint.resend.app`). Unset → replies go to the From address |
| `RESEND_WEBHOOK_SECRET` | Signing secret of the Resend `email.received` webhook |
| `RESEND_RECEIVING_API_KEY` | Full-access Resend key, only used to read reply text |
| `LEAD_IP_SALT` | Optional IP hash salt |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Optional captcha |
