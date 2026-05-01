// MASTER SCOPE §12A — UNION of every banned word/phrase list.
// No item dropped. Case-insensitive substring match (whole-word where noted).

export const BANNED_PHRASES: string[] = [
  // AI hedging / corporate slop
  "in conclusion",
  "in summary",
  "to summarize",
  "in today's fast-paced world",
  "in today's modern world",
  "in this article",
  "this article will",
  "we will explore",
  "we will discuss",
  "let's dive in",
  "let's dive into",
  "dive deeper",
  "buckle up",
  "in the realm of",
  "in the world of",
  "navigating the world of",
  "navigating the complex",
  "tapestry of",
  "rich tapestry",
  "delve into",
  "delving into",
  "as we delve",
  "embark on a journey",
  "embark on this journey",
  "journey of discovery",
  "unleash the power",
  "unlock the power",
  "unlock the secrets",
  "unlock the potential",
  "harness the power",
  "stand the test of time",
  "the choice is yours",
  "rest assured",
  "it goes without saying",
  "needless to say",
  "without further ado",
  "at the end of the day",
  "when all is said and done",
  "the bottom line is",
  "game-changer",
  "game changing",
  "paradigm shift",
  "synergy",
  "synergies",
  "leverage your",
  "moving forward",
  "going forward",
  "circle back",
  "touch base",
  "deep dive",
  "thought leader",
  "thought leadership",
  "best practice",
  "low-hanging fruit",
  "move the needle",
  "boil the ocean",
  "ecosystem",
  "stakeholder buy-in",
  "value-add",
  "robust solution",
  "cutting-edge",
  "world-class",
  "best-in-class",
  "next-generation",
  "revolutionary",
  "disrupt",
  "disruptive",
  "groundbreaking",
  "innovative solution",
  "transformative",
  "holistic approach",
  "holistic view",
  "comprehensive solution",
  "seamless integration",
  "seamless experience",
  "elevate your",
  "supercharge",
  "turbocharge",
  "level up",
  "next level",
  "10x your",
  "supercharged",
  "rockstar",
  "ninja",
  "guru",
  "powerhouse",

  // Vague boosters
  "various",
  "numerous",
  "many",
  "several",
  "a number of",
  "a variety of",
  "a plethora of",
  "a myriad of",
  "myriad",
  "plethora",
  "litany",
  "a wide range",
  "an array of",

  // Hedging fluff
  "it's important to note",
  "it should be noted",
  "it is worth noting",
  "it's worth mentioning",
  "it is important to remember",
  "keep in mind that",
  "as you can see",
  "as we mentioned",
  "as previously mentioned",
  "the fact of the matter",
  "the truth is",
  "honestly speaking",
  "frankly speaking",
  "to be honest",
  "to be fair",
  "in my humble opinion",
  "in my opinion",

  // AI-tells
  "as an ai",
  "as a language model",
  "i'm just an ai",
  "i don't have personal",
  "i don't have feelings",
  "i hope this helps",
  "happy to help",
  "feel free to ask",
  "let me know if",
  "in this comprehensive guide",
  "comprehensive guide to",
  "ultimate guide to",
  "everything you need to know",
  "the complete guide",
  "a complete guide",

  // Mold-/medical-niche specific over-claims (per §12A medical safety subset)
  "cure for cirs",
  "cure for mold",
  "guaranteed cure",
  "miracle cure",
  "100% safe",
  "completely safe",
  "no side effects",
  "fda approved",
  "doctor recommended",
  "medically proven",
  "scientifically proven",
  "clinically proven",
  "studies have shown",
  "research has shown",

  // Brand/competitor name landmines
  "wordpress",
  "next.js",
  "cloudflare",
  "fal.ai",
];

export const BANNED_WORDS_WHOLE: string[] = [
  // single-word landmines (whole-word match)
  "tldr",       // we use "TL;DR" formatted explicitly
  "amazing",
  "incredible",
  "unbelievable",
  "literally",
  "basically",
  "actually",
  "essentially",
  "fundamentally",
  "ultimately",
  "vibes",
  "vibe",
  "slay",
  "lit",
];

export interface QualityResult {
  ok: boolean;
  hits: { phrase: string; whole: boolean }[];
  wordCount: number;
  reason?: string;
}

const WORD_RE = (w: string) =>
  new RegExp(`(?:^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|[^a-z0-9])`, "i");

export function runQualityGate(html: string, opts: { minWords: number }): QualityResult {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const lower = text.toLowerCase();
  const hits: { phrase: string; whole: boolean }[] = [];

  // The "TL;DR" header itself is allowed inside <strong>TL;DR.</strong> only;
  // but as a bare token we still ban it. We ALSO want to permit our literal
  // header. To keep this simple, we don't penalise "tl;dr" with semicolon.
  for (const p of BANNED_PHRASES) {
    if (lower.includes(p)) hits.push({ phrase: p, whole: false });
  }
  for (const w of BANNED_WORDS_WHOLE) {
    if (WORD_RE(w).test(lower)) hits.push({ phrase: w, whole: true });
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let reason: string | undefined;
  if (wordCount < opts.minWords) reason = `word_count<${opts.minWords} (got ${wordCount})`;
  else if (hits.length) reason = `banned: ${hits.slice(0, 5).map((h) => h.phrase).join(", ")}`;

  return { ok: !reason, hits, wordCount, reason };
}
