import { getRawPool } from "../db";

async function q(sql: string, params: any[] = []): Promise<any> {
  const pool = await getRawPool();
  return await new Promise<any>((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

export async function logCronStart(job: string): Promise<number | null> {
  try {
    const r: any = await q(
      "INSERT INTO cron_runs (job, ok, startedAt) VALUES (?, 0, NOW())",
      [job],
    );
    return Number(r?.insertId || 0) || null;
  } catch (e) {
    console.warn("[cron] logCronStart failed:", (e as any)?.message);
    return null;
  }
}

export async function logCronFinish(
  id: number | null,
  ok: boolean,
  message: string,
): Promise<void> {
  if (!id) return;
  try {
    await q(
      "UPDATE cron_runs SET ok = ?, finishedAt = NOW(), message = ? WHERE id = ?",
      [ok ? 1 : 0, String(message || "").slice(0, 1000), id],
    );
  } catch (e) {
    console.warn("[cron] logCronFinish failed:", (e as any)?.message);
  }
}

export async function recentRuns(job?: string, limit = 25): Promise<any[]> {
  try {
    const sql = job
      ? "SELECT * FROM cron_runs WHERE job = ? ORDER BY startedAt DESC LIMIT ?"
      : "SELECT * FROM cron_runs ORDER BY startedAt DESC LIMIT ?";
    const params = job ? [job, limit] : [limit];
    const rows = await q(sql, params);
    return Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.warn("[cron] recentRuns failed:", (e as any)?.message);
    return [];
  }
}
