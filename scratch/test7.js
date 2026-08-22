const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  let h1OpacityBefore = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? window.getComputedStyle(h1.parentElement).opacity : null;
  });
  
  await page.evaluate(() => window.scrollBy(0, 2000));
  await new Promise(r => setTimeout(r, 1000));
  
  let h1OpacityAfter = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? window.getComputedStyle(h1.parentElement).opacity : null;
  });

  console.log('Opacity Before:', h1OpacityBefore);
  console.log('Opacity After:', h1OpacityAfter);

  await browser.close();
})();
