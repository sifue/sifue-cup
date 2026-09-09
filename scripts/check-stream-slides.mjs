import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import http from 'node:http';
import JSZip from 'jszip';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'slides/generated');
const manifest = JSON.parse(await fs.readFile(path.join(output, 'manifest.json'), 'utf8'));
const design = await fs.readFile(path.join(root, 'DESIGN.md'));
if (manifest.designSha256 !== createHash('sha256').update(design).digest('hex')) throw new Error('DESIGN.mdが更新されています。スライドを再生成してください。');
const zip = await JSZip.loadAsync(await fs.readFile(path.join(output, 'sifue-cup-stream-template.pptx')));
const xmlFiles = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));
if (xmlFiles.length !== 13) throw new Error('スライド数が13枚ではありません。');
const report = [];
for (let i = 0; i < 13; i++) {
  const xml = await zip.file(`ppt/slides/slide${i + 1}.xml`).async('string');
  if (!/<p:bg>.*?<a:blip /s.test(xml)) throw new Error(`スライド${i + 1}のPNG背景がありません。`);
  const textCount = (xml.match(/<p:txBody>/g) ?? []).length;
  const pictureCount = (xml.match(/<p:pic>/g) ?? []).length;
  const scene = manifest.scenes[i];
  if (textCount !== scene.objects.filter((o) => o.type === 'text').length) throw new Error(`${scene.id}: 編集可能テキストの数が不一致です。`);
  if (pictureCount !== scene.objects.filter((o) => o.type === 'image').length) throw new Error(`${scene.id}: 差し替え画像の数が不一致です。`);
  for (const match of xml.matchAll(/<a:srgbClr val="([^"]+)"/g)) {
    if (!/^[\da-f]{6}$/i.test(match[1])) throw new Error(`${scene.id}: 不正なカラー値です。`);
  }
  report.push({ slide: scene.id, editableTextCount: textCount, replaceableImageCount: pictureCount, pngBackground: true });
}

// HTML配置プレビューを撮影。Google Slidesの実レンダリング検証ではない。
const server = http.createServer(async (req, res) => {
  const requested = path.resolve(output, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!requested.startsWith(output + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const bytes = await fs.readFile(requested);
    res.setHeader('Content-Type', requested.endsWith('.html') ? 'text/html; charset=utf-8' : 'image/png');
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch();
const previewDirectory = path.join(output, 'previews');
await fs.mkdir(previewDirectory, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${server.address().port}/preview.html`);
  await page.evaluate(() => document.fonts.ready);
  const fontStatus = await page.evaluate(([display, body]) => ({
    display: document.fonts.check(`20px "${display}"`),
    body: document.fonts.check(`20px "${body}"`),
  }), [manifest.config.displayFont, manifest.config.bodyFont]);
  const overflow = await page.locator('.text').evaluateAll((elements) => elements.filter((el) => {
    const span = el.querySelector('span');
    return span.scrollHeight > el.clientHeight + 2 || span.scrollWidth > el.clientWidth + 2;
  }).map((el) => ({ slide: el.closest('.slide').id, text: el.textContent })));
  if (overflow.length) throw new Error(`配置プレビューの文字が枠を超えています: ${JSON.stringify(overflow)}`);
  const tiles = [];
  for (const [i, scene] of manifest.scenes.entries()) {
    const png = await page.locator(`[id="${scene.id}"]`).screenshot({ path: path.join(previewDirectory, `${scene.id}.png`) });
    const thumbnail = await sharp(png).resize(480, 270).png().toBuffer();
    tiles.push({ input: thumbnail, left: (i % 3) * 500 + 10, top: Math.floor(i / 3) * 290 + 10 });
  }
  await sharp({ create: { width: 1500, height: 1450, channels: 3, background: '#30322d' } }).composite(tiles).png().toFile(path.join(output, 'overview.png'));
  await fs.writeFile(path.join(output, 'validation.json'), JSON.stringify({
    aspectRatio: '16:9',
    previewType: '共通配置データのHTMLプレビュー。Google Slides実機検証は未実施。',
    fontStatus,
    textOverflow: overflow,
    slides: report,
  }, null, 2));
  console.log('13枚のPPTX背景・編集可能テキスト・差し替え画像を確認。配置プレビューと一覧画像を生成しました。');
  console.log(`プレビューフォント: ${JSON.stringify(fontStatus)}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
