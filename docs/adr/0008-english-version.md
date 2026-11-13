# ADR-0008 — English version under /en

- Status: Accepted
- Date: 2026-11-13
- Supersedes: ADR-0003

## Context

The site was French only (ADR-0003). The owner now also looks for developer roles outside
France (full-time, freelance, remote), so recruiters who do not read French must be able
to read it. ADR-0003 kept all copy in `src/content/`, which made this a content task
more than a rewrite.

## Decision

- **URLs.** French stays at the root with its existing URLs (nothing indexed breaks).
  English lives under `/en`, with English words (`/en/projects`, `/en/about`…).
  One table, `src/i18n/routes.ts`, maps every page to its counterpart.
- **Two root layouts**, `app/(fr)` and `app/(en)`, so `<html lang>` is correct in the
  prerendered HTML without reading the request (pages stay static). Unmatched URLs use
  `app/global-not-found.tsx` (experimental flag in Next.js 16), which speaks both languages.
- **No i18n library.** Each French content module has an English twin in
  `src/content/en/`, type-checked against the French shape (`Widen<T>`): a missing key
  fails the build. Pages are shared views in `src/views/` that take a `locale`.
- **Projects** exist in both languages; the build fails if the two disagree on slug,
  status, links, year or stack.
- **Different audience, not just different words.** The French alternance page has an
  English counterpart, "open to roles", with the same structure.
- **SEO.** `hreflang` (fr-FR, en-US, x-default → French) on every page and in the sitemap.
- **Redirect of `/`, at the owner's request.** `src/proxy.ts` sends a browser that prefers
  English over French from `/` to `/en`, with a 307. It never redirects crawlers or link
  previews, never any other URL, and never against the `lang` cookie that the FR/EN
  switcher sets. The response varies on `Accept-Language, Cookie`.

## Consequences

- ✅ Every French page has an English page, checked by `e2e/i18n.spec.ts`.
- ✅ Content stays typed and validated; no runtime i18n cost.
- ❌ One functional cookie now exists (language choice): stated on both legal pages.
- ❌ Switching language is a full page load (different root layouts). Acceptable: it is rare.
- ❌ `globalNotFound` is experimental: re-check on every Next.js upgrade (a test covers it).
- ❌ The portfolio screenshots show the French site; their alt text says so.
