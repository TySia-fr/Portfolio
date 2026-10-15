import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="font-mono text-xs tracking-wider text-muted uppercase">Erreur 404</p>
      <h1 className="mt-4 font-mono text-3xl font-medium tracking-tight [font-stretch:80%] sm:text-5xl">
        Cette page n’existe pas.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        L’adresse est peut-être mal saisie, ou la page a été déplacée.
      </p>
      <div className="mt-10">
        <ButtonLink href="/">Retour à l’accueil</ButtonLink>
      </div>
    </Container>
  );
}
