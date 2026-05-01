import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
async function main(){
  const a = await composeArticle("what-is-cirs");
  const internals = a.body.match(/href="\/articles\//g) || [];
  const externals = a.body.match(/href="https:\/\/[^"]+"/g) || [];
  console.log("internal:", internals.length, "external:", externals.length);
  // Print just hrefs to see what they look like
  const all = a.body.match(/href="[^"]+"/g) || [];
  for (const h of all.slice(0,12)) console.log(" ", h);
}
main().catch(e=>{console.error(e); process.exit(1);});
