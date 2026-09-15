import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'docs/previews');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 144 } });
  const url = pathToFileURL(path.join(root, 'public/overlays/clock.html')).href;
  // プレビューのみ日時を固定する。本番HTMLには固定日時モードを設けない。
  await page.clock.setFixedTime(new Date('2026-09-15T17:53:59+09:00'));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(output, 'stream-clock.png'), omitBackground: true });
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const name of ['01_STREAM_STARTING', '10_BREAK', '12_STREAM_END']) {
    await page.goto(url);
    const background = pathToFileURL(path.join(root, `slides/generated/previews/${name}.png`)).href;
    await page.evaluate(async ({ background }) => {
      const image = new Image();
      image.src = background;
      await image.decode();
      document.body.style.background = `url("${background}") center / 100% 100% no-repeat`;
      Object.assign(document.querySelector('.stage').style, { transform: 'scale(.55)', left: '1080px', top: '36px' });
      await document.fonts.ready;
    }, { background });
    await page.screenshot({ path: path.join(output, `clock-${name.toLowerCase()}.png`) });
  }
  console.log('時計単体と3種類のスライド合成プレビューをdocs/previews/へ出力しました。');
} finally {
  await browser.close();
}
