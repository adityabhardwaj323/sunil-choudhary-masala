const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const oldDir = path.join('d:', 'scm-old-reference', 'scm-frontend');
const newDir = path.join('d:', 'sunil-choudhary-masala', 'app', '(customer)');

const pages = [
  'contact', 'cookies', 'creator-program', 'faq',
  'privacy', 'retail-partner', 'returns', 'shipping', 'terms'
];

function camelCaseAttributes(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/tabindex=/g, 'tabIndex=')
    .replace(/readonly=/g, 'readOnly=')
    .replace(/maxlength=/g, 'maxLength=')
    .replace(/autocomplete=/g, 'autoComplete=')
    .replace(/onclick="[^"]*"/g, '')
    .replace(/onsubmit="[^"]*"/g, '')
    // replace self-closing tags to be valid JSX
    .replace(/<img([^>]+[^\/])>/g, '<img$1 />')
    .replace(/<br([^>]*[^\/])?>/g, '<br />')
    .replace(/<hr([^>]*[^\/])?>/g, '<hr />')
    .replace(/<input([^>]+[^\/])>/g, '<input$1 />')
    // comment out base64 images that might cause issues, or just use the local assets
    .replace(/src="data:image[^"]+"/g, 'src="/asset_placeholder.png"');
}

for (const page of pages) {
  const oldPath = path.join(oldDir, `${page}.html`);
  const newPath = path.join(newDir, page, 'page.tsx');

  if (!fs.existsSync(oldPath)) {
    console.log(`Old file not found for ${page}`);
    continue;
  }
  
  const oldHtml = fs.readFileSync(oldPath, 'utf8');
  const $ = cheerio.load(oldHtml);
  
  // Try to find the main content. Usually it's in a <main> or a div with .page-content or similar
  let contentHtml = '';
  const mainNode = $('main').first();
  if (mainNode.length > 0) {
    contentHtml = mainNode.html();
  } else {
    // If no main, find the largest div that isn't nav or footer
    const nav = $('nav').first();
    const footer = $('footer').first();
    nav.remove();
    footer.remove();
    $('script').remove();
    $('style').remove();
    
    // Grab the body html
    contentHtml = $('body').html();
  }
  
  if (!contentHtml) {
    console.log(`Could not find content for ${page}`);
    continue;
  }
  
  // Convert HTML attributes to React JSX
  let jsxContent = camelCaseAttributes(contentHtml);
  
  // Create the new TSX content
  const tsx = `import React from 'react';\n\nexport const metadata = {\n  title: '${page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Sunil Choudhary Masala',\n};\n\nexport default function ${page.replace(/-/g, '').replace(/\b\w/g, l => l.toUpperCase())}Page() {\n  return (\n    <div className="container" dangerouslySetInnerHTML={{ __html: \`${jsxContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />\n  );\n}\n`;

  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.writeFileSync(newPath, tsx);
  console.log(`Migrated ${page}`);
}
