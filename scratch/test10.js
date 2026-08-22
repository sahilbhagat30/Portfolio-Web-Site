const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const scrollInfo = await page.evaluate(() => {
    return {
      docHeight: document.documentElement.scrollHeight,
      docClientHeight: document.documentElement.clientHeight,
      bodyHeight: document.body.scrollHeight,
      bodyClientHeight: document.body.clientHeight
    };
  });

  console.log('Scroll Info:', scrollInfo);
  await browser.close();
})();
