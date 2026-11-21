import { applyflow } from "./applyflow";
import { nexora } from "./nexora";
import { portfolio } from "./portfolio";
import { prixAuMetre } from "./prix-au-metre";

/** Persian case studies, same order and slugs as ../../projects/index.ts. */
export const projectSourcesFa = [nexora, prixAuMetre, portfolio, applyflow] as const;
