import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import pptxgen from 'pptxgenjs';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'slides/generated');
const design = await fs.readFile(path.join(root, 'DESIGN.md'), 'utf8');
const configBlock = design.match(/<!-- stream-template-config:start -->\s*```json\s*([\s\S]*?)```/);
if (!configBlock) throw new Error('DESIGN.mdに配信テンプレート設定がありません。');
const config = JSON.parse(configBlock[1]);
// サイトのCSSからは読み込まず、仕様書の色を唯一の入力とする。
const colors = Object.fromEntries([...design.matchAll(/--([\w-]+):\s*#([\da-f]{6});/gi)].map((m) => [m[1], m[2]]));
for (const key of ['bg', 'surface', 'cream', 'cream-warm', 'ink', 'lime', 'red', 'gold', 'lavender', 'green-deep']) {
  if (!colors[key]) throw new Error(`DESIGN.mdに必要な色がありません: ${key}`);
}
await fs.mkdir(path.join(output, 'backgrounds'), { recursive: true });
await fs.mkdir(path.join(output, 'assets'), { recursive: true });
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const hex = (key) => `#${colors[key]}`;
const svg = (body, w = 1920, h = 1080) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

function background(light, accent) {
  const ink = light ? hex('ink') : hex('cream');
  const base = light ? hex('cream-warm') : hex('bg');
  return svg(`<defs>
    <radialGradient id="glow"><stop stop-color="${hex(accent)}" stop-opacity=".14"/><stop offset="1" stop-color="${base}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="${ink}" stroke-opacity=".045"/></pattern>
  </defs>
  <rect width="1920" height="1080" fill="${base}"/>
  <ellipse cx="1580" cy="280" rx="850" ry="680" fill="url(#glow)"/>
  <rect width="1920" height="1080" fill="url(#grid)"/>
  <path d="M1500 1080L1920 450V1080Z" fill="${hex(accent)}" opacity=".065"/>
  <path d="M1670 1080L1920 705M1730 1080L1920 795" stroke="${hex(accent)}" stroke-opacity=".2" stroke-width="2"/>
  <path d="M80 135H1840M80 982H1840" stroke="${ink}" stroke-opacity=".16"/>
  <path d="M80 135H235" stroke="${hex(accent)}" stroke-width="5"/>
  <path d="M1780 66L1789 82L1805 91L1789 100L1780 116L1771 100L1755 91L1771 82Z" fill="${hex(accent)}"/>
  <g fill="${hex(accent)}" opacity=".15" transform="translate(1800 900) rotate(-15)"><ellipse cy="12" rx="19" ry="15"/><ellipse cx="-24" cy="-7" rx="7" ry="10"/><ellipse cx="-9" cy="-19" rx="7" ry="10"/><ellipse cx="8" cy="-19" rx="7" ry="10"/><ellipse cx="24" cy="-7" rx="7" ry="10"/></g>`);
}

const placeholderSvg = svg(`<rect width="800" height="800" fill="${hex('surface')}"/><rect x="12" y="12" width="776" height="776" rx="8" fill="none" stroke="${hex('lime')}" stroke-opacity=".5" stroke-width="3" stroke-dasharray="12 10"/><path d="M240 480L355 355L430 430L485 375L570 480Z" fill="${hex('lime')}" opacity=".3"/><circle cx="490" cy="290" r="32" fill="${hex('lime')}" opacity=".3"/>`, 800, 800);
await sharp(Buffer.from(placeholderSvg)).png().toFile(path.join(output, 'assets/image-placeholder.png'));
await fs.copyFile(path.join(root, config.keyVisual), path.join(output, 'assets/key-visual.png'));

const pptx = new pptxgen();
pptx.defineLayout({ name: 'STREAM', width: config.width, height: config.height });
pptx.layout = 'STREAM';
pptx.author = 'sifue Cup';
pptx.subject = 'DESIGN.mdに基づく編集可能な配信テンプレート';
pptx.title = 'sifue杯 配信スライドテンプレート';
pptx.company = 'sifue Cup / Unofficial';
pptx.lang = 'ja-JP';
pptx.theme = { headFontFace: config.displayFont, bodyFontFace: config.bodyFont, lang: 'ja-JP' };
const scenes = [];
let scene;
let slide;
let foreground;

function text(value, x, y, w, h, options = {}) {
  const item = { ...options, type: 'text', value, x, y, w, h, fontFace: options.jp ? config.bodyFont : config.displayFont,
    fontSize: options.size ?? config.bodySize, color: colors[options.color] ?? foreground,
    align: options.align ?? 'left' };
  scene.objects.push(item);
  slide.addText(value, { x, y, w, h, fontFace: item.fontFace, fontSize: item.fontSize, color: item.color,
    bold: false, margin: 0, breakLine: false, valign: 'mid', align: item.align,
    fit: 'shrink', lang: 'ja-JP', objectName: options.name ?? `text-${scene.objects.length}` });
}
function rect(x, y, w, h, fill = 'surface', line = fill) {
  scene.objects.push({ type: 'rect', x, y, w, h, fill: colors[fill], line: colors[line] });
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: colors[fill] }, line: { color: colors[line], width: .7 }, objectName: `panel-${scene.objects.length}` });
}
function line(x1, y1, x2, y2, color = 'lime') {
  // 接続線も画像化せず、Google Slidesで動かせる図形にする。
  scene.objects.push({ type: 'line', x: x1, y: y1, w: x2 - x1, h: y2 - y1, color: colors[color] });
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: colors[color], width: 1.4 }, objectName: `connector-${scene.objects.length}` });
}
function image(relativePath, x, y, w, h, name) {
  scene.objects.push({ type: 'image', path: relativePath, x, y, w, h, name });
  slide.addImage({ path: path.join(output, relativePath), x, y, w, h, objectName: name, altText: name });
}
function slot(x, y, w, h, label) {
  image('assets/image-placeholder.png', x, y, w, h, label);
  text(label, x + .08, y + h - .4, w - .16, .28, { size: 12, jp: true, color: 'cream', align: 'center' });
}
function heading(title, subtitle) {
  text(title, .55, 1.12, 12.1, .72, { size: config.titleSize });
  text(subtitle, .58, 1.93, 12, .35, { jp: true, size: 15, color: scene.light ? 'green-deep' : 'lime' });
}
function pill(label, x, y, w, accent = 'lime') {
  rect(x, y, w, .36, accent);
  text(label, x + .08, y + .02, w - .16, .29, { size: 12, color: 'bg', align: 'center' });
}
function team(x, label, accent, roster = true) {
  rect(x, 2.7, 4.9, 3.7);
  rect(x, 2.7, .045, 3.7, accent);
  slot(x + .3, 3, 1.45, 1.45, '[ロゴ]');
  text(label, x + 1.97, 3.2, 2.55, .65, { size: 32, color: accent });
  text('[チーム名]', x + 1.97, 3.96, 2.55, .37, { jp: true, size: 18 });
  if (roster) {
    text('[選手1]  /  [選手2]  /  [選手3]', x + .3, 4.87, 4.3, .43, { jp: true, size: 16 });
    text('[選手4]  /  [選手5]', x + .3, 5.48, 4.3, .43, { jp: true, size: 16 });
  }
}

