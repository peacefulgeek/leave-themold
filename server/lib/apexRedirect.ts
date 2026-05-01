import type { Request, Response, NextFunction } from "express";
import { SITE } from "./siteConfig";

/**
 * MUST be the FIRST middleware mounted on the Express app.
 *
 * - Rewrites any www.<apex> host to <apex> via 301.
 * - Forces HTTPS when X-Forwarded-Proto is http (DigitalOcean App Platform sits
 *   behind a TLS-terminating proxy, so the canonical signal is the header).
 * - Strips a trailing slash on non-root paths to keep canonicals stable.
 *
 * Local dev hosts (localhost, 127.0.0.1, *.manus.computer) are exempt so the
 * Vite preview keeps working.
 */
export function apexRedirect(req: Request, res: Response, next: NextFunction) {
  const host = (req.headers.host || "").toLowerCase();
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) || req.protocol;

  // Skip for local dev / preview environments
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".manus.computer") ||
    host.endsWith(".manus.space");

  if (isLocal) return next();

  const apex = SITE.apex.toLowerCase();
  let needsRedirect = false;
  let targetHost = host;

  if (host === `www.${apex}`) {
    targetHost = apex;
    needsRedirect = true;
  }
  if (proto !== "https") {
    needsRedirect = true;
  }

  // Trailing slash strip on non-root URLs
  let pathname = req.originalUrl;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/g, "") || "/";
    needsRedirect = true;
  }

  if (needsRedirect) {
    res.set("Cache-Control", "public, max-age=600");
    res.redirect(301, `https://${targetHost}${pathname}`);
    return;
  }
  next();
}
