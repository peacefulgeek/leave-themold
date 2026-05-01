// Generate ~470 unique mold-niche topics from a controlled vocabulary.
// Output is appended to a TS file as a literal Topic[] (PHASE_3_TOPICS).
import fs from "fs";

type Cat = "diagnosis" | "remediation" | "treatment" | "supplements" | "testing" | "lifestyle" | "research" | "stories" | "tools";

interface Topic {
  slug: string;
  title: string;
  category: Cat;
  tags: string[];
  angle: string;
}

const SYMPTOMS = [
  "brain fog", "fatigue", "joint pain", "static shocks", "ice-pick headaches",
  "sinus pressure", "tinnitus", "burning skin", "histamine flares", "vertigo",
  "tremor", "muscle twitches", "night sweats", "afternoon crash", "post-meal flush",
  "morning stiffness", "vibrating sensations", "metallic taste", "thirst spikes", "frequent urination",
  "ear fullness", "eye floaters", "blurred vision", "memory gaps", "word-finding trouble",
  "scalp itching", "rashes", "POTS spikes", "racing pulse", "low blood pressure",
  "cold extremities", "burning feet", "restless legs", "anxiety surges", "panic episodes",
  "depression dips", "mood swings", "anhedonia", "irritability", "grief surges",
  "menstrual chaos", "PMS amplification", "infertility worries", "libido loss", "weight gain",
  "weight loss", "hair shedding", "nail ridges", "candida flares", "yeast tongue"
];
const TOPICS_BIO = [
  "C4a", "TGF-Beta-1", "MMP-9", "VEGF", "MSH",
  "ADH/osmolality", "leptin", "ACTH/cortisol", "ANA", "anti-cardiolipin",
  "Lyme co-infection", "Bartonella co-infection", "Babesia co-infection", "EBV reactivation", "HHV-6",
  "histamine intolerance", "MCAS overlap", "leaky gut", "biofilm", "candida overgrowth",
  "thyroid TPO antibodies", "reverse T3", "iron / ferritin", "vitamin D status", "B12 status",
  "homocysteine", "MTHFR variants", "HLA-DR genotype", "HLA-DQ", "limbic system",
  "cell danger response", "vagal tone", "mast cells", "Th17 polarization", "Treg balance"
];
const TOPICS_HOME = [
  "bathroom mold", "kitchen mold", "basement mold", "attic mold", "crawl space mold",
  "HVAC contamination", "ductwork", "dust loading", "carpet replacement", "drywall replacement",
  "insulation removal", "rented homes", "shared walls", "neighbor leaks", "office buildings",
  "cars", "RVs", "boats", "tents", "garages",
  "laundry rooms", "washing machine seals", "dishwasher mold", "fridge drip pans", "ice maker lines",
  "window condensation", "single-pane windows", "rim joists", "roof leaks", "chimney leaks",
  "slab leaks", "concrete moisture", "subfloor mold", "behind-fridge dust", "behind-stove grease"
];
const TOPICS_TOOL = [
  "HEPA vacuum", "dehumidifier", "hygrometer", "air purifier", "ERMI test",
  "HERTSMI-2 test", "VCS test", "mycotoxin urine kit", "tap-water filter", "shower filter",
  "non-toxic mattress", "sauna blanket", "infrared sauna", "PEMF mat", "red light panel",
  "neti pot", "nasal spray (BEG)", "nasal spray (silver)", "essential oil diffuser", "ionizer",
  "ozone generator", "UV-C wand", "borax cleaner", "EC3 spray", "concrobium",
  "vinegar protocol", "tea-tree solution", "diatomaceous earth", "activated charcoal mask", "electrostatic dust spray"
];
const TOPICS_PROTOCOL = [
  "cholestyramine", "Welchol", "binders (natural)", "VIP nasal spray", "low-amylose diet",
  "no-amylose diet", "anti-inflammatory diet", "carnivore experiment", "fasting windows", "ketosis trial",
  "glutathione (liposomal)", "NAC", "PC (phosphatidylcholine)", "milk thistle", "alpha-lipoic acid",
  "magnesium glycinate", "magnesium threonate", "vitamin C IV", "vitamin D dosing", "vitamin K2",
  "boron", "molybdenum", "selenium", "iodine (cautious)", "lithium orotate",
  "chinese skullcap", "andrographis", "Japanese knotweed", "cat's claw", "olive leaf",
  "saccharomyces boulardii", "spore-based probiotic", "lactoferrin", "colostrum", "GABA",
  "L-theanine", "ashwagandha", "rhodiola", "reishi tincture", "lion's mane",
  "cordyceps", "shilajit", "berberine", "quercetin", "luteolin",
  "PEA (palmitoylethanolamide)", "low-dose naltrexone", "ketotifen", "cromolyn sodium", "DAO enzymes"
];
const FORMATS: { suffix: string; angle: string }[] = [
  { suffix: "Explained", angle: "A plain-English orientation: what it is, why it shows up in CIRS, what to watch." },
  { suffix: "A Practical Guide", angle: "Patient-tested, pragmatic guidance with safety guardrails." },
  { suffix: "What Patients Notice First", angle: "The early-pattern signs that reliably show up first." },
  { suffix: "When It Helps, When It Hurts", angle: "Honest cost-benefit reading; not a blanket endorsement." },
  { suffix: "A 7-Step Checklist", angle: "Step-by-step checklist that can be worked through in a single afternoon." },
  { suffix: "How to Time It", angle: "Sequencing notes: where in the protocol it belongs and what to pair it with." },
  { suffix: "What the Data Shows", angle: "Honest read of the literature, the case reports, the dissents." },
  { suffix: "A Cautious Beginner's Guide", angle: "Slow-and-low protocol design for sensitive systems." },
  { suffix: "What to Track and Why", angle: "Which biomarkers and journal entries make this question answerable." },
  { suffix: "Common Pitfalls", angle: "The mistakes that send people backward and how to avoid them." }
];

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const out: Topic[] = [];
const used = new Set<string>();
function push(t: Topic) {
  if (used.has(t.slug)) return;
  used.add(t.slug);
  out.push(t);
}

