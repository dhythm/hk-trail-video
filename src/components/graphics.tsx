import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ip, rand } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO } from "../theme";

/** 等高線テクスチャ（ゆっくり回転・呼吸する） */
export function Contours({ color = "rgba(242,237,227,0.12)", seed = 1, cx = 1300, cy = 620, rings = 16 }: { color?: string; seed?: number; cx?: number; cy?: number; rings?: number }) {
  const frame = useCurrentFrame();
  const paths = Array.from({ length: rings }, (_, r) => {
    const base = 60 + r * 62;
    const pts = Array.from({ length: 64 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      const n =
        Math.sin(a * 3 + seed + r * 0.3) * 0.12 +
        Math.sin(a * 5 + seed * 2.1 + r * 0.17 + frame * 0.004) * 0.06 +
        Math.sin(a * 2 - seed) * 0.08;
      const rad = base * (1 + n);
      return [cx + Math.cos(a) * rad * 1.35, cy + Math.sin(a) * rad];
    });
    return "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L") + "Z";
  });
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{ rotate: `${frame * 0.02}deg`, transformOrigin: `${cx}px ${cy}px` }}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth={i % 4 === 0 ? 2.2 : 1.1} />
        ))}
      </svg>
    </AbsoluteFill>
  );
}

/** 斜めのパネルが画面を横切るワイプ（中央フレームで画面を完全に覆う） */
export function PanelWipe({ colors = [C.red, C.ink], len = 22, dir = 1 }: { colors?: string[]; len?: number; dir?: 1 | -1 }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {colors.map((col, i) => {
        const s = i * 3;
        const p = ip(frame, [s, s + len], [0, 1], EASE.inOut);
        const x = (-1.4 + p * 2.8) * 1920 * dir;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -200,
              bottom: -200,
              left: 0,
              width: 2600,
              marginLeft: -340,
              background: col,
              translate: `${x}px 0`,
              transform: "skewX(-18deg)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** 横方向のスピードライン（風） */
export function SpeedLines({ color = "rgba(255,255,255,0.5)", count = 34, speed = 70 }: { color?: string; count?: number; speed?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const y = rand(i * 3.3) * 1080;
        const w = 200 + rand(i * 5.1) * 700;
        const v = speed * (0.6 + rand(i * 9.7));
        const x = ((frame * v + rand(i) * 4000) % 3200) - 900;
        return (
          <div
            key={i}
            style={{ position: "absolute", top: y, left: x, width: w, height: 2 + rand(i * 2) * 3, background: `linear-gradient(90deg, transparent, ${color})`, borderRadius: 4 }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** 放射状の光（回転） */
export function Rays({ color = "rgba(242,181,58,0.22)", count = 18, cx = 960, cy = 620 }: { color?: string; count?: number; cx?: number; cy?: number }) {
  const frame = useCurrentFrame();
  const seg = 360 / count;
  const stops = Array.from({ length: count }, (_, i) => `${color} ${i * seg}deg ${i * seg + seg / 2}deg, transparent ${i * seg + seg / 2}deg ${(i + 1) * seg}deg`).join(",");
  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${frame * 0.4}deg at ${cx}px ${cy}px, ${stops})`,
        maskImage: `radial-gradient(circle at ${cx}px ${cy}px, black 0%, black 30%, transparent 75%)`,
      }}
    />
  );
}

/** 同心円の波紋（音・水） */
export function Ripples({ cx, cy, color = "rgba(242,237,227,0.5)", period = 36, count = 5, maxR = 900 }: { cx: number; cy: number; color?: string; period?: number; count?: number; maxR?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080">
        {Array.from({ length: count }, (_, i) => {
          const t = ((frame + (i * period * count) / count) % (period * count)) / (period * count);
          return <circle key={i} cx={cx} cy={cy} r={t * maxR} fill="none" stroke={color} strokeWidth={3 * (1 - t) + 0.5} opacity={1 - t} />;
        })}
      </svg>
    </AbsoluteFill>
  );
}

/** カメラのビューファインダー */
export function Viewfinder({ shutterAt }: { shutterAt: number }) {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;
  const focus = ip(frame, [shutterAt - 24, shutterAt - 4], [1.4, 1], EASE.out);
  const corner = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 80, height: 80, borderColor: C.paper, borderStyle: "solid", borderWidth: 0, ...style }} />
  );
  const secs = Math.floor(frame / 30);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {corner({ top: 80, left: 100, borderTopWidth: 5, borderLeftWidth: 5 })}
      {corner({ top: 80, right: 100, borderTopWidth: 5, borderRightWidth: 5 })}
      {corner({ bottom: 80, left: 100, borderBottomWidth: 5, borderLeftWidth: 5 })}
      {corner({ bottom: 80, right: 100, borderBottomWidth: 5, borderRightWidth: 5 })}
      <div style={{ position: "absolute", top: 104, left: 140, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 26, color: C.paper }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: C.red, opacity: blink ? 1 : 0.2 }} />
        REC 00:00:{String(secs).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", top: 104, right: 140, fontFamily: MONO, fontSize: 26, color: C.paper }}>ISO 200 · f/2.8 · 1/250</div>
      <div
        style={{
          position: "absolute",
          left: 960 - 130,
          top: 470 - 130,
          width: 260,
          height: 260,
          border: `3px solid ${frame >= shutterAt - 4 ? "#7CFF6B" : C.paper}`,
          scale: String(focus),
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
}

/** キャッチ・ムーブ用の斜線テクスチャ */
export function Stripes({ color = "rgba(255,255,255,0.06)", speed = 1.2, angle = -30, gap = 46 }: { color?: string; speed?: number; angle?: number; gap?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `repeating-linear-gradient(${angle}deg, ${color} 0px, ${color} 14px, transparent 14px, transparent ${gap}px)`,
        backgroundPosition: `${frame * speed}px ${frame * speed * 0.6}px`,
      }}
    />
  );
}

/** 香港トレイル全体の概念ルート図（縮尺なし） */
const NODES: [number, number][] = [
  [250, 640],
  [430, 560],
  [600, 660],
  [780, 560],
  [960, 610],
  [1130, 520],
  [1300, 610],
  [1480, 540],
  [1670, 640],
];

function smoothPath(pts: [number, number][]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function RouteMap({
  drawStart = 0,
  drawLen = 150,
  highlight,
  ink = C.ink,
  accent = C.red,
  showLabels = true,
}: {
  drawStart?: number;
  drawLen?: number;
  highlight?: number;
  ink?: string;
  accent?: string;
  showLabels?: boolean;
}) {
  const frame = useCurrentFrame();
  const d = smoothPath(NODES);
  const prog = ip(frame, [drawStart, drawStart + drawLen], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080">
        <path d={d} fill="none" stroke={ink} strokeOpacity={0.14} strokeWidth={14} strokeLinecap="round" />
        <path d={d} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog} />
        {NODES.map(([x, y], i) => {
          const t = i / (NODES.length - 1);
          const pop = ip(frame, [drawStart + t * drawLen - 2, drawStart + t * drawLen + 10], [0, 1], EASE.back);
          const end = i === 0 || i === NODES.length - 1;
          return (
            <g key={i} style={{ transform: `translate(${x}px, ${y}px) scale(${pop})` }}>
              <circle r={end ? 22 : 12} fill={end ? accent : C.paper} stroke={ink} strokeWidth={5} />
            </g>
          );
        })}
        {NODES.slice(0, -1).map(([x, y], i) => {
          const [x2, y2] = NODES[i + 1];
          const t = (i + 0.5) / (NODES.length - 1);
          const pop = ip(frame, [drawStart + t * drawLen, drawStart + t * drawLen + 12], [0, 1], EASE.back);
          const mx = (x + x2) / 2;
          const my = (y + y2) / 2 - 78;
          const hl = highlight === i + 1;
          return (
            <g key={`n${i}`} style={{ transform: `translate(${mx}px, ${my}px) scale(${pop * (hl ? 1.25 : 1)})` }}>
              <rect x={-30} y={-30} width={60} height={60} fill={hl ? accent : ink} />
              <text x={0} y={16} textAnchor="middle" fontFamily={ANTON} fontSize={44} fill={C.paper}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {showLabels ? (
        <>
          <MapLabel x={NODES[0][0]} y={NODES[0][1] + 52} at={drawStart} jp="山頂" en="THE PEAK" ink={ink} />
          <MapLabel x={NODES[8][0]} y={NODES[8][1] + 52} at={drawStart + drawLen} jp="大浪灣" en="BIG WAVE BAY" ink={ink} />
        </>
      ) : null}
    </AbsoluteFill>
  );
}

function MapLabel({ x, y, at, jp, en, ink }: { x: number; y: number; at: number; jp: string; en: string; ink: string }) {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1]);
  return (
    <div style={{ position: "absolute", left: x - 200, top: y, width: 400, textAlign: "center", opacity: p, translate: `0 ${(1 - p) * 20}px` }}>
      <div style={{ fontFamily: JP, fontWeight: 900, fontSize: 48, color: ink }}>{jp}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", color: ink, opacity: 0.7 }}>{en}</div>
    </div>
  );
}

/** 登り下りの模式断面（第5区間） */
export function Elevation({ start = 0, len = 90, color = C.paper, accent = C.gold }: { start?: number; len?: number; color?: string; accent?: string }) {
  const frame = useCurrentFrame();
  const pts: [number, number][] = [
    [140, 900],
    [420, 850],
    [640, 600],
    [840, 710],
    [1100, 520],
    [1340, 680],
    [1560, 630],
    [1780, 740],
  ];
  const d = smoothPath(pts);
  const prog = ip(frame, [start, start + len], [0, 1], EASE.inOut);
  const labels: { i: number; jp: string; en: string }[] = [
    { i: 0, jp: "黃泥涌峽", en: "WONG NAI CHUNG GAP" },
    { i: 2, jp: "渣甸山", en: "JARDINE'S LOOKOUT" },
    { i: 4, jp: "畢拿山", en: "MOUNT BUTLER" },
    { i: 7, jp: "大風坳", en: "QUARRY GAP" },
  ];
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080">
        <defs>
          <linearGradient id="elev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity={0.45} />
            <stop offset="1" stopColor={accent} stopOpacity={0} />
          </linearGradient>
          <clipPath id="elevclip">
            <rect x={0} y={0} width={140 + prog * 1640} height={1080} />
          </clipPath>
        </defs>
        <path d={`${d} L1780,1080 L140,1080 Z`} fill="url(#elev)" clipPath="url(#elevclip)" />
        <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog} />
      </svg>
      {labels.map(({ i, jp, en }) => {
        const [x, y] = pts[i];
        const t = (x - 140) / 1640;
        const p = ip(frame, [start + t * len, start + t * len + 14], [0, 1], EASE.back);
        return (
          <div key={i} style={{ position: "absolute", left: x - 180, top: y - 150, width: 360, textAlign: "center", opacity: Math.min(1, p), scale: String(0.6 + 0.4 * p) }}>
            <div style={{ fontFamily: JP, fontWeight: 900, fontSize: 46, color }}>{jp}</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color, opacity: 0.75 }}>{en}</div>
            <div style={{ width: 3, height: 40, background: color, margin: "10px auto 0", opacity: 0.6 }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/** 進行に合わせて画面端のシーンを少しずつズームさせるラッパー */
export function Push({ children, from = 1, to = 1.06 }: { children: React.ReactNode; from?: number; to?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <AbsoluteFill style={{ scale: String(ip(frame, [0, durationInFrames], [from, to], EASE.soft)) }}>{children}</AbsoluteFill>;
}
