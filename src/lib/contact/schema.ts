import "server-only";

import { z } from "zod";

import { CONTACT_LIMITS as L, HONEYPOT_FIELD } from "./limits";

/** Control characters except tab and newlines: nothing a human types in a form. */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const cleanText = (min: number, max: number, messages: { min: string; max: string }) =>
  z
    .string()
    .trim()
    .min(min, messages.min)
    .max(max, messages.max)
    .refine((value) => !CONTROL_CHARS.test(value), "Caractères non autorisés.");

/** Server-side validation of a contact submission. Messages are shown to the visitor. */
export const contactSchema = z.object({
  name: cleanText(L.name.min, L.name.max, {
    min: "Indiquez votre nom.",
    max: `${L.name.max} caractères maximum.`,
  }).refine((value) => !/[\r\n]/.test(value), "Le nom tient sur une ligne."),
  email: z
    .string()
    .trim()
    .max(L.email.max, "Adresse trop longue.")
    .pipe(z.email("Adresse e-mail invalide.")),
  message: cleanText(L.message.min, L.message.max, {
    min: `Votre message doit contenir au moins ${L.message.min} caractères.`,
    max: `${L.message.max} caractères maximum.`,
  }),
  [HONEYPOT_FIELD]: z.string().max(500).optional(),
});

export type ContactSubmission = z.infer<typeof contactSchema>;
