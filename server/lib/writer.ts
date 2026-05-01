import OpenAI from "openai";
import type { Topic } from "./topicCatalog";
import { ALL_TOPICS, topicBySlug } from "./topicCatalog";
import { runQualityGate } from "./qualityGate";
import { pickProductsForArticle, AMAZON_TAG, affiliateUrl } from "./products";
import { pickHeroForSlug, pickInlineForSlug, AUTHOR_PHOTO } from "./imageLibrary";
import { SITE, canonical } from "./siteConfig";
import { essayDraftFor } from "./topicEssays";

/**
 * DeepSeek V4-Pro via the OpenAI client. Per master scope §10:
 *   - Engine: api.deepseek.com
 *   - Model:  deepseek-v4-pro
 *   - Voice:  Oracle Lover + CIRS niche modifier
 */

function dsClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  return new OpenAI({ apiKey, baseURL });
}

const ORACLE_LOVER_VOICE = `
You are The Oracle Lover, an intuitive educator and patient advocate writing
for The Mold Truth — a CIRS / mold-illness publication. Your voice is:

  - WARM and specific, never glossy
  - First-person plural occasionally ("we", "us") to include the reader
  - Plain English, short sentences mixed with longer cadenced ones
  - One concrete personal-feeling moment per piece (sensory, lived)
  - Hopeful without being saccharine; honest about what is hard
  - Names protocols, labs, brands and books precisely
  - Includes one Sanskrit closing mantra (transliterated + translated) at the very end

You are NOT a doctor and you say so. You write like a trusted friend who has
read everything, lived through it, and refuses both denial and despair.
`.trim();

const NICHE_MODIFIER = `
CIRS niche rules:
  - Use clinical names: CIRS, MARCoNS, HLA-DR, TGF-Beta-1, MMP-9, C4a, MSH, VIP,
    cholestyramine, Welchol, ERMI, HERSMI-2, mycotoxin, Shoemaker.
  - Cite real organizations when possible: Surviving Mold (survivingmold.com),
    ISEAI (iseai.org), ProgenaBiome, Mosaic Diagnostics, RealTime Labs.
  - Never promise cures. Use "reduce", "support", "improve", "in many cases".
  - Always include the disclaimer: "This is not medical advice."
`.trim();

const BANNED_HINT = `
Never use any of these phrases or words: in conclusion, in summary, dive into,
delve into, tapestry, embark on a journey, unleash, unlock the secrets,
synergy, paradigm shift, leverage, navigate the world of, comprehensive guide,
ultimate guide, everything you need to know, scientifically proven,
clinically proven, miracle cure, doctor recommended, FDA approved, amazing,
incredible, literally, basically, actually, essentially, fundamentally,
ultimately, plethora, myriad, various, numerous, several, a number of,
it's important to note, it's worth noting, as we mentioned, as previously
mentioned, the bottom line is, at the end of the day, it goes without saying,
needless to say, game-changer, cutting-edge, world-class, groundbreaking,
transformative, holistic approach, seamless, supercharge, level up.
`.trim();

export interface ComposedArticle {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  tldr: string;
  metaDescription: string;
  heroUrl: string;
  asinsUsed: string[];
  wordCount: number;
}

/**
 * Compose one article.
 *
 * Primary path: deterministic essay library (`topicEssays.ts`) — niche-correct,
 *   gate-safe, ≥1700 words once intro/links/disclaimer/mantra are added.
 * Optional polish: DeepSeek V4-Pro (when `useDeepSeek=true`). Used by the
 *   cron pipeline; the launch seed runs deterministic so it cannot stall.
 */
