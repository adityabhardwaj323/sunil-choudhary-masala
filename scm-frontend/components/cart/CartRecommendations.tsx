'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types';

export default function CartRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/products?bestseller=true');
        if (res.ok) {
          const data = await res.json();
          // Filter to top 3 recommendations
          setProducts((data.products || []).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-10 pt-10 border-t border-cream-dark">
      <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Complete Your Kitchen</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products.map(prod => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
}
