## Simple Proxy For Puppeteer (browser extension)

This extension can be used with Puppeteer to control the proxy setting of a Chromium-based web browser.

Download from Chrome Store:

[https://chrome.google.com/webstore/detail/simple-proxy-for-puppetee/meeohdhldndmeffgoccpgacfdigmphab](https://chrome.google.com/webstore/detail/simple-proxy-for-puppetee/meeohdhldndmeffgoccpgacfdigmphab)

You can also use it as a simple proxy extension without Puppeteer.
The only requirement is a working proxy server.

### Example

You can find in `index.ts` in the example folder a simple example of how to use Puppeteer to change the proxy using the browser extension simple proxy for Puppeteer. Link to the example [here](/example/).

### Some Notes

- Be sure to set the proxy with a working proxy, the extension has a button to check if the proxy is working.

- Extension was rewritten to use Manifest V3 and newer technology to be still usable after Google Chrome drops support for Manifest V2.

- The extension does not support proxy authentication, HTTP and HTTPS proxy auth can be implemented, in theory using basic auth and catching the webRequest event, might have some poor V3 support, and it is not implemented in this extension.

### Screenshot

![screenshot](/screen_1.webp)

### License

MIT