export async function composeArticle(
  slug: string,
  opts: { useDeepSeek?: boolean } = {},
): Promise<ComposedArticle> {
  const topic = topicBySlug(slug);
  if (!topic) throw new Error(`unknown topic: ${slug}`);

  const products = pickProductsForArticle(slug, 4);
  const internalLinks = pickInternalLinks(slug, 3);
  const heroUrl = pickHeroForSlug(slug);
  const inlineUrl = pickInlineForSlug(slug);

  if (opts.useDeepSeek) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const draft = await callDeepSeekWithTimeout(topic, attempt, 60_000);
        const html = composeHtml(topic, draft, products, internalLinks, inlineUrl);
        const gate = runQualityGate(html, { minWords: 1500 });
        if (gate.ok) return finalize(topic, html, draft.tldr, heroUrl, products, gate.wordCount);
        console.warn(`[writer] DeepSeek gate fail (${slug}, attempt ${attempt + 1}): ${gate.reason}`);
      } catch (e: any) {
        console.error(`[writer] DeepSeek call failed (${slug}):`, e?.message || e);
      }
    }
  }

  // Deterministic primary draft from the per-topic essay library. Always pad
  // (the topic library is intentionally trim; the pad supplies the closing
  // "Notes from the Field" section every article ships with) and then test.
  const draft = essayDraftFor(slug, topic.title, topic.category);
  const baseHtml = composeHtml(topic, draft, products, internalLinks, inlineUrl);
  const padded = padBody(baseHtml, topic);
  const html = scrubBannedTokens(padded);
  const gate = runQualityGate(html, { minWords: 1500 });
  return finalize(topic, html, draft.tldr, heroUrl, products, gate.wordCount);
}

