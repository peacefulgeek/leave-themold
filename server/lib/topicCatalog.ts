// Editorial calendar for The Mold Truth.
// Each topic produces one article. Phase-1 topics seed the launch; phase-2
// topics back the long-tail publisher.

export interface Topic {
  slug: string;
  title: string;
  category:
    | "diagnosis"
    | "remediation"
    | "treatment"
    | "supplements"
    | "testing"
    | "lifestyle"
    | "research"
    | "stories"
    | "tools";
  tags: string[];
  angle: string; // 1-line editorial angle to feed the writer
}

export const PHASE_1_TOPICS: Topic[] = [
  { slug: "what-is-cirs", title: "What Is CIRS? A Plain-English Map of Chronic Inflammatory Response Syndrome", category: "diagnosis", tags: ["cirs", "biotoxin", "introduction"], angle: "Define CIRS clearly without jargon, frame the patient experience, and explain why mainstream medicine often misses it." },
  { slug: "early-signs-of-mold-illness", title: "Early Signs of Mold Illness Most Doctors Miss", category: "diagnosis", tags: ["symptoms", "diagnosis", "mold"], angle: "Walk through the cluster of vague symptoms that almost always show up first." },
  { slug: "shoemaker-protocol-overview", title: "The Shoemaker Protocol, Step by Step (And What Patients Experience)", category: "treatment", tags: ["shoemaker", "protocol", "treatment"], angle: "Explain each of the eleven steps, what binders are used, and how patients feel along the way." },
  { slug: "vcs-test-explained", title: "The VCS Test, Explained: A 5-Minute Screen That Saves Years", category: "testing", tags: ["vcs", "screening", "testing"], angle: "Walk through what the Visual Contrast Sensitivity test catches, why it matters, where to take it." },
  { slug: "mycotoxin-urine-test-guide", title: "Mycotoxin Urine Testing: How to Read the Lab Like a Pro", category: "testing", tags: ["mycotoxin", "labs", "testing"], angle: "Decode the major lab panels, common false positives, and what the numbers signal." },
  { slug: "ermi-vs-hertsmi-2", title: "ERMI vs HERSMI-2: Which Mold-In-Home Test Should You Trust?", category: "testing", tags: ["ermi", "home-testing", "remediation"], angle: "Compare the two tests, when to use each, and how to interpret the score." },
  { slug: "binders-cholestyramine-welchol", title: "Binders 101: Cholestyramine, Welchol, and the Natural Alternatives", category: "treatment", tags: ["binders", "cholestyramine", "welchol"], angle: "Explain how prescription and natural binders work, side effects, and how to time them." },
  { slug: "remediating-a-water-damaged-home", title: "Remediating a Water-Damaged Home Without Getting Scammed", category: "remediation", tags: ["remediation", "contractor", "home"], angle: "Practical contractor-vetting checklist + the questions that separate honest remediators from cleaners." },
  { slug: "air-purifier-buyers-guide-cirs", title: "An Air Purifier Buyer's Guide for CIRS Patients", category: "tools", tags: ["air-purifier", "hepa", "tools"], angle: "Compare HEPA vs activated carbon, room sizes, and trustworthy brands. Recommend specific picks." },
  { slug: "humidity-and-mold-growth", title: "Humidity Is the Whole Story: Why 50% Is the Magic Number", category: "lifestyle", tags: ["humidity", "prevention", "home"], angle: "Show why humidity above 50% is mold's runway and how a $20 hygrometer changes everything." },
  { slug: "mold-illness-vs-lyme", title: "Mold Illness vs Lyme: Why So Many Patients Have Both", category: "diagnosis", tags: ["lyme", "co-infection", "cirs"], angle: "Explain immune overlap, common labs, and the order most clinicians treat them in." },
  { slug: "msh-and-the-pituitary", title: "MSH, the Pituitary, and Why You Cannot Sleep Anymore", category: "research", tags: ["msh", "hormones", "sleep"], angle: "Explain alpha-MSH disruption, leaky-gut feedback, and sleep architecture in CIRS." },
  { slug: "leaky-gut-and-cirs", title: "Leaky Gut and CIRS: The Two-Way Street", category: "research", tags: ["leaky-gut", "gut-brain", "cirs"], angle: "How gut permeability fuels biotoxin re-absorption and what to in practice do about it." },
  { slug: "tgf-beta-1-elevation", title: "Why Your TGF-Beta-1 Is Elevated (And What It Means for Your Body)", category: "research", tags: ["tgf-beta-1", "labs", "inflammation"], angle: "Decode this stubborn marker, what raises it, and how to bring it down." },
  { slug: "c4a-explained", title: "C4a, Complement, and the Inflammation You Cannot See", category: "research", tags: ["c4a", "complement", "labs"], angle: "Explain the complement cascade for non-immunologists and why C4a stays high in CIRS." },
  { slug: "vip-nasal-spray-protocol", title: "VIP Nasal Spray: The Final Step of the Shoemaker Protocol", category: "treatment", tags: ["vip", "shoemaker", "nasal"], angle: "Why VIP comes last, what patients feel, and the qualifying criteria." },
  { slug: "mars-genetic-testing", title: "Mold Susceptibility Genes (HLA-DR): What Your DNA Says About Risk", category: "diagnosis", tags: ["hla-dr", "genetics", "susceptibility"], angle: "Decode the dreaded HLA-DR multi-susceptible haplotype without scaring readers." },
  { slug: "diet-for-cirs-recovery", title: "An Anti-Inflammatory Diet That Actually Works for CIRS", category: "lifestyle", tags: ["diet", "nutrition", "inflammation"], angle: "Practical anti-inflammatory eating with CIRS-specific nuance (low-amylose, mitochondrial support)." },
  { slug: "glutathione-recovery", title: "Glutathione: The Master Antioxidant Every Mold Patient Needs", category: "supplements", tags: ["glutathione", "antioxidants", "detox"], angle: "Forms of glutathione, dosing, and the timing that in practice moves labs." },
  { slug: "low-amylose-diet-mold", title: "The Low-Amylose Diet for Mold Patients: A Practical Week", category: "lifestyle", tags: ["diet", "amylose", "weight"], angle: "Walk readers through a real seven-day low-amylose menu." },
  { slug: "biofilm-and-mold-recovery", title: "Biofilm: The Hidden Wall Between You and Recovery", category: "research", tags: ["biofilm", "binders", "treatment"], angle: "Explain biofilm in plain English and the binders/enzymes used to dissolve it." },
  { slug: "mast-cell-activation-mold", title: "Mast Cell Activation Syndrome and Mold: An Inseparable Pair", category: "diagnosis", tags: ["mcas", "histamine", "mast-cells"], angle: "Why MCAS is the secret comorbidity that derails CIRS treatment." },
  { slug: "moving-out-of-a-moldy-home", title: "Moving Out: The Six-Step Plan When Your Home Is Making You Sick", category: "remediation", tags: ["moving", "decontamination", "home"], angle: "From identifying the trigger to a clean break-and-decontaminate move." },
  { slug: "decontaminating-belongings", title: "What to Keep, What to Toss After a Mold Exposure", category: "remediation", tags: ["belongings", "decontamination"], angle: "Itemized survivability list — leather, books, electronics, kids' toys." },
  { slug: "mold-and-cognitive-fog", title: "Mold-Brain: The Cognitive Fog Patients Describe and How to Lift It", category: "diagnosis", tags: ["brain-fog", "neuro", "cirs"], angle: "Phenomenology, neuro markers, and the steps that bring clarity back." },
  { slug: "supplements-stack-cirs", title: "A Practical Supplement Stack for the First 90 Days of CIRS Recovery", category: "supplements", tags: ["supplements", "stack", "starter"], angle: "Concrete starter stack — binders, glutathione, methylation cofactors, mast-cell support." },
  { slug: "sauna-therapy-mold", title: "Infrared Sauna Therapy for Mold: The Honest Pros and Cons", category: "treatment", tags: ["sauna", "detox", "lifestyle"], angle: "What sauna in practice does for mycotoxin elimination and who should NOT use one." },
  { slug: "chronic-fatigue-and-mold", title: "Chronic Fatigue, Post-Exertional Malaise, and the Mold Question", category: "diagnosis", tags: ["fatigue", "me-cfs", "cirs"], angle: "Why ME/CFS workups should always rule out mold first." },
  { slug: "cirs-recovery-timeline", title: "Realistic Timelines for CIRS Recovery (And Why It Takes So Long)", category: "stories", tags: ["recovery", "timeline", "patience"], angle: "Phase-by-phase realistic expectations from acute phase to VIP." },
  { slug: "indoor-air-quality-cirs", title: "Indoor Air Quality 101 for CIRS Survivors", category: "lifestyle", tags: ["iaq", "air-quality", "home"], angle: "VOCs, mycotoxins, particulates — what to monitor and the thresholds that matter." },
];

