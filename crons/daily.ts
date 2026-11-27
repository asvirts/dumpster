import { defineScheduled } from 'void';
import { sendDailyDigest } from '../src/lib/autopilot';
import { getDb } from '../src/lib/db';

/** Admin daily digest, 14:00 UTC. Skipped on quiet days. */
export const cron = '0 14 * * *';

export default defineScheduled((_controller, _env, ctx) => {
  ctx.waitUntil(sendDailyDigest(getDb()).then(() => undefined));
});
