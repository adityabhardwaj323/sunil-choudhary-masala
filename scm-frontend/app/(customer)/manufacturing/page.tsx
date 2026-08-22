import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Sparkles, Sun, Beaker, Search, PackageCheck, Truck, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing | Sunil Choudhary Masala',
};

export default function ManufacturingPage() {
  return (
    <div className="bg-cream min-h-screen pb-0">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">⚙️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🏭</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Behind the Scenes</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Process</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            From raw spice to your kitchen — the steps we follow, every batch
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20 mb-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <p className="lead text-xl text-charcoal font-medium border-b border-cream-dark/50 pb-8 mb-12">
            Every SCM product passes through the same set of stages before it reaches you. We keep this description general and honest — rather than describe specific machinery or techniques we can't fully verify in writing, here is a clear outline of the overall journey.
          </p>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-cream-dark/50 rounded-full hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Leaf size={24} />
                    Sourcing
                  </h3>
                  <p className="text-brown text-lg">We select raw spices from trusted sources, choosing material based on quality rather than lowest cost.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Sparkles size={24} />
                    Cleaning & Sorting
                  </h3>
                  <p className="text-brown text-lg">Raw spices are cleaned and sorted to remove impurities, dust, and any material that doesn't meet our quality expectations.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Sun size={24} />
                    Drying
                  </h3>
                  <p className="text-brown text-lg">Spices are dried appropriately to reach the right moisture level before grinding, which helps preserve flavour and shelf life naturally.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Beaker size={24} />
                    Grinding & Blending
                  </h3>
                  <p className="text-brown text-lg">Spices are ground and, where applicable, blended according to our recipes — the same recipes and ratios passed down within the family over generations.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  5
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Search size={24} />
                    Quality Check
                  </h3>
                  <p className="text-brown text-lg">Batches are checked for colour, aroma, and consistency before moving on to packing. Material that doesn't meet our standard is not packed for sale.</p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  6
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <PackageCheck size={24} />
                    Hygienic Packing
                  </h3>
                  <p className="text-brown text-lg">Products are packed under hygienic conditions, in secure packaging designed to protect freshness and prevent contamination during storage and transit.</p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">
                <div className="md:w-12 md:h-12 w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xl md:text-lg shrink-0 shadow-md relative z-10 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  7
                </div>
                <div className="bg-cream/30 p-8 rounded-2xl border border-cream-dark/30 flex-1 hover:border-brand-red/30 hover:shadow-md transition-all">
                  <h3 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-4">
                    <Truck size={24} />
                    Dispatch
                  </h3>
                  <p className="text-brown text-lg">Finished, sealed packs are dispatched to reach retailers, distributors, and customers, following the timelines described in our Shipping Policy.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-start gap-4 p-6 bg-cream-dark/20 rounded-2xl border border-cream-dark/50">
            <Info size={24} className="text-brand-red shrink-0 mt-1" />
            <div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">A Note on This Description</h3>
              <p className="text-brown">This page describes the general stages our products go through. We've kept it general rather than naming specific equipment or techniques, so that what we say here is something we can always stand behind.</p>
            </div>
          </div>
          
        </div>
      </div>

      <section className="bg-brand-red py-24 text-center">
        <div className="container-custom">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Want the Full Purity Picture?</h2>
          <p className="text-cream-mid text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Read about what we do and don't add to our products
          </p>
          <Link href="/quality-standards" className="inline-block bg-white text-brand-red px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-cream transition-colors shadow-lg">
            Quality & Purity Standards
          </Link>
        </div>
      </section>
    </div>
  );
}
