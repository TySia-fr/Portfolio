# ADR-0004 — pnpm and a pinned toolchain

- Status: Accepted
- Date: 2026-10-15

## Decision

- Package manager: **pnpm**, version pinned in `package.json#packageManager`.
- Node.js **22 LTS**, pinned in `.nvmrc` and `package.json#engines`, same version in CI and Docker.
- `pnpm-lock.yaml` is committed; CI installs with `--frozen-lockfile`.

## Why

- pnpm's strict `node_modules` layout prevents importing packages that are not declared
  dependencies ("phantom dependencies") — a common source of "works on my machine".
- Pinning Node and the lockfile makes local, CI and production builds identical.

## Consequences

- Contributors need Corepack enabled (`corepack enable`) to get the right pnpm version.
