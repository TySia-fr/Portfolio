import { type APIRequestContext, expect, test } from "@playwright/test";

import { skipLogoIntro } from "./support/skip-logo-intro";

test.beforeEach(skipLogoIntro);

/** Every French page and its English counterpart (src/i18n/routes.ts). */
const PAIRS = [
  ["/", "/en"],
  ["/projets", "/en/projects"],
  ["/projets/nexora", "/en/projects/nexora"],
  ["/projets/portfolio", "/en/projects/portfolio"],
  ["/projets/applyflow", "/en/projects/applyflow"],
  ["/alternance", "/en/open-to-roles"],
  ["/cv", "/en/cv"],
  ["/a-propos", "/en/about"],
  ["/contact", "/en/contact"],
  ["/mentions-legales", "/en/legal"],
] as const;

test.describe("every French page has its English counterpart", () => {
  test("the sitemap holds both languages and nothing unpaired", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]!).pathname,
    );
    const known = PAIRS.flat();
    for (const path of locs) expect(known, `${path} is paired`).toContain(path);
    for (const path of known) expect(locs, `${path} in sitemap`).toContain(path);
    expect(xml).toContain('hreflang="en-US"');
    expect(xml).toContain('hreflang="x-default"');
  });

  for (const [fr, en] of PAIRS) {
    test(`${fr} ⇄ ${en}: hreflang links point at each other`, async ({ page }) => {
      for (const path of [fr, en]) {
        const response = await page.goto(path);
        expect(response?.status(), path).toBe(200);
        const hreflang = async (lang: string) =>
          new URL(
            (await page
              .locator(`link[rel="alternate"][hreflang="${lang}"]`)
              .getAttribute("href"))!,
          ).pathname.replace(/(.)\/$/, "$1");
        expect(await hreflang("fr-FR")).toBe(fr);
        expect(await hreflang("en-US")).toBe(en);
        expect(await hreflang("x-default")).toBe(fr);
      }
    });
  }
});

test.describe("language switcher", () => {
  test("goes to the same page in the other language and back", async ({ page }) => {
    await page.goto("/projets/nexora");
    await page.getByRole("link", { name: /^EN/ }).click();
    await expect(page).toHaveURL(/\/en\/projects\/nexora$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("NEXORA");

    await page.getByRole("link", { name: /^FR/ }).click();
    await expect(page).toHaveURL(/\/projets\/nexora$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });

  test("the choice is remembered over the browser language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);

    await page.getByRole("link", { name: /^FR/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await context.close();
  });
});

test.describe("home page redirect", () => {
  const get = (request: APIRequestContext, headers: Record<string, string>) =>
    request.get("/", { headers, maxRedirects: 0 });

  test("English-first browsers go to /en, temporarily", async ({ request }) => {
    const response = await get(request, { "accept-language": "en-US,en;q=0.9" });
    expect(response.status()).toBe(307);
    expect(new URL(response.headers()["location"]!, "http://x").pathname).toBe("/en");
    expect(response.headers()["vary"]).toMatch(/Accept-Language/i);
  });

  test("French or French-first browsers stay on /", async ({ request }) => {
    for (const lang of [
      "fr-FR,fr;q=0.9",
      "fr-FR,fr;q=0.9,en;q=0.8",
      "en;q=0.5,fr;q=0.9",
      "",
    ]) {
      expect((await get(request, { "accept-language": lang })).status(), lang).toBe(200);
    }
  });

  test("no redirect for crawlers and link previews", async ({ request }) => {
    for (const userAgent of [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    ]) {
      const response = await get(request, {
        "accept-language": "en-US",
        "user-agent": userAgent,
      });
      expect(response.status(), userAgent).toBe(200);
    }
  });

  test("the cookie set by the switcher wins", async ({ request }) => {
    expect(
      (await get(request, { "accept-language": "en-US", cookie: "lang=fr" })).status(),
    ).toBe(200);
    expect(
      (await get(request, { "accept-language": "fr-FR", cookie: "lang=en" })).status(),
    ).toBe(307);
  });

  test("only the home page redirects", async ({ request }) => {
    const response = await request.get("/projets", {
      headers: { "accept-language": "en-US" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
  });
});

test("the English résumé PDF is served and linked", async ({ page, request }) => {
  await page.goto("/en/cv");
  const href = await page
    .getByRole("link", { name: /Download the résumé/ })
    .getAttribute("href");
  expect(href).toBe("/cv/Siavash-Izadi-CV-en.pdf");
  const pdf = await request.get(href!);
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the English pages say nothing about an alternance", async ({ request }) => {
  for (const [, en] of PAIRS) {
    const html = (await (await request.get(en)).text()).toLowerCase();
    expect(html, en).not.toContain("alternance en informatique");
    expect(html, en).not.toContain("apprenticeship");
  }
});
