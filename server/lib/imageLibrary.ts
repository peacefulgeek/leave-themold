// Hero image library — Bunny CDN only (master scope §9).
//
// All 15 source webps live at /library/lib-NN.webp on the leave-mold storage
// zone, exposed publicly via https://leave-mold.b-cdn.net/library/.  Per-article
// hero copies are written to /images/{slug}.webp by the publisher cron when
// the BUNNY_KEY env var is set; if the key isn't present we still serve the
// canonical library URL — the page never breaks.

import { SITE, bunnyLibrary } from "./siteConfig";

const LIB_COUNT = 15;

export const IMAGE_LIBRARY: string[] = Array.from({ length: LIB_COUNT }, (_, i) =>
  bunnyLibrary(i + 1),
);

export const AUTHOR_PHOTO = `${SITE.bunny.pullZone}/library/author.webp`;
export const LOGO_MARK = `${SITE.bunny.pullZone}/library/logo-mark.webp`;

/** Deterministic hero pick by slug — same article always shows same hero. */
export function pickHeroForSlug(slug: string, salt = 0): string {
  let h = 0;
  const s = `${slug}:${salt}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return IMAGE_LIBRARY[h % IMAGE_LIBRARY.length];
}

/** Second image for the in-article gallery (different from hero). */
export function pickInlineForSlug(slug: string): string {
  const hero = pickHeroForSlug(slug, 0);
  let alt = pickHeroForSlug(slug, 7);
  let salt = 7;
  while (alt === hero && salt < 50) {
    salt++;
    alt = pickHeroForSlug(slug, salt);
  }
  return alt;
}

/** Mirror a chosen library image to /images/{slug}.webp on Bunny.
 *  Falls back to the canonical library URL when BUNNY_KEY isn't configured
 *  or the upload fails — pages always render correctly.
 */
export async function assignHeroImage(slug: string): Promise<string> {
  const library = pickHeroForSlug(slug);
  const key = SITE.bunny.apiKey;
  if (!key) return library;
  try {
    const dl = await fetch(library);
    if (!dl.ok) throw new Error(`download ${dl.status}`);
    const buf = await dl.arrayBuffer();
    const host = SITE.bunny.storageHost.replace(/^https?:\/\//, "");
    const upUrl = `https://${host}/${SITE.bunny.storageZone}/images/${slug}.webp`;
    const up = await fetch(upUrl, {
      method: "PUT",
      headers: {
        AccessKey: key,
        "Content-Type": "image/webp",
      },
      body: buf,
    });
    if (!up.ok) throw new Error(`upload ${up.status}`);
    return `${SITE.bunny.pullZone}/images/${slug}.webp`;
  } catch {
    return library;
  }
}
