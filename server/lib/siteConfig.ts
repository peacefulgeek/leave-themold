// Site-level configuration for leavethemold.com (master scope §9 says Bunny
// credentials are inlined in code, NOT env). All values here are the source
// of truth for canonical URLs, OG/Twitter meta, sitemap, RSS, and JSON-LD.

export const SITE = {
  apex: "leavethemold.com",
  brand: "The Mold Truth",
  tagline: "Leave the Mold — honest CIRS, mold illness, and biotoxin recovery",
  niche: "CIRS / Mold Illness / Biotoxin Illness",
  repo: "peacefulgeek/leave-themold",
  author: {
    name: "The Oracle Lover",
    title: "The Oracle Lover — Intuitive Educator & Oracle Guide",
    url: "https://theoraclelover.com",
    credential:
      "researcher and patient advocate, eight years inside the CIRS protocol",
  },
  bunny: {
    // Per master scope §9: hardcoded, not env vars.
    // Replace these three when the Bunny zone is provisioned.
    storageZone: "leave-the-mold",
    apiKey: "REPLACE-WITH-BUNNY-STORAGE-PASSWORD",
    pullZone: "https://leave-the-mold.b-cdn.net",
    storageHost: "https://ny.storage.bunnycdn.com",
  },
  amazonTag: "spankyspinola-20",
  health: `DISCLAIMER: leavethemold.com is for educational purposes only and does not constitute medical advice. CIRS and mold illness involve contested diagnoses in mainstream medicine. Work with qualified practitioners for diagnosis and treatment.`,
} as const;

export const APEX_URL = `https://${SITE.apex}`;

export function canonical(path: string): string {
  return `${APEX_URL}${path.startsWith("/") ? path : "/" + path}`;
}

export function bunnyImage(slug: string): string {
  return `${SITE.bunny.pullZone}/images/${slug}.webp`;
}

export function bunnyLibrary(idx: number | string): string {
  const n = typeof idx === "number" ? String(idx).padStart(2, "0") : idx;
  return `${SITE.bunny.pullZone}/library/lib-${n}.webp`;
}
