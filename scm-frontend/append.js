const fs = require('fs');

const indexHtmlPath = 'd:\\scm-old-reference\\scm-frontend\\index.html';
const pageTsxPath = 'd:\\sunil-choudhary-masala\\app\\(customer)\\page.tsx';

let html = fs.readFileSync(indexHtmlPath, 'utf8');

const packagingPromiseStart = html.indexOf('<!-- ═══════════════════════════════════════════════════\r\n     PACKAGING PROMISE');
const packagingPromiseStart2 = html.indexOf('<!-- ═══════════════════════════════════════════════════\n     PACKAGING PROMISE');
const start = packagingPromiseStart !== -1 ? packagingPromiseStart : packagingPromiseStart2;

const footerStart = html.indexOf('<!-- ═══════════════════════════════════════════════════\r\n     FOOTER');
const footerStart2 = html.indexOf('<!-- ═══════════════════════════════════════════════════\n     FOOTER');
const end = footerStart !== -1 ? footerStart : footerStart2;

if (start === -1 || end === -1) {
  console.error('Could not find section boundaries', { start, end });
  process.exit(1);
}

let remainingHtml = html.substring(start, end);

// 1. Convert comments
remainingHtml = remainingHtml.replace(/<!-- ([\s\S]*?) -->/g, '{/* $1 */}');

// 2. Convert class to className
remainingHtml = remainingHtml.replace(/class="/g, 'className="');

// 3. Convert style strings to objects
// Very basic manual style replacements based on what we saw:
remainingHtml = remainingHtml.replace(/style="margin-bottom:32px;"/g, "style={{ marginBottom: '32px' }}");
remainingHtml = remainingHtml.replace(/style="grid-column:1\/-1"/g, "style={{ gridColumn: '1/-1' }}");
remainingHtml = remainingHtml.replace(/style="position:relative;z-index:2;"/g, "style={{ position: 'relative', zIndex: 2 }}");
remainingHtml = remainingHtml.replace(/style="color:rgba\(255,255,255,\.8\);"/g, "style={{ color: 'rgba(255,255,255,.8)' }}");
remainingHtml = remainingHtml.replace(/style="margin-bottom:12px;"/g, "style={{ marginBottom: '12px' }}");
remainingHtml = remainingHtml.replace(/style="display:flex;justify-content:center;"/g, "style={{ display: 'flex', justifyContent: 'center' }}");
remainingHtml = remainingHtml.replace(/style="margin:0 auto;"/g, "style={{ margin: '0 auto' }}");
remainingHtml = remainingHtml.replace(/style="margin-top:12px;font-size:12px;color:rgba\(255,255,255,\.35\);"/g, "style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,.35)' }}");

// For the base64 image style:
// style="background:url('data:image/jpeg;base64,...') center/cover"
remainingHtml = remainingHtml.replace(/style="background:url\('([^']+)'\) center\/cover"/g, "style={{ background: \"url('$1') center/cover\" }}");

// 4. Fix self-closing tags
remainingHtml = remainingHtml.replace(/<input([^>]+[^\/])>/g, '<input$1/>');
remainingHtml = remainingHtml.replace(/<br>/g, '<br/>');

// 5. Replace buttons with Links or remove onclick
// <button className="btn-view-all" onclick="location.href='shop.html'">View All Products <i className="fas fa-arrow-right"></i></button>
remainingHtml = remainingHtml.replace(/<button className="btn-view-all" onclick="location.href='shop\.html'">([\s\S]*?)<\/button>/g, '<Link href="/shop" className="btn-view-all">$1</Link>');

// <button className="btn-primary" style={{ margin: '0 auto' }} onclick="location.href='shop.html'">
remainingHtml = remainingHtml.replace(/<button className="btn-primary" style=\{\{ margin: '0 auto' \}\} onclick="location.href='shop\.html'">([\s\S]*?)<\/button>/g, '<Link href="/shop" className="btn-primary" style={{ margin: \'0 auto\', display: \'inline-block\' }}>$1</Link>');

// other onclicks (remove them to avoid server component errors)
remainingHtml = remainingHtml.replace(/onclick="[^"]*"/g, '');

// Read page.tsx
let pageTsx = fs.readFileSync(pageTsxPath, 'utf8');
const closingTag = '</>';
const insertIndex = pageTsx.lastIndexOf(closingTag);

if (insertIndex === -1) {
  console.error('Could not find </> in page.tsx');
  process.exit(1);
}

// Ensure there is no duplicated PACKAGING PROMISE
if (pageTsx.includes('PACKAGING PROMISE')) {
  console.log('Already added');
} else {
  const newPageTsx = pageTsx.substring(0, insertIndex) + remainingHtml + '\n      ' + pageTsx.substring(insertIndex);
  fs.writeFileSync(pageTsxPath, newPageTsx, 'utf8');
  console.log('Successfully appended remaining HTML to page.tsx');
}
