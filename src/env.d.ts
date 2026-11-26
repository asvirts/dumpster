type Runtime = import('@astrojs/cloudflare').Runtime;

declare namespace App {
  interface Locals extends Runtime {
    adminEmail?: string;
    /** WorkOS AuthKit session, set by middleware (null when signed out). */
    auth: import('./lib/auth').AuthSession | null;
  }
}

interface Env {
  DB: D1Database;
  PUBLIC_SITE_NAME: string;
  PUBLIC_SITE_URL: string;
  /** WorkOS AuthKit (operator sign-in) */
  WORKOS_API_KEY?: string;
  WORKOS_CLIENT_ID?: string;
  /** 32+ chars; encrypts the session cookie */
  WORKOS_COOKIE_PASSWORD?: string;
  /** Signing secret of the WorkOS webhook endpoint (organization.deleted). */
  WORKOS_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  ADMIN_NOTIFY_EMAIL?: string;
  /** Local DEV only (with import.meta.env.DEV): skip Access checks */
  ADMIN_BYPASS?: string;
  /** Cloudflare Access team domain, e.g. myteam.cloudflareaccess.com */
  CF_ACCESS_TEAM_DOMAIN?: string;
  /** Cloudflare Access application AUD tag */
  CF_ACCESS_AUD?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  /** Shared (match) pay-per-lead price in cents (default 2500) */
  LEAD_PRICE_CENTS?: string;
  /** Exclusive (direct quote) price in cents (default 4000) */
  LEAD_PRICE_EXCLUSIVE_CENTS?: string;
  /** "1" = email the admin about every lead (default off; daily digest instead) */
  ADMIN_LEAD_ALERTS?: string;
  /** HMAC key for unsubscribe links (falls back to STRIPE_WEBHOOK_SECRET) */
  LINK_SIGNING_SECRET?: string;
  /** Reply-To on every email; an address on the Resend Inbound subdomain. */
  LEAD_REPLY_TO?: string;
  /** Signing secret of the Resend `email.received` webhook (whsec_…). */
  RESEND_WEBHOOK_SECRET?: string;
  /** Full-access Resend key, used only to read received replies. */
  RESEND_RECEIVING_API_KEY?: string;
  /** From address, e.g. Find A Dumpster <leads@findadumpster.net> */
  LEAD_FROM_EMAIL?: string;
  LEAD_IP_SALT?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
}
