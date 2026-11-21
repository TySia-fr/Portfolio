import { applyflow } from "./applyflow";
import { nexora } from "./nexora";
import { portfolio } from "./portfolio";
import { prixAuMetre } from "./prix-au-metre";

/** English case studies, same order and slugs as ../../projects/index.ts. */
export const projectSourcesEn = [nexora, prixAuMetre, portfolio, applyflow] as const;
