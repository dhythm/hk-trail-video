import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ip } from "../lib/anim";
import { C, EASE, JP, MONO } from "../theme";

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

/** 画面下部の素材表記（本人撮影・出典・イメージ） */
export type TagKind = "user" | "ext" | "illust" | "chara" | "diagram";

const TAG_LABEL: Record<TagKind, string> = {
  user: "PHOTO",
  ext: "PHOTO",
  illust: "ILLUST",
  chara: "GUIDE",
  diagram: "DIAGRAM",
};

export function Tag({ kind, text, delay = 6, dark = false }: { kind: TagKind; text: string; delay?: number; dark?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = ip(frame, [delay, delay + 14], [0, 1]);
  const outP = ip(frame, [durationInFrames - 8, durationInFrames], [1, 0], EASE.in);
  const fg = dark ? C.ink : C.paper;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 64,
        display: "flex",
        alignItems: "stretch",
        opacity: Math.min(inP, outP),
        translate: `${(1 - inP) * -30}px 0`,
        clipPath: `inset(0 ${(1 - inP) * 100}% 0 0)`,
      }}
    >
      <div
        style={{
          background: kind === "ext" ? C.gold : C.red,
          color: kind === "ext" ? C.ink : C.paper,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "0.12em",
          padding: "8px 14px",
        }}
      >
        {TAG_LABEL[kind]}
      </div>
      <div
        style={{
          background: dark ? "rgba(242,237,227,0.85)" : "rgba(12,13,11,0.62)",
          backdropFilter: "blur(6px)",
          color: fg,
          fontFamily: JP,
          fontWeight: 500,
          fontSize: 22,
          padding: "8px 16px",
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
        }}
      >
        {text}
      </div>
    </div>
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
