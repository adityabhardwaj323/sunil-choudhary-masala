'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    // Matches old site behaviour: client-side only confirmation, no backend endpoint.
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="py-20 px-8 bg-charcoal relative overflow-hidden">
      <FadeIn>
      <div className="max-w-[560px] mx-auto text-center relative z-10 flex flex-col items-center">
        <span className="font-kalam text-saffron text-base mb-2.5 block">✦ Stay Connected</span>
        <h2 className="font-playfair text-[28px] md:text-[44px] font-bold text-white mb-4">
          Get Recipes &amp; Exclusive Offers
        </h2>
        <p className="text-cream-mid text-base leading-relaxed mb-2">
          Subscribe and be the first to know about new products, seasonal offers, and authentic
          Rajasthani recipes from our kitchen.
        </p>

        <div className="flex gap-3 mt-6 flex-wrap justify-center w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 min-w-[200px] px-[18px] py-3.5 rounded-lg border-2 border-white/15 bg-white/[0.07] text-white text-sm placeholder:text-white/40 outline-none focus:border-saffron transition-colors"
          />
          <button
            onClick={handleSubscribe}
            className="bg-brand-red hover:bg-saffron text-white rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2"
          >
            {subscribed ? 'Subscribed!' : 'Subscribe'}
            <Send size={16} />
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">
          We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </FadeIn>
    </section>
  );
}
