import Link from "next/link";

import { Container } from "@/components/layout/container";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getBuildInfo } from "@/lib/build-info";

export function SiteFooter({ locale }: { locale: Locale }) {
  const { site } = getContent(locale);
  const build = getBuildInfo();
  const year = build.builtAt.getUTCFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <Container className="flex flex-col gap-4 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}
        </p>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={site.githubUrl} className="link-draw hover:text-text" rel="me">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.linkedinUrl} className="link-draw hover:text-text" rel="me">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.repositoryUrl} className="link-draw hover:text-text">
              {site.footer.sourceCode}
            </a>
          </li>
          <li>
            <Link href={site.footer.cvHref} className="link-draw hover:text-text">
              {site.footer.cv}
            </Link>
          </li>
          <li>
            <Link href={site.footer.legalHref} className="link-draw hover:text-text">
              {site.footer.legal}
            </Link>
          </li>
          {build.commit && build.commitUrl ? (
            <li>
              <a href={build.commitUrl} className="link-draw hover:text-text">
                {site.footer.builtFrom} {build.commit.slice(0, 7)}
              </a>
            </li>
          ) : null}
        </ul>
      </Container>
    </footer>
  );
}
