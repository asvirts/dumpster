/**
 * Apply pending D1 migrations to production before Cloudflare Workers Builds deploys.
 *
 * Every push to main deploys, so new code must never go live ahead of its schema.
 * Runs only inside Workers Builds (WORKERS_CI=1); local `bun run build` skips it.
 * A failed migration exits non-zero, which fails the build, so nothing deploys.
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

if (process.env.WORKERS_CI !== '1') process.exit(0);

const wrangler = join(process.cwd(), 'node_modules/.bin/wrangler');
console.log('[ci-migrate] applying pending D1 migrations to dumpsterlocal (remote)');
const res = spawnSync(wrangler, ['d1', 'migrations', 'apply', 'dumpsterlocal', '--remote'], {
  stdio: 'inherit',
  env: { ...process.env, CI: '1' },
});
if (res.error) console.error('[ci-migrate]', res.error);
process.exit(res.status ?? 1);
