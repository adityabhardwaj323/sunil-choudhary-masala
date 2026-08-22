'use client';

import React from 'react';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

import { useCartWishlist } from '@/context/CartWishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistButton({ productId, className = 'w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-brand-red transition-colors cursor-pointer', title = 'Add to Wishlist', children }: WishlistButtonProps) {
  const { refreshWishlist } = useCartWishlist();

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'POST'
      });
      if (res.status === 401) {
        window.location.href = '/login?redirect=/shop';
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

  return (
    <div className={className} title={title} onClick={handleToggleWishlist}>
      {children || <Heart size={18} />}
    </div>
  );
}
