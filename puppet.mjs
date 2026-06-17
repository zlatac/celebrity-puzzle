import puppeteer from 'puppeteer';
import {ProjectStockVision, StockVisionTrade} from './www/token/scripts/components/stockvision.js'
// Or import puppeteer from 'puppeteer-core';

// Local storage usgae https://scrapingant.com/blog/puppeteer-local-storage

// Launch the browser and open a new blank page.
const browser = await puppeteer.launch({headless: false, args: ['--disable-features=LocalNetworkAccessChecks']})
// only permissions exposed by puppeteer will work. For unsupported permissions use Page.createCDPSession
browser.setPermission('https://www.webull.com', ...[{permission: {name: 'notifications'}, state: 'granted'}])
// const browser2 = await puppeteer.launch({headless: false})

const page1 = await browser.newPage();
const page2 = await browser.newPage({type: 'window',  windowBounds: {height: 500, width: 800}});

await page1.goto('https://google.com');
await page2.goto('https://google.com');
// await page1.goto('https://www.webull.com/quote/nasdaq-aapl');
// await page2.goto('https://www.webull.com/quote/nasdaq-amzn');

// await page1.evaluate(ProjectStockVision.toString());
// await page1.evaluate(() => {
//   ProjectStockVision.visionTiny('aapl_auto')
// });



// const context = await browser.createBrowserContext();

// const page1 = await context.newPage();
// const page2 = await context.newPage();

// await page1.goto('https://google.com');
// await page2.goto('https://facebook.com');



// const page = await browser.newPage();

// // Navigate the page to a URL.
// await page.goto('https://developer.chrome.com/');

// // Set screen size.
// await page.setViewport({width: 1080, height: 1024});

// // Open the search menu using the keyboard.
// await page.keyboard.press('/');

// // Type into search box using accessible input name.
// await page.locator('::-p-aria(Search)').fill('automate beyond recorder');

// // Wait and click on first result.
// await page.locator('.devsite-result-item-link').click();

// // Locate the full title with a unique string.
// const textSelector = await page
//   .locator('::-p-text(Customize and automate)')
//   .waitHandle();
// const fullTitle = await textSelector?.evaluate(el => el.textContent);

// // Print the full title.
// console.log('The title of this blog post is "%s".', fullTitle);

setTimeout(async() => {
  // await context.close();
  await browser.close();
  // await browser2.close();
}, 1000*60)