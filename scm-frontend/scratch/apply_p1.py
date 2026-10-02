import os
import re

FRONTEND_DIR = 'd:/sunil-choudhary-masala/scm-frontend'

# 1. Update Hero.tsx
hero_path = os.path.join(FRONTEND_DIR, 'components/home/Hero.tsx')
with open(hero_path, 'r', encoding='utf-8') as f:
    hero_content = f.read()

new_slides = """const slides = [
  {
    eyebrow: "✦ 100% Natural · No Additives",
    headline: (
      <>
        Authentic Rajasthani<br />
        <em className="text-gold-light not-italic">Masalas</em>
      </>
    ),
    text: "Traditional stone-ground spices, freshly packed for your kitchen.",
    cta1: { label: "Shop Bestsellers", link: "/shop?filter=bestsellers", icon: <ShoppingBag size={18} /> },
    cta2: null,
    image: "/images/hero_1_true_taste.jpg",
  }
];"""
hero_content = re.sub(r'const slides = \[.*?\];', new_slides, hero_content, flags=re.DOTALL)
with open(hero_path, 'w', encoding='utf-8') as f:
    f.write(hero_content)

# 2. Update Mobile Menu (Navbar.tsx)
navbar_path = os.path.join(FRONTEND_DIR, 'components/layout/Navbar.tsx')
with open(navbar_path, 'r', encoding='utf-8') as f:
    navbar_content = f.read()

mobile_menu_match = re.search(r'\{/\* Mobile Menu Dropdown \*/\}.*?</AnimatePresence>', navbar_content, flags=re.DOTALL)
if mobile_menu_match:
    new_mobile_menu = """{/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="lg:hidden bg-white border-t border-cream-dark overflow-hidden pb-4"
            >
              <div className="px-5 py-4 flex flex-col gap-6">
                
                {/* SHOP */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shop</div>
                  <div className="flex flex-col gap-3">
                    <Link href="/shop" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>All Masalas</Link>
                    <Link href="/shop?filter=bestsellers" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Best Sellers</Link>
                    <Link href="/shop?filter=combos" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Combos</Link>
                  </div>
                </div>

                {/* OUR STORY */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Our Story</div>
                  <div className="flex flex-col gap-3">
                    <Link href="/about" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Our Story</Link>
                    <Link href="/manufacturing" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Our Process</Link>
                  </div>
                </div>

                {/* HELP */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Help</div>
                  <div className="flex flex-col gap-3">
                    <Link href="/tracking" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Track Order</Link>
                    <Link href="/faq" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>FAQ</Link>
                    <Link href="/contact" className="text-lg font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Contact</Link>
                  </div>
                </div>
                
                <Link href="/shop?filter=bestsellers" onClick={() => setMobileOpen(false)} className="bg-brand-red text-white py-3.5 rounded-xl font-bold flex justify-center mt-2">
                  SHOP BESTSELLERS
                </Link>

              </div>
            </motion.div>
          )}
        </AnimatePresence>"""
    
    navbar_content = navbar_content[:mobile_menu_match.start()] + new_mobile_menu + navbar_content[mobile_menu_match.end():]
    
    with open(navbar_path, 'w', encoding='utf-8') as f:
        f.write(navbar_content)


# 3. Product Card - Use Next.js Image and remove fake reviews
product_card_path = os.path.join(FRONTEND_DIR, 'components/home/ProductCard.tsx')
with open(product_card_path, 'r', encoding='utf-8') as f:
    pc_content = f.read()

pc_content = pc_content.replace('<img \n            src={imageUrl} \n            alt={product.name} \n            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" \n          />',
'<Image src={imageUrl} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />')

pc_content = pc_content.replace('<img \n            src="/asset_35.jpg" \n            alt={product.name || \'SCM Product\'} \n            className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" \n          />',
'<Image src="/asset_35.jpg" alt={product.name || \'SCM Product\'} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />')

rating_block_match = re.search(r'<div className="flex items-center gap-1 mt-2">.*?</div>', pc_content, flags=re.DOTALL)
if rating_block_match:
    new_rating_block = """{product.ratingAvg > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.ratingAvg) ? 'fill-current' : 'fill-cream-dark text-cream-dark'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-brown/70 font-medium ml-1">
              {product.ratingAvg.toFixed(1)} {product.ratingCount > 0 && `(${product.ratingCount})`}
            </span>
          </div>
        )}"""
    pc_content = pc_content[:rating_block_match.start()] + new_rating_block + pc_content[rating_block_match.end():]

with open(product_card_path, 'w', encoding='utf-8') as f:
    f.write(pc_content)

print("Done phase 1 parts")
