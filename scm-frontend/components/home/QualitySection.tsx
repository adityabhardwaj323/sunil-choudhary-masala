import { SectionDivider } from '@/components/ui/SectionDivider';
import { Leaf, ShieldCheck, ThermometerSnowflake } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const qualityPrinciples = [
  { icon: <Leaf size={40} className="text-saffron" />, title: 'Farm-Direct Sourcing', desc: 'We source directly from verified Rajasthani farms, cutting out middlemen and ensuring the freshest raw spices.' },
  { icon: <ShieldCheck size={40} className="text-saffron" />, title: 'Lab Tested Quality', desc: 'Every batch is tested for purity, moisture content, and microbial safety before packing begins.' },
  { icon: <ThermometerSnowflake size={40} className="text-saffron" />, title: 'No Heat Damage', desc: 'Stone-cold grinding — no high-heat processing that destroys essential oils and natural flavours.' },
];

export default function QualitySection() {
  return (
    <section className="py-24 bg-charcoal text-white relative overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <FadeIn className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-kalam text-saffron text-xl mb-2">✦ Our Promise</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">From Tradition to Your Kitchen</h2>
          <div className="w-24 h-1 bg-saffron rounded-full opacity-80 mb-6"></div>
          <p className="text-cream-mid max-w-2xl text-lg">
            Every step from farm to your kitchen is guided by one principle: Shuddhta — purity above everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {qualityPrinciples.map((principle, idx) => (
            <div key={idx} className="group flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-5xl mb-6 bg-charcoal w-20 h-20 rounded-full flex items-center justify-center shadow-lg border border-white/5 animate-float group-hover:bg-charcoal/80 transition-colors">
                {principle.icon}
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4 text-gold-light">{principle.title}</h3>
              <p className="text-cream-mid/80 leading-relaxed">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
