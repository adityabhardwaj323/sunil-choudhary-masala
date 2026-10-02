import os
import re

FRONTEND_DIR = 'd:/sunil-choudhary-masala/scm-frontend'

actions_path = os.path.join(FRONTEND_DIR, 'components/product/ProductActions.tsx')
with open(actions_path, 'r', encoding='utf-8') as f:
    actions_content = f.read()

sticky_bar = """
      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-3 pr-[88px] bg-white border-t border-cream-dark shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-40 md:hidden flex items-center justify-between gap-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex flex-col shrink-0">
          <span className="font-playfair text-[17px] font-bold text-charcoal leading-none mb-1">{fmtMoney(selectedVariant.price)}</span>
          <span className="text-[11px] text-brown font-medium leading-none">{selectedVariant.weight}</span>
        </div>
        <button 
          className="flex-grow bg-brand-red text-white hover:bg-red-800 transition-colors flex items-center justify-center gap-1.5 rounded-lg font-semibold h-11 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm px-2"
          onClick={addToCart}
          disabled={!inStock}
        >
          {product.variants && product.variants.length > 1 && !selectedVariant ? 'Select Variant' : <><ShoppingBag size={16} /> Add to Cart</>}
        </button>
      </div>
"""

if 'Mobile Sticky Add to Cart' not in actions_content:
    actions_content = re.sub(r'</div>\s*\);\s*}\s*$', f"{sticky_bar}    </div>\n  );\n}}\n", actions_content)

with open(actions_path, 'w', encoding='utf-8') as f:
    f.write(actions_content)
print("ProductActions updated.")
