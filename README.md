# siavashizadi.com

Personal portfolio of **Siavash Izadi**, full-stack JavaScript developer based in France.
French-language site, built as a production-grade project rather than a template.

> **Live at [siavashizadi.com](https://siavashizadi.com)** — deployed automatically on every push to `main`.
> See [`docs/requirements.md`](docs/requirements.md) for the v1 scope.

## Stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Server Components, Cache Components)  |
| Language  | TypeScript (`strict` + `noUncheckedIndexedAccess`)            |
| Styling   | Tailwind CSS v4                                               |
| Tooling   | pnpm, ESLint (zero warnings), Prettier                        |
| Testing   | Playwright end-to-end (desktop + mobile) + axe accessibility  |
| CI        | GitHub Actions — lint, format, types, build, E2E on the image |
| Hosting   | Docker on a self-managed Hetzner VPS, Nginx, Let's Encrypt    |

## Architecture decisions

Every non-obvious choice is recorded with its trade-offs:

- [ADR-0001](docs/adr/0001-typed-content-no-database.md) — typed content, no database
- [ADR-0002](docs/adr/0002-self-host-on-vps-with-docker.md) — self-host with Docker instead of Vercel
- [ADR-0003](docs/adr/0003-french-first-i18n-ready.md) — French-first, ready for English
- [ADR-0004](docs/adr/0004-pnpm-and-pinned-toolchain.md) — pnpm and pinned toolchain
- [ADR-0005](docs/adr/0005-dark-only-visual-identity.md) — dark-only visual identity
- [ADR-0006](docs/adr/0006-content-security-policy.md) — static CSP, inline scripts allowed

## Getting started

Requirements: Node.js 22 and Corepack.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

## Scripts

| Command         | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| `pnpm dev`      | Development server                                         |
| `pnpm check`    | Lint + format check + type check (run before pushing)      |
| `pnpm build`    | Production build (`.next/standalone`)                      |
| `pnpm start`    | Run the production build locally                           |
| `pnpm test:e2e` | End-to-end tests against a running server (`E2E_BASE_URL`) |
| `pnpm format`   | Format all files with Prettier                             |

## Deployment

```
git push → CI: lint · format · types · build
         → Docker image → smoke test with the production compose file
         → publish to GHCR (tag = commit SHA)
         → SSH forced command on the VPS → deploy.sh <SHA>
         → pull · start · wait for health · roll back if unhealthy
```

- **Runtime hardening** ([`deploy/compose.yaml`](deploy/compose.yaml)): non-root user,
  read-only root filesystem, all Linux capabilities dropped, `no-new-privileges`,
  memory/CPU/PID limits, port bound to `127.0.0.1` only.
- **Least-privilege deploy key**: the CI key can only run [`deploy.sh`](deploy/deploy.sh),
  which accepts nothing but a 40-character commit SHA.
- **Edge**: Nginx terminates TLS (Let's Encrypt) and enforces a request-size limit
  ([`deploy/nginx`](deploy/nginx)).

## Known limitations

- The Content-Security-Policy allows inline scripts: nonces would force per-request
  rendering of every page ([ADR-0006](docs/adr/0006-content-security-policy.md)).
- No contact form yet: the contact page links to e-mail and GitHub; a server-validated
  form (Zod, rate limit, honeypot) is planned.
- Single VPS, single region, no CDN: a server outage takes the site down.
