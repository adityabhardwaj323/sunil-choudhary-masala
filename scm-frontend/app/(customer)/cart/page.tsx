'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { formatPrice, scmImgUrl } from '@/lib/utils';
import { Trash2, Minus, Plus, ArrowRight, Lock, ShoppingBag, ShieldCheck, Truck, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import FreeShippingBar from '@/components/cart/FreeShippingBar';
import CartRecommendations from '@/components/cart/CartRecommendations';
import { ViewCartTracker } from '@/components/seo/AnalyticsTracker';
import { trackBeginCheckout } from '@/lib/analytics';

export default function CartPage() {
  const router = useRouter();
  const { refreshCart } = useCartWishlist();
  
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.status === 401) {
        router.push('/login?redirect=/cart');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to load cart');
      }
      const data = await res.json();
      setCart(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const changeQty = async (itemId: string, dir: number) => {
    const item = cart.items.find((it: any) => it._id === itemId);
    if (!item) return;
    
    const newQty = Math.max(1, item.quantity + dir);
    if (newQty === item.quantity) return;

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        refreshCart();
        if (discount > 0) {
          setDiscount(0);
          setCoupon('');
          sessionStorage.removeItem('scm_checkout_discount');
          sessionStorage.removeItem('scm_checkout_coupon');
          alert('Cart updated. Please re-apply your coupon.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Remove this item from your cart?')) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        refreshCart();
        if (discount > 0) {
          setDiscount(0);
          setCoupon('');
          sessionStorage.removeItem('scm_checkout_discount');
          sessionStorage.removeItem('scm_checkout_coupon');
          alert('Cart updated. Please re-apply your coupon.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyCoupon = async (codeOverride?: string) => {
    const codeToApply = typeof codeOverride === 'string' ? codeOverride : coupon;
    if (!codeToApply.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToApply.trim(), orderValue: computeSubtotal() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid coupon code');
      setDiscount(data.discount);
      if (typeof codeOverride === 'string') setCoupon(codeOverride);
      alert(`Coupon applied! ₹${data.discount} off.`);
    } catch (err: any) {
      setDiscount(0);
      alert(err.message || 'Invalid coupon code');
    }
  };

  const computeSubtotal = () => {
    return (cart?.items || []).reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
  };

  const proceedToCheckout = () => {
    trackBeginCheckout(cart?.items || [], subtotal);
    sessionStorage.setItem('scm_checkout_discount', String(discount));
    sessionStorage.setItem('scm_checkout_coupon', coupon.trim());
    router.push('/checkout');
  };

  const subtotal = computeSubtotal();
  const itemCount = (cart?.items || []).reduce((s: number, it: any) => s + it.quantity, 0);

  return (
    <div className="bg-cream min-h-screen pb-20">
      <ViewCartTracker cartItems={cart?.items || []} total={subtotal} />
      
      {/* Header */}
      <div className="bg-charcoal text-cream py-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <h1 className="font-playfair text-4xl font-bold">My Cart</h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-gray-400 hover:text-saffron transition-colors">Home</Link>
            <span className="text-gray-600">›</span>
            <span className="text-saffron">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-brown gap-4">
            <div className="w-10 h-10 border-4 border-cream-dark border-t-saffron rounded-full animate-spin"></div>
            <p className="font-medium">Loading your cart&hellip;</p>
          </div>
        )}
        
        {!loading && error && (
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">Couldn't load your cart</h3>
            <p className="text-brown mb-6">{error}</p>
            <button onClick={fetchCart} className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-800 transition-colors">
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (!cart?.items || cart.items.length === 0) && (
          <div className="bg-white p-12 rounded-2xl border border-cream-dark shadow-sm flex flex-col items-center text-center max-w-2xl mx-auto my-12">
            <div className="w-24 h-24 bg-cream text-saffron rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={48} />
            </div>
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-3">Your cart is empty</h3>
            <p className="text-brown mb-8 text-lg">Add some authentic Indian spices to get started!</p>
            <Link href="/shop" className="bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg">
              <ShoppingBag size={20} /> Continue Shopping
            </Link>
          </div>
        )}

        {!loading && !error && cart?.items && cart.items.length > 0 && (
          <>
            <FreeShippingBar subtotal={subtotal} />
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left: Cart Items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-cream border-b border-cream-dark text-sm font-semibold text-charcoal uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <div className="flex flex-col divide-y divide-cream-dark">
                  <AnimatePresence>
                  {cart.items.map((item: any) => {
                    const p = item.product || {};
                    const imgUrl = (p.images && p.images[0]) ? scmImgUrl(p.images[0]) : '/asset_35.jpg';
                    return (
                      <motion.div 
                        layout 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, height: 0, overflow: 'hidden', margin: 0, padding: 0 }}
                        key={item._id} 
                        className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                      >
                        
                        {/* Product Info */}
                        <div className="col-span-6 w-full flex items-center gap-4">
                          <Link href={`/product/${p._id}`} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-cream-dark rounded-xl overflow-hidden border border-cream-mid">
                            <img src={imgUrl} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </Link>
                          <div className="flex flex-col">
                            <Link href={`/product/${p._id}`} className="font-playfair text-lg font-bold text-charcoal hover:text-brand-red transition-colors">
                              {p.name || 'Product'}
                            </Link>
                            <span className="text-sm font-medium text-brown mt-1 px-2.5 py-1 bg-cream rounded-md inline-block w-fit border border-cream-dark">
                              {item.weight} Pack
                            </span>
                            
                            {/* Mobile Price */}
                            <div className="md:hidden mt-2 font-semibold text-charcoal">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Desktop Price */}
                        <div className="hidden md:block col-span-2 text-center font-semibold text-charcoal">
                          {formatPrice(item.price)}
                        </div>
                        
                        {/* Quantity */}
                        <div className="col-span-2 w-full md:w-auto flex justify-between md:justify-center items-center">
                          <div className="md:hidden text-sm font-medium text-brown">Quantity</div>
                          <div className="flex items-center bg-white border border-cream-dark rounded-xl shadow-sm overflow-hidden h-10 w-28">
                            <button 
                              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-cream-dark hover:text-brand-red transition-colors disabled:opacity-50" 
                              onClick={() => changeQty(item._id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="flex-1 h-full flex items-center justify-center font-semibold text-charcoal text-sm bg-cream">
                              {item.quantity}
                            </div>
                            <button 
                              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-cream-dark hover:text-brand-red transition-colors" 
                              onClick={() => changeQty(item._id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Total & Remove */}
                        <div className="col-span-2 w-full flex justify-between md:justify-end items-center gap-4">
                          <div className="md:hidden text-sm font-medium text-brown">Total</div>
                          <div className="font-playfair text-lg font-bold text-brand-red">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <button 
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                            onClick={() => removeItem(item._id)}
                            aria-label={`Remove ${p.name || 'item'} from cart`}
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
                
                {/* Cart Footer / Return to Shop */}
                <div className="p-6 bg-cream border-t border-cream-dark flex justify-between items-center">
                  <Link href="/shop" className="text-sm font-semibold text-brand-red hover:text-red-800 transition-colors flex items-center gap-2">
                    <ArrowRight size={16} className="rotate-180" /> Continue Shopping
                  </Link>
                </div>
              </div>
              <CartRecommendations />
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-cream-dark">
                  <h2 className="font-playfair text-2xl font-bold text-charcoal">Order Summary</h2>
                </div>
                
                <div className="p-6 flex flex-col gap-4">
                  {/* Coupon Section */}
                    <div className="flex flex-col gap-2 pb-6 border-b border-cream-dark">
                      <label className="text-sm font-semibold text-charcoal uppercase tracking-wider">Have a coupon?</label>
                      {discount > 0 ? (
                        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-xl">
                          <div>
                            <div className="font-bold text-green-700 uppercase tracking-wider">{coupon}</div>
                            <div className="text-sm text-green-600 font-medium">Coupon applied — {formatPrice(discount)} off</div>
                          </div>
                          <button 
                            className="text-brand-red text-sm font-semibold hover:underline px-3"
                            onClick={() => { setDiscount(0); setCoupon(''); sessionStorage.removeItem('scm_checkout_discount'); sessionStorage.removeItem('scm_checkout_coupon'); }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex bg-white border border-cream-mid rounded-xl overflow-hidden focus-within:border-saffron focus-within:ring-1 focus-within:ring-saffron transition-all">
                          <input 
                            type="text" 
                            className="flex-grow px-4 py-3 text-sm text-charcoal focus:outline-none uppercase" 
                            placeholder="ENTER CODE" 
                            value={coupon} 
                            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          />
                          <button 
                            className="bg-charcoal text-white px-6 font-semibold text-sm hover:bg-gray-800 transition-colors"
                            onClick={() => applyCoupon()}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                      
                      {/* First Order Offer */}
                      {discount === 0 && (
                        <div className="mt-2 flex items-center justify-between bg-saffron/10 border border-saffron/30 rounded-lg p-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-saffron uppercase tracking-wider">First Order?</span>
                            <span className="text-sm font-medium text-charcoal">Use code <strong className="text-charcoal font-bold bg-white px-1 py-0.5 rounded border border-cream-mid">PEHLADABBA</strong></span>
                          </div>
                          <button 
                            onClick={() => applyCoupon('PEHLADABBA')}
                            className="text-xs font-bold bg-white border border-saffron text-saffron px-3 py-1.5 rounded hover:bg-saffron hover:text-white transition-colors"
                          >
                            Apply Now
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Totals */}
                    <div className="flex justify-between items-center text-charcoal">
                    <span className="font-medium">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-charcoal">
                    <span className="font-medium">Shipping</span>
                    <span className="font-semibold text-green-700">Calculated at checkout</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="font-semibold flex items-center gap-2"><ShieldCheck size={16} /> Discount applied</span>
                      <span className="font-bold">- {formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-cream-dark mt-2">
                    <span className="font-playfair text-2xl font-bold text-charcoal">Total</span>
                    <span className="font-playfair text-3xl font-bold text-brand-red">
                      {formatPrice(Math.max(0, subtotal - discount))}
                    </span>
                  </div>
                  
                  <button 
                    className="w-full mt-4 bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg"
                    onClick={proceedToCheckout}
                  >
                    <Lock size={18} /> Proceed to Checkout
                  </button>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-col gap-3 mt-6 p-4 bg-cream rounded-xl border border-cream-dark text-xs font-medium text-brown">
                    <div className="flex items-center gap-2 justify-center text-green-700 mb-1">
                      <ShieldCheck size={16} /> 100% Secure Checkout
                    </div>
                    <div className="flex justify-center items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1.5"><Truck size={14} /> Fast Delivery</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          </>
        )}
      </div>
    </div>
  );
}
