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
  const [cols] = await c.execute("DESCRIBE cron_runs");
  console.log("=== cron_runs columns ===");
  console.table(cols);
  const [rows] = await c.execute("SELECT * FROM cron_runs ORDER BY id DESC LIMIT 12");
  console.log("=== recent runs ===");
  console.table(rows);
  await c.end();
}
main().catch(e=>{console.error(e);process.exit(1);});
