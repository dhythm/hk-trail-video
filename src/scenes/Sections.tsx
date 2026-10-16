import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { At } from "../components/At";
import { Flash, Photo, img } from "../components/basics";
import { Contours, Elevation, Rays, Ripples, RouteMap, SpeedLines, Stripes, Viewfinder } from "../components/graphics";
import { Hud, SectionCard } from "../components/section";
import { Counter, Marquee, RiseText, SlamText } from "../components/text";
import { SECTIONS } from "../data";
import { ip, rand, shake } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO, SERIF } from "../theme";
import { CharaScene, PhotoScene, SplitScene, WordSlam } from "./common";

const CARD = 4.5;

function Frame({ n, total, children }: { n: number; total: number; children: React.ReactNode }) {
  return (
    <AbsoluteFill>
      <At s={0} d={CARD} name={`Card ${n}`}>
        <SectionCard s={SECTIONS[n - 1]} />
      </At>
      {children}
      <At s={CARD} d={total - CARD} z={50} name="HUD">
        <Hud n={n} />
      </At>
    </AbsoluteFill>
  );
}

/** 写真の上に巨大な英字を乗せ、トラッキングを広げる */
function BigEn({ text, at = 6, size = 200, color = C.paper, top = 150 }: { text: string; at?: number; size?: number; color?: string; top?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const p = ip(frame, [at, at + 16], [0, 1], EASE.out);
  const track = ip(frame, [at, d], [0.02, 0.12], EASE.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      <div
        style={{
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 0.9,
          color: "transparent",
          WebkitTextStroke: `3px ${color}`,
          letterSpacing: `${track}em`,
          opacity: p,
          clipPath: `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}%)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}

// ───────────────────────── SECTION 1 ─────────────────────────
export function S1() {
  return (
    <Frame n={1} total={30}>
      <At s={4.5} d={4.5}>
        <PhotoScene
          src={img("P_EXT_s01_lugard_road_2011.webp")}
          kicker="LUGARD ROAD"
          text={"盧吉道から、\n歩きはじめる。"}
          scale={[1.18, 1.04]}
          x={[-40, 20]}
          flash
        >
          <BigEn text="LUGARD ROAD" size={230} />
        </PhotoScene>
      </At>
      <At s={9} d={6}>
        <CharaScene
          id="V_01"
          bg={<Photo src={img("P_USER_IMG_8365.webp")} scale={[1.25, 1.1]} filter="blur(10px) brightness(0.5) saturate(1.2)" />}
          word="LOOK OUT"
          text={"港と高層ビルを\n見渡す道。"}
          cx={1300}
        />
      </At>
      <At s={15} d={6}>
        <PhotoScene
          src={img("P_EXT_s01_lugard_road_2022.webp")}
          text={"木々に囲まれた道も、\n同じ区間の中に。"}
          size={96}
          scale={[1.08, 1.2]}
          y={[30, -30]}
          pos="br"
        />
      </At>
      <At s={21} d={9}>
        <SplitScene
          left={img("P_USER_IMG_8365.webp")}
          right={img("P_EXT_s01_lugard_road_2022.webp")}
          leftWord="CITY"
          rightWord="NATURE"
          text={"都市と自然が、\nこんなに近い。"}
        />
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 2 ─────────────────────────
export function S2() {
  return (
    <Frame n={2} total={25}>
      <At s={4.5} d={6.5}>
        <PhotoScene
          src={img("P_EXT_s02_pok_fu_lam_reservoir.webp")}
          kicker="POK FU LAM RESERVOIR"
          text={"水源と緑と、\nそのすぐ先の街。"}
          sub="薄扶林水塘 — 区間1と2をつなぐエリア"
          scale={[1.22, 1.05]}
          y={[-40, 10]}
          letterbox
        />
      </At>
      <At s={11} d={6}>
        <CharaScene
          id="V_02"
          bg={
            <AbsoluteFill style={{ background: SECTIONS[1].accent }}>
              <Stripes color="rgba(0,0,0,0.08)" speed={-3} angle={90} gap={60} />
              <Marquee
                size={300}
                rows={[
                  { text: "WALK · 歩く · WALK · 歩く", speed: 6, color: "rgba(12,13,11,0.18)" },
                  { text: "NEXT DOOR TO LIFE", speed: 4, stroke: "3px rgba(242,237,227,0.35)", offset: 500 },
                ]}
              />
            </AbsoluteFill>
          }
          text={"暮らしの隣を、\n歩く。"}
          cx={1250}
        />
      </At>
      <At s={17} d={8}>
        <PhotoScene
          src={img("P_USER_IMG_8393.webp")}
          kicker="PEEL RISE"
          text={"標識が示す、\n次の道。"}
          sub="貝璐道（Peel Rise）の案内標識"
          pos="br"
          scale={[1.05, 1.18]}
          x={[0, -40]}
          flash
        >
          <BigEn text="PEEL RISE" size={250} top={130} />
        </PhotoScene>
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 3 ─────────────────────────
function FloatingWords({ words }: { words: string[] }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {words.map((w, i) => {
        const x = 1000 + rand(i * 4.7) * 650;
        const y0 = 300 + rand(i * 2.3) * 500;
        const st = 20 + i * 22;
        const p = ip(frame, [st, st + 30], [0, 1], EASE.out);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: x,
              top: y0 - frame * 0.4,
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 54,
              color: C.paper,
              opacity: p * 0.9,
              filter: `blur(${(1 - p) * 10}px)`,
              letterSpacing: "0.2em",
              textShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}
          >
            {w}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

export function S3() {
  return (
    <Frame n={3} total={25}>
      <At s={4.5} d={7.5}>
        <AbsoluteFill>
          <Photo src={img("I_S03_forest.webp")} scale={[1.05, 1.22]} y={[20, -20]} filter="saturate(1.05)" />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,25,18,0.75) 0%, rgba(10,25,18,0.1) 55%)" }} />
          <FloatingWords words={["シダ", "苔", "沢", "木陰", "重なる樹木"]} />
          <AbsoluteFill style={{ padding: "150px 160px", alignItems: "flex-start", justifyContent: "center" }}>
            <RiseText text={"歩く速度で、\n気づく風景。"} size={112} delay={10} />
          </AbsoluteFill>
        </AbsoluteFill>
      </At>
      <At s={12} d={6}>
        <CharaScene
          id="V_03"
          bg={
            <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 40%, #24533a 0%, ${C.forest} 70%)` }}>
              <Ripples cx={1240} cy={330} color="rgba(190,230,200,0.45)" period={30} maxR={1100} />
            </AbsoluteFill>
          }
          word="LISTEN"
          wordColor="rgba(190,230,200,0.5)"
          text={"立ち止まって、\n耳を澄ます。"}
          cx={1250}
        />
      </At>
      <At s={18} d={7}>
        <PhotoScene
          src={img("P_USER_IMG_8883.webp")}
          text={"自然の細部は、\n足元にある。"}
          pos="br"
          scale={[1.2, 1.04]}
          y={[40, 0]}
        />
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 4 ─────────────────────────
export function S4() {
  const accent = SECTIONS[3].accent;
  return (
    <Frame n={4} total={25}>
      <At s={4.5} d={6.5}>
        <WordSlam
          words={[
            { jp: "樹林", en: "WOODLAND" },
            { jp: "石橋", en: "STONE BRIDGE" },
            { jp: "歴史", en: "HISTORY" },
          ]}
          bg="#1d1712"
          accent="#d79a5a"
        >
          <Contours color="rgba(215,154,90,0.16)" cx={960} cy={560} rings={22} seed={4} />
        </WordSlam>
      </At>
      <At s={11} d={6}>
        <CharaScene
          id="V_04"
          bg={
            <AbsoluteFill style={{ background: "#1d1712" }}>
              <Contours color="rgba(215,154,90,0.14)" cx={700} cy={500} seed={7} />
            </AbsoluteFill>
          }
          word="DISCOVER"
          wordColor="rgba(215,154,90,0.5)"
          text={"発見を、\n撮る。"}
          cx={1250}
        >
          <Viewfinder shutterAt={60} />
        </CharaScene>
        <Flash at={60} len={10} max={0.9} />
      </At>
      <At s={17} d={8}>
        <AbsoluteFill style={{ background: C.paper }}>
          <Contours color="rgba(12,13,11,0.06)" cx={960} cy={600} rings={20} />
          <RouteMap drawStart={0} drawLen={40} highlight={4} accent={accent} />
          <AbsoluteFill style={{ padding: "130px 140px", alignItems: "flex-start" }}>
            <RiseText text={"樹林、石橋、戦時の防御施設。"} size={78} delay={10} color={C.ink} />
            <div style={{ height: 16 }} />
            <RiseText text={"風景の中に、街と歴史の気配。"} size={56} delay={30} weight={700} color={accent} />
          </AbsoluteFill>
        </AbsoluteFill>
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 5 ─────────────────────────
export function S5() {
  const accent = SECTIONS[4].accent;
  return (
    <Frame n={5} total={35}>
      <At s={4.5} d={6.5}>
        <AbsoluteFill style={{ background: "#211a0c" }}>
          <Contours color="rgba(242,181,58,0.10)" cx={1100} cy={700} />
          <Elevation start={10} len={110} accent={accent} />
          <AbsoluteFill style={{ padding: "120px 140px", alignItems: "flex-start" }}>
            <RiseText text={"距離だけでは、\n測れない。"} size={100} delay={6} />
          </AbsoluteFill>
          <AbsoluteFill style={{ padding: "120px 140px", alignItems: "flex-end" }}>
            <div style={{ fontFamily: ANTON, fontSize: 150, color: C.gold, lineHeight: 0.9, textAlign: "right" }}>
              <SlamText text="UP & DOWN" at={20} size={150} color={C.gold} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </At>
      <At s={11} d={6}>
        <CharaScene
          id="V_05"
          bg={
            <AbsoluteFill style={{ background: accent }}>
              <Stripes color="rgba(0,0,0,0.10)" speed={-2.4} angle={-35} gap={70} />
            </AbsoluteFill>
          }
          word="CLIMB"
          wordColor="rgba(12,13,11,0.55)"
          text={"一歩ずつ、\n上へ。"}
          cx={1250}
        />
      </At>
      <At s={17} d={8}>
        <PhotoScene
          src={img("P_USER_IMG_8576.webp")}
          text={"登りの先に、"}
          size={130}
          scale={[1.3, 1.08]}
          y={[60, 0]}
        />
      </At>
      <At s={25} d={10}>
        <PhotoScene
          src={img("P_USER_IMG_8590.webp")}
          text={"視界が、ひらける。"}
          sub="登った分だけ、街と海が広がる。"
          pos="c"
          size={140}
          scale={[1.02, 1.14]}
          letterbox
          textDelay={22}
        />
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 6 ─────────────────────────
function WaterLines() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080">
        {Array.from({ length: 14 }, (_, i) => {
          const y = 120 + i * 68;
          const ph = frame * 0.05 + i * 0.7;
          const d = Array.from({ length: 41 }, (_, k) => {
            const x = (k / 40) * 1920;
            return `${k === 0 ? "M" : "L"}${x.toFixed(0)},${(y + Math.sin(x / 160 + ph) * 10).toFixed(1)}`;
          }).join(" ");
          return <path key={i} d={d} stroke="rgba(200,240,240,0.18)" strokeWidth={2} fill="none" />;
        })}
      </svg>
    </AbsoluteFill>
  );
}

export function S6() {
  return (
    <Frame n={6} total={30}>
      <At s={4.5} d={7.5}>
        <PhotoScene
          src={img("P_EXT_s06_tai_tam_aqueduct.webp")}
          kicker="TAI TAM"
          text={"大潭上水塘の、\n石造輸水道。"}
          sub="山の緑と水面、貯水施設の歴史が重なる。"
          scale={[1.12, 1.0]}
          x={[30, -30]}
          fadeIn={10}
        />
      </At>
      <At s={12} d={6}>
        <CharaScene
          id="V_06"
          bg={
            <AbsoluteFill style={{ background: `linear-gradient(180deg, #0f4a52 0%, ${C.teal} 100%)` }}>
              <WaterLines />
            </AbsoluteFill>
          }
          word="BREATHE"
          wordColor="rgba(200,240,240,0.45)"
          text={"ひと息、\nつく。"}
          cx={1250}
        />
      </At>
      <At s={18} d={6}>
        <PhotoScene src={img("P_USER_IMG_8577.webp")} text={"静けさも、\nこの道の一部。"} pos="bl" scale={[1.0, 1.1]} fadeIn={12} />
      </At>
      <At s={24} d={6}>
        <PhotoScene src={img("P_USER_IMG_8877.webp")} scale={[1.1, 1.0]} x={[-30, 30]} fadeIn={14}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <RiseText text={"水辺で\nひと息"} size={96} delay={14} font={SERIF} weight={600} vertical stagger={4} dur={24} />
          </AbsoluteFill>
        </PhotoScene>
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 7 ─────────────────────────
export function S7() {
  return (
    <Frame n={7} total={25}>
      <At s={4.5} d={6.5}>
        <PhotoScene
          src={img("P_USER_IMG_9049.webp")}
          text={"視界が、\n海へ開く。"}
          size={130}
          scale={[1.25, 1.05]}
          x={[0, -40]}
          letterbox
          textDelay={18}
        />
      </At>
      <At s={11} d={6}>
        <CharaScene
          id="V_07"
          bg={
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #1d7fc4 0%, ${C.sea} 60%, #0b2f5c 100%)` }}>
              <SpeedLines />
              <Marquee size={260} rows={[{ text: "SEA BREEZE", speed: 9, stroke: "3px rgba(242,237,227,0.3)" }, { text: "林から、海へ", speed: 7, color: "rgba(242,237,227,0.12)", font: JP, size: 200, offset: 400 }]} />
            </AbsoluteFill>
          }
          text={"林から、\n海へ。"}
          cx={1250}
        />
      </At>
      <At s={17} d={8}>
        <PhotoScene
          src={img("P_USER_IMG_9062.webp")}
          kicker="FINAL STAIRS"
          text={"終盤には、\n階段の登りも。"}
          sub="土地灣から石澳道へ上がる階段がある"
          pos="br"
          scale={[1.15, 1.02]}
          y={[-30, 10]}
        />
      </At>
    </Frame>
  );
}

// ───────────────────────── SECTION 8 ─────────────────────────
function PeakCounter() {
  const frame = useCurrentFrame();
  const sh = shake(frame, 34, 12, 16);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `${sh.x}px ${sh.y}px` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: C.paper, textShadow: "0 10px 50px rgba(0,0,0,0.5)" }}>
        <span style={{ fontFamily: ANTON, fontSize: 420, lineHeight: 0.9 }}>
          <Counter from={0} to={284} start={6} dur={28} />
        </span>
        <span style={{ fontFamily: ANTON, fontSize: 140 }}>m</span>
      </div>
      <div style={{ display: "flex", gap: 26, alignItems: "center", opacity: ip(frame, [30, 44], [0, 1]) }}>
        <span style={{ fontFamily: JP, fontWeight: 900, fontSize: 64, color: C.paper }}>打爛埕頂山</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: C.gold }}>SHEK O PEAK</span>
      </div>
    </AbsoluteFill>
  );
}

function FinalGoal() {
  const frame = useCurrentFrame();
  const p = ip(frame, [20, 34], [0, 1], EASE.out);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: "0.5em", color: C.gold, opacity: p }}>FINISH LINE</div>
      <SlamText text="BIG WAVE BAY" at={20} size={250} />
      <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: ip(frame, [40, 56], [0, 1]) }}>
        <span style={{ fontFamily: JP, fontWeight: 900, fontSize: 72, color: C.paper }}>大浪灣</span>
        <span style={{ width: 3, height: 60, background: C.paper }} />
        <span style={{ fontFamily: JP, fontWeight: 700, fontSize: 44, color: C.paper }}>
          山頂から約<Counter from={0} to={50} start={44} dur={50} style={{ fontFamily: ANTON, fontSize: 80, color: C.gold, padding: "0 8px" }} />km
        </span>
      </div>
    </AbsoluteFill>
  );
}

