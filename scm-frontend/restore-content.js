const fs = require('fs');
const path = require('path');

const oldDir = path.join('d:', 'scm-old-reference', 'scm-frontend');
const newDir = path.join('d:', 'sunil-choudhary-masala', 'app', '(customer)');

const pages = [
  'about', 'cancellation', 'contact', 'cookies', 'creator-program',
  'distributor', 'faq', 'gallery', 'heritage', 'manufacturing',
  'privacy', 'quality-standards', 'retail-partner', 'returns',
  'shipping', 'terms'
];

async function main() {
  console.log('Starting comparison and restoration...');

  for (const page of pages) {
    const oldPath = path.join(oldDir, `${page}.html`);
    const newPath = path.join(newDir, page, 'page.tsx');

    if (!fs.existsSync(oldPath) || !fs.existsSync(newPath)) {
      console.log(`Skipping ${page} - missing old or new file`);
      continue;
    }

    const oldContent = fs.readFileSync(oldPath, 'utf8');
    let newContent = fs.readFileSync(newPath, 'utf8');

    // Since we don't have a full DOM parser, we'll flag files for manual review 
    // if they have placeholders. A more advanced regex or DOM parsing would be 
    // needed to perfectly extract the exact paragraphs from the old HTML.
    
    // For now, let's just detect if there are placeholders in the TSX
    if (newContent.includes('[Business Input Required]') || newContent.includes('[Legal Input Required]')) {
      console.log(`\nPage "${page}" requires content replacement.`);
      console.log(`Old HTML size: ${oldContent.length} bytes. Base64 images often make this large.`);
      
      // Simple heuristic to check if the old file is just lorem ipsum or empty templates
      const isOldPlaceholder = oldContent.includes('Lorem ipsum') || oldContent.includes('Replace this');
      
      if (isOldPlaceholder) {
        console.log(`  -> Old content appears to be placeholder/lorem ipsum. Leaving TSX as is.`);
      } else {
        console.log(`  -> Genuine content likely exists in old reference. Please extract and replace in TSX.`);
        // Here we could add regex extraction if the structure was strictly known.
      }
    }
  }
  console.log('\nDone.');
}

main();
