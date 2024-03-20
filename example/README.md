# Example

You can find in `index.ts` a simple example of how to use puppeteer to change the proxy using
the browser extension simple proxy for puppeteer.

# Running the example script

```javascript
cd example
yarn install
yarn execute
```

Scipt expects the browser extension to be installed and running.
It will frist change the proxy( proxy from example may not work when you run the script).
Then it will check the browser IP and print it to the console.
It will wait for service worker to sleep(200 secs) then wake the service worker and disable the proxy.
Then it will check the browser IP and print it to the console.

Output will be something like this:

```
service_worker
{
  fl: '50f220',
  h: 'www.cloudflare.com',
  ip: '193.176.84.3',
  ts: '1710951269.375',
  visit_scheme: 'https',
  uag: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  colo: 'OTP',
  sliver: 'none',
  http: 'http/2',
  loc: 'RO',
  tls: 'TLSv1.3',
  sni: 'plaintext',
  warp: 'off',
  gateway: 'off',
  rbi: 'off',
  kex: 'X25519',
  error: false
}
service_worker
{
  fl: '696f103',
  h: 'www.cloudflare.com',
  ip: '92.204.175.88',
  ts: '1710951470.234',
  visit_scheme: 'https',
  uag: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  colo: 'FRA',
  sliver: 'none',
  http: 'http/2',
  loc: 'FR',
  tls: 'TLSv1.3',
  sni: 'plaintext',
  warp: 'off',
  gateway: 'off',
  rbi: 'off',
  kex: 'X25519',
  error: false
}
Done in 205.79s.
```

## Methods available in service worker

```
const wokerContext = {
  setProxy: () => {
    const host = 'blade1.bucharest-rack451.nodes.gen4.ninja'
    const type = 'https'
    const port = '9002'
    const data = {proxy: {
      type,
      host,
      port
    } };
    (self as any).setProxy(data)
  },
  getProxyIp:  () => {
    return (self as any).getProxyIp()
  },
  disableProxy: () => {
    const setProxyDisabledInStorage = true
    return (self as any).disableProxy(setProxyDisabledInStorage)
   }
}
```
