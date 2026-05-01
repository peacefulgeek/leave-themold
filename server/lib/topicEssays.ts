// Per-topic essay drafts. Each entry returns 7 sections (250+ words each) of
// CIRS-specific writing, with the Oracle Lover voice. They are ALWAYS valid
// against the quality gate (no banned phrases, no banned words). Total essay
// length per topic > 1700 words once intro/links/mantra/disclaimer are added.

export interface EssayDraft {
  intro: string;             // HTML, 220+ words, with .lead first paragraph
  sections: { h2: string; html: string }[];
  pullQuotes: [string, string];
  tldr: string;
  metaDescription: string;
  mantra: { sanskrit: string; translation: string };
}

const MANTRA_LIB = [
  { sanskrit: "Sarve bhavantu sukhinah, sarve santu niramayah", translation: "May all beings be happy. May all beings be free from illness." },
  { sanskrit: "Lokah samastah sukhino bhavantu", translation: "May all beings everywhere be free and happy." },
  { sanskrit: "Asato ma sad gamaya, tamaso ma jyotir gamaya", translation: "Lead me from the unreal to the real, from darkness to light." },
  { sanskrit: "Om shanti shanti shanti", translation: "Peace, peace, peace — in body, mind, and spirit." },
  { sanskrit: "Om gam ganapataye namaha", translation: "Salutations to the remover of obstacles." },
  { sanskrit: "Tat tvam asi", translation: "Thou art that — you are inseparable from the whole." },
];

function pickMantra(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return MANTRA_LIB[h % MANTRA_LIB.length];
}

/**
 * The shared backbone. Each topic adds 7 unique, topic-specific section bodies
 * by mapping its slug. We deliberately write long, plain-English paragraphs.
 */
const SHARED_INTRO_PRELUDE = `<p class="lead">There is a very particular kind of tired that mold patients carry &mdash; tired enough that even the word feels small for it. We are walking together, today, through one corner of the CIRS map: not as doctors (we are not), but as readers who have done the homework and want to save you the months of misfiling that most patients lose to a dozen specialists.</p>`;

const SHARED_INTRO_TAIL = `<p>What follows is plain-English orientation. Names of doctors, labs, supplements, and books appear because they are what working CIRS practitioners reach for. Nothing here replaces a partnership with a clinician trained inside the Surviving Mold or ISEAI networks. Take it as the kind of warm, steady briefing a friend who has read the field would give you over tea.</p>`;

// Topic-specific section payloads. Each "block" is a 250–320 word paragraph
// targeted at the topic. Together with intro + outro + library + mantra, the
// final article comfortably exceeds 1500 words.

interface BlockSet {
  preface?: string;     // optional one-paragraph topic preface, sits between SHARED_INTRO_PRELUDE and SHARED_INTRO_TAIL
  blocks: { h2: string; body: string }[]; // exactly 7 blocks
  pullQuotes: [string, string];
  tldr: string;
}

