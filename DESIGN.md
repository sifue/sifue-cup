# sifue杯 Teaser Site — DESIGN.md

## 0. このドキュメントの目的

この `DESIGN.md` は、**sifue杯（しふーはい / sifue Cup）** のティザー兼アーカイブサイトを実装するためのデザイン仕様書です。

実装時の最優先事項は次の4点です。

1. **eスポーツチーム／大会サイトらしい、強く・速く・洗練された印象**
2. 添付キービジュアルが持つ **グリーン、レッド、クリーム、ゴールド、ラベンダー** の「クールだけどキュート」な世界観
3. JavaScript / CSS animation を使った **触って楽しいモーション**
4. 大学の非公式イベントであることを明確にしつつ、参加者が誇らしく感じられる品質

ZETA DIVISION、Crazy Raccoon、FENNEL の公式サイトに見られるような、**大胆なタイポグラフィ、余白、ブランドの強さ、カルチャー感**を参考にする。ただし、ロゴ・レイアウト・演出・素材を直接模倣せず、sifue杯独自の「緑のマスコット × 学生eスポーツ × 祝祭感」に落とし込む。

---

# 1. ブランドコンセプト

## 1.1 キーワード

- COOL
- CUTE
- ESPORTS
- CAMPUS
- FESTIVAL
- COMMUNITY
- COMPETITIVE
- FRIENDLY
- HANDMADE × PROFESSIONAL

## 1.2 ブランドの一言定義

> **大学の仲間が本気で遊ぶ、年に一度のeスポーツフェス。**

プロチームの公式サイトのようにかっこよく見せつつ、威圧的にはしない。
「強そう」だけではなく、「参加してみたい」「配信を見てみたい」「去年の結果も見たい」と思える親しみやすさを残す。

## 1.3 トーン

- 文章：簡潔、明快、少しフレンドリー
- UI：シャープ、太い、余白大きめ
- キャラクター要素：かわいいが子どもっぽくしない
- 装飾：肉球、紙吹雪、斜線、星、ブラシストローク
- 主役：大会そのもの。主催者情報は最後に置く

---

# 2. キービジュアル

実装プロジェクト内に、添付画像を以下のようなパスへ配置して利用する。

```text
/public/images/sifue-cup-key-visual.png
```

元画像：`sifue-cup-key-visual.png`

画像比率はほぼ16:9。PCではファーストビューの主役として大きく見せる。

## 2.1 PCでの扱い

- Hero 高さ：`min(920px, 100svh)` 程度
- 画像を画面中央に大きく表示
- `object-fit: cover`
- 上下に暗いグラデーションを重ね、テキストの可読性を確保
- キービジュアル自体に「sifue杯2026」の文字が入っているため、上に同じ巨大文字を重ねすぎない
- 左下または下中央にイベント情報・CTAを配置

## 2.2 Mobileでの扱い

- `object-position: center center`
- 高さは `78svh〜88svh`
- キャラクターの顔と「sifue杯2026」の文字が切れないように調整
- 下部に濃いグラデーションを置いてCTAを表示

## 2.3 Hero上の表示

小さなラベル：

```text
ZEN UNIVERSITY STUDENT ESPORTS / UNOFFICIAL
SEPTEMBER 2026 / JST
```

メインコピー：

```text
PLAY. COMPETE. CELEBRATE.
```

日本語サブコピー：

```text
大学の仲間が本気で遊ぶ、年に一度のeスポーツフェス。
```

CTA：

- `2026 TOURNAMENTS` → 2026セクションへスクロール
- `PAST CHAMPIONS` → 2025セクションへスクロール

SlackについてはURLが与えられていないので、偽リンクを作らない。
代わりにテキストで `ZEN大学Slack #sifue杯` と表示する。

---

# 3. カラースキーム

添付キービジュアルから抽出した色をベースにする。
ダークなeスポーツUIを土台にし、明るいクリームとグリーンで「sifue杯らしさ」を出す。

