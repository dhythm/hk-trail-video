"""グリーンバックのキャラクター動画を抜いて、透過PNG連番に書き出す。

色差キー（G - max(R,B)）で抜くため、V_04 の円状の明暗差にも追従しやすい。
各クリップの全フレームで被写体の外接矩形を求め、共通の範囲で切り出す。

usage: python3 -I key_chara.py <入力mp4> <出力ディレクトリ>
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

W, H = 1344, 768


def read_frames(path: str) -> np.ndarray:
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    try:
        raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"ffmpeg failed: {e.stderr.decode(errors='ignore')}") from e
    n = len(raw) // (W * H * 3)
    if n == 0:
        raise RuntimeError(f"no frames decoded: {path}")
    return np.frombuffer(raw, np.uint8)[: n * W * H * 3].reshape(n, H, W, 3)


def key_frame(rgb: np.ndarray) -> np.ndarray:
    f = rgb.astype(np.float32)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    diff = g - np.maximum(r, b)
    # 背景の色差は概ね 150 以上、衣装・肌・髪は 0 付近
    lo, hi = 28.0, 90.0
    alpha = 1.0 - np.clip((diff - lo) / (hi - lo), 0.0, 1.0)

    # 4:2:0 由来の縁の緑を抑えるため、わずかに収縮→ぼかし
    a_img = Image.fromarray((alpha * 255).astype(np.uint8))
    a_img = a_img.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    alpha = np.asarray(a_img).astype(np.float32) / 255.0

    # デスピル：G が R,B の平均を超える分を削る
    limit = (r + b) / 2.0
    g2 = np.where(g > limit, limit + (g - limit) * 0.15, g)
    out = np.stack([r, g2, b, alpha * 255.0], axis=-1)
    return np.clip(out, 0, 255).astype(np.uint8)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    frames = read_frames(src)
    keyed = [key_frame(fr) for fr in frames]

    # 全フレーム共通の外接矩形（画面端のノイズを避けるため 8px 内側から探索）
    union = np.zeros((H, W), bool)
    for k in keyed:
        union |= k[..., 3] > 40
    union[:8, :] = union[-8:, :] = False
    union[:, :8] = union[:, -8:] = False
    ys, xs = np.where(union)
    pad = 24
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, W)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, H)

    for i, k in enumerate(keyed):
        Image.fromarray(k[y0:y1, x0:x1], "RGBA").save(dst / f"{i:03d}.png", optimize=False)
    meta = {"frames": len(keyed), "w": int(x1 - x0), "h": int(y1 - y0), "x0": int(x0), "y0": int(y0)}
    (dst / "meta.json").write_text(json.dumps(meta))
    print(src, meta)


if __name__ == "__main__":
    main()
