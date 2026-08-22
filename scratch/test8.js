const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const getOverlayOpacity = () => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    let el = h1;
    while (el && !el.className.includes('absolute inset-0 flex flex-col justify-center')) {
      el = el.parentElement;
    }
    return el ? window.getComputedStyle(el).opacity : null;
  };

  let opacityBefore = await page.evaluate(getOverlayOpacity);
  
  await page.evaluate(() => window.scrollBy(0, 2000));
  await new Promise(r => setTimeout(r, 1000));
  
  let opacityAfter = await page.evaluate(getOverlayOpacity);

  console.log('Opacity Before:', opacityBefore);
  console.log('Opacity After:', opacityAfter);

  await browser.close();
})();
