'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, PackageOpen, Store, ArrowRight, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderItem {
  name: string;
  weight?: string;
  price: number;
  quantity?: number;
  image?: string;
}

interface Order {
  _id?: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  items: OrderItem[];
  totalAmount: number;
}

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: React.ElementType }> = {
  'Processing': { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Package },
  'Confirmed': { color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: CheckCircle2 },
  'Packed': { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Package },
  'Shipped': { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Truck },
  'Out for Delivery': { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Truck },
  'Delivered': { color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  'Cancelled': { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
};

function fmtDate(iso: string) {
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function fmtMoney(n: number) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 401) {
        router.push('/login?redirect=/account/orders');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.orders || [];
      setOrders(list);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-3xl font-bold text-charcoal">My Orders</h2>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
          <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
          <p className="text-brown font-medium text-lg">Loading your orders...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-start gap-3 border border-red-200 shadow-sm">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1">Couldn't load your orders</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-cream-dark rounded-2xl shadow-sm">
          <PackageOpen className="text-gray-300 mb-4" size={64} />
          <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">No orders yet</h3>
          <p className="text-brown mb-8">When you place an order, it will show up here.</p>
          <Link href="/shop" className="bg-brand-red text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-red-800 hover:shadow-lg transition-all flex items-center gap-2">
            <Store size={20} /> Start Shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-5">
          {orders.map((o) => {
            const statusConfig = STATUS_CONFIG[o.orderStatus] || STATUS_CONFIG['Processing'];
            const StatusIcon = statusConfig.icon;
            const items = o.items || [];
            const topItems = items.slice(0, 3);
            const moreCount = items.length - 3;

            return (
              <div 
                key={o.orderId || o._id} 
                className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden hover:border-brand-red/40 hover:shadow-md transition-all cursor-pointer group" 
                onClick={() => router.push(`/account/orders/${o.orderId || o._id}`)}
              >
                <div className="p-5 md:p-6 border-b border-cream-dark bg-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-charcoal text-lg">{o.orderId}</div>
                    <div className="text-sm text-brown mt-0.5">Placed on {fmtDate(o.createdAt)}</div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold w-fit ${statusConfig.bg} ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    {o.orderStatus}
                  </div>
                </div>
                
                <div className="p-5 md:p-6 bg-white">
                  <div className="flex flex-col gap-3">
                    {topItems.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm md:text-base">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-xl shrink-0">{it.image ? '' : '🌶️'}</span>
                          <span className="font-medium text-charcoal truncate">
                            {it.name}
                            <span className="text-gray-500 font-normal ml-2 text-sm">{it.weight ? `· ${it.weight}` : ''}</span>
                            {it.quantity && it.quantity > 1 ? (
                              <span className="ml-2 font-semibold text-brand-red text-sm">× {it.quantity}</span>
                            ) : null}
                          </span>
                        </div>
                        <span className="font-bold text-charcoal shrink-0 ml-4">{fmtMoney(it.price * (it.quantity || 1))}</span>
                      </div>
                    ))}
                    {moreCount > 0 && (
                      <div className="text-sm font-medium text-gray-500 pt-2">
                        + {moreCount} more item(s)
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 md:p-6 border-t border-cream-dark bg-cream/10 flex items-center justify-between">
                  <span className="text-brand-red font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    View Order Details <ArrowRight size={16} />
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Total</span>
                    <span className="font-bold text-lg text-charcoal">{fmtMoney(o.totalAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
