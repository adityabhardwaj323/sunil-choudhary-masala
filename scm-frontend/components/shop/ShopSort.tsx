'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || '';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="relative inline-block">
      <select 
        className="appearance-none bg-cream border-2 border-cream-dark rounded-full pl-4 pr-10 py-2 text-sm text-charcoal focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron cursor-pointer font-medium" 
        value={currentSort} 
        onChange={handleSortChange}
      >
        <option value="">Default Sorting</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="newest">Latest</option>
        <option value="rating">Top Rated</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
