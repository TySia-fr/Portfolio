import "server-only";

import { about } from "@/content/about";
import { site } from "@/content/site";

/**
 * schema.org data for search engines (JSON-LD). It tells Google that this site
 * belongs to one person, what their name is in both scripts, and which other
 * profiles are theirs (sameAs). Only facts stated elsewhere on the site.
 */
const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function siteGraph() {
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
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        homeLocation: { "@type": "Country", name: site.location },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Mehralborz University",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Tehran",
            addressCountry: "IR",
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
        inLanguage: "fr-FR",
        publisher: { "@id": personId },
      },
    ],
  };
}

/** The About page is the person's profile page. */
export function profilePageData() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/a-propos`,
    inLanguage: "fr-FR",
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
