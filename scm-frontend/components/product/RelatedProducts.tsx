import React from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/home/ProductCard';
import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';
import { FadeIn } from '@/components/motion/FadeIn';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out the current product
  const filtered = products.filter(p => p._id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-cream-dark max-w-7xl mx-auto px-4 pb-20">
      <FadeIn>
        <h2 className="font-playfair text-3xl font-bold text-charcoal mb-8 text-center md:text-left">You May Also Like</h2>
      </FadeIn>
      
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 4).map(prod => (
          <MotionItem key={prod._id} whileHover={{ y: -4 }}>
            <ProductCard product={prod} />
          </MotionItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
