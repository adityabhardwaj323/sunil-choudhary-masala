const fs = require('fs');
const path = 'components/home/ProductCard.tsx';
let content = fs.readFileSync(path, 'utf8');

// The Quick Add button uses AddToCartButton component.
// We want to replace it with a standard Link or modify AddToCartButton usage 
// if there are multiple variants. 

const replacement = `
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          {(product.variants && product.variants.length > 1) ? (
            <Link 
              href={\`/product/\${product._id}\`}
              className="w-full bg-charcoal text-white hover:bg-black transition-colors flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm shadow-lg"
            >
              <ShoppingBag size={18} />
              <span>Select Options</span>
            </Link>
          ) : (
            <AddToCartButton 
              productId={product._id} 
              variantId={firstVariant?._id}
              className="w-full bg-brand-red text-white hover:bg-brand-red-dark transition-colors flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm shadow-lg"
            >
              <ShoppingBag size={18} />
              <span>Quick Add</span>
            </AddToCartButton>
          )}
        </div>
`;

content = content.replace(/\{\/\* Quick Add Overlay \*\/\}.*?<\/AddToCartButton>\s*<\/div>/s, replacement.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('ProductCard updated');
