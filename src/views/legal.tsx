import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ProseSection, TextLink } from "@/components/prose";
import { getContent } from "@/content";
import { type Locale, localeInfo } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { pageMetadata } from "@/lib/metadata";

export function legalMetadata(locale: Locale): Metadata {
  const { legal } = getContent(locale);
  return pageMetadata({
    locale,
    title: legal.title,
    description: legal.description,
    path: href(locale, "legal"),
  });
}

export function LegalView({ locale }: { locale: Locale }) {
  const { legal, site } = getContent(locale);
  const dateFormat = new Intl.DateTimeFormat(localeInfo[locale].bcp47, {
    dateStyle: "long",
  });
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
        {legal.title}
      </h1>
      <p className="mt-4 font-mono text-xs text-muted">
        {legal.updatedLabel} :{" "}
        <time dateTime={legal.updated}>{dateFormat.format(new Date(legal.updated))}</time>
      </p>

      <div className="mt-14 grid max-w-[68ch] gap-12">
        {legal.sections.map((section) => (
          <ProseSection key={section.id} id={section.id} title={section.title}>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ProseSection>
        ))}

        <ProseSection id="contact" title={legal.contactTitle}>
          <p>
            <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
          </p>
        </ProseSection>
      </div>
    </Container>
  );
}
