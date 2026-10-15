# portfolio.siavashizadi.com

Personal portfolio of **Siavash Izadi**, full-stack JavaScript developer based in France.
French-language site, built as a production-grade project rather than a template.

> Status: **work in progress** — foundation in place, pages under construction.
> See [`docs/requirements.md`](docs/requirements.md) for the v1 scope.

## Stack

| Layer     | Choice                                                       |
| --------- | ------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Server Components, Cache Components) |
| Language  | TypeScript (`strict` + `noUncheckedIndexedAccess`)           |
| Styling   | Tailwind CSS v4                                              |
| Tooling   | pnpm, ESLint (zero warnings), Prettier                       |
| CI        | GitHub Actions — lint, format, types, production build       |
| Hosting   | Docker on a self-managed VPS behind Nginx (planned)          |

## Architecture decisions

Every non-obvious choice is recorded with its trade-offs:

- [ADR-0001](docs/adr/0001-typed-content-no-database.md) — typed content, no database
- [ADR-0002](docs/adr/0002-self-host-on-vps-with-docker.md) — self-host with Docker instead of Vercel
- [ADR-0003](docs/adr/0003-french-first-i18n-ready.md) — French-first, ready for English
- [ADR-0004](docs/adr/0004-pnpm-and-pinned-toolchain.md) — pnpm and pinned toolchain

## Getting started

Requirements: Node.js 22 and Corepack.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

## Scripts

| Command       | What it does                                          |
| ------------- | ----------------------------------------------------- |
| `pnpm dev`    | Development server                                    |
| `pnpm check`  | Lint + format check + type check (run before pushing) |
| `pnpm build`  | Production build (`.next/standalone`)                 |
| `pnpm format` | Format all files with Prettier                        |

## Known limitations

- No Content-Security-Policy yet (needs nonce support; planned for the security phase).
- No automated tests yet (added with the contact form).
- Not deployed yet.
