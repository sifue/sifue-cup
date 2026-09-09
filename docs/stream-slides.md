# 配信スライドテンプレートの使い方

## 成果物

- `slides/generated/sifue-cup-stream-template.pptx`：16:9、13枚の編集用PPTX
- `slides/generated/backgrounds/`：各ページの1920×1080 PNG背景とSVG原本
- `slides/generated/assets/`：キービジュアルと差し替え用の仮画像
- `slides/generated/overview.png`：全13枚の配置一覧
- `slides/generated/previews/`：個別の配置プレビューPNG
- `slides/generated/preview.html`：ブラウザ用の配置プレビュー
- `slides/generated/manifest.json`：DESIGN.mdのハッシュと生成時の配置データ
- `slides/generated/validation.json`：構造と文字枠の検証結果

プレビューはPPTXと同じ配置データから生成したHTMLのスクリーンショットです。PowerPointやGoogle Slidesのレンダリングそのものではありません。実際のGoogle Slidesへのアップロード・変換はこの作業では行っていません。

## Google Slidesで開く

1. Google Driveに `sifue-cup-stream-template.pptx` をアップロードする。
2. ファイルをGoogle Slidesで開く。
3. 必要に応じて「ファイル」から「Googleスライドとして保存」してGoogle形式へ変換する。
4. 用途に合うスライドを複製して、角括弧の仮テキストと画像を差し替える。
5. スライドショー表示で改行・フォント・画面端・背景を確認する。

これは完成レイアウトを複製して使う13枚のテンプレートです。Google Slidesのテーマ編集に13種類のマスターレイアウトを追加する形式ではありません。スライド番号順に `00_TITLE` から `12_STREAM_END` まで並び、ヘッダーと発表者ノートにも識別名を記載しています。配信時に識別名が不要な場合はヘッダー右側のテキストを削除できます。

## 編集するもの

- 大会名・部門・日時・チーム名・スコア・ルールは通常のテキストボックスです。クリックして編集できます。
- ロゴ・選手写真・マップは通常の画像オブジェクトです。選択して「画像を置換」で差し替えます。枠下部にある `[ロゴ]` などの説明テキストは別オブジェクトなので、差し替え後に削除してください。
- キービジュアルも別画像なので置換できます。背景へ合成していません。
- カード、帯、対戦表の線は通常の図形で、位置や大きさを変えられます。
- 背景はスライド背景です。Google Slidesの変換で背景が失われた場合は、対応する `backgrounds/<スライド名の小文字>.png` を「背景」から指定できます。

ロゴは1:1、選手写真は縦長、マップは16:9を想定しています。異なる縦横比の素材は置換後にトリミングを調整してください。PPTX専用の「画像プレースホルダー」機能には依存せず、Google Slidesでも通常の画像として扱える方法を採用しています。

## 配信前の編集

- 角括弧 `[...]` は仮の値です。大会情報に合わせて全て書き換えます。
- スケジュールの時刻と試合結果のスコアは例です。実際の確定情報ではありません。
- 開始・再開時刻は手動表示です。カウントダウンは自動では動きません。
- 対戦表は4チーム用の記入例です。2チームの場合は決勝部分を使用し、不要な試合カード・線を削除できます。3チームなど別形式の場合もルールに合わせてカード・線を編集します。
- `06_MAP_PICK` はマップ／ステージを選ぶ部門向けです。該当しない部門では使用しません。
- 発表者ノートには編集メモがあります。非公認イベントの注記とJST表記は残してください。

## フォント

`DESIGN.md` 指定のBarlow CondensedとZen Kaku Gothic NewをPPTXへ指定しています。フォントファイルは埋め込んでいません。Google Slidesのフォント一覧から該当フォントを選択し、利用できない場合は本書ではなく `DESIGN.md` 第4章の代替フォントを参照してください。

プレビューではGoogle Fontsを読み込みます。読み込み状況は `validation.json` の `fontStatus` を確認してください。フォントの代替やGoogle Slides変換で文字幅が変わるため、実際に配信する環境で最終確認してください。

## 再生成と設計変更

```bash
npm run slides:build
npm run slides:check
```

デザイン変更はまず `DESIGN.md` を更新します。第33章のJSON設定と第3章のCSSカラー変数からスクリプトが値を取得するため、色やフォントの複製定義は不要です。構成そのものを変えるときは、第33章の仕様と `scripts/generate-stream-slides.mjs` のレイアウト実装を同時に更新します。

生成コマンドは `slides/generated/` の同名ファイルを更新します。PPTXで手作業編集した大会別ファイルは別名・別フォルダへ保存してください。生成物は同梱しているため、利用者はNode.jsなしでもPPTXを開けます。

## 技術的な確認範囲

検証スクリプトは13枚の背景画像、テキストオブジェクト数、差し替え画像数、色の形式、仕様書との一致を確認します。生成スクリプトは全オブジェクトのスライド内配置を確認します。HTMLプレビューでは文字枠のはみ出しも確認します。

PptxGenJSの背景と画像APIを使用しています：
[背景API](https://gitbrent.github.io/PptxGenJS/docs/usage-slide-options.html)、
[画像API](https://gitbrent.github.io/PptxGenJS/docs/api-images/)。