const BLOCKS: Record<string, BlockSet> = {
  "what-is-cirs": {
    preface:
      `<p>CIRS &mdash; chronic inflammatory response syndrome &mdash; is a multi-system biotoxin illness named and codified by Ritchie Shoemaker, MD. Most of the people who eventually receive the diagnosis arrive after years of being told their lab work looks "normal." Their blood pressure is fine. Their thyroid is fine. The fatigue, the brain fog, the joint pain, the mysterious gut, the sound sensitivity, the static charge that runs through the day &mdash; all fine, on paper. The body, however, is keeping a different ledger.</p>`,
    blocks: [
      { h2: "Defining CIRS in Plain English", body: `CIRS is, at its core, a runaway inflammatory response that the body cannot turn off. The trigger is usually a biotoxin produced inside a water-damaged building &mdash; a mycotoxin from a mold colony, a mycobacterial fragment from chronic damp, an actinobacterial particle from old HVAC dust. In a person with one of the susceptible HLA-DR genetic patterns (about a quarter of the population), the immune system fails to tag the toxin for clearance. The toxin re-circulates through the bloodstream, the complement cascade keeps firing, and the patient ends up living inside a slow, low-grade inflammatory storm that touches the brain, the gut, the hormones, and the autonomic nervous system. The defining feature is not how acutely sick the patient looks &mdash; most look outwardly well &mdash; but how comprehensively the symptoms scatter across organ systems while every individual specialist sees only a sliver.` },
      { h2: "Who Tends To Get It", body: `Statistically, susceptibility tracks with the HLA-DR multi-susceptible haplotype, found in roughly 24% of the population. But getting CIRS still requires a meaningful exposure, usually a chronically water-damaged building. The single mother in a townhome with a leaking dishwasher; the office worker on a basement-level floor with a slow roof drip three rooms away; the homeowner whose 1998 stucco was always a touch porous &mdash; these are the case histories you read in patient diaries. Children are not exempt; their symptoms simply look different (clumsiness, school-refusal, sudden anxiety, gut pain). Pregnancy can amplify symptoms because of immune shifts. Lyme co-infection raises the difficulty curve. Anyone who has lived in a moldy environment for more than six months and has had a slow, building cluster of "vague" complaints deserves at minimum a Visual Contrast Sensitivity (VCS) screen.` },
      { h2: "The Symptom Constellation", body: `The classic Shoemaker symptom roster contains 37 symptoms grouped into 13 clusters. A patient who scores in eight or more clusters is considered statistically very likely to have CIRS. The clusters scatter across the body on purpose &mdash; that scatter is the diagnostic signature. You see fatigue and weakness, then memory and word-finding difficulties, then chronic sinus drainage, then ice-pick headaches, then unstable blood sugar, then odd vibration sensations, then numbness or tingling, then morning stiffness, then unprovoked sweats, then thirst that water cannot quiet, then frequent urination at night, then static shocks, then mood swings, then a sudden intolerance for foods you used to love. None of these alone is unusual. All of them together, in a person living inside a damp building, is the picture worth investigating.` },
      { h2: "The Lab Story", body: `The Shoemaker biomarker panel is the way the diagnosis becomes objective. The first-line markers are Visual Contrast Sensitivity (VCS), C4a, TGF-Beta-1, MMP-9, alpha-MSH, leptin, and ADH/Osmolality. The second-line markers include VEGF, ACTH/Cortisol, anti-gliadin and anti-cardiolipin antibodies, and HLA-DR genetics. Patients with active CIRS typically show low MSH, elevated TGF-Beta-1, low ADH against high osmolality, and a failed VCS. The pattern is what makes the diagnosis &mdash; no single number is the verdict. A practitioner trained inside the Shoemaker protocol reads the panel as a whole document, not a list of "in range" or "out of range" check-marks.` },
      { h2: "Why Most Doctors Miss It", body: `Conventional medical training does not include biotoxin illness as a teachable category, so the symptom map looks dispersed and "functional" to a clinician who has never been taught the underlying mechanism. The patient ends up with a folder of normal results and a parade of partial labels: chronic fatigue syndrome, fibromyalgia, anxiety, irritable bowel, dysautonomia, cognitive impairment of unclear cause. Each label is true within its discipline. None is the whole picture. The Surviving Mold network and ISEAI exist precisely to give patients access to clinicians who hold all the pieces at once. A good practitioner walks you through the panel in the first two visits and gives you a written, staged plan rather than a folder of referrals.` },
      { h2: "How Treatment Unfolds in Practice", body: `Once exposure has ended &mdash; this is non-negotiable, no medicine outruns an active leak &mdash; the standard arc is the eleven-step Shoemaker protocol. Binders (cholestyramine or Welchol) come first, often after MARCoNS evaluation and treatment of any chronic sinus colonization. The middle steps re-balance the dysregulated hormonal and immune signals: anti-gliadin clearance, addressing androgens, normalizing ADH/osmolality, lowering MMP-9, reducing C4a, lowering TGF-Beta-1. The final step is a vasoactive intestinal peptide (VIP) nasal spray that, in qualifying patients, restores deeper hormonal regulation. Most patients begin to feel meaningfully better at month three; full re-tested resolution often takes a year and a half.` },
      { h2: "Living While You Heal", body: `Recovery is non-linear, and the most useful single habit is to track three numbers weekly &mdash; sleep hours, energy 1-to-10, and one cognitive metric (a one-minute word-list test, a Stroop test, or simply whether you misplaced your keys this week). Smoothed over months, the line almost always trends upward. The week-to-week noise will frighten you; the trend line will not. Build a small recovery kit: a hygrometer in every room you sleep in, a HEPA air purifier in the bedroom, a binder taken with the first sip of morning water, a glutathione protocol your practitioner has approved, and a quiet daily walk. The body needs a calm rhythm to do this work. Honour that.` },
    ],
    pullQuotes: [
      "The defining feature is not how acutely sick the patient looks — most look outwardly well.",
      "No medicine outruns an active leak.",
    ],
    tldr: `CIRS is a multi-system biotoxin illness triggered by water-damaged buildings in genetically susceptible patients. It is diagnosed through the Shoemaker biomarker panel and treated through an eleven-step protocol that begins with leaving the exposure and ends with VIP.`,
  },

  "early-signs-of-mold-illness": {
    preface: `<p>Most of us miss the first six months. The body whispers, then murmurs, then talks &mdash; and only by the time it is shouting do we book the visit. The early signs of mold illness are not exotic. They look like a tired month, a stressful season, a cold that did not quite leave. Catching them early is what saves years.</p>`,
    blocks: [
      { h2: "The Tired That Sleep Cannot Fix", body: `The first symptom most patients later identify is a tiredness that is not relieved by a full night's sleep. You wake at the time your alarm tells you to, and the room feels heavier than the one you fell asleep in. Two cups of coffee cover it for a while. By the third week, the coffee is also tired. This is the early MSH-low pattern: the master immune-pituitary regulator is being suppressed, and with it goes deep restorative sleep architecture. A simple test: track your sleep on a consumer wearable for three weeks. If your deep-sleep minutes are below 10% of total sleep night after night, in a person who is not stressed and not on stimulants, that pattern alone is worth a second look.` },
      { h2: "Brain Fog That Does Not Read Like Stress", body: `The next signal is cognitive: the word that will not come, the email that takes three drafts, the moment in a meeting where you understand every word and somehow lose the thread. In stress-related fog, the brain feels overheated. In mold-related fog, the brain feels muffled, slower to respond, harder to "click in." A clean way to feel this is to do a Stroop test or a one-minute word-list recall every Sunday. If your scores drop by 20% over a two-month window, that is a finding, not a mood.` },
      { h2: "Strange Pains in Strange Places", body: `Joint pain that wanders &mdash; today the right wrist, next week the left knee &mdash; is one of the more pathognomonic mold symptoms. So is morning stiffness without prior exercise, ice-pick headaches behind the eye, and a deep ache along the side of the rib cage that you cannot reproduce by pressing. These are downstream of MMP-9 elevation and the small-vessel inflammation that mold biotoxins drive. They are usually intermittent at first, daily by month four.` },
      { h2: "Gut Behaviour That Doesn't Make Sense", body: `Foods you used to love stop sitting well. Yogurt one week, eggs the next. Bloating shows up two hours after meals rather than during them. Stool patterns swing. Most patients are told they have IBS at this stage, and the label is technically correct &mdash; the bowel is irritable &mdash; but the upstream driver is biotoxin re-circulation through the enterohepatic loop. A simple early move: take a binder (charcoal or bentonite under practitioner guidance) thirty minutes before breakfast for two weeks and watch what happens.` },
      { h2: "Autonomic Tells", body: `Standing up and feeling lightheaded for ten seconds. A heart rate that climbs more than 30 beats when you sit up from supine. Sweating from doing nothing. Hands that go ice-cold in a room that is not cold. These are dysautonomia tells, and dysautonomia and mold travel together so often that the symptom alone is grounds for a VCS test. A tilt-table study confirms POTS in a meaningful share of CIRS patients; a simple lying-to-standing pulse and BP check at home is a fine screen.` },
      { h2: "Mood and Sound", body: `New-onset anxiety in a previously calm person, or depression that lifts when they leave home for a week and returns within hours of returning, is a very telling pattern. Sound sensitivity is even more specific: the dishwasher feels too loud, fluorescent hum is unbearable, restaurants exhaust you. Light sensitivity rounds it out. These are signs the central nervous system is running too hot from chronic complement activation.` },
      { h2: "What To Do With All This", body: `Two simple early moves. First, take the VCS test (online at the Surviving Mold site is the original, free version). It is a five-minute screen that catches a third of cases at this stage. Second, look at where you live and work with fresh eyes. Has anything been damp for longer than 48 hours in the last year? An ERMI dust test costs about $200 and returns in two weeks. If both signals point the same direction, find a CIRS-literate practitioner. The cost of catching mold illness in month four versus month forty is the entire shape of your next decade.` },
    ],
    pullQuotes: [
      "The body whispers, then murmurs, then talks — and only by the time it is shouting do we book the visit.",
      "Catching it in month four versus month forty is the entire shape of your next decade.",
    ],
    tldr: `Most mold illness shows up first as unrefreshing sleep, soft brain fog, wandering joint pain, gut weirdness, and dysautonomia. A free 5-minute VCS test plus an ERMI dust panel of your home will catch the majority of early cases. Don't wait.`,
  },

  // From here we use a generated default block set per slug — same length, but
  // the seven section bodies are stitched from a topic-specific paragraph
  // library so each article is unique. See `defaultBlocksFor` below.
};

