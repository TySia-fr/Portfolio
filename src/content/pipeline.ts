import { site } from "./site";

/**
 * The delivery pipeline as configured in the repository. Each step names the
 * file that implements it, so every claim can be checked.
 * It describes the process, not the live state of the server.
 */
const blob = (path: string) => `${site.repositoryUrl}/blob/main/${path}`;

export const pipeline = {
  title: "De git push à la production",
  intro:
    "Chaque modification suit le même chemin, sans intervention manuelle. Si une étape échoue, la suivante ne démarre pas.",
  caption:
    "Ce schéma décrit le processus configuré dans le dépôt, pas l’état en direct du serveur.",
  sourceLabel: "Voir le fichier",
  steps: [
    {
      id: "push",
      name: "GitHub",
      action: "git push sur main",
      detail: "Le code et l’historique sont publics.",
      file: { label: "dépôt", href: site.repositoryUrl },
    },
    {
      id: "ci",
      name: "GitHub Actions",
      action: "Vérifier",
      detail:
        "Lint, format, types et build, puis tests de bout en bout sur l’image Docker.",
      file: { label: "ci.yml", href: blob(".github/workflows/ci.yml") },
    },
    {
      id: "image",
      name: "Image Docker",
      action: "Publier",
      detail:
        "Multi-étapes, utilisateur non root. Publiée sur GHCR avec le SHA du commit.",
      file: { label: "Dockerfile", href: blob("Dockerfile") },
    },
    {
      id: "deploy",
      name: "deploy.sh",
      action: "Déployer",
      detail:
        "Clé SSH limitée à ce script. Il refuse tout sauf un SHA, puis revient à la version précédente si la nouvelle n’est pas saine.",
      file: { label: "deploy.sh", href: blob("deploy/deploy.sh") },
    },
    {
      id: "serve",
      name: "VPS · Nginx",
      action: "Servir",
      detail:
        "HTTPS Let’s Encrypt. Nginx relaie vers le conteneur, joignable seulement en local.",
      file: { label: "nginx", href: blob("deploy/nginx/siavashizadi.com.conf") },
    },
  ],
} as const;
