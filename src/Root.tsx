import { Composition } from "remotion";
import { Logo } from "./Logo";
import { Main } from "./Main";
import { FPS, H, W } from "./theme";

export function RemotionRoot() {
  return (
    <>
      <Composition id="HongKongTrail" component={Main} durationInFrames={300 * FPS} fps={FPS} width={W} height={H} />
      <Composition id="OkadyLogo" component={Logo} durationInFrames={6 * FPS} fps={FPS} width={W} height={H} />
    </>
  );
}
