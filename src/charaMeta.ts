// scripts/key_chara.py が出力した切り出し情報（元フレーム 1344x768 基準）
export const CHARA_META = {
  V_00: { frames: 144, w: 611, h: 749, x0: 307, y0: 19 },
  V_01: { frames: 144, w: 463, h: 649, x0: 478, y0: 55 },
  V_02: { frames: 144, w: 388, h: 547, x0: 429, y0: 108 },
  V_03: { frames: 144, w: 344, h: 567, x0: 476, y0: 92 },
  V_04: { frames: 144, w: 278, h: 563, x0: 526, y0: 74 },
  V_05: { frames: 144, w: 432, h: 661, x0: 426, y0: 46 },
  V_06: { frames: 144, w: 432, h: 649, x0: 414, y0: 0 },
  V_07: { frames: 144, w: 430, h: 564, x0: 456, y0: 87 },
  V_08: { frames: 144, w: 560, h: 681, x0: 407, y0: 40 },
  V_09: { frames: 144, w: 288, h: 535, x0: 513, y0: 124 },
} as const;

export type CharaId = keyof typeof CHARA_META;
