import type { Widen } from "@/i18n/types";

import type { infrastructure as fr } from "../infrastructure";

/** How a request reaches the site, in English (same configuration as ../infrastructure). */
export const infrastructure = {
  title: "The path of a request",
  caption: "Configuration described by the files in the repository’s deploy/ folder.",
  host: "Hetzner server · Helsinki · Ubuntu",
  nodes: [
    {
      id: "visitor",
      name: "Browser",
      facts: ["HTTPS only (HSTS)"],
    },
    {
      id: "dns",
      name: "Cloudflare DNS",
      facts: ["DNS resolution only, no proxy"],
    },
    {
      id: "nginx",
      name: "Nginx",
      facts: ["Let’s Encrypt TLS", "www and HTTP redirected", "Requests capped at 64 KB"],
      onHost: true,
    },
    {
      id: "app",
      name: "Next.js container",
      facts: [
        "Listens on 127.0.0.1 only",
        "Non-root user, read-only",
        "384 MB memory cap",
      ],
      onHost: true,
    },
  ],
} as const satisfies Widen<typeof fr>;
