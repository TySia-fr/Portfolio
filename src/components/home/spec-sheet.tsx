import type { ReactNode } from "react";

import { home } from "@/content/home";
import { site } from "@/content/site";
import { getBuildInfo } from "@/lib/build-info";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

/**
 * The site's signature element: a spec sheet of the build that is serving the
 * page. Every value comes from the build itself, so it cannot drift from reality.
 */
export function SpecSheet() {
  const build = getBuildInfo();
  const t = home.specSheet;

  const rows: { label: string; value: ReactNode }[] = [
    { label: t.rows.framework, value: `Next.js ${build.nextVersion}` },
    { label: t.rows.language, value: t.rows.language_value },
    { label: t.rows.rendering, value: t.rows.rendering_value },
    { label: t.rows.delivery, value: t.rows.delivery_value },
    {
      label: t.rows.source,
      value: <ExternalLink href={site.repositoryUrl}>{t.rows.source_value}</ExternalLink>,
    },
    {
      label: t.rows.commit,
      value:
        build.commit && build.commitUrl ? (
          <ExternalLink href={build.commitUrl}>{build.commit.slice(0, 7)}</ExternalLink>
        ) : (
          t.rows.commit_local
        ),
    },
    {
      label: t.rows.builtAt,
      value: (
        <time dateTime={build.builtAt.toISOString()}>
          {dateFormat.format(build.builtAt)}
        </time>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="spec-sheet-title"
      className="border border-line bg-surface font-mono text-[0.8125rem]"
    >
      <header className="border-b border-line px-5 py-4">
        <h2
          id="spec-sheet-title"
          className="text-xs font-medium tracking-[0.14em] text-muted uppercase"
        >
          {t.title}
        </h2>
        <p className="mt-1.5 font-sans text-sm text-muted">{t.subtitle}</p>
      </header>

      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3">
            <dt className="text-muted">{row.label}</dt>
            <dd className="text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
