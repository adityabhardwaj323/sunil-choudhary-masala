import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy | Sunil Choudhary Masala',
};

export default function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🔒</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🛡️</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Data Protection</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            How we collect, use and protect your information
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
              <strong>Sunil Choudhary Masala (SCM)</strong> ("we", "us", "our") respects your privacy and is committed to protecting the personal information you share with us through sunilchoudharymasala.com (the "Website"). This Privacy Policy explains what information we collect, how we use it, and the choices you have.
            </p>

            <div className="space-y-12 mt-10">
              
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">1</span>
                  Information We Collect
                </h2>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li><strong>Contact & account details:</strong> name, email address, phone number, and delivery address(es).</li>
                  <li><strong>Order information:</strong> products purchased, order value, and order history.</li>
                  <li><strong>Payment information:</strong> processed securely by our payment gateway partners; SCM does not store your full card or UPI credentials.</li>
                  <li><strong>Communication data:</strong> messages you send us via the Contact Us form, WhatsApp, email, or phone.</li>
                  <li><strong>Technical data:</strong> IP address, browser type, device information, and pages visited, collected automatically (see our <Link href="/cookies" className="text-brand-red hover:underline font-medium">Cookie Policy</Link>).</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">2</span>
                  How We Use Your Information
                </h2>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>To process and deliver your orders, and to send order confirmations and delivery updates.</li>
                  <li>To respond to customer support queries, complaints, and return/refund requests.</li>
                  <li>To improve our Website, products, and customer experience.</li>
                  <li>To send offers, newsletters, or promotional communication, where you have opted in.</li>
                  <li>To detect and prevent fraud, and to comply with applicable legal requirements.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">3</span>
                  Sharing of Information
                </h2>
                <p className="text-brown mb-4">We do not sell your personal information. We may share information with:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>Courier and logistics partners, to deliver your order.</li>
                  <li>Payment gateway providers, to process payments securely.</li>
                  <li>Service providers who help us operate the Website (such as hosting or analytics), under confidentiality obligations.</li>
                  <li>Government or regulatory authorities, where required by law.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">4</span>
                  Data Security
                </h2>
                <p className="text-brown">We use reasonable technical and organisational measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">5</span>
                  Cookies
                </h2>
                <p className="text-brown">The Website uses cookies to keep your cart working, remember your preferences, and understand how the Website is used. Please see our <Link href="/cookies" className="text-brand-red hover:underline font-medium">Cookie Policy</Link> for details.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">6</span>
                  Your Rights & Choices
                </h2>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>You may request access to, correction of, or deletion of your personal information by contacting us.</li>
                  <li>You may opt out of promotional emails or messages at any time using the unsubscribe link or by contacting customer support.</li>
                  <li>You may disable cookies through your browser settings, though this may affect Website functionality.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">7</span>
                  Data Retention
                </h2>
                <p className="text-brown">We retain your personal information for as long as necessary to fulfil the purposes described in this policy, including order history, legal, accounting, and reporting requirements.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">8</span>
                  Children's Privacy
                </h2>
                <p className="text-brown">The Website is not directed at children, and we do not knowingly collect personal information from children.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">9</span>
                  Changes to This Policy
                </h2>
                <p className="text-brown">SCM reserves the right to update this Privacy Policy at any time. Any changes will be published on this page with the revised effective date.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">10</span>
                  Contact Us
                </h2>
                <p className="text-brown">If you have any questions about this Privacy Policy or how your information is handled, please contact us using the details below.</p>
              </section>
            </div>
          </div>

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 border border-cream-dark/50">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Privacy Questions?</h3>
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
