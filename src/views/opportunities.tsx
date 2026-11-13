import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Fact } from "@/components/prose";
import { ButtonLink } from "@/components/ui/button-link";
import { opportunities } from "@/content/opportunities";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { pageMetadata } from "@/lib/metadata";

/**
 * FR: the alternance page. EN: "open to roles". Same structure, different
 * audience and wording (see the two content modules).
 */
export function opportunitiesMetadata(locale: Locale): Metadata {
  const t = opportunities[locale];
  return pageMetadata({
    locale,
    title: t.metaTitle,
    description: t.description,
    path: href(locale, "opportunities"),
  });
}

const label = "font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase";

/** The page an employer opens from an application e-mail: everything needed to decide in a minute. */
export function OpportunitiesView({ locale }: { locale: Locale }) {
  const t = opportunities[locale];
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
          <section aria-labelledby="domains-title" className="reveal">
            <h2 id="domains-title" className={label}>
              {t.domains.title}
            </h2>
            <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-pretty text-muted">
              {t.domains.intro}
            </p>
            <ul className="mt-6 grid gap-px border border-line bg-line">
              {t.domains.items.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-4 bg-ink p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8"
                >
                  <div>
                    <h3 className="font-mono text-base font-medium text-text">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-muted">
                      {item.body}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      {t.domains.proofLabel}
                    </p>
                    <ul className="mt-3 grid gap-3">
                      {item.proofs.map((proof) => (
                        <li key={proof.label}>
                          <Link
                            href={proof.href}
                            className="text-[0.9375rem] leading-relaxed text-pretty text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
                          >
                            {proof.label} <span className="nudge">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="learn-title" className="reveal">
            <h2 id="learn-title" className={label}>
              {t.learn.title}
            </h2>
            <p className="mt-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-pretty text-text">
              {t.learn.body}
            </p>
            <ul className="mt-4 grid max-w-[62ch] gap-2">
              {t.learn.items.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-[0.9375rem] leading-relaxed text-pretty text-muted"
                >
                  <span aria-hidden="true" className="absolute left-0 text-signal">
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="practical-title" className="reveal">
            <h2 id="practical-title" className={label}>
              {t.practical.title}
            </h2>
            <dl className="mt-6 grid gap-8 md:grid-cols-3">
              {t.practical.items.map((item) => (
                <div key={item.title} className="border-t border-line pt-5">
                  <dt className="font-mono text-base font-medium text-text">
                    {item.title}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-muted">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
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
