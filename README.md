# sifue杯 Teaser Site

sifue杯（しふーはい / sifue Cup）の2026年開催情報と2025年大会アーカイブを掲載する、1ページ完結のティザーサイトです。ZEN大学生向けの非公認イベントであり、ZEN大学の公式サイトではありません。

## 必要環境

- Node.js 22以上（`.nvmrc` あり）
- npm
- Chrome / Chromium（Playwrightテスト用）

## セットアップと開発

```bash
npm install
npm run dev
```

Viteの開発サーバーが表示したURLをChromeで開いてください。

## コマンド

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | `dist/` に本番用静的ファイルを出力 |
| `npm run preview` | 本番ビルドをローカル確認 |
| `npm test` | PC・モバイルのPlaywrightテストを実行 |
| `npm run deploy` | ビルド後、Cloudflare Pagesへ直接アップロード |

初回のみPlaywrightのChromiumが未導入の場合は、次を実行します。

```bash
npx playwright install chromium
```

## Cloudflare Pagesへのデプロイ

### Git連携（推奨）

Cloudflare Dashboardの「Workers & Pages」からリポジトリを接続し、次のビルド設定を指定します。

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`

`wrangler.jsonc` も同じ出力先を指定しており、設定ファイルを構成の正本として管理できます。

### Wranglerによる直接アップロード

Cloudflareアカウントへログイン後、次を実行します。

```bash
npx wrangler login
npm run deploy
```

Pagesプロジェクト名は `sifue-cup` です。別名を使う場合は `wrangler.jsonc` と `package.json` の `deploy` スクリプトをそろえて変更してください。

### 公開URL・OGP設定

canonical URLとOGP画像URLは `https://sifue-cup.pages.dev/` を設定しています。独自ドメインを利用する場合は、`index.html` 内の次の値を新しいURLへ変更してください。

- `link[rel="canonical"]`
- `og:url`
- `og:image` / `og:image:secure_url`
- `twitter:image`

## コンテンツ更新

- 2026大会データ・2025アーカイブ: `src/data.js`
- ページ本文・SNSリンク: `index.html`
- デザイン: `src/style.css`
- Hero画像: `public/images/sifue-cup-2026-key-visual.*`

大会日時には必ずJSTオフセット（`+09:00`）を含めてください。ステータス表示はこの日時を基準に自動判定します。

## ドキュメント

- [実装設計](docs/architecture.md)
- [設計判断記録](docs/decisions.md)
- [進捗報告](docs/progress.md)

## バージョン

現在のバージョンは `1.4.1` です。更新時はセマンティックバージョニングに従って `package.json` と `CHANGELOG.md` を更新してください。

## 配信スライドテンプレート

[16:9 PPTXテンプレート](slides/generated/sifue-cup-stream-template.pptx) をGoogle Driveへアップロードし、Google Slidesで開いて使用できます。全13枚を用途に合わせて複製し、チーム名・スコアなどのテキストとロゴ・写真を編集します。

- [13枚の配置一覧](slides/generated/overview.png)
- [背景SVG / PNG](slides/generated/backgrounds/)
- [操作手順と検証範囲](docs/stream-slides.md)

デザイン仕様の正本は `DESIGN.md` 第3・4・33章です。スクリプトは仕様書からカラーとフォント・サイズ設定を直接読み込みます。

```bash
npm ci
npm run slides:build
npm run slides:check
```

`slides:build` はPptxGenJSでPPTXと背景素材を生成します。`slides:check` はPPTXの構造と文字枠を検証し、HTMLによる配置プレビューを撮影します。初回のみ `npx playwright install chromium` が必要です。
生成先は `slides/generated/`。サイトの `public/` や `dist/` には含めないため、スライド素材はWebサイトへ自動公開されません。

## OBS用の時計オーバーレイ

[配信用時計HTML](public/overlays/clock.html) をOBSのブラウザソースで「ローカルファイル」として指定してください。幅 **640**、高さ **144**。外部通信不要で、日本時間の日付と秒単位の時刻を表示します。透過背景・暗いパネル・回転リング・動くグラデーション付きです。

[配置例・モーション設定・利用手順](docs/stream-clock.md) を参照してください。ビルド後は `dist/overlays/clock.html` にも出力されます。
