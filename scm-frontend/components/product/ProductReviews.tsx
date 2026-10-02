'use client';
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, PenLine, Send } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export default function ProductReviews({ productId, ratingAvg, ratingCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.reviews || data || [];
        setReviews(list);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const getStars = (r: number) => {
    const stars = [];
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-gold text-gold" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={16} className="fill-gold text-gold" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const fmtDate = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const submitReview = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!comment.trim()) {
      setSubmitError('Please write a comment before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: Number(rating), comment: comment.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setSubmitError('Please log in to write a review.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setSubmitSuccess('Thanks! Your review has been submitted for approval.');
      setComment('');
      setRating('5');
      await fetchReviews();
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess('');
      }, 2500);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4" id="pdReviewsWrap">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-cream-dark pb-6">
        <div>
          <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            {ratingCount && ratingCount > 0 ? (
              <>
                <div className="text-4xl font-bold text-charcoal">{(ratingAvg || 0).toFixed(1)}</div>
                <div className="flex flex-col gap-1">
                  {getStars(ratingAvg || 0)}
                  <div className="text-sm font-medium text-brown">{ratingCount || reviews.length} verified review{ratingCount === 1 ? '' : 's'}</div>
                </div>
              </>
            ) : (
              <div className="text-sm font-medium text-brown">0 verified reviews</div>
            )}
          </div>
        </div>
        
        <button 
          className="bg-white border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm shadow-sm"
          onClick={() => setShowForm(!showForm)}
        >
          <PenLine size={16} /> Write a Review
        </button>
      </div>
      
      {showForm && (
        <div className="bg-cream p-6 rounded-2xl border border-cream-dark mb-8 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-charcoal mb-4">Share Your Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brown uppercase tracking-wider">Your Rating</label>
              <select 
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-white border border-cream-mid rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all appearance-none cursor-pointer"
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Good</option>
                <option value="3">★★★☆☆ Average</option>
                <option value="2">★★☆☆☆ Poor</option>
                <option value="1">★☆☆☆☆ Very Poor</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-brown uppercase tracking-wider">Your Review</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product?" 
                className="w-full bg-white border border-cream-mid rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all min-h-[120px] resize-y"
              ></textarea>
            </div>
            
            {submitError && (
              <div className="md:col-span-2 bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium border border-red-200">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="md:col-span-2 bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-200">
                {submitSuccess}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button 
                className="bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={submitReview}
                disabled={submitting}
              >
                <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12 text-brown font-medium flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cream-dark border-t-saffron rounded-full animate-spin"></div>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-brown font-medium">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(r => (
            <div key={r._id} className="bg-white p-6 rounded-2xl border border-cream-dark shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream text-saffron rounded-full flex items-center justify-center font-playfair font-bold text-xl flex-shrink-0">
                  {r.name ? r.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-charcoal">{r.name || 'Anonymous'}</div>
                  <div className="flex items-center gap-2">
                    {getStars(r.rating)}
                    <span className="text-xs text-gray-400">• {fmtDate(r.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-brown text-sm leading-relaxed italic">
                "{r.comment}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
