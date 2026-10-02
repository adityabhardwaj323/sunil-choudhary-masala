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
        <FadeIn className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 flex flex-col items-center">
            <span className="font-kalam text-saffron text-xl mb-2">✦ Customer Love</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">Real Customer Experiences</h2>
            <SectionDivider />
          </div>

          <div className="bg-cream-dark p-8 md:p-12 rounded-2xl border border-cream-mid max-w-3xl mx-auto text-center">
            <Quote className="text-saffron opacity-20 w-16 h-16 mx-auto mb-6" />
            <p className="text-charcoal font-medium leading-relaxed mb-6">
              We value genuine feedback from our community. Every rating and review on our website comes from verified customers who have received and experienced our products. 
            </p>
            <p className="text-brown text-sm mb-8">
              Browse our catalogue to read real reviews on individual product pages, or leave your own review after your next purchase!
            </p>
            <a href="/shop" className="inline-flex bg-charcoal text-white hover:bg-black transition-colors px-6 py-3 rounded-full font-bold shadow-md">
              Explore Products
            </a>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-kalam text-saffron text-xl mb-2">✦ Customer Love</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">Verified Customer Reviews</h2>
          <SectionDivider />
          <p className="mt-4 text-brown max-w-xl mx-auto">
            Reviews from customers who have genuinely purchased and experienced our products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-cream p-6 rounded-2xl border border-cream-dark hover:border-saffron/30 transition-colors">
              <Quote className="text-saffron opacity-20 w-8 h-8 mb-4" />
              <div className="flex text-saffron mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-saffron" : "text-gray-300"} />
                ))}
              </div>
              <p className="text-charcoal mb-6 italic line-clamp-4">"{review.comment}"</p>
              <div className="flex flex-col mt-auto pt-4 border-t border-cream-dark">
                <span className="font-bold text-charcoal">{review.userName}</span>
                <span className="text-xs text-brand-red font-medium mt-1">Verified Purchase: {review.product?.name || 'Product'}</span>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
