import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Layout from "@/components/Layout";

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "";
  const dd = new Date(d);
  return dd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ArticleCard({ a, size = "md" }: { a: any; size?: "lg" | "md" | "sm" }) {
  const titleSize = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-base" : "text-xl md:text-2xl";
  return (
    <Link href={`/articles/${a.slug}`} className="block">
      <article className="card-news h-full">
        {size !== "sm" && (
          <div className="thumb">
            <img src={a.heroUrl} alt={a.title} loading="lazy" />
          </div>
        )}
        <div className="body">
          <span className="cat">{a.category}</span>
          <h3 className={`${titleSize} font-display leading-tight mt-1`}>{a.title}</h3>
          {size !== "sm" && (
            <p className="text-sm text-[var(--sage-700)] mt-2 line-clamp-3">{a.tldr}</p>
          )}
          <div className="meta">
            {fmtDate(a.publishedAt)} · {a.readingTime || 7} min read
          </div>
        </div>
      </article>
    </Link>
  );
}

function Sidebar({ articles }: { articles: any[] }) {
  const top = articles.slice(0, 4);
  return (
    <aside>
      <h2 className="section-title">Most Read</h2>
      <ol className="space-y-4 list-decimal list-inside font-display">
        {top.map((a) => (
          <li key={a.slug}>
            <Link href={`/articles/${a.slug}`} className="text-[var(--sage-900)] hover:text-[var(--sage-500)]">
              {a.title}
            </Link>
            <div className="meta text-xs ml-5 mt-1">{fmtDate(a.publishedAt)}</div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function Tertiary({ articles }: { articles: any[] }) {
  return (
    <aside>
      <h2 className="section-title">From the Library</h2>
      <ul className="space-y-3">
        {articles.slice(4, 10).map((a) => (
          <li key={a.slug} className="border-b border-[var(--rule)] pb-3">
            <Link href={`/articles/${a.slug}`} className="font-display text-[var(--sage-900)] hover:text-[var(--sage-500)] block">
              {a.title}
            </Link>
            <span className="cat text-[10px]">{a.category}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function Home() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery();
  const list = articles ?? [];

  return (
    <Layout>
      <section className="container py-8">
        <div className="mb-6">
          <span className="kicker">Today</span>
          <p className="font-display text-2xl md:text-3xl mt-1 leading-snug max-w-3xl">
            Honest, image-rich, plain-English orientation for the CIRS and mold-illness journey — the practical sequence, the working biomarkers, and the small tools that quietly do most of the work.
          </p>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-72 rounded-md" />
            ))}
          </div>
        )}

        {!isLoading && list.length > 0 && (
          <div className="broadsheet">
            <div>
              <ArticleCard a={list[0]} size="lg" />
              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                {list.slice(1, 5).map((a: any) => <ArticleCard key={a.slug} a={a} />)}
              </div>
            </div>
            <Sidebar articles={list} />
            <Tertiary articles={list} />
          </div>
        )}

        {!isLoading && list.length > 5 && (
          <section className="mt-12">
            <h2 className="section-title">More from The Mold Truth</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.slice(5, 17).map((a: any) => <ArticleCard key={a.slug} a={a} />)}
            </div>
            <div className="mt-6">
              <Link href="/articles" className="font-ui text-[var(--sage-700)] underline">
                Browse the full library →
              </Link>
            </div>
          </section>
        )}
      </section>
    </Layout>
  );
}
