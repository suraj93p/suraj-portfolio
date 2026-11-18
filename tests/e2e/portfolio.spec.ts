import { test, expect } from '@playwright/test';
import { portfolioConfig as data } from '../../src/config/portfolio.config';

test('complete content, honest professional links and no JavaScript errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('./');
  await expect(page).toHaveTitle(data.site.title); await expect(page.getByRole('heading', { level: 1 })).toHaveText(data.hero.heading);
  await expect(page.locator('[data-experience-item]')).toHaveCount(7); await expect(page.locator('[data-project-card]')).toHaveCount(2);
  await expect(page.getByText('Contract through Virtusa')).toBeVisible();
  await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', data.profile.socialLinks[1].href);
  expect(errors).toEqual([]);
});
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`responsive page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto('./');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('#contact').scrollIntoViewIfNeeded(); await expect(page.getByText(data.profile.email)).toBeVisible();
  });
}
test('all company filters, result announcements and stable focus', async ({ page }) => {
  await page.goto('./'); const group = page.getByRole('group', { name: data.ui.experienceFilterLabel });
  for (const role of data.experience) {
    const button = group.getByRole('button', { name: role.company, exact: true }); await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true'); await expect(button).toBeFocused();
    await expect(page.locator('[data-experience-item]:visible')).toHaveCount(1);
    await expect(page.locator(`[data-experience-item="${role.id}"]`)).toBeVisible(); await expect(page.getByText('1 role shown')).toBeVisible();
  }
  await group.getByRole('button', { name: 'All', exact: true }).click(); await expect(page.locator('[data-experience-item]:visible')).toHaveCount(7);
});
test('mobile disclosure, Escape and keyboard section focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./');
  const toggle = page.locator('button[aria-controls="primary-navigation"]'); await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(toggle).toBeFocused(); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click(); const link = page.getByRole('navigation', { name: data.ui.primaryNavigationLabel }).getByRole('link', { name: 'About' });
  await link.focus(); await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { name: data.about.heading })).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
test('native project details and clipboard failure remain usable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Denied')) } }));
  await page.goto('./'); const details = page.locator('[data-project-card] details').first(); await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', ''); await expect(details.getByText(data.ui.contextLabel, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: data.contact.copyActionLabel }).click(); await expect(page.getByText(data.ui.emailCopyFailed)).toBeVisible();
});
test('skip link is first and reduced motion disables smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./'); await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: data.ui.skipToContent })).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});
test('print reveals all filtered experience and restores detail disclosure state', async ({ page }) => {
  await page.goto('./'); await page.getByRole('group', { name: data.ui.experienceFilterLabel }).getByRole('button', { name: 'Deskera', exact: true }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint'))); await page.emulateMedia({ media: 'print' });
  await expect(page.locator('[data-experience-item]:visible')).toHaveCount(7);
  expect(await page.locator('main details').evaluateAll((nodes) => nodes.every((node) => (node as HTMLDetailsElement).open))).toBe(true);
  await page.emulateMedia({ media: 'screen' }); await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect(page.locator('[data-experience-item]:visible')).toHaveCount(1); await expect(page.locator('[data-project-card] details').first()).not.toHaveAttribute('open', '');
});
test('without JavaScript, the generated profile is still available', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage(); await page.goto('./');
  await expect(page.getByRole('heading', { name: data.ui.noScriptHeading })).toBeVisible(); await expect(page.getByText('Contract through Virtusa')).toBeVisible();
  await expect(page.getByRole('link', { name: data.profile.email })).toHaveAttribute('href', `mailto:${data.profile.email}`); await context.close();
});
