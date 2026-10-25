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

test("every image has alt text, reserved dimensions and actually loads", async ({
  page,
}) => {
  for (const path of PAGES) {
    await page.goto(path);
    // Visible ones only: e.g. the phone mock-up is display:none on small screens.
    const images = page.locator("main img:visible");
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded(); // triggers loading="lazy"
      await expect(image).toHaveAttribute("alt", /.{10,}/);
      await expect(image).toHaveAttribute("width", /^\d+$/);
      await expect(image).toHaveAttribute("height", /^\d+$/);
      await expect
        .poll(() =>
          image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing animates and all content is visible", async ({ page }) => {
    for (const path of ["/", "/projets/portfolio", "/a-propos"]) {
      await page.goto(path);
      const animated = await page.evaluate(
        () =>
          [...document.querySelectorAll(".reveal, .motion-enter, .logo-mark-stroke")]
            .map((element) => getComputedStyle(element))
            .filter((style) => style.animationName !== "none" || style.opacity !== "1")
            .length,
      );
      expect(animated, `${path}: animated elements`).toBe(0);
    }
  });
});

test.describe("search engines", () => {
  for (const path of PAGES) {
    test(`${path} has a canonical URL matching og:url, and the site's structured data`, async ({
      page,
    }) => {
      await page.goto(path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      expect(canonical).toBeTruthy();
      expect(ogUrl).toBe(canonical);
      expect(new URL(canonical!).pathname.replace(/\/$/, "")).toBe(
        path === "/" ? "" : path,
      );

      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => JSON.parse(script.textContent ?? "")),
        );
      const graph = blocks.flatMap((block) => block["@graph"] ?? [block]);
      const person = graph.find((node) => node["@type"] === "Person");
      expect(person.name).toBe("Siavash Izadi");
      expect(person.alternateName).toContain("سیاوش ایزدی");
      expect(person.sameAs).toEqual(
        expect.arrayContaining([
          expect.stringContaining("github.com"),
          expect.stringContaining("linkedin.com"),
        ]),
      );
    });
  }

  test("the name is visible in both scripts on the profile page", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page).toHaveTitle(/Siavash Izadi \(سیاوش ایزدی\)/);
    const persian = page.locator('[lang="fa"]', { hasText: "سیاوش ایزدی" });
    await expect(persian).toBeVisible();
    await expect(persian).toHaveAttribute("dir", "rtl");
    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "")["@type"]),
      );
    expect(types).toContain("ProfilePage");
  });

  test("robots.txt keeps the API out of search results", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /api/");
  });
});

/**
 * Search engines get a blocking, non-streamed server render instead of the
 * prerendered shell. Google reported "Server error (5xx)" on the case study
 * once: that render needed files missing from the production image.
 */
test.describe("crawlers", () => {
  test.skip(({ isMobile }) => isMobile, "user agent test, once is enough");
  const CRAWLERS = {
    googlebot:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    inspectionTool:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0;)",
    bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  };

  for (const [name, userAgent] of Object.entries(CRAWLERS)) {
    test(`${name} gets every page with status 200 and its content`, async ({
      request,
    }) => {
      for (const path of PAGES) {
        const response = await request.get(path, {
          headers: { "user-agent": userAgent },
        });
        expect(response.status(), `${name} ${path}`).toBe(200);
        expect(await response.text()).toContain("Siavash Izadi");
      }
      const missing = await request.get("/projets/inexistant", {
        headers: { "user-agent": userAgent },
      });
      expect(missing.status()).toBe(404);
    });
  }
});
