import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  supplements: "Supplements",
  "herbs-tcm": "Herbs & TCM",
  "test-kits": "Test Kits",
  "air-filtration": "Air Filtration",
  dehumidifier: "Dehumidifiers",
  "humidity-monitors": "Humidity Monitors",
  "hepa-vacuums": "HEPA Vacuums",
  books: "Books",
};

export default function Supplements() {
  const { data, isLoading } = trpc.site.products.useQuery();
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((p) => p.category === filter);
  }, [data, filter]);

  return (
    <Layout>
      <div className="container py-10">
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <p className="kicker mb-3">Mold Healing Library</p>
          <h1 className="font-baskerville text-5xl mb-4">Supplements, Herbs &amp; TCM</h1>
          <p className="text-lg text-muted-foreground">
            A curated, plain-language directory of the supplements, herbs, and traditional botanicals that
            come up most often in mold-illness recovery — alongside the air filtration, dehumidifiers,
            test kits, and books that round out a real protocol.
          </p>
          <p className="text-xs italic text-muted-foreground mt-4">
            Every link is an Amazon affiliate link — &quot;(paid link)&quot; — that helps fund the site at no cost
            to you. We may earn a commission on qualifying purchases.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filter === k
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-accent/30 hover:bg-accent/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-center text-muted-foreground">Loading…</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((p) => (
            <a
              key={p.asin}
              href={`https://www.amazon.com/dp/${p.asin}?tag=spankyspinola-20`}
              rel="sponsored noopener nofollow"
              target="_blank"
              className="group block border border-accent/15 rounded-md p-5 bg-card hover:bg-accent/5 transition-colors"
            >
              <p className="kicker text-xs mb-2">
                {CATEGORY_LABELS[p.category] ?? p.category}
              </p>
              <h3 className="font-baskerville text-xl mb-2 group-hover:text-accent transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{p.blurb}</p>
              <p className="text-xs text-accent">View on Amazon → (paid link)</p>
            </a>
          ))}
        </div>

        <p className="text-xs italic text-center text-muted-foreground mt-12 max-w-2xl mx-auto">
          DISCLAIMER: leavethemold.com is for educational purposes only. Nothing here is medical advice.
          Work with a CIRS-trained clinician for diagnosis and treatment.
        </p>
      </div>
    </Layout>
  );
}
