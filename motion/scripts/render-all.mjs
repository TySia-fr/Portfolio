// Renders every format: MP4 (H.264, CRF 18) and transparent WebM (VP9 + alpha).
// Set REMOTION_BROWSER=/path/to/chrome to use an installed Chrome instead of
// letting Remotion download its own headless shell.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const outDir = "out";
mkdirSync(outDir, { recursive: true });

const browser = process.env.REMOTION_BROWSER
  ? ["--browser-executable", process.env.REMOTION_BROWSER]
  : [];
const only = process.argv.slice(2);

const jobs = [
  ["LogoReveal", "logo-reveal-16x9"],
  ["LogoSquare", "logo-reveal-1x1"],
  ["LogoVertical", "logo-reveal-9x16"],
].filter(([id]) => only.length === 0 || only.includes(id));

const run = (args) =>
  execFileSync("pnpm", ["exec", "remotion", ...args, ...browser], { stdio: "inherit" });

for (const [id, name] of jobs) {
  run([
    "render",
    id,
    `${outDir}/${name}.mp4`,
    "--codec=h264",
    "--crf=18",
    "--pixel-format=yuv420p",
  ]);
  run([
    "render",
    id,
    `${outDir}/${name}-alpha.webm`,
    "--codec=vp9",
    "--pixel-format=yuva420p",
    "--image-format=png",
    '--props={"transparent":true}',
  ]);
}