```css
:root {
  --bg: #0e0f0c;
  --bg-soft: #171913;
  --surface: #1d2118;
  --surface-2: #262b20;

  --cream: #f7f4ef;
  --cream-warm: #faf2dd;
  --ink: #372d36;

  --green-deep: #3f5a0d;
  --green: #8e9d49;
  --lime: #bccd6e;

  --red: #c64e39;
  --red-dark: #9f392c;

  --gold: #f2c582;
  --gold-deep: #a77530;

  --lavender: #8587ce;

  --text: #f7f4ef;
  --text-muted: rgba(247, 244, 239, 0.68);
  --line: rgba(247, 244, 239, 0.14);
}
```

## 3.1 色の役割

- 背景：ほぼ黒に近いグリーンブラック
- 大会年・重要CTA：ライムグリーン
- 勝者・優勝：ゴールド
- 強調・LIVE・日付：レッド
- 可愛いアクセント：ラベンダー
- 明るいセクション：クリーム

ゲームタイトルごとに公式ブランドカラーを多用しない。
サイト全体の統一感を優先する。

---

# 4. タイポグラフィ

## 4.1 推奨

日本語本文：

```text
Zen Kaku Gothic New
```

英数字・見出し：

```text
Barlow Condensed
```

代替：

```text
Noto Sans JP
Inter
Arial Narrow
sans-serif
```

## 4.2 ルール

- 英字見出しは基本 `UPPERCASE`
- 見出しはかなり大きくする
- 文字間はやや詰める
- 小さなメタ情報は `letter-spacing: 0.08em〜0.14em`
- 本文は読みやすさ優先で極端に細くしない

例：

```text
2026 TOURNAMENTS
PAST CHAMPIONS
ABOUT SIFUE CUP
ORGANIZER
```

日本語見出しも併記してよいが、同じ大きさで競合させない。

---

# 5. ページ構成

1ページ完結のランディングページとする。

```text
Header
Hero
Ticker / Game Titles
About
2026 Tournaments
Archive / 2025
Past Champions
Organizer
Footer
```

---

# 6. Header

## Desktop

左：

```text
sifue杯
SIFUE CUP
```

右：

```text
ABOUT
2026
ARCHIVE
ORGANIZER
```

仕様：

- Hero上では透明
- スクロールすると半透明の黒 + blur
- 高さ 64〜76px
- 下線ではなく、hoverで短いライム色のバーが走る
- ロゴ横に小さな肉球アイコンを置いてもよい

## Mobile

- 左にブランド
- 右にMenuボタン
- 全画面オーバーレイメニュー
- メニュー項目は大きな英字 + 小さな日本語

---

# 7. Hero animation

過剰な3DやWebGLは不要。
軽量なDOM/CSS animationで「プロっぽい動き」を作る。

## 初回ロード

1. 背景が黒からフェード
2. キービジュアルが `scale(1.04) → 1.00`
3. 上下の細いラインが左右から伸びる
4. ラベル、コピー、CTAが 80〜120msずつ stagger して出現
5. 小さな紙吹雪・星・肉球が2〜4個だけゆっくり漂う

総時間は 1.2〜1.8秒程度。
「待たされるイントロ」にはしない。

## Pointer interaction

PCのみ：

- Hero上でポインタ位置に追従する薄いradial glow
- キービジュアルは最大6〜10pxだけparallax
- Trophy付近にごく薄いshineを定期的に走らせる

## Scroll

- Heroの画像を最大 `translateY(30px)` 程度parallax
- 次セクションの見出しが Hero の上に少しせり上がる構成でもよい

---

# 8. Game ticker

Hero直下に横長tickerを置く。

```text
LEAGUE OF LEGENDS  ✦  VALORANT  ✦  OVERWATCH  ✦  ROCKET LEAGUE  ✦  SHADOWVERSE WORLDS BEYOND
```

- 黒背景
- クリーム文字
- 区切りだけライム or レッド
- 20〜30秒程度でゆっくり横移動
- hover時停止
- `prefers-reduced-motion` では静止

---

# 9. About section

クリーム背景に切り替える。
ダークセクションとのコントラストを強くする。

左：大きな見出し

```text
ABOUT
SIFUE CUP
```

右：本文

