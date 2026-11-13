import type { Locale } from "@/i18n/config";
import type { Widen } from "@/i18n/types";

import { alternance } from "./alternance";
import { openToRoles } from "./en/open-to-roles";

/** What Siavash is looking for: an alternance in French, open roles in English. */
export const opportunities: Record<Locale, Widen<typeof alternance>> = {
  fr: alternance,
  en: openToRoles,
};
