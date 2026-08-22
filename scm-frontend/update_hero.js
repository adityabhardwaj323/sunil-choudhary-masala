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

replaceInFile(
  'components/home/Hero.tsx',
  /<div className="relative z-10 max-w-\[600px\] px-6 md:px-20">/,
  '<div className="relative z-10 max-w-[600px] px-6 md:px-20">\n              <FadeIn delay={0.2}>'
);

replaceInFile(
  'components/home/Hero.tsx',
  /<\/div>\s*<\/div>\s*\)\)}\s*<\/div>/,
  '</FadeIn>\n            </div>\n          </div>\n        ))}\n      </div>'
);
