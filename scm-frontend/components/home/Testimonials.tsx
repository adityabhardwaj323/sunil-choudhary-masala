'use client';

import { useState } from 'react';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const testimonials = [
  { text: "I have been using SCM Laal Mirch for 5 years. No other brand comes close to this colour and heat. My whole family insists on this brand now!", author: "Priya Sharma", loc: "Jaipur, Rajasthan", init: "P" },
  { text: "The Rajasthani Garam Masala is simply outstanding. The aroma when it hits the pan is something else — it fills the entire house. Truly authentic!", author: "Rajesh Verma", loc: "Jodhpur, Rajasthan", init: "R" },
  { text: "Ordered the gift set for my sister's wedding and everyone asked where I got it from! Beautiful packaging, amazing quality, delivered on time.", author: "Anita Meena", loc: "Udaipur, Rajasthan", init: "A" },
  { text: "I live in Pune now but I cannot cook without SCM masalas from home. My mother sends me a box every 3 months. Now I order online — so convenient!", author: "Mohan Choudhary", loc: "Pune, Maharashtra", init: "M" },
  { text: "The batch date on the packet is what sold me. Finally a brand that respects the customer and gives fresh spices. The turmeric colour is phenomenal!", author: "Sunita Gupta", loc: "Delhi", init: "S" },
  { text: "Best Laal Maas Masala I have ever tasted. I run a small restaurant and all my customers love this dish. SCM is my secret weapon!", author: "Kishan Rawat", loc: "Bikaner, Rajasthan", init: "K" }
];

export default function Testimonials() {
  const [page, setPage] = useState(0);
  
  // Display 3 cards on desktop, 1 on mobile
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  
  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

  const visibleTestimonials = testimonials.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section className="py-20 bg-white">
      <FadeIn className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-kalam text-saffron text-xl mb-2">✦ Customer Love</span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">What Our Customers Say</h2>
          <SectionDivider />
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testi, idx) => (
              <div key={`${page}-${idx}`} className="bg-cream-dark p-8 rounded-2xl relative border border-cream-mid animate-fade-in-up">
                <Quote className="text-saffron opacity-20 w-16 h-16 absolute top-4 right-4" />
                
                <div className="flex items-center gap-1 mb-6 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-charcoal font-medium italic leading-relaxed mb-8 relative z-10">
                  "{testi.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-saffron text-white rounded-full flex items-center justify-center font-playfair font-bold text-xl shadow-sm">
                    {testi.init}
                  </div>
                  <div>
                    <div className="font-bold text-charcoal">{testi.author}</div>
                    <div className="text-sm text-brown">{testi.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10 gap-3">
            <button onClick={prevPage} className="w-10 h-10 rounded-full border border-cream-mid flex items-center justify-center text-charcoal hover:bg-saffron hover:text-white hover:border-saffron transition-colors" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextPage} className="w-10 h-10 rounded-full border border-cream-mid flex items-center justify-center text-charcoal hover:bg-saffron hover:text-white hover:border-saffron transition-colors" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
