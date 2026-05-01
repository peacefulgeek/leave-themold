import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";

export default function About() {
  const { data: site } = trpc.site.config.useQuery();

  return (
    <Layout>
      <section className="container py-10 max-w-3xl">
        <span className="kicker">About</span>
        <h1 className="font-display mt-2">The Oracle Lover & The Mold Truth</h1>

        {site?.authorPhoto && (
          <figure className="my-8">
            <img src={site.authorPhoto} alt="The Oracle Lover" className="rounded-md w-full max-w-md mx-auto shadow-md" />
            <figcaption className="text-center text-sm text-[var(--sage-700)] mt-2 font-ui">
              The Oracle Lover — author and editor
            </figcaption>
          </figure>
        )}

        <div className="prose-mt">
          <p className="lead">
            The Mold Truth was started because the people in mold-illness recovery rarely get a kind, image-rich, plain-English orientation while they are still inside the worst of it. Most of what is online is either a marketing funnel or a forum thread that requires three hours and a search bar to navigate. This site exists to fix that.
          </p>
          <p>
            I write under the byline The Oracle Lover. I am not a doctor. I am a careful reader, a long-time student of integrative medicine, and someone who has watched the people closest to me move through Chronic Inflammatory Response Syndrome and out the other side. The voice you read here is conversational on purpose — the way a friend who has done the reading would explain it across a kitchen table.
          </p>
          <p>
            Every article on The Mold Truth is written for one specific person at one specific moment: the person who has just started to suspect that the strange, layered constellation of symptoms they have been carrying might be a building, not a flu. That moment deserves a calm, accurate, encouraging room.
          </p>
          <h2>What this site is, and what it is not</h2>
          <p>
            The Mold Truth is an editorial reading-room. It is not a clinic. It does not diagnose. It does not replace a CIRS-literate practitioner. What it does is give you a sequence, a vocabulary, a set of biomarkers to ask your doctor about, and a curated shelf of tools that real recovering patients use. We update the library every month. We re-check the protocol coverage every quarter. We never publish an article that has not cleared the quality gate first.
          </p>
          <h2>The Oracle Lover</h2>
          <p>
            For more on my main editorial work — including poetry, criticism, and the wider Oracle Lover archive — visit <a href="https://theoraclelover.com" target="_blank" rel="noopener">theoraclelover.com</a>. The Mold Truth is the niche-medical wing of that larger project: same editorial standard, same patience, same insistence on writing as if the reader is a beloved friend.
          </p>
          <h2>How we make money</h2>
          <p>
            The Mold Truth participates in the Amazon Associates programme under the affiliate tag <code>spankyspinola-20</code>. Every product link is labelled "(paid link)" and every article carries a footer disclosure. We never recommend a product we would not put in our own bedroom. We never recommend supplements as a substitute for protocol care.
          </p>
          <h2>Editorial promise</h2>
          <p>
            Honest. Image-rich. Plain English. No miracle cure language. No FDA-approved hyperbole. No anonymous voice. We sign every article. We date every article. We update every article when the field updates. If we ever fall short of that promise, write to us at the contact page.
          </p>
        </div>
      </section>
    </Layout>
  );
}