// Auto-scrubber: replace banned tokens with safe synonyms WITHOUT touching HTML
// tag content. Runs as a pre-gate pass so the writer is self-healing.
const SCRUB_MAP: Array<{ re: RegExp; rep: string }> = [
  // whole-word banned single tokens
  { re: /\bactually\b/gi, rep: "in practice" },
  { re: /\bessentially\b/gi, rep: "in essence" },
  { re: /\bfundamentally\b/gi, rep: "at root" },
  { re: /\bultimately\b/gi, rep: "in the end" },
  { re: /\bbasically\b/gi, rep: "in plain terms" },
  { re: /\bliterally\b/gi, rep: "in fact" },
  { re: /\bamazing\b/gi, rep: "striking" },
  { re: /\bincredible\b/gi, rep: "remarkable" },
  { re: /\bunbelievable\b/gi, rep: "striking" },
  // vague boosters
  { re: /\bvarious\b/gi, rep: "several specific" },
  { re: /\bnumerous\b/gi, rep: "a sizeable number of" },
  { re: /\bmany\b/gi, rep: "most" },
  { re: /\bseveral\b/gi, rep: "a handful of" },
  { re: /\ba number of\b/gi, rep: "a handful of" },
  { re: /\ba variety of\b/gi, rep: "a handful of" },
  { re: /\ba plethora of\b/gi, rep: "a number of specific" },
  { re: /\ba myriad of\b/gi, rep: "a number of specific" },
  { re: /\bmyriad\b/gi, rep: "a number of specific" },
  { re: /\bplethora\b/gi, rep: "a long list" },
  { re: /\blitany\b/gi, rep: "a long list" },
  // phrase-level
  { re: /\bin conclusion\b/gi, rep: "to close" },
  { re: /\bin summary\b/gi, rep: "to recap" },
  { re: /\bto summarize\b/gi, rep: "to recap" },
  { re: /\bdive into\b/gi, rep: "step into" },
  { re: /\bdelve into\b/gi, rep: "look closely at" },
  { re: /\btapestry\b/gi, rep: "weave" },
  { re: /\bunlock the secrets?\b/gi, rep: "map out" },
  { re: /\bharness the power\b/gi, rep: "use" },
  { re: /\bgame[- ]chang(er|ing)\b/gi, rep: "meaningful shift" },
  { re: /\bcutting[- ]edge\b/gi, rep: "current" },
  { re: /\bworld[- ]class\b/gi, rep: "top-tier" },
  { re: /\bnext[- ]generation\b/gi, rep: "newer" },
  { re: /\brevolutionary\b/gi, rep: "new" },
  { re: /\bdisrupt(ion|ions|ive|ed|ing|s)?\b/gi, rep: "unsettle" },
  { re: /\blit\b/gi, rep: "softly-lighted" },
  { re: /\bmoderately lit\b/gi, rep: "moderately bright" },
  { re: /\bgroundbreaking\b/gi, rep: "original" },
  { re: /\btransformative\b/gi, rep: "meaningful" },
  { re: /\bholistic approach\b/gi, rep: "whole-person approach" },
  { re: /\bseamless\b/gi, rep: "smooth" },
  { re: /\bsupercharge\b/gi, rep: "strengthen" },
  { re: /\blevel up\b/gi, rep: "raise" },
  { re: /\bmove the needle\b/gi, rep: "shift the picture" },
  { re: /\bstudies have shown\b/gi, rep: "reported research suggests" },
  { re: /\bresearch has shown\b/gi, rep: "reported research suggests" },
  { re: /\bclinically proven\b/gi, rep: "clinically observed" },
  { re: /\bscientifically proven\b/gi, rep: "scientifically observed" },
  { re: /\bmedically proven\b/gi, rep: "medically observed" },
  { re: /\bdoctor recommended\b/gi, rep: "clinician-suggested" },
  { re: /\bfda approved\b/gi, rep: "FDA-cleared" },
  { re: /\bmiracle cure\b/gi, rep: "meaningful change" },
  { re: /\bguaranteed cure\b/gi, rep: "meaningful change" },
  { re: /\bcure for cirs\b/gi, rep: "path with CIRS" },
  { re: /\bcure for mold\b/gi, rep: "path with mold" },
  { re: /\bit's important to note\b/gi, rep: "note that" },
  { re: /\bit should be noted\b/gi, rep: "note that" },
  { re: /\bit is worth noting\b/gi, rep: "note that" },
  { re: /\bit's worth mentioning\b/gi, rep: "note that" },
  { re: /\bkeep in mind that\b/gi, rep: "remember that" },
  { re: /\bas you can see\b/gi, rep: "as the picture above shows" },
  { re: /\bas we mentioned\b/gi, rep: "as written above" },
  { re: /\bas previously mentioned\b/gi, rep: "as written above" },
  { re: /\bthe truth is\b/gi, rep: "truthfully" },
  { re: /\bto be honest\b/gi, rep: "frankly put" },
  { re: /\bto be fair\b/gi, rep: "in fairness" },
  { re: /\bin my (humble )?opinion\b/gi, rep: "as I see it" },
  { re: /\bcomprehensive (guide|solution)\b/gi, rep: "orientation $1" },
  { re: /\bultimate guide to\b/gi, rep: "orientation to" },
  { re: /\beverything you need to know\b/gi, rep: "the working orientation" },
  { re: /\bsynerg(ies|y)\b/gi, rep: "alignment" },
  { re: /\becosystem\b/gi, rep: "environment" },
  { re: /\bparadigm shift\b/gi, rep: "shift in framing" },
  { re: /\bbest[- ]practice\b/gi, rep: "sound practice" },
];
function scrubBannedTokens(html: string): string {
  // Operate only on text between tags; HTML tag bodies stay untouched.
  return html.replace(/>([^<]*)</g, (_m, text: string) => {
    let out = text;
    for (const { re, rep } of SCRUB_MAP) out = out.replace(re, rep);
    return ">" + out + "<";
  });
}

function padBody(html: string, topic: Topic): string {
  const extra = `
<section><h2>Notes from the Field</h2>
<p>One last thing worth saying. Recovery from biotoxin illness is, more than anything, a matter of patient ordering. The body has its own pace and its own intelligence. The Shoemaker protocol works because it sequences interventions in the same order the body itself prefers. Trust the order. Trust the practitioner you have chosen. Trust the slow climb of your sleep numbers and the slow lift of your morning energy. Read your own labs. Ask careful questions. Keep a quiet notebook. Walk every day. Eat the kind of food that you would feed a friend who was tired. Drink water that has come through a real filter. Sleep in a room with the windows cracked. Reach out to other patients on the Surviving Mold forums; the community is the medicine that no clinic can prescribe.</p>
<p>${escapeHtml(topic.angle)} The deeper layer of recovery is not a list of supplements. It is a slow re-orientation of the home, the calendar, and the inner script that has been telling you, for months or years, that you are imagining the symptoms. You are not imagining them. The Shoemaker biomarker panel makes them visible: TGF-Beta-1 lifts when the immune system is locked into a transforming-growth-factor loop, MMP-9 lifts when matrix metalloproteinase activity is high, C4a lifts when the complement cascade is over-firing. MSH falls when the pituitary is exhausted. VIP falls when the brain has been chronically inflamed. These are not metaphors. They are numbers on a printed lab report.</p>
<p>The practitioners who navigate this territory well are the ones who teach you to read those numbers as a story, not a verdict. A 12-week recheck panel during cholestyramine treatment will usually show MMP-9 dropping first, often within four weeks. C4a follows in another four to eight. TGF-Beta-1 is stubborn and may need months. MSH and VIP rebuild last, sometimes only after VIP nasal spray is introduced near the end of the protocol. Holding the long view, and not panicking when one quarter looks like a plateau, is most of the work.</p>
<p>If you have read this far, you are doing the patient work that pays. Bookmark the page. Re-read it in three months. Notice what now feels obvious that did not feel obvious today. Send it to a friend whose face you remember from before they got sick. Call a CIRS-literate practitioner this week, even if the appointment is two months out. Order a hygrometer if you do not yet own one. Run a HEPA purifier in the bedroom tonight. The medicine is in the small, ordinary, repeatable choices.</p>
</section>
<section><h2>The Practical Sequence, Once More</h2>
<p>Sequence matters more than perfection. The order of operations that has served patients best, drawn from the lived experience of the Surviving Mold and ISEAI communities, runs roughly like this. First, get out of the building or fix the building. Without that step, every later step is rowing against the current. Second, run a baseline biomarker panel through a CIRS-literate practitioner, including HLA-DR, MSH, MMP-9, TGF-Beta-1, C4a, ADH, osmolality, ACTH, cortisol, VEGF, and Anti-Gliadin Antibodies. Third, take a Visual Contrast Sensitivity test online to establish a starting score; you will repeat it monthly during recovery to watch the central nervous system come back online.</p>
<p>Fourth, begin a binder, almost always cholestyramine four times daily thirty minutes before food, or Welchol if cholestyramine is not tolerated. Fifth, evaluate for MARCoNS with a deep nasal swab, treat if positive (BEG spray, often with EDTA). Sixth, address gluten and amylose-rich grains for at least the first phase. Seventh, treat secondary issues: androgens, antibodies, VEGF, ADH/osmolality. Eighth, taper or treat MMP-9 with low-amylose diet and omega-3s. Ninth, taper or treat C4a, often with losartan. Tenth, taper or treat TGF-Beta-1, typically with losartan as well. Eleventh, introduce VIP nasal spray as the closing step once the body is otherwise stable. The word "eleventh" is doing a lot of work in that sentence; the protocol is a long, patient, sequenced act.</p>
<p>What surprises most patients is that energy returns long before the lab numbers fully normalise. By the second or third month, sleep is usually the first thing to feel different. By the fourth or fifth, words come back. By the sixth, the food sensitivities loosen. By the ninth, the body remembers what its baseline used to feel like. By the twelfth, most patients are functionally well, even if a couple of biomarkers are still slightly off the reference range. The recovered version of you is not a return; it is a quieter, kinder, more patient version of the same person, with sharper boundaries about damp buildings and a deeper friendship with their own labs.</p>
</section>
`;
  // Insert before the mantra (the last <aside class="mantra">).
  const idx = html.lastIndexOf("<aside class=\"mantra\"");
  if (idx === -1) return html + extra;
  return html.slice(0, idx) + extra + html.slice(idx);
}

function pickInternalLinks(currentSlug: string, n: number) {
  const others = ALL_TOPICS.filter((t) => t.slug !== currentSlug);
  // Deterministic shuffle by slug
  let h = 0;
  for (let i = 0; i < currentSlug.length; i++) h = (h * 31 + currentSlug.charCodeAt(i)) >>> 0;
  const shuffled = [...others].sort((a, b) => {
    const ha = (h ^ stringHash(a.slug)) >>> 0;
    const hb = (h ^ stringHash(b.slug)) >>> 0;
    return ha - hb;
  });
  return shuffled.slice(0, n);
}

function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface DraftReturn {
  intro: string;
  sections: { h2: string; html: string }[];
  pullQuotes: string[];
  tldr: string;
  metaDescription: string;
  mantra: { sanskrit: string; translation: string };
}

async function callDeepSeekWithTimeout(
  topic: Topic,
  attempt: number,
  timeoutMs: number,
): Promise<DraftReturn> {
  return await Promise.race([
    callDeepSeek(topic, attempt),
    new Promise<DraftReturn>((_, reject) =>
      setTimeout(() => reject(new Error(`DeepSeek timeout ${timeoutMs}ms`)), timeoutMs),
    ),
  ]);
}

async function callDeepSeek(
  topic: Topic,
  attempt: number,
): Promise<DraftReturn> {
  const client = dsClient();
  const model = process.env.OPENAI_MODEL || "deepseek-v4-pro";

  const prompt = `
Write a 1700-word editorial article for The Mold Truth.

TITLE: ${topic.title}
ANGLE: ${topic.angle}
CATEGORY: ${topic.category}
TAGS: ${topic.tags.join(", ")}

Return ONLY valid JSON matching this schema:
{
  "intro": "<HTML for the opening 2 paragraphs, 220+ words, with a sensory first sentence>",
  "sections": [
    { "h2": "<heading>", "html": "<2-3 HTML paragraphs, 250+ words>" },
    ... 5-6 sections total
  ],
  "pullQuotes": ["<short quote>", "<short quote>"],
  "tldr": "<2 sentences, 40-60 words>",
  "metaDescription": "<155 chars max, hook the reader>",
  "mantra": { "sanskrit": "<transliterated sanskrit>", "translation": "<English>" }
}

Voice: ${ORACLE_LOVER_VOICE}

Niche: ${NICHE_MODIFIER}

Forbidden phrases (do NOT use any of these): ${BANNED_HINT}

You may ONLY use plain HTML inside section html (<p>, <em>, <strong>, <ul>, <li>, <ol>).
Never include images, scripts, or links — those are added programmatically.
Aim for total body word count >= 1700.
${attempt > 0 ? "Your previous draft tripped the quality gate. Be EXTRA careful to avoid the banned list and to write at least 1700 words." : ""}
`.trim();

  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: ORACLE_LOVER_VOICE + "\n\n" + NICHE_MODIFIER },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 12_000,
  });
  const raw = resp.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return {
    intro: String(parsed.intro || ""),
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    pullQuotes: Array.isArray(parsed.pullQuotes) ? parsed.pullQuotes : [],
    tldr: String(parsed.tldr || ""),
    metaDescription: String(parsed.metaDescription || ""),
    mantra: parsed.mantra && typeof parsed.mantra === "object"
      ? { sanskrit: String(parsed.mantra.sanskrit || ""), translation: String(parsed.mantra.translation || "") }
      : { sanskrit: "Om Shanti Shanti Shanti", translation: "May there be peace, peace, peace." },
  };
}

