import { defineHandler, defineHead, type InferProps } from 'void';
import { logAudit } from '../../src/lib/admin';
import { buildDigest, runAutopilot, sendDailyDigest, type AutopilotRunStats } from '../../src/lib/autopilot';
import { EXPAND_AFTER_HOURS, EXPIRE_AFTER_DAYS, REMINDER_AFTER_HOURS } from '../../src/lib/autopilot-rules';
import { getDb } from '../../src/lib/db';
import { exclusiveLeadPriceCents, leadPriceCents } from '../../src/lib/leads';
import { formatUsdFromCents } from '../../src/lib/paid-unlock';
import { adminActor, adminGuard, adminHead, getAdminResult, setAdminResult } from '../../src/server/admin-guard';
import { withShared } from '../../src/server/shared';

export const revalidate = 0;

export const loader = defineHandler(adminGuard, withShared, async (c) => {
  const db = getDb();
  const result = getAdminResult(c);
  const digest = await buildDigest(db);
  return {
    adminEmail: c.get('adminEmail'),
    runStats: (result?.runStats as AutopilotRunStats | undefined) ?? null,
    digestSent: typeof result?.digestSent === 'boolean' ? result.digestSent : null,
    exclusivePrice: formatUsdFromCents(exclusiveLeadPriceCents()),
    sharedPrice: formatUsdFromCents(leadPriceCents()),
    reminderAfterHours: REMINDER_AFTER_HOURS,
    expandAfterHours: EXPAND_AFTER_HOURS,
    expireAfterDays: EXPIRE_AFTER_DAYS,
    digest: { subject: digest.subject, text: digest.text },
  };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => adminHead('Autopilot'));

// Astro re-rendered the page with the result (no redirect); the loader reads it back.
export const action = defineHandler(adminGuard, async (c) => {
  const db = getDb();
  const form = await c.req.formData();
  const intent = form.get('intent')?.toString();
  if (intent === 'run') {
    const runStats = await runAutopilot(db);
    await logAudit(db, {
      action: 'autopilot_manual_run',
      entityType: 'system',
      actor: adminActor(c),
      notes: JSON.stringify(runStats),
    });
    setAdminResult(c, { runStats });
  } else if (intent === 'digest') {
    setAdminResult(c, { digestSent: await sendDailyDigest(db, { force: true }) });
  }
});
