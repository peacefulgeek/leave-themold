import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Link } from "wouter";

interface Question {
  id: string;
  q: string;
}

const QUESTIONS: Question[] = [
  { id: "q1", q: "I am unusually fatigued or wake unrefreshed even after a full night of sleep." },
  { id: "q2", q: "I have brain fog, word-finding trouble, or difficulty holding a thought." },
  { id: "q3", q: "I get headaches or sinus pressure that worsen in certain rooms or buildings." },
  { id: "q4", q: "My joints, muscles, or tendons hurt without a clear cause." },
  { id: "q5", q: "Bright light hurts my eyes; static or shimmer effects appear in my visual field." },
  { id: "q6", q: "I have unexplained tingling, electric-shock sensations, or skin sensitivity." },
  { id: "q7", q: "I feel breathless or my chest tightens in certain spaces." },
  { id: "q8", q: "I have GI changes — bloating, urgency, food sensitivities — that have grown over time." },
  { id: "q9", q: "I respond strongly to small amounts of fragrance, smoke, or environmental chemicals." },
  { id: "q10", q: "I have lived, worked, or attended school in a building with visible water damage or musty smell." },
  { id: "q11", q: "I have had infections, antibiotics, surgery, or a major stress event followed by a slow downhill slide." },
];

export default function Assessments() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const score = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);

  const interpretation = useMemo(() => {
    if (score >= 8) return "A high cluster of biotoxin-illness signals. The most common cause is a chronically water-damaged environment. Read about the VCS test and the Shoemaker protocol below, and consider working with a CIRS-trained clinician.";
    if (score >= 5) return "A moderate signal. The pattern of fatigue, brain fog, sensitivity, and inflammation is suggestive enough to warrant testing — VCS, ERMI, and a mycotoxin urine panel.";
    if (score >= 2) return "A low-to-moderate signal. Consider tracking symptoms by room or building over the next two weeks. Read the early-signs article below to refine your picture.";
    return "Few signals at this moment. If symptoms develop or worsen in particular spaces, return to this self-check.";
  }, [score]);

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <header className="mb-10 text-center">
          <p className="kicker mb-3">Self-Check</p>
          <h1 className="font-baskerville text-5xl mb-4">CIRS &amp; Mold-Illness Assessments</h1>
          <p className="text-lg text-muted-foreground">
            Eleven plain-language questions used to spot the inflammatory pattern of mold and biotoxin
            illness. This is an educational tool — not a diagnosis. Save your score, then bring it to a
            CIRS-trained clinician.
          </p>
        </header>

        <ol className="space-y-4 mb-10">
          {QUESTIONS.map((q, i) => (
            <li key={q.id} className="border-l-4 border-accent/40 pl-4 py-3 bg-card/50 rounded-r-md">
              <p className="mb-3">
                <span className="font-medium text-accent">{i + 1}.</span> {q.q}
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!answers[q.id]}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.checked }))}
                    className="w-4 h-4 accent-current"
                  />
                  <span>Yes — this fits me</span>
                </label>
              </div>
            </li>
          ))}
        </ol>

        <section className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-md mb-8">
          <p className="kicker mb-2">Score</p>
          <p className="font-baskerville text-4xl mb-3">{score} / 11</p>
          <p className="text-base">{interpretation}</p>
        </section>

        <section className="prose-quiet">
          <h2>Where to go next</h2>
          <p>
            If your score sits at five or above, three articles can help you map the next move:
          </p>
          <ul>
            <li>
              <Link href="/articles/vcs-test-explained">The VCS test, explained</Link> — a $15 visual contrast
              screening you can run from home.
            </li>
            <li>
              <Link href="/articles/shoemaker-protocol-overview">The Shoemaker protocol overview</Link> — the
              twelve-step CIRS recovery sequence.
            </li>
            <li>
              <Link href="/articles/mycotoxin-urine-test-guide">Mycotoxin urine testing, demystified</Link> —
              what the labs actually measure and what numbers mean.
            </li>
          </ul>
          <p className="text-sm italic text-muted-foreground mt-6">
            DISCLAIMER: this is an educational tool only. It does not diagnose any condition. CIRS is a
            contested diagnosis in mainstream medicine — partner with a clinician who has read the literature.
          </p>
        </section>
      </div>
    </Layout>
  );
}
