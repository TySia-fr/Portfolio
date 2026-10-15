# syntax=docker/dockerfile:1
# Multi-stage build: dependencies and build tools never reach the final image.

ARG NODE_VERSION=22

# ---------- base: shared settings ----------
FROM node:${NODE_VERSION}-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- deps: install exactly what the lockfile says ----------
FROM base AS deps
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- builder: compile the app ----------
FROM base AS builder
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined into the bundle at build time.
ARG NEXT_PUBLIC_SITE_URL=https://portfolio.siavashizadi.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
# Commit shown on the site's spec sheet (.git is not in the build context).
ARG BUILD_COMMIT=""
ENV BUILD_COMMIT=${BUILD_COMMIT}
RUN pnpm build

# ---------- runner: the only stage that ships ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Unprivileged user. App files stay owned by root, so a compromised process
# cannot rewrite its own code.
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
    && mkdir -p .next/cache && chown nextjs:nodejs .next/cache

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000

# Uses Node's built-in fetch: no curl/wget needed in the image.
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["node", "server.js"]
