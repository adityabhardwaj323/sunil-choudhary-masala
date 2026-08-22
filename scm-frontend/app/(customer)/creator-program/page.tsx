'use client';

import { useState } from 'react';
import { Gift, Utensils, Users, Megaphone, ChefHat, Home, Heart, Video, CheckCircle2, Phone, Mail, Send } from 'lucide-react';

export default function CreatorProgramPage() {
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
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">✨</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📸</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Collaborate With Us</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Creator Partnership Program</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Collaborate with SCM — bring authentic Rajasthani flavour to your content
          </p>
        </div>
      </div>

      <div className="container-custom relative z-20">
        
        <div className="text-center max-w-3xl mx-auto my-16">
          <p className="text-xl text-charcoal font-medium leading-relaxed">
            SCM offers a Creator Partnership Program for eligible food, cooking, lifestyle, and family content creators. Collaborations are currently offered on a barter basis — we send you our products to feature, cook with, and share with your audience.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Gift size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Product Barter</h3>
            <p className="text-brown">Receive a curated selection of SCM spices to use and feature in your content.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Utensils size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Authentic Story</h3>
            <p className="text-brown">A genuine three-generation family brand story that fits naturally into food & family content.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Ongoing Relationship</h3>
            <p className="text-brown">We're open to continuing collaborations with creators whose content resonates with our audience.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark/50 hover:shadow-md hover:border-brand-red/30 transition-all text-center group">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
              <Megaphone size={28} />
            </div>
            <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">Cross-Promotion</h3>
            <p className="text-brown">We may feature select creator content on our own channels, with credit.</p>
          </div>
        </div>

        {/* Who We're Looking For */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal">Who We're Looking For</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-brand-red flex items-center justify-center mb-4 shadow-sm border border-cream-dark/30">
                <ChefHat size={20} />
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">Food & Cooking Creators</h4>
              <p className="text-brown text-sm">Recipe videos, cooking demos, kitchen content.</p>
            </div>
            <div className="p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-brand-red flex items-center justify-center mb-4 shadow-sm border border-cream-dark/30">
                <Home size={20} />
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">Lifestyle Creators</h4>
              <p className="text-brown text-sm">Home, kitchen, and everyday-life content.</p>
            </div>
            <div className="p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-brand-red flex items-center justify-center mb-4 shadow-sm border border-cream-dark/30">
                <Heart size={20} />
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">Family Creators</h4>
              <p className="text-brown text-sm">Family vlogs, home-cooking, generational content.</p>
            </div>
            <div className="p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-brand-red flex items-center justify-center mb-4 shadow-sm border border-cream-dark/30">
                <Video size={20} />
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">Instagram & YouTube</h4>
              <p className="text-brown text-sm">Active creators on either or both platforms are welcome to apply.</p>
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
              <h3 className="font-playfair text-3xl font-bold mb-6 text-saffron">Good to Know</h3>
              <p className="text-cream-mid text-lg mb-10 leading-relaxed">
                A few honest notes before you apply:
              </p>
              
              <ul className="space-y-4 mb-12">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Collaborations are currently barter-based (product for content), not paid</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">We review every application — not all applicants will be selected</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">We look for genuine engagement over follower count alone</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-red shrink-0 mt-0.5" size={20} />
                  <span className="text-cream">Response times may vary depending on volume of applications</span>
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
                <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">Creator Application Form</h2>
                <p className="text-brown mb-8">Tell us about you and your content.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Full Name *</label>
                      <input type="text" required placeholder="Your name" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Creator / Channel Name</label>
                      <input type="text" placeholder="Your page or channel name" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
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
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Instagram Handle</label>
                      <input type="text" placeholder="@yourhandle" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">YouTube Channel</label>
                      <input type="text" placeholder="Channel link or name" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Follower / Subscriber Count</label>
                      <input type="text" placeholder="Approximate, across platforms" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Content Category</label>
                      <select className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow appearance-none">
                        <option value="">Select category</option>
                        <option>Food & Cooking</option>
                        <option>Lifestyle</option>
                        <option>Family</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-charcoal tracking-wide uppercase">Tell Us About Your Content</label>
                    <textarea rows={4} placeholder="What kind of content do you create, and how would you like to collaborate with SCM?" className="w-full px-4 py-3 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-shadow resize-none"></textarea>
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
                        Submit Application
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
                <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">Application Received!</h3>
                <p className="text-brown text-lg max-w-md mx-auto">
                  Thank you for your interest in the SCM Creator Partnership Program. Our team will review your application and reach out if it's a good fit.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-brand-red font-medium hover:underline"
                >
                  Submit another application
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
