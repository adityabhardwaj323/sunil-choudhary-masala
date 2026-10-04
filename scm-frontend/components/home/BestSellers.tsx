import { fetchProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';

import { ViewItemListTracker } from '@/components/seo/AnalyticsTracker';

export default async function BestSellers() {
  let products: any[] = [];
  try {
    const res = await fetchProducts({ bestseller: 'true' });
    products = res?.products?.slice(0, 4) || [];
    if (products.length === 0) {
      const allRes = await fetchProducts();
      products = allRes?.products?.slice(0, 4) || [];
    }
  } catch (error) {
    console.error('Failed to fetch bestsellers:', error);
  }

  if (products.length === 0) {
    return null; // Graceful empty state
  }

  return (
    <section className="py-20 bg-white">
      <ViewItemListTracker products={products} listName="Homepage Best Sellers" />
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-kalam text-brand-red text-xl mb-2">Most Loved</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">Our Bestsellers</h2>
          <SectionDivider />
          <p className="text-brown max-w-2xl mt-6">
            The authentic flavours our customers keep coming back for. Hand-picked, stone-ground, and packed with purity.
          </p>
        </div>
        
        <StaggerChildren className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8 sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product: any) => (
            <MotionItem 
              key={product._id} 
              whileHover={{ y: -4 }} 
              className="h-full w-[85vw] min-w-[280px] max-w-[320px] shrink-0 snap-center sm:w-auto sm:min-w-0 sm:max-w-none"
            >
              <ProductCard product={product} />
            </MotionItem>
          ))}
        </StaggerChildren>
      </FadeIn>
    </section>
  );
}
