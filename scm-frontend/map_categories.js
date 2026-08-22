const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'Chilli Powders',
  'Ground Spices',
  'Dry Fruits & Nuts',
  'Healthy Snacks',
  'Cooking Oils'
];

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
}

// 1. scm-frontend/types/index.ts
replaceInFile('types/index.ts', [
  [/category: 'Red Chilli' \| 'Coriander' \| 'Turmeric' \| 'Dry Fruits' \| 'Makhana' \| 'Cooking Oils' \| string;/g, "category: 'Chilli Powders' | 'Ground Spices' | 'Dry Fruits & Nuts' | 'Healthy Snacks' | 'Cooking Oils' | string;"],
  [/category: 'Red Chilli' \| 'Turmeric' \| 'Coriander' \| 'Spice Blends' \| 'Special Masala' \| 'Gift Box' \| string;/g, "category: 'Chilli Powders' | 'Ground Spices' | 'Dry Fruits & Nuts' | 'Healthy Snacks' | 'Cooking Oils' | string;"]
]);

// 2. scm-frontend/components/shop/CategoryTabs.tsx
const tabsReplacement = `const tabs = [
    { label: 'All Products', value: '' },
    { label: 'Chilli Powders', value: 'Chilli Powders' },
    { label: 'Ground Spices', value: 'Ground Spices' },
    { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
    { label: 'Healthy Snacks', value: 'Healthy Snacks' },
    { label: 'Cooking Oils', value: 'Cooking Oils' },
  ];`;
replaceInFile('components/shop/CategoryTabs.tsx', [
  [/const tabs = \[[^\]]+\];/s, tabsReplacement]
]);

// 3. scm-frontend/components/shop/ShopFilters.tsx
const filtersReplacement = `[
              { label: 'All Products', value: '' },
              { label: 'Chilli Powders', value: 'Chilli Powders' },
              { label: 'Ground Spices', value: 'Ground Spices' },
              { label: 'Dry Fruits & Nuts', value: 'Dry Fruits & Nuts' },
              { label: 'Healthy Snacks', value: 'Healthy Snacks' },
              { label: 'Cooking Oils', value: 'Cooking Oils' },
            ].map((cat) => (`
replaceInFile('components/shop/ShopFilters.tsx', [
  [/\[\s*\{\s*label:\s*'All Products'.*?\]\.map\(\(cat\) => \(/s, filtersReplacement]
]);

console.log('Done mapping scm-frontend back to admin categories.');
