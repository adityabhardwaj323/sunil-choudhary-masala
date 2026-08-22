const fs = require('fs');

function replaceFileContent(path, regex, replacement) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content);
    console.log('Updated ' + path);
  }
}

// 1. Admin Page
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/admin/products/page.tsx',
  /const categories = \[.*?\];/s,
  `const categories = ['Chilli Powders', 'Ground Spices', 'Dry Fruits & Nuts', 'Healthy Snacks', 'Cooking Oils'];`
);

// 2. Types
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/types/index.ts',
  /category: 'Red Chilli' \| 'Turmeric' \| 'Coriander' \| 'Spice Blends' \| 'Special Masala' \| 'Gift Box' \| string;/g,
  `category: 'Chilli Powders' | 'Ground Spices' | 'Dry Fruits & Nuts' | 'Healthy Snacks' | 'Cooking Oils' | string;`
);

// 3. CategoryTabs
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/components/shop/CategoryTabs.tsx',
  /const categories = \[\s*\{ label: 'All'.*?\s*\{ label: 'Gift Box', value: 'Gift Box' \},\s*\];/s,
  `const categories = [
    { label: 'All', value: 'All' },
    { label: 'Chilli Powders', value: 'Chilli Powders' },
    { label: 'Ground Spices', value: 'Ground Spices' },
    { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
    { label: 'Healthy Snacks', value: 'Healthy Snacks' },
    { label: 'Cooking Oils', value: 'Cooking Oils' }
  ];`
);

// 4. ShopFilters
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/components/shop/ShopFilters.tsx',
  /categories: \[\s*\{ label: 'Blended Spices'.*?\{ label: 'Gift Box', value: 'Gift Box' \},\s*\],/s,
  `categories: [
              { label: 'Chilli Powders', value: 'Chilli Powders' },
              { label: 'Ground Spices', value: 'Ground Spices' },
              { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
              { label: 'Healthy Snacks', value: 'Healthy Snacks' },
              { label: 'Cooking Oils', value: 'Cooking Oils' }
            ],`
);

// 5. FAQ
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/faq/page.tsx',
  /Red Chilli Powder, Turmeric Powder, Coriander Powder, Garam Masala, whole spices, and other authentic spice blends/g,
  `Chilli Powders, Ground Spices, Dry Fruits & Nuts, Healthy Snacks, and Cooking Oils`
);

// 6. Terms
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/terms/page.tsx',
  /Red Chilli Powder, Turmeric Powder, Coriander Powder, Garam Masala, whole spices, and other spice blends/g,
  `Chilli Powders, Ground Spices, Dry Fruits & Nuts, Healthy Snacks, and Cooking Oils`
);

// 7. Shop description
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/shop/page.tsx',
  /Red Chilli, Turmeric, Coriander, and exclusive SCM blends\./g,
  `Chilli Powders, Ground Spices, Dry Fruits & Nuts, Healthy Snacks, and Cooking Oils.`
);

// 8. Layout description
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/layout.tsx',
  /Red Chilli, Turmeric, Coriander, and specialty blends\./g,
  `Chilli Powders, Ground Spices, Dry Fruits & Nuts, Healthy Snacks, and Cooking Oils.`
);

// 9. Search placeholder
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/search/page.tsx',
  /Red Chilli/g,
  `Chilli Powders`
);
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/search/page.tsx',
  /Turmeric/g,
  `Dry Fruits & Nuts`
);
replaceFileContent(
  'd:/sunil-choudhary-masala/scm-frontend/app/(customer)/search/page.tsx',
  /Coriander/g,
  `Healthy Snacks`
);

console.log('All replacements done');
