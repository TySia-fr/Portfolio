import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Fact } from "@/components/prose";
import { ButtonLink } from "@/components/ui/button-link";
import { alternance as t } from "@/content/alternance";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `${t.title} · Développeur full-stack à Lyon ou Montpellier`,
  description: t.description,
  path: "/alternance",
});

const label = "font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase";

/** The page an employer opens from an application e-mail: everything needed to decide in a minute. */
export default function AlternancePage() {
  return (
    <Container className="py-16 sm:py-24">
      <header className="border-b border-line pb-12">
        <p className="inline-flex items-center gap-2 rounded-full border border-signal/40 px-3 py-1 font-mono text-xs text-signal">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          {t.eyebrow}
        </p>
        <h1 className="mt-6 max-w-[22ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
          {t.heading}
        </h1>
        <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-pretty text-muted">
          {t.intro}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={t.cta.contact.href}>
            {t.cta.contact.label}{" "}
            <span className="nudge" aria-hidden="true">
              →
            </span>
          </ButtonLink>
          <ButtonLink href={t.cta.cv.href} variant="secondary">
            {t.cta.cv.label}
          </ButtonLink>
        </div>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-20">
        <aside aria-labelledby="facts-title">
          <h2 id="facts-title" className={label}>
            {t.facts.title}
          </h2>
          <dl className="mt-6 grid gap-6 font-mono text-[0.8125rem] lg:sticky lg:top-24">
            {t.facts.items.map((fact) => (
              <Fact key={fact.label} label={fact.label}>
                <span className="font-sans text-sm leading-relaxed">{fact.value}</span>
              </Fact>
            ))}
          </dl>
        </aside>

        <div className="grid min-w-0 gap-16">
          <section aria-labelledby="bring-title" className="reveal">
            <h2 id="bring-title" className={label}>
              {t.bring.title}
            </h2>
            <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {t.bring.items.map((item) => (
                <li key={item.title} className="flex flex-col bg-ink p-6">
                  <h3 className="font-mono text-base font-medium text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-muted">
                    {item.body}
                  </p>
                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="mt-4 font-mono text-[0.8125rem] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
                    >
                      {item.link.label} <span className="nudge">→</span>
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="process-title" className="reveal">
            <h2 id="process-title" className={label}>
              {t.process.title}
            </h2>
            <ol className="mt-6 grid gap-8 md:grid-cols-3">
              {t.process.steps.map((step, index) => (
                <li key={step.title} className="border-t border-line pt-5">
                  <span aria-hidden="true" className="font-mono text-xs text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-mono text-base font-medium text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="cta-title"
            className="reveal border border-line bg-surface p-6 sm:p-8"
          >
            <h2 id="cta-title" className="font-mono text-xl font-medium text-text">
              {t.cta.title}
            </h2>
            <p className="mt-2 text-muted">{t.cta.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={t.cta.contact.href}>{t.cta.contact.label}</ButtonLink>
              <ButtonLink href={t.cta.cv.href} variant="secondary">
                {t.cta.cv.label}
              </ButtonLink>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
