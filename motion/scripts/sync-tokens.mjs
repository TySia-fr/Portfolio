// Copies the website's design tokens and brand font into this workspace, so the
// videos can never drift from the site: src/app/globals.css stays the single
// source of truth. Runs before `studio` and `render`; its output is committed so
// the project also opens without running it.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..", "..");
const css = readFileSync(join(site, "src/app/globals.css"), "utf8");

const theme = css.match(/@theme\s*{([\s\S]*?)\n}/)?.[1];
if (!theme) throw new Error("No @theme block found in src/app/globals.css");

const read = (name) => {
  const value = theme.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`Token --${name} is missing from @theme`);
  return value;
};

const ms = (value) => {
  const match = value.match(/^(\d+(?:\.\d+)?)ms$/);
  if (!match) throw new Error(`Expected a duration in ms, got "${value}"`);
  return Number(match[1]);
};

const bezier = read("ease-out").match(/cubic-bezier\(([^)]+)\)/)?.[1];
if (!bezier) throw new Error("--ease-out must be a cubic-bezier()");

const tokens = {
  color: {
    ink: read("color-ink"),
    text: read("color-text"),
    muted: read("color-muted"),
    signal: read("color-signal"),
  },
  easeOut: bezier.split(",").map((n) => Number(n.trim())),
  duration: {
    fast: ms(read("duration-fast")),
    base: ms(read("duration-base")),
    slow: ms(read("duration-slow")),
  },
};

writeFileSync(
  join(here, "../src/tokens.generated.json"),
  `${JSON.stringify(tokens, null, 2)}\n`,
);

mkdirSync(join(here, "../public"), { recursive: true });
copyFileSync(
  join(site, "src/fonts/MartianMono-latin.woff2"),
  join(here, "../public/MartianMono-latin.woff2"),
);

console.warn("tokens synced from src/app/globals.css");
