"use client";

import { type FormEvent, useId, useRef, useState } from "react";

import { contact } from "@/content/contact";
import {
  CONTACT_LIMITS as L,
  type ContactField,
  type ContactResponse,
  HONEYPOT_FIELD,
} from "@/lib/contact/limits";

const t = contact.form;

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

type FieldErrors = Partial<Record<ContactField, string>>;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fast feedback only. The API validates again and has the final word. */
function validate(values: Record<ContactField, string>): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  if (name.length < L.name.min) errors.name = t.client.name;
  else if (name.length > L.name.max) errors.name = t.client.tooLong;
  if (!EMAIL_SHAPE.test(email) || email.length > L.email.max)
    errors.email = t.client.email;
  if (message.length < L.message.min) errors.message = t.client.messageShort;
  else if (message.length > L.message.max) errors.message = t.client.tooLong;
  return errors;
}

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = useId();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setState({ status: "error", message: t.errors.invalid });
      focusFirstInvalid(form, clientErrors);
      return;
    }

    setState({ status: "sending" });
    let result: ContactResponse;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD) ?? "",
        }),
      });
      result = (await response.json()) as ContactResponse;
    } catch {
      setState({ status: "error", message: t.errors.network });
      statusRef.current?.focus();
      return;
    }

    if (result.ok) {
      form.reset();
      setMessageLength(0);
      setErrors({});
      setState({ status: "sent" });
      // Moving focus to the confirmation makes screen readers announce it.
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    const serverErrors = result.fields ?? {};
    setErrors(serverErrors);
    const message =
      result.error in t.errors
        ? t.errors[result.error as keyof typeof t.errors]
        : t.errors.generic;
    setState({ status: "error", message });
    if (Object.keys(serverErrors).length > 0) focusFirstInvalid(form, serverErrors);
    else statusRef.current?.focus();
  }

  if (state.status === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="motion-enter border border-live/40 bg-surface p-6 outline-none"
      >
        <p className="font-mono text-base font-medium text-live">{t.success.title}</p>
        <p className="mt-2 text-muted">{t.success.body}</p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-5 font-mono text-[0.8125rem] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  const sending = state.status === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id}-status`}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label={t.name}
          error={errors.name}
          autoComplete="name"
          maxLength={L.name.max}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label={t.email}
          hint={t.emailHint}
          error={errors.email}
          autoComplete="email"
          maxLength={L.email.max}
        />
      </div>

      <div className="mt-6">
        <Field
          id={`${id}-message`}
          name="message"
          label={t.message}
          hint={t.messageHint}
          error={errors.message}
          multiline
          maxLength={L.message.max}
          onLength={setMessageLength}
          counter={`${messageLength} / ${L.message.max}`}
        />
      </div>

      {/* Honeypot: off-screen, skipped by keyboard and screen readers. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-hp`}>{t.honeypot}</label>
        <input
          id={`${id}-hp`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div
        id={`${id}-status`}
        ref={statusRef}
        tabIndex={-1}
        role={state.status === "error" ? "alert" : "status"}
        className="mt-6 min-h-6 text-sm outline-none"
      >
        {state.status === "error" ? (
          <p className="border-l-2 border-signal pl-4 text-text">
            {state.message}{" "}
            {state.message !== t.errors.invalid ? (
              <a
                href={`mailto:${fallbackEmail}`}
                className="whitespace-nowrap text-signal underline decoration-signal/40 underline-offset-4"
              >
                {fallbackEmail}
              </a>
            ) : null}
          </p>
        ) : null}
        {sending ? <p className="text-muted">{t.sending}</p> : null}
      </div>

      <button
        type="submit"
        disabled={sending}
        aria-disabled={sending}
        className="btn btn-primary mt-4 disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? t.sending : t.submit}
      </button>

      <noscript>
        <p className="mt-4 text-sm text-muted">{t.noScript}</p>
      </noscript>
    </form>
  );
}

function focusFirstInvalid(form: HTMLFormElement, errors: FieldErrors) {
  const first = (["name", "email", "message"] as const).find((field) => errors[field]);
  if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}

type FieldProps = {
  id: string;
  name: ContactField;
  label: string;
  hint?: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  maxLength: number;
  multiline?: boolean;
  counter?: string;
  onLength?: (length: number) => void;
};

function Field({
  id,
  name,
  label,
  hint,
  error,
  type = "text",
  autoComplete,
  maxLength,
  multiline = false,
  counter,
  onLength,
}: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  const common = {
    id,
    name,
    required: true,
    maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className:
      "field-input mt-2 block w-full border bg-surface px-3.5 py-3 text-[0.9375rem] text-text placeholder:text-muted/60 " +
      (error ? "border-signal" : "border-line"),
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="font-mono text-xs tracking-[0.14em] text-muted uppercase"
        >
          {label}
        </label>
        {counter ? (
          <span
            aria-hidden="true"
            className="font-mono text-[0.6875rem] text-muted tabular-nums"
          >
            {counter}
          </span>
        ) : null}
      </div>
      {multiline ? (
        <textarea
          {...common}
          rows={7}
          onChange={(event) => onLength?.(event.currentTarget.value.length)}
          className={`${common.className} resize-y`}
        />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-signal">
          {error}
        </p>
      ) : null}
    </div>
  );
}
