import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { articles, type InsertArticle, type Article } from "../../drizzle/schema";

export async function listPublished(limit = 200): Promise<Article[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function listByCategory(category: string, limit = 50): Promise<Article[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.status, "published"), eq(articles.category, category)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function findBySlug(slug: string): Promise<Article | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0];
}

export async function existsSlug(slug: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug)).limit(1);
  return rows.length > 0;
}

export async function insertArticle(row: InsertArticle): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(articles).values(row);
}

export async function upsertArticle(row: InsertArticle): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  if (await existsSlug(row.slug)) {
    await db
      .update(articles)
      .set({
        title: row.title,
        body: row.body,
        tldr: row.tldr,
        metaDescription: row.metaDescription,
        category: row.category,
        tags: row.tags,
        status: row.status,
        heroUrl: row.heroUrl,
        asinsUsed: row.asinsUsed,
        wordCount: row.wordCount,
        publishedAt: row.publishedAt,
        lastModifiedAt: new Date(),
      })
      .where(eq(articles.slug, row.slug));
  } else {
    await db.insert(articles).values(row);
  }
}

export async function listArticleSlugs(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ s: articles.slug }).from(articles);
  return rows.map(r => String(r.s));
}

export async function totalCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(articles)
    .where(eq(articles.status, "published"));
  return Number(rows[0]?.c || 0);
}

export async function listGroupedByDay(): Promise<{ day: string; n: number }[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.execute(sql`
    SELECT DATE(publishedAt) as day, COUNT(*) as n
    FROM articles
    WHERE status = 'published' AND publishedAt IS NOT NULL
    GROUP BY DATE(publishedAt)
    ORDER BY day ASC`);
  // drizzle-mysql returns rows as plain objects
  return (rows as any).rows
    ? (rows as any).rows.map((r: any) => ({ day: String(r.day), n: Number(r.n) }))
    : (rows as any).map((r: any) => ({ day: String(r.day), n: Number(r.n) }));
}
