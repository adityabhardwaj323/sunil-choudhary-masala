'use client';

import { useState, useEffect } from 'react';
import { Camera, PackageSearch, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-5 select-none pointer-events-none">
          <Camera size={180} />
        </div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-5 select-none pointer-events-none">
          <PackageSearch size={180} />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Visual Journey</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Media Gallery</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            A look at our process, our people, and our products
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-saffron" size={40} />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            <p>No images available in the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {images.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-2xl shadow-sm border border-cream-dark/50 overflow-hidden group hover:shadow-md hover:border-brand-red/30 transition-all cursor-pointer aspect-square flex flex-col relative animate-fade-in-up"
              >
                <div className="flex-1 bg-cream-dark/10 overflow-hidden relative">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                
                <div className="bg-white p-4 border-t border-cream-dark/30 z-10">
                  <p className="text-charcoal font-medium text-center text-sm md:text-base leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
