import "server-only";

import { getContent } from "@/content";
import { site as baseSite } from "@/content/site";
import { type Locale, localeInfo } from "@/i18n/config";
import { href } from "@/i18n/routes";

/**
 * schema.org data for search engines (JSON-LD). It tells Google that this site
 * belongs to one person, what their name is in both scripts, and which other
 * profiles are theirs (sameAs). Only facts stated elsewhere on the site.
 */
const personId = `${baseSite.url}/#person`;
const websiteId = `${baseSite.url}/#website`;

export function siteGraph(locale: Locale) {
  const { about, site } = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: [site.nameFa],
        givenName: site.givenName,
        familyName: site.familyName,
        url: site.url,
        image: `${site.url}${site.portrait.base}-${site.portrait.size}.webp`,
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        homeLocation: { "@type": "Country", name: site.location },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Islamic Azad University",
          alternateName: "Université Azad Islamique",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Tehran",
            addressCountry: "IR",
          },
        },
        // As stated on the ENIC-NARIC France attestation de comparabilité (2026).
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: "Karshenasi (licence) en génie informatique – logiciels",
          credentialCategory: "degree",
          educationalLevel: "EQF level 6",
          dateCreated: "2024-09-18",
          recognizedBy: {
            "@type": "Organization",
            name: "ENIC-NARIC France (France Éducation international)",
            url: "https://www.france-education-international.fr/enic-naric-france",
          },
        },
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Université de Montpellier",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Montpellier",
            addressCountry: "FR",
          },
        },
        knowsAbout: about.interests.items.map((item) => item.title),
        sameAs: [site.githubUrl, site.linkedinUrl],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        alternateName: [site.nameFa, "siavashizadi.com"],
        inLanguage: ["fr-FR", "en-US"],
        publisher: { "@id": personId },
      },
    ],
  };
}

/** The About page is the person's profile page. */
export function profilePageData(locale: Locale) {
  const { site } = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}${href(locale, "about")}`,
    inLanguage: localeInfo[locale].bcp47,
    isPartOf: { "@id": websiteId },
    // Repeats the name next to the reference, so the page stands on its own
    // even for parsers that do not join @id references across script blocks.
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      alternateName: [site.nameFa],
    },
  };
}

/** Serialises JSON-LD for a <script> tag. "<" is escaped so no value can close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
