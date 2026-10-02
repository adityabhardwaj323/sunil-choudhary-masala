import os
import re

FRONTEND_DIR = 'd:/sunil-choudhary-masala/scm-frontend'

# 1. Create FreeShippingBar.tsx
shipping_bar_code = """'use client';

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
"""

components_cart_dir = os.path.join(FRONTEND_DIR, 'components/cart')
os.makedirs(components_cart_dir, exist_ok=True)
with open(os.path.join(components_cart_dir, 'FreeShippingBar.tsx'), 'w', encoding='utf-8') as f:
    f.write(shipping_bar_code)

# 2. Add it to Cart page
cart_page_path = os.path.join(FRONTEND_DIR, 'app/(customer)/cart/page.tsx')
with open(cart_page_path, 'r', encoding='utf-8') as f:
    cart_content = f.read()

import_stmt = "import FreeShippingBar from '@/components/cart/FreeShippingBar';\n"
if 'FreeShippingBar' not in cart_content:
    cart_content = cart_content.replace("import { AnimatePresence, motion } from 'framer-motion';", "import { AnimatePresence, motion } from 'framer-motion';\n" + import_stmt)

if 'FreeShippingBar subtotal' not in cart_content:
    cart_content = cart_content.replace("{/* Left: Cart Items */}", "<FreeShippingBar subtotal={subtotal} />\n              {/* Left: Cart Items */}")


summary_shipping_html = """<div className="flex justify-between items-center text-charcoal">
                    <span className="font-medium">Shipping</span>
                    <span className="font-semibold text-green-700">Calculated at checkout</span>
                  </div>"""
cart_content = re.sub(r'<div className=\"flex justify-between items-center text-charcoal\">\s*<span className=\"font-medium\">Shipping</span>\s*<span className=\"font-semibold text-green-700\">Free</span>\s*</div>', summary_shipping_html, cart_content)

with open(cart_page_path, 'w', encoding='utf-8') as f:
    f.write(cart_content)
print("Cart page updated with Free Shipping Bar")
