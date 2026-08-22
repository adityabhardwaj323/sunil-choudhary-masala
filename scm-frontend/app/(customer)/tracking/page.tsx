'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Package, Truck, CheckCircle2, Clock, XCircle, AlertCircle, Info, Phone, Mail, ChevronRight, FileText, CheckCircle, Home } from 'lucide-react';

interface OrderItem {
  name: string;
  weight?: string;
  price: number;
  quantity?: number;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
}

interface StatusHistoryItem {
  status: string;
  date: string;
  note?: string;
}

interface OrderDetail {
  _id?: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  discount?: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  refundStatus?: string;
  trackingNumber?: string;
  statusHistory?: StatusHistoryItem[];
}

const STATUS_CLASS_MAP: Record<string, string> = {
  Processing: 'bg-brown/10 text-brown border border-brown/20',
  Confirmed: 'bg-saffron/10 text-saffron border border-saffron/20',
  Packed: 'bg-gold/10 text-gold border border-gold/20',
  Shipped: 'bg-brand-red/10 text-brand-red border border-brand-red/20',
  'Out for Delivery': 'bg-brand-red/10 text-brand-red border border-brand-red/20',
  Delivered: 'bg-green/10 text-green border border-green/20',
  Cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const STAGE_ICONS: Record<string, any> = {
  Processing: FileText,
  Confirmed: CheckCircle,
  Packed: Package,
  Shipped: Truck,
  'Out for Delivery': Truck,
  Delivered: Home,
  Cancelled: XCircle,
};

const STANDARD_STAGES = [
  'Processing',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams?.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryOrderId);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(`/api/orders/track/${encodeURIComponent(queryOrderId)}`);
        if (!res.ok) {
          throw new Error('Please login to view this order.');
        }
        setAuthenticated(true);
        handleTrackOrder(queryOrderId);
      } catch {
        setAuthenticated(false);
        const redirectUrl = queryOrderId
          ? `/tracking?orderId=${encodeURIComponent(queryOrderId)}`
          : '/tracking';
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    };
    
    // Check if we can fetch tracking info to see if we're authenticated
    fetch('/api/auth/profile')
      .then(res => {
        if (!res.ok) throw new Error('Not auth');
        setAuthenticated(true);
        if (queryOrderId) {
          handleTrackOrder(queryOrderId);
        }
      })
      .catch(() => {
        setAuthenticated(false);
        const redirectUrl = queryOrderId
          ? `/tracking?orderId=${encodeURIComponent(queryOrderId)}`
          : '/tracking';
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      });
  }, [queryOrderId, router]);

  const handleTrackOrder = async (idToFetch: string) => {
    const cleaned = idToFetch.trim();
    if (!cleaned) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(cleaned)}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || `No order found with ID "${cleaned}"`
        );
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Could not retrieve tracking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const refundMsg =
      order.paymentMethod !== 'COD'
        ? '\nA full refund will be automatically initiated to your original payment method.'
        : '';

    const confirmMsg = `Are you sure you want to cancel this order?
Order ID: ${order.orderId}
Order Total: ₹${order.totalAmount}
Cancellation is free before dispatch.${refundMsg}`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setCancelling(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const targetId = order._id || order.orderId;
      const res = await fetch(`/api/orders/${encodeURIComponent(targetId)}/cancel`, {
        method: 'POST',
        headers,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }

      alert('Order cancelled successfully.');
      handleTrackOrder(order.orderId);
    } catch (err: any) {
      alert(err.message || 'Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      // Direct redirect to order details or fetch inline
      router.push(`/account/orders/${encodeURIComponent(orderIdInput.trim())}`);
    }
  };

  if (authenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-cream min-h-screen">
        <div className="w-12 h-12 border-4 border-cream-dark border-t-brand-red rounded-full animate-spin mb-4"></div>
        <p className="text-brown font-medium text-lg">Redirecting to login...</p>
      </div>
    );
  }

  const isCancellable = order
    ? ['Processing', 'Confirmed', 'Packed'].includes(order.orderStatus)
    : false;
  const isCancelled = order?.orderStatus === 'Cancelled';
  const statusClass = order
    ? STATUS_CLASS_MAP[order.orderStatus] || 'bg-brown/10 text-brown border border-brown/20'
    : '';
  const historyList = order?.statusHistory || [];
  const historyMap: Record<string, StatusHistoryItem> = {};
  historyList.forEach((h) => {
    historyMap[h.status] = h;
  });
  const currentStageIndex = order
    ? STANDARD_STAGES.indexOf(order.orderStatus)
    : -1;

  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-16 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        
        <div className="container-custom relative z-10 flex flex-col items-center text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-cream-mid max-w-xl text-lg">
            Enter your Order ID (e.g. SCM-849201) to view real-time status and shipment updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-lg flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="flex-1 bg-white rounded-full px-6 py-3.5 text-charcoal outline-none border-2 border-transparent focus:border-saffron focus:ring-4 focus:ring-saffron/20 transition-all font-medium"
              placeholder="Enter Order ID (e.g. SCM-849201)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              required
            />
            <button type="submit" className="bg-brand-red text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-red-800 transition-all flex items-center justify-center gap-2 sm:w-auto">
              Track <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="container-custom max-w-3xl mt-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-cream-dark shadow-sm">
            <div className="w-12 h-12 border-4 border-cream-dark border-t-brand-red rounded-full animate-spin mb-4"></div>
            <p className="text-brown font-medium text-lg">Fetching tracking information...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-3xl border border-cream-dark shadow-sm p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-brand-red mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-3">Order Not Found</h3>
            <p className="text-brown mb-8">{error}</p>
            <Link href="/account/orders" className="bg-charcoal text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors shadow-sm">
              View My Orders
            </Link>
          </div>
        )}

        {order && !loading && (
          <div className="flex flex-col gap-8">
            {/* Warning Message */}
            {!isCancellable && !isCancelled && (
              <div className="bg-cream-dark/30 border border-saffron/30 rounded-2xl p-4 flex items-start gap-3">
                <Info size={20} className="text-saffron shrink-0 mt-0.5" />
                <p className="text-brown text-sm font-medium">Cancellation is no longer available because this order has been dispatched.</p>
              </div>
            )}

            {/* Order Header Card */}
            <div className="bg-white rounded-3xl border border-cream-dark shadow-sm overflow-hidden">
              <div className="bg-cream-dark/20 p-5 md:p-6 border-b border-cream-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-playfair text-xl font-bold text-charcoal mb-1">Order {order.orderId}</div>
                  <div className="text-brown text-sm font-medium">
                    Placed on {formatDateTime(order.createdAt)}
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-3">
                  {isCancellable && (
                    <button
                      type="button"
                      className="text-brand-red border border-brand-red/30 hover:bg-red-50 font-bold px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                    >
                      <XCircle size={16} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusClass}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-5 md:p-6">
                <div className="space-y-3 mb-6">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shrink-0 text-xl border border-cream-dark">🌶️</div>
                      <div className="flex-1">
                        <div className="text-charcoal font-bold text-sm md:text-base">
                          {item.name}
                          {item.weight ? ` · ${item.weight}` : ''} <span className="text-brown font-medium">× {item.quantity || 1}</span>
                        </div>
                      </div>
                      <div className="font-bold text-charcoal">
                        {formatPrice(item.price * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-5 border-t border-cream-dark">
                  <Link
                    href={`/account/orders/${order.orderId}`}
                    className="text-saffron hover:text-brand-red font-bold flex items-center gap-1 transition-colors"
                  >
                    View Full Details in Account <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="bg-white rounded-3xl border border-cream-dark shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-cream-dark">
                <h2 className="font-playfair text-2xl font-bold text-charcoal">Order Progress</h2>
                {isCancelled && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
                    Order Cancelled
                  </span>
                )}
              </div>
              
              {isCancelled ? (
                <div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-4 mb-8">
                    <XCircle size={28} className="text-brand-red shrink-0" />
                    <div>
                      <strong className="text-brand-red text-lg font-bold block mb-1">Order Cancelled</strong>
                      <p className="text-brown text-sm">
                        This order has been cancelled and is no longer being processed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    {historyList.map((h, i) => {
                      const Icon = STAGE_ICONS[h.status] || XCircle;
                      const isLast = i === historyList.length - 1;
                      
                      return (
                        <div key={i} className="relative pb-8 last:pb-0">
                          {/* Line */}
                          {!isLast && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-brand-red/30"></div>
                          )}
                          
                          <div className="flex gap-6 relative">
                            {/* Circle */}
                            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center relative z-10 ${
                              isLast ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(181,57,10,0.4)]' : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                            }`}>
                              <Icon size={isLast ? 14 : 12} />
                            </div>
                            
                            {/* Content */}
                            <div className="-mt-1.5 flex-1">
                              <h3 className={`font-bold text-lg mb-1 ${isLast ? 'text-charcoal' : 'text-brown'}`}>{h.status}</h3>
                              <div className="text-sm text-gray-400 font-medium mb-1.5">{formatDateTime(h.date)}</div>
                              {h.note && <p className="text-brown text-sm bg-cream p-3 rounded-lg border border-cream-dark inline-block">{h.note}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="relative pl-6">
                  {STANDARD_STAGES.map((stage, i) => {
                    const hist = historyMap[stage];
                    const isDone = !!hist || i < currentStageIndex;
                    const isCurrent = stage === order.orderStatus;
                    const Icon = STAGE_ICONS[stage] || CheckCircle;
                    
                    return (
                      <div key={stage} className="relative pb-8 last:pb-0">
                        {/* Line */}
                        {i < STANDARD_STAGES.length - 1 && (
                          <div className={`absolute left-[11px] top-8 bottom-0 w-0.5 transition-colors duration-500 ${
                            isDone && !isCurrent ? 'bg-brand-red' : 'bg-cream-dark'
                          }`}></div>
                        )}
                        
                        <div className="flex gap-6 relative">
                          {/* Circle */}
                          <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center relative z-10 transition-colors duration-500 ${
                            isCurrent 
                              ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(181,57,10,0.4)]' 
                              : isDone 
                                ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' 
                                : 'bg-white border-2 border-cream-dark text-cream-dark'
                          }`}>
                            <Icon size={isCurrent ? 14 : 12} />
                          </div>
                          
                          {/* Content */}
                          <div className="-mt-1.5 flex-1">
                            <h3 className={`font-bold text-lg mb-1 transition-colors duration-500 ${
                              isCurrent ? 'text-charcoal font-playfair text-xl' : isDone ? 'text-charcoal' : 'text-gray-400'
                            }`}>{stage}</h3>
                            
                            {hist ? (
                              <>
                                <div className="text-sm text-gray-400 font-medium mb-1.5">
                                  {formatDateTime(hist.date)}
                                </div>
                                {hist.note && <p className="text-brown text-sm bg-cream p-3 rounded-lg border border-cream-dark inline-block">{hist.note}</p>}
                              </>
                            ) : isCurrent ? (
                              <p className="text-saffron text-sm font-medium mt-1">In progress...</p>
                            ) : (
                              <p className="text-gray-300 text-sm font-medium mt-1">Pending</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
