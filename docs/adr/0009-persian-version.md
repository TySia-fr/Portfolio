# ADR-0009 — Persian version under /fa (right to left)

- Status: Accepted
- Date: 2026-11-16
- Extends: ADR-0008

## Context

The owner wants the site in Persian too, with right-to-left text that is exact, tidy and
readable. ADR-0008 already made a language a set of content modules plus a root layout.
Persian adds what French and English never needed: a right-to-left layout, a script the
site's typefaces do not cover, and its own typographic rules.

## Decision

- **URLs and layout.** `/fa/…` with the same ASCII slugs as English (`/fa/projects`,
  `/fa/about`…). A third root layout, `app/(fa)`, renders `<html lang="fa" dir="rtl">`.
- **Logical CSS.** Spacing and positions use logical utilities (`ps`/`pe`, `ms`/`me`,
  `start`/`end`, `border-s`), so one stylesheet serves both directions. What stays
  physical (diagram rails, arrows, transform origins) is mirrored under `[dir="rtl"]`.
  Arrows (`→`, `←`) mirror; the logo, code, URLs and phone numbers stay left to right.
- **Typeface.** Vazirmatn (OFL), Arabic subset, self-hosted. It comes first in the Persian
  font stacks but its `unicode-range` covers only Persian letters, the space and the
  zero-width non-joiner; a second file covers Latin punctuation only. Latin letters and
  digits therefore keep Geist and Martian Mono, and Persian words are not spread apart by
  Martian Mono's fixed-width space. Code blocks keep Martian Mono entirely.
- **Typography.** No letter-spacing on Persian pages (it breaks the joins between letters);
  more line height for Persian text, less in print so the résumé stays on one page.
- **Spelling.** Persian ی and ک (never Arabic ي ك), Persian punctuation (، ؛ ؟ « »), the
  zero-width non-joiner wherever Persian spelling needs it (می‌سازم، پروژه‌ها). A test fails
  on Arabic look-alikes and on a Latin comma or question mark after a Persian letter.
- **Numbers.** Persian digits in prose and in numbers the site formats (years, dates,
  through `Intl` with `fa-IR`, which also gives the Persian calendar for dates). Latin
  digits where the number is an identifier: versions, commit SHAs, URLs, IP addresses,
  the phone number, code.
- **Redirect.** `/` redirects to `/fa` only when the visitor chose Persian with the
  switcher (cookie). No redirect from `Accept-Language: fa`: many Persian speakers who
  look for a developer in France browse in French or English, and a wrong guess is worse
  than one click.
- **Social image.** The image renderer (Satori) neither joins nor reorders Persian letters,
  so the Persian page's preview image uses the English text; its alt text is Persian.

## Consequences

- ✅ Every page exists in three languages, checked by `e2e/i18n.spec.ts`, including no
  sideways scrolling at 320, 390 and 820 px in Persian.
- ✅ Persian résumé page and one-page PDF.
- ❌ The case-study screenshots show the French site (their alt text says so).
- ❌ Translations are maintained by hand in three files per module.
