# ADR-0002 — Self-host on a VPS with Docker instead of Vercel

- Status: Accepted
- Date: 2026-10-15

## Context

The owner runs a hardened Hetzner VPS ("TySia") with Nginx and wants several projects
live under `siavashizadi.com`: the portfolio on the root domain, other projects on subdomains.

## Decision

- Build with `output: "standalone"` and ship a Docker image (Node 22).
- Nginx on the VPS terminates HTTPS (Let's Encrypt) and reverse-proxies
  `siavashizadi.com` (and redirects `www`) to the container on a localhost-only port.
  Future projects get their own subdomain and their own container.
- GitHub Actions builds, checks and deploys on every push to `main`.

## Alternatives considered

- **Vercel**: zero-ops and a global CDN, but hides exactly the skills we want to show
  (containers, reverse proxy, TLS, CI/CD), and in-memory rate limiting does not work on
  serverless instances.
- **PM2 without Docker**: simpler, but every project would share the host's Node version
  and dependencies; Docker isolates each subdomain project.

## Consequences

- ✅ Demonstrates real deployment and operations skills.
- ✅ One long-lived process makes simple in-memory rate limiting valid.
- ❌ We own uptime, OS patching, TLS renewal and backups.
- ❌ Single region (Helsinki), no CDN in front of static assets unless added later.
- ❌ RAM on the VPS limits how many apps can run side by side; measure before adding more.
