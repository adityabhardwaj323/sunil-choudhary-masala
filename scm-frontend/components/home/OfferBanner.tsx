'use client';

import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export default function OfferBanner() {
  const [copied, setCopied] = useState(false);
  const code = "PEHLADABBA";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-14 md:py-16 bg-brand-red relative overflow-hidden">
      <FadeIn className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between text-white gap-8 md:gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <span className="font-body uppercase tracking-[0.2em] text-[11px] md:text-xs font-semibold text-saffron mb-3 block">
              WELCOME OFFER
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] font-bold mb-3 leading-tight">
              10% Off Your First Order
            </h2>
            <p className="font-body text-cream/90 text-sm md:text-base max-w-md mx-auto md:mx-0">
              Experience authentic Rajasthani flavour. Apply the code below at checkout.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end flex-shrink-0 w-full md:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto gap-4 bg-black/15 p-1.5 pl-5 rounded-md mb-4 border border-white/10">
              <div className="flex flex-col items-start pr-2">
                <span className="text-[10px] uppercase tracking-wider text-white/70 mb-0.5">Use code:</span>
                <span className="font-mono text-xl md:text-2xl font-bold tracking-widest leading-none">{code}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-brand-red hover:bg-cream-dark transition-colors text-sm font-semibold py-3 px-5 rounded flex items-center justify-center"
                aria-label="Copy discount code"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            <Link href="/shop" className="w-full md:w-auto">
              <button className="w-full bg-charcoal text-white hover:bg-black transition-colors font-body font-semibold tracking-wide text-sm py-4 px-8 rounded flex items-center justify-center">
                SHOP & USE CODE
              </button>
            </Link>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
