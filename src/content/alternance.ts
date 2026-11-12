/**
 * What Siavash is looking for, written for an employer reading it in a minute.
 * Facts as he stated them (2026-11-02, scope widened to "informatique" on
 * 2026-11-09). Every claim about his work links to the project that proves it;
 * the test counts come from the case studies in src/content/projects.
 * Language levels are deliberately not shown.
 */
export const alternance = {
  title: "Alternance",
  description:
    "Siavash Izadi recherche une alternance en informatique, en Bac+3 ou en Master, dès que possible : développement web, systèmes et déploiement.",
  eyebrow: "Disponible dès que possible",
  heading: "Je recherche une alternance en informatique.",
  intro:
    "Contrat d’apprentissage ou de professionnalisation, avec une école en Bac+3 ou en Master. Je développe des applications web, je les teste et je les déploie sur un serveur Linux que j’administre. Tout ce qui est écrit ici renvoie à du code que vous pouvez lire.",

  /** Short form, reused by the home banner and the CV. */
  banner: "Recherche une alternance en informatique",
  short: "Recherche une alternance en informatique (Bac+3 ou Master), dès que possible.",

  facts: {
    title: "En résumé",
    items: [
      { label: "Contrat", value: "Apprentissage ou professionnalisation" },
      { label: "Formation visée", value: "Bac+3 ou Master, en école, liée au contrat" },
      { label: "Démarrage", value: "Dès que possible" },
      {
        label: "Diplôme",
        value: "Licence en génie informatique, niveau 6 selon ENIC-NARIC France",
      },
      { label: "Études en cours", value: "Informatique, Université de Montpellier" },
    ],
  },

  domains: {
    title: "Ce que je peux faire dans votre équipe",
    intro:
      "Trois domaines où j’ai déjà livré quelque chose de vérifiable. Chaque preuve est un projet public.",
    items: [
      {
        title: "Développement web",
        body: "Applications complètes en TypeScript : interface React / Next.js, logique serveur, base PostgreSQL, comptes et droits d’accès.",
        proofs: [
          {
            href: "/projets/nexora",
            label:
              "NEXORA, e-commerce en ligne : 79 tests unitaires et d’intégration, 20 de bout en bout",
          },
          {
            href: "/projets/applyflow",
            label:
              "ApplyFlow, suivi de candidatures (en cours) : 37 tests, 9 de bout en bout",
          },
        ],
      },
      {
        title: "Systèmes et déploiement",
        body: "Serveur Linux administré seul : Docker, Nginx, HTTPS, conteneurs sans privilèges, déploiement automatique avec retour arrière si le contrôle de santé échoue.",
        proofs: [
          {
            href: "/projets/portfolio",
            label: "Ce site, déployé par GitHub Actions à chaque modification",
          },
        ],
      },
      {
        title: "Sécurité des applications",
        body: "Droits vérifiés côté serveur dans chaque requête, validation de toutes les entrées, politique de sécurité du contenu, limites de débit.",
        proofs: [
          {
            href: "/projets/nexora",
            label: "Tests d’IDOR et de redirection ouverte dans NEXORA",
          },
        ],
      },
    ],
  },

  learn: {
    title: "Ce que je viens chercher",
    body: "Mes projets, je les ai menés seul. Ce qui me manque, c’est ce qu’on n’apprend qu’en entreprise :",
    items: [
      "travailler en équipe, avec des revues de code et des décisions partagées ;",
      "un produit avec de vrais utilisateurs, un historique et des contraintes réelles ;",
      "un encadrement technique qui me fasse progresser plus vite que seul.",
    ],
  },

  practical: {
    title: "Côté entreprise",
    items: [
      {
        title: "Le rythme",
        body: "Il dépend de l’école. On le choisit ensemble pour qu’il convienne à votre équipe.",
      },
      {
        title: "La formation",
        body: "En contrat d’apprentissage, son coût est financé par l’OPCO de l’entreprise, selon le niveau de prise en charge fixé pour le diplôme.",
      },
      {
        title: "L’entretien",
        body: "Je peux présenter mon code en direct et répondre à vos questions techniques sur chaque choix.",
      },
    ],
  },

  cta: {
    title: "Une offre, une question ?",
    body: "Envoyez-moi l’offre ou un simple message : je réponds rapidement.",
    contact: { href: "/contact", label: "Me contacter" },
    cv: { href: "/cv", label: "Voir mon CV" },
  },
} as const;
