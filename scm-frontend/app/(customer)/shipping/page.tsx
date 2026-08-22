import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping | Sunil Choudhary Masala',
};

export default function ShippingPage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        {/* Subtle background watermarks */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">🚚</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">📦</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Delivery Information</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Shipping Policy</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            How we pack, dispatch and deliver your SCM order
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
              Welcome to <strong>Sunil Choudhary Masala (SCM)</strong>. We are committed to delivering our products safely and on time. Please read our shipping policy carefully before placing an order.
            </p>

            <div className="space-y-12 mt-10">
              
              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">1</span>
                  Order Processing
                </h2>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4">
                  <li>Orders are processed within <strong>1–2 business days</strong> after successful payment confirmation.</li>
                  <li>Orders placed on Sundays or public holidays will be processed on the next working day.</li>
                  <li>During festivals, promotional sales, or unforeseen circumstances, processing times may be slightly longer.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">2</span>
                  Delivery Locations
                </h2>
                <p className="text-brown mb-4">SCM currently delivers to <strong>most serviceable locations across India</strong>. Delivery availability depends on:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4 mb-4">
                  <li>Courier service coverage</li>
                  <li>Serviceable PIN code</li>
                  <li>Local logistics availability</li>
                </ul>
                <p className="text-brown">If your location is not serviceable, we will inform you as soon as possible and initiate a refund if payment has already been made.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">3</span>
                  Estimated Delivery Time
                </h2>
                <p className="text-brown mb-4">Estimated delivery timelines are:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4 mb-4">
                  <li><strong>Metro Cities:</strong> 2–5 business days</li>
                  <li><strong>Other Cities & Towns:</strong> 3–7 business days</li>
                  <li><strong>Remote Areas:</strong> 5–10 business days</li>
                </ul>
                <p className="text-brown">Delivery times are estimates and may vary depending on courier operations and location.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">4</span>
                  Shipping Charges
                </h2>
                <p className="text-brown">Shipping charges, if applicable, will be displayed during checkout before payment. From time to time, SCM may offer free shipping, promotional shipping discounts, or special festival offers — these are subject to change without prior notice.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">5</span>
                  Packaging
                </h2>
                <p className="text-brown">Every SCM product is carefully packed using hygienic and secure packaging to ensure freshness and prevent damage during transit.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">6</span>
                  Delivery Delays
                </h2>
                <p className="text-brown">Although we strive for timely deliveries, delays may occur due to extreme weather conditions, public holidays, natural disasters, transport disruptions, government restrictions, or courier operational issues. SCM is not responsible for delays caused by events beyond our control.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">7</span>
                  Incorrect Shipping Address
                </h2>
                <p className="text-brown">Customers are responsible for providing complete and accurate shipping information. SCM will not be responsible for delays or failed deliveries resulting from an incorrect address, wrong PIN code, incorrect mobile number, or incomplete recipient details. Additional shipping charges may apply if an order needs to be re-shipped.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">8</span>
                  Delivery Attempts
                </h2>
                <p className="text-brown">Our courier partners may attempt delivery multiple times. If delivery cannot be completed due to customer unavailability or incorrect information, the package may be returned to SCM. Re-shipping charges may apply where applicable.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">9</span>
                  Damaged or Tampered Packages
                </h2>
                <p className="text-brown mb-4">If your package appears damaged, opened, or tampered with at the time of delivery:</p>
                <ul className="space-y-2 list-disc list-inside text-brown ml-4 mb-4">
                  <li>Do not accept the package if possible.</li>
                  <li>Take clear photographs of the package.</li>
                  <li>Contact SCM Customer Support immediately.</li>
                </ul>
                <p className="text-brown">Claims reported after delivery may require additional verification.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">10</span>
                  Missing or Incorrect Products
                </h2>
                <p className="text-brown">If you receive an incorrect product, a missing item, or a damaged product, please contact us within <strong>48 hours</strong> of receiving your order with your order number, product photographs, packaging photographs, and a brief description of the issue. Our team will investigate and provide an appropriate resolution.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">11</span>
                  Bulk & Business Orders
                </h2>
                <p className="text-brown">Shipping timelines for wholesale, distributor, or bulk orders may differ from standard customer orders. Our business team will share estimated dispatch and delivery schedules separately for such orders.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">12</span>
                  Order Cancellation Before Dispatch
                </h2>
                <p className="text-brown">Orders may be cancelled before dispatch by contacting our customer support team. Once an order has been shipped, it cannot be cancelled and will be governed by our <Link href="/returns" className="text-brand-red hover:underline font-medium">Return & Refund Policy</Link>. See our full <Link href="/cancellation" className="text-brand-red hover:underline font-medium">Cancellation Policy</Link> for details.</p>
              </section>

              <section>
                <h2 className="flex items-center gap-4 font-playfair text-2xl font-bold text-charcoal mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white text-sm shrink-0">13</span>
                  Policy Updates
                </h2>
                <p className="text-brown">SCM reserves the right to modify or update this Shipping Policy at any time without prior notice. Any changes will be published on this page with the revised effective date.</p>
              </section>
            </div>
          </div>

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 border border-cream-dark/50">
            <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">Customer Support</h3>
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
