import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Container } from "@/components/layout/container";
import { Fact, ProseSection } from "@/components/prose";
import { ButtonLink } from "@/components/ui/button-link";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { profilePageData } from "@/lib/structured-data";

// The profile page carries the name in both scripts, so it can be found by
// "Siavash Izadi" and by "سیاوش ایزدی".
export const metadata: Metadata = pageMetadata({
  title: `${site.name} (${site.nameFa}) — ${about.title}`,
  description: about.description,
  path: "/a-propos",
  absoluteTitle: true,
});

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-24">
      <JsonLd data={profilePageData()} />
      <header className="border-b border-line pb-12">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-text">
          <span className="font-mono text-sm font-medium">{site.name}</span>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          {/* Persian script: its own language and direction for screen readers and search engines. */}
          <span lang="fa" dir="rtl" className="text-base text-muted">
            {site.nameFa}
          </span>
        </p>
        <p className="mt-3 font-mono text-xs tracking-[0.14em] text-muted uppercase">
          {about.eyebrow}
        </p>
        <h1 className="mt-6 max-w-[24ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
          {about.heading}
        </h1>
        <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-muted">
          {about.intro}
        </p>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <aside aria-label={about.facts.title}>
          <dl className="grid gap-6 font-mono text-[0.8125rem] lg:sticky lg:top-24">
            {about.facts.items.map((fact) => (
              <Fact key={fact.label} label={fact.label}>
                <span className="font-sans text-sm leading-relaxed">{fact.value}</span>
              </Fact>
            ))}
          </dl>
        </aside>

        <article className="grid max-w-[68ch] gap-14">
          {about.sections.map((section) => (
            <ProseSection key={section.id} id={section.id} title={section.title}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ProseSection>
          ))}

          <div className="reveal">
            <ProseSection id="reperes" title={about.timeline.title}>
              <ol className="relative mt-2 grid gap-8 border-l border-line pl-7">
                {about.timeline.items.map((item) => (
                  <li key={item.period} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute top-1.5 -left-[calc(1.75rem+4.5px)] size-2 ${
                        "current" in item ? "bg-signal" : "border border-muted bg-ink"
                      }`}
                    />
                    <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      {item.period}
                    </p>
                    <h3 className="mt-2 font-mono text-base font-medium text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2">{item.body}</p>
                  </li>
                ))}
              </ol>
            </ProseSection>
          </div>

          <div className="reveal">
            <ProseSection id="interets" title={about.interests.title}>
              <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
                {about.interests.items.map((item) => (
                  <div
                    key={item.title}
                    className="bg-ink p-5 transition-colors hover:bg-surface"
                  >
                    <h3 className="font-mono text-[0.9375rem] font-medium text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem]">{item.body}</p>
                  </div>
                ))}
              </div>
            </ProseSection>
          </div>

          <div className="reveal">
            <ProseSection id="methode" title={about.philosophy.title}>
              {about.philosophy.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "border-l-2 border-signal pl-5 font-mono text-lg leading-relaxed text-text [font-stretch:87.5%]"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </ProseSection>
          </div>

          <ProseSection id="suite" title={about.next.title}>
            {about.next.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="mt-4">
              <ButtonLink href={about.next.cta.href}>{about.next.cta.label}</ButtonLink>
            </div>
          </ProseSection>
        </article>
      </div>
    </Container>
  );
}
