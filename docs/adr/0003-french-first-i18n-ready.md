# ADR-0003 — French-first, ready for English

- Status: Accepted
- Date: 2026-10-15

## Context

The owner lives in France and targets French clients first, but also EU and US roles.

## Decision

- Ship v1 in French only, with `<html lang="fr">`.
- No i18n library in v1.
- All user-facing copy lives in `src/content/` and is imported by components.
  Components never contain hard-coded sentences.

## Consequences

- ✅ No routing or library complexity before it is needed.
- ✅ Adding `/en` later means adding a second content dictionary, not rewriting components.
- ❌ English-only recruiters will not read the site until `/en` exists — accepted risk for v1.
