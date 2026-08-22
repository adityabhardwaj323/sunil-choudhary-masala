const fs = require('fs');

function extract(file, target) {
  try {
    let html = fs.readFileSync('D:/scm-old-reference/scm-frontend/' + file, 'utf8');
    const parts = html.split('</nav>');
    if (parts.length > 1) {
      const bodyParts = parts[1].split('<footer class="footer">');
      if (bodyParts.length > 0) {
        fs.writeFileSync('D:/sunil-choudhary-masala/' + target, bodyParts[0].trim());
        console.log('Extracted ' + target);
      }
    }
  } catch(e) {
    console.error('Error extracting ' + file + ':', e.message);
  }
}

extract('shop.html', 'old_shop.html');
extract('product.html', 'old_product.html');
extract('cart.html', 'old_cart.html');
extract('checkout.html', 'old_checkout.html');
