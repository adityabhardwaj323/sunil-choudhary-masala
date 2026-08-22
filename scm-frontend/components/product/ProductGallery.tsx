'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(images && images.length > 0 ? images[0] : '');

  // Use API_BASE_URL or fallback, but if it's an absolute cloudinary url, return it directly.
  const getImgUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + path;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnail List (Desktop: Left, Mobile: Bottom via flex-order but let's keep simple responsive stack) */}
      {images && images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar order-2 md:order-1 w-full md:w-24 flex-shrink-0">
          {images.map((img, idx) => (
            <button 
              key={idx} 
              className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-red shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-saffron'}`}
              onClick={() => setActiveImage(img)}
            >
              <img 
                src={getImgUrl(img)} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover bg-cream-dark mix-blend-multiply" 
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Main Image */}
      <div className="flex-grow bg-cream-dark rounded-2xl overflow-hidden border border-cream-mid aspect-square md:aspect-auto md:h-[600px] relative order-1 md:order-2 flex items-center justify-center p-8">
        {activeImage ? (
          <img 
            src={getImgUrl(activeImage)} 
            alt="Product main image" 
            className="w-full h-full object-contain mix-blend-multiply" 
          />
        ) : (
          <img 
            src="/asset_35.jpg" 
            alt="SCM Product" 
            className="w-full h-full object-cover mix-blend-multiply opacity-80" 
          />
        )}
      </div>
    </div>
  );
}