for (const id of config.slides) {
  const light = ['05_MATCH_RULES', '12_STREAM_END'].includes(id);
  const accent = id === '08_MATCH_RESULT' ? 'gold' : light ? 'red' : 'lime';
  const file = `${id.toLowerCase()}.png`;
  const svgSource = background(light, accent);
  await fs.writeFile(path.join(output, 'backgrounds', file.replace('.png', '.svg')), svgSource);
  await sharp(Buffer.from(svgSource)).resize(config.backgroundWidth, config.backgroundHeight).png().toFile(path.join(output, 'backgrounds', file));
  pptx.addSection({ title: id });
  slide = pptx.addSlide({ sectionTitle: id });
  slide.name = id;
  slide.background = { path: path.join(output, 'backgrounds', file) };
  foreground = colors[light ? 'ink' : 'cream'];
  scene = { id, light, background: `backgrounds/${file}`, objects: [] };
  scenes.push(scene);
  text('sifue杯', config.safeX, .32, 1.65, .38, { jp: true, size: 20 });
  text('STUDENT ESPORTS / UNOFFICIAL', 2.3, .38, 5.3, .26, { size: config.metaSize });
  text(id, 8.25, .38, 3.73, .26, { size: config.metaSize, align: 'right' });
  text('ZEN大学の非公認イベントです。', .55, 6.98, 6.2, .23, { jp: true, size: 10 });
  text('ALL TIMES JST  /  SIFUE CUP', 8.6, 6.98, 4.16, .23, { size: 10, align: 'right' });

  if (['00_TITLE', '01_STREAM_STARTING', '10_BREAK', '12_STREAM_END'].includes(id)) {
    image('assets/key-visual.png', 5.95, 2.4, 6.83, 3.844, 'key-visual-replaceable');
    line(5.95, 6.4, 12.78, 6.4, light ? 'red' : 'lime');
    if (id === '00_TITLE') {
      pill('SEPTEMBER / 2026', .55, 1.35, 2.25);
      text('PLAY.\nCOMPETE.\nCELEBRATE.', .55, 2, 5.18, 2.62, { size: config.heroSize, color: 'lime' });
      text('sifue杯 2026', .58, 4.91, 5, .62, { jp: true, size: 32 });
      text('[部門名]  /  [開催日] JST', .58, 5.75, 5, .38, { jp: true });
      text('大学の仲間が本気で遊ぶ、\n年に一度のeスポーツフェス。', 6.05, 1.3, 6.5, .78, { jp: true, size: 21 });
    } else if (id === '01_STREAM_STARTING') {
      pill('STAND BY', .55, 1.35, 1.65);
      text('STREAM\nSTARTING', .55, 2, 5.05, 1.85, { size: config.heroSize, color: 'lime' });
      text('まもなく配信開始', .58, 3.88, 5, .5, { jp: true, size: 25 });
      text('[19:00] JST', .58, 4.7, 5, .85, { size: 48 });
      text('[部門名]  /  [開始前のご案内]', .58, 5.82, 5, .58, { jp: true, size: 17 });
      text('GET READY TO PLAY.', 6.05, 1.53, 6.5, .6, { size: 30 });
    } else if (id === '10_BREAK') {
      pill('INTERMISSION', .55, 1.35, 2.05);
      text('TAKE\nA BREAK.', .55, 2, 5.05, 1.85, { size: config.heroSize, color: 'lime' });
      text('ただいま休憩中', .58, 3.9, 5, .5, { jp: true, size: 25 });
      text('[20:30] JST', .58, 4.7, 5, .85, { size: 48 });
      text('再開予定  /  [次の試合]', .58, 5.83, 5, .5, { jp: true, size: 17 });
      text('WE WILL BE RIGHT BACK.', 6.05, 1.53, 6.5, .6, { size: 30 });
    } else {
      pill('SEE YOU NEXT TIME', .55, 1.35, 2.65, 'gold');
      text('THANK YOU\nFOR\nWATCHING.', .55, 2, 5.05, 2.55, { size: 51, color: 'green-deep' });
      text('ご視聴ありがとうございました', .58, 4.92, 5, .54, { jp: true, size: 19 });
      text('次回予定：[開催日・部門]', .58, 5.68, 5, .45, { jp: true, size: 17 });
      text('大会のお知らせ：ZEN大学Slack #sifue杯', .58, 6.3, 11.7, .3, { jp: true, size: 14 });
      text('PLAY. COMPETE. CELEBRATE.', 6.05, 1.53, 6.5, .6, { size: 28, color: 'green-deep' });
    }
  } else if (id === '02_TODAY_SCHEDULE') {
    heading('TODAY’S SCHEDULE', '[部門名]  /  [開催日] JST');
    const rows = [['[19:00]', '[オープニング]', '[出演者・進行]'], ['[19:10]', '[第1試合]', '[TEAM A vs TEAM B]'], ['[20:00]', '[第2試合]', '[TEAM C vs TEAM D]'], ['[21:00]', '[決勝]', '[対戦カード]'], ['[22:00]', '[表彰・エンディング]', '[終了予定]']];
    rows.forEach((row, i) => {
      const y = 2.55 + i * .65;
      rect(.55, y, 12.23, .55, i % 2 ? 'bg-soft' : 'surface');
      text(row[0], .78, y + .05, 1.6, .4, { size: 24, color: 'lime' });
      text(row[1], 2.7, y + .06, 4.75, .38, { jp: true, size: 19 });
      text(row[2], 8, y + .06, 4.3, .38, { jp: true, size: 17 });
    });
    text('※ 時刻は記入例です。実際の進行に合わせて更新してください。', .7, 6.12, 11.9, .33, { jp: true, size: 14 });
  } else if (id === '03_TEAM_VS' || id === '11_NEXT_MATCH') {
    heading(id === '03_TEAM_VS' ? 'HEAD TO HEAD' : 'NEXT MATCH', '[部門名]  /  [試合番号]  /  [試合形式]');
    team(.55, '[TEAM A]', 'lime', id === '03_TEAM_VS');
    team(7.88, '[TEAM B]', 'lavender', id === '03_TEAM_VS');
    text('VS', 5.55, 3.8, 2.2, 1.2, { size: 72, color: 'gold', align: 'center' });
    if (id === '11_NEXT_MATCH') {
      pill('START AT [20:00] JST', 2.9, 5.1, 7.5, 'gold');
      text('[次の試合の見どころ・ご案内]', 2.9, 5.8, 7.5, .4, { jp: true, align: 'center', size: 18 });
    }
  } else if (id === '04_PLAYER_INTRO') {
    heading('PLAYER INTRODUCTION', '[部門名]  /  [チーム名]');
    slot(.55, 2.65, 3.32, 3.74, '[選手写真]');
    pill('[ROLE / POSITION]', 4.45, 2.65, 3);
    text('[PLAYER NAME]', 4.45, 3.32, 8.15, .84, { size: 46 });
    text('[選手名・ハンドルネーム]', 4.48, 4.27, 7.9, .48, { jp: true, size: 23 });
    line(4.45, 4.99, 12.78, 4.99);
    text('得意分野：[使用キャラクター・戦術など]', 4.48, 5.3, 7.9, .45, { jp: true, size: 19 });
    text('ひとこと：[意気込み・紹介コメント]', 4.48, 5.95, 7.9, .45, { jp: true, size: 19 });
  } else if (id === '05_MATCH_RULES') {
    heading('MATCH RULES', '[部門名]  /  当日の試合ルール');
    const labels = ['試合形式', '勝利条件', '使用設定', '注意事項'];
    labels.forEach((label, i) => {
      const x = .55 + (i % 2) * 6.3, y = 2.65 + Math.floor(i / 2) * 1.53;
      rect(x, y, 5.93, 1.3, 'cream');
      text(`0${i + 1}`, x + .2, y + .17, .6, .45, { color: 'red', size: 26 });
      text(label, x + 1, y + .18, 4.5, .35, { jp: true, size: 20 });
      text(`[${label}を記入]`, x + 1, y + .72, 4.5, .34, { jp: true, size: 17 });
    });
    text('運営連絡先：[チャンネル・担当者]  /  詳細は当日の大会案内を確認', .65, 6.15, 12, .38, { jp: true, size: 15 });
  } else if (id === '06_MAP_PICK') {
    heading('MAP / STAGE PICK', '[部門名]  /  [選択順・試合形式]');
    ['lime', 'lavender', 'gold'].forEach((color, i) => {
      const x = .55 + i * 4.17;
      rect(x, 2.65, 3.88, 3.75);
      slot(x + .16, 2.82, 3.56, 2, '[マップ画像]');
      text(`[MAP ${i + 1}]`, x + .22, 5.02, 3.44, .47, { size: 28 });
      pill('[PICK / BAN / DECIDER]', x + .22, 5.61, 3.44, color);
      text('[選択チーム]', x + .22, 6.08, 3.44, .24, { jp: true, size: 13 });
    });
  } else if (id === '07_SCORE') {
    heading('SCOREBOARD', '[部門名]  /  [試合番号]  /  [試合形式]');
    rect(.55, 2.7, 12.23, 3.6);
    slot(.88, 3.05, 1.75, 1.75, '[ロゴA]');
    slot(10.69, 3.05, 1.75, 1.75, '[ロゴB]');
    text('[TEAM A]', .88, 5.05, 3.1, .62, { size: 30, color: 'lime' });
    text('[TEAM B]', 9.34, 5.05, 3.1, .62, { size: 30, color: 'lavender', align: 'right' });
    text('0', 4.04, 3.14, 1.88, 1.72, { size: 110, color: 'lime', align: 'center', name: 'score-a' });
    text('—', 6.03, 3.44, 1.25, 1.1, { size: 55, align: 'center' });
    text('0', 7.39, 3.14, 1.88, 1.72, { size: 110, color: 'lavender', align: 'center', name: 'score-b' });
    text('[現在のマップ・ラウンド・進行状況]', 3.6, 5.66, 6.15, .38, { jp: true, size: 17, align: 'center' });
  } else if (id === '08_MATCH_RESULT') {
    heading('MATCH RESULT', '[部門名]  /  [試合番号]');
    slot(.75, 2.85, 2.95, 2.95, '[勝利チームのロゴ]');
    pill('WINNER', 4.3, 2.7, 1.85, 'gold');
    text('[WINNING TEAM]', 4.3, 3.34, 8.25, .85, { size: 48, color: 'gold' });
    text('[2] — [1]', 4.3, 4.38, 4, .93, { size: 55 });
    text('vs [対戦チーム]', 8.6, 4.74, 3.9, .43, { jp: true, size: 21 });
    line(4.3, 5.62, 12.78, 5.62, 'gold');
    text('MVP：[選手名]  /  [勝利チームへのメッセージ]', 4.3, 5.97, 8.3, .4, { jp: true, size: 17 });
  } else if (id === '09_BRACKET') {
    heading('TOURNAMENT BRACKET', '[部門名]  /  4チーム・シングルエリミネーション記入用');
    text('SEMI FINALS', .65, 2.56, 3.5, .3, { size: 17, color: 'lime' });
    text('FINAL', 5.3, 2.56, 3.35, .3, { size: 17, color: 'lime' });
    text('CHAMPION', 10.0, 2.56, 2.55, .3, { size: 17, color: 'gold' });
    // 接続線をカードより先に置き、チーム名やスコアに重ねない。
    line(4.35, 3.69, 4.77, 3.69); line(4.35, 5.49, 4.77, 5.49);
    line(4.77, 3.69, 4.77, 5.49); line(4.77, 4.59, 5.25, 4.59);
    line(8.97, 4.59, 9.65, 4.59, 'gold');
    function match(x, y, a, b) {
      rect(x, y, 3.72, 1.16);
      line(x + .16, y + .58, x + 3.56, y + .58, 'green');
      text(a, x + .16, y + .12, 2.75, .32, { size: 19 });
      text(b, x + .16, y + .7, 2.75, .32, { size: 19 });
      text('[0]', x + 3, y + .12, .53, .32, { size: 19, color: 'lime', align: 'center' });
      text('[0]', x + 3, y + .7, .53, .32, { size: 19, color: 'lime', align: 'center' });
    }
    match(.63, 3.11, '[TEAM A]', '[TEAM B]');
    match(.63, 4.91, '[TEAM C]', '[TEAM D]');
    match(5.25, 4.01, '[SEMI FINAL 1 WINNER]', '[SEMI FINAL 2 WINNER]');
    rect(9.65, 4.01, 3.12, 1.16, 'surface', 'gold');
    text('[WINNING TEAM]', 9.83, 4.35, 2.76, .48, { size: 23, color: 'gold', align: 'center' });
    text('※ 組み合わせ・スコア・勝ち上がりは手動で編集します。', .65, 6.39, 11.9, .28, { jp: true, size: 13 });
  }
  slide.addNotes(`${id}\nDESIGN.md 第33章を参照。角括弧内の内容は記入例です。配信前に置換してください。\n背景は固定PNG。テキスト、画像、カード、接続線は編集できます。画像は「画像を置換」で差し替えます。\n時刻はJSTです。実際のルール・対戦・スコアに置換し、Google Slides取り込み後にフォントと改行を確認してください。`);
}

