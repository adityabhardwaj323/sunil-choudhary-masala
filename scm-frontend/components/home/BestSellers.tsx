import { fetchProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';

export default async function BestSellers() {
  let products: any[] = [];
  try {
    const res = await fetchProducts({ bestseller: 'true' });
    // limit to 4 for desktop
    products = res.products.slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch bestsellers:', error);
  }

  if (products.length === 0) {
    return null; // Graceful empty state
  }

  return (
    <section className="py-20 bg-white">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-kalam text-brand-red text-xl mb-2">Most Loved</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">Our Bestsellers</h2>
          <SectionDivider />
          <p className="text-brown max-w-2xl mt-6">
            The authentic flavours our customers keep coming back for. Hand-picked, stone-ground, and packed with purity.
          </p>
        </div>
        
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product: any) => (
            <MotionItem key={product._id} whileHover={{ y: -4 }} className="h-full">
              <ProductCard product={product} />
            </MotionItem>
          ))}
        </StaggerChildren>
      </FadeIn>
    </section>
  );
}
