import type { Widen } from "@/i18n/types";

import type { legal as fr } from "../legal";

/**
 * English translation of the legal notice and privacy policy. The French page
 * is the one required by French law (LCEN, RGPD); this one says the same
 * things. Keep both in sync in the same commit.
 */
export const legal = {
  title: "Legal notice",
  description:
    "Legal notice and privacy policy of siavashizadi.com: publisher, host and personal data.",
  updated: "2026-11-13",
  updatedLabel: "Last updated",
  contactTitle: "Contact",

  sections: [
    {
      id: "editeur",
      title: "Publisher",
      paragraphs: [
        "This is a personal, non-commercial website published by Siavash Izadi, a private individual living in France.",
        "Publication director: Siavash Izadi.",
      ],
    },
    {
      id: "hebergeur",
      title: "Hosting",
      paragraphs: [
        "Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany. Phone: +49 (0)9831 505-0.",
        "The server is located in a data center in Helsinki (Finland), in the European Union.",
      ],
    },
    {
      id: "donnees",
      title: "Personal data",
      paragraphs: [
        "This site uses no audience measurement and no advertising tracker. A single cookie may be set, and only if you change language with the FR / EN switcher: it remembers your choice (“lang”, one year) and is used for nothing else. Fonts are served by the site itself: no request is sent to a third-party service during your visit.",
        "Like any web server, the server keeps technical logs (IP address, date, requested page, browser). They are used only for security and to keep the site running, are never shared, and are deleted automatically after a limited time.",
        "If you email me, your address and your message are used only to reply to you. Emails sent to the contact address are forwarded by Cloudflare’s email routing service.",
        "Contact form: your name, email address and message are sent to me by email through the Resend delivery service (Resend, Inc., United States), which acts as a processor for delivery. The site does not store them: they are kept only in my inbox, for as long as our conversation lasts. To limit abuse, the sender’s IP address is kept in memory for at most one hour, never written to disk.",
        "Under the GDPR, you can ask to access, correct or delete your data by writing to the contact address. You can also lodge a complaint with the CNIL, the French data protection authority (www.cnil.fr).",
      ],
    },
    {
      id: "propriete",
      title: "Intellectual property",
      paragraphs: [
        "The texts on this site belong to their author. The source code is public on GitHub; reusing it is subject to the terms stated in the repository.",
      ],
    },
  ],
} as const satisfies Widen<typeof fr>;
