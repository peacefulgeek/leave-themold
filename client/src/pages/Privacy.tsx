import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="container py-10 max-w-3xl prose-mt">
        <span className="kicker">Privacy & Disclosures</span>
        <h1 className="font-display mt-2">Privacy, Affiliate Disclosure, and Editorial Standards</h1>

        <h2>Privacy policy</h2>
        <p>
          The Mold Truth collects only the analytics data necessary to understand how the library is being read. We do not sell email addresses. We do not run third-party advertising networks. We do not personally identify readers. The site is hosted on infrastructure that meets standard SSL and security expectations for an editorial publication.
        </p>

        <h2>Cookies</h2>
        <p>
          We set a small number of cookies for site functionality (session, theme) and analytics (page-view counting only). No advertising cookies. No retargeting pixels. No third-party tracking beyond a privacy-respecting analytics endpoint.
        </p>

        <h2>Affiliate disclosure</h2>
        <p>
          The Mold Truth participates in the Amazon Associates programme under the affiliate tag <code>spankyspinola-20</code>. Some links on this site are paid links. When you buy through them, The Mold Truth may earn a small commission at no extra cost to you. Every affiliate link on the site is labelled <strong>(paid link)</strong> at point of click. Recommendations are made on editorial merit only — we do not accept payment for placement.
        </p>

        <h2>Medical disclaimer</h2>
        <p>
          The Mold Truth is for educational purposes only and does not constitute medical advice. Chronic Inflammatory Response Syndrome (CIRS) and mold illness involve diagnoses that remain contested in mainstream medicine. Always work with a qualified, CIRS-literate practitioner. The information here is intended to help you ask better questions of your own doctor.
        </p>

        <h2>Editorial standard</h2>
        <p>
          Every article on The Mold Truth is signed by a real author, dated, and re-checked at least quarterly. Articles that no longer reflect best practice are revised, not removed. We never use the words "miracle cure" or "guaranteed cure." We never claim a product is "FDA approved" unless it factually is. We follow a banned-words quality gate that catches AI-generated slop and corporate filler before publication.
        </p>

        <h2>Contact</h2>
        <p>
          Corrections, takedowns, or editorial suggestions: <a href="/contact">use the contact page</a>.
        </p>
      </section>
    </Layout>
  );
}
