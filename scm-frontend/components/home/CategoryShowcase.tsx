import Link from 'next/link';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';

import { Flame, Sparkles, Nut, Cookie, Droplets, Sun } from 'lucide-react';

const categories = [
  { name: 'Chilli Powders', desc: 'Vibrant color, perfect heat', icon: <Flame size={64} />, link: '/shop?category=Chilli%20Powders', gradient: 'from-[#4a1a08] to-[#8B3000]' },
  { name: 'Ground Spices', desc: 'Essential everyday spices', icon: <Sparkles size={64} />, link: '/shop?category=Ground%20Spices', gradient: 'from-[#4a3508] to-[#8B6500]' },
  { name: 'Dry Fruits & Nuts', desc: 'Premium quality selection', icon: <Nut size={64} />, link: '/shop?category=Dry%20Fruits%20%26%20Nuts', gradient: 'from-[#1a0a4a] to-[#3d1a8B]' },
  { name: 'Healthy Snacks', desc: 'Delicious and nutritious', icon: <Cookie size={64} />, link: '/shop?category=Healthy%20Snacks', gradient: 'from-[#1a4a08] to-[#2d7a14]' },
  { name: 'Cooking Oils', desc: 'Pure and unrefined', icon: <Droplets size={64} />, link: '/shop?category=Cooking%20Oils', gradient: 'from-[#4a0a0a] to-[#8B1414]' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 px-8 bg-cream-dark">
      <div className="container mx-auto max-w-7xl">
        <FadeIn className="text-center mb-12 flex flex-col items-center">
          <span className="font-kalam text-saffron text-base mb-2.5 block">✨ Categories</span>
          <h2 className="font-playfair text-[28px] md:text-[44px] font-bold text-charcoal mb-4">Shop by Spice Type</h2>
          <SectionDivider />
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat, idx) => (
            <MotionItem key={idx} whileHover={{ y: -4 }} className="h-full block">
              <Link
                href={cat.link}
                className="group relative rounded-[14px] overflow-hidden cursor-pointer aspect-square block h-full w-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-[64px] transition-transform duration-400 group-hover:scale-110`}>
                  <span>{cat.icon}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-brand-red/85 group-hover:via-brand-red/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                  <h3 className="font-playfair text-[16px] font-semibold leading-tight mb-0.5">{cat.name}</h3>
                  <span className="text-xs opacity-80">{cat.desc}</span>
                </div>
              </Link>
            </MotionItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