> sifue杯(しふーはい, sifue Cup)とは、学校法人日本財団ドワンゴ学園ZEN大学の教員吉村総一郎、ハンドルネームsifueが主催する大学非公認のZEN大学生向けeスポーツ大会です。毎年9月に開催されます。
>
> このサイトでは、sifue杯の開催情報、過去の優勝者および配信情報などをまとめています。実際の大会のアナウンスなどはZEN大学Slackの #sifue杯 チャンネルをご覧ください。

非公認であることは、本文だけに埋め込まず小さなbadgeでも表示する。

```text
UNOFFICIAL UNIVERSITY EVENT
```

ただし警告色のようにはしない。

---

# 10. 2026 Tournaments section

最重要セクション。

見出し：

```text
2026
TOURNAMENTS
```

サブ：

```text
5 TITLES / 55 PLAYERS / SEPTEMBER 19–23
```

※ 参加者数は各部門の単純合計値。

## 10.1 カード構成

PC：5枚を固定5列に押し込まない。

推奨：

```text
[ LoL          ][ VALORANT     ]
[ OVERWATCH    ][ ROCKET LEAGUE]
[ SHADOWVERSE WORLDS BEYOND   ]
```

または 12-column grid でサイズ差を付ける。

カード内：

```text
01
LEAGUE OF LEGENDS
2026.09.19 SAT
19:00—23:30 JST
4 TEAMS / 20 PLAYERS
UPCOMING
YOUTUBE LIVE / WATCH STREAM
```

配信URLがある場合は、各カード内にYouTube配信ボタンを常時表示する。新しいタブで開き、外部リンクであることを矢印で明示する。

ステータスはJavaScriptでJST基準に自動判定：

- 開催前：`UPCOMING`
- 開催日：`TODAY`
- 終了後：`ENDED`

## 10.2 2026データ

### sifue杯2026 LoL部門

- 開催日時: 2026年9月19日(土) 19:00-23:30
- 参加チーム数: 4
- 参加者数: 20
- 配信: https://youtube.com/live/0CCF2n88eq4?feature=share

### sifue杯2026 VALORANT部門

- 開催日時: 2026年9月20日(日) 19:00-23:30
- 参加チーム数: 2
- 参加者数: 10
- 配信: https://youtube.com/live/yeHR9xMluS4?feature=share

### sifue杯2026 オーバーウォッチ部門

- 開催日時: 2026年9月21日(月) 19:00-23:30
- 参加チーム数: 2
- 参加者数: 10
- 配信: https://youtube.com/live/g0F21rPJpAQ?feature=share

### sifue杯2026 ロケットリーグ部門

- 開催日時: 2026年9月22日(火) 13:00-15:30
- 参加チーム数: 3
- 参加者数: 9
- 配信: https://youtube.com/live/diY0q5pa3aA?feature=share

### sifue杯2026 シャドウバース Worlds Beyond部門

- 開催日時: 2026年9月23日(水) 13:00-15:30
- 参加チーム数: 2
- 参加者数: 6
- 配信: https://youtube.com/live/X61vAb_KsXo?feature=share

## 10.3 Card motion

- scroll-in時 `opacity + translateY(24px)`
- stagger 80ms
- hover：
  - borderがライムに変化
  - カードが `translateY(-4px)`
  - 背面に大きな `01`, `02` 等の番号が薄く現れる
  - 右上の矢印が斜めに2〜4px動く
- 3D tiltは最大1〜2度。大きく傾けない

---

# 11. 2025 Archive

背景を再びダークに戻す。

```text
ARCHIVE
2025
```

タイムライン形式または大きなイベントカード2枚で構成する。

各イベントカードは「大会情報」と「優勝チーム」を一体化する。
YouTube配信があるため、`WATCH STREAM` ボタンを強調する。

YouTubeリンクは新しいタブで開く。

---

# 12. 2025 — LoL初心者sifue杯

```text
開催日時: 2025年9月14日(日) 19:00–23:00
参加チーム数: 2
参加者数: 15
配信: https://www.youtube.com/watch?v=jrB8nq6rSJ0
```

## 優勝チーム

```text
TEAM 2
CHAMPION
```