export function S8() {
  return (
    <Frame n={8} total={45}>
      <At s={4.5} d={4.5}>
        <PhotoScene src={img("P_USER_IMG_9068.webp")} scale={[1.25, 1.05]} x={[-30, 0]} flash>
          <AbsoluteFill style={{ background: "rgba(8,9,8,0.35)" }} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <SlamText text={"DRAGON'S\nBACK"} at={4} size={280} />
            <div style={{ height: 20 }} />
            <RiseText text="龍脊" size={110} delay={16} />
          </AbsoluteFill>
        </PhotoScene>
      </At>
      <At s={9} d={5}>
        <PhotoScene src={img("P_USER_IMG_9091.webp")} scale={[1.1, 1.3]} filter="brightness(0.38) saturate(1.1) blur(3px)">
          <PeakCounter />
        </PhotoScene>
      </At>
      <At s={14} d={7}>
        <PhotoScene
          src={img("P_USER_IMG_9069.webp")}
          text={"石澳の海を、\n見渡す。"}
          size={120}
          scale={[1.2, 1.04]}
          y={[-40, 20]}
        />
      </At>
      <At s={21} d={6}>
        <CharaScene
          id="V_08"
          bg={
            <AbsoluteFill style={{ background: `radial-gradient(circle at 65% 55%, #ff5a3c 0%, ${C.red} 40%, ${C.redDeep} 100%)` }}>
              <Rays cx={1250} cy={560} />
            </AbsoluteFill>
          }
          word="ON THE RIDGE"
          wordColor="rgba(242,237,227,0.45)"
          text={"稜線の上で、\n両手を広げる。"}
          cx={1250}
        />
      </At>
      <At s={27} d={8}>
        <PhotoScene
          src={img("P_USER_IMG_9092.webp")}
          text={"でも、道は\nまだ続く。"}
          sub="ゴールは山頂ではなく、その先の海。"
          scale={[1.04, 1.2]}
          origin="50% 90%"
        />
      </At>
      <At s={35} d={10}>
        <PhotoScene src={img("P_EXT_s08_big_wave_bay.webp")} scale={[1.3, 1.05]} filter="brightness(0.7) saturate(1.15)" letterbox>
          <FinalGoal />
        </PhotoScene>
      </At>
    </Frame>
  );
}

