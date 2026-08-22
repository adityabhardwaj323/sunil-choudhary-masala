const fs = require('fs');
let content = fs.readFileSync('app/(customer)/about/page.tsx', 'utf8');

// The new content for the about page
const newContent = `import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Leaf, Users, Clock, Award, TestTube, Recycle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Sunil Choudhary Masala',
};

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌿</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Our Heritage</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Story of Purity</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            35 years of stone-grinding and delivering authentic Rajasthani flavour to kitchens across India
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-cream-dark shadow-sm relative z-20 -mt-6 mx-4 md:mx-auto max-w-5xl rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-cream-dark p-6">
          <div className="text-center p-4">
            <span className="block text-3xl md:text-4xl font-playfair font-bold text-brand-red mb-1">35+</span>
            <span className="text-brown text-sm font-medium uppercase tracking-wider">Years Experience</span>
          </div>
          <div className="text-center p-4">
            <span className="block text-3xl md:text-4xl font-playfair font-bold text-brand-red mb-1">50K+</span>
            <span className="text-brown text-sm font-medium uppercase tracking-wider">Happy Families</span>
          </div>
          <div className="text-center p-4">
            <span className="block text-3xl md:text-4xl font-playfair font-bold text-brand-red mb-1">47+</span>
            <span className="text-brown text-sm font-medium uppercase tracking-wider">Masala Blends</span>
          </div>
          <div className="text-center p-4">
            <span className="block text-3xl md:text-4xl font-playfair font-bold text-brand-red mb-1">100%</span>
            <span className="text-brown text-sm font-medium uppercase tracking-wider">Natural & Pure</span>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story Image / Graphic */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-cream-dark/30 rounded-3xl overflow-hidden flex items-center justify-center border border-cream-dark shadow-inner">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-40 mix-blend-overlay"></div>
               <div className="text-[12rem] md:text-[16rem] leading-none opacity-80 filter drop-shadow-xl">🌾</div>
               
               {/* Decorative elements */}
               <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-brand-red/30 rounded-tl-3xl"></div>
               <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-brand-red/30 rounded-br-3xl"></div>
            </div>

            {/* Story Content */}
            <div>
              <div className="flex items-center gap-3 text-brand-red font-bold tracking-widest uppercase text-sm mb-4">
                <span className="w-8 h-px bg-brand-red"></span>
                How It All Started
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6 leading-tight">
                From One Stone-Grinder to Kitchens Across India
              </h2>
              
              <div className="prose prose-lg prose-brown mb-10">
                <p className="text-charcoal font-medium">
                  In 1985, Sunil Choudhary started with one stone-grinder and an unshakeable belief — that India deserved purer, more honest masalas. No fillers. No artificial colours. No compromises.
                </p>
                <p>
                  What began as a local venture in Rajasthan grew through word of mouth — one satisfied family at a time. Today, SCM is trusted by 50,000+ families across India, yet we still grind our spices with the same care and dedication as day one.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cream-dark before:via-brand-red/30 before:to-cream-dark">
                
                <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-cream bg-brand-red shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-white border border-brand-red/20 shadow-sm">
                    <div className="text-brand-red font-bold text-sm mb-1">1985</div>
                    <h4 className="font-bold text-charcoal mb-2">The Beginning</h4>
                    <p className="text-sm text-brown">First stone-grinder set up in Rajasthan with a dream of pure, honest masalas</p>
                  </div>
                </div>

                <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-cream bg-cream-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-cream-dark/20 border border-cream-dark/50">
                    <div className="text-brown font-bold text-sm mb-1">1995</div>
                    <h4 className="font-bold text-charcoal mb-2">Regional Expansion</h4>
                    <p className="text-sm text-brown">Products reach 5 districts across Rajasthan through trusted kirana stores</p>
                  </div>
                </div>

                <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-cream bg-cream-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-cream-dark/20 border border-cream-dark/50">
                    <div className="text-brown font-bold text-sm mb-1">2008</div>
                    <h4 className="font-bold text-charcoal mb-2">FSSAI Certification</h4>
                    <p className="text-sm text-brown">Official food safety certification — quality commitment formalized</p>
                  </div>
                </div>

                <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-cream bg-cream-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-cream-dark/20 border border-cream-dark/50">
                    <div className="text-brown font-bold text-sm mb-1">2020</div>
                    <h4 className="font-bold text-charcoal mb-2">Going Online</h4>
                    <p className="text-sm text-brown">SCM launches e-commerce to serve families all across India</p>
                  </div>
                </div>

                <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-cream bg-saffron shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-saffron/10 border border-saffron/30">
                    <div className="text-saffron font-bold text-sm mb-1">2025</div>
                    <h4 className="font-bold text-charcoal mb-2">50,000+ Families</h4>
                    <p className="text-sm text-brown">The SCM family now spans every corner of the country — and growing</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-charcoal text-cream relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-saffron rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        <div className="container-custom relative z-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Founder Image (Preserved Base64) */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-cream/10 shadow-2xl">
                <!--BASE64_IMAGE_PLACEHOLDER-->
              </div>
              
              {/* Floating Name Badge */}
              <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-6 rounded-2xl shadow-xl border border-cream-dark max-w-[240px]">
                <div className="font-playfair font-bold text-xl text-charcoal mb-1">Sunil Choudhary</div>
                <div className="text-saffron font-medium text-sm">Founder & Master Blender</div>
              </div>
            </div>

            {/* Founder Message */}
            <div className="lg:col-span-7 lg:pl-10 mt-10 lg:mt-0">
              <div className="flex items-center gap-3 text-saffron font-bold tracking-widest uppercase text-sm mb-4">
                <span className="w-8 h-px bg-saffron"></span>
                Founder's Message
              </div>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-8">
                A Promise Kept for 35 Years
              </h2>
              
              <blockquote className="relative p-8 bg-white/5 border border-white/10 rounded-3xl mb-8">
                <span className="absolute top-4 left-4 text-5xl font-playfair text-saffron/20 leading-none">"</span>
                <p className="text-xl md:text-2xl font-playfair italic text-cream-mid relative z-10">
                  My mother always said — a meal made with pure spices feeds not just the body, but the soul. I have kept that promise for 35 years. Every masala that leaves our mill carries the same commitment she taught me.
                </p>
              </blockquote>
              
              <div className="space-y-4 text-cream-dark/80 text-lg">
                <p>
                  Sunil Choudhary learned the art of spice blending from his family, perfecting recipes over decades. His philosophy is simple: use the best raw material, process it the honest way, and let the flavour speak for itself.
                </p>
                <p>
                  He personally oversees quality checks on every batch — a practice he has never delegated in 35 years of business.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-brand-red font-bold tracking-widest uppercase text-sm mb-4">
              <span className="w-8 h-px bg-brand-red"></span>
              What We Stand For
              <span className="w-8 h-px bg-brand-red"></span>
            </div>
            <h2 className="font-playfair text-4xl font-bold text-charcoal">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Purity First</h3>
              <p className="text-brown leading-relaxed">
                No artificial colours or preservatives — ever. What you see is what you get.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Farmer Trust</h3>
              <p className="text-brown leading-relaxed">
                Direct sourcing from Rajasthan's farmers at fair prices, every season.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Traditional Process</h3>
              <p className="text-brown leading-relaxed">
                Stone-grinding the old way — still the best way for authentic flavour.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Freshness Dated</h3>
              <p className="text-brown leading-relaxed">
                Every batch is dated. You always know exactly when your masala was ground.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TestTube size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Lab Tested</h3>
              <p className="text-brown leading-relaxed">
                Every batch tested for purity, moisture and safety before packaging.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Recycle size={28} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Sustainability</h3>
              <p className="text-brown leading-relaxed">
                Reducing plastic and giving back to the farming community we depend on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom max-w-5xl">
          <div className="bg-gradient-to-br from-brand-red to-red-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className="text-saffron font-bold tracking-widest uppercase text-sm mb-4 block">Taste the Difference</span>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6">
                Experience Pure Rajasthani Masala
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Order today and taste 35 years of purity in every pinch.
              </p>
              
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 bg-saffron text-charcoal px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-white hover:scale-105 transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

// Extract the image tag from the original content
const imgRegex = /<img src="(data:image[^"]+)"[^>]*>/;
const match = content.match(imgRegex);

let finalContent = newContent;
if (match) {
  const imgTag = `<img src="${match[1]}" alt="Sunil Choudhary, Founder" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />`;
  finalContent = finalContent.replace('<!--BASE64_IMAGE_PLACEHOLDER-->', imgTag);
} else {
  finalContent = finalContent.replace('<!--BASE64_IMAGE_PLACEHOLDER-->', '<div className="w-full h-full bg-cream-dark/50 flex items-center justify-center"><span className="text-4xl">👨‍🍳</span></div>');
}

fs.writeFileSync('app/(customer)/about/page.tsx', finalContent);
console.log('About page successfully rewritten with Tailwind CSS.');
