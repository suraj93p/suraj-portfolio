import { test, expect } from '@playwright/test';
import { portfolioConfig as data } from '../../src/config/portfolio.config';

test('manifest, icons, worker and missing-asset behaviour', async ({ page, request, baseURL }) => {
  await page.goto('./'); const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href'); expect(manifestHref).toBeTruthy();
  const manifestURL = new URL(manifestHref!, baseURL); const response = await request.get(manifestURL.href); expect(response.ok()).toBe(true);
  const manifest = await response.json(); expect(manifest.name).toBe(data.pwa.name); expect(manifest.display).toBe('standalone');
  expect(new URL(manifest.start_url, manifestURL).pathname).toBe(data.site.basePath);
  for (const icon of manifest.icons) { const result = await request.get(new URL(icon.src, manifestURL).href); expect(result.ok()).toBe(true); expect(result.headers()['content-type']).toContain('image/png'); }
  const missing = await request.get(new URL(`${data.site.basePath}missing-file.js`, baseURL).href); expect(missing.status()).toBe(404);
});
test('core content survives an offline reload after successful precaching', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await context.setOffline(true); await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(data.hero.heading);
  await page.getByRole('group', { name: data.ui.experienceFilterLabel }).getByRole('button', { name: 'Deskera', exact: true }).click();
  await expect(page.locator('[data-experience-item]:visible')).toHaveCount(1);
  await page.locator('[data-project-card] details').first().locator('summary').click();
  await expect(page.locator('[data-project-card] details').first()).toHaveAttribute('open', '');
  await context.setOffline(false);
});
