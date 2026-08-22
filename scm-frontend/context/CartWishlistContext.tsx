'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartWishlistContextType = {
  cartCount: number;
  wishlistCount: number;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const CartWishlistContext = createContext<CartWishlistContextType>({
  cartCount: 0,
  wishlistCount: 0,
  refreshCart: async () => {},
  refreshWishlist: async () => {}
});

export const CartWishlistProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const count = data?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      setCartCount(0);
    }
  };

  const refreshWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } else {
        setWishlistCount(0);
      }
    } catch (error) {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, []);

  return (
    <CartWishlistContext.Provider value={{ cartCount, wishlistCount, refreshCart, refreshWishlist }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