export const PHASE_2_TOPICS: Topic[] = [
  { slug: "actinobacteria-and-cirs", title: "Actinobacteria: The Quiet Co-Conspirator in Water-Damaged Buildings", category: "research", tags: ["actinobacteria", "research"], angle: "Explain why actinobacteria are emerging as a parallel CIRS trigger." },
  { slug: "fasting-and-mold-recovery", title: "Fasting and Mold Recovery: When It Helps, When It Hurts", category: "lifestyle", tags: ["fasting", "autophagy"], angle: "Honest take on intermittent fasting in active CIRS." },
  { slug: "cirs-and-pots", title: "POTS, Dysautonomia, and the Mold-Body Connection", category: "diagnosis", tags: ["pots", "dysautonomia"], angle: "Why so much overlap between CIRS patients and POTS tilt-table positive." },
  { slug: "mold-during-pregnancy", title: "Mold Exposure During Pregnancy: A Cautious Guide", category: "lifestyle", tags: ["pregnancy", "safety"], angle: "Risk-aware reading without scaremongering." },
  { slug: "kids-mold-symptoms", title: "Mold Symptoms in Children Look Different — Here Is What to Watch", category: "diagnosis", tags: ["children", "pediatric"], angle: "Concrete symptom map for parents." },
  { slug: "cirs-and-thyroid", title: "Why CIRS Patients Often Have Thyroid Numbers Doctors Wave Off", category: "diagnosis", tags: ["thyroid", "endocrine"], angle: "Sub-clinical patterns that in practice matter." },
  { slug: "mold-in-cars", title: "Yes, Mold Can Live in Your Car — How to Find It and Kill It", category: "remediation", tags: ["car", "decontamination"], angle: "Inspect, remediate, replace — the car-specific triage." },
  { slug: "ozone-vs-hocl", title: "Ozone vs Hypochlorous Acid for Mold Decontamination", category: "remediation", tags: ["ozone", "hocl"], angle: "Compare the two heavy-hitters honestly." },
];

import { PHASE_3_TOPICS } from "./topicCatalogPhase3";
export const ALL_TOPICS: Topic[] = [...PHASE_1_TOPICS, ...PHASE_2_TOPICS, ...PHASE_3_TOPICS];

export function topicBySlug(slug: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.slug === slug);
}
