import "server-only";

import type { ContactSubmission } from "./schema";

/**
 * Sends a contact submission by e-mail through Resend's HTTP API
 * (https://resend.com/docs/api-reference/emails/send-email). Plain fetch, no SDK:
 * one request, no extra dependency.
 *
 * Configuration (server-side environment only, never NEXT_PUBLIC_*):
 *   RESEND_API_KEY        API key with "sending access" only
 *   CONTACT_TO_EMAIL      inbox that receives the messages
 *   CONTACT_FROM_EMAIL    sender on a domain verified in Resend,
 *                         e.g. "Formulaire <formulaire@siavashizadi.com>"
 *   CONTACT_EMAIL_API_URL optional, for tests against a local mock provider
 */

const DEFAULT_API_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

type Config = { apiKey: string; to: string; from: string; apiUrl: string };

export type DeliveryResult =
  { status: "sent" } | { status: "not_configured" } | { status: "failed" };

function readConfig(): Config | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return null;

  const apiUrl = process.env.CONTACT_EMAIL_API_URL?.trim() || DEFAULT_API_URL;
  // The API key travels with the request: only HTTPS, or plain HTTP to this
  // machine (test mock). Anything else is a misconfiguration.
  const url = new URL(apiUrl);
  const isLocal = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) {
    console.error("[contact] CONTACT_EMAIL_API_URL must use https");
    return null;
  }
  return { apiKey, to, from, apiUrl };
}

export function isEmailConfigured(): boolean {
  return readConfig() !== null;
}

export async function sendContactEmail(
  submission: ContactSubmission,
): Promise<DeliveryResult> {
  const config = readConfig();
  if (!config) return { status: "not_configured" };

  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        // Replying from the inbox answers the visitor directly.
        reply_to: submission.email,
        subject: `[siavashizadi.com] Message de ${submission.name}`,
        // Plain text only: nothing the visitor typed is ever interpreted as HTML.
        text: [
          `Nom : ${submission.name}`,
          `E-mail : ${submission.email}`,
          "",
          submission.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (response.ok) return { status: "sent" };
    // Status code only: never log the message, the address or the API key.
    console.error(`[contact] provider rejected the message: HTTP ${response.status}`);
    return { status: "failed" };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    console.error(`[contact] provider unreachable: ${reason}`);
    return { status: "failed" };
  }
}
