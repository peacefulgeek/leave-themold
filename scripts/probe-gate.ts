import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
import { runQualityGate } from "../server/lib/qualityGate.ts";
async function main() {
  const a = await composeArticle("what-is-cirs");
  console.log("words:", a.wordCount);
  const g = runQualityGate(a.body, { minWords: 1500 });
  console.log("ok:", g.ok, "reason:", g.reason);
  console.log("first 12 hits:", g.hits.slice(0,12));
}
main().catch(e => { console.error(e); process.exit(1); });
