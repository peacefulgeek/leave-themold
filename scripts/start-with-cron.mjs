// Master scope §8B — production runner.
//
// Note: server/_core/index.ts already calls startCron() from server/cron/index.ts
// at boot, which registers all 6 in-process node-cron schedules (UTC):
//   - Phase-1 publisher  0 7,10,13,16,19 * * *
//   - Phase-2 publisher  0 8 * * 1-5
//   - Product spotlight  0 8 * * 6
//   - Monthly refresh    0 3 1 * *
//   - Quarterly refresh  0 4 1 1,4,7,10 *
//   - ASIN health check  0 5 * * 0
//
// So booting dist/index.js is sufficient — Express + cron come up together,
// in one process, on one port, in one container. No external dispatcher.
// No Manus runtime. No setTimeout. No webhooks.

import('../dist/index.js').catch((err) => {
  console.error('[start-with-cron] Failed to start server:', err);
  process.exit(1);
});

const shutdown = (sig) => {
  console.log(`[start-with-cron] ${sig} received, shutting down`);
  process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
