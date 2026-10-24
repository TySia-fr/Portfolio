/**
 * Field limits shared by the form (client) and the API (server). Kept free of
 * imports so the client bundle does not pull in Zod: the server is the
 * authority, the client only gives fast feedback.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 20, max: 5000 },
} as const;

/** Name of the hidden honeypot field. Humans never see or fill it. */
export const HONEYPOT_FIELD = "site_web";

export type ContactField = "name" | "email" | "message";

/** Machine-readable outcomes returned by POST /api/contact. */
export type ContactErrorCode =
  | "invalid"
  | "rate_limited"
  | "unavailable"
  | "delivery_failed"
  | "forbidden"
  | "too_large"
  | "unsupported";

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: ContactErrorCode;
      fields?: Partial<Record<ContactField, string>>;
    };
