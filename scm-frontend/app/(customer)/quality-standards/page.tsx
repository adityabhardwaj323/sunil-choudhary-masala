import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Leaf, Droplets, PackageCheck, Search, Info } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata: Metadata = {
  title: 'Quality Standards | Sunil Choudhary Masala',
};

export default function QualityStandardsPage() {
  return (
    <div className="bg-cream min-h-screen pb-0">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">⭐</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🥇</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Our Commitment</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Quality & Purity Standards</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            What we do — and don't do — to keep our spices honest
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20 mb-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <p className="lead text-xl text-charcoal font-medium mb-10">
            At Sunil Choudhary Masala, quality isn't a marketing claim — it's the same set of practices our family has followed for three generations. Below is a straightforward account of the standards we hold ourselves to.
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 bg-cream/50 rounded-2xl border border-cream-dark/50 mb-16">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-brand-red">
              <ShieldCheck size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">FSSAI Compliance</h3>
              <p className="text-brown mb-3">Sunil Choudhary Masala products are manufactured in compliance with applicable regulations of the Food Safety and Standards Authority of India (FSSAI).</p>
              <p className="text-charcoal font-bold bg-white inline-block px-4 py-2 rounded-lg shadow-sm border border-cream-dark/30">FSSAI License Number: <span className="text-brand-red">[FSSAI Licence No. to be added]</span></p>
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">What We Don't Add</h2>
              <p className="text-brown">Simple, honest commitments — not marketing claims.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 bg-cream/30 rounded-2xl border border-cream-dark/30 hover:border-brand-red/30 hover:shadow-sm transition-all">
                <CheckCircle2 className="text-brand-red shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">No Artificial Colours</h4>
                  <p className="text-brown">We do not add artificial colours during processing or packing. The colour you see is the natural colour of the spice.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-cream/30 rounded-2xl border border-cream-dark/30 hover:border-brand-red/30 hover:shadow-sm transition-all">
                <CheckCircle2 className="text-brand-red shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">No Preservatives</h4>
                  <p className="text-brown">We do not add preservatives during processing or packing. Our spices are prepared and packed to be used naturally, without added chemicals.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-cream/30 rounded-2xl border border-cream-dark/30 hover:border-brand-red/30 hover:shadow-sm transition-all">
                <CheckCircle2 className="text-brand-red shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">No Cheap Fillers</h4>
                  <p className="text-brown">We do not bulk up our products with low-quality fillers or adulterants to cut costs.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-cream/30 rounded-2xl border border-cream-dark/30 hover:border-brand-red/30 hover:shadow-sm transition-all">
                <CheckCircle2 className="text-brand-red shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">No Hidden Shortcuts</h4>
                  <p className="text-brown">Every step, from ingredient selection to packing, follows the same standard — there's no "faster but lower quality" version of our process.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="font-playfair text-3xl font-bold text-charcoal mb-8">What We Do</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-center p-8 bg-cream/20 rounded-2xl border border-cream-dark/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red mb-4">
                  <Leaf size={28} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Careful Ingredient Selection</h3>
                <p className="text-brown">We select raw spices carefully before they enter our process, rejecting material that doesn't meet our standards.</p>
              </div>
              
              <div className="text-center p-8 bg-cream/20 rounded-2xl border border-cream-dark/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red mb-4">
                  <Droplets size={28} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Hygienic Processing</h3>
                <p className="text-brown">Our processing is carried out under hygienic conditions to protect the quality and safety of the final product.</p>
              </div>
              
              <div className="text-center p-8 bg-cream/20 rounded-2xl border border-cream-dark/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red mb-4">
                  <PackageCheck size={28} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Secure Packaging</h3>
                <p className="text-brown">Every pack is sealed securely to preserve freshness and protect the product from moisture and contamination during transit.</p>
              </div>
              
              <div className="text-center p-8 bg-cream/20 rounded-2xl border border-cream-dark/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red mb-4">
                  <Search size={28} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Consistent Checks</h3>
                <p className="text-brown">We check our products at multiple stages of processing to maintain consistency across batches.</p>
              </div>
            </div>
          </div>

          <div className="bg-cream-dark/20 p-8 rounded-2xl border border-cream-dark/50">
            <h2 className="flex items-center gap-3 font-playfair text-2xl font-bold text-charcoal mb-4">
              <Info className="text-brand-red" size={24} />
              Natural Variation Is Normal
            </h2>
            <p className="text-brown leading-relaxed">
              Spices are natural agricultural products. Colour, aroma, texture, and appearance may vary slightly between batches depending on crop, season, origin, and harvesting conditions. This is expected and does not indicate a defect — it's a sign that nothing artificial has been added to make every batch look identical.
            </p>
          </div>
          
        </div>
      </div>

      <section className="bg-brand-red py-24 text-center">
      <FadeIn>
        <div className="container-custom">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Curious How We Get There?</h2>
          <p className="text-cream-mid text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            See the steps our spices go through, from sourcing to your kitchen
          </p>
          <Link href="/manufacturing" className="inline-block bg-white text-brand-red px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-cream transition-colors shadow-lg">
            Our Process
          </Link>
        </div>
      </FadeIn>
    </section>
    </div>
  );
}
