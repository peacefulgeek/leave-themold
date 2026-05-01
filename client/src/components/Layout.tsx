import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

// Primary horizontal nav for desktop (kept lean: 6 destinations)
const PRIMARY_NAV = [
  { href: "/articles", label: "Articles" },
  { href: "/assessments", label: "Assessments" },
  { href: "/supplements", label: "Supplements" },
  { href: "/recommended", label: "Recommended" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Full nav (categories + everything) — used in the mobile hamburger drawer only
const FULL_NAV = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/articles/category/diagnosis", label: "Diagnosis" },
  { href: "/articles/category/treatment", label: "Treatment" },
  { href: "/articles/category/environment", label: "Environment" },
  { href: "/articles/category/biomarkers", label: "Biomarkers" },
  { href: "/assessments", label: "Assessments" },
  { href: "/supplements", label: "Supplements & Herbs" },
  { href: "/recommended", label: "Recommended Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy & Disclosures" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loc, setLoc] = useLocation();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc === href || loc.startsWith(href + "/");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="masthead">
        {/* Top row: hamburger (mobile only) + masthead title */}
        <div className="container py-3 flex items-center justify-between gap-3">
          <div className="md:hidden">
            <button
              type="button"
              className="ham-btn"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
          <Link href="/" className="block flex-1 text-center">
            <div className="kicker">Honest CIRS &amp; Mold Illness</div>
            <h1 className="masthead-title text-3xl md:text-5xl mt-1 leading-none">
              The Mold Truth
            </h1>
            <div className="masthead-rule mt-3 mx-auto max-w-md" />
          </Link>
          {/* spacer to balance hamburger on mobile; hidden on desktop where nav lives below */}
          <div className="w-[44px] md:hidden" />
        </div>

        {/* Horizontal browser nav — desktop only */}
        <nav
          className="hidden md:block border-t border-b border-[var(--rule)] bg-[var(--paper)]"
          aria-label="Primary"
        >
          <ul className="container flex items-center justify-center gap-8 py-3 font-display text-[15px] tracking-wide uppercase">
            {PRIMARY_NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={
                    "px-1 py-1 transition-colors border-b-2 " +
                    (isActive(n.href)
                      ? "text-[var(--sage-900)] border-[var(--sage-500)]"
                      : "text-[var(--sage-700)] border-transparent hover:text-[var(--sage-900)] hover:border-[var(--sage-500)]")
                  }
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 scrim md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] drawer overflow-y-auto p-6 md:hidden"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="kicker">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="ham-btn"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-2 font-display">
              {FULL_NAV.map((n) => (
                <li key={n.href}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setLoc(n.href);
                    }}
                    className="text-lg text-[var(--sage-900)] hover:text-[var(--sage-500)] block w-full text-left py-1"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-6 border-t border-[var(--rule)] font-ui text-xs text-[var(--sage-700)]">
              <p>
                The Mold Truth is an editorial reading-room, not a clinic. We are
                not your doctor.
              </p>
              <p className="mt-2">
                Written by The Oracle Lover ·{" "}
                <a
                  href="https://theoraclelover.com"
                  target="_blank"
                  rel="noopener"
                >
                  theoraclelover.com
                </a>
              </p>
            </div>
          </nav>
        </>
      )}

      <main className="flex-1">{children}</main>

      <footer className="border-t-2 border-[var(--rule)] mt-12 bg-[var(--paper)]">
        <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm font-ui">
          <div>
            <h3 className="font-display text-xl">The Mold Truth</h3>
            <p className="mt-2 text-[var(--sage-700)]">
              An honest, image-rich, plain-English library on CIRS and mold
              illness — written by{" "}
              <a
                href="https://theoraclelover.com"
                target="_blank"
                rel="noopener"
              >
                The Oracle Lover
              </a>
              .
            </p>
          </div>
          <div>
            <h4 className="kicker mb-2">Read</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/articles">All Articles</Link>
              </li>
              <li>
                <Link href="/articles/category/diagnosis">Diagnosis</Link>
              </li>
              <li>
                <Link href="/articles/category/treatment">Treatment</Link>
              </li>
              <li>
                <Link href="/articles/category/biomarkers">Biomarkers</Link>
              </li>
              <li>
                <Link href="/articles/category/environment">Environment</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="kicker mb-2">About</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about">About the Author</Link>
              </li>
              <li>
                <Link href="/assessments">CIRS Assessments</Link>
              </li>
              <li>
                <Link href="/supplements">Supplements &amp; Herbs</Link>
              </li>
              <li>
                <Link href="/recommended">Recommended Tools</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy &amp; Disclosures</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href="/rss.xml">RSS Feed</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container pb-8 text-xs text-[var(--sage-700)] font-ui">
          <p>
            <strong>Affiliate disclosure:</strong> Some links on this site are
            affiliate links (paid link). When you buy through them, The Mold
            Truth may earn a small commission at no extra cost to you. We only
            recommend tools we would recommend to a sister.
          </p>
          <p className="mt-2">
            <strong>Medical disclaimer:</strong> The Mold Truth is for
            educational purposes only and does not constitute medical advice.
            CIRS and mold illness involve contested diagnoses in mainstream
            medicine. Work with a qualified, CIRS-literate practitioner.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} The Mold Truth · As an Amazon Associate
            we earn from qualifying purchases.
          </p>
        </div>
      </footer>
    </div>
  );
}
