import { logCronStart, logCronFinish } from "./runLog";
import { listPublished } from "../lib/articleDb";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Monthly: bump lastModifiedAt on the 5 oldest articles so the sitemap
 * <lastmod> stays fresh and crawlers re-fetch them.
 */
export async function runMonthlyRefresh() {
  const id = await logCronStart("refresh_monthly");
  try {
    const db = await getDb();
    if (!db) {
      await logCronFinish(id, true, "no_db; skipped");
      return { refreshed: 0 };
    }
    const rows = await listPublished(500);
    rows.sort((a, b) => +(a.lastModifiedAt || 0) - +(b.lastModifiedAt || 0));
    const oldest = rows.slice(0, 5);
    for (const r of oldest) {
      await db
        .update(articles)
        .set({ lastModifiedAt: new Date() })
        .where(eq(articles.id, r.id));
    }
    await logCronFinish(id, true, `refreshed ${oldest.length}`);
    return { refreshed: oldest.length };
  } catch (e: any) {
    await logCronFinish(id, false, String(e?.message || e));
    throw e;
  }
}
