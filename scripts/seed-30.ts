#!/usr/bin/env node
// Seeds the 30 phase-1 articles. Back-dates publishedAt across the last
// 14 days so the site never looks like a one-day content dump (Google
// authority demotion risk per master scope §22B).
//
// Run from the project root with:  node scripts/seed-30.mjs

import "dotenv/config";
import { PHASE_1_TOPICS } from "../server/lib/topicCatalog.ts";
import { composeArticle } from "../server/lib/writer.ts";
import { upsertArticle, existsSlug, totalCount } from "../server/lib/articleDb.ts";

const TARGET = 30;
const DAYS = 14; // spread across the last fortnight
const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

function backdatedTimestamp(i, total) {
  // Distribute "i" across "total" slots over the last DAYS days, with a
  // jitter so multiple articles fall on the same day organically.
  const dayOffset = Math.floor((i / (total - 1)) * (DAYS - 1)); // 0..DAYS-1
  const jitterHours = (i * 137) % 24;
  const jitterMin = (i * 53) % 60;
  const t = new Date(NOW - dayOffset * DAY_MS);
  t.setUTCHours(jitterHours, jitterMin, 0, 0);
  return t;
}

const topics = PHASE_1_TOPICS.slice(0, TARGET);
console.log(`[seed] generating ${topics.length} articles…`);

let i = 0;
for (const t of topics) {
  i++;
  const ts = backdatedTimestamp(i - 1, topics.length);
  if (await existsSlug(t.slug)) {
    console.log(`[seed] (${i}/${topics.length}) skip existing: ${t.slug}`);
    continue;
  }
  try {
    console.log(`[seed] (${i}/${topics.length}) writing: ${t.slug} for ${ts.toISOString().slice(0,10)}`);
    const a = await composeArticle(t.slug);
    await upsertArticle({
      slug: a.slug,
      title: a.title,
      body: a.body,
      tldr: a.tldr,
      metaDescription: a.metaDescription,
      category: a.category,
      tags: a.tags,
      status: "published",
      heroUrl: a.heroUrl,
      heroAlt: a.title,
      asinsUsed: a.asinsUsed,
      wordCount: a.wordCount,
      readingTime: Math.max(3, Math.round(a.wordCount / 230)),
      publishedAt: ts,
      lastModifiedAt: ts,
      queuedAt: ts,
    });
    console.log(`[seed]  ↳ ok  (${a.wordCount} words)`);
  } catch (e) {
    console.error(`[seed]  ↳ ERR`, e?.message || e);
  }
}

const c = await totalCount();
console.log(`[seed] total published: ${c}`);
process.exit(0);
