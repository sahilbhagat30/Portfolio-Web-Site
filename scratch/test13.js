const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    // get all canvases
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const scrollyCanvas = canvases.find(c => c.className.includes('object-cover'));
    if (!scrollyCanvas) return null;
    
    // find containerRef
    let el = scrollyCanvas;
    while (el && !el.className.includes('h-full w-full relative')) {
      el = el.parentElement;
    }
    
    return {
      rect: el ? el.getBoundingClientRect().toJSON() : null
    };
  });

  console.log('Scrolly Rect:', data);
  await browser.close();
})();
