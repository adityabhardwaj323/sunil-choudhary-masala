'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '1000';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('maxPrice', max);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark sticky top-24">
        
        {/* Categories */}
        <div className="mb-8">
          <h3 className="font-playfair text-xl font-bold text-charcoal mb-4">Categories</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'All Products', value: '' },
              { label: 'Chilli Powders', value: 'Chilli Powders' },
              { label: 'Ground Spices', value: 'Ground Spices' },
              { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
              { label: 'Healthy Snacks', value: 'Healthy Snacks' },
              { label: 'Cooking Oils', value: 'Cooking Oils' },
            ].map((cat) => (
              <label key={cat.label} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="category"
                    className="sr-only"
                    checked={currentCategory === cat.value}
                    onChange={() => handleCategoryChange(cat.value)}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                    currentCategory === cat.value 
                      ? 'border-saffron' 
                      : 'border-gray-300 group-hover:border-saffron'
                  }`}></div>
                  {currentCategory === cat.value && (
                    <div className="absolute w-2.5 h-2.5 bg-saffron rounded-full"></div>
                  )}
                </div>
                <span className={`text-sm transition-colors ${
                  currentCategory === cat.value ? 'text-charcoal font-semibold' : 'text-gray-600 group-hover:text-charcoal'
                }`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-playfair text-xl font-bold text-charcoal mb-4">Max Price</h3>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={currentMaxPrice}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
          />
          <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
            <span>₹10</span>
            <span className="text-brand-red">₹{currentMaxPrice}</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
