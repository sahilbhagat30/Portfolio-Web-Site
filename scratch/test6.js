const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const scrollYBefore = await page.evaluate(() => window.scrollY);
  
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  
  const scrollYAfter = await page.evaluate(() => window.scrollY);

  console.log('Scroll Y Before:', scrollYBefore);
  console.log('Scroll Y After:', scrollYAfter);

  await browser.close();
})();
