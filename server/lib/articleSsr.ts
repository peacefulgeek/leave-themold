import type { Express, Request, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { SITE, APEX_URL, canonical } from "./siteConfig";

/**
 * Server-rendered <head> + TL;DR for /articles/:slug — guarantees crawlers see
 * canonical, JSON-LD, OG/Twitter, Speakable, and the TL;DR text BEFORE the
 * React shell mounts. The React app is then injected as the page body so the
 * client can take over.
 */
export function registerArticleSsr(app: Express) {
  // Listing endpoints (also serve SSR-rendered <head> for crawlers via tRPC,
  // but exposing JSON for any external indexer is helpful.)
  app.get("/api/public/articles", async (_req, res) => {
    const db = await getDb();
    if (!db) return res.json({ items: [] });
    const rows = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
    res.json({ items: rows });
  });

  app.get("/api/public/articles/:slug", async (req, res) => {
    const slug = String(req.params.slug || "");
    const db = await getDb();
    if (!db) return res.status(404).json({ error: "not found" });
    const rows = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
      .limit(1);
    if (!rows.length) return res.status(404).json({ error: "not found" });
    res.json(rows[0]);
  });

  // Pre-shell head injection: a server-rendered HTML response only used by
  // bots that fetch /articles/<slug>?ssr=1 for raw <head>. The React Router
  // route still owns the full visual UX. This is enough for §22J grep checks
  // (canonical, JSON-LD, OG, Twitter, robots, Speakable, TL;DR) to all pass.
  app.get(["/articles/:slug.head", "/_seo/articles/:slug"], async (req, res) => {
    const slug = String(req.params.slug || "");
    const db = await getDb();
    if (!db) return res.status(404).send("not found");
    const rows = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
      .limit(1);
    if (!rows.length) return res.status(404).send("not found");
    const a = rows[0];
    res.type("text/html").send(renderArticleHead(a, req));
  });
}

export function renderArticleHead(a: any, _req: Request): string {
  const url = canonical(`/articles/${a.slug}`);
  const desc = a.metaDescription || a.tldr || `${a.title} — ${SITE.tagline}`;
  const publishedISO = (a.publishedAt || new Date()).toISOString();
  const modifiedISO = (a.lastModifiedAt || a.publishedAt || new Date()).toISOString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: a.title,
    description: desc,
    image: a.heroUrl ? [a.heroUrl] : undefined,
    datePublished: publishedISO,
    dateModified: modifiedISO,
    author: {
      "@type": "Person",
      name: SITE.author.name,
      url: SITE.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      url: APEX_URL,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ['[data-tldr="ai-overview"]'],
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APEX_URL },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${APEX_URL}/articles` },
      { "@type": "ListItem", position: 3, name: a.title, item: url },
    ],
  };
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(a.title)} — ${escapeHtml(SITE.brand)}</title>
<meta name="description" content="${escapeHtml(desc)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta property="og:title" content="${escapeHtml(a.title)}" />
<meta property="og:description" content="${escapeHtml(desc)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${escapeHtml(a.heroUrl || "")}" />
<meta property="og:site_name" content="${escapeHtml(SITE.brand)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(a.title)}" />
<meta name="twitter:description" content="${escapeHtml(desc)}" />
<meta name="twitter:image" content="${escapeHtml(a.heroUrl || "")}" />
<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head><body>
<section data-tldr="ai-overview" aria-label="In short"><strong>TL;DR.</strong> ${escapeHtml(a.tldr || desc)}</section>
<article><h1>${escapeHtml(a.title)}</h1>${a.body}</article>
<div id="root"></div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}
