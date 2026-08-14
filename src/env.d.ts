type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    adminEmail?: string;
  }
}

interface Env {
  DB: D1Database;
  PUBLIC_SITE_NAME: string;
  PUBLIC_SITE_URL: string;
  PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
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
  /** Pay-per-lead price in cents (default 2500) */
  LEAD_PRICE_CENTS?: string;
  /** From address, e.g. Find A Dumpster <leads@findadumpster.net> */
  LEAD_FROM_EMAIL?: string;
  LEAD_IP_SALT?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
}
