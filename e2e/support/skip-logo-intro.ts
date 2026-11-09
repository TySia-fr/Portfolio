import type { Page } from "@playwright/test";

/**
 * Starts the test as a returning visitor, so the once-per-session logo intro
 * does not cover the page. The intro itself is tested in logo-intro.spec.ts.
 */
export async function skipLogoIntro({ page }: { page: Page }) {
  await page.addInitScript(() => sessionStorage.setItem("logo-played", "1"));
}
