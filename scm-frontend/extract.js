const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\scm-old-reference\\scm-frontend';
const destDir = 'd:\\sunil-choudhary-masala\\public';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let count = 0;
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  
  // match data:image/...;base64,.....
  const regex = /data:(image\/[a-zA-Z+]+);base64,([^"'\s\)]+)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const mimeType = match[1];
    const base64Data = match[2];
    
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    
    const filename = `asset_${count++}.${ext}`;
    fs.writeFileSync(path.join(destDir, filename), Buffer.from(base64Data, 'base64'));
    console.log(`Saved ${filename} from ${file}`);
  }
});
