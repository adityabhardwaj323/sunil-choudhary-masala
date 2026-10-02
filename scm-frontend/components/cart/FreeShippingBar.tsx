'use client';

import React, { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const [threshold, setThreshold] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.deliveryRanges) {
          // Find the lowest threshold where charge is 0
          const freeRange = data.deliveryRanges.find((r: any) => r.charge === 0);
          if (freeRange) {
            setThreshold(freeRange.minOrderValue);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (threshold === null) return null;

  const remaining = threshold - subtotal;
  const progress = Math.min(100, Math.max(0, (subtotal / threshold) * 100));
  const isFree = remaining <= 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-cream-dark shadow-sm mb-6 flex flex-col gap-3">
      <div className="flex justify-between items-center text-sm font-semibold text-charcoal">
        <span className="flex items-center gap-2">
          <Truck size={16} className={isFree ? 'text-green-600' : 'text-brand-red'} /> 
          {isFree ? (
            <span className="text-green-700">🎉 FREE SHIPPING UNLOCKED</span>
          ) : (
            <span>{formatPrice(remaining)} more for <strong className="text-brand-red uppercase">Free Shipping</strong></span>
          )}
        </span>
      </div>
      <div className="w-full bg-cream-dark h-2.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${isFree ? 'bg-green-500' : 'bg-brand-red'}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
