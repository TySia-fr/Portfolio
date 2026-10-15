# ADR-0005 — Dark-only visual identity

- Status: Accepted
- Date: 2026-10-15

## Context

The owner chose a "technical, dark, engineering tool" direction. Supporting a light
theme means every colour decision is made twice and tested twice.

## Decision

- One dark theme, declared with `color-scheme: dark`.
- All colours are tokens in `src/app/globals.css` (`@theme`), used through Tailwind
  utilities. No raw hex values in components.
- A single accent colour ("signal", amber) reserved for actions, links and focus.
  A second semantic colour ("live", green) is used only to report a real "ok" status.
- Typography: Martian Mono (variable width) for headings, labels and data;
  Geist Sans for running text. Both are vendored, no font CDN.
- Contrast ratios are checked against WCAG AA and recorded next to the tokens.

## Consequences

- ✅ Half the visual QA; a consistent identity.
- ✅ Adding a light theme later = redefining the same tokens under a selector.
- ❌ Visitors who prefer light mode do not get it.
