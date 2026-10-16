# 香港トレイル紹介動画（Remotion）

香港トレイル（港島徑）全8区間・約50kmを紹介する 5 分の動画と、okady.work ロゴの単体クリップ。

- `HongKongTrail` … 本編 1920×1080 / 30fps / 300 秒
- `OkadyLogo` … ロゴ SVG のアニメーションをそのまま再生する 6 秒クリップ（本編とは別）

## 構成

| 時間 | 内容 |
| --- | --- |
| 0:00–0:20 | 導入（CITY / FOREST / RIDGE / SEA → 案内役 → タイトル） |
| 0:20–0:40 | 全体像（全8区間・約50km、概念ルート図） |
| 0:40–4:40 | 区間 1〜8（区間カード → 写真 × キネティックタイポ → 案内役 × モーショングラフィックス） |
| 4:40–5:00 | 振り返り・締め・クレジット |

区切りはすべて BGM（96 BPM、1小節 2.5 秒）の小節頭に揃えている。

## セットアップ

採用素材（写真・キャラクター動画・ロゴ・リファレンス資料）は `assets/` にある。
そこから作る中間ファイル（キー抜き PNG、BGM、グレイン）はリポジトリに含めず、`public/` に生成する。

```bash
npm install
pip install numpy pillow   # ffmpeg も必要
scripts/prepare_assets.sh
```

`prepare_assets.sh` が行うこと：

- 写真・イラスト・ロゴを `public/` へコピー
- `scripts/key_chara.py`：グリーンバックを色差キーで抜き、透過 PNG 連番を `public/chara/` に出力
  （切り出し範囲は `src/charaMeta.ts` に記録済み。素材を差し替えた場合は更新が必要）
- `scripts/make_grain.py`：フィルムグレイン用ノイズ
- `scripts/make_bgm.py`：BGM を numpy のみで合成（`public/audio/bgm.wav`）

## プレビュー・レンダリング

```bash
npm run dev
npx remotion render HongKongTrail out/main.mp4 --codec=h264 --crf=17 --audio-codec=aac --audio-bitrate=320k
npx remotion render OkadyLogo out/logo.mp4 --codec=h264 --crf=16
```

## 表記ルール

- 撮影地点が未確定の写真に、区間で撮影したと断定する文言を重ねない
- Wikimedia Commons の補完写真は作者・ライセンスをエンドクレジットと概要欄に記載
- 画面内の撮影者ラベル・シーン番号は出さない（区間番号 SECTION 01〜08 は表示する）
- 距離・所要時間は香港漁農自然護理署「郊野樂行」の公式概数（2026-10-16 確認）
