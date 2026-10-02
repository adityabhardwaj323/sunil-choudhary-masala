'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How long do SCM spices stay fresh?',
    a: 'Our spices are packed fresh at our grinding mill. For the best aroma and flavor, please check the best before date on the packet. Always store in a cool, dry place away from direct sunlight.'
  },
  {
    q: 'Are your spices pure?',
    a: 'We pride ourselves on providing high quality spices. We source carefully and do not use added artificial colors in our premium masalas.'
  },
  {
    q: 'How long does shipping take?',
    a: 'Shipping timelines vary by destination. Please check the available delivery information during checkout.'
  },
  {
    q: 'Do you accept returns?',
    a: 'Yes, we have an easy return policy for sealed products. If there is any issue with the product quality, please reach out to our WhatsApp support.'
  }
];

export default function ProductFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="mt-16 bg-cream-dark p-8 md:p-12 rounded-3xl border border-cream-mid max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <HelpCircle className="text-saffron" size={28} />
        <h3 className="font-playfair text-3xl font-bold text-charcoal">Common Questions</h3>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-cream overflow-hidden">
            <button 
              className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-charcoal hover:bg-cream-dark/50 transition-colors"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              {faq.q}
              <ChevronDown size={20} className={`text-saffron transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-5 text-brown leading-relaxed border-t border-cream-dark pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
