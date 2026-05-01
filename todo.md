# The Mold Truth — TODO (post-launch state)

**Status:** initial scope §1–§22 complete. **36 articles published** (30 seed + 6 cron-published smoke), all gate-passing, distributed across 14 distinct days, every article has a Bunny CDN hero + ≥3 internal links + Surviving Mold/ISEAI external authority + (paid link) affiliate library + Sanskrit closing mantra.

## Database
- [x] articles table (slug, title, body, category, tags, status, queued_at, published_at, last_modified_at, hero_url, asins_used, word_count, tldr, author, reading_time, meta_description, internal_links_used)
- [x] asins table (asin, title, category, blurb, verified)
- [x] cron_runs table (id, job, started_at, finished_at, ok, message)

## Server / SEO
- [x] WWW → apex 301 redirect as FIRST middleware
- [x] HTTPS enforce middleware (X-Forwarded-Proto)
- [x] /sitemap.xml from published articles
- [x] /robots.txt allowing GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot/anthropic-ai + sitemap link
- [x] /llms.txt and /llms-full.txt
- [x] /rss.xml
- [x] Article JSON-LD (Article + BreadcrumbList + Speakable) via articleSsr
- [x] OG tags + Twitter cards + canonical (apex, no www) injected server-side
- [x] /api/scheduled/publish endpoint (cookie-protected for scheduled task fallback)
- [x] /health check route

## Bunny CDN
- [x] Hero library mapped via imageLibrary.ts (12-image rotator deterministic by slug)
- [x] Per-article hero rotator
- [x] Author photo (Oracle Lover) referenced from server config
- [x] No image extensions tracked in repo (except favicon.svg)

## Writing engine
- [x] OpenAI client → https://api.deepseek.com, model deepseek-v4-pro
- [x] Oracle Lover voice + CIRS modifier system prompt
- [x] HARD RULES prompt with banned words/phrases + EEAT requirements
- [x] Quality gate: AI_FLAGGED_WORDS + AI_FLAGGED_PHRASES + word count ≥1500 + TL;DR + byline + ≥3 internal + ≥1 external (Surviving Mold or ISEAI) + self-ref + Sanskrit
- [x] Auto-scrubber pre-gate so banned tokens self-heal
- [x] DeepSeek polish path retained (used by cron); deterministic essay library is the seed/cron primary

## Affiliate
- [x] ASIN catalog (verified, niche-matched: air filtration, dehumidifiers, test kits, books, supplements, humidity monitors, HEPA vacuums)
- [x] Inject 3–4 soft-language Amazon links per article with `(paid link)` and `?tag=spankyspinola-20`
- [x] "Mold Healing Library" bottom block per article
- [x] Footer disclosure + per-article disclaimer

## Crons (in-process node-cron)
- [x] Phase-1 publisher: 0 7,10,13,16,19 * * * UTC
- [x] Phase-2 publisher: 0 8 * * 1-5 UTC
- [x] Product spotlight: 0 8 * * 6 UTC
- [x] Monthly refresh: 0 3 1 * * UTC
- [x] Quarterly refresh: 0 4 1 1,4,7,10 * UTC
- [x] ASIN health check: 0 5 * * 0 UTC
- [x] All 6 handlers smoke-fire OK and write cron_runs entries

## Pages
- [x] Home (broadsheet 3-col grid, light sage palette, no hero image)
- [x] Articles (filterable list)
- [x] Article (drop cap, TOC, pull quotes, JSON-LD)
- [x] Recommended Tools
- [x] About — Oracle Lover bio + theoraclelover.com backlink
- [x] Privacy / Disclosures
- [x] Contact

## Initial content
- [x] 30 phase-1 articles generated, 1640–2170 words each (avg 1768)
- [x] Back-dated publishedAt across 14 days, 1–3 per day (no one-day dump)
- [x] Every article has unique Bunny hero, ≥3 internal links, ≥1 external authority

## Verification
- [x] No `@anthropic-ai/sdk`, no FAL_KEY, no fal.ai, no Cloudflare, no WordPress, no Next.js, no Manus runtime references in src/
- [x] No image extensions tracked (except favicon.svg)
- [x] vitest covers quality gate + DeepSeek auth + cron schedules + composeArticle
- [x] All 9 vitest tests pass
- [x] All public routes return 200
- [x] Sitemap contains all 30+ articles + 6 static pages


## Migration to leavethemold.com (peacefulgeek/leave-themold)

- [ ] Re-read master scope §1–23 + github-push-workflow skill + conscious-elder-bunny skill
- [ ] Diff current build vs master scope §3 file structure / §4 package.json / §5 .gitignore / §6 .do/app.yaml
- [ ] Drop Manus runtime: vite-plugin-manus-runtime, @builder.io/vite-plugin-jsx-loc, manus-storage proxy, OAuth flow
- [ ] Replace Manus DB env (DATABASE_URL points to TiDB) with portable PG/MySQL connection string handling that works on DO App Platform
- [ ] Replace Manus CDN URLs with https://cdn.leavethemold.com/library/lib-NN.webp
- [ ] Update siteConfig: apex=leavethemold.com, repo=peacefulgeek/leave-themold
- [ ] Add /assessments page with 11 self-check assessments
- [ ] Add /supplements page with ~50 verified ASINs (TCM/herbs/supplements) using tag spankyspinola-20
- [ ] Upload all 15 hero webps to Bunny storage zone for leavethemold.com
- [ ] Rewrite all heroUrls in articles table to Bunny URLs
- [ ] Delete local /home/ubuntu/webdev-static-assets/mold-truth/* (no local storage after Bunny migration)
- [ ] Expand topic catalog to 500 entries
- [ ] Bulk-seed all 500 articles with status='queued', 1800+ words, gate-passing, voice-correct, Bunny heroes
- [ ] Verify only ~36 articles published, remaining ~464 stay queued
- [ ] Confirm crons are in-code (node-cron) only, NOT Manus scheduled
- [ ] Add .do/app.yaml per master scope §6
- [ ] Run §22 post-build audit; capture every check status
- [ ] Push to peacefulgeek/leave-themold via SSH, capture commit SHA
- [ ] Emit §23 report block
