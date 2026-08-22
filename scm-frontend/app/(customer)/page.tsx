import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import BrandStory from '@/components/home/BrandStory';
import FounderMessage from '@/components/home/FounderMessage';
import QualitySection from '@/components/home/QualitySection';
import PackagingPromise from '@/components/home/PackagingPromise';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import RecipeSection from '@/components/home/RecipeSection';
import Testimonials from '@/components/home/Testimonials';
import OfferBanner from '@/components/home/OfferBanner';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="w-full overflow-hidden">
      <Hero />
      <TrustStrip />
      <BrandStory />
      <FounderMessage />
      <QualitySection />
      <PackagingPromise />
      <CategoryShowcase />
      <Suspense fallback={<div className="py-20 text-center text-brown">Loading Featured Products...</div>}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<div className="py-20 text-center text-brown">Loading Bestsellers...</div>}>
        <BestSellers />
      </Suspense>
      <RecipeSection />
      <Testimonials />
      <OfferBanner />
      <NewsletterCTA />
    </main>
  );
}
