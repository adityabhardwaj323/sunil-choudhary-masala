const fs = require('fs');
const path = require('path');

const pages = ['about', 'heritage', 'quality-standards', 'faq'];

pages.forEach(p => {
  const filePath = `d:/sunil-choudhary-masala/scm-frontend/app/(customer)/${p}/page.tsx`;
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('import { FadeIn }')) {
      const importMatch = content.match(/import.*?;?\n/g);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        content = content.replace(lastImport, lastImport + `import { FadeIn } from '@/components/motion/FadeIn';\n`);
      } else {
        content = `import { FadeIn } from '@/components/motion/FadeIn';\n` + content;
      }
    }

    // Replace <section with <FadeIn
    // we just find <div className="max-w-7xl... or <section and wrap them in FadeIn
    const sectionRegex = /(<section[^>]*>)([\s\S]*?)(<\/section>)/g;
    content = content.replace(sectionRegex, (match, openSec, inner, closeSec) => {
      // prevent nested FadeIn if we run it multiple times or something
      if (inner.includes('<FadeIn>')) return match; 
      return openSec + '\n      <FadeIn>' + inner + '</FadeIn>\n    ' + closeSec;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${p}/page.tsx`);
  }
});
