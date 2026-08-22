import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, CheckCircle2, Clock, Truck, Store, Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalogue | Sunil Choudhary Masala',
};

export default function CataloguePage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📄</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📊</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Corporate Information</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Company Profile & Product Catalogue</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Everything you need to know about SCM, in one document
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20 -mt-8">
        
        <div className="max-w-3xl mx-auto">
          {/* Catalogue Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-cream-dark p-8 md:p-12 mb-16 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cream rounded-full opacity-50 blur-3xl -z-10 -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-brand-red text-white flex items-center justify-center mb-6 shadow-md">
                <FileText size={36} />
              </div>
              
              <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">SCM Company Profile & Catalogue</h2>
              <p className="text-brown text-lg max-w-xl mx-auto mb-8">
                A downloadable overview of Sunil Choudhary Masala — our story, our product range, and information for prospective distributors, retailers, and business partners.
              </p>
              
              <div className="flex items-center gap-6 mb-10 border border-cream-dark/50 bg-cream/30 px-6 py-3 rounded-full">
                <div className="flex items-center gap-2 text-charcoal font-medium">
                  <FileText size={18} className="text-brand-red" />
                  <span>PDF Format</span>
                </div>
                <div className="w-px h-6 bg-cream-dark/50"></div>
                <div className="flex items-center gap-2 text-charcoal font-medium">
                  <Clock size={18} className="text-brand-red" />
                  <span>Coming Soon</span>
                </div>
              </div>
              
              <button disabled className="bg-charcoal/30 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 cursor-not-allowed uppercase tracking-wider text-sm mb-6 w-full sm:w-auto">
                <Download size={20} />
                Download Catalogue (Coming Soon)
              </button>
              
              <p className="text-brown text-sm">
                Need our catalogue urgently? Reach out and we'll share the latest product information directly —{' '}
                <Link href="/contact" className="text-brand-red font-bold hover:underline">
                  Contact Us
                </Link>
              </p>
            </div>
            
            <hr className="my-10 border-cream-dark/30" />
            
            <div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-6 text-center">What This Document Will Include</h4>
              <ul className="space-y-4 max-w-xl mx-auto">
                <li className="flex items-start gap-3 bg-cream/20 p-4 rounded-xl border border-cream-dark/20">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-charcoal font-medium">About Sunil Choudhary Masala — our three-generation story</span>
                </li>
                <li className="flex items-start gap-3 bg-cream/20 p-4 rounded-xl border border-cream-dark/20">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-charcoal font-medium">Full product range with descriptions and pack sizes</span>
                </li>
                <li className="flex items-start gap-3 bg-cream/20 p-4 rounded-xl border border-cream-dark/20">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-charcoal font-medium">Quality & purity commitments</span>
                </li>
                <li className="flex items-start gap-3 bg-cream/20 p-4 rounded-xl border border-cream-dark/20">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-charcoal font-medium">Business partnership information (distributor, retail, creator programs)</span>
                </li>
                <li className="flex items-start gap-3 bg-cream/20 p-4 rounded-xl border border-cream-dark/20">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-charcoal font-medium">Contact details for business enquiries</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center bg-cream-dark/10 p-8 rounded-3xl border border-cream-dark/30">
            <p className="text-brown mb-6">Interested in partnering with SCM? Explore our business programs:</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <Link href="/distributor" className="flex items-center justify-center gap-2 border border-brand-red text-brand-red bg-white hover:bg-brand-red hover:text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors">
                <Truck size={18} />
                Distributor Program
              </Link>
              <Link href="/retail-partner" className="flex items-center justify-center gap-2 border border-brand-red text-brand-red bg-white hover:bg-brand-red hover:text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors">
                <Store size={18} />
                Retail Partner Program
              </Link>
              <Link href="/creator-program" className="flex items-center justify-center gap-2 border border-brand-red text-brand-red bg-white hover:bg-brand-red hover:text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors">
                <Video size={18} />
                Creator Program
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
