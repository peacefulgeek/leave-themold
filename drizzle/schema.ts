import { boolean, datetime, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 280 }).notNull(),
  body: text("body").notNull(),
  tldr: text("tldr"),
  category: varchar("category", { length: 80 }).notNull(),
  tags: json("tags").$type<string[]>().notNull().default([]),
  status: mysqlEnum("status", ["queued", "published"]).notNull().default("queued"),
  author: varchar("author", { length: 80 }).notNull().default("The Oracle Lover"),
  metaDescription: varchar("metaDescription", { length: 320 }),
  heroUrl: varchar("heroUrl", { length: 500 }),
  heroAlt: varchar("heroAlt", { length: 280 }),
  asinsUsed: json("asinsUsed").$type<string[]>().notNull().default([]),
  internalLinksUsed: json("internalLinksUsed").$type<string[]>().notNull().default([]),
  externalLinksUsed: json("externalLinksUsed").$type<string[]>().notNull().default([]),
  wordCount: int("wordCount").notNull().default(0),
  readingTime: int("readingTime").notNull().default(0),
  queuedAt: datetime("queuedAt"),
  publishedAt: datetime("publishedAt"),
  lastModifiedAt: datetime("lastModifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export const asins = mysqlTable("asins", {
  id: int("id").autoincrement().primaryKey(),
  asin: varchar("asin", { length: 16 }).notNull().unique(),
  name: varchar("name", { length: 280 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  tags: json("tags").$type<string[]>().notNull().default([]),
  verified: boolean("verified").notNull().default(true),
  lastCheckedAt: timestamp("lastCheckedAt"),
});

export type Asin = typeof asins.$inferSelect;
export type InsertAsin = typeof asins.$inferInsert;

export const cronRuns = mysqlTable("cron_runs", {
  id: int("id").autoincrement().primaryKey(),
  job: varchar("job", { length: 80 }).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
  ok: boolean("ok").notNull().default(false),
  message: text("message"),
});

export type CronRun = typeof cronRuns.$inferSelect;
export type InsertCronRun = typeof cronRuns.$inferInsert;
