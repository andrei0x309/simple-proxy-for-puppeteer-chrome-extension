import os from 'os';
import puppeteer from 'puppeteer';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// STORE ID: meeohdhldndmeffgoccpgacfdigmphab
// TEST ID: hhpjaigplgeneiehgaedalolbabgllgm
// EXTIONSION REPLACE IN CASE OF LOCAL TESTING
const EXTENSION_ID = 'meeohdhldndmeffgoccpgacfdigmphab';

const wakeUpServiceWorker = async (browser: Awaited<ReturnType<typeof puppeteer.launch>>) => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/wakeup-page.html`);
  await wait(100);
  await page.close();
  await wait(200);
};

const findServiceWorker = async (browser: Awaited<ReturnType<typeof puppeteer.launch>>) => {
  const targets = await browser.targets();
  for (const target of targets) {
    const type = target.type();
    if (type === 'service_worker' && target.url().includes(EXTENSION_ID)) {
      const worker = await target.worker();
      return worker;
    }
  }
  return null;
};

const findOrWakeUpServiceWorker = async (browser: Awaited<ReturnType<typeof puppeteer.launch>>) => {
  let worker = await findServiceWorker(browser);
  if (!worker) {
    wakeUpServiceWorker(browser);
    worker = await findServiceWorker(browser);
    if (!worker) {
      throw new Error('Service worker not found');
    }
  }
  return worker;
};

// These are methods/properties that are available in service worker context of the extension
const wokerContext = {
  setProxy: () => {
    const host = 'blade1.bucharest-rack451.nodes.gen4.ninja';
    const type = 'https';
    const port = '9002';
    const data = {
      proxy: {
        type,
        host,
        port,
      },
    };
    (self as any).setProxy(data);
  },
  getProxyIp: () => {
    return (self as any).getProxyIp();
  },
  disableProxy: () => {
    const setProxyDisabledInStorage = true;
    return (self as any).disableProxy(setProxyDisabledInStorage);
  },
};

const main = async () => {
  const executablePath = `C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe`;
  const userDataDir = `${os.homedir()}\\AppData\\Local\\Microsoft\\Edge Dev\\User Data`;

  const options = {
    executablePath,
    headless: false,
    args: ['--no-sandbox'],
    userDataDir,
    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation', '--mute-audio'],
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  page.setDefaultTimeout(0);

  // Service worker will be online because it has on browser start event listener
  // but if you want to execute in server context later when servie worker is offline
  // you will need to use the function wakeUpServiceWorker with correct extension id
  let worker = await findOrWakeUpServiceWorker(browser);
  await worker?.evaluate(wokerContext.setProxy);

  console.log(await worker?.evaluate(wokerContext.getProxyIp));

  await wait(1000 * 200); // 200 seconds SW will be offline

  worker = await findOrWakeUpServiceWorker(browser);

  await worker?.evaluate(wokerContext.disableProxy);

  console.log(await worker?.evaluate(wokerContext.getProxyIp));

  await browser.close();
};

main();
