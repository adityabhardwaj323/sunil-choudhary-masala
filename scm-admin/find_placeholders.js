const fs = require('fs');
const path = require('path');

function findPlaceholders(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findPlaceholders(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('[Legal Input Required]') || content.includes('[Business Input Required]')) {
        console.log(fullPath);
      }
    }
  }
}

findPlaceholders('d:/sunil-choudhary-masala/app/(customer)');