// 全オブジェクトの座標を確認し、誤った配置での成果物生成を防ぐ。
for (const page of scenes) for (const object of page.objects) {
  if (object.x < 0 || object.y < 0 || object.x + object.w > config.width + .01 || object.y + object.h > config.height + .01) {
    throw new Error(`${page.id}: スライド外にはみ出すオブジェクトがあります。${JSON.stringify(object)}`);
  }
}
await pptx.writeFile({ fileName: path.join(output, 'sifue-cup-stream-template.pptx') });
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify({ designSha256: createHash('sha256').update(design).digest('hex'), config, scenes }, null, 2));

// PPTXと同じ配置データからブラウザ確認用ページを生成する。PPTXのレンダリングとは区別する。
function renderObject(o) {
  const box = `position:absolute;left:${o.x}in;top:${o.y}in;width:${o.w}in;height:${o.h}in;`;
  if (o.type === 'image') return `<img alt="${escape(o.name)}" src="${o.path}" style="${box}"/>`;
  if (o.type === 'rect') return `<div style="${box}background:#${o.fill};border:.7pt solid #${o.line};box-sizing:border-box"></div>`;
  if (o.type === 'line') return `<div style="${box}border-${o.w ? 'top' : 'left'}:1.4pt solid #${o.color}"></div>`;
  return `<div class="text" style="${box}font-family:'${escape(o.fontFace)}',sans-serif;font-size:${o.fontSize}pt;color:#${o.color};text-align:${o.align};justify-content:${o.align === 'center' ? 'center' : o.align === 'right' ? 'flex-end' : 'flex-start'}"><span>${escape(o.value)}</span></div>`;
}
const html = `<!doctype html><html lang="ja"><meta charset="UTF-8"><title>sifue杯 配信スライド配置プレビュー</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400&family=Zen+Kaku+Gothic+New:wght@400&display=swap" rel="stylesheet">
<style>body{margin:0;background:#333;color:white;font-family:sans-serif}.slide{position:relative;width:${config.width}in;height:${config.height}in;margin:0 0 36px;background-size:100% 100%;overflow:hidden}.text{display:flex;align-items:center;line-height:1.08}.text span{white-space:pre-wrap;overflow-wrap:break-word;width:100%}h1,p{margin:20px;font-size:16px}</style>
<h1>配信テンプレート・配置プレビュー</h1><p>PPTXと共通の配置データによるHTMLプレビューです。Google Slidesへの変換結果そのものではありません。</p>
${scenes.map((p) => `<section class="slide" id="${p.id}" aria-label="${p.id}" style="background-image:url('${p.background}')">${p.objects.map(renderObject).join('')}</section>`).join('\n')}</html>`;
await fs.writeFile(path.join(output, 'preview.html'), html);
console.log(`13枚の編集可能な配信テンプレートを生成しました: ${path.relative(root, output)}`);
