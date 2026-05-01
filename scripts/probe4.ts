import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
async function main(){
  const a = await composeArticle("vcs-test-explained");
  const text = a.body.replace(/<[^>]+>/g, " ").replace(/\s+/g," ");
  let idx = -1;
  const re = /\blit\b/gi;
  let m: any;
  while ((m = re.exec(text))) {
    console.log("hit:", text.slice(Math.max(0,m.index-50), m.index+50));
  }
}
main().catch(e=>{console.error(e); process.exit(1);});
