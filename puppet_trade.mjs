import { loadEnvFile } from 'node:process';
loadEnvFile('./.env');
import readline from 'node:readline';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { ProjectStockVision, StockVisionTrade } from './www/token/scripts/components/stockvision.js'
// Or import puppeteer from 'puppeteer-core';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let page

async function generateTOTP(secret) {
  function base32ToBytes(base32) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let bytes = [];
    base32 = base32.replace(/[\s=]/g, "").toUpperCase();
    for (let i = 0; i < base32.length; i++) {
      const val = chars.indexOf(base32.charAt(i));
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, "0");
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
  }

  try {
    const keyBytes = base32ToBytes(secret);
    if (keyBytes.length === 0) {
      return "ERROR";
    }
    const key = await crypto.subtle.importKey(
      "raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
    );
    const counter = Math.floor(Date.now() / 1000 / 30);
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setUint32(4, counter);
    const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset+1] & 0xff) << 16) | ((hmac[offset+2] & 0xff) << 8) | (hmac[offset+3] & 0xff);
    
    return (code % 1000000).toString().padStart(6, "0");
  } catch (e) {
     return "HTTPS REQ"; 
    }
}

const setupBrokerage = async () => {
  let browser
  let isUsingVisionBrowser = false
  const today = new Date()
  const now = today.getTime()
  const todayNineInTheMorning = today.setHours(9,0,0,0)
  const todayIsFriday = today.getDay() === 4
  const todayIsSaturday = today.getDay() === 5
  const weekendMultiplier = todayIsFriday 
    ? 3 
    : todayIsSaturday 
      ? 2 
      : 1
  const PriceAnalysis = ProjectStockVision.vision.PriceAnalysis
  const futureTime = todayNineInTheMorning + PriceAnalysis.TWENTYFOUR_HOURS_IN_MILLISECONDS * weekendMultiplier
  const RestartInMiliseconds = futureTime - now

  const tradeReportsResponse = await axios.get('http://localhost:9000/trader/reports/trade/questrade')
  const storage = JSON.stringify(tradeReportsResponse.data)

  // Local storage usage https://scrapingant.com/blog/puppeteer-local-storage
  // Launch new browser or connect to existing vision browser to save resources.
  try {
    browser = await puppeteer.connect({browserURL: `http://localhost:${process.env.BROWSER_DEBUGGING_PORT_VISION}`})
    isUsingVisionBrowser = true
  } catch (error) {
    isUsingVisionBrowser = false
    browser = await puppeteer.launch({headless: false, args: ['--disable-features=LocalNetworkAccessChecks'], debuggingPort: process.env.BROWSER_DEBUGGING_PORT_TRADE})
    // only permissions exposed by puppeteer will work. For unsupported permissions use Page.createCDPSession
    await browser.setPermission('*', ...[{permission: {name: 'notifications'}, state: 'granted'}])
    
  }
 
  page = await browser.newPage({type: 'window',  windowBounds: {height: 500, width: 800}});
  await page.setBypassCSP(true);
  await page.setDefaultTimeout(3 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS); // QT website can be quite slow to render
  await page.goto('https://login.questrade.com/account/login');

  const nameInputElement = await page.waitForSelector('[data-qt="txtUserId"]')
  await nameInputElement.hover(nameInputElement)
  await nameInputElement.focus(nameInputElement)
  await nameInputElement.type(atob(process.env.QT_BOY))
  
  const passInputElement = '[data-qt="txtPassword"]'
  await page.hover(passInputElement)
  await page.focus(passInputElement)
  await page.type(passInputElement, atob(process.env.QT_GIRL))
  
  const submitNamePassButtonElement = '[data-qt="btnLogin"]'
  await page.hover(submitNamePassButtonElement)
  await page.click(submitNamePassButtonElement)
  await page.waitForNavigation()

  // next form
  const clearanceRadioElement = await page.waitForSelector('[data-qt="providerRadio"][value="Authenticator"]')
  await clearanceRadioElement.hover()
  await clearanceRadioElement.click()
  // await page.click(clearanceRadioElement)
  const submitClearanceButtonElement = '[data-qt="sendCodeBtn"]'
  await page.hover(submitClearanceButtonElement)
  await page.click(submitClearanceButtonElement)
  await page.waitForNavigation()

  // next form
  const mfaInputElement = await page.waitForSelector('[data-qt="mfaCode"]')
  await mfaInputElement.hover(mfaInputElement)
  await mfaInputElement.focus(mfaInputElement)
  const codeToInput = await generateTOTP(atob(process.env.QT_BABY))
  await mfaInputElement.type(codeToInput)
  const submitMfaButtonElement = '[data-qt="verifyBtn"]'
  await page.hover(submitMfaButtonElement)
  await page.click(submitMfaButtonElement)
  await page.waitForNavigation({waitUntil: 'networkidle0'})


  // setup trade
  // Do not use evaluateOnNewDocument cause every new page will have the javascript logic executed
  // await page.evaluateOnNewDocument(`${ProjectStockVision.toString()}${StockVisionTrade.toString()}`)
  await page.evaluate(`
    ${ProjectStockVision.toString()};
    ${StockVisionTrade.toString()};
    localStorage.setItem('${StockVisionTrade.constants.localStorageName}', '${storage}');
    StockVisionTrade.start()
    console.log('ida for the gyal them')
  `)

  console.log(`will restart by ${new Date(futureTime).toString()}`)

  setTimeout(async () => {
    if (isUsingVisionBrowser) {
      try {
        await page.close()
      } catch (error) {
        
      }
    } else {
      await browser.close()
    }
    console.log('Closed browser session & restarting brokerage setup')
    setupBrokerage()
  }, RestartInMiliseconds)

  return Promise.resolve(true)
}

await setupBrokerage()

rl.question(`What do you want to do - `, async (name) => {
  console.log(`closing process now - ${name}`);
  switch(true) {
    case name.includes('.close'):
      try {
        await page.evaluate(`
          StockVisionTrade.stop()
        `)
        const profileElement = await page.waitForSelector('shell-header-profile')
        await profileElement.click()
        const logOutButtonElement = await page.waitForSelector('button[dataqt="log_out_btn"]')
        await logOutButtonElement.click()
        await page.waitForNavigation({waitUntil: 'networkidle0'})
      } catch (error) {

      } finally {
        await page.close()
        process.exit()
        rl.close();
      }
      break
    default:
      process.exit()
  }
});
