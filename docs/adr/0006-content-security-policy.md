# ADR-0006 — A static Content-Security-Policy, with inline scripts allowed

- Status: Accepted
- Date: 2026-10-24

## Context

The site had no Content-Security-Policy. Pages are prerendered at build time
(Cache Components / partial prerendering, ADR-0001). The App Router inlines each
page's React Server Components payload in about fifteen `<script>` tags, whose
content differs per page and per build.

## Decision

Send one static policy from `next.config.ts` on every route:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'none'; form-action 'self'; frame-ancestors 'none'
```

- Everything loads from this origin only: no third-party script, style, font,
  image or connection is possible, so injected code could not exfiltrate data
  to another host with `fetch`, nor load a remote script.
- **Styles are strict**: no inline `<style>`, no `style=""` attributes. This is
  a rule for the codebase, checked by the end-to-end tests.
- **Inline scripts are allowed** (`'unsafe-inline'`). This is the compromise.
- No `'unsafe-eval'` in production.

## Alternatives considered

- **Nonces via the proxy** (the strict option documented by Next.js): every
  page must then render per request, and the documentation states that partial
  prerendering is incompatible with nonces. It would mean turning off Cache
  Components and server-rendering every page for a site whose content changes
  only on deploy.
- **Hashes** (`experimental.sri`): adds `integrity` to external script files, but
  does not cover the inline payload scripts. Computing per-page hashes of the
  prerendered HTML ourselves would depend on Next.js build internals.
- **Report-only first**: considered, but a report-only policy without a report
  endpoint only logs to visitors' consoles. The end-to-end suite instead visits
  every page and fails on any `securitypolicyviolation` event, before deploy.

## Consequences

- An HTML-injection bug could still run inline script. Today the site renders
  no user-supplied content (the contact form never echoes input back), so there
  is no such injection point.
- **Revisit** when the site renders user content, adds authentication, or when
  Next.js supports hashes for inline scripts on prerendered pages.
