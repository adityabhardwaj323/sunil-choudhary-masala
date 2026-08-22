const fs = require('fs');

const path = 'components/home/CategoryShowcase.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/name: 'Red Chilli'.*?link: '\/shop\?category=Red%20Chilli'/s, "name: 'Chilli Powders', desc: 'Vibrant color, perfect heat', icon: <Flame size={64} />, link: '/shop?category=Chilli%20Powders'");
content = content.replace(/name: 'Coriander'.*?link: '\/shop\?category=Coriander'/s, "name: 'Ground Spices', desc: 'Essential everyday spices', icon: <Sparkles size={64} />, link: '/shop?category=Ground%20Spices'");
content = content.replace(/name: 'Turmeric'.*?link: '\/shop\?category=Turmeric'/s, "name: 'Dry Fruits & Nuts', desc: 'Premium quality selection', icon: <PackageOpen size={64} />, link: '/shop?category=Dry%20Fruits%20%26%20Nuts'");
content = content.replace(/name: 'Dry Fruits'.*?link: '\/shop\?category=Dry%20Fruits'/s, "name: 'Healthy Snacks', desc: 'Delicious and nutritious', icon: <Boxes size={64} />, link: '/shop?category=Healthy%20Snacks'");
content = content.replace(/name: 'Makhana'.*?link: '\/shop\?category=Makhana'/s, "name: 'Cooking Oils', desc: 'Pure and unrefined', icon: <CheckCircle size={64} />, link: '/shop?category=Cooking%20Oils'");

// Remove the 6th category if it exists (Cooking Oils was originally 6th, now it's 5th)
content = content.replace(/,\s*\{\s*name: 'Cooking Oils'.*?link: '\/shop\?category=Cooking%20Oils'.*?\}/s, "");

fs.writeFileSync(path, content, 'utf8');
console.log('CategoryShowcase updated');
