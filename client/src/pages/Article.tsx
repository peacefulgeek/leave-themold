import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";

function fmtDateLong(d: string | Date | null | undefined) {
  if (!d) return "";
  const dd = new Date(d);
  return dd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function extractToc(html: string): { id: string; text: string }[] {
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const out: { id: string; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
    out.push({ id, text });
  }
  return out;
}

function injectIds(html: string): string {
  let i = 0;
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_full, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || `s-${i++}`;
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
}

export default function Article() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data, isLoading } = trpc.articles.bySlug.useQuery({ slug });
  const { data: all } = trpc.articles.list.useQuery();

  const bodyWithIds = useMemo(() => (data?.body ? injectIds(data.body) : ""), [data?.body]);
  const toc = useMemo(() => extractToc(bodyWithIds), [bodyWithIds]);

  // Set canonical + meta
  useEffect(() => {
    if (!data) return;
    document.title = `${data.title} — The Mold Truth`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://themoldtruth.com/articles/${data.slug}`;
    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = (data.metaDescription || data.tldr || "").slice(0, 320);
  }, [data]);

  const related = (all || []).filter((a: any) => a.slug !== slug).slice(0, 4);

  return (
    <Layout>
      <article className="container py-8">
        {isLoading && (
          <div className="space-y-4">
            <div className="shimmer h-10 w-3/4 rounded" />
            <div className="shimmer h-72 w-full rounded" />
            <div className="shimmer h-4 w-1/2 rounded" />
          </div>
        )}

        {!isLoading && !data && (
          <div className="py-20 text-center">
            <h1>Not found</h1>
            <p className="mt-3"><Link href="/">Return home</Link></p>
          </div>
        )}

        {data && (
          <div className="grid lg:grid-cols-[1fr_240px] gap-10">
            <div>
              <nav className="kicker mb-3">
                <Link href="/">Home</Link> &nbsp;·&nbsp; <Link href="/articles">Articles</Link> &nbsp;·&nbsp;{" "}
                <Link href={`/articles/category/${data.category}`}>{data.category}</Link>
              </nav>

              <h1 className="font-display mb-4">{data.title}</h1>

              <div className="font-ui text-sm text-[var(--sage-700)] mb-6 flex flex-wrap items-center gap-3">
                <span>By <strong>The Oracle Lover</strong></span>
                <span>·</span>
                <time dateTime={String(data.publishedAt)}>{fmtDateLong(data.publishedAt)}</time>
                <span>·</span>
                <span>{data.readingTime || 7} min read</span>
                <span>·</span>
                <span>{data.wordCount} words</span>
              </div>

              {data.heroUrl && (
                <figure className="mb-8">
                  <img
                    src={data.heroUrl}
                    alt={data.heroAlt || data.title}
                    className="w-full rounded-md shadow-md"
                    loading="eager"
                  />
                </figure>
              )}

              {data.tldr && (
                <aside className="mb-8 p-5 rounded-md bg-[var(--sage-100)] border border-[var(--rule)]">
                  <div className="kicker mb-1">TL;DR</div>
                  <p className="font-display text-lg leading-snug">{data.tldr}</p>
                </aside>
              )}

              <div className="prose-mt" dangerouslySetInnerHTML={{ __html: bodyWithIds }} />

              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="section-title">Keep Reading</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {related.map((a: any) => (
                      <Link key={a.slug} href={`/articles/${a.slug}`} className="block">
                        <article className="card-news">
                          <div className="thumb"><img src={a.heroUrl} alt={a.title} loading="lazy" /></div>
                          <div className="body">
                            <span className="cat">{a.category}</span>
                            <h3 className="text-lg font-display leading-tight mt-1">{a.title}</h3>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="toc">
                <h4>In this article</h4>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        )}
      </article>
    </Layout>
  );
}
