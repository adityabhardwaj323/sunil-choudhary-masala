import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Shop Premium Spices - Sunil Choudhary Masala',
  description: 'Browse our collection of authentic, premium quality spices from Rajasthan. Red Chilli, Coriander, Turmeric, Dry Fruits, Makhana, and Cooking Oils.',
  openGraph: {
    title: 'Shop Premium Spices - Sunil Choudhary Masala',
    description: 'Browse our collection of authentic, premium quality spices from Rajasthan.',
  }
};
import { Suspense } from 'react';
import { fetchProducts } from '@/lib/api';
import ShopFilters from '@/components/shop/ShopFilters';
import ShopSort from '@/components/shop/ShopSort';
import ShopSearch from '@/components/shop/ShopSearch';
import CategoryTabs from '@/components/shop/CategoryTabs';
import ProductCard from '@/components/home/ProductCard';
import { ProductsResponse } from '@/types';
import { Leaf } from 'lucide-react';

import { ViewItemListTracker } from '@/components/seo/AnalyticsTracker';

export default async function ShopPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  let productsResponse: ProductsResponse = { count: 0, products: [] };
  let error = null;

  try {
    productsResponse = await fetchProducts(searchParams);
  } catch (err: any) {
    error = err.message || 'Failed to load products.';
  }

  const { products, count } = productsResponse;

  return (
    <>
      <ViewItemListTracker products={products} listName="Shop - All Products" />
      {/* Hero Section */}
      <div className="relative bg-charcoal text-cream py-16 px-4 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <Leaf className="text-saffron mb-4" size={32} />
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
          <p className="font-body uppercase tracking-[0.2em] text-xs font-semibold text-xl text-cream-mid max-w-2xl mb-6">Authentic flavours, carefully crafted for every kitchen.</p>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium tracking-widest uppercase">
            <Link href="/" className="hover:text-saffron transition-colors">Home</Link>
            <span>/</span>
            <span className="text-saffron">Shop</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <Suspense fallback={<aside className="w-full lg:w-64 flex-shrink-0 animate-pulse bg-cream-dark h-96 rounded-2xl"></aside>}>
            <ShopFilters />
          </Suspense>

          <main className="flex-grow min-w-0">
            <Suspense fallback={<div className="animate-pulse bg-cream-dark h-12 w-full rounded-full mb-6"></div>}>
              <CategoryTabs />
            </Suspense>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-cream-dark shadow-sm">
              <div className="text-sm text-gray-500 font-medium">
                Showing <strong className="text-charcoal">{count > 0 ? 1 : 0}-{count}</strong> of <strong className="text-charcoal">{count}</strong> products
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Suspense fallback={<div className="animate-pulse bg-cream-dark h-10 w-48 rounded-full"></div>}>
                  <ShopSearch />
                </Suspense>
                <Suspense fallback={<div className="animate-pulse bg-cream-dark h-10 w-40 rounded-full"></div>}>
                  <ShopSort />
                </Suspense>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-brand-red p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center my-12">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="font-playfair text-xl font-bold mb-2">Error Loading Products</h3>
                <p>{error}</p>
              </div>
            )}

            {!error && count === 0 && (
              <div className="bg-cream p-12 rounded-2xl border border-cream-dark flex flex-col items-center justify-center text-center my-12">
                <Leaf className="text-saffron mb-4" size={48} opacity={0.5} />
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">No spices found</h3>
                <p className="text-brown mb-6 max-w-md">Try adjusting your filters or search terms to discover our authentic blends.</p>
                <Link href="/shop" className="bg-brand-red text-white px-6 py-2 rounded-full font-medium hover:bg-red-800 transition-colors shadow-sm hover:shadow-md">
                  View All Products
                </Link>
              </div>
            )}

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <MotionItem key={product._id} whileHover={{ y: -4 }} className="h-full"><ProductCard key={product._id} product={product} /></MotionItem>
              ))}
            
            </StaggerChildren>


          </main>
        </div>
      </div>
    </>
  );
}
