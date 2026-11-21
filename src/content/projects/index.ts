import { applyflow } from "./applyflow";
import { nexora } from "./nexora";
import { portfolio } from "./portfolio";
import { prixAuMetre } from "./prix-au-metre";

/**
 * Registry of every project, as raw content. Add a file in this folder and
 * list it here. It is parsed and validated in src/lib/projects.ts; src/proxy.ts
 * reads the slugs from this same list, so there is one registry, not two.
 * Order = display order among projects of the same year.
 */
export const projectSources = [nexora, prixAuMetre, portfolio, applyflow] as const;
