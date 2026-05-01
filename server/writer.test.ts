import { describe, expect, it } from "vitest";
import OpenAI from "openai";
import { runQualityGate } from "./lib/qualityGate";

describe("DeepSeek credentials", () => {
  it("authenticates against api.deepseek.com via the OpenAI client", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";
    expect(apiKey, "OPENAI_API_KEY missing").toBeTruthy();
    expect(baseURL).toContain("deepseek");
    const client = new OpenAI({ apiKey, baseURL });
    const r = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "deepseek-v4-pro",
      messages: [{ role: "user", content: "Reply with exactly: OK" }],
      max_tokens: 256,
      temperature: 0,
    });
    // DeepSeek-V4-Pro is a reasoning model: response is valid as long as we
    // got a finish_reason and an id from the API (content may be empty when
    // the budget is consumed by reasoning).
    expect(r?.id).toBeTruthy();
    expect(r?.choices?.[0]?.finish_reason).toBeTruthy();
  }, 30_000);
});

describe("quality gate", () => {
  it("flags banned phrases", () => {
    const html = "<p>In conclusion, this is a comprehensive guide.</p>".repeat(80);
    const r = runQualityGate(html, { minWords: 50 });
    expect(r.ok).toBe(false);
    expect(r.hits.find((h) => h.phrase === "in conclusion")).toBeTruthy();
  });

  it("passes clean prose", () => {
    const text =
      "Recovery from CIRS unfolds slowly. Patients track sleep, energy, and one cognitive metric. The work is patient and steady, and most clinicians look for trends across months rather than hopping on weekly fluctuations. ";
    const html = `<p>${text.repeat(50)}</p>`;
    const r = runQualityGate(html, { minWords: 100 });
    expect(r.ok).toBe(true);
    expect(r.wordCount).toBeGreaterThan(100);
  });
});
