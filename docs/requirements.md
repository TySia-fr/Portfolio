# Requirements — portfolio.siavashizadi.com

Status: **v1 (MVP)** — agreed 2026-10-15

## Purpose

A professional portfolio for Siavash Izadi, a full-stack JavaScript developer based in France.
It is the entry point to every live project hosted on `*.siavashizadi.com`.

Primary audiences, in order:

1. Recruiters and tech leads (France, EU, remote US) evaluating a junior full-stack profile.
2. Future freelance clients (France first).

## Hard rules

- **No invented content.** No fake projects, clients, testimonials, statistics or experience.
  Anything not yet real is marked as a placeholder or "En cours".
- **French-first.** UI and content ship in French. All copy lives in content files, never
  hard-coded in components, so English can be added without a rewrite (ADR-0003).
- Repository documentation (README, ADRs) is in **English**: the audience reading code is international.

## MVP scope

| Area | In v1 | Notes |
|---|---|---|
| Home | ✅ | Hero, selected projects, skills by category, about preview, contact CTA |
| Projets (list) | ✅ | Data-driven grid, tech tags, empty / "en cours" state |
| Projet (detail) | ✅ | One dynamic route rendered from typed content |
| À propos | ✅ | Factual journey, learning focus, goals |
| Contact | ✅ | Validated form, server-side Zod, honeypot, rate limit, email provider |
| Mentions légales / Confidentialité | ✅ | Legally expected in France; privacy notice for the form |
| SEO basics | ✅ | Metadata, OG, sitemap, robots |
| Database | ❌ | Not justified — see ADR-0001 |
| Auth / admin | ❌ | No privileged operations exist yet |
| English version | ❌ | Prepared for, not built |

## Non-functional requirements

- TypeScript `strict` + extra safety flags; no `any` without a written reason.
- Server Components by default; client JS only for real interactivity.
- Accessible: semantic landmarks, keyboard navigation, visible focus, reduced motion.
- Secure: server-side validation, security headers, no secrets in client bundles, no PII in logs.
- CI on every push: lint, format check, type check, production build. Tests added from Phase 5.
- Deployed by CI to the TySia VPS behind Nginx with HTTPS (ADR-0002).

## Definition of done (v1)

Live at `https://portfolio.siavashizadi.com`, CI green, contact form proven end-to-end,
README explains architecture, known limitations listed.
