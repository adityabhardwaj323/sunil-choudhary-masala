import Link from 'next/link';
import AddToCartButton from '@/components/shop/AddToCartButton';
import WishlistButton from '@/components/shop/WishlistButton';
import { Heart, ShoppingBag } from 'lucide-react';
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
    <div className="group relative bg-white border border-cream-mid rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative aspect-square bg-cream-dark overflow-hidden p-4 flex items-center justify-center">
        <Link href={`/product/${product._id}`} className="absolute inset-0 z-10"></Link>
        
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <Image src="/asset_35.jpg" alt={product.name || 'SCM Product'} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        )}
        
        {/* Badges & Actions */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {badge && (
            <span className="bg-saffron text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-sm shadow-sm">
              {badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-sm shadow-sm">
              Save {Math.round(((mrp - price) / mrp) * 100)}%
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton 
            productId={product._id} 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-brand-red transition-colors cursor-pointer"
          >
            <Heart size={18} />
          </WishlistButton>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          {(product.variants && product.variants.length > 1) ? (
            <Link 
              href={`/product/${product._id}`}
              className="w-full bg-charcoal text-white hover:bg-black transition-colors flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm shadow-lg"
            >
              <ShoppingBag size={18} />
              <span>Select Options</span>
            </Link>
          ) : (
            <AddToCartButton 
              productId={product._id} 
              variantId={firstVariant?._id}
              weight={firstVariant?.weight}
              className="w-full bg-brand-red text-white hover:bg-brand-red-dark transition-colors flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm shadow-lg"
            >
              <ShoppingBag size={18} />
              <span>Quick Add</span>
            </AddToCartButton>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-saffron uppercase tracking-widest mb-1">
          {product.category}
        </div>
        <Link href={`/product/${product._id}`} className="font-playfair text-xl font-bold text-charcoal mb-2 hover:text-brand-red transition-colors line-clamp-2">
          {product.name}
        </Link>
        <div className="text-sm text-brown mb-3">
          {weights || 'Weight options available'}
        </div>
        
        {product.ratingCount && product.ratingCount > 0 ? (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.ratingAvg || 0) ? "text-gold" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-brown ml-1">({product.ratingCount})</span>
          </div>
        ) : (
          <div className="mb-4 h-5"></div>
        )}

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through mb-0.5">₹{mrp}</span>
            )}
            <span className="text-lg font-bold text-charcoal">₹{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
