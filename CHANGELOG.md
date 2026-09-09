# Changelog

このプロジェクトの主な変更を記録します。バージョン番号はセマンティックバージョニングに従います。

## [1.3.0] - 2026-09-09

### Added

- PptxGenJSによる16:9のGoogle Slides用配信テンプレート13枚
- 固定のSVG／PNG背景と編集可能なテキスト・図形・差し替え画像
- DESIGN.mdを正本とする配信スライド仕様と直接読み込みによる生成
- 配置プレビュー、PPTX構造検証、Google Slides取り込み手順

## [1.2.0] - 2026-09-01

### Added

- 2026年の5部門すべてにYouTube配信ボタンを追加
- `CONTENTS.md` と配信URLが一致することを確認するE2Eテストを追加

## [1.1.0] - 2026-09-01

### Changed

- Hero、ABOUTを含むセクション見出し、大会名のフォントウェイトを600へ下げ、字間と行間を調整して文字の判読性を改善
- `SHADOWVERSE WB` の表記を `SHADOWVERSE WORLDS BEYOND` に変更
- 2025年大会のMIDメンバー表記を `(サポートメンバー参加)` に変更
- Cloudflare Pagesの公開URLを使ったOGP、canonical URL、X Cardメタデータを追加

## [1.0.0] - 2026-09-01

### Added

- 2026年の5部門を掲載するティザーサイト
- JST基準の大会ステータス自動判定
- 2025年大会の優勝者・選手一覧・YouTube配信リンク
- PC／モバイル対応のナビゲーションとアニメーション
- `prefers-reduced-motion` とキーボード操作への対応
- PlaywrightによるE2Eテスト
- Cloudflare Pages向けのWrangler設定とセキュリティヘッダー
- README、実装設計、設計判断、進捗報告
