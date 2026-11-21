import { type APIRequestContext, expect, test } from "@playwright/test";

import { skipLogoIntro } from "./support/skip-logo-intro";

test.beforeEach(skipLogoIntro);

/** Every page in its three languages (src/i18n/routes.ts): French, English, Persian. */
const TRIPLES = [
  ["/", "/en", "/fa"],
  ["/projets", "/en/projects", "/fa/projects"],
  ["/projets/nexora", "/en/projects/nexora", "/fa/projects/nexora"],
  ["/projets/portfolio", "/en/projects/portfolio", "/fa/projects/portfolio"],
  ["/projets/applyflow", "/en/projects/applyflow", "/fa/projects/applyflow"],
  ["/projets/prix-au-metre", "/en/projects/prix-au-metre", "/fa/projects/prix-au-metre"],
  ["/alternance", "/en/open-to-roles", "/fa/open-to-roles"],
  ["/cv", "/en/cv", "/fa/cv"],
  ["/a-propos", "/en/about", "/fa/about"],
  ["/contact", "/en/contact", "/fa/contact"],
  ["/mentions-legales", "/en/legal", "/fa/legal"],
] as const;
const PAIRS = TRIPLES.map(([fr, en]) => [fr, en] as const);

test.describe("every page exists in French, English and Persian", () => {
  test("the sitemap holds the three languages and nothing unpaired", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]!).pathname,
    );
    const known: string[] = TRIPLES.flat();
    for (const path of locs) expect(known, `${path} is paired`).toContain(path);
    for (const path of known) expect(locs, `${path} in sitemap`).toContain(path);
    expect(xml).toContain('hreflang="en-US"');
    expect(xml).toContain('hreflang="fa-IR"');
    expect(xml).toContain('hreflang="x-default"');
  });

  for (const [fr, en, fa] of TRIPLES) {
    test(`${fr} ⇄ ${en} ⇄ ${fa}: hreflang links point at each other`, async ({
      page,
    }) => {
      for (const path of [fr, en, fa]) {
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
        expect(await hreflang("fa-IR")).toBe(fa);
        expect(await hreflang("x-default")).toBe(fr);
      }
    });
  }
});

test.describe("Persian pages read right to left", () => {
  for (const width of [320, 390, 820]) {
    test(`no sideways scrolling at ${width} px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      for (const [, , fa] of TRIPLES) {
        await page.goto(fa);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${fa} at ${width}px`).toBeLessThanOrEqual(0);
      }
      await context.close();
    });
  }

  test("Persian text uses Persian letters, punctuation and no Arabic look-alikes", async ({
    request,
  }) => {
    for (const [, , fa] of TRIPLES) {
      const html = await (await request.get(fa)).text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, " ");
      // Arabic yeh and kaf instead of the Persian ی and ک.
      expect(text, fa).not.toMatch(/[\u064A\u0643]/);
      // A Latin comma or question mark right after a Persian letter.
      expect(text, fa).not.toMatch(/[\u0600-\u06FF][,?;]/);
    }
  });
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

  test("Persian is one tap away and right to left", async ({ page }) => {
    await page.goto("/projets/nexora");
    await page.getByRole("link", { name: /^FA/ }).click();
    await expect(page).toHaveURL(/\/fa\/projects\/nexora$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
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

  test("Persian only on an explicit choice", async ({ request }) => {
    const chosen = await get(request, { "accept-language": "fr-FR", cookie: "lang=fa" });
    expect(chosen.status()).toBe(307);
    expect(new URL(chosen.headers()["location"]!, "http://x").pathname).toBe("/fa");
    // A Persian browser without a choice is not redirected (ADR-0009).
    expect((await get(request, { "accept-language": "fa-IR,fa;q=0.9" })).status()).toBe(
      200,
    );
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

test("the Persian résumé PDF is served and linked", async ({ page, request }) => {
  await page.goto("/fa/cv");
  const href = await page
    .getByRole("link", { name: /دانلود رزومه/ })
    .getAttribute("href");
  expect(href).toBe("/cv/Siavash-Izadi-CV-fa.pdf");
  const pdf = await request.get(href!);
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});
