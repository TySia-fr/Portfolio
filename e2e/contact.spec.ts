import { randomUUID } from "node:crypto";

import { expect, type APIRequestContext, test } from "@playwright/test";

import { FAILURE_MARKER } from "./support/mock-email-provider";

/**
 * Contact form and POST /api/contact.
 *
 * Two modes:
 * - default (CI on the Docker image): no e-mail provider is configured, so a
 *   valid message must be refused honestly with 503, never "sent".
 * - E2E_MAIL_MOCK_PORT set: the app talks to a local mock provider, so success
 *   and provider failures can be tested end to end.
 */
const MOCK_PORT = Number(process.env.E2E_MAIL_MOCK_PORT) || 0;
const withProvider = MOCK_PORT > 0;

const VALID = {
  name: "Camille Test",
  email: "camille@example.com",
  message: "Bonjour, je souhaite discuter d’un projet d’application web.",
};

/** Each test gets its own client IP, so rate limits never leak between tests. */
function clientIp() {
  return `203.0.113.${Math.floor(Math.random() * 250) + 1}-${randomUUID().slice(0, 8)}`;
}

async function post(
  request: APIRequestContext,
  baseURL: string,
  body: unknown,
  {
    ip = clientIp(),
    headers = {},
  }: { ip?: string; headers?: Record<string, string> } = {},
) {
  return request.post("/api/contact", {
    headers: {
      origin: baseURL,
      "content-type": "application/json",
      "x-real-ip": ip,
      ...headers,
    },
    // Raw strings are sent byte for byte (Playwright would JSON-encode them).
    data: typeof body === "string" ? Buffer.from(body) : JSON.stringify(body),
  });
}

