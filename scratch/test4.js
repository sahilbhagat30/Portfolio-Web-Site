const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://sahilbhagat30.github.io/Portfolio-Web-Site/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const h1 = document.querySelector('h1');
    const h1Opacity = h1 ? window.getComputedStyle(h1.parentElement).opacity : null;
    const bodyHeight = document.body.scrollHeight;
    const canvas = document.querySelector('canvas');
    
    return {
      heroHeight: hero ? hero.clientHeight : null,
      h1Text: h1 ? h1.innerText : null,
      h1Opacity: h1Opacity,
      bodyHeight: bodyHeight,
      canvasWidth: canvas ? canvas.width : null,
      canvasHeight: canvas ? canvas.height : null,
      windowScrollY: window.scrollY
    };
  });

  console.log('DOM DATA:', data);
  await browser.close();
})();
