import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookies | Sunil Choudhary Masala',
};

export default function CookiesPage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🍪</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌐</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Digital Experience</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Cookie Policy</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            How sunilchoudharymasala.com uses cookies
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <div className="flex items-center gap-2 text-sm text-brown mb-10 pb-6 border-b border-cream-dark/50 bg-cream-dark/10 p-4 rounded-xl">
            <Info size={16} className="text-brand-red shrink-0" />
            <span><strong>Effective Date:</strong> To be Updated <span className="mx-2 text-cream-dark">|</span> This is a draft policy for legal review before publishing</span>
          </div>

          <div className="prose prose-lg prose-brown max-w-none">
            <p className="lead text-xl text-charcoal font-medium">
              This Cookie Policy explains how <strong>Sunil Choudhary Masala (SCM)</strong> uses cookies and similar technologies on sunilchoudharymasala.com (the "Website").
            </p>

            <div className="space-y-12 mt-10">
              
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">1</span>
                  What Are Cookies?
                </h2>
                <p className="text-brown">Cookies are small text files placed on your device when you visit a website. They help the website function properly, remember your preferences, and understand how the site is used.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">2</span>
                  Types of Cookies We Use
                </h2>
                <div className="space-y-4">
                  <p className="text-brown"><strong>Essential Cookies</strong> — required for the Website to function, such as keeping items in your shopping cart, remembering that you are logged in, and maintaining your session during checkout. The Website cannot function properly without these.</p>
                  <p className="text-brown"><strong>Functional Cookies</strong> — remember your preferences, such as your delivery PIN code or previously viewed products, to improve your experience.</p>
                  <p className="text-brown"><strong>Analytics Cookies</strong> — help us understand how visitors use the Website (such as which pages are visited and how long visitors stay) so that we can improve our products and services.</p>
                  <p className="text-brown"><strong>Marketing Cookies</strong> — may be used to show you relevant offers and measure the effectiveness of our promotions, where enabled.</p>
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">3</span>
                  Third-Party Cookies
                </h2>
                <p className="text-brown">Some cookies may be placed by trusted third-party service providers we work with, such as payment gateway providers (for secure checkout) and analytics providers (to help us understand Website usage). These third parties have their own privacy and cookie policies.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">4</span>
                  Managing Cookies
                </h2>
                <p className="text-brown">Most web browsers allow you to control cookies through their settings, including blocking or deleting cookies. Please note that disabling essential cookies may affect the functionality of the Website, such as your ability to add items to the cart or complete checkout.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">5</span>
                  Your Consent
                </h2>
                <p className="text-brown">By continuing to browse and use the Website, you consent to our use of cookies as described in this policy. Where required by law, we will seek your explicit consent for non-essential cookies.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">6</span>
                  Changes to This Policy
                </h2>
                <p className="text-brown">SCM reserves the right to update this Cookie Policy at any time. Any changes will be published on this page with the revised effective date.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">7</span>
                  Contact Us
                </h2>
                <p className="text-brown">If you have any questions about our use of cookies, please contact us using the details below.</p>
              </section>
            </div>
          </div>

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 border border-cream-dark/50">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Questions About Cookies?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brown">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-saffron shadow-sm">
                  <Phone size={18} />
                </div>
                <span>+91 98752 31865</span>
              </div>
              <div className="flex items-center gap-3 text-brown">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-saffron shadow-sm">
                  <Mail size={18} />
                </div>
                <span>sunilchoudharymasala@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-brown">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-saffron shadow-sm">
                  <Clock size={18} />
                </div>
                <span>Monday – Sunday, 9:00 AM – 7:00 PM (IST)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-cream-dark/30 pt-8">
            <p className="font-playfair text-xl italic text-brand-red/80">
              Thank you for choosing Sunil Choudhary Masala — Three Generations of Trust.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
