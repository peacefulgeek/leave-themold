import { runPublisher } from "./publisher";
import { logCronStart, logCronFinish } from "./runLog";
import { PRODUCTS, affiliateUrl } from "../lib/products";

/**
 * Saturday product spotlight — publishes a "what we use" round-up via the
 * normal publisher pipeline but with a product-focused title.
 *
 * Keeping this lean: it triggers the normal publisher unless a more elaborate
 * spotlight feature is enabled later.
 */
export async function runProductSpotlight() {
  const id = await logCronStart("product_spotlight");
  try {
    // For now, we delegate to the publisher (covers Phase-2 catalog).
    const out = await runPublisher();
    const sample = PRODUCTS.slice(0, 3).map((p) => `${p.title} -> ${affiliateUrl(p.asin)}`);
    await logCronFinish(id, true, `delegated_to_publisher; sample=${sample.join("; ")}`);
    return out;
  } catch (e: any) {
    await logCronFinish(id, false, String(e?.message || e));
    throw e;
  }
}
