'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Tags, Box, MessageSquare, CheckCircle2, Phone, Mail, Send } from 'lucide-react';

export default function RetailPartnerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🏪</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🛒</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Business Opportunities</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Retail Partner Program</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Stock authentic, trusted SCM spices in your store
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20">
        
        <div className="text-center max-w-3xl mx-auto my-16">
          <p className="text-xl text-charcoal font-medium leading-relaxed">
            SCM welcomes enquiries from kirana stores, supermarkets, departmental stores, grocery outlets, and other retail businesses interested in stocking our products.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Star size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">A Name Customers Trust</h3>
            <p className="text-brown">SCM's three-generation reputation for purity helps build customer confidence on your shelf.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Tags size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Everyday Essentials</h3>
            <p className="text-brown">Chilli, turmeric, coriander, garam masala — products your customers buy regularly.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Box size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Consistent Supply</h3>
            <p className="text-brown">We work with our retail partners to keep stock flowing reliably.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Direct Communication</h3>
            <p className="text-brown">A responsive business team you can reach for orders, queries, or support.</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal">How It Works</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-6 bg-cream/30 rounded-2xl border border-cream-dark/50">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-md">1</div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2 mt-2">Submit Enquiry</h4>
              <p className="text-brown text-sm">Share your store details and the products you'd like to stock.</p>
            </div>
            <div className="relative p-6 bg-cream/30 rounded-2xl border border-cream-dark/50">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-md">2</div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2 mt-2">Team Review</h4>
              <p className="text-brown text-sm">Our business team reviews your enquiry and store profile.</p>
            </div>
            <div className="relative p-6 bg-cream/30 rounded-2xl border border-cream-dark/50">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-md">3</div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2 mt-2">Order Setup</h4>
              <p className="text-brown text-sm">We discuss quantities, terms, and set up your first order.</p>
            </div>
            <div className="relative p-6 bg-cream/30 rounded-2xl border border-cream-dark/50">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-md">4</div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2 mt-2">Ongoing Supply</h4>
              <p className="text-brown text-sm">Reorder as needed through your dedicated point of contact.</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-cream-dark overflow-hidden flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="bg-charcoal text-white p-10 md:p-16 lg:w-2/5 flex flex-col justify-between relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-red rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="font-playfair text-3xl font-bold mb-6 text-saffron">Who Can Apply?</h3>
              <p className="text-cream-mid text-lg mb-10 leading-relaxed">
                We're open to retail partners of all sizes.
              </p>
              
              <ul className="space-y-4 mb-12">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Kirana & general stores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Supermarkets & departmental stores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Grocery outlets & chains</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Other retail food businesses</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4 relative z-10 pt-8 border-t border-cream-dark/20">
              <div className="flex items-center gap-4 text-cream">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-saffron">
                  <Phone size={18} />
                </div>
                <span>+91 98752 31865</span>
              </div>
              <div className="flex items-center gap-4 text-cream">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-saffron">
                  <Mail size={18} />
                </div>
                <span>sunilchoudharymasala@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:p-16 lg:w-3/5">
            {!isSuccess ? (
              <div>
                <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">Retail Partner Enquiry Form</h2>
                <p className="text-brown mb-8">Tell us about your store and we'll get in touch.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Full Name *</label>
                      <input type="text" required placeholder="Your name" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Store / Business Name *</label>
                      <input type="text" required placeholder="Your store name" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Phone Number *</label>
                      <input type="tel" required placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Email Address</label>
                      <input type="email" placeholder="you@email.com" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Store Location *</label>
                      <input type="text" required placeholder="City / area" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Store Type</label>
                      <select className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow appearance-none">
                        <option value="">Select store type</option>
                        <option>Kirana / General Store</option>
                        <option>Supermarket</option>
                        <option>Departmental Store</option>
                        <option>Grocery Outlet</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Products You're Interested In</label>
                    <input type="text" placeholder="e.g. Chilli powder, Garam Masala, full range" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Additional Details</label>
                    <textarea rows={4} placeholder="Tell us more about your store and expected order volume" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow resize-none"></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-800 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">Thank You!</h3>
                <p className="text-brown text-lg max-w-md mx-auto">
                  Your retail partner enquiry has been received. Our business team will review your details and get in touch with you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-brand-red font-medium hover:underline"
                >
                  Submit another enquiry
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
