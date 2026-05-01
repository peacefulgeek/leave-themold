// Master scope §8B — production runner. Spawns the built server and registers
// every cron schedule in-process. No setTimeout. No Manus. No external dispatcher.
//
// Cron reference (UTC):
//   1A. Phase-1 publisher  0 7,10,13,16,19 * * *
//   1B. Phase-2 publisher  0 8 * * 1-5
//   2.  Product spotlight  0 8 * * 6
//   3.  Monthly refresh    0 3 1 * *
//   4.  Quarterly refresh  0 4 1 1,4,7,10 *
//   5.  ASIN health check  0 5 * * 0

import cron from 'node-cron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const server = spawn('node', ['dist/index.js'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env },
});

server.on('exit', (code) => {
  console.log(`[start-with-cron] Server exited with code ${code}`);
  process.exit(code ?? 0);
});

const AUTO_GEN = process.env.AUTO_GEN_ENABLED === 'true';

if (!AUTO_GEN) {
  console.log('[start-with-cron] AUTO_GEN_ENABLED not "true" — cron disabled');
} else {
  try {
    const [pub, spot, rm, rq, ahc] = await Promise.all([
      import('../dist/cron/publisher.js'),
      import('../dist/cron/productSpotlight.js'),
      import('../dist/cron/refreshMonthly.js'),
      import('../dist/cron/refreshQuarterly.js'),
      import('../dist/cron/asinHealthCheck.js'),
    ]);

    cron.schedule('0 7,10,13,16,19 * * *', async () => {
      console.log(`[cron] publisher (phase-1) ${new Date().toISOString()}`);
      try { await pub.runPublisher('phase1'); } catch (e) { console.error('[cron] phase-1 failed:', e); }
    }, { timezone: 'UTC' });

    cron.schedule('0 8 * * 1-5', async () => {
      console.log(`[cron] publisher (phase-2) ${new Date().toISOString()}`);
      try { await pub.runPublisher('phase2'); } catch (e) { console.error('[cron] phase-2 failed:', e); }
    }, { timezone: 'UTC' });

    cron.schedule('0 8 * * 6', async () => {
      console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
      try { await spot.runProductSpotlight(); } catch (e) { console.error('[cron] spotlight failed:', e); }
    }, { timezone: 'UTC' });

    cron.schedule('0 3 1 * *', async () => {
      console.log(`[cron] refresh-monthly ${new Date().toISOString()}`);
      try { await rm.runMonthlyRefresh(); } catch (e) { console.error('[cron] monthly failed:', e); }
    }, { timezone: 'UTC' });

    cron.schedule('0 4 1 1,4,7,10 *', async () => {
      console.log(`[cron] refresh-quarterly ${new Date().toISOString()}`);
      try { await rq.runQuarterlyRefresh(); } catch (e) { console.error('[cron] quarterly failed:', e); }
    }, { timezone: 'UTC' });

    cron.schedule('0 5 * * 0', async () => {
      console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
      try { await ahc.runAsinHealthCheck(); } catch (e) { console.error('[cron] asin-hc failed:', e); }
    }, { timezone: 'UTC' });

    console.log('[start-with-cron] All cron schedules registered (UTC, AUTO_GEN_ENABLED=true)');
  } catch (err) {
    console.error('[start-with-cron] Cron registration failed:', err);
    // Server keeps running even if cron fails — never crash the web service.
  }
}

const shutdown = (sig) => {
  console.log(`[start-with-cron] ${sig} received, shutting down`);
  server.kill(sig);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
