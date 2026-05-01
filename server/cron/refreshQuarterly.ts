import { logCronStart, logCronFinish } from "./runLog";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

/**
 * Quarterly: deeper refresh — touches 25 articles' lastModifiedAt and
 * conceptually flags them for re-scoring on the next manual editorial pass.
 */
export async function runQuarterlyRefresh() {
  const id = await logCronStart("refresh_quarterly");
  try {
    const db = await getDb();
    if (!db) {
      await logCronFinish(id, true, "no_db; skipped");
      return { refreshed: 0 };
    }
    const r: any = await db.execute(
      sql`UPDATE articles SET lastModifiedAt = NOW() WHERE status = 'published' ORDER BY lastModifiedAt ASC LIMIT 25`,
    );
    const n = Number((r as any)?.affectedRows || (r as any)?.[0]?.affectedRows || 0);
    await logCronFinish(id, true, `refreshed ${n}`);
    return { refreshed: n };
  } catch (e: any) {
    await logCronFinish(id, false, String(e?.message || e));
    throw e;
  }
}
