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

/**
 * Vazirmatn (SIL Open Font License, see Vazirmatn-OFL.txt), Arabic-script
 * subset only, for the Persian pages. It comes first in the Persian stacks
 * (globals.css) but only for Persian letters, digits, punctuation and the
 * space (unicode-range): the space must be Vazirmatn's, or Martian Mono's
 * wide space spreads Persian words apart. Latin letters fall through to
 * Geist / Martian Mono, so code and product names keep the site's fonts.
 */
export const vazirmatn = localFont({
  src: "./Vazirmatn-arabic.woff2",
  variable: "--font-vazir",
  weight: "100 900",
  display: "swap",
  // No metric-adjusted Arial fallback: it would catch Latin letters first.
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0020, U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200F, U+FB50-FDFF, U+FE70-FEFF",
    },
  ],
});

/**
 * Vazirmatn's Latin punctuation only (. : ! ? ( ) « » …), for Persian pages:
 * a full stop after a Persian word must not be Martian Mono's fixed-width
 * one, which leaves a gap. Letters and digits are not in its range.
 */
export const vazirmatnPunctuation = localFont({
  src: "./Vazirmatn-latin.woff2",
  variable: "--font-vazir-punct",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0021-002F, U+003A-0040, U+00AB, U+00BB, U+2026" },
  ],
});
