import { Container } from "@/components/layout/container";
import { site } from "@/content/site";

type Props = {
  title: string;
  description: string;
};

/**
 * Honest stand-in for pages that are not built yet: says so, and points to
 * where progress can be followed. Removed page by page in Phase 4.
 */
export function PagePlaceholder({ title, description }: Props) {
  return (
    <Container className="py-20 sm:py-28">
      <p className="font-mono text-xs tracking-wider text-muted uppercase">
        En construction
      </p>
      <h1 className="mt-4 font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{description}</p>
      <p className="mt-8 text-sm text-muted">
        L’avancement est public :{" "}
        <a
          href={site.repositoryUrl}
          className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
        >
          voir le dépôt GitHub
        </a>
        .
      </p>
    </Container>
  );
}
