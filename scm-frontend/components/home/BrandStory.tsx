import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sprout, CircleDot, CalendarCheck } from 'lucide-react';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';

const aboutItems = [
  {
    icon: <Sprout size={20} />,
    title: "Sourced from Rajasthan's Best Farms",
    text: "Hand-picked spices from trusted farmers every harvest season",
  },
  {
    icon: <CircleDot size={20} />,
    title: "Stone-Ground the Old Way",
    text: "Slow grinding preserves essential oils and true aroma",
  },
  {
    icon: <CalendarCheck size={20} />,
    title: "Packed Fresh, Batch-Dated",
    text: "Every packet stamped with grind date so you know it's fresh",
  },
];

export default function BrandStory() {
  return (
    <section className="py-20 bg-cream border-t border-cream-mid overflow-hidden">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: Image Area */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] overflow-hidden bg-charcoal">
              <img src="/asset_31.jpg" alt="Our Story" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pl-10">
            <span className="font-body text-brand-red uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-[1.15]">
              Crafted with Love,<br />Rooted in Rajasthan
            </h2>
            
            <p className="font-body text-charcoal/80 text-lg leading-relaxed mb-10 max-w-lg">
              Sunil Choudhary Masala was born out of a passion for authentic Rajasthani cooking. From our humble stone-grinding mill in Rajasthan, we bring the same time-honoured recipes to kitchens across India.
            </p>

            <div className="flex flex-col gap-6 mb-10 border-l-2 border-cream-mid pl-6">
              {aboutItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div>
                    <strong className="block text-charcoal font-display text-lg mb-1">{item.title}</strong>
                    <span className="text-charcoal/60 font-body text-sm leading-relaxed">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <Link href="/about" className="inline-flex items-center gap-2 text-brand-red font-semibold font-body tracking-wide hover:text-charcoal transition-colors">
                READ OUR FULL STORY
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
        </div>
      </FadeIn>
    </section>
  );
}
