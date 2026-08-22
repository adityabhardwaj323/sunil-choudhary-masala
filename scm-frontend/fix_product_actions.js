const fs = require('fs');
const path = 'components/product/ProductActions.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace {fmtMoney(selectedVariant.price)} with {fmtMoney(selectedVariant.price * quantity)}
content = content.replace(
  /<span className="font-playfair text-4xl font-bold text-brand-red">\{fmtMoney\(selectedVariant\.price\)\}<\/span>/,
  '<span className="font-playfair text-4xl font-bold text-brand-red">{fmtMoney(selectedVariant.price * quantity)}</span>'
);

// Replace {fmtMoney(selectedVariant.mrp)} with {fmtMoney(selectedVariant.mrp * quantity)}
content = content.replace(
  /<span className="text-lg text-gray-400 line-through mb-1">\{fmtMoney\(selectedVariant\.mrp\)\}<\/span>/,
  '<span className="text-lg text-gray-400 line-through mb-1">{fmtMoney(selectedVariant.mrp * quantity)}</span>'
);

// We need to also make sure when the user adds to cart, the quantity doesn't exceed stock if they spam click or something
// That's handled in handleIncrement

fs.writeFileSync(path, content, 'utf8');
console.log('ProductActions updated for quantity price multiplication');
