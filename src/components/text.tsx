import React, { useId } from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { ip } from "../lib/anim";
import { ANTON, C, EASE, H, JP, W } from "../theme";

type TextStyle = {
  size: number;
  font?: string;
  weight?: number;
  color?: string;
  lineHeight?: number;
  letterSpacing?: string;
  align?: "left" | "center" | "right";
  stroke?: string;
};

/** 1文字ずつ下からせり上がる（行ごとにマスク） */
export function RiseText({
  text,
  delay = 0,
  stagger = 2,
  dur = 16,
  exitAt,
  size,
  font = JP,
  weight = 900,
  color = C.paper,
  lineHeight = 1.18,
  letterSpacing = "0.02em",
  align = "left",
  stroke,
  vertical = false,
}: TextStyle & { text: string; delay?: number; stagger?: number; dur?: number; exitAt?: number; vertical?: boolean }) {
  const frame = useCurrentFrame();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: vertical ? "row-reverse" : "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: vertical ? size * 0.25 : 0,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            overflow: "hidden",
            padding: vertical ? "0 0.08em" : "0.04em 0 0.1em",
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            fontFamily: font,
            fontWeight: weight,
            fontSize: size,
            lineHeight,
            letterSpacing,
            color,
            WebkitTextStroke: stroke,
            whiteSpace: "pre",
          }}
        >
          {[...line].map((ch, ci) => {
            const i = idx++;
            const s = delay + i * stagger;
            const p = ip(frame, [s, s + dur], [0, 1], EASE.out);
            const e = exitAt === undefined ? 0 : ip(frame, [exitAt + i * 1, exitAt + i * 1 + 12], [0, 1], EASE.in);
            const off = vertical ? `${(1 - p) * -40}% ${(1 - p) * 0}%` : `0 ${(1 - p) * 110 - e * 110}%`;
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  translate: vertical ? `${(1 - p) * 0}px ${(1 - p) * 60 - e * 60}px` : off,
                  rotate: `${(1 - p) * 6}deg`,
                  opacity: vertical ? p * (1 - e) : 1,
                  filter: vertical ? `blur(${(1 - p) * 8}px)` : undefined,
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** 大きく拡大した状態から叩きつける */
export function SlamText({
  text,
  at = 0,
  size,
  font = ANTON,
  weight = 400,
  color = C.paper,
  letterSpacing = "0em",
  lineHeight = 0.92,
  stroke,
  from = 2.2,
}: TextStyle & { text: string; at?: number; from?: number }) {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 9], [0, 1], EASE.out);
  if (frame < at) return null;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        color,
        letterSpacing,
        lineHeight,
        whiteSpace: "pre",
        scale: String(from - (from - 1) * p),
        opacity: ip(frame, [at, at + 4], [0, 1]),
        filter: `blur(${(1 - p) * 18}px)`,
        WebkitTextStroke: stroke,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

/** 色帯が走って文字が現れる */
export function BoxReveal({
  children,
  at = 0,
  color = C.red,
  len = 18,
}: {
  children: React.ReactNode;
  at?: number;
  color?: string;
  len?: number;
}) {
  const frame = useCurrentFrame();
  const half = len / 2;
  const a = ip(frame, [at, at + half], [0, 1], EASE.inOut);
  const b = ip(frame, [at + half, at + len], [0, 1], EASE.inOut);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ opacity: frame >= at + half ? 1 : 0 }}>{children}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          transformOrigin: b > 0 ? "right" : "left",
          scale: `${b > 0 ? 1 - b : a} 1`,
        }}
      />
    </div>
  );
}

/** 数値カウントアップ */
export function Counter({
  from = 0,
  to,
  start = 0,
  dur = 30,
  decimals = 0,
  format,
  style,
}: {
  from?: number;
  to: number;
  start?: number;
  dur?: number;
  decimals?: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const v = ip(frame, [start, start + dur], [from, to], EASE.out);
  const s = format ? format(v) : v.toFixed(decimals);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{s}</span>;
}

/** 巨大文字が流れ続けるマーキー（背景用） */
export function Marquee({
  rows,
  size = 260,
  font = ANTON,
  gap = 0.2,
  rotate = 0,
  opacity = 1,
}: {
  rows: { text: string; speed: number; color?: string; stroke?: string; offset?: number; font?: string; size?: number }[];
  size?: number;
  font?: string;
  gap?: number;
  rotate?: number;
  opacity?: number;
}) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        opacity,
      }}
    >
      <div style={{ rotate: `${rotate}deg`, display: "flex", flexDirection: "column", gap: size * gap }}>
        {rows.map((r, i) => {
          const unit = `${r.text}\u2002`;
          return (
            <div
              key={i}
              style={{
                fontFamily: r.font ?? font,
                fontWeight: r.font ? 900 : 400,
                fontSize: r.size ?? size,
                lineHeight: 0.9,
                whiteSpace: "nowrap",
                color: r.stroke ? "transparent" : (r.color ?? C.paper),
                WebkitTextStroke: r.stroke,
                translate: `${((frame * r.speed + (r.offset ?? 0)) % 2000) - 2000}px 0`,
              }}
            >
              {unit.repeat(10)}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/**
 * 写真で塗られた文字。CSS の background-image は Remotion が読み込みを待てないため、
 * <Img> に SVG の <clipPath><text> を当てて文字の形に切り抜く。
 */
export function TextClipImage({
  text,
  src,
  font = ANTON,
  weight = 400,
  size,
  letterSpacing = "0em",
  objectPosition = "50% 50%",
  imgScale = 1,
}: {
  text: string;
  src: string;
  font?: string;
  weight?: number;
  size: number;
  letterSpacing?: string;
  objectPosition?: string;
  imgScale?: number;
}) {
  const id = `clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id={id} clipPathUnits="userSpaceOnUse">
            <text
              x={W / 2}
              y={H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: font, fontWeight: weight, fontSize: size, letterSpacing }}
            >
              {text}
            </text>
          </clipPath>
        </defs>
      </svg>
      <AbsoluteFill style={{ clipPath: `url(#${id})` }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition, scale: String(imgScale) }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/**
 * 写真で塗られた巨大な単語。最後に文字が画面いっぱいへ拡大し、写真の全景に抜ける。
 * シーケンスの長さに合わせて自動で進行する。
 */
export function MaskWord({
  word,
  src,
  sub,
  bg = C.ink,
  size = 560,
  originX = "50%",
}: {
  word: string;
  src: string;
  sub?: React.ReactNode;
  bg?: string;
  size?: number;
  originX?: string;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const zoomStart = d - 22;
  const enter = ip(frame, [0, 10], [0, 1], EASE.out);
  const zoom = ip(frame, [zoomStart, d], [1, 26], EASE.in);
  const reveal = ip(frame, [zoomStart + 6, d - 4], [0, 1], EASE.in);
  const pan = ip(frame, [0, d], [40, 60], EASE.soft);
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: reveal }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.25 - reveal * 0.2) }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: String((1.35 - enter * 0.35) * zoom),
          transformOrigin: `${originX} 52%`,
          filter: `blur(${(1 - enter) * 14}px)`,
          opacity: 1 - reveal,
        }}
      >
        <TextClipImage text={word} src={src} size={size} letterSpacing={`${(1 - enter) * 0.25}em`} objectPosition={`${pan}% 50%`} imgScale={1.15} />
      </AbsoluteFill>
      {sub ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, opacity: 1 - ip(frame, [zoomStart, zoomStart + 6], [0, 1]) }}>
          {sub}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}
