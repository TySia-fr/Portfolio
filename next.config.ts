import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every route.
 * A Content-Security-Policy is intentionally NOT set yet: with Next.js it needs
 * per-request nonces to stay strict, and is planned for the security phase.
 */
const securityHeaders = [
  // Forbid other sites from embedding us in an <iframe> (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from guessing content types (MIME sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin, never full URLs, to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We use none of these powerful browser features.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Force HTTPS for 2 years. Only honoured by browsers over HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (ADR-0002).
  output: "standalone",
  // Do not advertise the framework in an `X-Powered-By` header.
  poweredByHeader: false,
  reactStrictMode: true,

  cacheComponents: true,
  partialPrefetching: true,

  // Build metadata, inlined at build time and shown on the site's spec sheet.
  // GITHUB_SHA is set by GitHub Actions; BUILD_COMMIT is passed into Docker builds.
  env: {
    BUILD_COMMIT: process.env.BUILD_COMMIT || process.env.GITHUB_SHA || "local",
    BUILD_TIME: new Date().toISOString(),
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
