import "dotenv/config";
import { totalCount } from "../server/lib/articleDb";
async function main() { console.log("total=", await totalCount()); }
main().catch((e)=>{console.error(e);process.exit(1)});
