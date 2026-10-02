import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#140e0a] text-white pt-16 pb-6 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <div className="flex flex-col leading-[1.15] mb-5">
              <Image 
                src="/asset_0.png" 
                alt="Sunil Choudhary Masala" 
                width={357} 
                height={237} 
                className="h-[45px] w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-white/70 font-body text-[14px] leading-relaxed mb-6 max-w-sm">
              Rajasthan's finest spices, sourced directly from farmers, batch-dated for maximum freshness, and ground with absolute purity.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all hover:-translate-y-1">
                <Youtube size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all hover:-translate-y-1">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-display text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-body text-[15px] text-white/70">
              <li><Link href="/" className="hover:text-saffron transition-colors inline-block w-fit">Home</Link></li>
              <li><Link href="/shop" className="hover:text-saffron transition-colors inline-block w-fit">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-saffron transition-colors inline-block w-fit">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-saffron transition-colors inline-block w-fit">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-saffron transition-colors inline-block w-fit">My Account</Link></li>
              <li><Link href="/gallery" className="hover:text-saffron transition-colors inline-block w-fit">Gallery</Link></li>
              <li><Link href="/faq" className="hover:text-saffron transition-colors inline-block w-fit">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="flex flex-col">
            <h4 className="font-display text-lg font-semibold text-white mb-6">Information</h4>
            <ul className="flex flex-col gap-3 font-body text-[15px] text-white/70">
              <li><Link href="/privacy" className="hover:text-saffron transition-colors inline-block w-fit">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-saffron transition-colors inline-block w-fit">Terms of Service</Link></li>
              <li><Link href="/shipping" className="hover:text-saffron transition-colors inline-block w-fit">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-saffron transition-colors inline-block w-fit">Returns & Refunds</Link></li>
              <li><Link href="/cancellation" className="hover:text-saffron transition-colors inline-block w-fit">Cancellation Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-saffron transition-colors inline-block w-fit">Cookie Policy</Link></li>
              <li><Link href="/tracking" className="hover:text-saffron transition-colors inline-block w-fit">Track Order</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col">
            <h4 className="font-display text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 font-body text-[15px] text-white/70">
              <li className="flex gap-3">
                <MapPin size={20} className="shrink-0 text-brand-red mt-0.5" />
                <span className="leading-relaxed">Sunil Choudhary Masala,<br/>Main Market, Rajasthan — 302001</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={20} className="shrink-0 text-brand-red" />
                <a href="tel:+919875231865" className="hover:text-saffron transition-colors">+91 98752 31865</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={20} className="shrink-0 text-brand-red" />
                <a href="mailto:info@sunilchoudharymasala.com" className="hover:text-saffron transition-colors">info@sunilchoudharymasala.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-white/60 text-center md:text-left">
            &copy; {currentYear} Sunil Choudhary Masala. Shuddhta Hi Hamari Pehchaan Hai.
          </p>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-sm">Razorpay</span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-sm">UPI</span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-sm">Cards</span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-sm">COD</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
