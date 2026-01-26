const puppeteer = require('puppeteer');

(async () => {
  try{
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const sizes = [
      {w:1920,h:1080,name:'desktop-1920x1080'},
      {w:1366,h:768,name:'desktop-1366x768'},
      {w:768,h:1024,name:'tablet-768x1024'},
      {w:390,h:844,name:'mobile-390x844'}
    ];

    // small helper for compatibility with older/newer Puppeteer APIs
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (const s of sizes){
      await page.setViewport({width:s.w, height:s.h});
      await page.goto('http://localhost:8000', {waitUntil: 'networkidle2'});
      // small delay to allow canvas animations to settle
      if (typeof page.waitForTimeout === 'function'){
        await page.waitForTimeout(600);
      } else {
        await sleep(600);
      }
      const file = `screenshot-homepage-${s.name}.png`;
      await page.screenshot({path: file, fullPage: false});
      console.log('Saved', file);
    }

    await browser.close();
    console.log('Screenshots saved.');
    process.exit(0);
  } catch (err){
    console.error('Screenshot script failed:', err);
    process.exit(1);
  }
})();
