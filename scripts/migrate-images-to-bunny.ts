// Master scope §9B.2 — one-shot migration: every tracked image gets WebP-compressed
// and uploaded to Bunny under /library/migrated/{stem}.webp; mapping is written
// to scripts/.image-mapping.json so rewrite-image-references can update sources.
//
// Run order:
//   1. pnpm migrate:images
//   2. node scripts/rewrite-image-references.mjs  (updates code refs)
//   3. xargs -a /tmp/images-to-migrate.txt rm -f  (delete tracked files)
//   4. git add -A && git commit && git filter-repo …  (scrub history)

import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { SITE } from "../server/lib/siteConfig";

const IMAGE_EXT = /\.(png|jpe?g|gif|bmp|tiff?|webp|avif|heic|heif)$/i;

async function uploadWebP(targetPath: string, buffer: Buffer): Promise<string> {
  const host = SITE.bunny.storageHost.replace(/^https?:\/\//, "");
  const url = `https://${host}/${SITE.bunny.storageZone}/${targetPath.replace(/^\//, "")}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: SITE.bunny.apiKey,
      "Content-Type": "image/webp",
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`bunny upload ${res.status} for ${targetPath}`);
  return `${SITE.bunny.pullZone}/${targetPath.replace(/^\//, "")}`;
}

async function uploadSvg(targetPath: string, buffer: Buffer): Promise<string> {
  const host = SITE.bunny.storageHost.replace(/^https?:\/\//, "");
  const url = `https://${host}/${SITE.bunny.storageZone}/${targetPath.replace(/^\//, "")}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: SITE.bunny.apiKey,
      "Content-Type": "image/svg+xml",
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`bunny svg upload ${res.status}`);
  return `${SITE.bunny.pullZone}/${targetPath.replace(/^\//, "")}`;
}

async function main() {
  if (!SITE.bunny.apiKey || SITE.bunny.apiKey.startsWith("REPLACE")) {
    console.error("[migrate-images] Bunny apiKey is not set in server/lib/siteConfig.ts");
    console.error("Edit SITE.bunny.{storageZone,apiKey,pullZone} and re-run.");
    process.exit(1);
  }

  const tracked = execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

  const targets = tracked.filter(
    (f) => IMAGE_EXT.test(f) && f !== "client/public/favicon.svg",
  );

  if (targets.length === 0) {
    console.log("[migrate-images] no tracked images to migrate (good)");
    return;
  }

  // sharp is loaded only when there is work to do (it is a runtime dep per §4)
  const sharp = (await import("sharp")).default;
  const mapping: Record<string, string> = {};

  for (const file of targets) {
    const stem = path.basename(file).replace(IMAGE_EXT, "");
    if (/\.svg$/i.test(file)) {
      const raw = await fs.readFile(file);
      const url = await uploadSvg(`library/migrated/${stem}.svg`, raw);
      mapping[file] = url;
      console.log(`[migrate] ${file} → ${url} (svg)`);
      continue;
    }
    const raw = await fs.readFile(file);
    const buf = await sharp(raw).webp({ quality: 82 }).toBuffer();
    const url = await uploadWebP(`library/migrated/${stem}.webp`, buf);
    mapping[file] = url;
    console.log(`[migrate] ${file} → ${url} (${(buf.length / 1024).toFixed(0)}KB)`);
  }

  await fs.writeFile("scripts/.image-mapping.json", JSON.stringify(mapping, null, 2));
  console.log(`[migrate] wrote mapping for ${Object.keys(mapping).length} files`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