test.describe("POST /api/contact", () => {
  // API behaviour does not depend on the device: run it once.
  test.skip(({ isMobile }) => isMobile, "API tests run on desktop only");

  test("refuses requests without a same-site Origin", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "content-type": "application/json", "x-real-ip": clientIp() },
      data: JSON.stringify(VALID),
    });
    expect(response.status()).toBe(403);

    const crossSite = await request.post("/api/contact", {
      headers: {
        origin: "https://evil.example",
        "content-type": "application/json",
        "x-real-ip": clientIp(),
      },
      data: JSON.stringify(VALID),
    });
    expect(crossSite.status()).toBe(403);
  });

  test("accepts JSON only", async ({ request, baseURL }) => {
    const response = await post(request, baseURL!, "name=a&email=b", {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    expect(response.status()).toBe(415);
  });

  test("rejects oversized payloads", async ({ request, baseURL }) => {
    const response = await post(request, baseURL!, {
      ...VALID,
      message: "x".repeat(40_000),
    });
    expect(response.status()).toBe(413);
    expect(await response.json()).toEqual({ ok: false, error: "too_large" });
  });

  test("rejects malformed JSON", async ({ request, baseURL }) => {
    const response = await post(request, baseURL!, "{ not json");
    expect(response.status()).toBe(400);
  });

  test("validates every field on the server", async ({ request, baseURL }) => {
    const response = await post(request, baseURL!, {
      name: " ",
      email: "pas-une-adresse",
      message: "trop court",
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("invalid");
    expect(Object.keys(body.fields).sort()).toEqual(["email", "message", "name"]);
  });

  test("rejects control characters and multi-line names", async ({
    request,
    baseURL,
  }) => {
    const response = await post(request, baseURL!, {
      ...VALID,
      name: "Camille\r\nBcc: victim@example.com",
    });
    expect(response.status()).toBe(422);
    expect((await response.json()).fields.name).toBeTruthy();
  });

  test("limits repeated requests from the same client", async ({ request, baseURL }) => {
    const ip = clientIp();
    // Invalid bodies still count: the limit protects the server, not only the mailbox.
    const invalid = { ...VALID, message: "court" };
    for (let i = 0; i < 5; i++) {
      expect((await post(request, baseURL!, invalid, { ip })).status()).toBe(422);
    }
    const blocked = await post(request, baseURL!, invalid, { ip });
    expect(blocked.status()).toBe(429);
    expect(Number(blocked.headers()["retry-after"])).toBeGreaterThan(0);

    // Another client is not affected.
    expect((await post(request, baseURL!, invalid)).status()).toBe(422);
  });

  test("silently drops messages that fill the honeypot", async ({ request, baseURL }) => {
    const response = await post(request, baseURL!, {
      ...VALID,
      site_web: "https://spam.example",
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    if (withProvider) {
      const last = await (await request.get(`http://127.0.0.1:${MOCK_PORT}/last`)).json();
      expect(JSON.stringify(last ?? {})).not.toContain("spam.example");
    }
  });

  test("never claims success when no provider is configured", async ({
    request,
    baseURL,
  }) => {
    test.skip(withProvider, "only meaningful without an e-mail provider");
    const response = await post(request, baseURL!, VALID);
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: "unavailable" });
  });

  test("delivers a valid message as plain text with reply-to", async ({
    request,
    baseURL,
  }) => {
    test.skip(!withProvider, "needs the mock e-mail provider");
    const message = `${VALID.message} <b>pas du HTML</b> ${randomUUID()}`;
    const response = await post(request, baseURL!, { ...VALID, message });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const last = await (await request.get(`http://127.0.0.1:${MOCK_PORT}/last`)).json();
    expect(last.reply_to).toBe(VALID.email);
    expect(last.text).toContain(message);
    expect(last.html).toBeUndefined();
    expect(last.subject).toContain(VALID.name);
  });

  test("reports provider failures as failures", async ({ request, baseURL }) => {
    test.skip(!withProvider, "needs the mock e-mail provider");
    const response = await post(request, baseURL!, {
      ...VALID,
      message: `${VALID.message} ${FAILURE_MARKER}`,
    });
    expect(response.status()).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: "delivery_failed" });
  });
});

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-real-ip": clientIp() });
    await page.goto("/contact");
  });

  test("shows field errors without calling the server", async ({ page }) => {
    let called = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/contact")) called = true;
    });

    await page.getByRole("button", { name: "Envoyer le message" }).click();

    const name = page.getByRole("textbox", { name: "Nom" });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByRole("textbox", { name: "E-mail" }),
    ).toHaveAccessibleDescription(/Adresse e-mail invalide/);
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Certains champs sont à corriger",
    );
    expect(called).toBe(false);
  });

  test("the honeypot is unreachable by keyboard and hidden from assistive tech", async ({
    page,
  }) => {
    const honeypot = page.locator('input[name="site_web"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(page.getByRole("textbox", { name: /Ne pas remplir/ })).toHaveCount(0);
  });

  test("tells the truth when the message cannot be sent", async ({ page }) => {
    test.skip(withProvider, "only meaningful without an e-mail provider");
    await page.getByRole("textbox", { name: "Nom" }).fill(VALID.name);
    await page.getByRole("textbox", { name: "E-mail" }).fill(VALID.email);
    await page.getByRole("textbox", { name: "Message" }).fill(VALID.message);
    await page.getByRole("button", { name: "Envoyer le message" }).click();

    const alert = page.locator("form").getByRole("alert");
    await expect(alert).toContainText("n’a pas été envoyé");
    await expect(
      alert.getByRole("link", { name: "contact@siavashizadi.com" }),
    ).toBeVisible();
    await expect(page.getByText("Message envoyé.")).toHaveCount(0);
    // What the visitor typed is kept, so nothing is lost.
    await expect(page.getByRole("textbox", { name: "Message" })).toHaveValue(
      VALID.message,
    );
  });

  test("sends a message and confirms it", async ({ page }) => {
    test.skip(!withProvider, "needs the mock e-mail provider");
    await page.getByRole("textbox", { name: "Nom" }).fill(VALID.name);
    await page.getByRole("textbox", { name: "E-mail" }).fill(VALID.email);
    await page.getByRole("textbox", { name: "Message" }).fill(VALID.message);
    await page.getByRole("button", { name: "Envoyer le message" }).click();

    const status = page.getByRole("status").filter({ hasText: "Message envoyé." });
    await expect(status).toBeVisible();
    await expect(status).toBeFocused();
  });

  test("shows a failure when the provider fails", async ({ page }) => {
    test.skip(!withProvider, "needs the mock e-mail provider");
    await page.getByRole("textbox", { name: "Nom" }).fill(VALID.name);
    await page.getByRole("textbox", { name: "E-mail" }).fill(VALID.email);
    await page
      .getByRole("textbox", { name: "Message" })
      .fill(`${VALID.message} ${FAILURE_MARKER}`);
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "n’a pas pu être envoyé",
    );
  });
});
