'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Copy, Check } from 'lucide-react';
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
    <section className="py-20 relative overflow-hidden bg-brand-red">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-charcoal rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
      
      <FadeIn className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center flex flex-col items-center text-white">
          <span className="font-kalam text-saffron text-xl mb-4 tracking-wider">✦ Welcome Offer</span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your First Order<br />Deserves a Treat!
          </h2>
          <p className="text-cream text-lg md:text-xl max-w-2xl mb-10 opacity-90">
            Use the code below at checkout and get 10% off your very first order. No minimum required. Experience authentic Rajasthani flavour today.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full max-w-md mx-auto mb-8 shadow-xl">
            <div className="flex items-center justify-between bg-white rounded-xl overflow-hidden p-2">
              <span className="font-mono text-2xl font-bold text-charcoal tracking-widest px-4">{code}</span>
              <button 
                onClick={handleCopy}
                className="bg-cream-dark hover:bg-saffron hover:text-white transition-colors text-charcoal font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
              >
                {copied ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy Code</>}
              </button>
            </div>
          </div>
          
          <Link href="/shop">
            <Button variant="primary" className="bg-white text-brand-red hover:bg-cream-dark border-none shadow-lg hover:shadow-xl px-10 py-6 text-lg font-bold flex items-center gap-3 group">
              <ShoppingBag size={20} className="group-hover:-translate-y-1 transition-transform" />
              Shop & Use Code
            </Button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
