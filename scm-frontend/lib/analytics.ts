export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_TRACKING_ID) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, data);
  }
};

// eCommerce specific events
export const trackViewItemList = (items: any[], list_name: string = 'Shop') => {
  event('view_item_list', {
    item_list_id: list_name.toLowerCase().replace(/\s+/g, '_'),
    item_list_name: list_name,
    items: items.map(mapProductToGA4)
  });
};

export const trackSelectItem = (item: any, list_name: string = 'Shop') => {
  event('select_item', {
    item_list_id: list_name.toLowerCase().replace(/\s+/g, '_'),
    item_list_name: list_name,
    items: [mapProductToGA4(item)]
  });
};

export const trackViewItem = (item: any, value: number) => {
  event('view_item', {
    currency: 'INR',
    value: value,
    items: [mapProductToGA4(item, value)]
  });
};

export const trackAddToCart = (item: any, quantity: number = 1, price: number) => {
  event('add_to_cart', {
    currency: 'INR',
    value: price * quantity,
    items: [{
      ...mapProductToGA4(item, price),
      quantity
    }]
  });
};

export const trackRemoveFromCart = (item: any, quantity: number = 1, price: number) => {
  event('remove_from_cart', {
    currency: 'INR',
    value: price * quantity,
    items: [{
      ...mapProductToGA4(item, price),
      quantity
    }]
  });
};

export const trackViewCart = (items: any[], totalValue: number) => {
  event('view_cart', {
    currency: 'INR',
    value: totalValue,
    items: items.map(cartItem => ({
      ...mapProductToGA4(cartItem.product || cartItem, cartItem.price),
      quantity: cartItem.quantity
    }))
  });
};

export const trackBeginCheckout = (items: any[], totalValue: number) => {
  event('begin_checkout', {
    currency: 'INR',
    value: totalValue,
    items: items.map(cartItem => ({
      ...mapProductToGA4(cartItem.product || cartItem, cartItem.price),
      quantity: cartItem.quantity
    }))
  });
};

// Prevent duplicate purchase events
const trackPurchase = (transactionId: string, value: number, items: any[], discount: number = 0, shipping: number = 0) => {
  // Check if we've already tracked this purchase
  const storageKey = `ga4_tracked_purchase_${transactionId}`;
  if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
    return; // Already tracked
  }
  
  event('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'INR',
    shipping: shipping,
    coupon: discount > 0 ? 'YES' : 'NO', 
    items: items.map(cartItem => ({
      ...mapProductToGA4(cartItem.product || cartItem, cartItem.price),
      quantity: cartItem.quantity
    }))
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, 'true');
  }
};

export { trackPurchase };

// Helper
const mapProductToGA4 = (product: any, price?: number) => {
  return {
    item_id: product._id,
    item_name: product.name,
    item_category: product.category,
    price: price || (product.variants && product.variants.length > 0 ? product.variants[0].price : 0),
  };
};
