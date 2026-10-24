import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ProseSection, TextLink } from "@/components/prose";
import { legal } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: legal.title,
  description: legal.description,
  path: "/mentions-legales",
});

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

export default function LegalPage() {
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
