import "dotenv/config";
import { composeArticle } from "../server/lib/writer";
import { upsertArticle, totalCount } from "../server/lib/articleDb";

async function main() {
  const a = await composeArticle("what-is-cirs");
  console.log("composed", a.slug, "words=", a.wordCount);
  try {
    await upsertArticle({
      slug: a.slug, title: a.title, body: a.body, tldr: a.tldr,
      metaDescription: a.metaDescription, category: a.category, tags: a.tags,
      status: "published", heroUrl: a.heroUrl, heroAlt: a.title,
      asinsUsed: a.asinsUsed, wordCount: a.wordCount, readingTime: 7,
      publishedAt: new Date(), lastModifiedAt: new Date(), queuedAt: new Date(),
    });
    console.log("inserted ok");
  } catch (e: any) {
    console.error("INSERT ERR full:", e);
    console.error("CAUSE:", e?.cause);
  }
  console.log("total=", await totalCount());
}
main();
