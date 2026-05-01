import "dotenv/config";
import { composeArticle } from "../server/lib/writer.ts";
async function dump(slug: string, term: string){
  const a = await composeArticle(slug);
  const text = a.body.replace(/<[^>]+>/g, " ").replace(/\s+/g," ");
  const re = new RegExp(`\\b${term}\\b`, "i");
  const m = re.exec(text);
  console.log(slug, term, "->", m ? text.slice(Math.max(0,m.index-60), m.index+80) : "NOT FOUND");
}
async function main(){
  await dump("vcs-test-explained","lit");
  await dump("msh-and-the-pituitary","disrupt");
}
main().catch(e=>{console.error(e); process.exit(1);});
