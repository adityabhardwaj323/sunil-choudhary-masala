'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Facebook, Instagram, Youtube, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📬</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📞</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Get In Touch</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            We'd love to hear from you — orders, queries, or just a hello!
          </p>
        </div>
      </div>

      <div className="container-custom max-w-6xl -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-charcoal text-cream-mid rounded-3xl p-8 md:p-12 shadow-2xl border border-charcoal relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>

            <h2 className="font-playfair text-3xl font-bold text-white mb-3 relative z-10">Get in Touch</h2>
            <p className="text-cream-dark mb-10 relative z-10">Our team is ready to help Monday to Saturday</p>
            
            <div className="space-y-8 relative z-10 mb-12">
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron shrink-0 group-hover:bg-saffron group-hover:text-charcoal transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">Address</div>
                  <div className="leading-relaxed">Sunil Choudhary Masala,<br/>Main Market,<br/>Rajasthan — 302001</div>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron shrink-0 group-hover:bg-saffron group-hover:text-charcoal transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">Phone / WhatsApp</div>
                  <div>+91 98752 31865</div>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron shrink-0 group-hover:bg-saffron group-hover:text-charcoal transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">Email</div>
                  <div>info@sunilchoudharymasala.com</div>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#25D366] shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">WhatsApp Order</div>
                  <div>
                    <a href="https://wa.me/919875231865" className="text-saffron hover:text-white transition-colors flex items-center gap-1">
                      Chat to Order Directly <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 mb-10">
               <div className="flex items-center gap-2 text-white font-bold mb-4">
                 <Clock size={20} className="text-saffron" />
                 Business Hours
               </div>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between items-center pb-2 border-b border-white/10">
                   <span>Monday – Friday</span>
                   <span className="text-white font-medium">9:00 AM – 7:00 PM</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b border-white/10">
                   <span>Saturday</span>
                   <span className="text-white font-medium">9:00 AM – 5:00 PM</span>
                 </div>
                 <div className="flex justify-between items-center opacity-50">
                   <span>Sunday</span>
                   <span>Closed</span>
                 </div>
               </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3 relative z-10">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-saffron hover:text-charcoal transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-saffron hover:text-charcoal transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-saffron hover:text-charcoal transition-colors duration-300">
                <Youtube size={20} />
              </a>
            </div>

          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark">
            {!success ? (
              <div>
                <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">Send Us a Message</h2>
                <p className="text-brown mb-8">Fill the form and we'll reply within 24 hours.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-bold text-charcoal">First Name *</label>
                      <input 
                        type="text" 
                        id="firstName"
                        name="firstName" 
                        required 
                        placeholder="Sunil" 
                        value={formData.firstName} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-bold text-charcoal">Last Name *</label>
                      <input 
                        type="text" 
                        id="lastName"
                        name="lastName" 
                        required 
                        placeholder="Sharma" 
                        value={formData.lastName} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-bold text-charcoal">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-charcoal">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email" 
                        placeholder="you@email.com" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-bold text-charcoal">Subject *</label>
                    <select 
                      id="subject"
                      name="subject" 
                      required 
                      value={formData.subject} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b5c53\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      <option value="">Select a subject</option>
                      <option>Order Enquiry</option>
                      <option>Product Information</option>
                      <option>Bulk / Wholesale Order</option>
                      <option>Complaint / Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-charcoal">Message *</label>
                    <textarea 
                      id="message"
                      name="message" 
                      required 
                      rows={5}
                      placeholder="Tell us how we can help you..." 
                      value={formData.message} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-cream transition-colors resize-y"
                    ></textarea>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-red hover:bg-charcoal text-white font-bold py-4 px-8 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-sm text-brown mt-6 text-center">
                  We usually reply within 24 hours on working days
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">Message Sent!</h3>
                <p className="text-lg text-brown mb-8 max-w-md">
                  Thank you for reaching out. We have received your message and our team will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-white border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-24 container-custom max-w-6xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 text-brand-red font-bold tracking-widest uppercase text-sm mb-4">
            <span className="w-8 h-px bg-brand-red"></span>
            Find Us
            <span className="w-8 h-px bg-brand-red"></span>
          </div>
          <h2 className="font-playfair text-4xl font-bold text-charcoal">Our Location</h2>
        </div>
        
        <div className="w-full bg-cream-dark/30 rounded-3xl overflow-hidden border border-cream-dark shadow-sm h-[400px] flex flex-col items-center justify-center text-center p-8 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-40 mix-blend-overlay"></div>
          
          <div className="w-20 h-20 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-6 relative z-10 animate-bounce">
            <MapPin size={40} />
          </div>
          <h3 className="font-bold text-charcoal text-xl mb-2 relative z-10">Sunil Choudhary Masala, Rajasthan</h3>
          <p className="text-brown relative z-10">Google Map Integration Area</p>
        </div>
      </div>
    </div>
  );
}
