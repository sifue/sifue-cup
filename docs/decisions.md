# 設計判断記録

## 2026-09-01: キービジュアルの使い分け

### 判断

HeroとOG画像には `sifue-cup-2026-key-visual.png` を使用する。年表記なしの `sifue-cup-key-visual.png` は、将来年度にも転用できるブランド原本として `public/images/` に保持する。

### 理由

現在の主目的は2026年大会の告知であり、ファーストビュー内で開催年を視覚的に確定できる。両画像の構図と配色は同一なので、デザイン仕様のカラースキームにも影響しない。

## 2026-09-01: コンテンツの正本

### 判断

大会内容は修正済みの `CONTENTS.md` を正本とする。`DESIGN.md` と連絡先が異なる箇所は `CONTENTS.md` の `sifue@soichiro.org` を採用する。

### 理由

`AGENTS.md` がコンテンツファイルを情報源として指定しており、本文データの責務が明確なため。

## 2026-09-01: Vanilla JavaScript + Vite

### 判断

UIフレームワークを追加せず、Vanilla JavaScriptとViteで構成する。

### 理由

1ページの静的サイトに必要な状態はメニューと日時ステータスのみである。ビルドとCloudflare Pages配信を単純に保ちつつ、データ駆動実装とテスト容易性を満たせる。

## 2026-09-01: 外部フォント

### 判断

`Barlow Condensed` と `Zen Kaku Gothic New` をGoogle Fontsから読み込み、未接続時はシステムフォントへフォールバックする。

### 理由

DESIGN.mdの指定に沿った強い英字見出しと読みやすい日本語本文を実現するため。フォントが取得できない場合でもレイアウトと情報閲覧は維持される。

## 2026-09-01: OGPの公開URL

### 判断

Cloudflare Pagesプロジェクト名に対応する `https://sifue-cup.pages.dev/` をcanonical URL、`og:url`、OGP画像・X Card画像の基底URLに使用する。

### 理由

SNSクローラーが画像を取得できるよう、画像URLには絶対URLが必要となる。独自ドメインは未決定のため、現在のデプロイ設定から確定できるPages URLを採用した。独自ドメイン決定時の変更箇所はREADMEへ記載する。
