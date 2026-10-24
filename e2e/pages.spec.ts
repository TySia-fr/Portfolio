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
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toContain("unsafe-eval");
  expect(csp).toMatch(/style-src 'self'(;|$)/);
});

test("the content security policy blocks nothing the site needs", async ({ page }) => {
  await page.addInitScript(() => {
    const store = window as unknown as { __cspViolations: string[] };
    store.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      store.__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  const violations: string[] = [];
  for (const path of [...PAGES, "/projets/inexistant"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    violations.push(
      ...(await page.evaluate(
        () => (window as unknown as { __cspViolations: string[] }).__cspViolations,
      )),
    );
  }
  expect(violations).toEqual([]);
});

test.describe("not found", () => {
  test("unknown route returns 404 with the French page", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Cette page n’existe pas.");
  });

  // A slug never requested before is the case that used to return 200: the
  // partially prerendered shell streamed before notFound() could run.
  test("unknown project returns 404 on the very first request", async ({ request }) => {
    const slug = `inexistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const first = await request.get(`/projets/${slug}`);
    expect(first.status()).toBe(404);
    expect(await first.text()).toContain("Cette page n’existe pas.");
    const second = await request.get(`/projets/${slug}`);
    expect(second.status()).toBe(404);
  });

  test("unknown project shows the French 404 page", async ({ page }) => {
    const response = await page.goto("/projets/projet-inexistant");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Cette page n’existe pas.",
    );
  });

  test("slugs are case-sensitive and extra segments are rejected", async ({
    request,
  }) => {
    expect((await request.get("/projets/PORTFOLIO")).status()).toBe(404);
    expect((await request.get("/projets/portfolio/extra")).status()).toBe(404);
    expect((await request.get("/projets/portfolio")).status()).toBe(200);
  });
});

test("contact page offers a working e-mail link", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute(
    "href",
    /^mailto:[^@\s]+@[^@\s]+\.[a-z]+$/,
  );
});
