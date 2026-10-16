import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash, Letterbox, Photo, Shade, Tag, TagKind } from "../components/basics";
import { Chara } from "../components/chara";
import { RiseText } from "../components/text";
import { CharaId } from "../charaMeta";
import { CREDIT } from "../data";
import { ip } from "../lib/anim";
import { ANTON, C, EASE, JP, MONO } from "../theme";

/** 写真＋キネティックな見出し。pos で文字の置き場を決める */
export function PhotoScene({
  src,
  kind,
  credit,
  text,
  sub,
  kicker,
  pos = "bl",
  size = 110,
  scale = [1.14, 1.02],
  x = [0, 0],
  y = [0, 0],
  letterbox = false,
  flash = false,
  textDelay = 8,
  fadeIn = 0,
  filter = "saturate(1.08) contrast(1.04)",
  origin,
  children,
}: {
  src: string;
  kind: TagKind;
  credit: string;
  text?: string;
  sub?: string;
  kicker?: string;
  pos?: "bl" | "br" | "c" | "tl";
  size?: number;
  scale?: [number, number];
  x?: [number, number];
  y?: [number, number];
  letterbox?: boolean;
  flash?: boolean;
  textDelay?: number;
  fadeIn?: number;
  filter?: string;
  origin?: string;
  children?: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const align = pos === "br" ? "flex-end" : pos === "c" ? "center" : "flex-start";
  const justify = pos === "c" ? "center" : pos === "tl" ? "flex-start" : "flex-end";
  const exitAt = d - 14;
  return (
    <AbsoluteFill style={{ background: C.ink, opacity: fadeIn ? ip(frame, [0, fadeIn], [0, 1], EASE.soft) : 1 }}>
      <Photo src={src} scale={scale} x={x} y={y} filter={filter} origin={origin} />
      {text ? <Shade dir={pos === "tl" ? "to bottom" : pos === "c" ? "to top" : "to top"} strength={pos === "c" ? 0.6 : 0.78} /> : null}
      {pos === "c" && text ? <AbsoluteFill style={{ background: "rgba(8,9,8,0.25)" }} /> : null}
      {children}
      {text ? (
        <AbsoluteFill style={{ padding: "150px 140px 170px", justifyContent: justify, alignItems: align, gap: 18 }}>
          {kicker ? (
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: "0.3em",
                color: C.paper,
                opacity: ip(frame, [textDelay - 4, textDelay + 8], [0, 1]) * (1 - ip(frame, [exitAt, exitAt + 8], [0, 1])),
                borderLeft: `6px solid ${C.red}`,
                paddingLeft: 16,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <RiseText text={text} size={size} delay={textDelay} exitAt={exitAt} align={pos === "br" ? "right" : pos === "c" ? "center" : "left"} />
          {sub ? (
            <div
              style={{
                fontFamily: JP,
                fontWeight: 500,
                fontSize: 34,
                color: C.paper,
                textAlign: pos === "br" ? "right" : pos === "c" ? "center" : "left",
                opacity: ip(frame, [textDelay + 18, textDelay + 32], [0, 0.92]) * (1 - ip(frame, [exitAt, exitAt + 8], [0, 1])),
                translate: `0 ${ip(frame, [textDelay + 18, textDelay + 32], [20, 0])}px`,
                textShadow: "0 2px 18px rgba(0,0,0,0.5)",
              }}
            >
              {sub}
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
      {letterbox ? <Letterbox openAt={0} len={26} bar={0} /> : null}
      {flash ? <Flash at={0} len={8} max={0.6} /> : null}
      <Tag kind={kind} text={credit} delay={12} />
    </AbsoluteFill>
  );
}

/** キャラクター＋背景グラフィック＋巨大ワード */
export function CharaScene({
  id,
  bg,
  word,
  wordColor = "rgba(242,237,227,0.9)",
  text,
  textSide = "left",
  height = 1150,
  cx = 1240,
  bottom = 1120,
  children,
}: {
  id: CharaId;
  bg: React.ReactNode;
  word?: string;
  wordColor?: string;
  text?: string;
  textSide?: "left" | "right";
  height?: number;
  cx?: number;
  bottom?: number;
  children?: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const wIn = ip(frame, [0, 18], [0, 1], EASE.out);
  const drift = ip(frame, [0, d], [40, -40], EASE.soft);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bg}
      {word ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 470,
              lineHeight: 0.85,
              color: "transparent",
              WebkitTextStroke: `4px ${wordColor}`,
              whiteSpace: "nowrap",
              letterSpacing: `${(1 - wIn) * 0.3}em`,
              opacity: wIn,
              translate: `${drift}px 0`,
            }}
          >
            {word}
          </div>
        </AbsoluteFill>
      ) : null}
      {children}
      <Chara id={id} height={height} cx={cx} bottom={bottom} />
      {text ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: textSide === "left" ? "flex-start" : "flex-end",
            padding: "0 140px",
          }}
        >
          <RiseText text={text} size={96} delay={14} exitAt={d - 14} align={textSide} />
        </AbsoluteFill>
      ) : null}
      <Tag kind="chara" text={CREDIT.chara} delay={20} />
    </AbsoluteFill>
  );
}

