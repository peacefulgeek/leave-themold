// Site-level configuration. Apex + Bunny + author identity in one place.
// NOTE: Per master scope §9, Bunny credentials are intentionally hardcoded
// (NOT in env) to keep the lib portable across deploys.

export const SITE = {
  apex: "themoldtruth.com",
  brand: "The Mold Truth",
  tagline: "Honest CIRS, Mold Illness, and Biotoxin Recovery",
  niche: "CIRS / Mold Illness / Biotoxin Illness",
  author: {
    name: "The Oracle Lover",
    title: "The Oracle Lover — Intuitive Educator & Oracle Guide",
    url: "https://theoraclelover.com",
    credential: "researcher and patient advocate, eight years inside the CIRS protocol",
  },
  bunny: {
    storageZone: "the-mold-truth",
    apiKey: "REPLACE-WITH-BUNNY-KEY",
    pullZone: "https://the-mold-truth.b-cdn.net",
    storageHost: "https://ny.storage.bunnycdn.com",
  },
  amazonTag: "spankyspinola-20",
  health: `DISCLAIMER: themoldtruth.com is for educational purposes only and does not constitute medical advice. CIRS and mold illness involve contested diagnoses in mainstream medicine. Work with qualified practitioners for diagnosis and treatment.`,
} as const;

export const APEX_URL = `https://${SITE.apex}`;

export function canonical(path: string): string {
  return `${APEX_URL}${path.startsWith("/") ? path : "/" + path}`;
}
