import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById, fetchProducts } from '@/lib/api';
import { Product } from '@/types';

import ProductGallery from '@/components/product/ProductGallery';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Metadata } from 'next';
import { Truck, RotateCcw, ShieldCheck, CalendarDays, ChevronRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await fetchProductById(params.id);
    if (!product) return { title: 'Product Not Found - Sunil Choudhary Masala' };
    
    return {
      title: `${product.name} - Sunil Choudhary Masala`,
      description: product.description.substring(0, 160) || `Buy authentic ${product.name} from Sunil Choudhary Masala.`,
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 160),
        images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
      }
    };
  } catch (error) {
    return { title: 'Sunil Choudhary Masala' };
  }
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related products by category
  let relatedProducts: Product[] = [];
  try {
    const relatedRes = await fetchProducts({ category: product.category });
    relatedProducts = relatedRes.products || [];
  } catch (err) {
    console.error('Failed to fetch related products', err);
  }

  return (
    <>
      <div className="bg-cream pb-12">
        {/* Breadcrumb */}
      <div className="bg-charcoal text-cream py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm font-medium">
          <Link href="/" className="text-gray-400 hover:text-saffron transition-colors">Home</Link>
          <ChevronRight size={14} className="text-gray-600" />
          <Link href="/shop" className="text-gray-400 hover:text-saffron transition-colors">Shop</Link>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-saffron">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-[55%] flex-shrink-0">
            <ProductGallery images={product.images || []} />
          </div>
          
          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-8">
            <div className="mb-6">
              <div className="inline-block bg-saffron text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm shadow-sm mb-4">
                {product.category}
              </div>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <div className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={14} /> {product.totalSold || 0} Sold
                </div>
              </div>
            </div>

            <ProductActions product={product} />

            {/* Trust Panel */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-cream-dark shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron flex-shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">Free Delivery</div>
                  <div className="text-xs text-gray-500 mt-0.5">On orders above ₹499</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron flex-shrink-0">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-500 mt-0.5">7-day no questions asked</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">FSSAI Certified</div>
                  <div className="text-xs text-gray-500 mt-0.5">100% Natural · No Additives</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron flex-shrink-0">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">Batch Date</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {product.batchDate ? new Date(product.batchDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Recently Packed'}
                  </div>
                </div>
              </div>
            </div>

            <ProductTabs product={product} />
          </div>
        </div>
      </div>
      </div>

      
      <RelatedProducts 
        products={relatedProducts} 
        currentProductId={product._id} 
      />
    </>
  );
}
