#!/usr/bin/env node
// Bulk seed: queues a draft for every topic in ALL_TOPICS that isn't already in
// the DB. Status is 'queued' (NOT 'published') so the cron releases them at
// 5/day. Idempotent — safe to re-run.
import "dotenv/config";
import { ALL_TOPICS } from "../server/lib/topicCatalog";
import { composeArticle } from "../server/lib/writer";
import { upsertArticle, existsSlug } from "../server/lib/articleDb";

async function main() {
  const total = ALL_TOPICS.length;
  let created = 0, skipped = 0, failed = 0, i = 0;
  console.log(`[bulk-seed] target=${total} topics`);
  for (const t of ALL_TOPICS) {
    i++;
    if (await existsSlug(t.slug)) { skipped++; continue; }
    try {
      const a = await composeArticle(t.slug);
      await upsertArticle({
        slug: a.slug,
        title: a.title,
        body: a.body,
        tldr: a.tldr,
        metaDescription: a.metaDescription,
        category: a.category,
        tags: a.tags,
        status: "queued",
        heroUrl: a.heroUrl,
        heroAlt: a.title,
        asinsUsed: a.asinsUsed,
        wordCount: a.wordCount,
        readingTime: Math.max(3, Math.round(a.wordCount / 230)),
        queuedAt: new Date(),
      });
      created++;
      if (created % 25 === 0) console.log(`[bulk-seed] ${i}/${total}  queued=${created}  skipped=${skipped}  failed=${failed}`);
    } catch (e: any) {
      failed++;
      console.error(`[bulk-seed-error] ${t.slug}:`, e?.message || e);
    }
  }
  console.log(`[bulk-seed-done] queued=${created}  skipped=${skipped}  failed=${failed}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
