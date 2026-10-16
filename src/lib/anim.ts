import { interpolate } from "remotion";
import { EASE } from "../theme";

type EasingFn = (t: number) => number;

/** clamp 付き interpolate の短縮形 */
export function ip(
  frame: number,
  input: [number, number] | number[],
  output: [number, number] | number[],
  easing: EasingFn = EASE.out,
): number {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

/** 決定的な擬似乱数（シード → 0..1） */
export function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** 減衰するカメラシェイク（start から len フレーム） */
export function shake(frame: number, start: number, len: number, amp: number): { x: number; y: number } {
  const t = frame - start;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const k = (1 - t / len) ** 2 * amp;
  return { x: (rand(t * 3.1 + start) - 0.5) * 2 * k, y: (rand(t * 7.7 + start) - 0.5) * 2 * k };
}
