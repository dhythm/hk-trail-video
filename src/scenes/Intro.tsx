import { AbsoluteFill, useCurrentFrame } from "remotion";
import { At } from "../components/At";
import { Flash, Photo, Tag, img } from "../components/basics";
import { Chara } from "../components/chara";
import { Contours, Stripes } from "../components/graphics";
import { BoxReveal, MaskWord, Marquee, RiseText } from "../components/text";
import { CREDIT } from "../data";
import { ip, shake } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO, SERIF } from "../theme";

function SubLabel({ jp, en }: { jp: string; en: string }) {
  return (
    <BoxReveal at={6} color={C.red}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.red, padding: "10px 22px" }}>
        <span style={{ fontFamily: JP, fontWeight: 900, fontSize: 40, color: C.paper }}>{jp}</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.3em", color: C.paper }}>{en}</span>
      </div>
    </BoxReveal>
  );
}

/** 00:00–00:10 単語が写真をまとって叩きつけられ、拡大して写真に抜ける */
function WordPunches() {
  const words = [
    { w: "CITY", src: img("P_USER_IMG_8365.webp"), jp: "街", en: "CITY", kind: "user" as const, credit: CREDIT.user },
    { w: "FOREST", src: img("P_USER_IMG_8883.webp"), jp: "森", en: "FOREST", kind: "user" as const, credit: CREDIT.user },
    { w: "RIDGE", src: img("P_USER_IMG_9092.webp"), jp: "稜線", en: "RIDGE", kind: "user" as const, credit: CREDIT.user },
    { w: "SEA", src: img("P_EXT_s08_big_wave_bay.webp"), jp: "海", en: "SEA", kind: "ext" as const, credit: CREDIT.bigwave },
  ];
  return (
    <>
      {words.map((x, i) => (
        <At key={x.w} s={i * 2.5} d={2.5}>
          <ShakeWrap>
            <MaskWord word={x.w} src={x.src} size={x.w.length > 5 ? 470 : 600} sub={<SubLabel jp={x.jp} en={x.en} />} />
          </ShakeWrap>
          <Flash at={0} len={7} max={0.6} />
          <Tag kind={x.kind} text={x.credit} delay={10} />
        </At>
      ))}
    </>
  );
}

function ShakeWrap({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const sh = shake(frame, 0, 12, 18);
  return <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>{children}</AbsoluteFill>;
}

/** 00:10–00:16 案内役の登場 */
function CharaIntro() {
  const frame = useCurrentFrame();
  const bgIn = ip(frame, [0, 14], [0, 1], EASE.out);
  return (
    <AbsoluteFill style={{ background: C.red, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: `circle(${bgIn * 140}% at 50% 60%)`, background: C.redDeep }} />
      <Stripes color="rgba(0,0,0,0.08)" speed={1.4} />
      <Marquee
        size={230}
        rotate={-8}
        rows={[
          { text: "WALK  AND  DISCOVER", speed: 4, stroke: "3px rgba(242,237,227,0.55)" },
          { text: "歩いて、出会う。", speed: -5, color: "rgba(12,13,11,0.32)", font: JP, size: 200 },
          { text: "WALK  AND  DISCOVER", speed: 3, stroke: "3px rgba(242,237,227,0.55)", offset: 600 },
        ]}
        opacity={bgIn}
      />
      <Chara id="V_00" height={1180} cx={1250} bottom={1140} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 120 }}>
        <RiseText text={"香港には、"} size={64} delay={20} weight={700} color={C.paper} />
        <div style={{ height: 10 }} />
        <RiseText text={"歩いて出会う\n景色がある。"} size={112} delay={30} color={C.paper} />
      </AbsoluteFill>
      <Tag kind="chara" text={CREDIT.chara} delay={40} />
    </AbsoluteFill>
  );
}

/** 00:16–00:20 タイトル */
function Title() {
  const frame = useCurrentFrame();
  const a = ip(frame, [0, 14], [-1, 0], EASE.out);
  const b = ip(frame, [4, 18], [1, 0], EASE.out);
  const red = ip(frame, [16, 30], [0, 1], EASE.out);
  const zoom = ip(frame, [0, 120], [1, 1.08], EASE.soft);
  const sh = shake(frame, 0, 10, 10);
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <Photo src={img("P_USER_IMG_8590.webp")} scale={[1.2, 1.05]} filter="brightness(0.45) saturate(1.1)" />
      <Contours color="rgba(242,237,227,0.10)" cx={960} cy={540} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(zoom), translate: `${sh.x}px ${sh.y}px` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: ANTON, fontSize: 300, lineHeight: 0.86, color: C.paper, translate: `${a * 1400}px 0`, letterSpacing: "0.01em" }}>HONG KONG</div>
          <div style={{ display: "flex", alignItems: "center", gap: 40, translate: `${b * 1400}px 0` }}>
            <div style={{ fontFamily: ANTON, fontSize: 300, lineHeight: 0.86, color: "transparent", WebkitTextStroke: `4px ${C.paper}` }}>TRAIL</div>
            <div
              style={{
                background: C.red,
                padding: "18px 26px",
                writingMode: "vertical-rl",
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 64,
                color: C.paper,
                letterSpacing: "0.15em",
                clipPath: `inset(0 0 ${(1 - red) * 100}% 0)`,
              }}
            >
              港島徑
            </div>
          </div>
          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 24, opacity: ip(frame, [24, 40], [0, 1]) }}>
            <div style={{ width: 80, height: 2, background: C.paper }} />
            <div style={{ fontFamily: JP, fontWeight: 900, fontSize: 52, color: C.paper, letterSpacing: "0.3em" }}>香港トレイル</div>
            <div style={{ width: 80, height: 2, background: C.paper }} />
          </div>
        </div>
      </AbsoluteFill>
      <Tag kind="user" text={CREDIT.user} delay={30} />
      <Flash at={0} len={10} max={0.7} />
    </AbsoluteFill>
  );
}

export function Intro() {
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <WordPunches />
      <At s={10} d={6}>
        <CharaIntro />
      </At>
      <At s={16} d={4}>
        <Title />
      </At>
    </AbsoluteFill>
  );
}
