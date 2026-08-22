const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log('Navigating...');
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle0' });

  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'screenshot1.png' });
  console.log('Took screenshot 1');
  
  // Scroll down by 500px to trigger animation
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshot2.png' });
  console.log('Took screenshot 2');

  await browser.close();
})();
