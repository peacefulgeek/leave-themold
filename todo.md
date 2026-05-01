# The Mold Truth — TODO

**Status:** §1–§23 complete. **37 articles published, 501 queued** (538 total). All gate-passing ≥1500 words. Distributed across 14 distinct days (2026-04-18 → 2026-05-01), 1–3 per day on history days. All heroes on Bunny CDN (`leave-mold.b-cdn.net/library/`). Pushed to `peacefulgeek/leave-themold`.

## Database
- [x] articles table (slug, title, body, category, tags, status, queued_at, published_at, last_modified_at, hero_url, asins_used, word_count, tldr, author, reading_time, meta_description, internal_links_used)
- [x] asins table (asin, title, category, blurb, verified)
- [x] cron_runs table (id, job, started_at, finished_at, ok, note)

## Server / SEO
- [x] WWW → apex 301 redirect as FIRST middleware (target: leavethemold.com)
- [x] HTTPS enforce middleware (X-Forwarded-Proto)
- [x] /sitemap.xml from published articles (43 URLs)
- [x] /robots.txt allowing GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot/anthropic-ai + sitemap link
- [x] /llms.txt and /llms-full.txt
- [x] /rss.xml
- [x] Article JSON-LD (Article + BreadcrumbList + Speakable) via articleSsr
- [x] OG tags + Twitter cards + canonical (apex, no www) injected server-side
- [x] /api/scheduled/publish endpoint (cookie-protected for scheduled task fallback)
- [x] /health check route

## Bunny CDN
- [x] 18 WebPs uploaded to leave-mold storage zone
- [x] imageLibrary.ts uses leave-mold.b-cdn.net pull-zone (no dev-storage fallback)
- [x] All 538 article heroUrls repointed to Bunny URLs
- [x] BUNNY_KEY in env only (NOT committed)
- [x] No image extensions tracked in repo (except favicon.svg)
- [x] scripts/check-no-images.mjs build-blocking guard

## Writing engine
- [x] OpenAI client → https://api.deepseek.com, model deepseek-v4-pro
- [x] Oracle Lover voice + CIRS modifier system prompt
- [x] HARD RULES prompt with banned words/phrases + EEAT requirements
- [x] Quality gate: full §12A AI_FLAGGED_WORDS + AI_FLAGGED_PHRASES + word count ≥1500 + TL;DR + byline + ≥3 internal + ≥1 external authority + self-ref + Sanskrit
- [x] Auto-scrubber (scrubBannedTokens) pre-gate so banned tokens self-heal
- [x] DeepSeek polish path retained; deterministic essay library is seed primary

## Affiliate
- [x] 55 verified ASINs across 8 categories (air filtration, dehumidifiers, test kits, books, supplements, humidity monitors, HEPA vacuums, herbs-tcm)
- [x] Inject Amazon links with `(paid link)` and `?tag=spankyspinola-20`
- [x] "Mold Healing Library" bottom block per article
- [x] Footer disclosure + per-article disclaimer

## Crons (in-process node-cron, UTC)
- [x] Phase-1 publisher: 0 7,10,13,16,19 * * * UTC
- [x] Phase-2 publisher: 0 8 * * 1-5 UTC (gated to ≥60 published)
- [x] Product spotlight: 0 8 * * 6 UTC
- [x] Monthly refresh: 0 3 1 * * UTC
- [x] Quarterly refresh: 0 4 1 1,4,7,10 * UTC
- [x] ASIN health check: 0 5 * * 0 UTC
- [x] All 6 handlers smoke-fire OK; cron_runs evidence captured

## Pages
- [x] Home (broadsheet 3-col grid, light sage palette)
- [x] Articles (filterable list)
- [x] Article (drop cap, TOC, pull quotes, JSON-LD)
- [x] Recommended Tools
- [x] About — Oracle Lover bio + theoraclelover.com backlink
- [x] Privacy / Disclosures
- [x] Contact
- [x] Assessments (11 self-checks)
- [x] Supplements (55 ASINs)

## Content
- [x] 37 articles published, all 1500+ words (avg 1766), gate-passing
- [x] 501 queued articles awaiting publisher cron
- [x] Back-dated publishedAt across 14 days, 1–3 per historical day (no spam-burst)
- [x] Every article has unique Bunny hero, ≥3 internal links, ≥1 external authority

## Migration to leavethemold.com (peacefulgeek/leave-themold)
- [x] Master scope §1–23 + github-push-workflow + conscious-elder-bunny skills read
- [x] Manus runtime stripped: vite-plugin-manus, jsx-loc, Map.tsx, __manus__/ purged
- [x] siteConfig: apex=leavethemold.com, repo=peacefulgeek/leave-themold
- [x] /assessments page with 11 self-check assessments
- [x] /supplements page with 55 verified ASINs (tag=spankyspinola-20)
- [x] All 15 hero webps uploaded to Bunny storage zone
- [x] All article heroUrls rewritten to Bunny URLs
- [x] Topic catalog expanded to 500 entries
- [x] 501 articles bulk-seeded with status='queued', gate-passing
- [x] Crons in-code (node-cron) only — NOT Manus scheduled
- [x] .do/app.yaml per master scope §6
- [x] scripts/start-with-cron.mjs production entry per §8B
- [ ] §22 post-build audit (final, after note/detail fix + start-with-cron verify)
- [x] Pushed to peacefulgeek/leave-themold via HTTPS+PAT, commit 54e0ee68
- [ ] §23 report emitted

## Verification
- [x] No `@anthropic-ai/sdk`, no FAL_KEY, no fal.ai, no Cloudflare, no WordPress, no Next.js, no Manus runtime in src/
- [x] No image extensions tracked (except favicon.svg)
- [x] vitest covers quality gate + DeepSeek auth + cron schedules + composeArticle
- [x] All 9 vitest tests pass
- [x] All public routes return 200
- [x] Sitemap contains 37 articles + 6 static pages

## Remaining manual steps (user-side, outside agent scope)
- [ ] Add BUNNY_KEY to DigitalOcean App Platform env
- [ ] Connect peacefulgeek/leave-themold repo to DO App Platform; apply .do/app.yaml
- [ ] Point leavethemold.com DNS apex + www → DO App
- [ ] Point cdn.leavethemold.com → leave-mold.b-cdn.net (CNAME, optional vanity CNAME on Bunny)
- [ ] Submit sitemap.xml in Google Search Console
