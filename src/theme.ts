import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** 秒 → フレーム */
export function sec(s: number): number {
  return Math.round(s * FPS);
}

export const ANTON = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
export const JP = '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "PingFang TC", sans-serif';
export const SERIF = '"Hiragino Mincho ProN", "Songti TC", serif';

export const C = {
  ink: "#0c0d0b",
  ink2: "#16181a",
  paper: "#f2ede3",
  red: "#e2342b",
  redDeep: "#a3191a",
  gold: "#f2b53a",
  jade: "#1f6b4f",
  forest: "#0f2a1f",
  teal: "#13616a",
  sea: "#1557a0",
  stone: "#3b3a36",
} as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.7, 0, 0.2, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  soft: Easing.bezier(0.4, 0, 0.2, 1),
} as const;
