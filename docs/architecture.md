# 実装設計

## 目的

キービジュアルを主役にした1ページ構成で、2026年の開催情報を最短で把握でき、2025年の大会結果まで自然に閲覧できるサイトを提供する。

## 技術構成

- Vite: 開発サーバーと静的ビルド
- Vanilla JavaScript: データ描画、日時判定、メニュー、アニメーション制御
- CSS: レスポンシブレイアウトと軽量モーション
- Playwright: Chrome相当のPC／モバイルE2Eテスト
- Cloudflare Pages: `dist/` の静的配信

React等のUIフレームワークは使用していない。ページ規模に対して依存関係と初回JavaScriptを抑え、静的配信の単純さを優先した。

## ファイル構成

```text
index.html                 セマンティックなページ構造と固定本文
src/data.js                大会・アーカイブの構造化データ
src/main.js                データ描画とインタラクション
src/style.css              デザインとレスポンシブ対応
public/images/             キービジュアルとWebP
public/_headers            Cloudflare Pagesのレスポンスヘッダー
tests/site.spec.js         E2Eテスト
wrangler.jsonc             Cloudflare Pages設定
```

## 表示とデータフロー

`src/data.js` の大会配列を `src/main.js` がカードと表へ変換し、`index.html` の描画先へ挿入する。開催ステータスは、`+09:00` を含むISO日時とAsia/Tokyoの日付を比較して決定する。開催日の0時から終了時刻までは `TODAY` となり、閲覧端末のタイムゾーンに依存しない。

## アクセシビリティ

- 見出し階層、ナビゲーション、表の見出しセルを明示
- 外部配信リンクの新規タブ遷移を支援技術向けラベルで説明
- モバイルメニューの開閉状態を `aria-expanded` で公開
- キーボードフォーカスを明示し、Escapeキーでメニューを閉じる
- `prefers-reduced-motion` ではticker、parallax、継続アニメーションを停止
- Hero画像に内容を説明する代替テキストを指定

## パフォーマンス

HeroのPNG（約2MB）から約180KBのWebPを生成し、対応ブラウザにはWebPを配信する。LCP対象画像はpreloadと `fetchpriority="high"` を指定し、レイアウトシフト防止のため寸法を明記する。

## Cloudflare Pages

静的ファイルのみのためPages Functionsは使用しない。`wrangler.jsonc` の `pages_build_output_dir` は `./dist`。`public/_headers` はViteビルド時に出力先へコピーされ、セキュリティヘッダーとアセットキャッシュを設定する。

## OBS時計素材

`public/overlays/clock.html` はサイト本体と独立した単体HTMLで、Viteが本番の `dist/overlays/` にコピーする。CSS・JS・フォントを内蔵し、OBSのローカルブラウザソースでも動作する。Intl.DateTimeFormatでJST日時を毎秒取得し、CSSで装飾を動かす。仕様と利用方法は `docs/stream-clock.md`、検証は `tests/clock.spec.js`、合成プレビュー生成は `scripts/preview-stream-clock.mjs` に置く。
