const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const heights = await page.evaluate(() => {
    const getHeroOpacityElement = () => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      let el = h1;
      while (el && !el.className.includes('absolute inset-0 flex flex-col justify-center')) {
        el = el.parentElement;
      }
      return el;
    };
    
    const overlayTarget = getHeroOpacityElement().parentElement.parentElement;
    
    return {
      overlayTargetHeight: overlayTarget.clientHeight,
      overlayTargetClassName: overlayTarget.className,
      heroHeight: document.getElementById('hero').clientHeight
    };
  });

  console.log('Heights:', heights);
  await browser.close();
})();
