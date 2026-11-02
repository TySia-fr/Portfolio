/* eslint-disable no-console -- CLI script: printing what it wrote is its output. */
/**
 * Prints the /cv page of a running production build to
 * public/cv/Siavash-Izadi-CV.pdf (A4, print styles from globals.css).
 *
 * Usage: pnpm build && pnpm start, then in another terminal: pnpm cv:pdf
 * Regenerate and commit the PDF together with any change to src/content/cv.ts.
 * Fails if the CV no longer fits on one page.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const OUT = join(process.cwd(), "public/cv/Siavash-Izadi-CV.pdf");

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage();
const response = await page.goto(`${BASE_URL}/cv`, { waitUntil: "networkidle" });
if (response?.status() !== 200) throw new Error(`/cv answered ${response?.status()}`);
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print", reducedMotion: "reduce" });

await mkdir(join(process.cwd(), "public/cv"), { recursive: true });
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

const titled = Buffer.from(pdf);
await writeFile(OUT, titled);

const pages = (titled.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`${OUT}  ${(titled.length / 1024).toFixed(0)} KB, ${pages} page(s)`);
if (pages !== 1) {
  console.error("The CV must fit on one page.");
  process.exit(1);
}
