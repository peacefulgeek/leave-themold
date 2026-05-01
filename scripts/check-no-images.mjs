// Master scope §9B.1 — build-blocking check that no image files are tracked
// in git, with the single exception of public/favicon.svg.
import { execSync } from 'child_process';

const ALLOWED = new Set(['client/public/favicon.svg']);
const IMAGE_EXT = /\.(png|jpe?g|gif|bmp|tiff?|webp|avif|heic|heif|ico|svg)$/i;

let tracked = '';
try {
  tracked = execSync('git ls-files', { encoding: 'utf8' });
} catch {
  console.log('[check-no-images] not a git repo yet — skipping');
  process.exit(0);
}

const files = tracked.split('\n').filter(Boolean).map((f) => f.trim());
const violations = files.filter((f) => IMAGE_EXT.test(f) && !ALLOWED.has(f));

if (violations.length > 0) {
  console.error('[check-no-images] FAIL — these image files are tracked in the repo:');
  for (const v of violations) console.error('  - ' + v);
  console.error('\nFix: run `pnpm migrate:images`, then commit the rewrites and the deletion.');
  process.exit(1);
}

console.log('[check-no-images] OK — no image files tracked in the repo');
