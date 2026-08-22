'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { CheckCircle, Home, Info, Loader2, Store } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-16 px-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full p-8 md:p-12 text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-brand-green" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-charcoal mb-3">Order Placed!</h1>
        <p className="text-brown mb-6">
          Thank you for your order. Your masalas will be prepared with love and shipped to you soon.
        </p>

        {orderId && (
          <div className="bg-cream rounded-lg p-4 mb-6 border border-cream-dark">
            <div className="text-sm text-brown mb-1">Order ID</div>
            <div className="text-xl font-bold text-charcoal font-mono tracking-wider">{orderId}</div>
            <div className="text-xs text-brown/70 mt-2">
              Save this ID to track your order.
            </div>
          </div>
        )}

        <div className="bg-saffron/10 rounded-lg p-4 mb-6 text-left text-sm text-charcoal border border-saffron/20">
          <div className="flex items-start gap-2">
            <Info size={16} className="mt-0.5 text-saffron shrink-0" />
            <div>
              <strong>What happens next?</strong>
              <ul className="mt-2 space-y-1 text-brown">
                <li>• We&apos;ll confirm your order via email/SMS</li>
                <li>• Your order will be packed fresh</li>
                <li>• You&apos;ll receive tracking info once shipped</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 bg-brand-red text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:bg-brand-red-dark hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Store size={16} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white text-charcoal border-2 border-cream-dark px-6 py-3.5 rounded-xl font-bold hover:bg-cream hover:border-brand-red/40 hover:text-brand-red transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-brown animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
