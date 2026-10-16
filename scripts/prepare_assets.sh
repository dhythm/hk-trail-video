#!/bin/zsh
# 素材フォルダから public/ を組み立てる（素材・中間ファイルはリポジトリに含めない）
# usage: scripts/prepare_assets.sh <香港トレイル_採用素材 のパス>
set -euo pipefail

src=${1:?"usage: scripts/prepare_assets.sh <素材フォルダ>"}
root=${0:A:h:h}
pub="$root/public"

[ -d "$src" ] || { echo "素材フォルダが見つかりません: $src" >&2; exit 1; }
mkdir -p "$pub/img" "$pub/chara" "$pub/logo" "$pub/audio" "$pub/fx"

# 写真・イラスト（日本語ファイル名のイラストは ASCII 名に）
cp "$src"/P_*.webp "$pub/img/"
cp "$src"/I_S03_*.webp "$pub/img/I_S03_forest.webp"
cp "$src/okady-work-logo.svg" "$pub/logo/okady-work-logo.svg"

# キャラクター動画のグリーンバック抜き（透過PNG連番）
for v in "$src"/V_*.mp4; do
  id=$(basename "$v" | cut -c1-4)
  python3 "$root/scripts/key_chara.py" "$v" "$pub/chara/$id" &
done
wait

python3 "$root/scripts/make_grain.py" "$pub/fx"
python3 "$root/scripts/make_bgm.py" "$pub/audio/bgm.wav"
echo "done: $pub"
