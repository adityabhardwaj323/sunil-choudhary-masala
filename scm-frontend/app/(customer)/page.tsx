import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import BestSellers from '@/components/home/BestSellers';
import TrustStrip from '@/components/home/TrustStrip';
import BlogPreview from '@/components/home/BlogPreview';
import OfferBanner from '@/components/home/OfferBanner';
import BrandStory from '@/components/home/BrandStory';
import QualitySection from '@/components/home/QualitySection';
import Testimonials from '@/components/home/Testimonials';
import FounderMessage from '@/components/home/FounderMessage';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Shop by Category */}
      <Suspense fallback={<div className="py-16 text-center text-brown animate-pulse">Loading Categories...</div>}>
        <CategoryShowcase />
      </Suspense>

      {/* 4. Best Sellers */}
      <Suspense fallback={<div className="py-20 text-center text-brown animate-pulse">Loading Bestsellers...</div>}>
        <BestSellers />
      </Suspense>

      {/* 5. Coupon / Offer Banner */}
      <OfferBanner />

      {/* 6. Quality / Why SCM */}
      <QualitySection />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Brand Story */}
      <BrandStory />

      {/* 9. Blog Preview */}
      <Suspense fallback={null}>
        <BlogPreview />
      </Suspense>

      {/* 10. Founder Message */}
      <FounderMessage />

      {/* 11. Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
