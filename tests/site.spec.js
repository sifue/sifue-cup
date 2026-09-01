import { expect, test } from '@playwright/test';

test('主要コンテンツと外部リンクが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/sifue杯/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('PLAY. COMPETE.');
  await expect(page.locator('.tournament-card')).toHaveCount(5);
  await expect(page.getByRole('link', { name: /の配信をYouTubeで見る/ })).toHaveCount(5);
  await expect(page.locator('.archive-card')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'SHADOWVERSE WORLDS BEYOND' })).toBeVisible();
  await expect(page.getByText('チームサファイア', { exact: true })).toBeVisible();
  await expect(page.getByText('(サポートメンバー参加)', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /配信アーカイブ/ })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'EMAIL' })).toHaveAttribute('href', 'mailto:sifue@soichiro.org');
});

test('2026年の各配信リンクがCONTENTS.mdのURLと一致する', async ({ page }) => {
  await page.goto('/');

  const links = await page.locator('.tournament-card__stream').evaluateAll((elements) => elements.map((element) => element.href));
  expect(links).toEqual([
    'https://youtube.com/live/0CCF2n88eq4?feature=share',
    'https://youtube.com/live/yeHR9xMluS4?feature=share',
    'https://youtube.com/live/g0F21rPJpAQ?feature=share',
    'https://youtube.com/live/diY0q5pa3aA?feature=share',
    'https://youtube.com/live/X61vAb_KsXo?feature=share',
  ]);
});

test('2026年の開催前ステータスをJST日時から表示する', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-01T00:00:00+09:00') });
  await page.goto('/');

  await expect(page.locator('.status--upcoming')).toHaveCount(5);
});

test('開催日は開始時刻前からTODAYを表示する', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-19T00:01:00+09:00') });
  await page.goto('/');

  await expect(page.locator('.status--today')).toHaveCount(1);
  await expect(page.locator('.status--upcoming')).toHaveCount(4);
});

test('モバイルメニューを開閉してセクションへ移動できる', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'モバイル表示のみの確認');
  await page.goto('/');

  const menuButton = page.locator('[data-menu-button]');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: /ABOUT/ }).last().click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#about')).toBeInViewport();
});

test('横スクロールが発生しない', async ({ page }) => {
  await page.goto('/');
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflows).toBe(false);
});

test('SNS共有用のOGP情報が設定されている', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /sifue杯/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://sifue-cup.pages.dev/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /^https:\/\//);
});
