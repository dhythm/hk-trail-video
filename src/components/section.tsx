import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Section, SECTIONS } from "../data";
import { ip } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO } from "../theme";
import { Stripes } from "./graphics";
import { Counter, RiseText } from "./text";

function fmtTime(m: number): string {
  const v = Math.round(m);
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

/** 区間タイトルカード：巨大な区間番号・区間名・始終点・公式概数 */
export function SectionCard({ s }: { s: Section }) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const num = String(s.n).padStart(2, "0");
  const numX = ip(frame, [0, d], [160, -40], EASE.soft);
  const fill = ip(frame, [14, 70], [0, 1], EASE.inOut);
  const line = ip(frame, [30, 52], [0, 1], EASE.inOut);
  const lab = ip(frame, [4, 18], [0, 1]);
  const exit = ip(frame, [d - 10, d], [0, 1], EASE.in);
  return (
    <AbsoluteFill style={{ background: s.accent, overflow: "hidden" }}>
      <Stripes color="rgba(0,0,0,0.07)" speed={0.8} />
      {/* 巨大番号：アウトライン → 下から塗りが満ちる */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", paddingRight: 40, translate: `${numX}px 0` }}>
        <div style={{ position: "relative", fontFamily: ANTON, fontSize: 1080, lineHeight: 0.86, letterSpacing: "-0.02em" }}>
          <div style={{ color: "transparent", WebkitTextStroke: `4px ${C.paper}`, opacity: 0.85 }}>{num}</div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              color: "rgba(12,13,11,0.28)",
              clipPath: `inset(${(1 - fill) * 100}% 0 0 0)`,
            }}
          >
            {num}
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: "150px 140px", flexDirection: "column", justifyContent: "center", gap: 34, translate: `0 ${exit * -40}px`, opacity: 1 - exit }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: lab, translate: `${(1 - lab) * -30}px 0` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: C.paper }}>SECTION {num}</div>
          <div style={{ width: 220 * lab, height: 3, background: C.paper }} />
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.2em", color: C.paper, opacity: 0.8 }}>/ 08</div>
        </div>

        <RiseText text={s.title} size={132} delay={6} stagger={2} color={C.paper} lineHeight={1.12} />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: JP, fontWeight: 700, fontSize: 50, color: C.paper }}>
            <span style={{ opacity: ip(frame, [26, 38], [0, 1]) }}>{s.from}</span>
            <svg width="140" height="30" style={{ overflow: "visible" }}>
              <line x1="0" y1="15" x2={130 * line} y2="15" stroke={C.paper} strokeWidth="4" />
              <path d={`M${130 * line - 14},3 L${130 * line},15 L${130 * line - 14},27`} fill="none" stroke={C.paper} strokeWidth="4" opacity={line} />
            </svg>
            <span style={{ opacity: ip(frame, [44, 56], [0, 1]) }}>{s.to}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.18em", color: C.paper, opacity: ip(frame, [48, 64], [0, 0.8]) }}>
            {s.fromEn} → {s.toEn}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 60, marginTop: 10, opacity: ip(frame, [40, 50], [0, 1]) }}>
          <Stat label="DISTANCE" unit="km">
            <Counter to={s.km} start={42} dur={40} decimals={1} />
          </Stat>
          <Stat label="TIME" unit="h">
            <Counter to={s.minutes} start={46} dur={40} format={fmtTime} />
          </Stat>
          <div style={{ fontFamily: JP, fontWeight: 500, fontSize: 22, color: C.paper, opacity: 0.85, paddingBottom: 16 }}>公式概数（休憩・天候で変わります）</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Stat({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.25em", color: C.paper, opacity: 0.8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: C.paper }}>
        <span style={{ fontFamily: ANTON, fontSize: 120, lineHeight: 1 }}>{children}</span>
        <span style={{ fontFamily: ANTON, fontSize: 44 }}>{unit}</span>
      </div>
    </div>
  );
}

/** 区間内で常時表示する HUD（左上タイトル・右上区間番号・下端の進行バー） */
export function Hud({ n, dark = false }: { n: number; dark?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const fg = dark ? C.ink : C.paper;
  const o = Math.min(ip(frame, [0, 12], [0, 1]), ip(frame, [d - 6, d], [1, 0]));
  const prog = ip(frame, [0, d], [0, 1], (t) => t);
  const cum = SECTIONS.slice(0, n - 1).reduce((a, s) => a + s.km, 0);
  const total = SECTIONS.reduce((a, s) => a + s.km, 0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", top: 54, left: 80, display: "flex", alignItems: "center", gap: 16, color: fg }}>
        <div style={{ width: 14, height: 14, background: C.red }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.28em" }}>HONG KONG TRAIL</div>
        <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 20, opacity: 0.8 }}>港島徑</div>
      </div>
      <div style={{ position: "absolute", top: 36, right: 80, display: "flex", alignItems: "baseline", gap: 12, color: fg }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.25em", opacity: 0.85 }}>SECTION</span>
        <span style={{ fontFamily: ANTON, fontSize: 64, lineHeight: 1, color: C.red }}>{String(n).padStart(2, "0")}</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, opacity: 0.7 }}>/ 08</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 30, display: "flex", gap: 6 }}>
        {SECTIONS.map((s) => {
          const w = s.km / total;
          const f = s.n < n ? 1 : s.n === n ? prog : 0;
          return (
            <div key={s.n} style={{ flexGrow: w, height: 5, background: dark ? "rgba(12,13,11,0.18)" : "rgba(242,237,227,0.25)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, width: `${f * 100}%`, background: s.n === n ? C.red : fg }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 80, bottom: 44, fontFamily: MONO, fontSize: 18, letterSpacing: "0.15em", color: fg, opacity: 0.75 }}>
        {cum.toFixed(1)} → {(cum + SECTIONS[n - 1].km).toFixed(1)} / ≈50 KM
      </div>
    </AbsoluteFill>
  );
}
