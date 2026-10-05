'use client';

import { useState, useEffect } from 'react';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Quote, Star } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

type PublicReview = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    _id: string;
    name: string;
  };
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Safe public read-only endpoint (no private info returned)
        const res = await fetch('/api/reviews/public/recent');
        if (!res.ok) throw new Error('Failed to load reviews');
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setError(true);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-gray-400">Loading customer experiences...</p>
        </div>
      </section>
    );
  }

  // Graceful fallback for API failure or no reviews
  if (error || reviews.length === 0) {
    return (
      <section className="py-20 bg-white">
        <FadeIn className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-10 flex flex-col items-center">
            <span className="font-body text-brand-red uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">
              Customer Love
            </span>
            <h2 className="font-display text-3xl md:text-[44px] font-bold text-charcoal mb-4">Real Customer Experiences</h2>
            <SectionDivider />
          </div>

          <div className="bg-cream p-8 md:p-12 rounded-sm max-w-3xl mx-auto text-center">
            <Quote className="text-brand-red opacity-10 w-12 h-12 mx-auto mb-6" />
            <p className="text-charcoal font-body text-lg leading-relaxed mb-6">
              We value genuine feedback from our community. Every rating and review on our website comes from verified customers who have received and experienced our products. 
            </p>
            <a href="/shop" className="inline-flex text-brand-red font-semibold font-body tracking-wide hover:text-charcoal transition-colors">
              EXPLORE PRODUCTS &rarr;
            </a>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-white">
      <FadeIn className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-body text-brand-red uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-[44px] font-bold text-charcoal mb-4">Verified Reviews</h2>
        </div>

        {/* Mobile Horizontal Scroll, Desktop Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-8 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
          {reviews.map((review) => (
            <div key={review._id} className="min-w-[300px] w-[80vw] md:w-auto shrink-0 snap-start flex flex-col bg-white border-l border-cream-mid pl-8 py-2 relative">
              <div className="flex text-saffron mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-saffron" : "text-cream-mid"} />
                ))}
              </div>
              <p className="font-display text-charcoal text-xl leading-relaxed mb-8 line-clamp-4 relative z-10">
                "{review.comment}"
              </p>
              <div className="mt-auto">
                <span className="block font-body text-charcoal font-semibold text-sm mb-1">— {review.userName}</span>
                <span className="block font-body text-[11px] text-charcoal/50 uppercase tracking-wider">Verified Buyer • {review.product?.name || 'Product'}</span>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
