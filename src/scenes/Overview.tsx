import { AbsoluteFill, useCurrentFrame } from "remotion";
import { At } from "../components/At";
import { Flash } from "../components/basics";
import { Contours, RouteMap } from "../components/graphics";
import { Counter, RiseText } from "../components/text";
import { ip, shake } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO } from "../theme";

/** 00:20–00:27 「8」と「50」 */
function BigNumbers() {
  const frame = useCurrentFrame();
  const sw = 105; // 3.5秒で切り替え
  const first = frame < sw;
  const lf = first ? frame : frame - sw;
  const sh = shake(lf, 0, 10, 14);
  const slide = ip(lf, [0, 12], [1, 0], EASE.out);
  return (
    <AbsoluteFill style={{ background: first ? C.paper : C.red, overflow: "hidden" }}>
      <Contours color={first ? "rgba(12,13,11,0.08)" : "rgba(242,237,227,0.12)"} cx={1400} cy={500} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 70, translate: `${sh.x}px ${sh.y}px` }}>
        <div style={{ fontFamily: ANTON, fontSize: 820, lineHeight: 0.8, color: first ? C.ink : C.paper, translate: `${slide * -600}px 0`, minWidth: first ? 420 : 800 }}>
          {first ? <Counter from={1} to={8} start={0} dur={14} format={(v) => String(Math.round(v))} /> : <Counter from={0} to={50} start={0} dur={22} format={(v) => String(Math.round(v))} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, translate: `${slide * 600}px 0` }}>
          <div style={{ fontFamily: ANTON, fontSize: 200, lineHeight: 0.9, color: first ? C.red : C.ink }}>{first ? "SECTIONS" : "KM"}</div>
          <RiseText key={first ? "a" : "b"} text={first ? "全8区間" : "約50km"} size={110} delay={8} color={first ? C.ink : C.paper} />
          <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 40, color: first ? C.ink : C.paper, opacity: ip(lf, [20, 34], [0, 1]) }}>
            {first ? "区間ごとに、違う表情。" : "香港島の山頂エリアから、東の海へ。"}
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={first ? 0 : sw} len={6} max={0.5} />
    </AbsoluteFill>
  );
}

/** 00:27–00:40 概念ルート図 */
function Route() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <Contours color="rgba(12,13,11,0.07)" cx={960} cy={600} rings={20} />
      <AbsoluteFill style={{ padding: "120px 140px", alignItems: "flex-start" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.3em", color: C.red, opacity: ip(frame, [0, 12], [0, 1]) }}>HONG KONG TRAIL — ROUTE</div>
        <div style={{ height: 14 }} />
        <RiseText text="山頂から、海へ。" size={110} delay={4} color={C.ink} />
      </AbsoluteFill>
      <RouteMap drawStart={20} drawLen={200} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: "0 140px 150px" }}>
        <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 36, color: C.ink, opacity: ip(frame, [230, 250], [0, 1]), textAlign: "right" }}>
          1回で全部歩かなくてもいい。
          <br />
          区間ごとに楽しめる、長距離トレイル。
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function Overview() {
  return (
    <AbsoluteFill>
      <At s={0} d={7}>
        <BigNumbers />
      </At>
      <At s={7} d={13}>
        <Route />
      </At>
    </AbsoluteFill>
  );
}
