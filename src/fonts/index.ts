import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

/**
 * Martian Mono (SIL Open Font License, see MartianMono-OFL.txt).
 * Variable on two axes: weight (100–800) and width (75–112.5%).
 * The width axis is what lets headings run condensed while labels stay normal.
 * The file is vendored so builds never depend on a font CDN.
 */
export const martianMono = localFont({
  src: "./MartianMono-latin.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 112.5%" }],
});

export const geistSans = GeistSans;
