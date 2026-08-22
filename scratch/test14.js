const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle0', timeout: 60000 });

  const data = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const scrollyCanvas = canvases.find(c => c.className.includes('object-cover'));
    if (!scrollyCanvas) return 'No canvas found';
    
    const ctx = scrollyCanvas.getContext('2d');
    if (!ctx) return 'No 2d context';
    
    // get center pixel
    const pixel = ctx.getImageData(scrollyCanvas.width / 2, scrollyCanvas.height / 2, 1, 1).data;
    
    return {
      pixel: Array.from(pixel)
    };
  });

  console.log('Canvas Data:', data);
  await browser.close();
})();
