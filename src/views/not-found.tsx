import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";

export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getContent(locale).site.notFound;
  return (
    <Container className="py-24 sm:py-32">
      <p className="font-mono text-xs tracking-wider text-muted uppercase">{t.eyebrow}</p>
      <h1 className="mt-4 font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
        {t.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{t.body}</p>
      <div className="mt-10">
        <ButtonLink href={href(locale, "home")}>{t.back}</ButtonLink>
      </div>
    </Container>
  );
}
