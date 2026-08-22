const fs = require('fs');

const cartPath = 'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/cart/page.tsx';
let cartContent = fs.readFileSync(cartPath, 'utf8');

if (!cartContent.includes('AnimatePresence')) {
  cartContent = cartContent.replace('import { ArrowRight', "import { AnimatePresence, motion } from 'framer-motion';\nimport { ArrowRight");
}

const listStartRegex = /<div className="flex flex-col divide-y divide-cream-dark">/;
if (listStartRegex.test(cartContent)) {
  cartContent = cartContent.replace(listStartRegex, '<div className="flex flex-col divide-y divide-cream-dark">\n                  <AnimatePresence>');
  
  cartContent = cartContent.replace(/<div key={item\._id} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">/, 
    `<motion.div 
                        layout 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, height: 0, overflow: 'hidden', margin: 0, padding: 0 }}
                        key={item._id} 
                        className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                      >`);
  
  cartContent = cartContent.replace(/<\/div>\n                    \);\n                  }\)}\n                <\/div>/, 
    `</motion.div>\n                    );\n                  })}\n                  </AnimatePresence>\n                </div>`);
    
  fs.writeFileSync(cartPath, cartContent);
  console.log('Updated cart/page.tsx');
}
