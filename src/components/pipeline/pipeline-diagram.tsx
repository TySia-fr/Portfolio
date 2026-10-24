import { pipeline } from "@/content/pipeline";

/**
 * Delivery pipeline as an ordered list: read by screen readers as five steps
 * in order, drawn as a connected diagram for sighted visitors.
 *
 * The amber line fills as the diagram scrolls into view (.pipeline-progress,
 * scroll-driven, no JavaScript). Without support for scroll-driven animations,
 * or with reduced motion, it is simply drawn in full.
 */
export function PipelineDiagram({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as const;

  return (
    <figure className="m-0">
      <ol className="pipeline relative grid md:grid-cols-5 md:gap-6">
        {/* Rail: vertical on mobile, horizontal from md. Decorative. */}
        <span aria-hidden="true" className="pipeline-rail" />
        <span aria-hidden="true" className="pipeline-rail pipeline-progress" />

        {pipeline.steps.map((step, index) => (
          <li key={step.id} className="relative pb-8 pl-11 md:pt-12 md:pb-0 md:pl-0">
            <span aria-hidden="true" className="pipeline-node">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-signal uppercase">
              {step.action}
            </p>
            <Heading className="mt-1.5 font-mono text-base font-medium text-text">
              {step.name}
            </Heading>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
            <a
              href={step.file.href}
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
            >
              {step.file.label}
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
      <figcaption className="mt-8 font-mono text-xs text-muted">
        {pipeline.caption}
      </figcaption>
    </figure>
  );
}
