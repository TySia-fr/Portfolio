/**
 * How a request reaches the site, as configured in deploy/ (Nginx, compose) and
 * the DNS records described in docs/learning/02-deploy.fa.md.
 */
export const infrastructure = {
  title: "Le chemin d’une requête",
  caption: "Configuration décrite par les fichiers du dossier deploy/ du dépôt.",
  host: "Serveur Hetzner · Helsinki · Ubuntu",
  nodes: [
    {
      id: "visitor",
      name: "Navigateur",
      facts: ["HTTPS uniquement (HSTS)"],
    },
    {
      id: "dns",
      name: "DNS Cloudflare",
      facts: ["Résolution DNS seulement, sans proxy"],
    },
    {
      id: "nginx",
      name: "Nginx",
      facts: ["TLS Let’s Encrypt", "www et HTTP redirigés", "Requêtes limitées à 64 Ko"],
      onHost: true,
    },
    {
      id: "app",
      name: "Conteneur Next.js",
      facts: [
        "Écoute sur 127.0.0.1 seulement",
        "Utilisateur non root, lecture seule",
        "384 Mo de mémoire maximum",
      ],
      onHost: true,
    },
  ],
} as const;
