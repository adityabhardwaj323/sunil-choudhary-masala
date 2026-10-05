import { SectionDivider } from '@/components/ui/SectionDivider';
import { Leaf, ShieldCheck, ThermometerSnowflake } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const qualityPrinciples = [
  { icon: <Leaf size={32} className="text-saffron" />, title: 'Farm-Direct Sourcing', desc: 'We source directly from verified Rajasthani farms, cutting out middlemen and ensuring the freshest raw spices.' },
  { icon: <ShieldCheck size={32} className="text-saffron" />, title: 'Lab Tested Quality', desc: 'Every batch is tested for purity, moisture content, and microbial safety before packing begins.' },
  { icon: <ThermometerSnowflake size={32} className="text-saffron" />, title: 'Stone-Ground Freshness', desc: 'Stone-cold grinding — no high-heat processing that destroys essential oils and natural flavours.' },
];

export default function QualitySection() {
  return (
    <section className="py-24 md:py-32 bg-charcoal text-white overflow-hidden">
      <FadeIn className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20 flex flex-col items-center">
          <span className="font-body uppercase tracking-[0.2em] text-xs font-semibold text-brand-red mb-4 block">
            OUR PROMISE
          </span>
          <h2 className="font-display text-4xl md:text-[52px] font-bold mb-6 text-white leading-tight">
            From Tradition to Your Kitchen
          </h2>
          <p className="font-body text-white/70 max-w-2xl text-lg leading-relaxed">
            Every step from farm to kitchen is guided by one principle: Shuddhta — purity above everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {qualityPrinciples.map((principle, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-6 opacity-90">
                {principle.icon}
              </div>
              <h3 className="font-display text-[22px] font-bold mb-4 text-white leading-snug">{principle.title}</h3>
              <p className="font-body text-white/60 leading-relaxed text-[15px]">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
