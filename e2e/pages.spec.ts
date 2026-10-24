import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Every public page. The sitemap test below checks this list stays complete. */
const PAGES = [
  "/",
  "/projets",
  "/projets/portfolio",
  "/a-propos",
  "/contact",
  "/mentions-legales",
];

test.describe("public pages", () => {
  for (const path of PAGES) {
    test(`${path} renders correctly`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", "fr");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Siavash Izadi/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.{40,}/,
      );
      await expect(page.locator("main#contenu")).toBeVisible();

      expect(consoleErrors, "no errors in the browser console").toEqual([]);
    });

    test(`${path} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );
      expect(serious.map((violation) => `${violation.id}: ${violation.help}`)).toEqual(
        [],
      );
    });
  }
});

test("no internal link is broken", async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
    hrefs.forEach((href) => links.add(href.split("#")[0] || "/"));
  }

  for (const link of links) {
    const response = await request.get(link);
    expect(response.status(), `${link} should load`).toBe(200);
  }
});

test("sitemap lists every public page", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const path of PAGES) {
    expect(xml).toContain(`${path === "/" ? "" : path}</loc>`);
  }
});

test("robots.txt allows indexing and points to the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Allow: /");
  expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
});

test("social preview image is a PNG", async ({ request }) => {
  const response = await request.get("/opengraph-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("security headers are sent", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test.describe("not found", () => {
  test("unknown route returns 404 with the French page", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Cette page n’existe pas.");
  });

  test("unknown project is not indexable", async ({ page }) => {
    await page.goto("/projets/projet-inexistant");
    await expect(page.locator("h1")).toHaveText("Cette page n’existe pas.");
    // Known limitation (README): status 200, but search engines are told to skip it.
    const noindex = page.locator('meta[name="robots"][content*="noindex"]');
    expect(await noindex.count()).toBeGreaterThan(0);
  });
});

test("contact page offers a working e-mail link", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute(
    "href",
    /^mailto:[^@\s]+@[^@\s]+\.[a-z]+$/,
  );
});
