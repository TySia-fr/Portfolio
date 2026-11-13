import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against an already running production server:
 * - in CI: the Docker image that will be deployed (http://127.0.0.1:3001)
 * - locally: `pnpm build && pnpm start`, then `pnpm test:e2e`
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

// Optional: point Playwright at an already installed Chromium
// (useful where `playwright install` cannot download browsers).
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/support/global-setup.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL,
    // A French browser: "/" redirects English-first browsers to /en (src/proxy.ts),
    // which e2e/i18n.spec.ts tests on purpose. Everywhere else, pages load as asked.
    locale: "fr-FR",
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
