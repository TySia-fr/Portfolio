import Link from "next/link";

import { Container } from "@/components/layout/container";
import { site } from "@/content/site";
import { getBuildInfo } from "@/lib/build-info";

export function SiteFooter() {
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
            <a href={site.githubUrl} className="hover:text-text" rel="me">
              GitHub
            </a>
          </li>
          <li>
            <a href={site.repositoryUrl} className="hover:text-text">
              {site.footer.sourceCode}
            </a>
          </li>
          <li>
            <Link href="/mentions-legales" className="hover:text-text">
              {site.footer.legal}
            </Link>
          </li>
          {build.commit && build.commitUrl ? (
            <li>
              <a href={build.commitUrl} className="hover:text-text">
                {site.footer.builtFrom} {build.commit.slice(0, 7)}
              </a>
            </li>
          ) : null}
        </ul>
      </Container>
    </footer>
  );
}
