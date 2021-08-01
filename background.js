// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

 
chrome.runtime.onInstalled.addListener(function () {
 
  chrome.storage.sync.set({
    options:
    {
      activeProxy: {
        type: 'http',
        host: '',
        port: null,
      },
      proxyEnabled: false,
      proxyList : [],
    }
  }
  );
 
});


window.setOptions = async (options) =>  {
  await new Promise(function (resolve) {
  chrome.storage.sync.set({'options':options}, function() {
    resolve();
   });
  });
  window.extOptions = options;
}
 

 (async () => {
  while (window.extOptions === undefined) {
    chrome.storage.sync.get('options', function (data) {
      //console.log(data.options);
      if( typeof data.activeProxy !== 'object'){
        data.activeProxy = {
          type: 'http',
          host: '',
          port: null,
        };
      }
      window.extOptions = data;
    });
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  

  window.disableProxy = () => { 
    console.log('disable proxy');
  const config = {
      mode: "direct",
    };

  chrome.proxy.settings.set(
      {value: config, scope: 'regular'},
      function() {}
    );

  };

  window.setProxy = (proxy) => { 
    console.log('set proxy');
    
    if (!proxy) {
      proxy = window.extOptions.activeProxy;
    }

      if( !proxy.type  || !proxy.host || !proxy.port) {
        return {error: true, message: "Invalid Proxy"};
      }

      const config = {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: proxy.type,
            host: proxy.host,
            port: parseInt(proxy.port)
          },
          bypassList: []
        }
      };
    
    console.log(config);
    
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function() {}
      );
    
      chrome.proxy.onProxyError.addListener( _ => { console.log('Proxy error event triigerd by  chrome.proxy.onProxyError'); });
  
  
      return {error: false, message: "Proxy set to " + proxy};
 
  
   };

})();





 


