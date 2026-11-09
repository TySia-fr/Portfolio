// Fails if the logo animation in globals.css no longer follows the logo's
// geometry: the signal's keyframes must sit on the S's vertices, at their share
// of the path length. Run by `pnpm check`. (Node strips the TypeScript types.)
import { readFileSync } from "node:fs";

import {
  logoGeometry,
  pathVertices,
  polylineLength,
} from "../src/components/brand/logo-geometry.ts";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const keyframes = css.match(/@keyframes logo-signal\s*{([\s\S]*?)\n}/)?.[1];
if (!keyframes) throw new Error("@keyframes logo-signal not found in globals.css");

// Where the S finishes drawing: the signal must reach the S's end at that same moment.
const sEnd = Number(
  css.match(
    /@keyframes logo-s\s*{[\s\S]*?([\d.]+)%,\s*100%\s*{\s*stroke-dashoffset: 0;/,
  )?.[1],
);
if (!Number.isFinite(sEnd))
  throw new Error("Could not read where @keyframes logo-s ends");
const points = pathVertices(logoGeometry.s);
const total = polylineLength(points);

let travelled = 0;
const problems = [];
points.forEach(([x, y], index) => {
  if (index > 0) {
    const [px, py] = points[index - 1];
    travelled += Math.hypot(x - px, y - py);
  }
  const percent = Number(((travelled / total) * sEnd).toFixed(2));
  const block = new RegExp(
    `${String(percent).replace(".", "\\.")}%[^{]*{[^}]*translate\\(${x}px, ${y}px\\)`,
  );
  if (!block.test(keyframes))
    problems.push(`expected ${percent}% at translate(${x}px, ${y}px)`);
});

const [dotX, dotY] = [
  logoGeometry.dot.x + logoGeometry.dot.size / 2,
  logoGeometry.dot.y + logoGeometry.dot.size / 2,
];
if (!new RegExp(`100%\\s*{[^}]*translate\\(${dotX}px, ${dotY}px\\)`).test(keyframes)) {
  problems.push(
    `expected the signal to end on the dot at translate(${dotX}px, ${dotY}px)`,
  );
}

if (problems.length > 0) {
  console.error(
    `logo animation is out of sync with logo-geometry.ts:\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.warn(
  `logo keyframes match the geometry (${points.length} vertices, ${total} units)`,
);