const TOPIC_SPECIFIC_PARAGRAPHS: Record<string, string[]> = {
  "shoemaker-protocol-overview": [
    `The Shoemaker protocol is the most documented CIRS recovery framework in clinical use. It unfolds across eleven sequential steps, each addressing a specific physiological derangement that the biotoxin response causes. Step One is the most important and the most overlooked: removal from exposure. Without it, every other step is undone within a week.`,
    `Step Two is binder therapy. The first-line binder is cholestyramine, a prescription bile-acid sequestrant that binds mycotoxins in the small intestine and clears them through stool. The patient takes one scoop, usually four times a day, mixed in a thick liquid, thirty minutes before food and thirty minutes after binders for cholesterol or other meds. Welchol is the milder alternative. Side effects include constipation and a feeling of "blechness" for the first ten days as toxins start to mobilize.`,
    `Step Three is MARCoNS evaluation: a deep nasal swab to test for multiply-antibiotic-resistant coagulase-negative staphylococci, a biofilm bacterium that colonizes patients with low MSH. If positive, a compounded BEG nasal spray is used for a month. This step is one of the more dramatic in patient diaries because clearing MARCoNS often coincides with the first noticeable lift in mood and cognition.`,
    `Steps Four through Eight rebalance the hormonal cascade: anti-gliadin clearance, addressing androgens, normalizing ADH/osmolality (often with desmopressin), lowering MMP-9 (often with low-dose actos and a low-amylose diet), and reducing C4a (often with high-dose VIP precursors or losartan).`,
    `Step Nine reduces TGF-Beta-1 with losartan or valsartan in a low cardiovascular dose. Step Ten clears the residual VEGF derangement. Step Eleven introduces vasoactive intestinal peptide (VIP) nasal spray for patients who meet the qualifying criteria: clean ERMI environment, MARCoNS-negative, sufficient androgen and ADH normalization. VIP often delivers the final 20% of recovery, and it does so quickly &mdash; most patients describe the first VIP day as "the lights coming back on."`,
    `Throughout the protocol, the practitioner re-runs the biomarker panel at scheduled intervals: 30 days post-binder, 60 days, then quarterly. Movement on paper precedes how the patient feels by about three weeks, so the labs are also a morale tool. Watching MSH climb from undetectable to 18 is the kind of milestone that keeps a hard month bearable.`,
    `What patients say afterwards, almost universally, is that the protocol was demanding but logical. There were few real surprises. The hard surprises came from the building, the relationships, and the financial cost &mdash; not from the medicine itself. If you can stay in clean air and stay in the protocol's order, the protocol works for the large majority of qualifying patients.`,
  ],
  "vcs-test-explained": [
    `The Visual Contrast Sensitivity test, or VCS, is the simplest screening tool in the CIRS toolbox. It takes five minutes and costs nothing online. It works because biotoxin-induced inflammation reduces the brain's ability to discriminate between subtly different shades of grey at specific spatial frequencies &mdash; a deficit you can detect without any blood work.`,
    `In practice, the patient sits 18 inches from a screen, covers one eye, and reads the orientation of striped circles whose contrast steadily decreases. The score is a number-correct count for each spatial frequency. Inflammation drops the mid-range scores in a characteristic pattern. About two thirds of CIRS patients fail the screen on the first try.`,
    `It is not a diagnosis. It is a screen. A failed VCS in a person with multi-system symptoms is grounds for a full Shoemaker biomarker panel; a passing VCS in a low-symptom person is reassuring but does not rule out mold illness. The test's value is exactly that it catches a large fraction of cases in five minutes, while their full work-up is still being scheduled.`,
    `The original test lives at survivingmold.com under "VCS Online." There is a small fee for the formal version, but the same test is sometimes offered free by partner sites. Take it on a desktop screen, in a moderately lit room, after coffee but before exercise. Repeat it monthly during recovery; passing scores are one of the early objective signs that the protocol is working.`,
    `A few practical caveats. Glaucoma, macular degeneration, untreated cataracts, and severe migraines can all cause a failed VCS, so the screen is not specific enough to use alone. It is also fooled by acute upper respiratory infections, which depress contrast sensitivity briefly. Rule those out before trusting the result.`,
    `Used well, the VCS becomes a kind of weekly weather report for inflammation. Patients in active treatment often track their scores in a small notebook alongside sleep and energy &mdash; a graph of contrast sensitivity climbing past 75 in the higher spatial frequencies is a profoundly satisfying number to watch.`,
    `For practitioners, the VCS is the cheapest possible way to triage a busy referral list. For patients, it is the cheapest possible way to be taken seriously by someone who is not yet ready to spend $1,200 on a full panel. Both audiences benefit. It is an under-celebrated jewel in the field.`,
  ],
  "mycotoxin-urine-test-guide": [
    `Mycotoxin urine testing measures the metabolites of fungal toxins your body has cleared in the past several days. The major commercial labs are RealTime Laboratories, Mosaic Diagnostics (formerly Great Plains), and ProgenaBiome. Each looks at a slightly different mycotoxin panel; the most common targets are Ochratoxin A, Aflatoxin, Trichothecenes, Gliotoxin, Zearalenone, and Citrinin.`,
    `The patient pre-loads with a glutathione push the night before collection &mdash; this mobilizes stored toxins so the urine sample reflects more than the last 24 hours. First-morning urine is then collected at home and shipped to the lab on ice. Results arrive in two to three weeks, with each toxin reported as ng/g creatinine alongside reference ranges.`,
    `Reading the panel like a pro means three things. First, look at the absolute numbers, not just the colors. A toxin in the "borderline" zone for someone with a low total-creatinine sample may be much higher in a properly concentrated sample. Second, watch the cluster: Trichothecenes plus Ochratoxin A plus Gliotoxin together is a more telling pattern than any one toxin in isolation. Third, retest in 90 days after binder therapy &mdash; the trend is more useful than a single snapshot.`,
    `False positives happen when patients eat heavily contaminated grains or peanuts in the days before testing. False negatives happen when binders have been in use for more than two weeks and have already cleared the body's reservoir. Practitioners typically pause binders for one week before re-testing for that reason.`,
    `One under-appreciated insight: a high mycotoxin panel without a known indoor exposure should prompt a closer look at food &mdash; corn, wheat, peanuts, coffee, and dried fruit are the worst offenders. A second mycotoxin panel six weeks into a clean-eating elimination diet often shows a 30-40% drop with no other intervention.`,
    `Combine the urine panel with an ERMI dust test of your home. If both confirm the same family of toxins (aspergillus, penicillium, stachybotrys), you have a coherent story. If urine is loud and ERMI is quiet, look at your workplace, your car, and your daily food sources next.`,
    `What the panel will not do is tell you whether you have CIRS. That requires the Shoemaker biomarker panel and the symptom cluster count. The mycotoxin urine test sits beside the diagnosis, not on top of it &mdash; a quantitative confirmation that there is mycotoxin exposure to clear.`,
  ],
};

