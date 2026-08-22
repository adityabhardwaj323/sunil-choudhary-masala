const fs = require('fs');

const file = 'D:\\sunil-choudhary-masala\\app\\(customer)\\heritage\\page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<img src="(data:image\/jpeg;base64,[^"]+)"/g;
let match;
let images = [];
while ((match = regex.exec(content)) !== null) {
  images.push(match[1]);
}

const newContent = `import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Heritage | Sunil Choudhary Masala',
};

export default function HeritagePage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🏺</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">✨</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Our Story</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Heritage</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Three generations of one family's commitment to pure, honest spices
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <div className="prose prose-lg prose-brown max-w-none">
            <p className="lead text-xl text-charcoal font-medium italic font-playfair text-center border-b border-cream-dark/50 pb-8 mb-10">
              "Sunil Choudhary Masala did not begin as a company. It began as a family's everyday practice of grinding spices at home — the same way it had been done for generations before it — carried forward with care, patience, and an unwillingness to cut corners."
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12 items-center bg-cream/30 p-6 rounded-2xl border border-cream-dark/30">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img src="${images[0] || ''}" alt="Vintage Spice Market" className="w-full h-auto object-cover aspect-[4/3]" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold text-brand-red mb-4">The Early Days (1950s)</h3>
                <p className="text-brown">Before there were factories, there were courtyards. Our grandfather, the late Shri Ramchandra Choudhary, began sourcing whole spices from local farmers in Rajasthan. He insisted on hand-picking the produce, ensuring only the finest grades made it home.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 my-12 items-center bg-cream/30 p-6 rounded-2xl border border-cream-dark/30">
              <div className="order-2 md:order-1">
                <h3 className="font-playfair text-2xl font-bold text-brand-red mb-4">The First Mill (1978)</h3>
                <p className="text-brown">As word of our family's spice blends spread, the demand outgrew the mortar and pestle. Sunil Choudhary (Second Generation) established our first dedicated milling facility. The core philosophy remained unchanged: no artificial colours, no fillers, just pure spice.</p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-md order-1 md:order-2">
                <img src="${images[1] || ''}" alt="Traditional Grinding Process" className="w-full h-auto object-cover aspect-[4/3]" />
              </div>
            </div>

            <div className="space-y-6 mt-12">
              <h2 className="font-playfair text-3xl font-bold text-charcoal">Three Generations of Trust</h2>
              <p className="text-brown">Today, Sunil Choudhary Masala (SCM) is managed by the third generation. We have modernised our packaging and expanded our reach across India, but we still source our chillies from the same regions, our turmeric from the same trusted farms, and we still refuse to compromise on purity.</p>
              <p className="text-brown">Our heritage is not just in how long we have been in business. It is in the fact that the Red Chilli Powder you buy from us today tastes exactly as it did fifty years ago — pure, potent, and honest.</p>
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="font-kalam text-3xl text-brand-red mb-4">Shuddhta Hi Hamari Pehchaan Hai</h3>
              <p className="text-charcoal font-medium uppercase tracking-widest text-sm">— The Choudhary Family</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, newContent);
console.log('Heritage page rewritten');
