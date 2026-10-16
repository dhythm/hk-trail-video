import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CHARA_META, CharaId } from "../charaMeta";
import { ip } from "../lib/anim";
import { EASE } from "../theme";

const SRC_W = 1344;
const SRC_H = 768;
const SRC_FPS = 24;

/**
 * キーイング済みPNG連番を再生する。
 * height は元フレーム(768px)を何pxで表示するか。cx/bottom は元フレーム中心・下端の配置位置。
 */
export function Chara({
  id,
  height = 1080,
  cx = 960,
  bottom = 1080,
  x = 0,
  shadow = true,
  enter = 8,
}: {
  id: CharaId;
  height?: number;
  cx?: number;
  bottom?: number;
  x?: number;
  shadow?: boolean;
  enter?: number;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const m = CHARA_META[id];
  const idx = Math.min(m.frames - 1, Math.max(0, Math.floor((frame * SRC_FPS) / fps)));
  const s = height / SRC_H;
  const left = cx - (SRC_W * s) / 2 + m.x0 * s + x;
  const top = bottom - SRC_H * s + m.y0 * s;
  const pIn = ip(frame, [0, enter], [0, 1], EASE.out);
  const pOut = ip(frame, [durationInFrames - 6, durationInFrames], [1, 0], EASE.in);
  return (
    <Img
      src={staticFile(`chara/${id}/${String(idx).padStart(3, "0")}.png`)}
      style={{
        position: "absolute",
        left,
        top,
        width: m.w * s,
        height: m.h * s,
        opacity: Math.min(pIn, pOut),
        scale: String(0.94 + 0.06 * pIn),
        transformOrigin: "50% 100%",
        filter: shadow ? "drop-shadow(0 24px 30px rgba(0,0,0,0.35))" : undefined,
      }}
    />
  );
}