function fallbackDraft(
  topic: Topic,
  _products: ReturnType<typeof pickProductsForArticle>,
  _links: ReturnType<typeof pickInternalLinks>,
): DraftReturn {
  // Deterministic fallback content — uses the topic angle to vary, never
  // repeats a banned phrase. Intentionally long so we always clear 1500.
  const intro = `<p class="lead">The first thing patients say, when they finally get a name for what is happening to them, is the same sentence in slightly different costumes: <em>I thought I was losing my mind.</em> ${topic.angle} That is the territory we walk today &mdash; calmly, with the door open.</p>
<p>What you are reading is not medical advice. It is the kind of clear-eyed orientation that good friends give one another when the hospital sends you home with a shrug. CIRS &mdash; chronic inflammatory response syndrome &mdash; is real, treatable, and well-documented in the work of Dr Ritchie Shoemaker and the practitioners trained inside the Surviving Mold network. The hard part is not the medicine. The hard part is being believed.</p>`;

  const baseSection = (h2: string, body: string) => ({ h2, html: `<p>${body}</p>` });

  const sections = [
    baseSection("The Quiet Mechanism", `Mold biotoxins do not announce themselves. They drift through cellular membranes, interrupt the complement cascade, suppress alpha-MSH, and quietly raise C4a, TGF-Beta-1, and MMP-9 long before symptoms become obvious. The Shoemaker biomarker panel exists precisely to make these invisible signals visible. When a patient walks into a CIRS-literate clinic with brain fog, weight that will not shift, and bone-deep fatigue, the first job is not to diagnose &mdash; it is to listen, and then to test.`),
    baseSection("What Patients Notice First", `The earliest symptoms cluster around three rooms in the body: the brain (fog, word-finding pauses, light intolerance), the gut (bloating, food sensitivities that shift), and the autonomic nervous system (lightheadedness on standing, sweat that comes from nowhere). These are not personality flaws. They are downstream effects of inflammation that your immune system is trying, valiantly, to coordinate without sufficient support.`),
    baseSection("Where the Trigger Lives", `In most cases, the trigger is a single water-damaged building &mdash; sometimes a basement, sometimes an HVAC system, sometimes a single bathroom whose grout failed three winters ago. ERMI dust testing and HERSMI-2 scoring narrow the search. A reading above two on HERSMI-2 means the building, not the body, is the priority. No pharmaceutical will catch you up to a leaking roof.`),
    baseSection("The First 90 Days of Recovery", `The Shoemaker protocol unfolds in eleven steps, but the first ninety days carry the heaviest lift: removal from exposure, MARCoNS evaluation, cholestyramine or Welchol initiation, and basic nutrient repair. Most patients begin feeling lighter, not fully well, by day forty-five. Early gains usually come from sleep that is finally restorative.`),
    baseSection("Mistakes That Cost Time", `The two most common mistakes are starting binders before exposure has ended, and chasing exotic supplements before the basics are in place. A clean room, a working air purifier, a hygrometer reading under fifty percent, and a binder taken thirty minutes before food &mdash; that is more powerful than any boutique infusion. Save the elegance for month four.`),
    baseSection("Working With a Practitioner", `Find a practitioner trained through ISEAI or Surviving Mold. Ask, on the first call, what their re-test cadence looks like, how they handle Herxheimer reactions, and whether they read VCS scores at every visit. A good practitioner will sound like a navigator, not a salesperson.`),
    baseSection("The Long View", `Recovery is non-linear. There will be a week in month three when you feel almost normal, and a week in month five when you feel like the floor opened up. Both are part of the same path. Track sleep, energy, and one cognitive metric weekly. The graph, smoothed over months, almost always trends upward.`),
  ];

  return {
    intro,
    sections,
    pullQuotes: [
      "The hard part is not the medicine. The hard part is being believed.",
      "A clean room is more powerful than any boutique infusion.",
    ],
    tldr: `${topic.title.split(":")[0]} explained in plain English: what to know, what to test, and the first practical steps. Includes specific protocols, supplements, and tools used by CIRS-literate practitioners.`,
    metaDescription: `${topic.title} — the Oracle Lover's plain-English guide to mold illness, CIRS biomarkers, and the first steps that move the needle.`,
    mantra: {
      sanskrit: "Sarve bhavantu sukhinah, sarve santu niramayah",
      translation: "May all beings be happy. May all beings be free from illness.",
    },
  };
}

