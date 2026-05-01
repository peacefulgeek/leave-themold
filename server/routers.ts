import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { listPublished, listByCategory, findBySlug, totalCount } from "./lib/articleDb";
import { PRODUCTS, affiliateUrl } from "./lib/products";
import { SITE } from "./lib/siteConfig";
import { AUTHOR_PHOTO, LOGO_MARK, IMAGE_LIBRARY } from "./lib/imageLibrary";
import { recentRuns } from "./cron/runLog";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  site: router({
    config: publicProcedure.query(() => ({
      brand: SITE.brand,
      tagline: SITE.tagline,
      author: SITE.author,
      health: SITE.health,
      authorPhoto: AUTHOR_PHOTO,
      logo: LOGO_MARK,
      libraryImages: IMAGE_LIBRARY,
    })),
    stats: publicProcedure.query(async () => ({
      published: await totalCount(),
    })),
  }),

  articles: router({
    list: publicProcedure.query(async () => {
      const rows = await listPublished(200);
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        tags: r.tags,
        tldr: r.tldr,
        heroUrl: r.heroUrl,
        publishedAt: r.publishedAt,
        wordCount: r.wordCount,
        readingTime: r.readingTime,
      }));
    }),
    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => listByCategory(input.category, 100)),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => findBySlug(input.slug)),
  }),

  products: router({
    list: publicProcedure.query(() =>
      PRODUCTS.map((p) => ({ ...p, url: affiliateUrl(p.asin) })),
    ),
  }),

  ops: router({
    cronRecent: publicProcedure
      .input(z.object({ job: z.string().optional(), limit: z.number().int().min(1).max(100).default(25) }).optional())
      .query(({ input }) => recentRuns(input?.job, input?.limit ?? 25)),
  }),
});

export type AppRouter = typeof appRouter;
