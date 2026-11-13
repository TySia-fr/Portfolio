import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Portrait } from "@/components/portrait";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { pageMetadata } from "@/lib/metadata";

export function cvMetadata(locale: Locale): Metadata {
  const { cv } = getContent(locale);
  return pageMetadata({
    locale,
    title: cv.title,
    description: cv.description,
    path: href(locale, "cv"),
  });
}

const host = (url: string) => url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * The CV as a web page. The same page, printed (print styles in globals.css),
 * is the downloadable PDF: one source, so the two never disagree.
 */
export function CvView({ locale }: { locale: Locale }) {
  const { cv, site } = getContent(locale);
  const contacts = [
    { label: site.email, href: `mailto:${site.email}` },
    // Absolute on purpose: the link must work from the printed PDF.
    { label: "siavashizadi.com", href: "https://siavashizadi.com" },
    { label: host(site.linkedinUrl), href: site.linkedinUrl },
    { label: host(site.githubUrl), href: site.githubUrl },
  ];

  return (
    <Container className="cv-page py-12 sm:py-16">
      <div className="print-hidden mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
          {cv.title}
        </p>
        <a href={cv.pdf.href} download className="btn btn-primary">
          {cv.pdf.label} <span aria-hidden="true">↓</span>
        </a>
      </div>

      <article className="cv-sheet mx-auto max-w-[54rem] border border-line bg-surface/40 p-6 sm:p-10">
        <header className="flex items-start gap-6 border-b border-line pb-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-4xl">
              {site.name}
            </h1>
            <p className="mt-2 font-mono text-[0.9375rem] text-text">{site.role}</p>
            <p className="cv-accent mt-3 text-[0.9375rem] font-medium text-signal">
              {cv.headline}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.8125rem] text-muted">
              <li>{cv.location}</li>
              <li className="hidden print:list-item">
                <a href={cv.phone.href}>{cv.phone.display}</a>
              </li>
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a href={contact.href} className="hover:text-text">
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Portrait
            locale={locale}
            sizes="7rem"
            priority
            className="cv-photo size-24 shrink-0 rounded-[4px] border border-line sm:size-28"
          />
        </header>

        <CvSection title={cv.profileTitle}>
          <p className="leading-relaxed text-pretty">{cv.profile}</p>
        </CvSection>

        <CvSection title={cv.educationTitle}>
          <div className="grid gap-3">
            {cv.education.map((item) => (
              <div
                key={item.title}
                className="cv-block grid gap-x-4 sm:grid-cols-[7rem_1fr]"
              >
                <p className="font-mono text-xs leading-6 text-muted">{item.period}</p>
                <div>
                  <p className="font-medium text-text">
                    {item.title} · <span className="font-normal">{item.place}</span>
                  </p>
                  {item.detail ? <p className="text-muted">{item.detail}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title={cv.projectsTitle}>
          <div className="grid gap-5">
            {cv.projects.map((project) => (
              <div key={project.slug} className="cv-block">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-mono text-[0.9375rem] font-medium text-text">
                    {project.name}
                  </h3>
                  <a
                    href={`https://${project.url}`}
                    className="font-mono text-xs text-muted hover:text-text"
                  >
                    {project.url}
                  </a>
                </div>
                <p className="mt-1 font-mono text-xs text-muted">{project.stack}</p>
                <ul className="mt-2 grid gap-1">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-4 leading-snug text-pretty">
                      <span aria-hidden="true" className="absolute left-0 text-muted">
                        –
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title={cv.skillsTitle}>
          <dl className="grid gap-1.5">
            {cv.skills.map((skill) => (
              <div key={skill.label} className="grid gap-x-4 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-xs leading-6 text-muted">{skill.label}</dt>
                <dd className="leading-6">{skill.value}</dd>
              </div>
            ))}
          </dl>
        </CvSection>

        <CvSection title={cv.languagesTitle}>
          <p>{cv.languages}</p>
        </CvSection>
      </article>
    </Container>
  );
}

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cv-section mt-6">
      <h2 className="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase">
        {title}
      </h2>
      <div className="mt-3 text-[0.9375rem] text-text">{children}</div>
    </section>
  );
}
