import type { T_DEFAULT_OPTIONS } from '../types';

export const getStorageData = (key: string): Promise<any> =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result))),
  );

export const setStorageData = (data: Record<string, unknown>): Promise<void | Error> =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve())),
  );

export const setOptions = async (options: T_DEFAULT_OPTIONS) => {
  await setStorageData({ options });
};

export const getOptions = async () => {
  const data = await getStorageData('options');
  return data?.options || DEFAULT_OPTIONS;
};

export const DEFAULT_OPTIONS = {
  activeProxy: {
    type: 'http',
    host: '',
    port: '',
  },
  proxyDisconnectOnFailure: false,
  proxyEnableOnBrowserStart: false,
  proxyEnabled: false,
  theme: 'dark',
} as T_DEFAULT_OPTIONS;

export const setDefaultOptions = async () => {
  const options = await getOptions();
  if (options?.activeProxy?.type) {
    return;
  }
  await setOptions(DEFAULT_OPTIONS);
};

export const getProxyIp = async () => {
  let req;
  try {
    req = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
  } catch (e) {
    console.log(e);
    return { error: true };
  }
  if (req.ok) {
    let dataText = await req.text();
    const data = dataText
      .trim()
      .split('\n')
      .reduce(function (obj: any, pair: any) {
        pair = pair.split('=');
        return (obj[pair[0]] = pair[1]), obj;
      }, {});
    data.error = false;
    return data;
  }
  return { error: true };
};
