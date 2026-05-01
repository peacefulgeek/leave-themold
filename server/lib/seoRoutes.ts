import type { Express } from "express";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { SITE, APEX_URL, canonical } from "./siteConfig";

const TXT = "text/plain; charset=utf-8";
const XML = "application/xml; charset=utf-8";

async function listPublishedSlugs() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      slug: articles.slug,
      title: articles.title,
      tldr: articles.tldr,
      category: articles.category,
      lastModifiedAt: articles.lastModifiedAt,
      publishedAt: articles.publishedAt,
      heroUrl: articles.heroUrl,
      metaDescription: articles.metaDescription,
      body: articles.body,
    })
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt));
  return rows;
}

export function registerSeoRoutes(app: Express) {
  // ────────────── /robots.txt ──────────────
  app.get("/robots.txt", (_req, res) => {
    const body = [
      "User-agent: *",
      "Allow: /",
      "",
      "User-agent: GPTBot",
      "Allow: /",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "",
      "User-agent: Google-Extended",
      "Allow: /",
      "",
      "User-agent: CCBot",
      "Allow: /",
      "",
      "User-agent: anthropic-ai",
      "Allow: /",
      "",
      `Sitemap: ${APEX_URL}/sitemap.xml`,
      "",
    ].join("\n");
    res.type(TXT).send(body);
  });

  // ────────────── /sitemap.xml ──────────────
  app.get("/sitemap.xml", async (_req, res) => {
    const rows = await listPublishedSlugs();
    const staticUrls = ["/", "/articles", "/recommended", "/about", "/privacy", "/contact"];
    const today = new Date().toISOString().slice(0, 10);
    const items: string[] = [];
    for (const u of staticUrls) {
      items.push(
        `<url><loc>${APEX_URL}${u}</loc><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.7"}</priority><lastmod>${today}</lastmod></url>`,
      );
    }
    for (const r of rows) {
      const lastmod = (r.lastModifiedAt || r.publishedAt || new Date())
        .toISOString()
        .slice(0, 10);
      items.push(
        `<url><loc>${canonical(`/articles/${r.slug}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
      );
    }
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</urlset>\n`;
    res.type(XML).send(xml);
  });

  // ────────────── /rss.xml ──────────────
  app.get("/rss.xml", async (_req, res) => {
    const rows = await listPublishedSlugs();
    const items = rows
      .slice(0, 50)
      .map((r) => {
        const link = canonical(`/articles/${r.slug}`);
        const pub = (r.publishedAt || new Date()).toUTCString();
        const desc = (r.tldr || r.metaDescription || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
        return `<item><title>${escapeXml(r.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${pub}</pubDate><description>${desc}</description></item>`;
      })
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${escapeXml(SITE.brand)}</title><link>${APEX_URL}</link><description>${escapeXml(SITE.tagline)}</description>\n${items}\n</channel></rss>\n`;
    res.type(XML).send(xml);
  });

  // ────────────── /llms.txt ──────────────
  app.get("/llms.txt", async (_req, res) => {
    const rows = await listPublishedSlugs();
    const lines = [
      `# ${SITE.brand}`,
      `> ${SITE.tagline}`,
      ``,
      `Site: ${APEX_URL}`,
      `Author: ${SITE.author.name} (${SITE.author.url})`,
      `Niche: ${SITE.niche}`,
      ``,
      `## Articles`,
      ...rows.map((r) => `- [${r.title}](${canonical(`/articles/${r.slug}`)}): ${(r.tldr || r.metaDescription || "").slice(0, 200)}`),
    ];
    res.type(TXT).send(lines.join("\n") + "\n");
  });

  // ────────────── /llms-full.txt ──────────────
  app.get("/llms-full.txt", async (_req, res) => {
    const rows = await listPublishedSlugs();
    const out: string[] = [
      `# ${SITE.brand}`,
      `> ${SITE.tagline}`,
      ``,
      `Site: ${APEX_URL}`,
      `Author: ${SITE.author.name}`,
      ``,
    ];
    for (const r of rows) {
      out.push(`---`);
      out.push(`# ${r.title}`);
      out.push(`URL: ${canonical(`/articles/${r.slug}`)}`);
      if (r.tldr) out.push(`TLDR: ${r.tldr}`);
      out.push("");
      out.push(stripHtml(r.body));
      out.push("");
    }
    res.type(TXT).send(out.join("\n"));
  });

  // ────────────── /health ──────────────
  app.get("/health", (_req, res) => {
    res.json({ ok: true, brand: SITE.brand, time: new Date().toISOString() });
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string),
  );
}
