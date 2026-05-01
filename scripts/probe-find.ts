import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
async function main(){
  const a = await composeArticle("what-is-cirs");
  const text = a.body.replace(/<[^>]+>/g, " ").replace(/\s+/g," ");
  const idx = text.toLowerCase().indexOf("actually");
  console.log("idx:", idx, "...", text.slice(Math.max(0,idx-80), idx+80));
}
main().catch(e=>{console.error(e);process.exit(1)});
