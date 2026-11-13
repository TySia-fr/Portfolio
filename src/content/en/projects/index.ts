import { applyflow } from "./applyflow";
import { nexora } from "./nexora";
import { portfolio } from "./portfolio";

/** English case studies, same order and slugs as ../../projects/index.ts. */
export const projectSourcesEn = [nexora, portfolio, applyflow] as const;