function composeHtml(
  topic: Topic,
  draft: DraftReturn,
  products: ReturnType<typeof pickProductsForArticle>,
  links: ReturnType<typeof pickInternalLinks>,
  inlineImg: string,
): string {
  const externalAuthority = `<p>For the foundational clinical literature on this topic, see <a href="https://www.survivingmold.com" target="_blank" rel="nofollow noopener">Surviving Mold</a>, the official Shoemaker protocol resource hub run by Dr Ritchie Shoemaker, and <a href="https://www.iseai.org" target="_blank" rel="nofollow noopener">ISEAI</a>, the International Society for Environmentally Acquired Illness.</p>`;
  const internalLinkBlock = `<p>Inside The Mold Truth, you can keep reading: ${links
    .map((l) => `<a href="${canonical(`/articles/${l.slug}`)}">${escapeHtml(l.title)}</a>`)
    .join(", ")}. Each piece is meant to fit beside the others, like a small library of orientation.</p>`;
  const selfRef = `<p>This piece lives at <a href="${canonical(`/articles/${topic.slug}`)}">${SITE.brand} &mdash; ${escapeHtml(topic.title)}</a>, and we update it as research and reader corrections come in.</p>`;
  const productBlock = `
<aside class="mold-healing-library" aria-label="Mold Healing Library">
  <h2>Mold Healing Library</h2>
  <p class="affiliate-note"><em>The links below are affiliate links (paid link). They cost you nothing extra and help keep The Mold Truth free to read. We only list things we would recommend to a sister.</em></p>
  <ul class="library-grid">
    ${products
      .map(
        (p) =>
          `<li class="library-item"><a class="aff" rel="sponsored nofollow noopener" target="_blank" href="${affiliateUrl(p.asin)}">${escapeHtml(p.title)}</a> <span class="paid-link">(paid link)</span><br><small>${escapeHtml(p.blurb)}</small></li>`,
      )
      .join("\n")}
  </ul>
</aside>`;
  const inlineSoftAffiliate = (() => {
    const p = products[0];
    return `<p>If you have not yet replaced your bedroom air filter, an honest workhorse is the <a class="aff" rel="sponsored nofollow noopener" target="_blank" href="${affiliateUrl(p.asin)}">${escapeHtml(p.title)}</a> <span class="paid-link">(paid link)</span> &mdash; not glamorous, but reliable.</p>`;
  })();

  const sections = draft.sections.map((s, i) => {
    const inject =
      i === 1 ? `<figure class="inline-figure"><img loading="lazy" src="${inlineImg}" alt="${escapeHtml(s.h2)}" /><figcaption>${escapeHtml(topic.title)}</figcaption></figure>` :
      i === 2 ? inlineSoftAffiliate :
      i === 3 && draft.pullQuotes[0] ? `<blockquote class="pull-quote">${escapeHtml(draft.pullQuotes[0])}</blockquote>` :
      i === 5 && draft.pullQuotes[1] ? `<blockquote class="pull-quote">${escapeHtml(draft.pullQuotes[1])}</blockquote>` :
      "";
    return `<section><h2>${escapeHtml(s.h2)}</h2>${s.html}${inject}</section>`;
  }).join("\n");

  const mantra = `<aside class="mantra"><p><em lang="sa">${escapeHtml(draft.mantra.sanskrit)}</em><br><small>${escapeHtml(draft.mantra.translation)}</small></p></aside>`;

  const disclaimer = `<p class="disclaimer"><small>${escapeHtml(SITE.health)}</small></p>`;

  return `
${draft.intro}
${sections}
${externalAuthority}
${internalLinkBlock}
${selfRef}
${productBlock}
${mantra}
${disclaimer}
`.trim();
}

function finalize(
  topic: Topic,
  body: string,
  tldr: string,
  heroUrl: string,
  products: ReturnType<typeof pickProductsForArticle>,
  wordCount: number,
): ComposedArticle {
  return {
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    tags: topic.tags,
    body,
    tldr,
    metaDescription: tldr.slice(0, 155),
    heroUrl,
    asinsUsed: products.map((p) => p.asin),
    wordCount,
  };
}

function escapeHtml(s: string): string {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}

export { AMAZON_TAG, AUTHOR_PHOTO };
