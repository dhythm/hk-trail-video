import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { At } from "./components/At";
import { Grain } from "./components/basics";
import { PanelWipe } from "./components/graphics";
import { SECTIONS } from "./data";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Overview } from "./scenes/Overview";
import { S1, S2, S3, S4, S5, S6, S7, S8 } from "./scenes/Sections";
import { C, sec } from "./theme";

// 構成（秒）：R_02 の時間配分に合わせ、すべて 96BPM の小節頭（2.5秒刻み）に揃えている
const TIMELINE = [
  { s: 0, d: 20, name: "Intro", El: Intro },
  { s: 20, d: 20, name: "Overview", El: Overview },
  { s: 40, d: 30, name: "S1", El: S1 },
  { s: 70, d: 25, name: "S2", El: S2 },
  { s: 95, d: 25, name: "S3", El: S3 },
  { s: 120, d: 25, name: "S4", El: S4 },
  { s: 145, d: 35, name: "S5", El: S5 },
  { s: 180, d: 30, name: "S6", El: S6 },
  { s: 210, d: 25, name: "S7", El: S7 },
  { s: 235, d: 45, name: "S8", El: S8 },
  { s: 280, d: 20, name: "Outro", El: Outro },
];

const WIPE_LEN = 28;

export function Main() {
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {TIMELINE.map(({ s, d, name, El }) => (
        <At key={name} s={s} d={d} name={name}>
          <El />
        </At>
      ))}
      {TIMELINE.slice(2).map(({ s, name }, i) => {
        const accent = SECTIONS[i]?.accent ?? C.red;
        return (
          <Sequence key={`wipe-${name}`} from={sec(s) - 14} durationInFrames={WIPE_LEN + 6} name={`Wipe ${name}`} style={{ zIndex: 100 }}>
            <PanelWipe colors={[C.ink, accent]} len={WIPE_LEN} dir={i % 2 === 0 ? 1 : -1} />
          </Sequence>
        );
      })}
      <Grain />
      <Audio src={staticFile("audio/bgm.wav")} />
    </AbsoluteFill>
  );
}
