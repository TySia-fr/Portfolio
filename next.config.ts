import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy (ADR-0006).
 *
 * Everything is limited to this origin. The one compromise is
 * script-src 'unsafe-inline': the App Router inlines the page's RSC payload in
 * <script> tags, and the strict alternatives do not fit a prerendered site:
 * nonces force every page to render per request (incompatible with partial
 * prerendering), and experimental SRI only covers external files.
 * The site renders no user-supplied content, so there is no injection point
 * for that inline allowance to protect against today.
 *
 * Styles are strict: no inline <style> or style="" attributes anywhere.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // The dev overlay injects styles; production does not.
  `style-src 'self'${isDev ? " 'unsafe-inline'" : ""}`,
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** Security headers applied to every route. Nginx adds none of its own. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Isolate the browsing context from cross-origin windows it opens or is opened by.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Legacy twin of frame-ancestors 'none' for old browsers (clickjacking).
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
