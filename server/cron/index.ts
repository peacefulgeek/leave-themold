import cron from "node-cron";
import { runPublisher } from "./publisher";
import { runProductSpotlight } from "./productSpotlight";
import { runMonthlyRefresh } from "./refreshMonthly";
import { runQuarterlyRefresh } from "./refreshQuarterly";
import { runAsinHealthCheck } from "./asinHealthCheck";

let started = false;

/**
 * In-process cron schedules. UTC.
 *   - Phase-1 publisher: 07, 10, 13, 16, 19  -> "0 7,10,13,16,19 * * *"
 *   - Phase-2 publisher: weekday 08:00       -> "0 8 * * 1-5"
 *   - Product spotlight: Saturday 08:00      -> "0 8 * * 6"
 *   - Monthly refresh:  1st @ 03:00          -> "0 3 1 * *"
 *   - Quarterly refresh: Jan/Apr/Jul/Oct 04  -> "0 4 1 1,4,7,10 *"
 *   - ASIN health:      Sunday 05:00         -> "0 5 * * 0"
 */
export function startCron() {
  if (started) return;
  started = true;
  if (process.env.NODE_ENV === "test") return;

  const tz = "UTC";

  cron.schedule("0 7,10,13,16,19 * * *", () => guard("publisher", runPublisher), { timezone: tz });
  cron.schedule("0 8 * * 1-5", () => guard("phase2_publisher", runPublisher), { timezone: tz });
  cron.schedule("0 8 * * 6", () => guard("product_spotlight", runProductSpotlight), { timezone: tz });
  cron.schedule("0 3 1 * *", () => guard("refresh_monthly", runMonthlyRefresh), { timezone: tz });
  cron.schedule("0 4 1 1,4,7,10 *", () => guard("refresh_quarterly", runQuarterlyRefresh), { timezone: tz });
  cron.schedule("0 5 * * 0", () => guard("asin_health", runAsinHealthCheck), { timezone: tz });

  console.log("[cron] schedules registered (UTC)");
}

async function guard(label: string, fn: () => Promise<unknown>) {
  try {
    const out = await fn();
    console.log(`[cron:${label}] ok`, out);
  } catch (e: any) {
    console.error(`[cron:${label}] failed:`, e?.message || e);
  }
}
