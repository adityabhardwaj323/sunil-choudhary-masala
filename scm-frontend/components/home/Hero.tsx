'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';

const slides = [
  {
    eyebrow: "✦ Since 1985 · Rajasthan",
    headline: (
      <>
        The True Taste of<br />
        <em className="text-gold-light not-italic">Rajasthani Masala</em>
      </>
    ),
    text: "Hand-picked spices, stone-ground the traditional way. Every batch dated. Every packet sealed with purity.",
    cta1: { label: "Shop Now", link: "/shop", icon: <ShoppingBag size={18} /> },
    cta2: { label: "Our Story", link: "/about", icon: <ArrowRight size={18} /> },
    image: "/images/hero_1_true_taste.jpg",
  },
  {
    eyebrow: "✦ 100% Natural · No Additives",
    headline: (
      <>
        Pure Spices,<br />
        <em className="text-gold-light not-italic">No Shortcuts</em>
      </>
    ),
    text: "No artificial colours. No preservatives. Just the real flavour of freshly ground Rajasthani spices — nothing more.",
    cta1: { label: "Explore Range", link: "/shop", icon: <ShoppingBag size={18} /> },
    cta2: { label: "Quality Promise", link: "/quality-standards", icon: <ArrowRight size={18} /> },
    image: "/images/hero_2_pure_spices.jpg",
  },
  {
    eyebrow: "✦ Signature Blends",
    headline: (
      <>
        Secret Blends from<br />
        <em className="text-gold-light not-italic">Three Generations</em>
      </>
    ),
    text: "Our special masala recipes have been passed down through the Choudhary family for over 35 years — now in your kitchen.",
    cta1: { label: "Best Sellers", link: "/shop", icon: <ShoppingBag size={18} /> },
    cta2: { label: "Gift Packs", link: "/shop", icon: <Gift size={18} /> },
    image: "/images/hero_3_secret_blends.jpg",
  },
  {
    eyebrow: "✦ First Order Special",
    headline: (
      <>
        Get 10% Off<br />
        <em className="text-gold-light not-italic">Your First Order</em>
      </>
    ),
    text: "Use code PEHLADABBA at checkout and experience authentic Rajasthani flavour delivered to your door.",
    cta1: { label: "Claim Offer", link: "/shop", icon: <ShoppingBag size={18} /> },
    cta2: null,
    image: "/images/hero_4_first_order.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative w-full h-[520px] md:h-[580px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative min-w-full h-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/20" />

            <div className="relative z-10 max-w-[600px] px-6 md:px-20">
              <FadeIn delay={0.2}>
              <span className="font-kalam text-gold-light text-base md:text-lg tracking-wide mb-3 block">
                {slide.eyebrow}
              </span>
              <h1 className="font-playfair text-[32px] md:text-[54px] text-white leading-[1.15] mb-4 font-bold">
                {slide.headline}
              </h1>
              <p className="text-white/85 text-base leading-relaxed mb-7 max-w-[440px]">
                {slide.text}
              </p>
              <div className="flex gap-3.5 flex-wrap">
                <Link href={slide.cta1.link}>
                  <Button variant="primary" className="flex items-center gap-2">
                    {slide.cta1.icon}
                    {slide.cta1.label}
                  </Button>
                </Link>
                {slide.cta2 && (
                  <Link href={slide.cta2.link}>
                    <Button
                      variant="secondary"
                      className="text-white border-white/60 hover:bg-white/15 hover:border-white hover:text-white flex items-center gap-2"
                    >
                      {slide.cta2.label}
                    </Button>
                  </Link>
                )}
              </div>
            </FadeIn>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-5 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-7 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
