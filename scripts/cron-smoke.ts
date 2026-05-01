import "dotenv/config";
import { runPublisher } from "../server/cron/publisher.ts";
import { runProductSpotlight } from "../server/cron/productSpotlight.ts";
import { runMonthlyRefresh } from "../server/cron/refreshMonthly.ts";
import { runQuarterlyRefresh } from "../server/cron/refreshQuarterly.ts";
import { runAsinHealthCheck } from "../server/cron/asinHealthCheck.ts";
async function main(){
  console.log("=== smoke-firing each cron handler ===");
  try { await runPublisher("phase1"); console.log("✓ publisher phase1"); } catch(e:any){console.log("✗ publisher phase1:", e.message);}
  try { await runPublisher("phase2"); console.log("✓ publisher phase2"); } catch(e:any){console.log("✗ publisher phase2:", e.message);}
  try { await runProductSpotlight(); console.log("✓ product spotlight"); } catch(e:any){console.log("✗ product spotlight:", e.message);}
  try { await runMonthlyRefresh(); console.log("✓ monthly refresh"); } catch(e:any){console.log("✗ monthly refresh:", e.message);}
  try { await runQuarterlyRefresh(); console.log("✓ quarterly refresh"); } catch(e:any){console.log("✗ quarterly refresh:", e.message);}
  try { await runAsinHealthCheck(); console.log("✓ asin health"); } catch(e:any){console.log("✗ asin health:", e.message);}
  console.log("=== done ===");
  process.exit(0);
}
main().catch(e=>{console.error("FATAL", e); process.exit(1);});
