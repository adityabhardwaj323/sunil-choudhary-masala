const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not available by default, I'll use standard fs methods

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.git') && !filepath.includes('.next')) {
        walkSync(filepath, callback);
      }
    } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts'))) {
      callback(filepath);
    }
  });
}

const NEW_CATEGORIES = ['Chilli Powders', 'Ground Spices', 'Dry Fruits & Nuts', 'Healthy Snacks', 'Cooking Oils'];

// We only need to replace specific arrays/dropdowns where these are hardcoded.
// For admin/products/page.tsx:
const adminPath = 'd:/sunil-choudhary-masala/scm-frontend/app/admin/products/page.tsx';
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  content = content.replace(/const categories = \[.*?\];/s, `const categories = ['Chilli Powders', 'Ground Spices', 'Dry Fruits & Nuts', 'Healthy Snacks', 'Cooking Oils'];`);
  fs.writeFileSync(adminPath, content);
  console.log('Updated admin page');
}

// For ShopFilters or CategoryTabs
const tabsPath = 'd:/sunil-choudhary-masala/scm-frontend/components/shop/CategoryTabs.tsx';
if (fs.existsSync(tabsPath)) {
  let content = fs.readFileSync(tabsPath, 'utf8');
  content = content.replace(/const categories = \[.*?\];/s, `const categories = ['All', 'Chilli Powders', 'Ground Spices', 'Dry Fruits & Nuts', 'Healthy Snacks', 'Cooking Oils'];`);
  fs.writeFileSync(tabsPath, content);
  console.log('Updated CategoryTabs');
}

const shopPath = 'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/shop/page.tsx';
if (fs.existsSync(shopPath)) {
  let content = fs.readFileSync(shopPath, 'utf8');
  // if there's any category mention
  content = content.replace(/Red Chilli|Turmeric|Coriander|Spice Blends|Special Masala|Gift Box/g, (match) => {
    return NEW_CATEGORIES[0]; // Not safe to blindly replace, let's just leave it or check manually
  });
}

// Instead of regex, let's just find files that mention the old categories
walkSync('d:/sunil-choudhary-masala/scm-frontend', (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('Red Chilli') || content.includes('Special Masala') || content.includes('Gift Box')) {
    console.log('Needs check:', filepath);
  }
});
