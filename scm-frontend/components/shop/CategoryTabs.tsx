'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const tabs = [
    { label: 'All Products', value: '' },
    { label: 'Chilli Powders', value: 'Chilli Powders' },
    { label: 'Ground Spices', value: 'Ground Spices' },
    { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
    { label: 'Healthy Snacks', value: 'Healthy Snacks' },
    { label: 'Cooking Oils', value: 'Cooking Oils' },
    { label: 'Combos', value: 'Combos' },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
      {tabs.map((tab) => (
        <button 
          key={tab.label}
          onClick={() => handleCategoryChange(tab.value)}
          className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors border ${
            currentCategory === tab.value 
              ? 'bg-saffron text-white border-saffron shadow-sm' 
              : 'bg-cream border-cream-dark text-charcoal hover:border-saffron hover:text-brand-red'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
