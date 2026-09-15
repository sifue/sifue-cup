import { expect, test } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

test.use({ timezoneId: 'America/Los_Angeles' });

test('PCのタイムゾーンに依存せずJSTで年越しする', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-12-31T23:59:59+09:00') });
  await page.goto('/overlays/clock.html');
  await expect(page.locator('#date')).toHaveText('2026.12.31');
  await expect(page.locator('#time')).toHaveText('23:59:59');
  await page.clock.runFor(1000);
  await expect(page.locator('#date')).toHaveText('2027.01.01');
  await expect(page.locator('#time')).toHaveText('00:00:00');
});

test('ローカルHTMLだけで動作し、背景が透過され、枠内に収まる', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 144 });
  await page.context().setOffline(true);
  await page.goto(pathToFileURL(path.resolve('public/overlays/clock.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#date')).toHaveText(/^\d{4}\.\d{2}\.\d{2}$/);
  await expect(page.locator('#time')).toHaveText(/^\d{2}:\d{2}:\d{2}$/);
  expect(await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    font: document.fonts.check('600 66px "Barlow Condensed"'),
    fits: [...document.querySelectorAll('.identity, .readout, .orbit, #time')].every(element => {
      const box = element.getBoundingClientRect();
      return box.x >= 6 && box.right <= 634 && box.y >= 6 && box.bottom <= 138 && (element.classList.contains('orbit') || element.scrollWidth <= element.clientWidth);
    }),
  }))).toEqual({ background: 'rgba(0, 0, 0, 0)', font: true, fits: true });
});

test('モーション設定を尊重し、OBS用指定で回転が継続する', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/overlays/clock.html');
  await expect(page.locator('.rotor')).toHaveCSS('animation-name', 'none');
  await page.goto('/overlays/clock.html?motion=full&bpm=130');
  await expect(page.locator('.rotor')).toHaveCSS('animation-name', 'spin');
  const before = await page.locator('.rotor').evaluate(element => getComputedStyle(element).transform);
  await expect.poll(() => page.locator('.rotor').evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await page.goto('/overlays/clock.html?motion=reduce');
  await expect(page.locator('.rotor')).toHaveCSS('animation-name', 'none');
});
