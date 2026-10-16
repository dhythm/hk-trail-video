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

素材（写真・キャラクター動画・ロゴ）と、そこから作る中間ファイルはリポジトリに含めていない。
素材フォルダ `香港トレイル_採用素材` から `public/` を組み立てる。

```bash
npm install
pip install numpy pillow   # ffmpeg も必要
scripts/prepare_assets.sh ../香港トレイル_採用素材
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

- 本人撮影で撮影地点が未確定の写真には「撮影地点未確定」を表示し、区間での撮影と断定しない
- Wikimedia Commons の補完写真は作者・ライセンスを画面内とクレジットに表示（`src/data.ts`）
- イラスト・案内役キャラクター・ルート図・断面図はイメージ／概念図と表示
- 距離・所要時間は香港漁農自然護理署「郊野樂行」の公式概数（2026-10-16 確認）