| ROLE | チーム2 |
| --- | --- |
| TOP | isseyrockwell#7256 |
| JG | naruneco#5909 |
| MID | (サポートメンバー参加) |
| BOT | chanbethe8east#1412 |
| SUP | さゆう#310 |

### Champion visual

- ゴールドの細い罫線
- Trophyアイコン
- `CHAMPION` はゴールド
- プレイヤー名はmonospaceにしない。eスポーツ系sans-serifでよい
- Riot ID中の `#` は表示時に崩さない

---

# 13. 2025 — LoL初心者sifue杯 2nd

```text
開催日時: 2025年9月28日(日) 19:00–23:00
参加チーム数: 2
参加者数: 23
配信: https://www.youtube.com/watch?v=OiwCgHLB0Nc
```

## 優勝チーム

```text
チームサファイア
CHAMPION
```

| ROLE | 1試合目&3試合目 | 2試合目&4試合目 |
| --- | --- | --- |
| TOP | 銀河打者#ベクター穹 | okaki67#runa |
| JUNGLE | naruneco#5909 | puagetsupain666#ヤマカシ |
| MID | umineko#004 | Sright#33333 |
| ADC | navylapis#1412 | One More Game#かげろう |
| SUP | ハルオッティ#869 | SITOSEI#INK |

Mobileでは表を横スクロールさせてもよいが、可能なら各ROLEをカード化して縦に積む。

---

# 14. 配信リンク表現

YouTubeリンクは単なるURL文字列として見せない。

ボタン：

```text
▶ WATCH ARCHIVE
```

補助テキスト：

```text
YOUTUBE / FULL STREAM
```

hover時にレッド背景へ変化。
外部リンクアイコンを付ける。

---

# 15. Organizer section

最後に主催者情報。
明るいクリーム背景にして、人間味のある締めにする。

見出し：

```text
ORGANIZER
主催者
```

本文：

```text
sifue (吉村総一郎)
```

Links：

- X(旧Twitter): https://x.com/sifue
- YouTube: https://www.youtube.com/@sifue
- Twitch: https://www.twitch.tv/sifue4466
- ポートフォリオサイト: https://www.soichiro.org/
- 連絡先: yoshimura@soichiro.org

リンクはアイコン付き横並びボタン。
Mobileでは2列または1列。

メールは `mailto:`。
外部SNSは `target="_blank" rel="noopener noreferrer"`。

---

# 16. Footer

左：

```text
sifue杯 / SIFUE CUP
```

中央または右：

```text
毎年9月開催
ALL TIMES ARE JST
```

法的・立場の明示：

```text
本大会および本サイトはZEN大学の公式大会・公式サイトではありません。
```

最下部：

```text
© sifue Cup
```

ZEN大学の公式ロゴを勝手に使用しない。
「ZEN大学」という名称は説明文のテキストとしてのみ扱う。

---

# 17. Graphic language

## 使用してよいモチーフ

- 肉球
- 星
- 紙吹雪
- 斜めライン
- スピードライン
- ブラシストローク
- トロフィーの輪郭線
- 細いグリッド
- 大きな番号

## 避ける

- ゲーミングサイトにありがちなネオンブルー／紫一色
- RGBレインボー
- 過剰なglitch
- 読めないほどの傾斜文字
- 常時点滅
- 大量のparticle
- 長いローディング演出
- 音声の自動再生

---

# 18. 背景表現

ダークセクションには単色ではなく、非常に薄いtextureを入れる。

推奨：

```css
background:
  radial-gradient(circle at 70% 20%, rgba(188,205,110,.10), transparent 30%),
  radial-gradient(circle at 10% 80%, rgba(133,135,206,.08), transparent 28%),
  #0e0f0c;
```

さらに 2〜4% opacity のnoise textureをpseudo elementで重ねてもよい。

---

# 19. Section title animation

各セクション見出しは、画面内に入る際に少し攻めた演出をする。

例：

```text
2026
TOURNAMENTS
```

1. `2026` が左から
2. `TOURNAMENTS` が下から
3. 横のライム線が伸びる

`clip-path` または overflow hidden + translate を使用。

---

