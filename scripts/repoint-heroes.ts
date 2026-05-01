import "dotenv/config";
import mysql from "mysql2/promise";
import { pickHeroForSlug } from "../server/lib/imageLibrary";

async function main() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true },
  });
  const [rows] = await conn.query("SELECT id, slug FROM articles");
  let n = 0;
  for (const r of rows as Array<{ id: number; slug: string }>) {
    const url = pickHeroForSlug(r.slug);
    await conn.execute("UPDATE articles SET heroUrl=? WHERE id=?", [url, r.id]);
    n++;
  }
  console.log(`[repoint-heroes] updated ${n} rows`);
  await conn.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
