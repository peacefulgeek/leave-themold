import { Link, useParams } from "wouter";
import { useMemo as useMemoReact, useState as useStateReact } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";

function fmtDate(d: any) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Articles() {
  const params = useParams<{ category?: string }>();
  const category = params.category;
  const { data, isLoading } = trpc.articles.list.useQuery();
  const [q, setQ] = useStateReact("");

  const list = useMemoReact(() => {
    let l = data ?? [];
    if (category) l = l.filter((a: any) => a.category === category);
    if (q.trim()) {
      const needle = q.toLowerCase();
      l = l.filter((a: any) => a.title.toLowerCase().includes(needle) || (a.tldr || "").toLowerCase().includes(needle));
    }
    return l;
  }, [data, category, q]);

  return (
    <Layout>
      <section className="container py-8">
        <div className="mb-6">
          <span className="kicker">Library</span>
          <h1 className="font-display mt-1">{category ? category[0].toUpperCase() + category.slice(1) : "All Articles"}</h1>
          <p className="text-[var(--sage-700)] mt-2 max-w-3xl">
            The full reading-room. Search by keyword, filter by category, or scroll. Every article is editable, dated, and re-checked on a quarterly cadence.
          </p>
        </div>

        <div className="mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles…"
            className="w-full md:w-96 px-4 py-2 border border-[var(--rule)] rounded-md bg-white font-ui"
          />
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-3 gap-5">
            {[0,1,2,3,4,5].map((i) => <div key={i} className="shimmer h-64 rounded-md" />)}
          </div>
        )}

        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((a: any) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="block">
                <article className="card-news h-full">
                  <div className="thumb"><img src={a.heroUrl} alt={a.title} loading="lazy" /></div>
                  <div className="body">
                    <span className="cat">{a.category}</span>
                    <h3 className="text-lg font-display leading-tight mt-1">{a.title}</h3>
                    <p className="text-sm text-[var(--sage-700)] mt-2 line-clamp-3">{a.tldr}</p>
                    <div className="meta">{fmtDate(a.publishedAt)} · {a.readingTime || 7} min read</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && list.length === 0 && (
          <div className="py-20 text-center text-[var(--sage-700)]">
            No articles match. Try clearing the search.
          </div>
        )}
      </section>
    </Layout>
  );
}
