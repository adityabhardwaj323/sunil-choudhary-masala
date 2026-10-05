import Link from 'next/link';
import Image from 'next/image';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';
import { fetchProducts, fetchCategoriesMetadata } from '@/lib/api';
import { getCategoriesFromProducts, CategoryItem } from '@/lib/categories';
import { Product } from '@/types';

function CategoryCard({ cat }: { cat: CategoryItem }) {
  const bgImage = cat.image || '/asset_35.jpg';

  return (
    <Link
      href={cat.link}
      className="group relative overflow-hidden cursor-pointer block h-full w-full aspect-[4/5] bg-cream-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red"
      aria-label={`Shop ${cat.name}`}
    >
      {/* Background visual */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={cat.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Dark readable gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 z-1" />

      {/* Category Text & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-2 flex flex-col justify-end">
        <h3 className="font-display text-lg sm:text-[19px] font-bold leading-tight tracking-wide">
          {cat.name}
        </h3>
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
          <span className="font-body text-brand-red uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">
            Handcrafted Collections
          </span>
          <h2 className="font-display text-[32px] md:text-[44px] font-bold text-charcoal mb-3">
            Shop by Category
          </h2>
          <SectionDivider />
          <p className="text-brown max-w-xl text-sm md:text-base mt-4">
            Choose your favorite spices and products.
          </p>
        </FadeIn>

        {/* Animated Marquee (Default) */}
        <div className="relative w-full overflow-hidden motion-reduce:hidden group mt-4">
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
