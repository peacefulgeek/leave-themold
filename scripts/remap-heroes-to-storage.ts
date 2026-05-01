// Dev-time mirror: rewrites every published heroUrl to the manus-storage CDN
// so the preview is image-rich today.  Production switches back to Bunny via
// `pnpm bunny:remap`.  The DB stores absolute URLs; the canonical Bunny pattern
// stays in siteConfig.ts as the production target.
import "dotenv/config";
import mysql from "mysql2/promise";

const STORAGE_MAP: Record<string, string> = {
  "lib-01": "/manus-storage/lib-01_0b84991b.webp",
  "lib-02": "/manus-storage/lib-02_8e6511b8.webp",
  "lib-03": "/manus-storage/lib-03_309d5e26.webp",
  "lib-04": "/manus-storage/lib-04_efea7124.webp",
  "lib-05": "/manus-storage/lib-05_370acb00.webp",
  "lib-06": "/manus-storage/lib-06_29d40374.webp",
  "lib-07": "/manus-storage/lib-07_9abe7060.webp",
  "lib-08": "/manus-storage/lib-08_c4dd7c67.webp",
  "lib-09": "/manus-storage/lib-09_b96a89b8.webp",
  "lib-10": "/manus-storage/lib-10_a7f177bf.webp",
  "lib-11": "/manus-storage/lib-11_e960d244.webp",
  "lib-12": "/manus-storage/lib-12_c1db0412.webp",
  "lib-13": "/manus-storage/lib-13_fb881ac0.webp",
  "lib-14": "/manus-storage/lib-14_0c574279.webp",
  "lib-15": "/manus-storage/lib-15_82d3a4ba.webp",
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const u = new URL(url);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: false },
  });

  const [rows] = await conn.execute(
    `SELECT id, slug, heroUrl FROM articles`,
  );
  let updated = 0;
  for (const r of rows as any[]) {
    const m = String(r.heroUrl || "").match(/lib-(\d{2})/);
    if (!m) continue;
    const key = `lib-${m[1]}`;
    const target = STORAGE_MAP[key];
    if (!target || target === r.heroUrl) continue;
    await conn.execute(`UPDATE articles SET heroUrl = ? WHERE id = ?`, [target, r.id]);
    updated++;
  }
  console.log(`[remap] updated ${updated} heroUrls to manus-storage mirrors`);
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
