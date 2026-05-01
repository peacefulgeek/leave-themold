import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
import { runQualityGate } from "../server/lib/qualityGate.ts";
import { PHASE_1_TOPICS } from "../server/lib/topicCatalog.ts";

async function main() {
  const failing: { slug: string; words: number; hits: string[] }[] = [];
  for (const t of PHASE_1_TOPICS) {
    const a = await composeArticle(t.slug);
    const g = runQualityGate(a.body, { minWords: 1500 });
    if (!g.ok) {
      failing.push({ slug: t.slug, words: a.wordCount, hits: g.hits.slice(0,5).map(h=>h.phrase) });
    }
  }
  console.log("\n=== Gate sweep ===");
  console.log("total:", PHASE_1_TOPICS.length, "failing:", failing.length);
  for (const f of failing) console.log("FAIL", f.slug, `words=${f.words}`, f.hits);
}
main().catch(e => { console.error(e); process.exit(1); });
