const fs = require('fs');

const path = 'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/wishlist/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('AnimatePresence')) {
  content = content.replace("import { AlertTriangle", "import { AnimatePresence, motion } from 'framer-motion';\nimport { AlertTriangle");
}

const listStartRegex = /<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">/;
if (listStartRegex.test(content)) {
  content = content.replace(listStartRegex, '<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">\n              <AnimatePresence>');
  
  content = content.replace(/<div\s*key=\{p\._id\}\s*className="group relative bg-white border border-cream-mid rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"\s*>/, 
    `<motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    key={p._id}
                    className="group relative bg-white border border-cream-mid rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                  >`);
  
  content = content.replace(/<\/button>\n                    <\/div>\n                  <\/div>\n                \);\n              }\)}\n            <\/div>/, 
    `</button>\n                    </div>\n                  </motion.div>\n                );\n              })}\n              </AnimatePresence>\n            </div>`);
    
  fs.writeFileSync(path, content);
  console.log('Updated wishlist/page.tsx');
}
