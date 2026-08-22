const fs = require('fs');

function replaceInFile(path, searchRegex, replacementString) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(searchRegex, replacementString);
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Updated ${path}`);
  } catch(e) {
    console.error(`Skipping ${path}: ${e.message}`);
  }
}

// 1. RelatedProducts
replaceInFile(
  'components/product/RelatedProducts.tsx', 
  /import ProductCard from '@\/components\/home\/ProductCard';/, 
  "import ProductCard from '@/components/home/ProductCard';\nimport { StaggerChildren } from '@/components/motion/StaggerChildren';\nimport { MotionItem } from '@/components/motion/MotionItem';\nimport { FadeIn } from '@/components/motion/FadeIn';"
);
replaceInFile(
  'components/product/RelatedProducts.tsx',
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\s*\{filtered\.slice\(0, 4\)\.map\(prod => \(\s*<ProductCard key=\{prod\._id\} product=\{prod\} \/>\s*\)\)\}\s*<\/div>/m,
  "<StaggerChildren className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6\">\n        {filtered.slice(0, 4).map(prod => (\n          <MotionItem key={prod._id} whileHover={{ y: -4 }}>\n            <ProductCard product={prod} />\n          </MotionItem>\n        ))}\n      </StaggerChildren>"
);
replaceInFile(
  'components/product/RelatedProducts.tsx',
  /<h2 className="font-playfair text-3xl font-bold text-charcoal mb-8 text-center md:text-left">You May Also Like<\/h2>/,
  '<FadeIn>\n        <h2 className="font-playfair text-3xl font-bold text-charcoal mb-8 text-center md:text-left">You May Also Like</h2>\n      </FadeIn>'
);

// 2. Shop page grid: usually components/shop/ShopGrid.tsx or similar
// Let's first check if ShopGrid exists.

