'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderIdParam) return;
    
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${orderIdParam}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderIdParam]);

  if (loading) {
    return <div className="p-8 text-center text-brown"><Loader2 size={24} className="animate-spin" /> Loading...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center text-red">
        <h2 className="text-xl mb-4">Order Not Found</h2>
        <Link href="/admin/orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    );
  }

  // Reuse the logic from the modal in the main page
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-brown hover:text-red flex items-center gap-2 mb-2 font-semibold">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <h1 className="font-display text-2xl font-bold text-charcoal">Order {order.orderId}</h1>
          <p className="text-sm text-brown mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div>
          <span className="badge badge-blue text-sm px-3 py-1">{order.orderStatus}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Order Details</div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cream p-4 rounded-xl">
              <h3 className="text-xs uppercase font-bold text-brown mb-2">Customer</h3>
              <div className="font-semibold">{order.user?.firstName} {order.user?.lastName}</div>
              <div className="text-sm text-brown">{order.user?.email}</div>
              <div className="text-sm text-brown">{order.shippingAddress?.phone || order.user?.phone || "No phone number"}</div>
            </div>
            <div className="bg-cream p-4 rounded-xl">
              <h3 className="text-xs uppercase font-bold text-brown mb-2">Shipping Address</h3>
              <div className="text-sm text-brown leading-relaxed">
                {order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </div>
            </div>
          </div>
          
          <h3 className="text-xs uppercase font-bold text-brown mt-6 mb-3">Items</h3>
          <div className="flex flex-col gap-2">
            {(order.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-cream rounded-lg text-sm">
                <span><strong>{item.name}</strong> ({item.weight}) x {item.quantity}</span>
                <span className="font-bold text-red">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-cream-dark p-4 rounded-xl text-sm">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{order.subtotal || order.totalAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="text-green">{order.shippingCharge ? `₹${order.shippingCharge}` : 'FREE'}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between mb-2">
                <span>Discount</span>
                <span className="text-green">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between mt-3 pt-3 border-t border-cream-mid font-bold text-base">
              <span>Total</span>
              <span className="text-red">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
