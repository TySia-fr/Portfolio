/* eslint-disable no-console -- CLI script: printing what it wrote is its output. */
/**
 * Prints the CV pages of a running production build to PDF (A4, print styles
 * from globals.css): /cv → public/cv/Siavash-Izadi-CV.pdf and
 * /en/cv → public/cv/Siavash-Izadi-CV-en.pdf.
 *
 * Usage: pnpm build && pnpm start, then in another terminal: pnpm cv:pdf
 * Regenerate and commit the PDFs together with any change to the CV content
 * (src/content/cv.ts, src/content/en/cv.ts). Fails if a CV no longer fits on
 * one page.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const CVS = [
  { path: "/cv", file: "Siavash-Izadi-CV.pdf" },
  { path: "/en/cv", file: "Siavash-Izadi-CV-en.pdf" },
];

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
await mkdir(join(process.cwd(), "public/cv"), { recursive: true });
let failed = false;

for (const cv of CVS) {
  const page = await browser.newPage();
  const response = await page.goto(`${BASE_URL}${cv.path}`, { waitUntil: "networkidle" });
  if (response?.status() !== 200)
    throw new Error(`${cv.path} answered ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });

  const pdf = Buffer.from(
    await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }),
  );
  await page.close();
  const out = join(process.cwd(), "public/cv", cv.file);
  await writeFile(out, pdf);

  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`${out}  ${(pdf.length / 1024).toFixed(0)} KB, ${pages} page(s)`);
  if (pages !== 1) {
    console.error(`${cv.path}: the CV must fit on one page.`);
    failed = true;
  }
}

await browser.close();
if (failed) process.exit(1);
