# ADR-0001 — Typed content in the repository, no database

- Status: Accepted
- Date: 2026-10-15

## Context

The site shows a small number of projects and pages. Only the owner edits content.
The contact form needs to deliver messages, not store them.

## Decision

- Project and page content live in typed TypeScript files under `src/content/`,
  validated with Zod at build time.
- Contact messages are sent by email through a provider and are **not persisted**.
- No PostgreSQL, no ORM, no CMS in v1.

## Consequences

- ✅ Zero database to secure, back up, migrate or pay for.
- ✅ Content changes are reviewed and versioned through Git like code.
- ✅ Pages can be fully prerendered (fast, cheap to host).
- ✅ Not storing contact messages minimises GDPR obligations (no retention policy to enforce on a DB).
- ❌ Editing content requires a commit and a deploy.
- ❌ If the email provider is down, a message fails visibly instead of being queued.

## Revisit when

An admin UI, user accounts, or any feature that needs writes at runtime is required.
Database skills will be demonstrated in a dedicated SaaS project, not forced into this one.
