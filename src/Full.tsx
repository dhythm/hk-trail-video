import { Series } from "remotion";
import { Logo } from "./Logo";
import { Main } from "./Main";
import { FPS } from "./theme";

export const MAIN_FRAMES = 300 * FPS;
export const LOGO_FRAMES = 6 * FPS;

/** 本編のあとにロゴを続けた公開用の通し版 */
export function Full() {
  return (
    <Series>
      <Series.Sequence durationInFrames={MAIN_FRAMES} name="本編">
        <Main />
      </Series.Sequence>
      <Series.Sequence durationInFrames={LOGO_FRAMES} name="ロゴ">
        <Logo />
      </Series.Sequence>
    </Series>
  );
}
