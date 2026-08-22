const fs = require('fs');
const html = fs.readFileSync('D:/scm-old-reference/scm-frontend/index.html', 'utf8');

const parts = html.split('</nav>');
if (parts.length > 1) {
  const bodyParts = parts[1].split('<footer class="footer">');
  if (bodyParts.length > 0) {
    fs.writeFileSync('D:/sunil-choudhary-masala/scratch_home.html', bodyParts[0].trim());
    console.log('Homepage extracted');
  }
}
