import { expect, test, type Page } from "@playwright/test";

const intro = (page: Page) => page.locator(".logo-intro");
const short = (page: Page) => page.locator(".logo-route");
const running = (page: Page) =>
  page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect instanceof KeyframeEffect &&
            animation.effect.target instanceof Element &&
            animation.effect.target.closest(".logo-intro, .logo-route"),
        ).length,
  );

test.describe("logo intro", () => {
  test("plays on the first load of a session, ends on the exact static logo, then never again", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(intro(page)).toBeVisible();
    expect(await running(page)).toBeGreaterThan(0);

    // The page underneath is fully rendered while the intro plays.
    await expect(page.locator("h1")).toHaveCount(1);

    // When it ends, the layer is gone and the mark is the plain logo.
    await expect(intro(page)).toBeHidden({ timeout: 6000 });
    const finalState = await page.evaluate(() => {
      const style = (selector: string) =>
        getComputedStyle(document.querySelector(`.logo-intro ${selector}`)!);
      return {
        s: style(".animated-logo-s").strokeDashoffset,
        stem: style(".animated-logo-stem").strokeDashoffset,
        dot: style(".animated-logo-dot").opacity,
      };
    });
    expect(finalState).toEqual({ s: "0px", stem: "0px", dot: "1" });

    // Later pages of the session get the short trace only, never the full intro.
    await page.reload();
    await expect(intro(page), "reload in the same session").toBeHidden();
    await expect(short(page)).toBeVisible();
    await expect(short(page)).toBeHidden({ timeout: 3000 });
  });

  test("every page change replays the short trace, also client-side", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Escape"); // skip the full intro
    await expect(intro(page)).toBeHidden();

    await page.locator('a[href="/projets"]:visible').first().click();
    await expect(page).toHaveURL(/\/projets$/);
    await expect(short(page)).toBeVisible();
    await expect(short(page)).toBeHidden({ timeout: 3000 });

    await page.goBack();
    await expect(short(page)).toBeVisible();
  });

  test("any interaction skips it at once", async ({ page }) => {
    await page.goto("/");
    await expect(intro(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(intro(page)).toBeHidden({ timeout: 200 });
  });

  test("stays out of the accessibility tree and blocks nothing for screen readers", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(intro(page)).toHaveAttribute("aria-hidden", "true");
    await expect(
      page.getByRole("link", { name: /siavash izadi/i }).first(),
    ).toBeAttached();
  });

  test("hydrates without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("logo intro with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("never appears", async ({ page }) => {
    await page.goto("/");
    await expect(intro(page)).toBeHidden();
    await page.reload();
    await expect(short(page)).toBeHidden();
    expect(await running(page)).toBe(0);
  });
});
