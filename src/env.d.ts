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
  /** Local dev only: skip Access-style checks */
  ADMIN_BYPASS?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  /** Pay-per-lead price in cents (default 2500) */
  LEAD_PRICE_CENTS?: string;
}
