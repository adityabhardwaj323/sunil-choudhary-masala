import Link from 'next/link';
import Image from 'next/image';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';
import { Flame, Sparkles, Nut, Cookie, Droplets, Package, Leaf } from 'lucide-react';
import { fetchProducts, fetchCategoriesMetadata } from '@/lib/api';
import { getCategoriesFromProducts, CategoryItem } from '@/lib/categories';
import { Product } from '@/types';

function renderCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Flame': return <Flame size={44} className="text-white/90" />;
    case 'Sparkles': return <Sparkles size={44} className="text-white/90" />;
    case 'Nut': return <Nut size={44} className="text-white/90" />;
    case 'Cookie': return <Cookie size={44} className="text-white/90" />;
    case 'Droplets': return <Droplets size={44} className="text-white/90" />;
    case 'Package': return <Package size={44} className="text-white/90" />;
    default: return <Leaf size={44} className="text-white/90" />;
  }
}

function CategoryCard({ cat }: { cat: CategoryItem }) {
  return (
    <Link
      href={cat.link}
      className="group relative rounded-2xl overflow-hidden cursor-pointer block h-full w-full aspect-[4/5] bg-charcoal border border-cream-mid/60 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron"
      aria-label={`Shop ${cat.name}`}
    >
      {/* Background visual: real product image if available, else rich gradient & icon */}
      {cat.image ? (
        <div className="absolute inset-0 z-0 bg-cream-dark">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-108`}
        >
          <div className="p-4 rounded-full bg-white/10 backdrop-blur-xs">
            {renderCategoryIcon(cat.iconName)}
          </div>
        </div>
      )}

      {/* Dark readable gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors duration-300 z-1" />

      {/* Category Text & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white z-2 flex flex-col justify-end">
        <h3 className="font-playfair text-[15px] sm:text-[17px] font-bold leading-tight mb-1 group-hover:text-gold-light transition-colors">
          {cat.name}
        </h3>
        <span className="text-[11px] sm:text-xs text-white/80 line-clamp-1">
          {cat.desc}
        </span>
      </div>
    </Link>
  );
}

export default async function CategoryShowcase() {
  let products: Product[] = [];
  let categoryMetadata: any[] = [];

  try {
    const res = await fetchProducts();
    products = res?.products || [];
  } catch (err) {
    console.error('Failed to load products for category showcase:', err);
  }

  try {
    categoryMetadata = await fetchCategoriesMetadata();
  } catch (err) {
    console.error('Failed to load category metadata:', err);
  }

  const categories: CategoryItem[] = getCategoriesFromProducts(products, categoryMetadata);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-cream-dark/60 border-y border-cream-mid/40">
      <div className="container mx-auto max-w-7xl">
        <FadeIn className="text-center mb-10 md:mb-12 flex flex-col items-center">
          <span className="font-kalam text-saffron text-base md:text-lg mb-2 block tracking-wide">
            ✦ Handcrafted Collections
          </span>
          <h2 className="font-playfair text-[28px] md:text-[42px] font-bold text-charcoal mb-3">
            Shop by Category
          </h2>
          <SectionDivider />
          <p className="text-brown max-w-xl text-sm md:text-base mt-4">
            Choose your favorite spices and products.
          </p>
        </FadeIn>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 px-4 -mx-4 pb-4 mt-4">
          {categories.map((cat) => (
            <div key={`cat-mob-${cat.name}`} className="w-[140px] shrink-0 snap-start">
              <CategoryCard cat={cat} />
            </div>
          ))}
        </div>

        {/* Animated Marquee (Desktop Default) */}
        <div className="hidden md:block relative w-full overflow-hidden motion-reduce:hidden group mt-4">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] transition-transform">
            {/* First Set */}
            <div className="flex gap-4 px-2">
              {categories.map((cat) => (
                <div key={`cat-1-${cat.name}`} className="w-[160px] sm:w-[180px] md:w-[200px] shrink-0">
                  <CategoryCard cat={cat} />
                </div>
              ))}
            </div>
            {/* Duplicate Set for Loop */}
            <div className="flex gap-4 px-2">
              {categories.map((cat) => (
                <div key={`cat-2-${cat.name}`} className="w-[160px] sm:w-[180px] md:w-[200px] shrink-0">
                  <CategoryCard cat={cat} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fallback Grid (Reduced Motion) */}
        <div className="hidden motion-reduce:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 mt-4">
          {categories.map((cat) => (
            <div key={`cat-rm-${cat.name}`} className="h-full block">
              <CategoryCard cat={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
