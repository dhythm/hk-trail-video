// usage: node scripts/stills.mjs <compId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [, , compId, outDir, ...frames] = process.argv;
if (!compId || !outDir || frames.length === 0) {
  console.error("usage: node scripts/stills.mjs <compId> <outDir> <frame...>");
  process.exit(1);
}
try {
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
  const composition = await selectComposition({ serveUrl, id: compId, timeoutInMilliseconds: 120000 });
  for (const f of frames) {
    await renderStill({
      composition, serveUrl, frame: Number(f), scale: 0.5,
      output: path.join(outDir, `f${String(f).padStart(5, "0")}.jpg`), imageFormat: "jpeg",
      timeoutInMilliseconds: 120000,
    });
    console.log("still", f);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
