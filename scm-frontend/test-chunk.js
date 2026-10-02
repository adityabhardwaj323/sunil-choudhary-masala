const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let chunkError = false;
  page.on('pageerror', err => {
    console.log(err.message);
    if (err.message.includes('ChunkLoadError')) chunkError = true;
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log("ChunkError:", chunkError);
  await browser.close();
})();