// Symptom × format
for (const s of SYMPTOMS) {
  for (const f of FORMATS) {
    if (out.length >= 500) break;
    const title = `${s.replace(/^./, c => c.toUpperCase())} in CIRS: ${f.suffix}`;
    const slug = slugify(`${s}-cirs-${f.suffix}`);
    push({ slug, title, category: "diagnosis", tags: ["symptom", slugify(s)], angle: f.angle });
  }
}
// Biomarkers / co-morbids × format
for (const b of TOPICS_BIO) {
  for (const f of FORMATS.slice(0, 6)) {
    if (out.length >= 500) break;
    const title = `${b} in Mold Illness: ${f.suffix}`;
    const slug = slugify(`${b}-mold-illness-${f.suffix}`);
    push({ slug, title, category: "research", tags: [slugify(b)], angle: f.angle });
  }
}
// Home × format
for (const h of TOPICS_HOME) {
  for (const f of FORMATS.slice(0, 5)) {
    if (out.length >= 500) break;
    const title = `${h.replace(/^./, c => c.toUpperCase())}: ${f.suffix}`;
    const slug = slugify(`${h}-${f.suffix}`);
    push({ slug, title, category: "remediation", tags: [slugify(h)], angle: f.angle });
  }
}
// Tools × format
for (const t of TOPICS_TOOL) {
  for (const f of FORMATS.slice(0, 4)) {
    if (out.length >= 500) break;
    const title = `${t.replace(/^./, c => c.toUpperCase())}: ${f.suffix}`;
    const slug = slugify(`${t}-${f.suffix}`);
    push({ slug, title, category: "tools", tags: [slugify(t)], angle: f.angle });
  }
}
// Protocol × format
for (const p of TOPICS_PROTOCOL) {
  for (const f of FORMATS.slice(0, 4)) {
    if (out.length >= 500) break;
    const title = `${p.replace(/^./, c => c.toUpperCase())}: ${f.suffix}`;
    const slug = slugify(`${p}-${f.suffix}`);
    push({ slug, title, category: p.match(/diet|fast|keto/i) ? "lifestyle" : "supplements", tags: [slugify(p)], angle: f.angle });
  }
}

console.log(`generated ${out.length} unique topics`);

const lines = out.map(t =>
  `  { slug: ${JSON.stringify(t.slug)}, title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, tags: ${JSON.stringify(t.tags)}, angle: ${JSON.stringify(t.angle)} },`
).join("\n");

const body = `// AUTO-GENERATED by scripts/generate-topics.ts — do not hand-edit.
import { Topic } from "./topicCatalog";
export const PHASE_3_TOPICS: Topic[] = [
${lines}
];
`;

fs.writeFileSync("server/lib/topicCatalogPhase3.ts", body);
console.log("wrote server/lib/topicCatalogPhase3.ts");
