import type { Widen } from "@/i18n/types";

import type { pipeline as fr } from "../pipeline";
import { site } from "../site";

const blob = (path: string) => `${site.repositoryUrl}/blob/main/${path}`;

/** The delivery pipeline in English. Each step names the file that implements it. */
export const pipeline = {
  title: "From git push to production",
  intro:
    "Every change takes the same path, with no manual step. If a stage fails, the next one does not start.",
  caption:
    "This diagram describes the process configured in the repository, not the live state of the server.",
  sourceLabel: "View the file",
  steps: [
    {
      id: "push",
      name: "GitHub",
      action: "git push to main",
      detail: "The code and its history are public.",
      file: { label: "repository", href: site.repositoryUrl },
    },
    {
      id: "ci",
      name: "GitHub Actions",
      action: "Check",
      detail: "Lint, format, types and build, then end-to-end tests on the Docker image.",
      file: { label: "ci.yml", href: blob(".github/workflows/ci.yml") },
    },
    {
      id: "image",
      name: "Docker image",
      action: "Publish",
      detail:
        "Multi-stage, non-root user. Published to GHCR, tagged with the commit SHA.",
      file: { label: "Dockerfile", href: blob("Dockerfile") },
    },
    {
      id: "deploy",
      name: "deploy.sh",
      action: "Deploy",
      detail:
        "SSH key restricted to this script. It accepts nothing but a SHA, and rolls back to the previous version if the new one is not healthy.",
      file: { label: "deploy.sh", href: blob("deploy/deploy.sh") },
    },
    {
      id: "serve",
      name: "VPS · Nginx",
      action: "Serve",
      detail:
        "HTTPS with Let’s Encrypt. Nginx proxies to the container, which is reachable locally only.",
      file: { label: "nginx", href: blob("deploy/nginx/siavashizadi.com.conf") },
    },
  ],
} as const satisfies Widen<typeof fr>;
