const fs = require('fs');

const filePath = 'd:/sunil-choudhary-masala/scm-frontend/components/layout/Navbar.tsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { AnimatePresence, motion } from \'framer-motion\';')) {
  content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { AnimatePresence, motion, useReducedMotion } from 'framer-motion';");
}

if (!content.includes('const shouldReduceMotion = useReducedMotion();')) {
  content = content.replace('const router = useRouter();', 'const router = useRouter();\n  const shouldReduceMotion = useReducedMotion();');
}

// 1. Mobile Menu Dropdown animation
const dropdownRegex = /<div\s*className={`lg:hidden bg-white[^>]*`}\s*>([\s\S]*?)<\/div>\s*<\/nav>/;
if (dropdownRegex.test(content)) {
  content = content.replace(dropdownRegex, (match, inner) => {
    return `<AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="lg:hidden bg-white border-t border-cream-dark overflow-hidden"
            >${inner}</motion.div>
          )}
        </AnimatePresence>
      </nav>`;
  });
}

// 2. Cart count pop on Desktop and Mobile
// Desk:
// <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
//   {cartCount}
// </span>
const cartBadgeRegex = /<span className="absolute top-1 right-1 w-\[18px\] h-\[18px\] bg-brand-red text-white text-\[10px\] font-bold rounded-full flex items-center justify-center border-2 border-white">\s*\{cartCount\}\s*<\/span>/g;

content = content.replace(cartBadgeRegex, `<motion.span 
                  key={cartCount}
                  initial={{ scale: shouldReduceMotion ? 1 : 0.5 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="absolute top-1 right-1 w-[18px] h-[18px] bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>`);

fs.writeFileSync(filePath, content);
console.log('Updated Navbar.tsx');
