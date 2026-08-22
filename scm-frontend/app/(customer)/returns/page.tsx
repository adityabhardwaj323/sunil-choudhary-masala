import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns | Sunil Choudhary Masala',
};

export default function ReturnsPage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🔄</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🤝</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Customer Satisfaction</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Return & Refund Policy</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Our commitment to quality — and what to do if something's not right
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <div className="flex items-center gap-2 text-sm text-brown mb-10 pb-6 border-b border-cream-dark/50 bg-cream-dark/10 p-4 rounded-xl">
            <Info size={16} className="text-brand-red shrink-0" />
            <span><strong>Effective Date:</strong> To be Updated <span className="mx-2 text-cream-dark">|</span> Applies to all orders placed on sunilchoudharymasala.com</span>
          </div>

          <div className="prose prose-lg prose-brown max-w-none">
            <p className="lead text-xl text-charcoal font-medium">
              At <strong>Sunil Choudhary Masala (SCM)</strong>, customer satisfaction is our priority. We take great care in ensuring that every product is carefully packed and delivered in excellent condition. Please read this Return & Refund Policy before making a purchase.
            </p>

            <div className="space-y-12 mt-10">
              
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">1</span>
                  Eligibility for Returns
                </h2>
                <p className="text-brown mb-4">You may request a return or replacement only in the following situations:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4 mb-4">
                  <li>You received a damaged product.</li>
                  <li>You received an incorrect product.</li>
                  <li>The product was missing from your order.</li>
                  <li>The product was expired or unfit for consumption at the time of delivery.</li>
                </ul>
                <p className="text-brown">To be eligible, the issue must be reported within <strong>48 hours</strong> of receiving the order.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">2</span>
                  Non-Returnable Products
                </h2>
                <p className="text-brown mb-4">For food safety and hygiene reasons, SCM does <strong>not</strong> accept returns for:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>Opened or used products.</li>
                  <li>Products whose original packaging has been damaged after delivery.</li>
                  <li>Products damaged due to improper storage or handling by the customer.</li>
                  <li>Products returned after the specified reporting period.</li>
                  <li>Change of mind or personal taste preferences.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">3</span>
                  Return Request Process
                </h2>
                <p className="text-brown mb-4">To request a return or replacement, please contact our customer support team with:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4 mb-4">
                  <li>Order number</li>
                  <li>Customer name</li>
                  <li>Contact number</li>
                  <li>Clear photographs of the product</li>
                  <li>Photographs of the packaging</li>
                  <li>A brief description of the issue</li>
                </ul>
                <p className="text-brown">Our team will review your request and may ask for additional information if required.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">4</span>
                  Inspection & Approval
                </h2>
                <p className="text-brown">Once your request is received, our support team will verify the details and may request additional photographs or information. Approved requests will proceed with a replacement or refund, depending on the nature of the issue and product availability. SCM reserves the right to reject claims that do not meet the eligibility criteria.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">5</span>
                  Replacement Policy
                </h2>
                <p className="text-brown">Where applicable, SCM may offer a replacement instead of a refund. Replacement products are subject to stock availability. If the same product is unavailable, SCM may provide an equivalent product of similar value, or a refund, as applicable.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">6</span>
                  Refund Policy
                </h2>
                <p className="text-brown">Refunds will be initiated only after the return request has been approved. Approved refunds will be processed to the original payment method used during purchase. The time taken for the refund to reflect in your account depends on your bank or payment provider.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">7</span>
                  Cancellations
                </h2>
                <p className="text-brown">Orders can be cancelled only before they are dispatched. Once an order has been shipped, it cannot be cancelled — any eligible issues after delivery will be handled according to this policy. See our full <Link href="/cancellation" className="text-brand-red hover:underline font-medium">Cancellation Policy</Link> for details.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">8</span>
                  Incorrect Delivery Information
                </h2>
                <p className="text-brown">Customers are responsible for providing accurate shipping details. SCM will not be responsible for failed deliveries or additional shipping charges caused by an incorrect address, PIN code, contact number, or incomplete recipient information.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">9</span>
                  Quality Assurance
                </h2>
                <p className="text-brown">Every SCM product is carefully selected, hygienically processed, and securely packed before dispatch. As our products are natural food items, slight variations in colour, aroma, texture, or appearance may occur due to seasonal and agricultural factors. Such natural variations do not qualify as product defects.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">10</span>
                  Policy Updates
                </h2>
                <p className="text-brown">SCM reserves the right to amend or update this Return & Refund Policy at any time without prior notice. Any changes will be published on this page with the revised effective date.</p>
              </section>
            </div>
          </div>

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 border border-cream-dark/50">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Return & Refund Queries</h3>
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
