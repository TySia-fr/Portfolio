/**
 * What Siavash is looking for, written for an employer reading it in a minute.
 * Facts as he stated them (2026-11-02). Language levels are deliberately not shown.
 */
export const alternance = {
  title: "Alternance",
  description:
    "Siavash Izadi recherche une alternance en développement full-stack JavaScript à Lyon ou Montpellier, en Bac+3 ou en Master, dès que possible.",
  eyebrow: "Disponible dès que possible",
  heading: "Je recherche une alternance en développement full-stack.",
  intro:
    "Je cherche une entreprise à Lyon ou à Montpellier pour un contrat d’alternance, et l’école qui va avec, en Bac+3 ou en Master. Je construis et déploie déjà des applications complètes : je veux maintenant le faire dans une équipe, sur un vrai produit.",

  /** Short form, reused by the home banner and the CV. */
  banner: "Recherche une alternance · Lyon ou Montpellier",
  short:
    "Recherche une alternance en développement full-stack (Bac+3 ou Master), à Lyon ou Montpellier, dès que possible.",

  facts: {
    title: "En résumé",
    items: [
      { label: "Contrat", value: "Apprentissage ou professionnalisation" },
      {
        label: "Formation",
        value:
          "Bac+3 ou Master (niveau 6 ou 7), en école, avec inscription liée au contrat",
      },
      { label: "Lieu", value: "Lyon ou Montpellier, et alentours" },
      { label: "Démarrage", value: "Dès que possible" },
      {
        label: "Diplôme actuel",
        value: "Licence en génie informatique, niveau 6 selon ENIC-NARIC France",
      },
      { label: "Poste visé", value: "Développeur full-stack JavaScript / TypeScript" },
    ],
  },

  bring: {
    title: "Ce que j’apporte dès le premier jour",
    items: [
      {
        title: "Des applications complètes, en production",
        body: "NEXORA (e-commerce avec paiement, comptes et back-office) et ce portfolio sont en ligne, avec leur code public.",
        link: { href: "/projets", label: "Voir les projets" },
      },
      {
        title: "Du code testé",
        body: "Tests unitaires, d’intégration et de bout en bout (Vitest, Playwright), contrôles d’accessibilité, intégration continue sur chaque modification.",
        link: { href: "/projets/nexora", label: "Les tests de NEXORA" },
      },
      {
        title: "Le déploiement, pas seulement le code",
        body: "Docker, Nginx, HTTPS et déploiement automatique depuis GitHub Actions, sur un serveur que j’administre.",
        link: { href: "/projets/portfolio", label: "Comment ce site est déployé" },
      },
      {
        title: "Le réflexe sécurité",
        body: "Validation côté serveur, politique de sécurité du contenu, moindre privilège, contrôle des droits dans chaque requête.",
        link: null,
      },
    ],
  },

  process: {
    title: "Comment ça se passe",
    steps: [
      {
        title: "On se parle",
        body: "Un premier échange, puis un entretien technique si vous le souhaitez : je peux présenter mon code en direct.",
      },
      {
        title: "On choisit l’école ensemble",
        body: "Bac+3 ou Master, avec un rythme qui convient à votre équipe. Je m’inscris dans la formation liée au contrat.",
      },
      {
        title: "On signe et je commence",
        body: "En contrat d’apprentissage dans une entreprise privée, le coût de la formation est pris en charge par son OPCO.",
      },
    ],
  },

  cta: {
    title: "Une offre, une question ?",
    body: "Écrivez-moi : je réponds rapidement.",
    contact: { href: "/contact", label: "Me contacter" },
    cv: { href: "/cv", label: "Voir mon CV" },
  },
} as const;
