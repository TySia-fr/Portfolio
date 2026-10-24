import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { contact } from "@/content/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: contact.title,
  description: contact.description,
  alternates: { canonical: "/contact" },
};

/**
 * The form posts to /api/contact (server-validated, rate-limited, honeypot).
 * Direct channels stay visible: they are the fallback the form points to when
 * delivery is unavailable.
 */
export default function ContactPage() {
  const channels = [
    {
      label: contact.channels.email,
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      label: contact.channels.linkedin,
      value: "linkedin.com/in/siavash-izadi",
      href: site.linkedinUrl,
    },
    {
      label: contact.channels.github,
      value: site.githubUrl.replace("https://", ""),
      href: site.githubUrl,
    },
  ];

  return (
    <Container className="py-16 sm:py-24">
      <h1 className="motion-enter max-w-[20ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
        {contact.heading}
      </h1>
      <p className="motion-enter motion-delay-1 mt-8 max-w-[60ch] text-lg leading-relaxed text-muted">
        {contact.intro}
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <section
          aria-labelledby="form-title"
          className="motion-enter motion-delay-2 relative border border-line bg-surface/40 p-6 sm:p-8"
        >
          <h2
            id="form-title"
            className="mb-8 font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
          >
            {contact.form.title}
          </h2>
          <ContactForm fallbackEmail={site.email} />
        </section>

        <div className="motion-enter motion-delay-3">
          <section aria-labelledby="channels-title">
            <h2
              id="channels-title"
              className="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
            >
              {contact.channels.title}
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a href={channel.href} className="group flex flex-col gap-1 py-5">
                    <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      {channel.label}
                    </span>
                    <span className="font-mono text-base break-all text-text transition-colors group-hover:text-signal">
                      {channel.value}{" "}
                      <span aria-hidden="true" className="nudge text-muted">
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-8 text-sm leading-relaxed text-muted">
            {contact.privacy}{" "}
            <Link
              href="/mentions-legales#donnees"
              className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
            >
              {contact.privacyLink}
            </Link>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
