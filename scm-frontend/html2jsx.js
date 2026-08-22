const fs = require('fs');

let html = fs.readFileSync('D:/sunil-choudhary-masala/scratch_home.html', 'utf8');

// Convert class= to className=
html = html.replace(/class="/g, 'className="');
// Convert onclick="location.href='shop.html'" to Next.js <Link> wrapper
// For now, let's just strip onclick and style manually or handle them as Link
html = html.replace(/onclick="location\.href='([^']+)'"/g, '');
html = html.replace(/onclick="([^"]+)"/g, '');
// Replace inline styles (simple ones)
html = html.replace(/style="([^"]+)"/g, '');
// Convert self-closing tags
html = html.replace(/<br>/g, '<br/>');
html = html.replace(/<hr>/g, '<hr/>');
html = html.replace(/<img([^>]+[^\/])>/g, '<img$1/>');
html = html.replace(/<input([^>]+[^\/])>/g, '<input$1/>');

// Escape `{` and `}` if not part of react
html = html.replace(/\{/g, '&#123;');
html = html.replace(/\}/g, '&#125;');

const out = `import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      ${html}
    </>
  );
}
`;

fs.writeFileSync('D:/sunil-choudhary-masala/scratch_page.tsx', out);
console.log('Converted HTML to JSX in scratch_page.tsx');
