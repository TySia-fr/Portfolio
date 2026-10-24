import { sendContactEmail } from "@/lib/contact/email";
import {
  type ContactErrorCode,
  type ContactResponse,
  HONEYPOT_FIELD,
} from "@/lib/contact/limits";
import { SlidingWindowLimiter } from "@/lib/contact/rate-limit";
import { contactSchema } from "@/lib/contact/schema";

/**
 * POST /api/contact — receives the contact form and forwards it by e-mail.
 *
 * Checks run cheapest first, so abusive requests cost as little as possible:
 * origin → content type → size → rate limit → JSON → honeypot → schema → send.
 * Nothing the visitor wrote is stored or logged.
 */

/** Generous for 5,000 characters of UTF-8 plus JSON overhead. Nginx caps at 64 KB. */
const MAX_BODY_BYTES = 32 * 1024;

/** Per visitor: 5 attempts per 10 minutes, whatever their outcome. */
const perVisitor = new SlidingWindowLimiter(5, 10 * 60 * 1000);
/** Whole site: 20 delivered messages per hour, to protect the e-mail quota. */
const deliveries = new SlidingWindowLimiter(20, 60 * 60 * 1000);

export async function POST(request: Request) {
  // 1. Same-origin only. Browsers always send Origin on a POST from fetch().
  //    Compared with Host, which Nginx forwards unchanged.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || safeHost(origin) !== host) return fail("forbidden", 403);

  // 2. JSON only. A cross-site HTML form cannot send application/json without a
  //    CORS preflight, which this route never approves.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return fail("unsupported", 415);
  }

  // 3. Size, checked on the declared length and again on the bytes actually read.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return fail("too_large", 413);
  const raw = await readBody(request, MAX_BODY_BYTES);
  if (raw === null) return fail("too_large", 413);

  // 4. Rate limit by client IP. X-Real-IP is set by Nginx from the TCP peer and
  //    cannot be forged from outside: the app port only listens on 127.0.0.1.
  const visitor = request.headers.get("x-real-ip") ?? "local";
  const limited = perVisitor.consume(visitor);
  if (!limited.allowed) return fail("rate_limited", 429, limited.retryAfterS);

  // 5. Parse.
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail("invalid", 400);
  }

  // 6. Honeypot: a hidden field only bots fill in. Answer as if it worked so
  //    they learn nothing, and send nothing.
  if (
    isObject(payload) &&
    typeof payload[HONEYPOT_FIELD] === "string" &&
    payload[HONEYPOT_FIELD] !== ""
  ) {
    console.warn("[contact] honeypot triggered, message dropped");
    return Response.json({ ok: true } satisfies ContactResponse);
  }

  // 7. Validate.
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "name" || key === "email" || key === "message") && !fields[key]) {
        fields[key] = issue.message;
      }
    }
    return Response.json(
      { ok: false, error: "invalid", fields } satisfies ContactResponse,
      {
        status: 422,
      },
    );
  }

  // 8. Site-wide cap before spending e-mail quota.
  const quota = deliveries.consume("site");
  if (!quota.allowed) return fail("rate_limited", 429, quota.retryAfterS);

  // 9. Deliver. Success is reported only when the provider accepted the e-mail.
  const result = await sendContactEmail(parsed.data);
  if (result.status === "sent")
    return Response.json({ ok: true } satisfies ContactResponse);
  if (result.status === "not_configured") return fail("unavailable", 503);
  return fail("delivery_failed", 502);
}

function fail(error: ContactErrorCode, status: number, retryAfterS?: number) {
  return Response.json({ ok: false, error } satisfies ContactResponse, {
    status,
    headers: retryAfterS ? { "Retry-After": String(retryAfterS) } : undefined,
  });
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads the body as text, giving up as soon as it exceeds `limit` bytes. */
async function readBody(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
