import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms | Sunil Choudhary Masala',
};

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">⚖️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📜</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Legal Information</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Terms & Conditions</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            The terms that govern your use of our Website and orders
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
              These Terms & Conditions ("Terms") govern your use of sunilchoudharymasala.com (the "Website"), owned and operated by <strong>Sunil Choudhary Masala (SCM)</strong>. By accessing or using the Website, you agree to be bound by these Terms.
            </p>

            <div className="space-y-12 mt-10">
              
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">1</span>
                  About Us
                </h2>
                <p className="text-brown">SCM is a spice and masala brand offering products including Red Chilli, Coriander, Turmeric, Dry Fruits, Makhana, and Cooking Oils for sale through this Website.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">2</span>
                  Eligibility
                </h2>
                <p className="text-brown">You must be at least 18 years old, or using the Website under the supervision of a parent or guardian, to place an order. By placing an order, you confirm that the information you provide is accurate and complete.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">3</span>
                  Account Registration
                </h2>
                <p className="text-brown">You are responsible for maintaining the confidentiality of your account login details and for all activities carried out under your account. Please notify us immediately of any unauthorised use of your account.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">4</span>
                  Products & Pricing
                </h2>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>We strive to display accurate product images and descriptions; actual packaging may vary slightly due to product updates or manufacturing changes.</li>
                  <li>Prices are listed in Indian Rupees (INR) and are subject to change without prior notice.</li>
                  <li>In the event of a pricing or listing error, SCM reserves the right to cancel the affected order and issue a full refund.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">5</span>
                  Orders & Payment
                </h2>
                <p className="text-brown">By placing an order, you make an offer to purchase the selected products, which SCM may accept or decline. Payment must be completed through the accepted payment methods displayed at checkout. Order confirmation will be sent via email or SMS once payment is successfully processed.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">6</span>
                  Shipping, Returns & Cancellations
                </h2>
                <p className="text-brown">Shipping timelines and charges are described in our <Link href="/shipping" className="text-brand-red hover:underline font-medium">Shipping Policy</Link>. Returns and refunds are governed by our <Link href="/returns" className="text-brand-red hover:underline font-medium">Return & Refund Policy</Link>, and order cancellations by our <Link href="/cancellation" className="text-brand-red hover:underline font-medium">Cancellation Policy</Link>. These policies form part of these Terms.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">7</span>
                  Intellectual Property
                </h2>
                <p className="text-brown">All content on the Website — including the SCM name, logo, product photography, and text — is the property of Sunil Choudhary Masala and may not be copied, reproduced, or used without our written permission.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">8</span>
                  User Conduct
                </h2>
                <p className="text-brown">You agree not to misuse the Website, including attempting to gain unauthorised access, interfering with its operation, or submitting false or fraudulent orders.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">9</span>
                  Limitation of Liability
                </h2>
                <p className="text-brown">To the extent permitted by law, SCM shall not be liable for any indirect, incidental, or consequential loss arising from the use of the Website or products, except where such liability cannot be excluded under applicable law.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">10</span>
                  Governing Law
                </h2>
                <p className="text-brown">These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Rajasthan.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">11</span>
                  Changes to These Terms
                </h2>
                <p className="text-brown">SCM reserves the right to update these Terms at any time. Continued use of the Website after changes are posted constitutes acceptance of the revised Terms.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">12</span>
                  Contact Us
                </h2>
                <p className="text-brown">For any questions regarding these Terms, please contact us using the details below.</p>
              </section>
            </div>
          </div>

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 border border-cream-dark/50">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Questions About These Terms?</h3>
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
