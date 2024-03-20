import { setOptions, getOptions, setDefaultOptions, getProxyIp } from './lib/utils';

const disableProxy = (setOption = false, options = null as null | Awaited<ReturnType<typeof getOptions>>) => {
  const config = {
    mode: 'direct',
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});
  if (setOption) {
    if (options === null) {
      getOptions().then((options) => {
        if (options?.activeProxy) {
          setOptions({ ...options, proxyEnabled: false });
        }
      });
    } else {
      setOptions({ ...options, proxyEnabled: false });
    }
  }
};

const sendProxyError = () => {
  chrome.runtime.sendMessage({ msg: 'proxyError', message: 'Bad proxy try different one' });
};

const setProxy = async (
  data: {
    proxy: {
      type: string;
      host: string;
      port: string;
    };
  },
  sendResponse: (arg0: any) => void,
) => {
  const proxy = data.proxy;

  if (!proxy.type || !proxy.host || !proxy.port) {
    if (!proxy.host) {
      sendResponse({ error: true, message: 'Invalid Proxy: Host is required' });
      return;
    }
    if (!proxy.port) {
      sendResponse({ error: true, message: 'Invalid Proxy: Port is required' });
      return;
    }
    if (!proxy.type) {
      sendResponse({ error: true, message: 'Invalid Proxy: Type is required' });
      return;
    }
    return;
  }

  if (proxy.type !== 'http' && proxy.type !== 'socks4' && proxy.type !== 'socks5' && proxy.type !== 'https') {
    sendResponse({ error: true, message: 'Invalid Proxy: Type should be http, https, socks4 or socks5' });
    return;
  }

  if (isNaN(parseInt(proxy.port))) {
    sendResponse({ error: true, message: 'Invalid Proxy: Port should be a number' });
    return;
  }

  proxy.host = proxy.host.trim();
  proxy.port = String(proxy.port).trim();

  const config = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: proxy.type,
        host: proxy.host,
        port: parseInt(proxy.port),
      },
      bypassList: [],
    },
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});

  const options = await getOptions();

  await setOptions({ ...options, proxyEnabled: true, activeProxy: proxy });

  sendResponse({ error: false, message: 'Proxy set to ' + proxy });
};

chrome.proxy.onProxyError.addListener(async (e) => {
  const options = await getOptions();
  if (options.proxyDisconnectOnFailure) {
    disableProxy();
    await setOptions({ ...options, proxyEnabled: false });
  }
  console.warn('Proxy error event triigerd by chrome.proxy.onProxyError ', e);
  sendProxyError();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getOptions') {
    getOptions().then((options) => {
      sendResponse(options);
    });
  } else if (request.action === 'setProxy') {
    console.log('setProxy', request.data);

    setProxy(request.data, sendResponse).catch((e) => {
      console.log('error', e);
      sendResponse({ error: true, message: 'Invalid Proxy' });
    });
  } else if (request.action === 'disableProxy') {
    disableProxy();
    const optionsP = getOptions();
    optionsP.then((options) => {
      if (options?.activeProxy) {
        setOptions({ ...options, proxyEnabled: false });
      }
    });

    sendResponse({ success: true });
  } else if (request.action === 'wakeUp') {
    console.info('Wake up page was called');
    sendResponse({ success: true });
  } else {
    sendResponse({ success: false });
  }
  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  await setDefaultOptions();
});

chrome.runtime.onStartup.addListener(async () => {
  await setDefaultOptions();
  const options = await getOptions();
  if (options.proxyEnableOnBrowserStart) {
    setProxy(options.activeProxy, () => {});
  }
});

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'getProxyIp') {
    const data = await getProxyIp();
    sendResponse(data);
  }
});

(self as any).isProxyExtension = true;
(self as any).setProxy = setProxy;
(self as any).disableProxy = disableProxy;
(self as any).getProxyIp = getProxyIp;
