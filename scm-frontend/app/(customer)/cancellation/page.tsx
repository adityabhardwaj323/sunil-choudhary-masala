import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation | Sunil Choudhary Masala',
};

import { Info, Clock, CheckCircle2, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CancellationPage() {
  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-16 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🌶️</div>
        
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Cancellation Policy</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-cream-dark/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Cancellation</span>
          </div>
          <p className="text-cream-mid max-w-xl mx-auto text-lg">
            When and how you can cancel an order
          </p>
        </div>
      </div>

      <div className="container-custom mt-12 max-w-4xl">
        <div className="bg-white rounded-3xl border border-cream-dark shadow-sm overflow-hidden">
          {/* Policy Meta */}
          <div className="bg-cream-dark/20 p-5 md:px-8 md:py-6 border-b border-cream-dark flex flex-col md:flex-row gap-3 md:items-center text-sm font-medium text-brown">
            <div className="flex items-center gap-2">
              <Info size={18} className="text-saffron" />
              <span>Effective Date: <strong>To be Updated</strong></span>
            </div>
            <span className="hidden md:block text-cream-dark">|</span>
            <span>Applies to all orders placed on sunilchoudharymasala.com</span>
          </div>

          {/* Policy Content */}
          <div className="p-6 md:p-10 prose prose-lg prose-brown max-w-none">
            <p className="text-charcoal text-lg mb-8">
              We understand that plans can change. This Cancellation Policy explains when and how you can cancel an order placed with <strong>Sunil Choudhary Masala (SCM)</strong>.
            </p>

            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">1</span>
                  Cancellation Before Dispatch
                </h2>
                <p className="pl-14 text-brown">
                  You may cancel your order <strong className="text-charcoal">free of charge</strong> at any time before it has been dispatched. To cancel, contact our customer support team as soon as possible with your order number, and we will process the cancellation and initiate a full refund (if payment was already made) to your original payment method.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">2</span>
                  Cancellation After Dispatch
                </h2>
                <p className="pl-14 text-brown">
                  Once an order has been shipped, it <strong className="text-brand-red">cannot be cancelled</strong>. If you no longer want the shipment, you may refuse delivery, and eligible issues after delivery (damaged, incorrect, missing, or expired product) will be handled under our <Link href="/returns" className="text-saffron font-bold hover:text-brand-red transition-colors underline decoration-2 underline-offset-4">Return &amp; Refund Policy</Link> instead.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">3</span>
                  How to Request a Cancellation
                </h2>
                <ul className="pl-14 space-y-3 text-brown marker:text-saffron list-disc">
                  <li>Contact us via phone, WhatsApp, or email as soon as possible after placing the order.</li>
                  <li>Share your order number and registered mobile number so we can verify the order quickly.</li>
                  <li>Our team will confirm whether the order has been dispatched and process the cancellation if it is still eligible.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">4</span>
                  Cancellations Initiated by SCM
                </h2>
                <p className="pl-14 text-brown">
                  In rare cases, SCM may need to cancel an order &mdash; for example, if the delivery location is not serviceable, if the product is out of stock, if a pricing or listing error is identified, or if fraudulent or suspicious activity is suspected. In such cases, we will notify you and issue a full refund for any amount already paid.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">5</span>
                  Refunds for Cancelled Orders
                </h2>
                <p className="pl-14 text-brown">
                  Approved cancellations will be refunded to the original payment method used at checkout. The time taken for the refund to reflect in your account depends on your bank or payment provider, and is otherwise handled as described in our <Link href="/returns" className="text-saffron font-bold hover:text-brand-red transition-colors underline decoration-2 underline-offset-4">Return &amp; Refund Policy</Link>.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">6</span>
                  Bulk, Distributor &amp; Business Orders
                </h2>
                <p className="pl-14 text-brown">
                  Cancellation terms for wholesale, distributor, or bulk orders may differ from standard customer orders and will be communicated separately by our business team at the time of order confirmation.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="w-10 h-10 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-lg shrink-0">7</span>
                  Policy Updates
                </h2>
                <p className="pl-14 text-brown">
                  SCM reserves the right to modify or update this Cancellation Policy at any time without prior notice. Any changes will be published on this page with the revised effective date.
                </p>
              </section>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-cream p-8 md:p-10 border-t border-cream-dark">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6 text-center">Need to Cancel an Order?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-cream-dark shadow-sm">
                <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mb-4">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold text-charcoal mb-1">Phone / WhatsApp</h4>
                <p className="text-brown text-sm">+91 98752 31865</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-cream-dark shadow-sm">
                <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold text-charcoal mb-1">Email Support</h4>
                <p className="text-brown text-sm">sunilchoudharymasala@gmail.com</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-cream-dark shadow-sm">
                <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold text-charcoal mb-1">Working Hours</h4>
                <p className="text-brown text-sm">Mon &ndash; Sun, 9:00 AM &ndash; 7:00 PM</p>
              </div>
            </div>
            
            <p className="text-center text-saffron font-medium mt-8 font-playfair italic text-lg">
              Thank you for choosing Sunil Choudhary Masala &mdash; Three Generations of Trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
