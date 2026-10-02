'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';

const slides = [
  {
    eyebrow: "Traditional Rajasthani Spices",
    headingText: "Authentic Rajasthani Masalas",
    headline: (
      <>
        Authentic Rajasthani<br />
        <em className="text-gold-light not-italic">Masalas</em>
      </>
    ),
    text: "Traditional spices and masala blends for everyday Indian cooking.",
    cta1: { label: "Shop Bestsellers", link: "/shop?filter=bestsellers", icon: <ShoppingBag size={18} /> },
    image: "/images/hero_1_true_taste.jpg",
  },
  {
    eyebrow: "Everyday Kitchen Essentials",
    headingText: "Pure Flavours, Traditional Recipes",
    headline: (
      <>
        Pure Flavours,<br />
        <em className="text-gold-light not-italic">Traditional Recipes</em>
      </>
    ),
    text: "Discover staple spices and blends made for everyday cooking.",
    cta1: { label: "Explore Range", link: "/shop", icon: <ArrowRight size={18} /> },
    image: "/images/hero_2_pure_spices.jpg",
  },
  {
    eyebrow: "Signature Heritage Blends",
    headingText: "Time-Tested Family Recipes",
    headline: (
      <>
        Time-Tested<br />
        <em className="text-gold-light not-italic">Family Recipes</em>
      </>
    ),
    text: "Explore signature spice blends inspired by traditional cooking.",
    cta1: { label: "Shop Bestsellers", link: "/shop?filter=bestsellers", icon: <ShoppingBag size={18} /> },
    image: "/images/hero_3_secret_blends.jpg",
  },
  {
    eyebrow: "Special Welcome Offer",
    headingText: "10% Off Your First Order",
    headline: (
      <>
        10% Off Your<br />
        <em className="text-gold-light not-italic">First Order</em>
      </>
    ),
    text: "Use coupon code PEHLADABBA at checkout on your first order.",
    cta1: { label: "Claim Offer", link: "/shop", icon: <Gift size={18} /> },
    image: "/images/hero_4_first_order.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diffX = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 45;
      if (diffX > minSwipeDistance) {
        nextSlide();
      } else if (diffX < -minSwipeDistance) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      className="relative w-full h-[520px] md:h-[580px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Highlighted Offers and Products"
    >
      {/* Slides track */}
      <div
        className="flex flex-row flex-nowrap w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="relative w-full min-w-full shrink-0 h-full flex items-center"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.headingText}`}
            aria-hidden={index !== current}
          >
            {/* Slide Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.image}
                alt={slide.headingText}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            
            {/* Gradient Overlays for Readability and Contrast */}
            <div className="absolute inset-0 z-1 bg-gradient-to-r from-charcoal/90 via-charcoal/65 to-charcoal/20" />
            <div className="absolute inset-0 z-1 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent md:hidden" />

            {/* Slide Content */}
            <div className="relative z-10 max-w-[600px] px-6 md:px-20">
              <FadeIn delay={0.2}>
                <span className="font-kalam text-gold-light text-base md:text-lg tracking-wide mb-3 block">
                  ✦ {slide.eyebrow}
                </span>
                <h1 className="font-playfair text-[32px] md:text-[54px] text-white leading-[1.15] mb-4 font-bold">
                  {slide.headline}
                </h1>
                <p className="text-white/85 text-sm md:text-base leading-relaxed mb-7 max-w-[440px]">
                  {slide.text}
                </p>
                <div className="flex gap-3.5 flex-wrap">
                  <Link
                    href={slide.cta1.link}
                    tabIndex={index === current ? 0 : -1}
                    className="bg-brand-red text-white px-7 py-3.5 hover:bg-brand-red-dark hover:-translate-y-0.5 text-[15px] rounded-[6px] font-body font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {slide.cta1.icon}
                    {slide.cta1.label}
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Navigation Arrows (Directly Positioned with z-30) */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/60 border border-white/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all focus:outline-none focus:ring-2 focus:ring-gold-light shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal/60 border border-white/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all focus:outline-none focus:ring-2 focus:ring-gold-light shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30" role="tablist" aria-label="Slides">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === current}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-light ${
              idx === current ? 'w-8 bg-gold-light' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}: ${slide.headingText}`}
          />
        ))}
      </div>
    </section>
  );
}
