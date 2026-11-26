# Payment flow: verification log and runbook

How lead payments were tested end to end, what passed, what has not been tested yet, and how to run it again. For how payments work, see [leads.md](leads.md) (Routing → Monetization).

## Latest run: 2026-11-26 — PASSED

- **Code:** `main` at `f82f89d`, with no code changes
- **Where:** local `astro dev` (workerd + local D1)
- **Stripe:** test mode, events forwarded with `stripe listen`
- **Driver:** headless Chrome (Playwright) going through the real portal UI and Stripe-hosted Checkout
- **Price tested:** $40 exclusive (direct) lead
- **Unit tests:** `bun test` 54/54 passing

| # | Scenario | Result |
|---|---|---|
| 1 | Offered lead in `/portal/leads` hides the seeker's contact details before payment | Pass |
| 2 | "Unlock for $40.00" opens Stripe Checkout with the right amount, lead description, metadata (`leadId`, `operatorId`, `clerkOrgId`, `priceCents`) and the card-saving notice | Pass |
| 3 | Pay with `4242 4242 4242 4242`. The `checkout.session.completed` webhook unlocks the lead (`status=unlocked`, `unlock_method=paid`), writes audit `lead_unlock_paid` by `stripe`, and saves the card on the operator (`stripe_customer_id`, `stripe_payment_method_id`, label "Visa •••• 4242"). The PaymentIntent succeeded with `setup_future_usage=off_session`. | Pass |
| 4 | Visiting the return URL `/portal/leads?session_id=…` after the webhook already ran is idempotent: redirects to `?ok=unlocked` and shows name, email and phone | Pass |
| 5 | Return URL as the **only** fulfillment path (`stripe listen` stopped, `PUBLIC_SITE_URL=http://localhost:4321`): the success page unlocks the lead by itself | Pass |
| 6 | Replaying the same signed webhook event returns 200 with no change (`unlocked_at` unchanged, still one audit row) | Pass |
| 7 | Forged `Stripe-Signature` returns 400 `Invalid signature`. Missing signature returns 400 `Missing signature`. | Pass |
| 8 | Auto-buy on (portal form). A new quote from the public operator page is charged off-session ($40 PaymentIntent, metadata `kind=auto_unlock`) and unlocked instantly (`passed_by=auto-buy`, audit `lead_unlock_auto_buy`). | Pass |
| 9 | Auto-buy with a declining saved card (`pm_card_chargeCustomerFail`): charge fails `generic_decline`, auto-buy turns off, lead stays `offered` and locked, audit `auto_buy_paused` | Pass |
| 10 | Spam filter: a quote with an `example.com` email and a `555` phone is held (`status=new`, admin note "Autopilot held: …") and never offered or charged | Pass |
| 11 | Checkout events from another project on the same Stripe account reach the webhook, get 200, and change nothing (logged as `unlock failed Lead not found`) | Pass |

### Not covered yet

- **Live mode / production.** Nothing was run against live keys or the deployed Worker. The production webhook endpoint and its secret were not checked.
- **Email delivery.** `RESEND_API_KEY` was not set, so every send was attempted and skipped (`[email] RESEND_API_KEY not set; skipping email`). Unlock receipts, offer emails and the auto-buy-paused email were not seen in an inbox.
- **Shared $25 match leads**, fan-out to up to 3 operators, and widening an exclusive lead to shared (price drop plus expiring the open session).
- **Payment methods other than cards** that Checkout offers (Cash App Pay, Klarna, Bank/ACH). Bank is asynchronous: `checkout.session.async_payment_succeeded` / `async_payment_failed` and the portal's `?ok=processing` path were not exercised. Only cards get saved for auto-buy.
- **Auto-buy edge cases:** the weekly cap, and the refund when a lead changes hands between charge and unlock.
- **Complimentary (free first) unlock.** The test operator started with 0 free unlocks.

### Findings from this run

1. **Checkout return URLs default to production.** `siteUrl()` falls back to `https://findadumpster.net` when `PUBLIC_SITE_URL` is unset. Without it, paying locally sends the browser to the production portal with a test-mode session id. Set `PUBLIC_SITE_URL=http://localhost:4321` in `.dev.vars` (now in `.dev.vars.example`).
2. **The Stripe test account is shared with at least one other project.** Its `checkout.session.completed` events (metadata `kind=lead_unlock`, `companyId`, `offerId`) reach our webhook. The handler returns 200 and changes nothing, but logs `console.error`. If live mode is shared the same way, production logs get the same noise. Consider ignoring sessions whose metadata has no `operatorId`.
3. **The Clerk keys in `.dev.vars` were placeholders** (`example.clerk.accounts.dev`), so the portal could not sign in locally. Plain keyless mode fails under workerd, because the keys can't be written to disk there. See setup step 2.
4. **Something else on the dev machine kept stopping `stripe listen` and `astro dev`** (exit 144, nothing in the logs). If the webhook stops arriving, check that both are still running and restart them.