# 20. Cute interaction

「クール」だけに寄りすぎないため、マスコット由来の小さな遊びを1〜2個だけ入れる。

候補：

- ナビの `sifue杯` にhoverすると肉球が1回だけpop
- Footer付近の肉球アイコンを押すと小さく跳ねる
- 2026カードhover時に右上に小さな星が1個だけ出る

イースターエッグ化しすぎない。

---

# 21. JavaScript / Animation implementation

フレームワーク依存にしない。
既存プロジェクトに合わせる。

優先順位：

1. CSS transitions / keyframes
2. IntersectionObserver
3. Web Animations API
4. 既に導入済みなら Framer Motion / Motion
5. GSAPは必要な場合のみ

## 推奨実装

- `IntersectionObserver` で `.reveal` 要素を監視
- CSS custom propertyでstagger indexを渡す
- pointer座標は `requestAnimationFrame` で間引く
- scrollイベントで毎フレームDOM計測しない
- `transform` と `opacity` を中心にアニメーション

---

# 22. `prefers-reduced-motion`

必須対応。

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

ticker、parallax、cursor glowなども停止する。

---

# 23. Responsive breakpoints

目安：

```text
mobile    < 640px
tablet    640–1023px
desktop   >= 1024px
wide      >= 1440px
```

最大コンテンツ幅：

```text
1280〜1440px
```

左右余白：

```text
mobile: 20px
tablet: 32px
desktop: 48〜72px
```

---

# 24. Accessibility

必須：

- WCAG AA相当のコントラスト
- キーボード操作可能
- hoverだけに情報を依存しない
- focus-visibleを明示
- Hero画像に適切なalt
- 装飾画像・装飾アイコンは `aria-hidden="true"`
- 見出し階層を正しくする
- 表にはheaderを設定
- 外部リンクであることを視覚的に示す

Hero alt例：

```text
sifue杯2026のキービジュアル。緑色のマスコットが旗を持ち、トロフィーと観客に囲まれている。
```

---

# 25. Performance

- Hero画像はAVIF/WebPも生成し `<picture>` を使うとよい
- 元画像も保持してよい
- LCP対象のHero画像はpreload / priority
- below-the-fold画像はlazy load
- decorative SVGはinline化可
- particle canvasを常時60fpsで回さない
- 初回JSを重くしない
- Lighthouse Performance 90以上を目標

---

# 26. SEO / Metadata

```text
<title>sifue杯 | ZEN大学生向け非公認eスポーツ大会</title>
```

```text
sifue杯（しふーはい / sifue Cup）は、毎年9月に開催されるZEN大学生向けの非公認eスポーツ大会です。開催情報、過去の優勝者、配信アーカイブを掲載しています。
```

Open Graph：

- OG画像：2026キービジュアル
- `og:type = website`
- `lang = ja`

---

# 27. Suggested component structure

React / Next.js系なら以下を目安にする。

```text
<App>
  <SiteHeader />
  <Hero />
  <GameTicker />
  <AboutSection />
  <TournamentSection year={2026} />
  <ArchiveSection year={2025} />
  <OrganizerSection />
  <SiteFooter />
</App>
```

内部：

```text
TournamentCard
StatusBadge
ChampionRoster
ExternalLinkButton
SectionHeading
PawIcon
Reveal
```

---

# 28. Data-driven implementation

大会情報をJSXへ直書きしすぎず、配列に分離する。

例：

