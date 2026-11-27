import { defineScheduled } from 'void';
import { runAutopilot } from '../src/lib/autopilot';
import { getDb } from '../src/lib/db';

/** Autopilot: route new leads, expand unbought ones, send reminders, expire stale leads. */
export const cron = '*/15 * * * *';

export default defineScheduled((_controller, _env, ctx) => {
  ctx.waitUntil(runAutopilot(getDb()).then(() => undefined));
});
