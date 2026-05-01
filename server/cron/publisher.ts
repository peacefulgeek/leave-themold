import { ALL_TOPICS } from "../lib/topicCatalog";
import { composeArticle } from "../lib/writer";
import { existsSlug, upsertArticle, totalCount } from "../lib/articleDb";
import { logCronStart, logCronFinish } from "./runLog";

export async function runPublisher(
  phase: "phase1" | "phase2" = "phase1",
): Promise<{ slug: string | null; wordCount: number; published: number }> {
  const id = await logCronStart(`publisher_${phase}`);
  try {
    if (process.env.AUTO_GEN_ENABLED !== "true") {
      await logCronFinish(id, true, "AUTO_GEN_ENABLED!=true; skipped");
      return { slug: null, wordCount: 0, published: await totalCount() };
    }
    const currentTotal = await totalCount();
    // Phase-2 publisher only acts after the site already holds ≥60 articles
    // (per master scope §22B — protects authority signal during ramp-up).
    if (phase === "phase2" && currentTotal < 60) {
      await logCronFinish(
        id,
        true,
        `phase2 gated: published_count=${currentTotal} < 60`,
      );
      return { slug: null, wordCount: 0, published: currentTotal };
    }
    // Pick first topic that hasn't been published yet
    let next: string | null = null;
    for (const t of ALL_TOPICS) {
      if (!(await existsSlug(t.slug))) {
        next = t.slug;
        break;
      }
    }
    if (!next) {
      await logCronFinish(id, true, "no_unpublished_topics");
      return { slug: null, wordCount: 0, published: currentTotal };
    }
    const article = await composeArticle(next);
    await upsertArticle({
      slug: article.slug,
      title: article.title,
      body: article.body,
      tldr: article.tldr,
      metaDescription: article.metaDescription,
      category: article.category,
      tags: article.tags,
      status: "published",
      heroUrl: article.heroUrl,
      heroAlt: article.title,
      asinsUsed: article.asinsUsed,
      wordCount: article.wordCount,
      readingTime: Math.max(3, Math.round(article.wordCount / 230)),
      publishedAt: new Date(),
      lastModifiedAt: new Date(),
      queuedAt: new Date(),
    });
    await logCronFinish(
      id,
      true,
      `published ${article.slug} (${article.wordCount} words)`,
    );
    return { slug: article.slug, wordCount: article.wordCount, published: currentTotal + 1 };
  } catch (e: any) {
    await logCronFinish(id, false, String(e?.message || e));
    throw e;
  }
}
