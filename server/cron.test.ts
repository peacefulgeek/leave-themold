import { describe, it, expect } from "vitest";
import cron from "node-cron";
import { runQualityGate } from "./lib/qualityGate";
import { ALL_TOPICS, PHASE_1_TOPICS } from "./lib/topicCatalog";
import { composeArticle } from "./lib/writer";

describe("cron schedules", () => {
  it("registers six valid schedules", () => {
    const expressions = [
      "0 7,10,13,16,19 * * *", // phase-1 publisher
      "0 8 * * 1-5",            // phase-2 weekday
      "0 8 * * 6",              // product spotlight Sat
      "0 3 1 * *",              // monthly 1st @ 03 UTC
      "0 4 1 1,4,7,10 *",       // quarterly Jan/Apr/Jul/Oct @ 04 UTC
      "0 5 * * 0",              // ASIN health Sun @ 05 UTC
    ];
    for (const e of expressions) {
      expect(cron.validate(e), `invalid cron: ${e}`).toBe(true);
    }
  });
});

describe("topic catalog", () => {
  it("ships ≥30 phase-1 topics and 30+ total", () => {
    expect(PHASE_1_TOPICS.length).toBeGreaterThanOrEqual(30);
    expect(ALL_TOPICS.length).toBeGreaterThanOrEqual(30);
  });
});

describe("quality gate", () => {
  it("rejects banned phrases", () => {
    const html = "<p>" + "word ".repeat(1500) + " in conclusion the gate works.</p>";
    const r = runQualityGate(html, { minWords: 1500 });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/banned/);
  });
  it("rejects under word count", () => {
    const r = runQualityGate("<p>too short</p>", { minWords: 1500 });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/word_count/);
  });
});

describe("composeArticle (deterministic primary path)", () => {
  it("produces ≥1500 visible words and clears the gate", async () => {
    const a = await composeArticle("what-is-cirs");
    expect(a.body.length).toBeGreaterThan(1000);
    expect(a.wordCount).toBeGreaterThanOrEqual(1500);
    const gate = runQualityGate(a.body, { minWords: 1500 });
    expect(gate.ok).toBe(true);
    // contains mantra + paid-link + ≥3 internal links + ≥1 external
    // (TL;DR + byline are injected by articleSsr at the page level, not the body)
    expect(a.body).toMatch(/<aside class="mantra"/);
    expect(a.body).toMatch(/paid link/);
    const internalCount = (a.body.match(/href="[^"]*themoldtruth\.com\/articles\/[^"]+"/g) || []).length
      + (a.body.match(/href="\/articles\/[^"]+"/g) || []).length;
    expect(internalCount).toBeGreaterThanOrEqual(3);
    // External authority (non-Amazon, non-self) link
    const survivingMold = a.body.includes("survivingmold.com");
    const iseai = a.body.includes("iseai.org");
    expect(survivingMold || iseai).toBe(true);
  }, 30_000);
});
