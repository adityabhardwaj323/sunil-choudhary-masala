import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata: Metadata = {
  title: 'Heritage | Sunil Choudhary Masala',
};

const timeline = [
  {
    era: 'Generation One',
    title: 'Spices Ground at Home',
    text: "Traditional spice-making practiced within the family, for the family and local community — the roots of everything that followed.",
  },
  {
    era: 'Generation Two',
    title: 'From Household Practice to Local Trade',
    text: "Family recipes and methods carried forward and shared more widely, as trust in the family's spices grew beyond the household.",
  },
  {
    era: 'Generation Three',
    title: 'Sunil Choudhary Masala Today',
    text: "The tradition continues under the Sunil Choudhary Masala name — the same family commitment to purity and honesty, now reaching families beyond Rajasthan.",
  },
  {
    era: 'Ongoing',
    title: 'Still Guided by the Same Standards',
    text: "No artificial colours. No preservatives. Carefully selected ingredients. The values that started at home remain unchanged as the business grows.",
  },
];

export default function HeritagePage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🏺</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">✨</div>

        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Our Story</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Heritage</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Three generations of one family's commitment to pure, honest spices
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          <div className="prose prose-lg prose-brown max-w-none">
            <p className="lead text-xl text-charcoal font-medium italic font-playfair text-center border-b border-cream-dark/50 pb-8 mb-10">
              "Sunil Choudhary Masala did not begin as a company. It began as a family's everyday practice of
              grinding spices at home — the same way it had been done for generations before it — carried
              forward with care, patience, and an unwillingness to cut corners."
            </p>

            <h2 className="font-playfair text-3xl font-bold text-charcoal">A Family Tradition, Three Generations Deep</h2>
            <p className="text-brown">
              Long before Sunil Choudhary Masala existed as a registered business, spice-making was already a
              way of life in the Choudhary family. Recipes, ratios, and techniques for turmeric, chilli,
              coriander, and blended masalas were passed down and refined within the household, long before
              any of it was sold commercially.
            </p>
            <p className="text-brown">
              What set this family apart was not any single recipe, but a shared insistence across
              generations: spices should taste the way nature intended, without artificial colour or
              preservatives added to mask lower quality.
            </p>

            <h2 className="font-playfair text-3xl font-bold text-charcoal mt-10">From a Family Kitchen to a Trusted Name</h2>
            <p className="text-brown">
              Over the years, what began as spices ground for the family and immediate community slowly grew
              into a small local business, then a known name across nearby markets, and eventually into Sunil
              Choudhary Masala as it exists today.
            </p>
            <p className="text-brown">
              Growth was never the goal in itself. Every stage of expansion — from serving a few households to
              serving many more — happened because people who bought SCM spices trusted what they were getting,
              and told others about it.
            </p>

            {/* Timeline */}
            <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12 mb-2">Our Timeline</h2>
            <div className="not-prose mt-8 relative pl-8 border-l-2 border-cream-dark space-y-10">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-brand-red border-4 border-cream" />
                  <span className="font-kalam text-saffron text-sm tracking-wide">{item.era}</span>
                  <h3 className="font-playfair text-xl font-bold text-charcoal mt-1 mb-2">{item.title}</h3>
                  <p className="text-brown text-[15px] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <h2 className="font-playfair text-3xl font-bold text-charcoal mt-12">What Has Never Changed</h2>
            <p className="text-brown">
              Businesses change shape over time — product ranges grow, packaging modernises, reach extends.
              What has not changed at SCM, across three generations, is the underlying commitment: quality
              ingredients, honest processing, and a genuine respect for the people who buy and cook with our
              spices every day.
            </p>
            <p className="text-brown">
              We don't claim awards or certifications we haven't earned, and we don't dress up our story with
              achievements that aren't ours. What we can say, plainly, is this: SCM is a family business that
              has tried, for three generations, to do one thing well — make spices the honest way.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Band */}
      <div className="bg-charcoal mt-16 py-14 text-center px-6">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-3">
          See How This Commitment Shapes Every Batch
        </h2>
        <p className="text-white/70 mb-7">Learn about our quality standards and process</p>
        <Link
          href="/quality-standards"
          className="inline-block bg-white text-brand-red font-semibold rounded-lg px-7 py-3 hover:bg-cream transition-colors"
        >
          Quality &amp; Purity Standards
        </Link>
      </div>
    </div>
  );
}
