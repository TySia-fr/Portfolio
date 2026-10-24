import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Fact, ProseSection } from "@/components/prose";
import { ButtonLink } from "@/components/ui/button-link";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-24">
      <header className="border-b border-line pb-12">
        <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
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

          <ProseSection id="interets" title={about.interests.title}>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {about.interests.items.map((item) => (
                <div key={item.title} className="bg-ink p-5">
                  <h3 className="font-mono text-[0.9375rem] font-medium text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem]">{item.body}</p>
                </div>
              ))}
            </div>
          </ProseSection>

          <ProseSection id="methode" title={about.philosophy.title}>
            {about.philosophy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ProseSection>

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
