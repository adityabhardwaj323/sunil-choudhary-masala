'use client';

import { useEffect } from 'react';
import { trackViewItem, trackViewItemList, trackViewCart, trackBeginCheckout } from '@/lib/analytics';

export function ViewItemTracker({ product }: { product: any }) {
  useEffect(() => {
    if (product) {
      const price = product.variants && product.variants.length > 0 ? product.variants[0].price : 0;
      trackViewItem(product, price);
    }
  }, [product]);

  return null;
}

export function ViewItemListTracker({ products, listName }: { products: any[], listName: string }) {
  useEffect(() => {
    if (products && products.length > 0) {
      trackViewItemList(products, listName);
    }
  }, [products, listName]);

  return null;
}

export function ViewCartTracker({ cartItems, total }: { cartItems: any[], total: number }) {
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      trackViewCart(cartItems, total);
    }
  }, [cartItems, total]);

  return null;
}

export function BeginCheckoutTracker({ cartItems, total }: { cartItems: any[], total: number }) {
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      trackBeginCheckout(cartItems, total);
    }
  }, [cartItems, total]);

  return null;
}
