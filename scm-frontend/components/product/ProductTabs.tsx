'use client';

import React, { useState } from 'react';
import { Product } from '@/types';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'ingr' | 'nutr'>('desc');

  // Helper to parse nutrition object if it comes as an object from the backend
  const renderNutrition = () => {
    if (!product.nutritionInfo) return <p>&mdash;</p>;
    
    // If it's a string, just display it
    if (typeof product.nutritionInfo === 'string') {
      return <p>{product.nutritionInfo}</p>;
    }
    
    // If it's an object, render as key-value pairs
    if (typeof product.nutritionInfo === 'object') {
      return (
        <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {Object.entries(product.nutritionInfo).map(([key, val]) => (
            val && (
              <div key={key} style={{ background: 'var(--cream-dark)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
                {key}: <strong>{val as string}</strong>
              </div>
            )
          ))}
        </div>
      );
    }

    return <p>&mdash;</p>;
  };

  return (
    <div className="mt-12 bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm">
      <div className="flex border-b border-cream-dark">
        <button 
          className={`flex-1 py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider transition-colors ${activeTab === 'desc' ? 'bg-cream text-brand-red border-b-2 border-brand-red' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-charcoal'}`} 
          onClick={() => setActiveTab('desc')}
        >
          Description
        </button>
        <button 
          className={`flex-1 py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider transition-colors ${activeTab === 'ingr' ? 'bg-cream text-brand-red border-b-2 border-brand-red' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-charcoal'}`} 
          onClick={() => setActiveTab('ingr')}
        >
          Ingredients
        </button>
        <button 
          className={`flex-1 py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider transition-colors ${activeTab === 'nutr' ? 'bg-cream text-brand-red border-b-2 border-brand-red' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-charcoal'}`} 
          onClick={() => setActiveTab('nutr')}
        >
          Nutrition
        </button>
      </div>
      
      <div className="p-6 md:p-8">
        <div className={activeTab === 'desc' ? 'block' : 'hidden'}>
          <div className="prose prose-sm md:prose-base prose-stone max-w-none text-brown font-inter leading-relaxed">
            <p>{product.description || <>&mdash;</>}</p>
          </div>
        </div>
        
        <div className={activeTab === 'ingr' ? 'block' : 'hidden'}>
          <div className="prose prose-sm md:prose-base prose-stone max-w-none text-brown font-inter leading-relaxed">
            <p>{product.ingredients || <>&mdash;</>}</p>
            {product.fssaiNumber && (
              <div className="mt-6 inline-flex items-center gap-2 bg-cream px-4 py-2 rounded-lg border border-cream-dark text-sm font-semibold text-charcoal">
                <span>FSSAI Lic. No.</span>
                <span className="text-saffron">{product.fssaiNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={activeTab === 'nutr' ? 'block' : 'hidden'}>
          <h3 className="font-playfair text-xl font-bold text-charcoal mb-4">Nutritional Info (per 100g)</h3>
          {renderNutrition()}
        </div>
      </div>
    </div>
  );
}
