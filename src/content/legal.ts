/**
 * Mentions légales and privacy notice (French law: LCEN art. 6, RGPD).
 * Host details checked against Hetzner's own legal notice on 2026-10-24:
 * https://www.hetzner.com/de/legal/impressum/
 * Keep this page in sync with reality: if analytics, cookies or a contact
 * form are added, the privacy section must change in the same commit.
 */
export const legal = {
  title: "Mentions légales",
  description:
    "Mentions légales et politique de confidentialité du site siavashizadi.com : éditeur, hébergeur et données personnelles.",
  updated: "2026-10-24",
  updatedLabel: "Dernière mise à jour",
  contactTitle: "Contact",

  sections: [
    {
      id: "editeur",
      title: "Éditeur du site",
      paragraphs: [
        "Ce site est un site personnel, non commercial, édité par Siavash Izadi, particulier résidant en France.",
        "Directeur de la publication : Siavash Izadi.",
      ],
    },
    {
      id: "hebergeur",
      title: "Hébergement",
      paragraphs: [
        "Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne. Téléphone : +49 (0)9831 505-0.",
        "Le serveur est situé dans un centre de données à Helsinki (Finlande), dans l’Union européenne.",
      ],
    },
    {
      id: "donnees",
      title: "Données personnelles",
      paragraphs: [
        "Ce site n’utilise aucun cookie, aucun outil de mesure d’audience et aucun traceur publicitaire. Les polices de caractères sont servies par le site lui-même : aucune requête n’est envoyée à un service tiers pendant votre visite.",
        "Comme tout serveur web, le serveur enregistre des journaux techniques (adresse IP, date, page demandée, navigateur). Ils servent uniquement à la sécurité et au bon fonctionnement du site, ne sont jamais partagés et sont supprimés automatiquement après une durée limitée.",
        "Si vous m’écrivez par e-mail, votre adresse et votre message sont utilisés uniquement pour vous répondre. Les e-mails adressés à l’adresse de contact sont transférés via le service de routage d’e-mails de Cloudflare.",
        "Formulaire de contact : votre nom, votre adresse e-mail et votre message me sont transmis par e-mail via le service d’envoi Resend (Resend, Inc., États-Unis), qui agit comme sous-traitant pour l’acheminement. Le site ne les enregistre pas : ils sont conservés uniquement dans ma boîte de réception, le temps de notre échange. Pour limiter les abus, l’adresse IP de l’expéditeur est gardée en mémoire au plus une heure, sans être écrite sur disque.",
        "Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression des données vous concernant en écrivant à l’adresse de contact. Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr).",
      ],
    },
    {
      id: "propriete",
      title: "Propriété intellectuelle",
      paragraphs: [
        "Les textes de ce site sont la propriété de leur auteur. Le code source est consultable publiquement sur GitHub ; sa réutilisation est soumise aux conditions indiquées dans le dépôt.",
      ],
    },
  ],
} as const;
