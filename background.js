'use strict';

const getStorageData = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result))),
  );

const setStorageData = (data) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve())),
  );

chrome.runtime.onInstalled.addListener(async () => {
  await setStorageData({
    options: [
      {
        activeProxy: {
          type: 'http',
          host: '',
          port: null,
        },
        proxyEnabled: false,
        proxyList: [],
      },
    ],
  });
});

window.setOptions = async (options) => {
  await setStorageData({ options: [options] });
};

(async () => {
  const data = (await getStorageData('options')).options[0];
  console.log(data);
  if (typeof data.activeProxy !== 'object') {
    data.activeProxy = {
      type: 'http',
      host: '',
      port: null,
    };
  }
  window.extOptions = data;

  window.disableProxy = () => {
    console.log('disable proxy');
    const config = {
      mode: 'direct',
    };

    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});
  };

  window.setProxy = (proxy) => {
    console.log('set proxy');

    if (!proxy) {
      proxy = window.extOptions.activeProxy;
    }

    if (!proxy.type || !proxy.host || !proxy.port) {
      return { error: true, message: 'Invalid Proxy' };
    }

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

    console.log(config);

    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});

    chrome.proxy.onProxyError.addListener((_) => {
      console.log('Proxy error event triigerd by  chrome.proxy.onProxyError');
      const actPage = chrome.extension.getViews({ type: 'popup' })[0];
      if (actPage) {
        actPage.postMessage({ action: 'proxyError' });
      }
    });

    return { error: false, message: 'Proxy set to ' + proxy };
  };
})();
