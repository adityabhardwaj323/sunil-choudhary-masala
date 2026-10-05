import Link from 'next/link';
import AddToCartButton from '@/components/shop/AddToCartButton';
import WishlistButton from '@/components/shop/WishlistButton';
import { Heart, Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const price = firstVariant ? firstVariant.price : 0;
  const mrp = firstVariant ? firstVariant.mrp : 0;
  const hasDiscount = mrp > price;
  const weights = (product.variants || []).map((v: any) => v.weight).join(' | ');

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;

  const badge = product.isBestseller ? 'Bestseller' : (product.isNewArrival ? 'New' : (product.isFeatured ? 'Featured' : ''));

  return (
    <div className="group relative flex flex-col h-full bg-white transition-all duration-300">
      
      {/* Image Area */}
      <div className="relative aspect-[4/5] bg-[#FAF7F1] mb-4 overflow-hidden rounded-sm flex items-center justify-center">
        <Link href={`/product/${product._id}`} className="absolute inset-0 z-10" aria-label={product.name}></Link>
        
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <Image src="/asset_35.jpg" alt={product.name || 'SCM Product'} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {badge && (
            <span className="bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest py-1 px-2.5">
              {badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest py-1 px-2.5">
              Sale
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton 
            productId={product._id} 
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-charcoal hover:text-brand-red transition-colors cursor-pointer"
          >
            <Heart size={15} />
          </WishlistButton>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow relative">
        <Link href={`/product/${product._id}`} className="font-display text-lg md:text-[22px] font-medium text-charcoal mb-1.5 hover:text-brand-red transition-colors line-clamp-2 pr-10">
          {product.name}
        </Link>
        
        {product.ratingCount && product.ratingCount > 0 ? (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.round(product.ratingAvg || 0) ? "text-saffron" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] font-body text-charcoal/60 mt-0.5">{(product.ratingAvg || 0).toFixed(1)}</span>
          </div>
        ) : (
          <div className="mb-3 h-4"></div>
        )}

        <div className="mt-auto flex items-center gap-2 font-body">
          <span className="text-[15px] font-semibold text-charcoal">₹{price}</span>
          {hasDiscount && (
            <span className="text-[13px] text-charcoal/40 line-through">₹{mrp}</span>
          )}
        </div>

        {/* Minimal Add to Cart */}
        <div className="absolute bottom-0 right-0 z-20">
          {(product.variants && product.variants.length > 1) ? (
            <Link 
              href={`/product/${product._id}`}
              className="w-9 h-9 bg-cream hover:bg-brand-red hover:text-white text-charcoal transition-colors flex items-center justify-center rounded-sm"
              aria-label="Select Options"
            >
              <Plus size={18} strokeWidth={1.5} />
            </Link>
          ) : (
            <AddToCartButton 
              productId={product._id} 
              variantId={firstVariant?._id}
              weight={firstVariant?.weight}
              className="w-9 h-9 bg-cream hover:bg-brand-red hover:text-white text-charcoal transition-colors flex items-center justify-center rounded-sm"
              aria-label="Quick Add"
            >
              <Plus size={18} strokeWidth={1.5} />
            </AddToCartButton>
          )}
        </div>
      </div>
    </div>
  );
}
