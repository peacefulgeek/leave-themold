// Re-runs after Bunny is provisioned. Deterministically rebuilds every
// article's heroUrl from pickHeroForSlug() (which now returns Bunny URLs).
import "dotenv/config";
import mysql from "mysql2/promise";
import { pickHeroForSlug } from "../server/lib/imageLibrary";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const u = new URL(url);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: u.username,
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  });
  const [rows] = await conn.execute("SELECT slug FROM articles");
  let updated = 0;
  for (const r of rows as Array<{ slug: string }>) {
    const hero = pickHeroForSlug(r.slug);
    await conn.execute("UPDATE articles SET heroUrl = ? WHERE slug = ?", [hero, r.slug]);
    updated++;
  }
  console.log(`[repoint-bunny] updated ${updated} heroUrls`);
  // Sanity: print 5
  const [sample] = await conn.execute(
    "SELECT slug, heroUrl FROM articles ORDER BY RAND() LIMIT 5",
  );
  console.table(sample);
  await conn.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