## Runbook

### 1. Stripe

1. Put a test-mode secret key (`sk_test_…`) in `.dev.vars` as `STRIPE_SECRET_KEY`. The key saved by the Stripe CLI login expires, so use a dashboard key.
2. Get the webhook secret with `stripe listen --api-key "$STRIPE_SECRET_KEY" --print-secret` and save it as `STRIPE_WEBHOOK_SECRET`. It stays the same per device and account.
3. Set `PUBLIC_SITE_URL=http://localhost:4321`.
4. Start the dev server, then the forwarder (it uses the port `astro dev` prints, default 4321):

```sh
stripe listen --api-key "$STRIPE_SECRET_KEY" \
  --forward-to localhost:4321/api/stripe/webhook \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed
```

### 2. WorkOS (portal sign-in)

Operator sign-in is WorkOS AuthKit. Locally it uses the "Find A Dumpster" project's **Staging** environment, which already has the Redirect URI `http://localhost:4321/auth/callback`, Sign-out URI `http://localhost:4321/` and Initiate login URI `http://localhost:4321/auth/login`. Set `WORKOS_API_KEY` (Staging secret key from the dashboard), `WORKOS_CLIENT_ID` and `WORKOS_COOKIE_PASSWORD` in `.dev.vars` (see `.dev.vars.example`).

Create a test user with a verified email and a password, so sign-in needs no email code:

```sh
curl -s https://api.workos.com/user_management/users -H "Authorization: Bearer $WORKOS_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"email":"operator@example.com","password":"<test password>","email_verified":true}'
```

Sign in at `/auth/login`, then create the company at `/portal/select-org`. Its `org_…` ID is in `GET https://api.workos.com/organizations`.

### 3. Seed an offered lead

Link a listing to the test org, use up its free unlock, and offer it an exclusive lead:

```sh
npx wrangler d1 execute dumpsterlocal --local --command "
update operators set claim_status='approved', org_id='<org_id>', complimentary_leads_remaining=0,
  lead_notify_email='operator@example.com' where id='op-htx-1';
insert into leads (id, operator_id, requested_operator_id, seeker_name, seeker_email, seeker_phone,
  project_size, material, address_or_zip, status, offered_at, mode, price_cents)
values ('paytest-lead-1','op-htx-1','op-htx-1','Test Seeker One','seeker1@example.com','555-0101',
  '20 yd','mixed','77002','offered',strftime('%Y-%m-%dT%H:%M:%fZ','now'),'direct',4000);"
```

For auto-buy, submit a real quote from `/operator/lone-star-container-services` instead, so `processNewLead` → `tryAutoUnlock` runs. Use a real-looking phone (not `555`) and a non-test email domain, or the spam filter holds the lead.

### 4. Pay and check

- **Card:** `4242 4242 4242 4242`, any future expiry, any CVC, ZIP `77002`. In Checkout, choose **Card** and untick "Save my information for faster checkout" (Stripe Link). Otherwise Link asks for a phone number.
- **Declined auto-buy:** attach `pm_card_chargeCustomerFail` to the operator's Stripe customer (`POST /v1/payment_methods/pm_card_chargeCustomerFail/attach`) and put its id in `operators.stripe_payment_method_id`.
- **Replay a webhook:**

```sh
T=$(date +%s)
SIG=$(printf '%s.%s' "$T" "$(cat evt.json)" | openssl dgst -sha256 -hmac "$STRIPE_WEBHOOK_SECRET" -hex | sed 's/^.* //')
curl -X POST localhost:4321/api/stripe/webhook -H "Stripe-Signature: t=$T,v1=$SIG" --data-binary @evt.json
```

Get `evt.json` from `GET /v1/events/<evt_id>`.

- **What to check:**
  - `leads.status` / `unlock_method` / `unlocked_at`
  - `operators.stripe_*` columns
  - `admin_audit` rows
  - the Checkout Session and PaymentIntent in the Stripe API
  - `astro dev logs`

### 5. Clean up

Delete the test leads and their `admin_audit` rows. Reset the test operator:
- `claim_status='unclaimed'`
- `org_id`, `lead_notify_email` and the `stripe_*` columns set to null
- `complimentary_leads_remaining=1`
- `auto_unlock_enabled=0`

Test-mode Stripe objects can stay.