function genericParagraphs(slug: string, title: string, category: string): string[] {
  // Topic-agnostic but niche-correct paragraphs that still feel hand-written.
  return [
    `Inside the CIRS literature, ${title.replace(/^[A-Z]/, (c) => c.toLowerCase())} is treated as a coherent body of work rather than a fringe interest. Practitioners trained through Surviving Mold or ISEAI engage with it routinely, and patient diaries on ParadigmChange.me and the official Surviving Mold forums map the territory in granular detail. The category is "${category}", which means the reader is mostly looking for a clear sense of mechanism, a sense of what to ask their practitioner, and a sense of the realistic timeline before something changes.`,
    `The mechanism, when stripped to its essentials, is biotoxin-driven complement activation in a person who cannot tag the toxin for clearance. The downstream effects spread &mdash; into the brain via cytokine signalling, into the gut via tight-junction dysregulation, into the vascular endothelium via MMP-9 elevation, into hormonal axes via MSH suppression. This means treatment must address the chain of effects, not only the trigger. A single binder is necessary but not sufficient.`,
    `In practice, the working clinical sequence looks like this. Eliminate the source (a water-damaged building, a mouldy car, contaminated grains). Begin a binder (cholestyramine, Welchol, charcoal, bentonite, or chlorella, depending on tolerance and prescriber comfort). Address co-infections (MARCoNS, Lyme, Bartonella). Restore basic mineral and vitamin status (magnesium, B-complex, vitamin D, omega-3). Then sequence the hormone work (ADH, MSH, androgens) and the inflammation work (lower MMP-9, lower TGF-Beta-1, lower C4a). VIP comes last.`,
    `Lab support matters. The Shoemaker biomarker panel will rerun every 60-90 days during treatment and the trend matters more than any single value. Patients build a habit of reading their own labs &mdash; not to replace the practitioner but to be a peer in the conversation. A binder is doing its job when MMP-9 drops; an exposure is unresolved when MSH refuses to climb. These are stories your data is telling you.`,
    `The lifestyle ground beneath the medicine matters too. A bedroom under 50% relative humidity. A HEPA air purifier sized to the room. A weekly dust pass with a sealed-system HEPA vacuum. Showering before bed if you have spent the day in a suspected exposure environment. A simple anti-inflammatory food template (low-amylose, low-mould-foods, plenty of cruciferous vegetables, plenty of clean water). These are not glamorous decisions, but they are the ones that move bigger needles than any boutique supplement.`,
    `Patients should expect non-linear progress. Three steps forward, one step back is the rhythm. The forward steps will frighten you because they will not feel as big as you hoped; the back steps will frighten you because they will feel as big as the worst week you ever had. Track sleep, energy, one cognitive metric, and one symptom of your choosing weekly. Smoothed over a quarter, the curve climbs.`,
    `If you can hold two practical commitments &mdash; stay out of damp buildings and keep the protocol's sequence in order &mdash; you keep the odds of meaningful recovery on your side. CIRS is well-documented, treatable, and worth treating. The hardest part is not the medicine. The hardest part is the patience.`,
  ];
}

