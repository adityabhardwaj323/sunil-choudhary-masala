'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { 
  Loader2, AlertTriangle, ArrowLeft, RefreshCw, XCircle, Info, 
  MapPin, Receipt, Package, Truck, CheckCircle2, Circle
} from 'lucide-react';

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
  alternatePhone?: string;
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
  couponCode?: string;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  refundStatus?: string;
  trackingNumber?: string;
  statusHistory?: StatusHistoryItem[];
}

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: React.ElementType }> = {
  Processing: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Package },
  Confirmed: { color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: CheckCircle2 },
  Packed: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Package },
  Shipped: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Truck },
  'Out for Delivery': { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Truck },
  Delivered: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  Cancelled: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
};

const STANDARD_STAGES = [
  'Processing',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function OrderDetailsPage() {
  const params = useParams();
  const orderIdParam = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetails = useCallback(async (isRefresh = false) => {
    if (!orderIdParam) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(orderIdParam)}`);

      if (!res.ok) {
          if (res.status === 401) {
            window.location.href = '/login?redirect=' + encodeURIComponent('/account/orders/' + orderIdParam);
            return;
          }
          
          const data = await res.json().catch(() => ({}));
          
          if (res.status === 403) {
            throw new Error(data.message || 'Unauthorized. You do not have permission to view this order.');
          }
          if (res.status === 404) {
            throw new Error(data.message || 'Order not found. Please check your Order ID.');
          }
          if (res.status >= 500) {
            throw new Error('Server error while fetching order details.');
          }
          
          throw new Error(data.message || `Could not find order ${orderIdParam}`);
        }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderIdParam]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

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
      fetchOrderDetails(true);
    } catch (err: any) {
      alert(err.message || 'Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
        <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
        <p className="text-brown font-medium text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex flex-col items-center gap-3 border border-red-200 shadow-sm text-center">
        <AlertTriangle size={32} />
        <h3 className="font-bold text-lg">Couldn't load order details</h3>
        <p>{error || 'Order not found.'}</p>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            className="px-6 py-2 bg-white text-red-700 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
            onClick={() => fetchOrderDetails(false)}
          >
            <RefreshCw size={16} /> Retry
          </button>
          <Link href="/account/orders" className="px-6 py-2 bg-red-700 text-white rounded-xl font-bold shadow-md hover:bg-red-800 transition-colors">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCancellable = ['Processing', 'Confirmed', 'Packed'].includes(
    order.orderStatus
  );
  
  const statusConfig = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG['Processing'];
  const StatusIcon = statusConfig.icon;
  
  const addr = order.shippingAddress || {};
  const historyList = order.statusHistory || [];
  const historyMap: Record<string, StatusHistoryItem> = {};
  historyList.forEach((h) => {
    historyMap[h.status] = h;
  });

  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStageIndex = STANDARD_STAGES.indexOf(order.orderStatus);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/account/orders"
          className="text-brand-red font-semibold flex items-center gap-2 hover:text-red-800 transition-colors text-sm bg-red-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        
        <div className="flex items-center gap-3">
          {isCancellable && (
            <button
              type="button"
              className="text-red-600 bg-white border border-red-200 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              <XCircle size={16} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          <button
            type="button"
            className="text-charcoal bg-white border border-cream-dark px-4 py-2 rounded-xl font-semibold text-sm hover:bg-cream flex items-center gap-2 transition-colors disabled:opacity-50"
            onClick={() => fetchOrderDetails(true)}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-1">Order {order.orderId}</h1>
        <p className="text-brown">Placed on {formatDateTime(order.createdAt)}</p>
      </div>

      {!isCancellable && !isCancelled && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-3 border border-amber-200">
          <Info className="flex-shrink-0 mt-0.5 text-amber-600" size={18} />
          <p className="text-sm font-medium">Cancellation is no longer available because this order has been dispatched.</p>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-cream-dark bg-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-charcoal text-lg">{order.orderId}</div>
            <div className="text-sm text-brown mt-0.5">Date: {formatDateTime(order.createdAt)}</div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-bold w-fit ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon size={16} />
            {order.orderStatus}
          </div>
        </div>

        <div className="p-5 md:p-6 bg-white">
          <div className="flex flex-col gap-4">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm md:text-base border-b border-cream-dark pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xl shrink-0">🌶️</span>
                  <span className="font-medium text-charcoal">
                    {item.name}
                    <span className="text-gray-500 font-normal ml-2 text-sm">{item.weight ? `· ${item.weight}` : ''}</span>
                    <span className="ml-2 font-semibold text-brand-red text-sm">× {item.quantity || 1}</span>
                  </span>
                </div>
                <span className="font-bold text-charcoal shrink-0 ml-4">
                  {formatPrice(item.price * (item.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 md:p-8">
          <h4 className="font-bold text-charcoal text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-saffron" size={20} />
            Shipping Address
          </h4>
          <div className="text-sm text-brown leading-relaxed bg-cream/30 p-5 rounded-xl border border-cream-dark/50">
            <strong className="text-charcoal text-base block mb-1">
              {addr.firstName || ''} {addr.lastName || ''}
            </strong>
            {addr.addressLine1 || ''}
            {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
            <br />
            {addr.city || ''}
            {addr.state ? `, ${addr.state}` : ''} {addr.pincode || ''}
            <br />
            <span className="inline-block mt-2 font-medium">
              Phone: {addr.phone || '—'}
              {addr.alternatePhone ? ` / ${addr.alternatePhone}` : ''}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 md:p-8">
          <h4 className="font-bold text-charcoal text-lg mb-4 flex items-center gap-2">
            <Receipt className="text-saffron" size={20} />
            Payment Summary
          </h4>
          <div className="flex flex-col gap-3 text-sm bg-cream/30 p-5 rounded-xl border border-cream-dark/50">
            <div className="flex justify-between items-center text-brown">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-brown">
              <span>Shipping</span>
              <span className="font-medium text-charcoal">
                {order.shippingCharge
                  ? formatPrice(order.shippingCharge)
                  : 'Free'}
              </span>
            </div>
            {!!order.discount && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatPrice(order.discount)}
                  {order.couponCode ? ` (${order.couponCode})` : ''}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-cream-dark/80 mt-1">
              <span className="font-bold text-charcoal">Total Amount</span>
              <span className="font-bold text-charcoal text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
            
            <div className="pt-3 border-t border-cream-dark/80 mt-1 flex flex-col gap-2">
              <div className="flex justify-between items-center text-brown text-xs">
                <span>Payment Method</span>
                <span className="font-semibold text-charcoal">{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between items-center text-brown text-xs">
                <span>Payment Status</span>
                <span className="font-semibold text-charcoal">{order.paymentStatus || 'Pending'}</span>
              </div>
              
              {isCancelled && order.refundStatus && order.refundStatus !== 'NotRequired' && (
                <div className="flex justify-between items-center text-brown text-xs">
                  <span>Refund Status</span>
                  <span className={`font-semibold ${
                    (order.refundStatus === 'Processing' || order.refundStatus === 'Failed') ? 'text-saffron' : 'text-green-600'
                  }`}>
                    {order.refundStatus === 'Processing' ? 'Refund Processing' : 
                     order.refundStatus === 'Failed' ? 'Failed (Contact Support)' : 
                     order.refundStatus === 'Refunded' ? 'Refund Processed' : 
                     order.refundStatus}
                  </span>
                </div>
              )}
              
              {order.trackingNumber && (
                <div className="flex justify-between items-center text-brown text-xs bg-red-50 p-2 rounded border border-red-100">
                  <span className="text-brand-red font-semibold">Tracking Number</span>
                  <span className="font-bold text-charcoal tracking-wide">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Order Timeline */}
      <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-playfair text-2xl font-bold text-charcoal">Order Timeline</h2>
          {isCancelled && (
            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Order Cancelled
            </span>
          )}
        </div>
        
        <div>
          {isCancelled ? (
            <div className="flex flex-col gap-6">
              <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex items-start gap-4 shadow-sm">
                <XCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                <div>
                  <strong className="text-red-800 text-base block mb-1">Order Cancelled</strong>
                  <p className="text-sm text-red-700/80">
                    This order has been cancelled and is no longer being processed.
                  </p>
                </div>
              </div>
              
              <div className="relative border-l-2 border-cream-dark ml-6 pl-8 py-2 flex flex-col gap-8">
                {historyList.map((h, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[41px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      i === historyList.length - 1 
                        ? 'bg-brand-red border-brand-red text-white shadow-[0_0_0_4px_rgba(181,57,10,0.1)]' 
                        : 'bg-white border-brand-red text-brand-red'
                    }`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal text-base">{h.status}</h3>
                      <div className="text-xs text-gray-500 font-medium mb-1">{formatDateTime(h.date)}</div>
                      {h.note && <p className="text-sm text-brown mt-1 bg-cream/30 p-2 rounded-lg inline-block border border-cream-dark/50">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative border-l-2 border-cream-dark ml-6 pl-8 py-2 flex flex-col gap-8">
              {STANDARD_STAGES.map((stage, i) => {
                const hist = historyMap[stage];
                const isDone = !!hist || i < currentStageIndex;
                const isCurrent = stage === order.orderStatus;
                
                // Icon based on status
                let StageIcon = Circle;
                if (isDone) StageIcon = CheckCircle2;
                if (isCurrent) StageIcon = Package; // Or appropriate icon for current

                return (
                  <div key={stage} className={`relative ${!isDone && !isCurrent ? 'opacity-50' : ''}`}>
                    <div className={`absolute -left-[41px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent 
                        ? 'bg-brand-red border-brand-red text-white shadow-[0_0_0_4px_rgba(181,57,10,0.1)]' 
                        : isDone 
                          ? 'bg-white border-brand-red text-brand-red' 
                          : 'bg-white border-gray-300 text-gray-300'
                    }`}>
                      <StageIcon size={20} />
                    </div>
                    
                    {/* Make the connecting line colored if this step is done */}
                    {isDone && !isCurrent && (
                      <div className="absolute -left-[33px] top-10 w-[2px] h-[calc(100%+32px)] bg-brand-red -z-10"></div>
                    )}
                    
                    <div>
                      <h3 className={`font-bold text-base ${isCurrent ? 'text-brand-red' : 'text-charcoal'}`}>{stage}</h3>
                      {hist ? (
                        <>
                          <div className="text-xs text-gray-500 font-medium mb-1">{formatDateTime(hist.date)}</div>
                          {hist.note && <p className="text-sm text-brown mt-1 bg-cream/30 p-2 rounded-lg inline-block border border-cream-dark/50">{hist.note}</p>}
                        </>
                      ) : !isCurrent ? (
                        <p className="text-sm text-gray-400 mt-1">Pending</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
