## Simple Proxy For Pupeteer (chrome extension)

This extension is primarily to be used with Puppeteer to control the proxy setting of a chromium based web browser.

Download from Chrome-Store:

But you can use it as a simple proxy extension without Puppeteer. The only requirement is a working proxy server.

Here is a code example of how to use it programatically with Pupeteer:

```javascript
(async () => {
  // ...
  // Proxy Object - Replace with a working proxy
  // Be sure that the proxy server is working otherwise the browser won't be able to access the internet
  const proxy = {
    type: 'http',
    host: '127.0.0.1',
    port: 8888,
  };

  // Start puppeteer
  const browser = await puppeteer.launch(options);
  // get the extension context
  // be sure to replace the extension id with the actual extension id check the extension id in the extension manager
  // usually it should be: 'iaogkfhfileohnippcacldlglfbgbpji'
  const proxyExtension = await browser.waitForTarget((t) => t.type() === 'background_page' && t.url().includes('iaogkfhfileohnippcacldlglfbgbpji'));

  // set the proxy
  proxyExtension.evaluate((proxy) => {
    chrome.tabs.query({ active: true }, async (proxy) => {
      window.setProxy(proxy);
    });
  }, proxy);

  // ...
})();
```

### Some Notes

- Be sure to set the proxy with a working proxy, the extension dosen't verify that your proxy is working, if the proxy is bad your connections will fail -> NET:ERR.

- You can use **window.setProxy(proxy)** to set programaticaly the proxy for the browser at any time you want(probably after some x request), if you want to disable the proxy(direct access) use **window.setProxy(disableProxy)**.