```ts
const tournaments2026 = [
  {
    id: 'lol-2026',
    title: 'sifue杯2026 LoL部門',
    shortTitle: 'LEAGUE OF LEGENDS',
    start: '2026-09-19T19:00:00+09:00',
    end: '2026-09-19T23:30:00+09:00',
    teams: 4,
    players: 20,
  },
  {
    id: 'valorant-2026',
    title: 'sifue杯2026 VALORANT部門',
    shortTitle: 'VALORANT',
    start: '2026-09-20T19:00:00+09:00',
    end: '2026-09-20T23:30:00+09:00',
    teams: 2,
    players: 10,
  },
  {
    id: 'overwatch-2026',
    title: 'sifue杯2026 オーバーウォッチ部門',
    shortTitle: 'OVERWATCH',
    start: '2026-09-21T19:00:00+09:00',
    end: '2026-09-21T23:30:00+09:00',
    teams: 2,
    players: 10,
  },
  {
    id: 'rocket-league-2026',
    title: 'sifue杯2026 ロケットリーグ部門',
    shortTitle: 'ROCKET LEAGUE',
    start: '2026-09-22T13:00:00+09:00',
    end: '2026-09-22T15:30:00+09:00',
    teams: 3,
    players: 9,
  },
  {
    id: 'shadowverse-wb-2026',
    title: 'sifue杯2026 シャドウバース Worlds Beyond部門',
    shortTitle: 'SHADOWVERSE WORLDS BEYOND',
    start: '2026-09-23T13:00:00+09:00',
    end: '2026-09-23T15:30:00+09:00',
    teams: 2,
    players: 6,
  },
];
```

ステータス判定はユーザー端末のtimezoneに依存させず、必ず `+09:00` を含むISO datetimeから判定する。

---

# 29. Visual hierarchy

ページをスクロールしたときの強弱は以下。

```text
Hero              100
2026 Tournaments   95
About              75
2025 Archive        80
Organizer           55
Footer              30
```

2026の大会カードがHeroの次に最も目立つようにする。

---

# 30. Acceptance criteria

以下を満たしたら完成とする。

- [ ] 添付キービジュアルがHeroの中心として使われている
- [ ] 緑・赤・クリーム・ゴールド・ラベンダーを基調としている
- [ ] 黒背景を組み合わせ、eスポーツらしいコントラストがある
- [ ] 「クール」と「キュート」が両立している
- [ ] 2026の5部門が最も見つけやすい
- [ ] 開催日時は全てJSTと明示されている
- [ ] 2025年の優勝チームと選手名が欠落していない
- [ ] 2025年のYouTube配信リンクが機能する
- [ ] ZEN大学の非公式大会であることが明示されている
- [ ] Headerはスクロール後も利用しやすい
- [ ] Mobileで表・カードが破綻しない
- [ ] hover / scroll animationがある
- [ ] `prefers-reduced-motion` に対応している
- [ ] animationのためにスクロール操作を奪わない
- [ ] ページ表示直後の長いローディング演出がない
- [ ] 外部リンクは適切に新規タブで開く
- [ ] メールリンクは `mailto:`
- [ ] Lighthouseで大きなパフォーマンス問題がない

---

# 31. 実装時に絶対にしないこと

- ZETA DIVISION、Crazy Raccoon、FENNELのサイトをそのままコピーしない
- 各チームのロゴ・写真・フォント・独自素材を流用しない
- ZEN大学公式大会であるかのように見せない
- 各ゲームの公式ロゴを無断で大量配置しない
- Heroを動画化して読み込みを重くしない
- 自動再生音を付けない
- scroll-jackingをしない
- 文字が読めなくなるほどglitchを使わない

---

# 32. 最終的な完成イメージ

**第一印象は「ちゃんとしたeスポーツ大会の公式サイトっぽい」。**

その後よく見ると、緑色のマスコット、肉球、紙吹雪、暖色、少し丸みのあるディテールがあり、

**「これはプロチームではなく、大学コミュニティが本気で作っている楽しい大会なんだ」**

と伝わること。

画面全体を黒とネオンだけにせず、キービジュアル由来のクリームとグリーンを大胆に使う。

最も重要な体験は、トップを開いた瞬間に

```text
sifue杯2026、なんか楽しそう。
```

と思えること。

---

# 33. 配信スライドテンプレート

本書をWebと配信スライドのデザイン仕様のSingle Source of Truthとする。
配信版は静止画面へ最適化し、Webのアニメーションや操作UIは持ち込まない。
生成スクリプトは第3章のCSSカラー変数と、この章の `stream-template-config` を直接読み込む。
寸法はインチ、文字サイズはポイント。背景は1920×1080px、スライドは16:9とする。

## 33.1 レイヤーと編集方針

