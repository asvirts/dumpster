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
  RESEND_API_KEY?: string;
  ADMIN_NOTIFY_EMAIL?: string;
  /** Local dev only: skip Access-style checks */
  ADMIN_BYPASS?: string;
}
