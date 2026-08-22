'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import { formatPrice, scmImgUrl } from '@/lib/utils';
import { useCartWishlist } from '@/context/CartWishlistContext';

import { MapPin, CreditCard, Banknote, ShieldCheck, Lock, Check, Loader2, AlertTriangle, Store, Plus } from 'lucide-react';

// Dynamically import MapPicker since Leaflet cannot be SSR'd
import LocationDetector from '@/components/checkout/LocationDetector';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { refreshCart } = useCartWishlist();
  const [cart, setCart] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: 'Jaipur', state: 'Rajasthan', pincode: '', lat: 0, lng: 0
  });

  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'COD'>('Online');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const storedCoupon = sessionStorage.getItem('scm_checkout_coupon');
    if (storedCoupon) setCouponCode(storedCoupon);

    const storedDiscount = sessionStorage.getItem('scm_checkout_discount');
    if (storedDiscount) setCouponDiscount(Number(storedDiscount) || 0);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/cart').then(r => {
        if (!r.ok) {
          if (r.status === 401 || r.status === 403) {
            setAuthRequired(true);
            throw new Error('AUTH_REQUIRED');
          }
          throw new Error('Failed to load cart');
        }
        return r.json();
      }),
      fetch('/api/settings/public').then(r => r.json()),
      fetch('/api/users/addresses').then(r => r.ok ? r.json() : [])
    ])
    .then(([cartData, settingsData, addressData]) => {
      setCart(cartData);
      setSettings(settingsData);
      setAddresses(addressData);
      const defaultAddr = addressData.find((a: any) => a.isDefault) || addressData[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setFormData(prev => ({
          ...prev,
          addressLine1: defaultAddr.addressLine1 || '',
          addressLine2: defaultAddr.addressLine2 || '',
          city: defaultAddr.city || 'Jaipur',
          state: defaultAddr.state || 'Rajasthan',
          pincode: defaultAddr.pincode || '',
          phone: defaultAddr.phone || prev.phone,
          lat: defaultAddr.latitude || prev.lat,
          lng: defaultAddr.longitude || prev.lng
        }));
      }
      setLoading(false);
    })
    .catch(err => {
      if (err.message === 'AUTH_REQUIRED') {
        setLoading(false);
      } else {
        setError(err.message);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    // Populate formData with logged in user profile if it's empty
    const userStr = localStorage.getItem('scm_user');
    if (userStr && !formData.firstName) {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          firstName: prev.firstName || user.firstName || '',
          lastName: prev.lastName || user.lastName || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || ''
        }));
      } catch(e) {}
    }
  }, [formData.firstName]);

    const handleLocationSelect = (lat: number, lng: number, addressDetails?: any) => {
    if (!addressDetails) return;
    
    // In checkout, we need to switch to 'new' form
    if (typeof setSelectedAddressId === 'function') {
      setSelectedAddressId('new');
    }

    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      addressLine1: addressDetails.addressLine1 || '',
      addressLine2: addressDetails.addressLine2 || '',
      city: addressDetails.city || '',
      state: addressDetails.state || '',
      pincode: addressDetails.pincode || ''
    }));
  };

  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setFormData(prev => ({
        ...prev,
        addressLine1: '',
        addressLine2: '',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '',
        lat: 0,
        lng: 0
      }));
    } else {
      const addr = addresses.find(a => a._id === addrId);
      if (addr) {
        setFormData(prev => ({
          ...prev,
          addressLine1: addr.addressLine1 || '',
          addressLine2: addr.addressLine2 || '',
          city: addr.city || 'Jaipur',
          state: addr.state || 'Rajasthan',
          pincode: addr.pincode || '',
          phone: addr.phone || prev.phone,
          lat: addr.latitude || prev.lat,
          lng: addr.longitude || prev.lng
        }));
      }
    }
  };

  const calculateDeliveryCharge = () => {
    if (!cart || !settings) return 0;
    const subtotal = cart.items?.reduce((s: number, i: any) => s + (i.price * i.quantity), 0) || 0;
    const ranges = settings.deliveryRanges || [];
    for (const r of ranges) {
      const max = r.maxOrderValue === null ? Infinity : r.maxOrderValue;
      if (subtotal >= r.minOrderValue && subtotal <= max) {
        return r.charge;
      }
    }
    return 0;
  };

  const subtotalEstimate = cart?.items?.reduce((s: number, i: any) => s + (i.price * i.quantity), 0) || 0;
  const deliveryCharge = calculateDeliveryCharge();
  const codCharge = paymentMethod === 'COD' && settings?.codEnabled ? (settings.codCharge || 0) : 0;
  const grandTotal = Math.max(0, subtotalEstimate + deliveryCharge + codCharge - couponDiscount);

  const buildShippingAddress = () => ({
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    email: formData.email,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    latitude: formData.lat || undefined,
    longitude: formData.lng || undefined
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    
    // Manual validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      setOrderError('Please fill all required fields (marked *).');
      return;
    }

    setPlacing(true);

    try {
      if (paymentMethod === 'COD') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress: buildShippingAddress(),
            paymentMethod: 'COD',
            couponCode: couponCode || undefined
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to place order');

        sessionStorage.removeItem('scm_checkout_discount');
        sessionStorage.removeItem('scm_checkout_coupon');
        refreshCart();
        router.push(`/order-success?orderId=${encodeURIComponent(data.orderId)}`);
      } else {
        const payRes = await fetch('/api/orders/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'Online',
            couponCode: couponCode || undefined
          })
        });

        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.message || 'Could not initiate payment');

        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId || razorpayKeyId === 'your_razorpay_key_id') {
          throw new Error('Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID.');
        }

        if (!window.Razorpay) {
          throw new Error('Razorpay SDK not loaded. Please refresh and try again.');
        }

        const options = {
          key: razorpayKeyId,
          amount: payData.amount,
          currency: payData.currency || 'INR',
          name: 'Sunil Choudhary Masala',
          description: 'Order Payment',
          order_id: payData.id,
          handler: async function(response: any) {
            try {
              const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  shippingAddress: buildShippingAddress(),
                  paymentMethod: 'Online',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  couponCode: couponCode || undefined
                })
              });

              const orderData = await orderRes.json();
              if (!orderRes.ok) throw new Error(orderData.message || 'Payment succeeded but order creation failed. Contact support.');

              sessionStorage.removeItem('scm_checkout_discount');
              sessionStorage.removeItem('scm_checkout_coupon');
              refreshCart();
              router.push(`/order-success?orderId=${encodeURIComponent(orderData.orderId)}`);
            } catch (err: any) {
              setOrderError(err.message);
              setPlacing(false);
            }
          },
          modal: {
            ondismiss: function() {
              setPlacing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone,
            email: formData.email
          },
          theme: { color: '#B5390A' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function(response: any) {
          setOrderError(`Payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`);
          setPlacing(false);
        });
        rzp.open();
        return; 
      }
    } catch (err: any) {
      setOrderError(err.message);
    }
    setPlacing(false);
  };

  
      if (authRequired) {
        return (
          <div className="bg-cream min-h-screen py-12 px-6 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-cream-dark max-w-md w-full text-center">
              <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4">Login Required</h2>
              <p className="text-brown mb-8 text-lg">Please login to continue with your order.</p>
              <div className="flex flex-col gap-4">
                <Link href="/login?redirect=/checkout" className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-md">
                  Login
                </Link>
                <Link href="/register?redirect=/checkout" className="w-full bg-white text-charcoal py-3.5 rounded-xl font-bold border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="bg-cream min-h-screen pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="bg-charcoal text-cream py-8 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-playfair text-3xl font-bold">Secure Checkout</h1>
          <div className="flex items-center text-sm font-semibold tracking-wide">
            <div className="flex items-center text-saffron"><Check size={16} className="mr-1"/> Cart</div>
            <div className="w-8 h-px bg-gray-600 mx-2"></div>
            <div className="flex items-center text-white"><span className="w-5 h-5 rounded-full bg-saffron text-charcoal flex items-center justify-center text-xs mr-2">2</span> Delivery</div>
            <div className="w-8 h-px bg-gray-600 mx-2"></div>
            <div className="flex items-center text-gray-500"><span className="w-5 h-5 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center text-xs mr-2">3</span> Payment</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-brown gap-4">
            <Loader2 size={40} className="animate-spin text-saffron" />
            <p className="font-medium">Loading your checkout details&hellip;</p>
          </div>
        )}
        
        {!loading && error && (
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">Checkout Error</h3>
            <p className="text-brown mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-800 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (!cart || !cart.items || cart.items.length === 0) && (
          <div className="bg-white p-12 rounded-2xl border border-cream-dark shadow-sm flex flex-col items-center text-center max-w-2xl mx-auto my-12">
            <div className="w-24 h-24 bg-cream text-saffron rounded-full flex items-center justify-center mb-6">
              <Store size={48} />
            </div>
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-3">Your cart is empty</h3>
            <p className="text-brown mb-8 text-lg">You need items in your cart to checkout.</p>
            <Link href="/shop" className="bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg">
              <Store size={20} /> Browse Shop
            </Link>
          </div>
        )}

        {!loading && !error && cart && cart.items && cart.items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              {orderError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                  <p className="font-medium text-sm">{orderError}</p>
                </div>
              )}
              
              <form id="checkoutForm" onSubmit={handlePlaceOrder} className="flex flex-col gap-8">
                {/* ADDRESS SECTION */}
                <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden p-6 md:p-8">
                  <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6 flex items-center gap-3 pb-4 border-b border-cream-dark">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron">
                      <MapPin size={20} />
                    </div>
                    Delivery Address
                  </h2>

                  {addresses.length > 0 && (
                    <div className="mb-8">
                      <label className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4 block">Saved Addresses</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr: any) => (
                          <div
                            key={addr._id}
                            onClick={() => handleAddressSelect(addr._id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-brand-red bg-red-50/30' : 'border-cream-dark bg-white hover:border-saffron'}`}
                          >
                            <div className="font-bold text-charcoal mb-1 flex items-center justify-between">
                              {addr.label || 'Home'}
                              {selectedAddressId === addr._id && <Check size={18} className="text-brand-red" />}
                            </div>
                            <div className="text-sm text-brown leading-relaxed">
                              {addr.addressLine1}, {addr.city}
                              <br />{addr.state} - {addr.pincode}
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={() => handleAddressSelect('new')}
                          className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${selectedAddressId === 'new' ? 'border-brand-red bg-red-50/30 text-brand-red' : 'border-cream-dark bg-cream/50 text-charcoal hover:border-saffron'}`}
                        >
                          <Plus size={24} className="mb-2 opacity-70" />
                          <span className="font-semibold text-sm">Add New Address</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <>
<div className="mb-6">
    <LocationDetector onLocationSelect={handleLocationSelect} />
  </div>
  <div className="flex items-center gap-4 my-6">
    <div className="h-px bg-cream-dark flex-grow"></div>
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR ENTER ADDRESS MANUALLY</span>
    <div className="h-px bg-cream-dark flex-grow"></div>
  </div></>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">First Name *</label>
                      <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Sunil" required/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">Last Name *</label>
                      <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Sharma" required/>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">Phone Number *</label>
                      <input type="tel" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" required/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">Email Address</label>
                      <input type="email" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@email.com"/>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-sm font-medium text-charcoal">Address Line 1 *</label>
                    <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} placeholder="House/Flat No., Building, Street" required/>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-sm font-medium text-charcoal">Address Line 2</label>
                    <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} placeholder="Area, Colony, Landmark (optional)"/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">City *</label>
                      <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Jaipur" required/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">State *</label>
                      <select className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors bg-white appearance-none" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required>
                        <option>Rajasthan</option><option>Delhi</option><option>Maharashtra</option>
                        <option>Gujarat</option><option>Uttar Pradesh</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-charcoal">PIN Code *</label>
                      <input type="text" className="px-4 py-2.5 rounded-xl border border-cream-dark focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-colors" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="302001" maxLength={6} required/>
                    </div>
                  </div>
                </div>

                {/* PAYMENT SECTION */}
                <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden p-6 md:p-8">
                  <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6 flex items-center gap-3 pb-4 border-b border-cream-dark">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-saffron">
                      <CreditCard size={20} />
                    </div>
                    Payment Method
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    <div 
                      className={`relative p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all ${paymentMethod === 'Online' ? 'border-brand-red bg-red-50/30' : 'border-cream-dark bg-white hover:border-cream'}`}
                      onClick={() => setPaymentMethod('Online')}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${paymentMethod === 'Online' ? 'border-brand-red' : 'border-gray-300'}`}>
                        {paymentMethod === 'Online' && <div className="w-2.5 h-2.5 bg-brand-red rounded-full"></div>}
                      </div>
                      <div className="flex-grow">
                        <div className="font-bold text-charcoal text-lg">Pay Online</div>
                        <div className="text-sm text-brown mt-0.5">UPI, Cards, NetBanking via Razorpay</div>
                      </div>
                      <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center text-saffron flex-shrink-0">
                        <CreditCard size={24} />
                      </div>
                    </div>
                    
                    {settings?.codEnabled && (
                      <div 
                        className={`relative p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all ${paymentMethod === 'COD' ? 'border-brand-red bg-red-50/30' : 'border-cream-dark bg-white hover:border-cream'}`}
                        onClick={() => setPaymentMethod('COD')}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${paymentMethod === 'COD' ? 'border-brand-red' : 'border-gray-300'}`}>
                          {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-brand-red rounded-full"></div>}
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-charcoal text-lg">Cash on Delivery</div>
                          <div className="text-sm text-brown mt-0.5">Pay when your order arrives {(settings.codCharge || 0) > 0 ? <span className="text-brand-red font-medium">(₹{settings.codCharge} extra)</span> : ''}</div>
                        </div>
                        <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center text-saffron flex-shrink-0">
                          <Banknote size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* ORDER SUMMARY (RIGHT SIDE) */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-cream-dark">
                  <h2 className="font-playfair text-2xl font-bold text-charcoal">Order Summary</h2>
                </div>
                
                <div className="p-0">
                  <div className="max-h-64 overflow-y-auto p-6 flex flex-col gap-4 border-b border-cream-dark scrollbar-thin scrollbar-thumb-cream-dark">
                    {cart.items.map((item: any) => {
                      const p = item.product || {};
                      const imgUrl = (p.images && p.images[0]) ? scmImgUrl(p.images[0]) : '/asset_35.jpg';
                      return (
                        <div key={item._id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-lg border border-cream-dark bg-cream-dark overflow-hidden flex-shrink-0 relative">
                            <img src={imgUrl} className="w-full h-full object-cover mix-blend-multiply" alt={p.name} />
                            <div className="absolute -top-2 -right-2 bg-charcoal text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="font-bold text-charcoal text-sm line-clamp-1">{p.name || 'Product'}</div>
                            <div className="text-xs text-brown mt-0.5">{item.weight}</div>
                          </div>
                          <div className="font-bold text-charcoal flex-shrink-0 text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-charcoal text-sm">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotalEstimate)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-charcoal text-sm">
                      <span className="font-medium">Shipping</span>
                      <span className="font-semibold text-green-700">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span>
                    </div>
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-green-700 flex items-center gap-1.5"><ShieldCheck size={14}/> Discount {couponCode && `(${couponCode})`}</span>
                        <span className="font-bold text-green-700">- {formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    
                    {paymentMethod === 'COD' && codCharge > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-charcoal">COD Fee</span>
                        <span className="font-semibold text-brand-red">{formatPrice(codCharge)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-cream-dark mt-2">
                      <span className="font-playfair text-xl font-bold text-charcoal">Total</span>
                      <span className="font-playfair text-2xl font-bold text-brand-red">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    
                    <button 
                      form="checkoutForm"
                      type="submit"
                      disabled={placing}
                      className="w-full mt-4 bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {placing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <><Lock size={18} /> Place Order — {formatPrice(grandTotal)}</>
                      )}
                    </button>
                    
                    <p className="text-[11px] text-brown text-center mt-2 leading-relaxed">
                      By placing this order you agree to our 
                      <Link href="/terms" className="text-brand-red font-medium mx-1 hover:underline">Terms</Link> &amp; 
                      <Link href="/privacy" className="text-brand-red font-medium ml-1 hover:underline">Privacy Policy</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
