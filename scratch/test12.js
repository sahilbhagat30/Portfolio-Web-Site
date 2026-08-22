const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const opacities = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    
    let el = h1;
    while (el && !el.className.includes('absolute inset-0 flex flex-col justify-center')) {
      el = el.parentElement;
    }
    
    return {
      h1Opacity: window.getComputedStyle(h1).opacity,
      parentOpacity: el ? window.getComputedStyle(el).opacity : null
    };
  });

  console.log('Opacities:', opacities);
  await browser.close();
})();
