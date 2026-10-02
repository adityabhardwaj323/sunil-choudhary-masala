'use client';

import React from 'react';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  weight?: string;
  className?: string;
  children?: React.ReactNode;
}

import { useCartWishlist } from '@/context/CartWishlistContext';
import { ShoppingBag } from 'lucide-react';
import { trackAddToCart } from '@/lib/analytics';

export default function AddToCartButton({ productId, variantId, weight, className = 'bg-charcoal text-white hover:bg-brand-red transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md w-full', children, price = 0, productName = '' }: AddToCartButtonProps & { price?: number, productName?: string }) {
  const { refreshCart } = useCartWishlist();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variantId) {
      alert('Please select a variant first');
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          weight: weight || 'Default',
          quantity: 1
        })
      });
      
      if (res.status === 401) {
        window.location.href = '/login?redirect=/shop';
        return;
      }
      
      if (res.ok) {
        refreshCart();
        // Fire analytics
        trackAddToCart({ _id: productId, name: productName }, 1, price);
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

  return (
    <button className={className} onClick={handleAddToCart} disabled={!variantId}>
      {children || <><ShoppingBag size={16} /> <span>Add to Cart</span></>}
    </button>
  );
}
