'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, Menu, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount } = useCartWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText('PEHLADABBA');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-red text-white text-[13px] font-medium tracking-wide py-2 px-5 flex items-center justify-center gap-4 flex-wrap z-50 relative">
        <span className="font-body">🌶️ Free Shipping on orders above ₹499</span>
        <span className="text-[8px] text-gold-light hidden sm:inline">●</span>
        <span className="font-body hidden sm:inline">Freshly Ground · Batch-Dated · Pure Rajasthani</span>
        <span className="text-[8px] text-gold-light hidden lg:inline">●</span>
        <span className="font-body flex items-center gap-2">
          First order? 
          <button 
            onClick={copyCoupon}
            className="group relative inline-flex items-center gap-1.5 bg-white/15 border-[1.5px] border-dashed border-white/50 rounded-full py-0.5 px-3 cursor-pointer transition-all duration-250 hover:bg-white/25 hover:border-gold-light hover:-translate-y-px"
          >
            <Tag size={12} className="text-white group-hover:text-gold-light transition-colors" />
            <strong className="text-gold-light tracking-wide font-semibold">PEHLADABBA</strong>
            <span className="font-normal opacity-90">— 10% Off</span>
            
            {/* Tooltip */}
            <span className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-charcoal text-white text-[11px] py-1 px-2.5 rounded-md whitespace-nowrap transition-all duration-200 pointer-events-none ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
              ✅ Copied!
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-charcoal"></span>
            </span>
          </button>
        </span>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-[1000] bg-white transition-all duration-300 ${scrolled ? 'shadow-[0_6px_32px_rgba(30,26,24,0.16)] border-b border-cream-dark/50' : 'shadow-[0_4px_24px_rgba(30,26,24,0.06)] border-b-2 border-cream-dark'}`}>
        <div className="max-w-[1280px] mx-auto h-[76px] flex items-center justify-between px-5 md:px-8">
          
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image 
              src="/asset_0.png" 
              alt="Sunil Choudhary Masala" 
              width={160} 
              height={45} 
              className="object-contain h-[45px] w-auto transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop Navigation (Center) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="relative text-[15px] font-medium text-charcoal px-4 py-2 rounded-md transition-colors hover:text-brand-red group font-body"
              >
                {link.name}
                <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-saffron rounded-full scale-x-0 transition-transform duration-250 group-hover:scale-x-100 origin-center" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions (Right) */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative mr-2 group">
              <form onSubmit={handleSearch} className="flex">
                <input 
                  type="text"
                  placeholder="Search spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[180px] h-10 bg-cream border-[1.5px] border-cream-dark rounded-l-full pl-4 pr-2 text-sm font-body text-charcoal placeholder:text-brown/60 focus:outline-none focus:border-brand-red transition-all focus:w-[220px]"
                />
                <button 
                  type="submit" 
                  aria-label="Search"
                  className="h-10 px-4 bg-brand-red text-white rounded-r-full hover:bg-brand-red-dark transition-colors"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            <Link href="/wishlist" className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal hover:bg-cream-dark hover:text-brand-red hover:-translate-y-px transition-all relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link href={isLoggedIn ? "/account" : "/login"} className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal hover:bg-cream-dark hover:text-brand-red hover:-translate-y-px transition-all">
              <User size={20} />
            </Link>

            <Link href="/cart" className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal hover:bg-cream-dark hover:text-brand-red hover:-translate-y-px transition-all relative mr-2">
              <ShoppingCart size={20} />
              <motion.span 
                  key={cartCount}
                  initial={{ scale: shouldReduceMotion ? 1 : 0.5 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="absolute top-1 right-1 w-[18px] h-[18px] bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
            </Link>

            <Link href="/shop" className="bg-brand-red text-white hover:bg-brand-red-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(181,57,10,0.4)] rounded-[6px] inline-flex items-center justify-center font-body font-semibold transition-all duration-250 py-2.5 px-5 text-[15px]">
              Order Now
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1">
            <Link href="/cart" className="w-10 h-10 rounded-full flex items-center justify-center text-charcoal relative">
              <ShoppingCart size={22} />
              <motion.span 
                  key={cartCount}
                  initial={{ scale: shouldReduceMotion ? 1 : 0.5 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="absolute top-1 right-1 w-[18px] h-[18px] bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
            </Link>
            
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream-dark rounded-full transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="lg:hidden bg-white border-t border-cream-dark overflow-hidden"
            >
          <div className="px-5 flex flex-col gap-2">
            <form onSubmit={handleSearch} className="flex w-full mb-2">
              <input 
                type="text"
                placeholder="Search spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 bg-cream border-[1.5px] border-cream-dark rounded-l-[10px] pl-4 pr-2 text-[15px] font-body text-charcoal placeholder:text-brown/60 focus:outline-none focus:border-brand-red"
              />
              <button 
                type="submit" 
                aria-label="Search"
                className="h-12 px-5 bg-brand-red text-white rounded-r-[10px]"
              >
                <Search size={20} />
              </button>
            </form>

            <div className="flex flex-col">
              {[...navLinks, { name: 'Wishlist', href: '/wishlist' }, { name: 'Account', href: isLoggedIn ? '/account' : '/login' }].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-[16px] font-medium text-charcoal py-3.5 border-b border-cream-dark last:border-none transition-colors hover:text-brand-red flex items-center justify-between"
                >
                  {link.name}
                  {link.name === 'Wishlist' && wishlistCount > 0 && (
                    <span className="bg-brand-red text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>
                  )}
                </Link>
              ))}
            </div>

            <Link href="/shop" onClick={() => setMobileOpen(false)} className="w-full mt-2 bg-brand-red text-white hover:bg-brand-red-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(181,57,10,0.4)] rounded-[6px] inline-flex items-center justify-center font-body font-semibold transition-all duration-250 py-3.5 text-[16px]">
              Order Now
            </Link>
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
