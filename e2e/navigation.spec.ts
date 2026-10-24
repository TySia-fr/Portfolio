import { expect, test } from "@playwright/test";

test("first Tab focuses the skip link, which moves focus to the content", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "keyboard focus order is checked in Chromium");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#contenu$/);
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("header links navigate and mark the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await nav.getByRole("link", { name: "Projets" }).click();
    await expect(page).toHaveURL(/\/projets$/);
    await expect(nav.getByRole("link", { name: "Projets" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("project card opens the case study", async ({ page }) => {
    await page.goto("/projets");
    await page.getByRole("link", { name: "Ce portfolio" }).click();
    await expect(page).toHaveURL(/\/projets\/portfolio$/);
    // Next.js keeps the previous page mounted but hidden (React <Activity>),
    // so query the *visible* heading through the accessibility tree.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ce portfolio");
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("opens, closes with Escape and returns focus to the button", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Ouvrir le menu" });
    await button.click();

    const toggle = page.getByRole("button", { name: "Fermer le menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(menu.getByRole("link", { name: "À propos" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
    await expect(menu.getByRole("link", { name: "À propos" })).toBeHidden();
  });

  test("closes after navigating", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Contact", exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("page never scrolls horizontally", async ({ page }) => {
    for (const path of ["/", "/projets/portfolio", "/a-propos", "/contact"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });
});
