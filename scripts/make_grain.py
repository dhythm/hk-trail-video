"""フィルムグレイン用のノイズ画像を生成する。

usage: python3 make_grain.py <出力ディレクトリ>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(3)
    for i in range(6):
        n = rng.normal(128, 38, (540, 960)).clip(0, 255).astype(np.uint8)
        Image.fromarray(n, "L").save(out / f"grain{i}.png")
    print(f"wrote 6 grain images to {out}")


if __name__ == "__main__":
    main()
