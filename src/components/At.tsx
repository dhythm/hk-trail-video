import React from "react";
import { Sequence } from "remotion";
import { sec } from "../theme";

/** 秒指定の Sequence（s: 開始秒, d: 長さ秒） */
export function At({ s, d, children, z, name }: { s: number; d: number; children: React.ReactNode; z?: number; name?: string }) {
  return (
    <Sequence from={sec(s)} durationInFrames={sec(d)} name={name} style={z === undefined ? undefined : { zIndex: z }}>
      {children}
    </Sequence>
  );
}
