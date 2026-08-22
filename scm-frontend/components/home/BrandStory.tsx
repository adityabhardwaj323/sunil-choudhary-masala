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
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-charcoal">
              <img src="/asset_31.jpg" alt="Our Story" className="w-full h-full object-cover" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-saffron rounded-full flex flex-col items-center justify-center text-white p-4 shadow-lg transform rotate-12 group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full animate-spin-slow"></div>
              <span className="font-playfair text-3xl font-bold relative z-10">35+</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-center mt-1 relative z-10">Years of<br/>Purity</span>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="font-kalam text-saffron text-xl mb-3 block">✦ Our Story</span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
              Crafted with Love,<br />Rooted in Rajasthan
            </h2>
            
            <div className="mb-8">
              <SectionDivider />
            </div>
            
            <p className="text-brown text-lg leading-relaxed mb-8">
              Sunil Choudhary Masala was born out of a passion for authentic Rajasthani cooking. From our humble stone-grinding mill in Rajasthan, we bring the same time-honoured recipes to kitchens across India.
            </p>

            <div className="flex flex-col gap-5 mb-8">
              {aboutItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <strong className="block text-charcoal font-semibold">{item.title}</strong>
                    <span className="text-brown text-sm">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <Link href="/about">
                <Button variant="primary" className="flex items-center gap-2 group">
                  Read Our Full Story
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </FadeIn>
    </section>
  );
}
