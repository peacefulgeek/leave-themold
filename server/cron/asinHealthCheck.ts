import { logCronStart, logCronFinish } from "./runLog";
import { PRODUCTS, affiliateUrl } from "../lib/products";

/**
 * Sunday: probe each Amazon affiliate URL and log the count that respond OK.
 * We HEAD the URL with a short timeout; Amazon will 200 even unauthenticated.
 */
export async function runAsinHealthCheck() {
  const id = await logCronStart("asin_health");
  try {
    let okCount = 0;
    const failures: string[] = [];
    for (const p of PRODUCTS) {
      const url = affiliateUrl(p.asin);
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const r = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
        clearTimeout(timer);
        if (r.ok || r.status === 405) okCount++;
        else failures.push(`${p.asin}=${r.status}`);
      } catch (e: any) {
        failures.push(`${p.asin}=ERR`);
      }
    }
    await logCronFinish(id, true, `ok=${okCount}/${PRODUCTS.length} failures=${failures.join(",")}`);
    return { ok: okCount, total: PRODUCTS.length, failures };
  } catch (e: any) {
    await logCronFinish(id, false, String(e?.message || e));
    throw e;
  }
}
