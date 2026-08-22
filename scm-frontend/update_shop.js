const fs = require('fs');
const path = require('path');

const filePath = 'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/shop/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { StaggerChildren }')) {
  content = `import { StaggerChildren } from '@/components/motion/StaggerChildren';
import { MotionItem } from '@/components/motion/MotionItem';\n` + content;
}

const gridRegex = /(<div className="grid[^>]*>)\s*(\{products\.map\([^)]*\)\s*=>\s*\(\s*)<ProductCard ([^>]+)\/>(\s*\)\)}\s*<\/div>)/;
if (gridRegex.test(content)) {
  content = content.replace(gridRegex, (match, openDiv, mapFn, props, closeDiv) => {
    const newOpen = openDiv.replace('<div', '<StaggerChildren');
    const newItem = `<MotionItem key={product._id} whileHover={{ y: -4 }} className="h-full"><ProductCard ${props}/></MotionItem>`;
    const newClose = closeDiv.replace('</div>', '</StaggerChildren>');
    return newOpen + '\n              ' + mapFn.replace('{products.map((product: any) => (', '{products.map((product: any) => (') + newItem + newClose.replace('))}', '))}\n            ');
  });
  fs.writeFileSync(filePath, content);
  console.log('Updated shop/page.tsx');
} else {
  console.log('Grid not found in shop/page.tsx');
}
