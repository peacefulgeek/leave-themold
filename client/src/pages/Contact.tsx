import Layout from "@/components/Layout";

export default function Contact() {
  return (
    <Layout>
      <section className="container py-10 max-w-2xl prose-mt">
        <span className="kicker">Contact</span>
        <h1 className="font-display mt-2">Write to us</h1>
        <p className="lead">
          For corrections, editorial suggestions, takedown requests, or thoughtful disagreements about the mold-recovery sequence: please write. We read every email with care.
        </p>

        <p>
          Editorial enquiries: <a href="mailto:hello@themoldtruth.com">hello@themoldtruth.com</a><br/>
          Takedown / correction: <a href="mailto:corrections@themoldtruth.com">corrections@themoldtruth.com</a><br/>
          Affiliate / partnerships: <a href="mailto:partners@themoldtruth.com">partners@themoldtruth.com</a>
        </p>

        <p>
          We do not respond to outreach from SEO link-resellers, AI rewriting firms, or "guest post" pitches. We do respond to corrections, factual disagreements, and reader stories.
        </p>

        <p>
          For more on the wider editorial project, see <a href="https://theoraclelover.com" target="_blank" rel="noopener">theoraclelover.com</a>.
        </p>
      </section>
    </Layout>
  );
}
