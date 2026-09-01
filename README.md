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

現在のバージョンは `1.1.0` です。更新時はセマンティックバージョニングに従って `package.json` と `CHANGELOG.md` を更新してください。
