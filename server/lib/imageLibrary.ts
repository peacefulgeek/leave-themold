// Curated, light, hopeful editorial photo library.
// All assets are served from the platform CDN (NOT from the repo) — they are
// generated once and the URLs persist with the project lifecycle.

export const IMAGE_LIBRARY: string[] = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-01-3tkSQZCbtg8qCEjSaESFAu.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-02-Vy4m7ggucfp6TpUytL9BbC.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-03-hpcuY87DAQQJbFTRpc62s7.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-04-V8Rt99cPEwZRDYuZkZNzoV.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-05-6WheK3qcwNLRJyd9S3YJTQ.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-06-jBiLkwXJpEp4GB3GkWjwZR.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-07-A3Vs2jvbg3ZWCYX94H3HHD.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-08-Hgnq2RKxAsjA75NBSoL8m7.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-09-BZViypxsLqFQRrbVhJU2Um.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-10-54JHGtexddSSM4UFQzJuGj.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-11-97UW4tgaXFg8ofY5QRiLfa.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-12-ZqwndpsaP2iT7zS9XUAEzd.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-13-agX7mKx34N8Nteu6yfTHa9.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-14-85DcNAAynQWaa5biQTVVyD.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/lib-15-DPBQfV92UZGPHPEefY8qqu.webp",
];

export const AUTHOR_PHOTO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/author-nGinXQxZr5cfQDMguMSLzi.webp";

export const LOGO_MARK =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309220512/KSYP2suNBqxpqBwCQMxZpZ/logo-mark-VJLPm36MAUUVnR7nWY7Ljf.webp";

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
