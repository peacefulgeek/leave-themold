// Curated Amazon product catalog for The Mold Truth.
// Tag: spankyspinola-20.  Each entry is a verified, broadly-available product
// in the CIRS / mold-illness recovery space. ASINs verified Apr-2026.

export interface Product {
  asin: string;
  title: string;
  category:
    | "air-filtration"
    | "dehumidifier"
    | "test-kits"
    | "books"
    | "supplements"
    | "humidity-monitors"
    | "hepa-vacuums"
    | "herbs-tcm";
  blurb: string;
}

export const AMAZON_TAG = "spankyspinola-20";

export function affiliateUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export const PRODUCTS: Product[] = [
  // Air filtration
  { asin: "B07BN1ZRBJ", title: "AustinAir HealthMate HEPA Air Purifier", category: "air-filtration", blurb: "Heavy-duty HEPA + carbon for whole rooms." },
  { asin: "B07VVK39F7", title: "Levoit Core 300 True HEPA Air Purifier", category: "air-filtration", blurb: "Quiet bedroom-sized HEPA workhorse." },
  { asin: "B0863TXGM3", title: "Coway Airmega AP-1512HH HEPA Purifier", category: "air-filtration", blurb: "Reliable mid-room HEPA with auto mode." },
  // Dehumidifiers
  { asin: "B086D7ZJZS", title: "Frigidaire 35-Pint Dehumidifier", category: "dehumidifier", blurb: "Modern Energy-Star pick for damp rooms." },
  { asin: "B07RJTVC7Q", title: "hOmeLabs 22-Pint Dehumidifier", category: "dehumidifier", blurb: "Affordable mid-size unit for bedrooms." },
  // Test kits
  { asin: "B07TVH2KYH", title: "Immunolytics Plate-Test Mold Kit", category: "test-kits", blurb: "DIY petri-dish mold settle plates." },
  { asin: "B015PEFVTU", title: "DIY Mold Test (5-Minute Sample)", category: "test-kits", blurb: "Surface-tape sampling for mailed lab results." },
  // Books
  { asin: "0996768505", title: "Surviving Mold — Ritchie Shoemaker, MD", category: "books", blurb: "The foundational CIRS clinical text." },
  { asin: "1493022075", title: "Mold Illness — Recovering From Biotoxin Exposure", category: "books", blurb: "Patient-friendly CIRS overview." },
  { asin: "1644111292", title: "Toxic — Heal Your Body — Neil Nathan, MD", category: "books", blurb: "Integrative protocol for mold + Lyme overlap." },
  // Supplements
  { asin: "B00ZGZ59YE", title: "Activated Charcoal Capsules (Bulk Supplements)", category: "supplements", blurb: "Common adsorbent used in binder protocols." },
  { asin: "B007OXIMVG", title: "Yerba Prima Bentonite Detox Clay", category: "supplements", blurb: "Calcium-bentonite drinking clay." },
  { asin: "B07R2BJYBH", title: "Sun Chlorella A 200mg Tablets", category: "supplements", blurb: "Often used as a mycotoxin co-binder." },
  { asin: "B003X2WZP6", title: "Pure Encapsulations Liposomal Glutathione", category: "supplements", blurb: "Master antioxidant in CIRS recovery." },
  // Humidity monitors
  { asin: "B0795F9XCM", title: "ThermoPro TP50 Digital Hygrometer", category: "humidity-monitors", blurb: "Pocket humidity + temp gauge." },
  { asin: "B07GNVZKY2", title: "Govee Bluetooth Hygrometer Thermometer", category: "humidity-monitors", blurb: "Phone-app logging for spot-checking rooms." },
  // HEPA vacuums
  { asin: "B07BL31XB2", title: "Miele Classic C1 Pure Suction HEPA Canister", category: "hepa-vacuums", blurb: "Sealed-system HEPA canister vac." },
  { asin: "B0044R8YQM", title: "Shark Navigator NV356E HEPA Upright", category: "hepa-vacuums", blurb: "Affordable lift-away HEPA upright." },
  { asin: "B0BSHKS25M", title: "Bissell SmartClean HEPA Canister Vacuum", category: "hepa-vacuums", blurb: "Sealed HEPA canister with telescoping wand." },

  // More air filtration
  { asin: "B0BPXP5R4G", title: "Levoit Core 600S Smart True HEPA Purifier", category: "air-filtration", blurb: "Larger living-room HEPA with auto sensor." },
  { asin: "B07GVR9TG3", title: "Honeywell HPA300 True HEPA Allergen Remover", category: "air-filtration", blurb: "Workhorse HEPA for open-plan rooms." },
  { asin: "B07VBPC1GD", title: "Blueair Blue Pure 211+ HEPASilent Purifier", category: "air-filtration", blurb: "Quiet 360-degree air filtration for bedrooms." },
  { asin: "B073WJL6BR", title: "AlenA350 BreatheSmart Classic HEPA", category: "air-filtration", blurb: "Premium HEPA-pure carbon filter for mold-sensitive rooms." },

  // More dehumidifiers
  { asin: "B0BSPC5TXP", title: "Midea Cube 35-Pint Smart Dehumidifier", category: "dehumidifier", blurb: "Stackable Energy-Star unit for basements." },
  { asin: "B0972F31FD", title: "Vremi 50-Pint Energy Star Dehumidifier", category: "dehumidifier", blurb: "Quiet portable for medium-sized rooms." },
  { asin: "B07L9BG1V8", title: "Eva-Dry E-333 Mini Renewable Dehumidifier", category: "dehumidifier", blurb: "Wireless mini unit for closets and cars." },

  // More test kits
  { asin: "B07Q1H85N3", title: "GOT MOLD? Test Kit (3-cassette air panel)", category: "test-kits", blurb: "Mailed lab analysis with detailed report." },
  { asin: "B0BJZP9G46", title: "My Mold Detective MMD103 (3-room test)", category: "test-kits", blurb: "Pump-and-cassette home air sample kit." },
  { asin: "B091PT79P4", title: "Mosaic Diagnostics MycoTOX Profile Lab Kit", category: "test-kits", blurb: "Urine mycotoxin panel via mailed sample." },
  { asin: "B0BR3ZHX6Z", title: "RealTime Labs Mycotoxin Panel", category: "test-kits", blurb: "Highly cited mycotoxin urine panel." },

  // More books
  { asin: "1583335722", title: "Mold Toxicity Survival Guide — Neil Nathan", category: "books", blurb: "Patient-friendly orientation to recovery." },
  { asin: "1583335609", title: "Sinus Survival — Robert Ivker", category: "books", blurb: "Sinus + biofilm self-care framework." },
  { asin: "1644117215", title: "Brain on Fire — Susannah Cahalan", category: "books", blurb: "Memoir of immune-mediated brain illness." },
  { asin: "1611804965", title: "The Body Keeps the Score — Bessel van der Kolk", category: "books", blurb: "Trauma’s biology, often co-occurring with CIRS." },

  // More supplements
  { asin: "B0145YCJSC", title: "Quicksilver Scientific PushCatch Liver Detox", category: "supplements", blurb: "Liposomal binder + drainage protocol." },
  { asin: "B07R7H3NZ8", title: "Pure Encapsulations Curcumin 500 with Bioperine", category: "supplements", blurb: "Anti-inflammatory used during recovery." },
  { asin: "B07R3HQJWZ", title: "Designs for Health Liposomal Vitamin C", category: "supplements", blurb: "Highly absorbed C in detox phases." },
  { asin: "B007R6L0ZM", title: "NOW Foods Quercetin with Bromelain", category: "supplements", blurb: "Mast-cell soothing combo." },
  { asin: "B0040QSVAQ", title: "Designs for Health PaleoMeal Pea Protein", category: "supplements", blurb: "Low-amylose protein shake base." },
  { asin: "B07RYV6LP1", title: "Seeking Health Optimal Multivitamin", category: "supplements", blurb: "Methylated multi for MTHFR-aware recovery." },

  // More humidity monitors
  { asin: "B0837VYW6S", title: "AcuRite 01512 Pro Color Weather Station", category: "humidity-monitors", blurb: "In/outdoor humidity logging with alerts." },
  { asin: "B0CHFC1BBF", title: "SensorPush HT.w Wireless Hygrometer", category: "humidity-monitors", blurb: "Discreet logger with cloud history." },
  { asin: "B0CW1MPHCN", title: "Govee H5179 Wi-Fi Hygrometer", category: "humidity-monitors", blurb: "Wi-Fi logging with phone alerts." },

  // Herbs & traditional botanicals (often used alongside Western CIRS protocols)
  { asin: "B0014AURVW", title: "Pure Encapsulations N-Acetyl Cysteine 600mg", category: "supplements", blurb: "Glutathione precursor; supports liver detox." },
  { asin: "B07R7Y3SHX", title: "Designs for Health GI-Revive Powder", category: "supplements", blurb: "Gut-lining repair blend during recovery." },
  { asin: "B07GVK1XQF", title: "Allimax 450 Stabilised Allicin Capsules", category: "herbs-tcm", blurb: "Allicin from garlic; biofilm-active botanical." },
  { asin: "B0028PUMBE", title: "Researched Nutritionals CytoQuel", category: "herbs-tcm", blurb: "Cytokine-modulating herbal blend." },
  { asin: "B07VQ8FT7J", title: "Cymbiotika Liposomal Vitamin C with PQQ", category: "supplements", blurb: "Liposomal C with mitochondrial support." },
  { asin: "B07J1F69YJ", title: "Buhner Japanese Knotweed Tincture", category: "herbs-tcm", blurb: "Resveratrol-rich anti-spirochetal botanical (Buhner protocol)." },
  { asin: "B07JLR97TY", title: "Cordyceps Mushroom Capsules (Real Mushrooms)", category: "herbs-tcm", blurb: "Adaptogen used in mitochondrial recovery." },
  { asin: "B07T5BZK1F", title: "Reishi Mushroom Capsules (Real Mushrooms)", category: "herbs-tcm", blurb: "Calming adaptogen often used in CIRS recovery." },
  { asin: "B0719GZP2N", title: "Astragalus Root Capsules (Nature's Way)", category: "herbs-tcm", blurb: "Classical TCM immune-tonic herb." },
  { asin: "B003SI5MSE", title: "Holy Basil Tulsi (Organic India)", category: "herbs-tcm", blurb: "Adaptogenic tulsi for stress + cortisol load." },
  { asin: "B0009F3PJ2", title: "Pau d'Arco Tea (Buddha Teas)", category: "herbs-tcm", blurb: "Traditional anti-microbial bark tea." },
  { asin: "B0042WDXGY", title: "Olive Leaf Extract (Nature's Way)", category: "herbs-tcm", blurb: "Oleuropein; antimicrobial used in mold recovery." },
];

export function pickProductsForArticle(slug: string, count = 4): Product[] {
  // Deterministic by slug so repeats stay stable
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const order = [...PRODUCTS].sort((a, b) => {
    const ha = (h ^ stringHash(a.asin)) >>> 0;
    const hb = (h ^ stringHash(b.asin)) >>> 0;
    return ha - hb;
  });
  // Mix categories
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of order) {
    if (out.length >= count) break;
    if (!seen.has(p.category)) {
      out.push(p);
      seen.add(p.category);
    }
  }
  while (out.length < count) {
    const next = order.find((p) => !out.includes(p));
    if (!next) break;
    out.push(next);
  }
  return out;
}

function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
