import { AbsoluteFill, useCurrentFrame } from "remotion";
import { At } from "../components/At";
import { Flash, Photo, img } from "../components/basics";
import { Chara } from "../components/chara";
import { Contours } from "../components/graphics";
import { RiseText, TextClipImage } from "../components/text";
import { ip } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO } from "../theme";

const RECAP = [
  { jp: "街", src: "P_USER_IMG_8365.webp" },
  { jp: "森", src: "P_USER_IMG_8883.webp" },
  { jp: "水", src: "P_USER_IMG_8877.webp" },
  { jp: "稜線", src: "P_USER_IMG_9092.webp" },
  { jp: "海", src: "P_USER_IMG_9069.webp" },
];

/** 04:40–04:44 振り返り：写真が文字の中に流れ込む */
function Recap() {
  const frame = useCurrentFrame();
  const per = 24;
  const i = Math.min(RECAP.length - 1, Math.floor(frame / per));
  const lf = frame - i * per;
  const r = RECAP[i];
  const p = ip(lf, [0, 8], [0, 1], EASE.out);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Photo src={img(r.src)} scale={[1.15, 1.05]} filter="brightness(0.35) blur(4px)" />
      <AbsoluteFill style={{ scale: String(1.4 - 0.4 * p), filter: `blur(${(1 - p) * 12}px)` }}>
        <TextClipImage text={r.jp} src={img(r.src)} font={JP} weight={900} size={r.jp.length > 1 ? 480 : 620} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, display: "flex", justifyContent: "center", gap: 40 }}>
        {RECAP.map((x, k) => (
          <div key={x.jp} style={{ fontFamily: JP, fontWeight: 700, fontSize: 34, color: k === i ? C.red : "rgba(242,237,227,0.4)" }}>
            {x.jp}
          </div>
        ))}
      </div>
      <Flash at={i * per} len={5} max={0.3} />
    </AbsoluteFill>
  );
}

/** 04:44–04:50 次は、自分の足で */
function Invite() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <Contours color="rgba(12,13,11,0.07)" cx={1250} cy={560} />
      <div
        style={{
          position: "absolute",
          right: -40,
          bottom: -80,
          fontFamily: ANTON,
          fontSize: 520,
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: "3px rgba(226,52,43,0.35)",
          translate: `${ip(frame, [0, 180], [80, -60])}px 0`,
        }}
      >
        SEE YOU
      </div>
      <Chara id="V_09" height={1200} cx={1330} bottom={1150} shadow={false} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 150px" }}>
        <RiseText text={"次は、\n自分の足で。"} size={150} delay={10} color={C.ink} />
        <div style={{ height: 30 }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: "0.3em", color: C.red, opacity: ip(frame, [40, 56], [0, 1]) }}>
          WALK THE HONG KONG TRAIL
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** 04:50–05:00 クレジット */
function Credits() {
  const frame = useCurrentFrame();
  const rows: [string, string][] = [
    ["区間情報", "香港漁農自然護理署「郊野樂行」各区間ページ（hiking.gov.hk）／2026年10月確認・距離と時間は公式概数"],
    ["写真", "Mk2010「Lugard Road (Hong Kong).jpg」CC BY-SA 3.0"],
    ["写真", "姒姓賢寧「Lugard Road, Victoria Peak part 9 in October 2022.jpg」CC BY-SA 4.0"],
    ["写真", "Minghong「Pok Fu Lam Reservoir 6.jpg」CC BY-SA 4.0／「Tai Tam Reservoir 3.jpg」CC BY-SA 3.0"],
    ["写真", "Thehistorianisaac「Big wave bay 2025.jpg」CC0"],
    ["", "以上 Wikimedia Commons より。WebP変換・縮小・動画内でのトリミング／拡大表示を行っています"],
    ["表現", "案内役キャラクター・森のイラスト・ルート図・断面図はイメージ／概念図です"],
    ["音楽", "オリジナル（Python によるプログラム生成）"],
  ];
  const fade = ip(frame, [270, 300], [1, 0], EASE.soft);
  return (
    <AbsoluteFill style={{ background: C.ink, padding: "110px 150px", opacity: fade }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
        <div style={{ fontFamily: ANTON, fontSize: 120, lineHeight: 0.9, color: C.paper }}>HONG KONG TRAIL</div>
        <div style={{ fontFamily: JP, fontWeight: 900, fontSize: 52, color: C.red, paddingBottom: 8 }}>港島徑</div>
      </div>
      <div style={{ width: ip(frame, [0, 30], [0, 1620], EASE.inOut), height: 3, background: C.red, margin: "34px 0 40px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", gap: 30, opacity: ip(frame, [10 + i * 4, 24 + i * 4], [0, 1]), translate: `0 ${ip(frame, [10 + i * 4, 24 + i * 4], [16, 0])}px` }}>
            <div style={{ width: 120, fontFamily: JP, fontWeight: 700, fontSize: 26, color: C.gold }}>{k}</div>
            <div style={{ fontFamily: JP, fontWeight: 500, fontSize: 26, color: C.paper, lineHeight: 1.4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 150, bottom: 90, fontFamily: JP, fontWeight: 500, fontSize: 22, color: "rgba(242,237,227,0.6)", opacity: ip(frame, [60, 80], [0, 1]) }}>
        通行可否・天候など最新の現地情報は、公式サイトの案内をご確認ください。詳細な出典は概要欄に記載しています。
      </div>
    </AbsoluteFill>
  );
}

export function Outro() {
  return (
    <AbsoluteFill>
      <At s={0} d={4}>
        <Recap />
      </At>
      <At s={4} d={6}>
        <Invite />
      </At>
      <At s={10} d={10}>
        <Credits />
      </At>
    </AbsoluteFill>
  );
}
