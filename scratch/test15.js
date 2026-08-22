const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to a standard iPhone size
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle0' });

  // Wait a bit to ensure animations run
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'mobile_layout.png' });

  await browser.close();
})();
