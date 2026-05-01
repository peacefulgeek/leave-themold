import "dotenv/config";
import mysql from "mysql2/promise";
async function main() {
  const url = process.env.DATABASE_URL!;
  console.log("connecting...");
  const conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: true } });
  const [rows] = await conn.query("select count(*) as c from articles");
  console.log("articles:", rows);
  const [rows2] = await conn.query("select count(*) as c from articles where status='published'");
  console.log("published:", rows2);
  await conn.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
