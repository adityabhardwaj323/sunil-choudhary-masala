'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Subscription failed. Please try again.');
      }
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
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

        {status === 'success' ? (
          <div className="mt-6 flex items-center gap-2 bg-green-900/40 border border-green-600/40 text-green-300 px-6 py-4 rounded-lg font-semibold text-sm">
            ✅ You&apos;re subscribed! Welcome to the SCM community.
          </div>
        ) : (
          <>
            <div className="flex gap-3 mt-6 flex-wrap justify-center w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="Enter your email address"
                disabled={status === 'loading'}
                className="flex-1 min-w-[200px] px-[18px] py-3.5 rounded-lg border-2 border-white/15 bg-white/[0.07] text-white text-sm placeholder:text-white/40 outline-none focus:border-saffron transition-colors disabled:opacity-60"
              />
              <button
                onClick={handleSubscribe}
                disabled={status === 'loading'}
                className="bg-brand-red hover:bg-saffron text-white rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                <Send size={16} />
              </button>
            </div>
            {status === 'error' && (
              <p className="mt-3 text-red-400 text-sm font-medium">{errorMsg}</p>
            )}
          </>
        )}
        <p className="mt-3 text-xs text-white/35">
          We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </FadeIn>
    </section>
  );
}
