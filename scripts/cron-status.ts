import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const u = new URL(process.env.DATABASE_URL!);
  const c = await mysql.createConnection({
    host: u.hostname, port: Number(u.port||3306),
    user: u.username, password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  });

  console.log("\n=== TOTALS ===");
  console.table((await c.execute("SELECT status, COUNT(*) AS n FROM articles GROUP BY status"))[0]);

  console.log("\n=== PUBLISHED PER DAY ===");
  console.table((await c.execute(
    "SELECT DATE(publishedAt) AS day, COUNT(*) AS n FROM articles WHERE status='published' GROUP BY day ORDER BY day DESC LIMIT 20"
  ))[0]);

  console.log("\n=== CRON RUNS ===");
  console.table((await c.execute(
    "SELECT job, ok, COUNT(*) AS n FROM cron_runs GROUP BY job, ok ORDER BY job"
  ))[0]);

  console.log("\n=== RECENT CRON RUNS (last 10) ===");
  console.table((await c.execute(
    "SELECT id, job, ok, LEFT(message, 80) AS message, startedAt FROM cron_runs ORDER BY startedAt DESC LIMIT 10"
  ))[0]);

  console.log("\n=== WORD COUNT STATS ===");
  console.table((await c.execute(
    "SELECT status, MIN(wordCount) AS min, ROUND(AVG(wordCount)) AS avg, MAX(wordCount) AS max, COUNT(*) AS n FROM articles GROUP BY status"
  ))[0]);

  console.log("\n=== HEROURL HOST CHECK ===");
  console.table((await c.execute(
    "SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(heroUrl,'/',3),'/',-1) AS host, COUNT(*) AS n FROM articles GROUP BY host"
  ))[0]);

  await c.end();
}
main().catch(e=>{console.error(e);process.exit(1);});
