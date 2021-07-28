// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

 
chrome.runtime.onInstalled.addListener(function () {
 
  chrome.storage.sync.set({
    options:
    {
      activeProxy: null,
      enableExt: false,
      proxyList : [],
    }
  }
  );
 
});


 (async () => {
  while (window.extOptions === undefined) {
    chrome.storage.sync.get('options', function (data) {
      //console.log(data.options);
      window.extOptions = data.options;
    });
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  

  window.activeProxy = window.extOptions.activeProxy;

  window.setProxy = () => { 
  
    if(window.activeProxy !== null && window.activeProxy !== undefined) {
      
      if(window.activeProxy.proxyType === undefined || window.activeProxy.host === undefined || window.activeProxy.port === undefined) {
      
        return {error: true, message: "No proxy selected"};
  
      }
      const config = {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: window.activeProxy.type,
            host: window.activeProxy.host,
            port: window.activeProxy.port
          },
          bypassList: []
        }
      };
    
    
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function() {}
      );
    
      onProxyError.addListener( _ => { console.log('Proxy error'); });
  
  
      return {error: false, message: "Proxy set to " + window.activeProxy};
    }else{
      return {error: true, message: "No proxy selected"};
    }
  
  
  
   };

})();





 


