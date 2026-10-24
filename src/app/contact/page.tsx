import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { contact } from "@/content/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: contact.title,
  description: contact.description,
  alternates: { canonical: "/contact" },
};

/**
 * v1: direct channels only. A server-validated contact form (Zod, rate limit,
 * honeypot) is planned; until then nothing pretends to send a message.
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
      <h1 className="max-w-[20ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
        {contact.heading}
      </h1>
      <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-muted">
        {contact.intro}
      </p>

      <section aria-labelledby="channels-title" className="mt-14 max-w-2xl">
        <h2
          id="channels-title"
          className="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
        >
          {contact.channels.title}
        </h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                  {channel.label}
                </span>
                <span className="font-mono text-lg text-text transition-colors group-hover:text-signal sm:text-xl">
                  {channel.value}
                  <span aria-hidden="true" className="ml-2 text-muted">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-muted">
        {contact.privacy}{" "}
        <Link
          href="/mentions-legales"
          className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
        >
          {contact.privacyLink}
        </Link>
        .
      </p>
    </Container>
  );
}
