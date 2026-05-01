import type { Express } from "express";
import { runPublisher } from "../cron/publisher";
import { runProductSpotlight } from "../cron/productSpotlight";
import { runMonthlyRefresh } from "../cron/refreshMonthly";
import { runQuarterlyRefresh } from "../cron/refreshQuarterly";
import { runAsinHealthCheck } from "../cron/asinHealthCheck";

/**
 * /api/scheduled/<job> — POST endpoints used by either:
 * - the in-process node-cron schedulers (server/cron/index.ts)
 * - the standalone scheduled-task agent created via the platform `schedule` tool
 *
 * Anyone hitting these gets a JSON response describing what ran. We do NOT
 * require auth here because the only side-effect is generating a single article
 * (or refreshing one); the cost ceiling is rate-limited by AUTO_GEN_ENABLED.
 */
export function registerScheduledTaskApi(app: Express) {
  app.post("/api/scheduled/publisher", async (_req, res) => {
    try {
      const out = await runPublisher();
      res.json({ success: true, ...out });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  app.post("/api/scheduled/spotlight", async (_req, res) => {
    try {
      const out = await runProductSpotlight();
      res.json({ success: true, ...out });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  app.post("/api/scheduled/refresh-monthly", async (_req, res) => {
    try {
      const out = await runMonthlyRefresh();
      res.json({ success: true, ...out });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  app.post("/api/scheduled/refresh-quarterly", async (_req, res) => {
    try {
      const out = await runQuarterlyRefresh();
      res.json({ success: true, ...out });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  app.post("/api/scheduled/asin-health", async (_req, res) => {
    try {
      const out = await runAsinHealthCheck();
      res.json({ success: true, ...out });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });
}
