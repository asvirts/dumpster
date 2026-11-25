/**
 * Worker entry: Astro handles HTTP; cron triggers run the autopilot.
 * Cron schedules live in wrangler.jsonc `triggers.crons`.
 */
import { handle } from '@astrojs/cloudflare/handler';
import { getDb } from './lib/db';
import { runAutopilot, sendDailyDigest } from './lib/autopilot';

/** Must match the digest entry in wrangler.jsonc. */
const DIGEST_CRON = '0 14 * * *';

export default {
  fetch: handle,
  async scheduled(controller, _env, ctx) {
    const db = getDb();
    if (controller.cron === DIGEST_CRON) {
      ctx.waitUntil(sendDailyDigest(db).then(() => undefined));
      return;
    }
    ctx.waitUntil(runAutopilot(db).then(() => undefined));
  },
} satisfies ExportedHandler<Env>;
