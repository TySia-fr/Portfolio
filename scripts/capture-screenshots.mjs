/* eslint-disable no-console -- CLI script: printing what it wrote is its output. */
/**
 * Captures real screenshots of the running site for the case study and writes
 * them, optimised, to public/images/projects/portfolio/.
 *
 * Usage (against a production build, never the dev server):
 *   pnpm build && pnpm start          # in one terminal
 *   pnpm screenshots                  # in another (BASE_URL to override)
 *
 * Reduced motion is forced so no screenshot catches an animation half-way.
 * Output: <name>-<width>.webp for each width. Commit the files with the change
 * that made them, and update width/height in the project content if they move.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const OUT_DIR = join(process.cwd(), "public/images/projects/portfolio");

const shots = [
  {
    name: "home-desktop",
    path: "/",
    viewport: { width: 1440, height: 900 },
    widths: [960, 1600],
  },
  {
    name: "home-mobile",
    path: "/",
    viewport: { width: 390, height: 844 },
    widths: [390, 780],
    mobile: true,
  },
  {
    name: "projects-desktop",
    path: "/projets",
    viewport: { width: 1440, height: 900 },
    widths: [960, 1600],
  },
  {
    name: "contact-desktop",
    path: "/contact",
    viewport: { width: 1440, height: 900 },
    widths: [960, 1600],
  },
];

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    isMobile: Boolean(shot.mobile),
    hasTouch: Boolean(shot.mobile),
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const response = await page.goto(BASE_URL + shot.path, { waitUntil: "networkidle" });
  if (response?.status() !== 200)
    throw new Error(`${shot.path} answered ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);

  const png = await page.screenshot({ type: "png" }); // the viewport only, like a first visit
  for (const width of shot.widths) {
    const file = join(OUT_DIR, `${shot.name}-${width}.webp`);
    const info = await sharp(png).resize({ width }).webp({ quality: 78 }).toFile(file);
    console.log(
      `${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
    );
  }
  await context.close();
}

await browser.close();
