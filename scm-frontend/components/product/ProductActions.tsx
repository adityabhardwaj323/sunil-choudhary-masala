'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { ShoppingBag, Heart, CheckCircle, XCircle, Minus, Plus, Zap } from 'lucide-react';
import { trackAddToCart } from '@/lib/analytics';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const fmtMoney = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleIncrement = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const { refreshCart, refreshWishlist } = useCartWishlist();

  const addToCart = async () => {
    if (!selectedVariant) return;
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          weight: selectedVariant.weight,
          quantity
        })
      });
      if (res.status === 401) {
        window.location.href = '/login?redirect=/product/' + product._id;
        return;
      }
      if (res.ok) {
        refreshCart();
        // Fire analytics
        trackAddToCart(product, quantity, selectedVariant.price);
        alert('Added to cart!');
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  const toggleWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist/${product._id}`, {
        method: 'POST'
      });
      if (res.status === 401) {
        window.location.href = '/login?redirect=/product/' + product._id;
        return;
      }
      if (res.ok) {
        refreshWishlist();
        alert('Added to wishlist!');
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.message || 'Failed to update wishlist');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  if (!selectedVariant) {
    return <div className="acct-empty" style={{ padding: '20px' }}>No variants available.</div>;
  }

  const off = selectedVariant.mrp > selectedVariant.price
    ? Math.round(100 * (selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) + '% OFF'
    : '';
    
  const inStock = (selectedVariant.stock || 0) > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Price & Stock */}
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-3">
          <span className="font-playfair text-4xl font-bold text-brand-red">{fmtMoney(selectedVariant.price * quantity)}</span>
          {selectedVariant.mrp > selectedVariant.price && (
            <span className="text-lg text-gray-400 line-through mb-1">{fmtMoney(selectedVariant.mrp * quantity)}</span>
          )}
          {off && (
            <span className="bg-saffron text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-sm shadow-sm mb-1.5 ml-2">
              {off}
            </span>
          )}
        </div>
        
        <div className={`flex items-center gap-1.5 text-sm font-medium ${inStock ? 'text-green-700' : 'text-brand-red'}`}>
          {inStock ? (
            <><CheckCircle size={16} /> <span>In Stock — Ships within 24 hours</span></>
          ) : (
            <><XCircle size={16} /> <span>Out of Stock</span></>
          )}
        </div>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-3">Select Pack Size</div>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v, idx) => {
              const isSelected = selectedVariant._id === v._id;
              const vInStock = (v.stock || 0) > 0;
              return (
                <button 
                  key={idx} 
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                    isSelected 
                      ? 'border-brand-red bg-cream shadow-sm text-brand-red' 
                      : vInStock 
                        ? 'border-cream-dark bg-white text-charcoal hover:border-saffron hover:text-brand-red' 
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => vInStock && handleVariantSelect(v)}
                  disabled={!vInStock}
                >
                  {v.weight}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-saffron rounded-full border-2 border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <div className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-3">Quantity</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-cream-dark rounded-xl shadow-sm overflow-hidden h-12 w-32">
            <button 
              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-cream-dark hover:text-brand-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleDecrement} 
              disabled={!inStock || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <div className="flex-1 h-full flex items-center justify-center font-semibold text-charcoal text-lg bg-cream">
              {quantity}
            </div>
            <button 
              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-cream-dark hover:text-brand-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleIncrement} 
              disabled={!inStock || quantity >= selectedVariant.stock}
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          <span className="text-xs text-brown">
            {inStock ? `Max ${selectedVariant.stock} allowed` : ''}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-cream-dark">
        <div className="flex gap-3 h-14">
          <button 
            className="flex-grow bg-white border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors flex items-center justify-center gap-2 rounded-xl font-semibold text-base shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addToCart}
            disabled={!inStock}
          >
            <ShoppingBag size={20} /> Add to Cart
          </button>
          
          <button 
            className="w-14 h-14 flex-shrink-0 bg-white border border-cream-dark hover:border-brand-red text-gray-400 hover:text-brand-red transition-all flex items-center justify-center rounded-xl shadow-sm hover:shadow-md group"
            onClick={toggleWishlist}
            aria-label="Add to Wishlist"
          >
            <Heart size={22} className="group-active:scale-90 transition-transform" />
          </button>
        </div>
        
        <button 
          className="w-full h-14 bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center justify-center gap-2 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={async () => {
            await addToCart();
            window.location.href = '/cart';
          }}
          disabled={!inStock}
        >
          <Zap size={20} /> Buy it Now
        </button>
      </div>
    
      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-3 pr-[88px] bg-white border-t border-cream-dark shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 lg:hidden flex items-center justify-between gap-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex flex-col shrink-0">
          <span className="font-playfair text-[17px] font-bold text-charcoal leading-none mb-1">{fmtMoney(selectedVariant.price * quantity)}</span>
          <span className="text-[11px] text-brown font-medium leading-none">{selectedVariant.weight}</span>
        </div>
        <button 
          className="flex-grow bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center justify-center gap-1.5 rounded-lg font-semibold h-11 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm px-2"
          onClick={addToCart}
          disabled={!inStock}
        >
          {product.variants && product.variants.length > 1 && !selectedVariant ? 'Select Variant' : <><ShoppingBag size={16} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}
