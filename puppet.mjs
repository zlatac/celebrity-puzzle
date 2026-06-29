import puppeteer from 'puppeteer';
import { ProjectStockVision } from './www/token/scripts/components/stockvision.js'
// Or import puppeteer from 'puppeteer-core';

const PriceAnalysis = ProjectStockVision.vision.PriceAnalysis

const stocks = [
  // {
  //   website: PriceAnalysis.QUOTE_WEBSITES.LIVE_COIN_WATCH,
  //   urlCode: 'toby-TOBY',
  //   primaryCode: 'toby',
  //   exchange: '',
  //   script: () => {
  //     ProjectStockVision.visionLarge('toby',0.1,0.1,1,true,undefined,undefined,'10min','2min',true)
  //   }
  // },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'ibkr',
    primaryCode: 'ibkr',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('ibkr',2.5)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'ndaq',
    primaryCode: 'ndaq',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('ndaq')
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'aapl',
    primaryCode: 'aapl',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('aapl')
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'amzn',
    primaryCode: 'amzn',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('amzn', 2.3)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'vz',
    primaryCode: 'vz',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionTiny('vz',1.9)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'gev',
    primaryCode: 'gev',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionLarge('gev',2,2,1.25,true,3,undefined,'1day','5min')
      ProjectStockVision.visionTiny('gev',2.9)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'pfe',
    primaryCode: 'pfe',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionLarge('pfe_small',0.8,0.5,1.88,true,0.81,undefined,'4hour','5min')
      ProjectStockVision.visionTiny('pfe', 1.7)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'xom',
    primaryCode: 'xom',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionTiny('xom', 2.16)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'cvx',
    primaryCode: 'chev',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionTiny('chev', 1.9)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'wmt',
    primaryCode: 'wmt',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('wmt')
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'cost',
    primaryCode: 'cost',
    exchange: PriceAnalysis.EXCHANGES.NASDAQ,
    script: () => {
      ProjectStockVision.visionTiny('cost',1.9)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'jnj',
    primaryCode: 'jnj',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionTiny('jnj',1.7)
    }
  },
  {
    website: PriceAnalysis.QUOTE_WEBSITES.WEBULL,
    urlCode: 'unp',
    primaryCode: 'unp',
    exchange: PriceAnalysis.EXCHANGES.NYSE,
    script: () => {
      ProjectStockVision.visionTiny('unp',1.9)
    }
  },
]

const generateUrl = (website, urlCode, exchange) => {
  const site = website.toLowerCase()
  switch(true) {
    case site.includes(PriceAnalysis.QUOTE_WEBSITES.LIVE_COIN_WATCH):
      return `https://livecoinwatch.com/price/${urlCode}`
    case site.includes(PriceAnalysis.QUOTE_WEBSITES.WEBULL):
      return `https://www.webull.com/quote/${exchange}-${urlCode}`
    default:
      return undefined
  }
}

const setupStocks = async (stocks) => {
  let loadedCounter = 0
  const now = Date.now()
  const todaySevenInTheMorning = new Date().setHours(7,0,0,0)
  const RestartInMiliseconds = (todaySevenInTheMorning + PriceAnalysis.TWENTYFOUR_HOURS_IN_MILLISECONDS) - now

  // Local storage usage https://scrapingant.com/blog/puppeteer-local-storage
  // Launch the browser and open a new blank page.
  const browser = await puppeteer.launch({headless: false, args: ['--disable-features=LocalNetworkAccessChecks']})
  // only permissions exposed by puppeteer will work. For unsupported permissions use Page.createCDPSession
  await browser.setPermission('*', ...[{permission: {name: 'notifications'}, state: 'granted'}])

  for(const stock of stocks) {
    try {
      const url = generateUrl(stock.website, stock.urlCode, stock.exchange)
      const page = await browser.newPage({type: 'window',  windowBounds: {height: 500, width: 800}})
      await page.goto(url)
      await page.evaluate(ProjectStockVision.toString())
      await page.evaluate(stock.script)
      if (stock.website === PriceAnalysis.QUOTE_WEBSITES.WEBULL) {
        const cookieRejectButton = await page.$('[data-i18n-key="H5_BIZ_CONCENT_0005"]')
        if (cookieRejectButton !== null) {
          await cookieRejectButton.click()
        }
      }
      loadedCounter++
    } catch (error) {
      console.error('Setup stocks',error)
    }
  }
  console.log(`Finished loading ${loadedCounter}/${stocks.length} stocks`)

  setTimeout(async () => {
    await browser.close()
    console.log('Closed browser session & restarting stocks setup')
    setupStocks(stocks)
  }, RestartInMiliseconds)
}

// Local storage usage https://scrapingant.com/blog/puppeteer-local-storage
// Launch the browser and open a new blank page.
// const browser = await puppeteer.launch({headless: false, args: ['--disable-features=LocalNetworkAccessChecks']})
// only permissions exposed by puppeteer will work. For unsupported permissions use Page.createCDPSession
// await browser.setPermission('*', ...[{permission: {name: 'notifications'}, state: 'granted'}])
// await browser.setPermission('https://livecoinwatch.com', ...[{permission: {name: 'notifications'}, state: 'granted'}])
// const browser2 = await puppeteer.launch({headless: false})

// const page1 = await browser.newPage();
// const page2 = await browser.newPage({type: 'window',  windowBounds: {height: 500, width: 800}});

// await page1.goto('https://livecoinwatch.com/price/toby-TOBY');
// await page2.goto('https://google.com');
// await page1.goto('https://www.webull.com/quote/nasdaq-aapl');
// await page2.goto('https://www.webull.com/quote/nasdaq-amzn');

// await page1.evaluate(ProjectStockVision.toString());
// await page1.evaluate(() => {
//   ProjectStockVision.visionLarge('toby',0.1,0.1,1,true,undefined,undefined,'10min','2min',true)
// });

setupStocks(stocks)


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

// await browser.close();