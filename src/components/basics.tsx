import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ip } from "../lib/anim";
import { C, EASE } from "../theme";

export function img(name: string): string {
  return staticFile(`img/${name}`);
}

/** ケン・バーンズ付きの全面写真 */
export function Photo({
  src,
  scale = [1.12, 1.0],
  x = [0, 0],
  y = [0, 0],
  filter,
  origin = "50% 50%",
  objectPosition = "50% 50%",
  style,
}: {
  src: string;
  scale?: [number, number];
  x?: [number, number];
  y?: [number, number];
  filter?: string;
  origin?: string;
  objectPosition?: string;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = [0, durationInFrames];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transformOrigin: origin,
          scale: String(ip(frame, p, scale, EASE.soft)),
          translate: `${ip(frame, p, x, EASE.soft)}px ${ip(frame, p, y, EASE.soft)}px`,
          filter,
        }}
      />
    </AbsoluteFill>
  );
}

/** フィルムグレイン＋ビネット（全編に薄くかける） */
export function Grain({ opacity = 0.09 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const i = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={staticFile(`fx/grain${i}.png`)}
        style={{ width: "100%", height: "100%", opacity, mixBlendMode: "overlay", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)" }}
      />
    </AbsoluteFill>
  );
}

/** 白フラッシュ */
export function Flash({ at = 0, len = 8, color = "#fff", max = 0.85 }: { at?: number; len?: number; color?: string; max?: number }) {
  const frame = useCurrentFrame();
  const o = ip(frame, [at, at + 1, at + len], [0, max, 0], EASE.out);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
}

/** シネスコの帯が開く */
export function Letterbox({ openAt = 0, len = 24, bar = 140 }: { openAt?: number; len?: number; bar?: number }) {
  const frame = useCurrentFrame();
  const p = ip(frame, [openAt, openAt + len], [540, bar], EASE.inOut);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: p, background: C.ink }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: p, background: C.ink }} />
    </AbsoluteFill>
  );
}

/** 写真の上に敷く、文字を読ませるためのグラデーション */
export function Shade({ dir = "to top", strength = 0.75 }: { dir?: string; strength?: number }) {
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${dir}, rgba(8,9,8,${strength}) 0%, rgba(8,9,8,${strength * 0.35}) 45%, rgba(8,9,8,0) 75%)` }}
    />
  );
}