/** 2枚の写真を斜めに分割して並べる */
export function SplitScene({
  left,
  right,
  leftCredit,
  rightCredit,
  leftKind,
  rightKind,
  leftWord,
  rightWord,
  text,
}: {
  left: string;
  right: string;
  leftCredit: string;
  rightCredit: string;
  leftKind: TagKind;
  rightKind: TagKind;
  leftWord: string;
  rightWord: string;
  text: string;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const open = ip(frame, [0, 20], [0, 1], EASE.inOut);
  const lx = 50 - open * 2;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ clipPath: `polygon(0 0, ${lx + 6}% 0, ${lx - 6}% 100%, 0 100%)` }}>
        <Photo src={left} scale={[1.2, 1.05]} x={[60, 0]} filter="brightness(0.8)" />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${lx + 8}% 0, 100% 0, 100% 100%, ${lx - 4}% 100%)` }}>
        <Photo src={right} scale={[1.2, 1.05]} x={[-60, 0]} filter="brightness(0.8)" />
      </AbsoluteFill>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: "130px 120px" }}>
        {[leftWord, rightWord].map((w, i) => (
          <div
            key={w}
            style={{
              fontFamily: ANTON,
              fontSize: 230,
              lineHeight: 0.85,
              color: C.paper,
              translate: `0 ${ip(frame, [6 + i * 6, 24 + i * 6], [-260, 0], EASE.out)}px`,
              textShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            {w}
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 85,
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: ANTON,
            fontSize: 90,
            color: C.paper,
            scale: String(ip(frame, [16, 30], [0, 1], EASE.back)),
            rotate: `${ip(frame, [16, 40], [-180, 0])}deg`,
          }}
        >
          ⇄
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 190 }}>
        <RiseText text={text} size={100} delay={24} exitAt={d - 14} align="center" />
      </AbsoluteFill>
      <SideCredit side="left" kind={leftKind} text={leftCredit} />
      <SideCredit side="right" kind={rightKind} text={rightCredit} />
    </AbsoluteFill>
  );
}

function SideCredit({ side, kind, text }: { side: "left" | "right"; kind: TagKind; text: string }) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        [side]: 80,
        maxWidth: 820,
        display: "flex",
        gap: 0,
        opacity: ip(frame, [14, 26], [0, 1]),
      }}
    >
      <div style={{ background: kind === "ext" ? C.gold : C.red, color: kind === "ext" ? C.ink : C.paper, fontFamily: MONO, fontWeight: 700, fontSize: 18, padding: "7px 12px", letterSpacing: "0.12em" }}>PHOTO</div>
      <div style={{ background: "rgba(12,13,11,0.62)", color: C.paper, fontFamily: JP, fontWeight: 500, fontSize: 18, padding: "7px 14px" }}>{text}</div>
    </div>
  );
}

/** 単語を中央に叩きつける（タイポだけの見せ場） */
export function WordSlam({ words, bg = C.ink, color = C.paper, accent = C.red, children }: { words: { jp: string; en: string }[]; bg?: string; color?: string; accent?: string; children?: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const per = Math.floor(d / words.length);
  const i = Math.min(words.length - 1, Math.floor(frame / per));
  const lf = frame - i * per;
  const p = ip(lf, [0, 8], [0, 1], EASE.out);
  const w = words[i];
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {children}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            fontFamily: JP,
            fontWeight: 900,
            fontSize: 380,
            lineHeight: 1,
            color,
            scale: String(1.8 - 0.8 * p),
            filter: `blur(${(1 - p) * 16}px)`,
            opacity: p,
            letterSpacing: "0.04em",
          }}
        >
          {w.jp}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: ip(lf, [6, 14], [0, 1]) }}>
          <div style={{ width: ip(lf, [6, 20], [0, 120]), height: 4, background: accent }} />
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: "0.4em", color }}>{w.en}</div>
          <div style={{ width: ip(lf, [6, 20], [0, 120]), height: 4, background: accent }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 80, top: 130, fontFamily: ANTON, fontSize: 60, color: accent }}>
        {String(i + 1).padStart(2, "0")}/{String(words.length).padStart(2, "0")}
      </div>
      <Flash at={i * per} len={6} max={0.35} />
    </AbsoluteFill>
  );
}
