const fs = require('fs');
const content = fs.readFileSync('d:/scm-old-reference/scm-frontend/privacy.html', 'utf-8');
const startIndex = content.indexOf('<div class="legal-wrap">');
const endIndex = content.indexOf('<!-- ============ FAQ PAGE ============ -->'); // Or just end of body
let extracted = content.substring(startIndex, startIndex + 15000);
fs.writeFileSync('d:/sunil-choudhary-masala/temp-privacy.txt', extracted);
console.log('done');
