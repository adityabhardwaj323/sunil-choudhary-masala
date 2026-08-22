'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { formatPrice, scmImgUrl } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Heart, HeartCrack, ImageOff, Loader2, Plus, ShoppingBag, Star, Store, X } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const { refreshWishlist, refreshCart } = useCartWishlist();
  
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.status === 401) {
        router.push('/login?redirect=/wishlist');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to load wishlist');
      }
      const data = await res.json();
      setWishlistProducts(data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWish = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistProducts(data || []);
        refreshWishlist();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addAllToCart = async () => {
    let addedCount = 0;
    for (const p of wishlistProducts) {
      const variant = (p.variants && p.variants[0]) ? p.variants[0] : null;
      if (!variant) continue;
      
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: p._id,
            weight: variant.weight,
            quantity: 1
          })
        });
        if (res.ok) addedCount++;
      } catch (err) {
        console.error(err);
      }
    }
    
    if (addedCount > 0) {
      refreshCart();
      alert(`Added ${addedCount} items to your cart!`);
    } else {
      alert('No valid items found to add to cart.');
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 text-white">
            <Heart size={28} className="text-brand-red fill-brand-red" />
            <h1 className="font-playfair text-3xl md:text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-cream-mid mt-2">Products you love — saved for later!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
            <Loader2 size={36} className="animate-spin text-brand-red mb-4" />
            <p className="text-brown font-medium">Loading your wishlist&hellip;</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-cream-dark rounded-2xl shadow-sm">
            <AlertTriangle size={44} className="text-cream-mid mb-4" />
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">Couldn't load your wishlist</h3>
            <p className="text-brown text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && wishlistProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-cream-dark rounded-2xl shadow-sm">
            <HeartCrack size={44} className="text-cream-mid mb-4" />
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">Your wishlist is empty</h3>
            <p className="text-brown text-sm mb-6">Tap the heart icon on any product to save it here.</p>
            <Link
              href="/shop"
              className="bg-brand-red text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-brand-red-dark hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Store size={18} /> Browse Shop
            </Link>
          </div>
        )}

        {!loading && !error && wishlistProducts.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-brown">
                Showing <strong className="text-charcoal">{wishlistProducts.length}</strong> saved products
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => router.push('/shop')}
                  className="bg-white text-charcoal border-2 border-cream-dark px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-cream hover:border-brand-red/40 hover:text-brand-red transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add More Products
                </button>
                <button
                  onClick={addAllToCart}
                  className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:bg-brand-red-dark hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <ShoppingBag size={16} /> Add All to Cart
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence>
              {wishlistProducts.map((p) => {
                const v = (p.variants && p.variants[0]) || { price: 0, mrp: 0 };
                const off = v.mrp > v.price ? Math.round((100 * (v.mrp - v.price)) / v.mrp) : 0;
                const imgUrl = (p.images && p.images[0]) ? scmImgUrl(p.images[0]) : '';
                const rating = Math.round(p.ratingAvg || 0);

                return (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    key={p._id}
                    className="group relative bg-white border border-cream-mid rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div
                      className="relative aspect-square bg-cream-dark overflow-hidden p-4 flex items-center justify-center cursor-pointer"
                      onClick={() => router.push('/product/' + p._id)}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          alt={p.name}
                        />
                      ) : (
                        <ImageOff size={40} className="text-cream-mid" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeWish(p._id); }}
                        title="Remove from wishlist"
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-brown hover:text-brand-red hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      {off > 0 && (
                        <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-sm shadow-sm">
                          {off}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs font-semibold text-saffron uppercase tracking-widest mb-1">
                        {p.category}
                      </div>
                      <div
                        className="font-playfair text-base font-bold text-charcoal mb-2 hover:text-brand-red transition-colors cursor-pointer line-clamp-2"
                        onClick={() => router.push('/product/' + p._id)}
                      >
                        {p.name}
                      </div>
                      <div className="flex items-center gap-0.5 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < rating ? 'fill-gold text-gold' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-xs text-brown ml-1">({p.ratingCount || 0})</span>
                      </div>
                      <div className="mt-auto flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-charcoal">{formatPrice(v.price)}</span>
                        {v.mrp > v.price && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(v.mrp)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push('/product/' + p._id); }}
                        className="w-full bg-white text-charcoal border-2 border-cream-dark px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-cream hover:border-brand-red/40 hover:text-brand-red transition-all"
                      >
                        View Product
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
