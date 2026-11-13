import type { Locale } from "@/i18n/config";
import type { Widen } from "@/i18n/types";

import { about } from "./about";
import { contact } from "./contact";
import { cv } from "./cv";
import { about as aboutEn } from "./en/about";
import { contact as contactEn } from "./en/contact";
import { cv as cvEn } from "./en/cv";
import { home as homeEn } from "./en/home";
import { infrastructure as infrastructureEn } from "./en/infrastructure";
import { legal as legalEn } from "./en/legal";
import { pipeline as pipelineEn } from "./en/pipeline";
import { projectsPage as projectsPageEn } from "./en/projects-page";
import { site as siteEn } from "./en/site";
import { home } from "./home";
import { infrastructure } from "./infrastructure";
import { legal } from "./legal";
import { pipeline } from "./pipeline";
import { projectsPage } from "./projects-page";
import { site } from "./site";

const fr = {
  site,
  home,
  about,
  contact,
  cv,
  legal,
  pipeline,
  infrastructure,
  projectsPage,
};

/** The copy of every shared page and component, with the same shape in both languages. */
export type Dictionary = Widen<typeof fr>;

const dictionaries: Record<Locale, Dictionary> = {
  fr,
  en: {
    site: siteEn,
    home: homeEn,
    about: aboutEn,
    contact: contactEn,
    cv: cvEn,
    legal: legalEn,
    pipeline: pipelineEn,
    infrastructure: infrastructureEn,
    projectsPage: projectsPageEn,
  },
};

/** Plain data, safe in Server and Client Components alike. */
export function getContent(locale: Locale): Dictionary {
  return dictionaries[locale];
}
