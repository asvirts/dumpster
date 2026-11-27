import { expect, test } from '@playwright/test';

test('home renders with one analytics tag', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Find A Dumpster/);
  expect(await page.locator('script[src*="googletagmanager.com/gtag"]').count()).toBe(1);
});

test('city page map renders', async ({ page }) => {
  await page.goto('/dumpster-rental/tx/houston');
  const canvas = page.locator('.maplibregl-canvas');
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  expect((await canvas.boundingBox())?.height ?? 0).toBeGreaterThan(100);
});

test('trailing slash 301s to slash-less URL', async ({ request }) => {
  const res = await request.get('/guides/', { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers().location).toMatch(/\/guides$/);
});

test('unknown URL is a 404 and assets still serve', async ({ request }) => {
  expect((await request.get('/nope')).status()).toBe(404);
  expect((await request.get('/favicon.svg')).status()).toBe(200);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('quote form native POST round-trips feedback', async ({ page }) => {
    await page.goto('/dumpster-rental/tx/houston');
    const form = page.locator('form:has([name="seekerEmail"])').first();
    // Passes the browser's required/type checks but fails the server schema (address min 3),
    // so no lead is written.
    await form.locator('[name="addressOrZip"]').fill('77');
    await form.locator('[name="seekerName"]').fill('Smoke Test');
    await form.locator('[name="seekerEmail"]').fill('smoke@example.com');
    await form.locator('[name="seekerPhone"]').fill('5555550100');
    await form.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dumpster-rental\/tx\/houston/);
    await expect(page.getByText('Please check the highlighted fields and try again.')).toBeVisible();
    await expect(page.locator('[name="seekerEmail"]').first()).toHaveValue('smoke@example.com');
  });
});
