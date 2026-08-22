const fs = require('fs');
const path = require('path');

const dir = 'd:/sunil-choudhary-masala/scm-frontend/components/home';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  if (file === 'ProductCard.tsx' || file === 'FeaturedProducts.tsx' || file === 'CategoryShowcase.tsx') continue;

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not exists
  if (!content.includes('import { FadeIn }')) {
    // Find the last import statement
    const importMatch = content.match(/import.*?;?\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + `import { FadeIn } from '@/components/motion/FadeIn';\n`);
    } else {
      content = `import { FadeIn } from '@/components/motion/FadeIn';\n` + content;
    }
  }

  // Wrap section content
  // Look for:
  // return (
  //   <section ...>
  //     <div ...>
  //       ...
  //     </div>
  //   </section>
  // )

  // A simpler approach for these sections is replacing `<section...>` with `<FadeIn>` inside section, but we can't easily parse JSX with regex.
  // We can just find the `<div className="container...` and change it to `<FadeIn className="container...`
  // and `</div>\n    </section>` to `</FadeIn>\n    </section>`

  const containerRegex = /(<div[^>]*className="[^"]*container[^"]*"[^>]*>)([\s\S]*?)<\/div>(\s*<\/section>)/;
  if (containerRegex.test(content)) {
    content = content.replace(containerRegex, (match, openDiv, innerContent, closeSection) => {
      const newOpen = openDiv.replace(/^<div/, '<FadeIn');
      return newOpen + innerContent + '</FadeIn>' + closeSection;
    });
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} (container)`);
  } else {
    // If no container, just wrap the whole section return
    const sectionRegex = /(<section[^>]*>)([\s\S]*?)(<\/section>)/;
    if (sectionRegex.test(content)) {
      content = content.replace(sectionRegex, (match, openSec, inner, closeSec) => {
        return openSec + '\n      <FadeIn>' + inner + '</FadeIn>\n    ' + closeSec;
      });
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file} (section wrap)`);
    } else {
      console.log(`Skipped ${file}`);
    }
  }
}
