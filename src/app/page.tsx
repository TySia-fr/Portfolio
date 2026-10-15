import { SpecSheet } from "@/components/home/spec-sheet";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { home } from "@/content/home";

export default function HomePage() {
  return (
    <Container className="py-16 sm:py-24 lg:py-28">
      <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
        {home.eyebrow}
      </p>

      {/* The headline gets the full width: a condensed mono face reads best in
          long lines, not squeezed next to the spec sheet. */}
      <h1 className="mt-6 max-w-[28ch] font-mono text-display font-medium text-balance [font-stretch:76%]">
        {home.title}
      </h1>

      <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:mt-16 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div>
          <p className="max-w-[52ch] text-lg leading-relaxed text-muted">{home.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={home.primaryCta.href}>{home.primaryCta.label}</ButtonLink>
            <ButtonLink href={home.secondaryCta.href} variant="secondary">
              {home.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <SpecSheet />
      </div>
    </Container>
  );
}
