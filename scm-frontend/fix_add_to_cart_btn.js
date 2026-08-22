const fs = require('fs');
let content = fs.readFileSync('components/shop/AddToCartButton.tsx', 'utf8');

content = content.replace(/variantId\?: string;/, "variantId?: string;\n  weight?: string;");
content = content.replace(/export default function AddToCartButton\(\{ productId, variantId, className.*?\) \{/, "export default function AddToCartButton({ productId, variantId, weight, className = 'bg-charcoal text-white hover:bg-brand-red transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md w-full', children }: AddToCartButtonProps) {");
content = content.replace(/weight: 'Default', \/\/.*?\n/, "weight: weight || 'Default',\n");

fs.writeFileSync('components/shop/AddToCartButton.tsx', content, 'utf8');

let productCardContent = fs.readFileSync('components/home/ProductCard.tsx', 'utf8');
productCardContent = productCardContent.replace(/variantId=\{firstVariant\?\._id\}/, "variantId={firstVariant?._id}\n              weight={firstVariant?.weight}");
fs.writeFileSync('components/home/ProductCard.tsx', productCardContent, 'utf8');

console.log('AddToCartButton fixed to pass weight');
