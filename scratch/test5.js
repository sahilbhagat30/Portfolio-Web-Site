const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      width: c.width,
      height: c.height,
      className: c.className
    }));
    const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText);
    
    return {
      canvases,
      h1s
    };
  });

  console.log('DOM DATA:', data);
  await browser.close();
})();
