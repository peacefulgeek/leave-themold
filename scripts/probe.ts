import "dotenv/config";
import { composeArticle } from "/home/ubuntu/the-mold-truth/server/lib/writer.ts";
async function main(){
  const a = await composeArticle("what-is-cirs");
  console.log("ok", a.slug, "words=", a.wordCount, "hero=", a.heroUrl.slice(0, 60));
  console.log("body bytes:", a.body.length);
  console.log("body head:", a.body.slice(0, 300));
}
main().catch((e) => { console.error("FAIL:", e?.message || e); process.exit(1); });
