// Hero library — every URL points at the leavethemold.com Bunny pull-zone.
// Per master scope §9, images live ONLY on Bunny. The 15 source webps live at
// /library/lib-01.webp ... /library/lib-15.webp on the storage zone, and the
// per-article copy is written to /images/{slug}.webp by the cron.

import { SITE, bunnyLibrary } from "./siteConfig";

const LIB_COUNT = 15;

// Dev mirror — used when Bunny apiKey is the placeholder.  Production swap is
// `pnpm bunny:remap` once SITE.bunny is real.
const DEV_MIRROR: Record<string, string> = {
  "lib-01": "/manus-storage/lib-01_0b84991b.webp",
  "lib-02": "/manus-storage/lib-02_8e6511b8.webp",
  "lib-03": "/manus-storage/lib-03_309d5e26.webp",
  "lib-04": "/manus-storage/lib-04_efea7124.webp",
  "lib-05": "/manus-storage/lib-05_370acb00.webp",
  "lib-06": "/manus-storage/lib-06_29d40374.webp",
  "lib-07": "/manus-storage/lib-07_9abe7060.webp",
  "lib-08": "/manus-storage/lib-08_c4dd7c67.webp",
  "lib-09": "/manus-storage/lib-09_b96a89b8.webp",
  "lib-10": "/manus-storage/lib-10_a7f177bf.webp",
  "lib-11": "/manus-storage/lib-11_e960d244.webp",
  "lib-12": "/manus-storage/lib-12_c1db0412.webp",
  "lib-13": "/manus-storage/lib-13_fb881ac0.webp",
  "lib-14": "/manus-storage/lib-14_0c574279.webp",
  "lib-15": "/manus-storage/lib-15_82d3a4ba.webp",
  author: "/manus-storage/author_aecaa0eb.webp",
  "logo-mark": "/manus-storage/logo-mark_f7a86827.webp",
};
function useMirror(): boolean {
  return !SITE.bunny.apiKey || SITE.bunny.apiKey.startsWith("REPLACE");
}
function libUrl(idx: number): string {
  const key = `lib-${String(idx).padStart(2, "0")}`;
  if (useMirror() && DEV_MIRROR[key]) return DEV_MIRROR[key];
  return bunnyLibrary(idx);
}

export const IMAGE_LIBRARY: string[] = Array.from({ length: LIB_COUNT }, (_, i) => libUrl(i + 1));

export const AUTHOR_PHOTO = useMirror() ? DEV_MIRROR.author! : `${SITE.bunny.pullZone}/library/author.webp`;
export const LOGO_MARK = useMirror() ? DEV_MIRROR["logo-mark"]! : `${SITE.bunny.pullZone}/library/logo-mark.webp`;

/** Deterministic hero pick by slug — keeps the same article showing the same hero. */
export function pickHeroForSlug(slug: string, salt = 0): string {
  let h = 0;
  const s = `${slug}:${salt}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return IMAGE_LIBRARY[h % IMAGE_LIBRARY.length];
}

/** A second image for the in-article gallery (different from hero). */
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

/** Copy a chosen library image to /images/{slug}.webp on Bunny.
 *  Falls back to the library URL itself if Bunny credentials aren't set or the upload fails.
 */
export async function assignHeroImage(slug: string): Promise<string> {
  const library = pickHeroForSlug(slug);
  const dest = `${SITE.bunny.pullZone}/images/${slug}.webp`;
  if (!SITE.bunny.apiKey || SITE.bunny.apiKey.startsWith("REPLACE")) {
    // Bunny credentials not yet provisioned — return the library URL directly.
    return library;
  }
  try {
    const dl = await fetch(library);
    if (!dl.ok) throw new Error(`download ${dl.status}`);
    const buf = await dl.arrayBuffer();
    const host = SITE.bunny.storageHost.replace(/^https?:\/\//, "");
    const upUrl = `https://${host}/${SITE.bunny.storageZone}/images/${slug}.webp`;
    const up = await fetch(upUrl, {
      method: "PUT",
      headers: {
        AccessKey: SITE.bunny.apiKey,
        "Content-Type": "image/webp",
      },
      body: buf,
    });
    if (!up.ok) throw new Error(`upload ${up.status}`);
    return dest;
  } catch {
    return library;
  }
}
