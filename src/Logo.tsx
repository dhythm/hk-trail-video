import { useEffect, useRef, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * okady-work-logo.svg を、SVG 内の CSS アニメーションのまま 1 本のクリップにする。
 * アニメーションは再生させず、フレームごとに currentTime をシークして決定的に描画する。
 */
export function Logo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [svg, setSvg] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("load logo svg"));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(staticFile("logo/okady-work-logo.svg"))
      .then((r) => {
        if (!r.ok) throw new Error(`logo fetch failed: ${r.status}`);
        return r.text();
      })
      .then((t) => {
        setSvg(t.replace(/<\?xml[^>]*\?>/, ""));
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !svg) return;
    const t = (frame / fps) * 1000;
    for (const a of el.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = t;
    }
  }, [frame, fps, svg]);

  return (
    <AbsoluteFill style={{ background: "#d2ff1a", justifyContent: "center", alignItems: "center" }}>
      {svg ? (
        <div ref={ref} style={{ width: 1500, height: 480 }} dangerouslySetInnerHTML={{ __html: svg.replace(/width="1250" height="400"/, 'width="1500" height="480"') }} />
      ) : null}
    </AbsoluteFill>
  );
}
