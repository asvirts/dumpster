import { defineConfig } from '@playwright/test';

// Local smoke tests against a running server (default: `pnpm dev` on :8788).
// Run: pnpm e2e   (or E2E_BASE_URL=http://localhost:8789 pnpm e2e for the production preview)
export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8788', channel: 'chrome' },
});
