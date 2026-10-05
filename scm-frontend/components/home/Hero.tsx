'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/motion/FadeIn';

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col md:flex-row bg-cream min-h-[100svh] md:min-h-[600px] lg:min-h-[85vh]">
      
      {/* TEXT AREA: Desktop Left, Mobile Top */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-16 md:py-24 z-10 flex-shrink-0">
        <FadeIn delay={0.1}>
          <span className="font-body text-brand-red uppercase tracking-[0.2em] text-[11px] md:text-xs font-semibold mb-4 block">
            AUTHENTIC RAJASTHANI SPICES
          </span>
        </FadeIn>
        <FadeIn delay={0.2}>
          <h1 className="font-display text-[40px] md:text-5xl lg:text-[64px] text-charcoal leading-[1.1] mb-6 font-bold">
            The taste of tradition,<br className="hidden md:block" />
            <span className="text-brand-red"> made for today.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="font-body text-charcoal/80 text-base md:text-lg leading-relaxed mb-10 max-w-[440px]">
            Carefully selected spices rooted in Rajasthan, crafted for everyday Indian cooking.
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <Link
              href="/shop"
              className="bg-brand-red text-white px-8 py-4 text-[15px] font-body font-semibold tracking-wide inline-flex items-center justify-center transition-colors hover:bg-charcoal w-full sm:w-auto"
            >
              SHOP SPICES
            </Link>
            <Link
              href="/about"
              className="text-charcoal font-body text-[15px] font-semibold tracking-wide inline-flex items-center gap-2 hover:text-brand-red transition-colors w-full sm:w-auto justify-center"
            >
              OUR STORY <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* IMAGE AREA: Desktop Right, Mobile Bottom */}
      <div className="w-full md:w-1/2 relative min-h-[45vh] md:min-h-full flex-grow">
        <Image
          src="/images/hero_1_true_taste.jpg"
          alt="Authentic Rajasthani Spices"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

    </section>
  );
}