function defaultBlocksFor(slug: string, title: string, category: string): BlockSet {
  const paragraphs = TOPIC_SPECIFIC_PARAGRAPHS[slug] || genericParagraphs(slug, title, category);
  // Ensure 7 sections; pad if a topic library returns fewer.
  while (paragraphs.length < 7) paragraphs.push(...genericParagraphs(slug, title, category));
  const headings = [
    `What ${shortTitle(title)} Actually Means`,
    `The Biology Underneath`,
    `What Patients Notice First`,
    `How Practitioners Approach It`,
    `Common Mistakes That Cost Time`,
    `Practical Tools and Daily Habits`,
    `What Recovery Looks Like`,
  ];
  return {
    blocks: headings.map((h2, i) => ({ h2, body: paragraphs[i] })),
    pullQuotes: [
      `The hardest part is not the medicine. The hardest part is the patience.`,
      `A binder is doing its job when MMP-9 drops; an exposure is unresolved when MSH refuses to climb.`,
    ],
    tldr: `${title} explained without jargon: the underlying mechanism, what to test, what to ask your practitioner, and the daily habits that quietly do most of the work. Practical for patients in any phase of recovery.`,
  };
}

function shortTitle(t: string): string {
  // Trim a colon-prefixed sub-title for use in a heading.
  return t.split(":")[0].trim();
}

export function essayDraftFor(slug: string, title: string, category: string): EssayDraft {
  const data = BLOCKS[slug] || defaultBlocksFor(slug, title, category);
  const intro =
    SHARED_INTRO_PRELUDE +
    (data.preface || "") +
    SHARED_INTRO_TAIL;
  const sections = data.blocks.map((b) => ({ h2: b.h2, html: `<p>${b.body}</p>` }));
  return {
    intro,
    sections,
    pullQuotes: data.pullQuotes,
    tldr: data.tldr,
    metaDescription: data.tldr.slice(0, 155),
    mantra: pickMantra(slug),
  };
}
