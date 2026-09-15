# OBS配信用時計

## 素材

- `public/overlays/clock.html`：CSS・JavaScript・Barlow Condensedフォントを埋め込んだ単体HTML。ネット接続やNode.jsなしでも動作する。
- 基準サイズ：640×144px。パネル外は透過、文字の背面は不透明なグリーンブラック。
- 日付 `2026.09.15`、時刻 `17:53:59`。実行PCの時計を日本時間（Asia/Tokyo）に変換する。24時間制で、深夜は `00:00:00`。
- HTMLは `npm run build` で `dist/overlays/clock.html` にもコピーされ、既存のPages公開手順で配信できる。

## OBSでの使い方

1. シーンに「ブラウザ」ソースを追加する。
2. 「ローカルファイル」を有効にして `public/overlays/clock.html` を指定する。
3. 幅 **640**、高さ **144**、フレームレート **30 fps** に設定する。
4. ソース一覧で時計をスライドより上に置き、空き部分へ移動する。比率を保ったまま拡大・縮小できる。
5. 開始待機・休憩・終了の各シーンには「既存を追加」で同じ時計ソースを使う。

背景透過はHTMLで設定済み。OBSのカスタムCSSは既定のままで使用できる。黒背景を追加するCSSは不要。
ブラウザソース自体の幅・高さを変更した場合も、縦横比を保って左上に収まる。

### 既存スライドに重ねる配置例

1920×1080の未編集テンプレートでは、ヘッダー中央右寄りにある空白を利用できる。
OBSの「変換を編集」で、位置 **X=1080、Y=36**、表示サイズ **352×79.2px**（55%）に設定する。
`01_STREAM_STARTING`、`10_BREAK`、`12_STREAM_END` 共通で、見出し・キービジュアル・右上のスライド名に重ならない。
編集で広い余白を確保できる場合は原寸640×144pxの利用を推奨する。

### 公開URLから使う場合

既存のデプロイ後、サイトのURLに `/overlays/clock.html?motion=full&bpm=125` を付けてOBSのURL欄に指定する。今回の作業ではデプロイ自体は行っていない。

| パラメーター | 既定値 | 動作 |
| --- | --- | --- |
| `bpm` | `125` | インジケーターの動くテンポ。120〜130に制限。不正な値は125 |
| `motion` | 未指定 | OSの「視差効果を減らす」設定に従う |
| `motion=full` | — | OS設定に関係なく常時アニメーション |
| `motion=reduce` | — | 装飾を静止。日時更新は継続 |

ローカルファイルでOS設定により動きが止まる場合は、HTMLの `<html lang="ja">` を `<html lang="ja" data-motion="full">` に変更することでも常時動作を指定できる。

## デザインと音楽

正本は `DESIGN.md` 第34章。コロンは1秒周期で穏やかに明滅し、数字は消さない。リングは3.84秒で一周し、下辺のグラデーションも3.84秒周期で流れる。背景の光は7.68秒ごとに往復する。
インジケーターは125 BPMの2拍周期（960ms）を基本に位相をずらして動く。指定のノンボーカルEDM・120〜130 BPMというユーザー提供情報から演出を決めた。音声の解析や拍同期は行わず、BGMはOBS側で別途再生する。

参考として提示された曲：

- [The Glory (James Egbert Remix)](https://soundcloud.com/leagueoflegends/the-glory-james-egbert-remix)
- [Piercing Light (Mako Remix)](https://soundcloud.com/leagueoflegends/piercing-light-mako-remix)
- [Eyes on MSI Theme - Miami Remix (2018)](https://soundcloud.com/leagueoflegends/eyes-on-msi-theme-remix)

SoundCloudページは作業環境から取得できず、曲の実際のテンポや音源内容は検証していない。

## 保守・確認

`npm run build && npm test` でJSTの年越し、ローカル・オフライン動作、透過背景、文字の収まり、モーション設定を確認する。自動テストはChromiumで行う。OBS実機の合成・録画確認は別途行う。
PCの時刻設定が表示の基準になる。日時は毎秒実時刻から再計算し、非表示からの復帰時も即時更新する。

フォントはGoogle FontsのBarlow Condensed SemiBoldを埋め込んでいる。再配布時は同梱の `public/overlays/OFL-BarlowCondensed.txt` を添付する。


## 配置プレビュー

`npm run clock:preview` でローカルHTMLをChromiumで撮影し、次のプレビューを再生成する（日時は撮影時だけ固定）。

- [時計単体](previews/stream-clock.png)
- [開始待機](previews/clock-01_stream_starting.png)
- [休憩](previews/clock-10_break.png)
- [終了](previews/clock-12_stream_end.png)
