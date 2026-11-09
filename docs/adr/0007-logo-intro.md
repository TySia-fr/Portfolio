# ADR-0007 — Logo intro: once per session, short trace on every page

- Status: Accepted
- Date: 2026-11-09

## Context

The owner wanted the logo animation as the site's preloader, then on every page.
A classic preloader hides the page until it has "loaded": on a static, prerendered
site there is nothing to wait for, so it only delays content. A recruiter opening
five pages would also wait five times.

## Decision

- **First visit of a browser session:** a full-screen intro (3.6 s). The signal
  traces the "si" monogram, the name comes into focus, the layer fades out.
- **Every later page (reloads and client-side navigations):** the mark alone,
  traced in 0.65 s, then a 0.25 s fade.
- The layer is drawn **over** the page, never instead of it: the page is parsed,
  rendered and painted as usual underneath. It is `aria-hidden`, so screen readers
  read the page straight away.
- Any click, key, scroll or touch skips it at once.
- `prefers-reduced-motion: reduce` → never shown.
- CSS only for the animation (transform, opacity, filter: no layout work). Two tiny
  scripts: an inline one parsed before the header (session memory, skip on input),
  and a client component that replays the short trace when the path changes.

## Consequences

- ✅ Lighthouse (5 alternating runs, median, home page): performance 96 → 96,
  accessibility and best practices 100 → 100, CLS 0 → 0. Observed FCP/LCP in the
  browser 176 ms → 175 ms. Lighthouse's simulated FCP shows +150 ms: a modelling
  artifact of the overlay, not a measured delay.
- ✅ No hydration warnings, no layout shift, works without JavaScript (the intro
  then plays on each load and still fades out by itself).
- ❌ Every page change costs 0.9 s of motion for visitors who do not interact;
  skipping is instant. If analytics ever show visitors leaving during it, remove
  `LogoRouteReplay` and keep the once-per-session intro only.
- ❌ The intro's letter timings assume the 13-character name `siavash izadi`
  (one CSS rule per letter, and `13ch` for the slide).
