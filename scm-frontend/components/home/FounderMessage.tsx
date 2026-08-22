import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';

export default function FounderMessage() {
  return (
    <section className="py-20 bg-cream-dark/40 border-t border-cream-mid overflow-hidden">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT: Founder photo placeholder */}
          <div className="w-full lg:w-2/5 relative flex flex-col items-center">
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-charcoal overflow-hidden shadow-xl border-4 border-white">
              <img src="/asset_3.jpg" alt="Sunil Choudhary, Founder" className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 text-center bg-white rounded-xl px-6 py-4 shadow-md border border-cream-dark">
              <p className="font-playfair font-bold text-charcoal leading-tight">Sunil<br />Choudhary</p>
              <p className="text-xs uppercase tracking-widest text-saffron font-semibold mt-1">Founder</p>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center">
            <span className="font-kalam text-saffron text-xl mb-3 block">✦ Founder's Message</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
              A Promise from<br />Our Family to Yours
            </h2>

            <div className="mb-8">
              <SectionDivider />
            </div>

            <blockquote className="border-l-4 border-brand-red pl-6 py-2 mb-6 bg-white/60 rounded-r-lg">
              <p className="font-playfair italic text-xl text-charcoal leading-relaxed">
                "My mother always said — a meal made with pure spices feeds not just the body, but
                the soul. For 35 years I have kept that promise. Every masala that leaves our mill
                carries the same commitment to purity that she taught me."
              </p>
            </blockquote>

            <p className="text-brown text-lg leading-relaxed mb-6">
              Sunil Choudhary started with a single stone-grinder and a dream to bring honest,
              unadulterated spices to every Indian household. Today, thousands of families across
              India trust the SCM name.
            </p>

            <div className="font-playfair text-2xl text-brand-red font-semibold">— Sunil Choudhary</div>
            <div className="text-brown text-sm mt-1">Founder &amp; Master Spice Blender, Sunil Choudhary Masala</div>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
