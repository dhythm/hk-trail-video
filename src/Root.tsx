import { Composition } from "remotion";
import { Full, LOGO_FRAMES, MAIN_FRAMES } from "./Full";
import { Logo } from "./Logo";
import { Main } from "./Main";
import { FPS, H, W } from "./theme";

export function RemotionRoot() {
  return (
    <>
      <Composition id="HongKongTrailFull" component={Full} durationInFrames={MAIN_FRAMES + LOGO_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="HongKongTrail" component={Main} durationInFrames={MAIN_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="OkadyLogo" component={Logo} durationInFrames={LOGO_FRAMES} fps={FPS} width={W} height={H} />
    </>
  );
}