- 背景：SVGを原本としてPNGを生成し、PPTXの背景として設定する。グラデーション、グリッド、斜線、星、肉球だけを背景へ描く。
- キービジュアル：タイトル・待機・休憩・終了の画面で、差し替え可能な画像として配置する。年表記なしの原本を使用し、開催年は別のテキストで編集できるようにする。
- テキスト：タイトル、日本語補助見出し、チーム名、選手名、時刻、ルール、スコア、注記は独立したPPTXテキストボックス。
- 画像枠：PNGの仮画像を通常の画像オブジェクトとして置き、「画像を置換」で差し替える。PowerPoint固有のプレースホルダー機能には依存しない。枠の説明は編集可能なテキストとして別置きする。
- 図形：カード、罫線、ステータス帯、対戦表の接続線は編集可能な図形。
- Google Slidesでは13枚の完成レイアウトを複製して使用する。13種類のテーマレイアウトを登録する形式ではない。
- 全スライドに非公認イベントの注記とJST表記を置く。未確定情報は角括弧で記入欄と分かるよう表示し、実際の大会ルールを推測しない。

## 33.2 タイポグラフィと余白

第4章のBarlow CondensedとZen Kaku Gothic Newを使用する。過度な太字による文字潰れを避け、見出しは通常ウェイトを基本とし、字間を極端に詰めない。
左右0.55インチ、上下0.35インチを基準に余白を確保する。背景と情報を分離し、主要情報は小さな配信画面でも読める大きさにする。
基本はダーク背景、ルール・終了画面はクリーム背景。対戦側の区別はライムとラベンダー、勝利表示はゴールド、重要時刻はレッドで示す。

## 33.3 13種類の構成

| スライド名 | 編集する内容 |
| --- | --- |
| 00_TITLE | 大会名、年度、部門、日付、キービジュアル |
| 01_STREAM_STARTING | 開始時刻、部門、待機メッセージ、キービジュアル |
| 02_TODAY_SCHEDULE | 当日の部門、日付、進行予定5行、注記 |
| 03_TEAM_VS | 両チーム名、ロゴ、メンバー、試合番号、試合形式 |
| 04_PLAYER_INTRO | 選手写真、名前、所属、役割、得意分野、一言 |
| 05_MATCH_RULES | 試合形式、勝利条件、使用設定、注意事項、運営連絡先 |
| 06_MAP_PICK | マップ／ステージ画像3枠、名前、選択状態、選択チーム |
| 07_SCORE | チーム名、ロゴ、スコア、試合番号、進行状況 |
| 08_MATCH_RESULT | 勝利チーム、ロゴ、最終スコア、相手、MVP |
| 09_BRACKET | 4チームの準決勝2試合、決勝、優勝、スコア、接続線 |
| 10_BREAK | 再開予定時刻、休憩案内、次の試合、キービジュアル |
| 11_NEXT_MATCH | 次の試合の両チーム、ロゴ、開始予定、部門、形式 |
| 12_STREAM_END | お礼、次回予定、案内、キービジュアル |

時刻・スコア・トーナメントの進行は手動編集。カウントダウンや結果自動更新は含まない。
Google Slidesでフォントが代替される場合は第4章の代替フォントを使用し、改行を確認する。

<!-- stream-template-config:start -->
```json
{
  "width": 13.333333,
  "height": 7.5,
  "backgroundWidth": 1920,
  "backgroundHeight": 1080,
  "safeX": 0.55,
  "displayFont": "Barlow Condensed",
  "bodyFont": "Zen Kaku Gothic New",
  "titleSize": 43,
  "bodySize": 19,
  "metaSize": 11,
  "heroSize": 58,
  "keyVisual": "sifue-cup-key-visual.png",
  "slides": [
    "00_TITLE", "01_STREAM_STARTING", "02_TODAY_SCHEDULE",
    "03_TEAM_VS", "04_PLAYER_INTRO", "05_MATCH_RULES",
    "06_MAP_PICK", "07_SCORE", "08_MATCH_RESULT", "09_BRACKET",
    "10_BREAK", "11_NEXT_MATCH", "12_STREAM_END"
  ]
}
```
<!-- stream-template-config:end -->
