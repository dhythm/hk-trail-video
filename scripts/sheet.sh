#!/bin/zsh
# usage: scripts/sheet.sh <dir> <cols> <rows> <out>  — dir 内の f*.jpg をタイル化
set -e
dir=$1; cols=$2; rows=$3; out=$4
list=$(mktemp)
for f in "$dir"/f*.jpg; do echo "file '$f'" >> "$list"; done
ffmpeg -v error -y -f concat -safe 0 -i "$list" -vf "scale=640:-1,tile=${cols}x${rows}" -frames:v 1 "$out"
rm -f "$list"
