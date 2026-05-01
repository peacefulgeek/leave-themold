import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";

export default function Recommended() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const grouped = (products ?? []).reduce<Record<string, any[]>>((acc, p: any) => {
    (acc[p.category] ||= []).push(p); return acc;
  }, {});
  const categories = Object.keys(grouped).sort();

  return (
    <Layout>
      <section className="container py-10">
        <span className="kicker">Tools</span>
        <h1 className="font-display mt-2">Recommended Tools for Mold Recovery</h1>
        <p className="text-[var(--sage-700)] mt-3 max-w-3xl font-body">
          Every product below is one we would put in our own bedroom or kitchen. All links are Amazon affiliate links — clicking through and buying supports the site at no extra cost to you. <strong>(paid link)</strong>.
        </p>

        {isLoading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[0,1,2,3,4,5].map(i => <div key={i} className="shimmer h-44 rounded-md" />)}
          </div>
        )}

        {!isLoading && categories.map((cat) => (
          <section key={cat} className="mt-10">
            <h2 className="section-title">{cat[0].toUpperCase() + cat.slice(1)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped[cat].map((p) => (
                <a key={p.asin} href={p.url} target="_blank" rel="noopener nofollow sponsored" className="card-news block p-5">
                  <div className="cat">{p.category}</div>
                  <h3 className="text-lg font-display mt-1 leading-tight">{p.title}</h3>
                  <p className="text-sm text-[var(--sage-700)] mt-2">{p.blurb}</p>
                  <div className="mt-3 text-xs text-[var(--sage-700)] font-ui">View on Amazon · (paid link)</div>
                </a>
              ))}
            </div>
          </section>
        ))}

        <p className="mt-10 text-xs text-[var(--sage-700)] font-ui border-t border-[var(--rule)] pt-5">
          As an Amazon Associate The Mold Truth earns from qualifying purchases. Affiliate tag: <code>spankyspinola-20</code>.
        </p>
      </section>
    </Layout>
  );
}
