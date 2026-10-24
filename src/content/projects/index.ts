import { portfolio } from "./portfolio";

/**
 * Registry of every project, as raw content. Add a file in this folder and
 * list it here. It is parsed and validated in src/lib/projects.ts; src/proxy.ts
 * reads the slugs from this same list, so there is one registry, not two.
 */
export const projectSources = [portfolio] as const;
