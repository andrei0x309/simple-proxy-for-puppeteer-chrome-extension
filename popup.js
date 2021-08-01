// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//let changeColor = document.getElementById('changeColor');



let bgP = chrome.extension.getBackgroundPage();


/*if(! bgP.window.extOptions.recurentAlert ){
  timerStopButton.classList.add("alert-hidden");
}*/

/*var input = document.getElementById("popupTimeAlert"),
    input_val = parseInt(input.value),
    btn_add = document.getElementById("btnAdd"),
    btn_remove = document.getElementById("btnRem");
*/


let btn_close_alert =  document.getElementById("closeAlertBtn");

const btnProxyStop = document.getElementById("btnProxyStop");
const btnProxyStart = document.getElementById("btnProxyStart");

console.log(btnProxyStop, btnProxyStart);

const proxyTypeGroup = document.getElementById("proxyTypeGroup");

const btnProxyType = [
  document.getElementById("btnProxyTypeHttp"),
  document.getElementById("btnProxyTypeHttps"),
  document.getElementById("btnProxyTypeSocks4"),
  document.getElementById("btnProxyTypeSocks5"),
];

for( const btn of btnProxyType){
  if(btn){
    btn.onclick = async function(){
      const active = proxyTypeGroup.querySelector(".btn-green");
      if(active){
        active.classList.remove("btn-green");
      }
      this.classList.add("btn-green");
      bgP.window.extOptions.activeProxy.type =  (this.id.replace('btnProxyType','')).toLowerCase();
      await bgP.window.setOptions( bgP.window.extOptions);
    }
  }
}



 
const spanProxyStatusOn = document.getElementById("spanProxyStatusOn");
const spanProxyStatusOff = document.getElementById("spanProxyStatusOff");

const inputproxyHost = document.getElementById("proxyHost");
const inputproxyPort = document.getElementById("proxyPort");






const updatePopup = function(options){

if(options.proxyEnabled){
  spanProxyStatusOff.classList.add("hidden");
  spanProxyStatusOn.classList.remove("hidden");

  btnProxyStart.classList.add("hidden");
  btnProxyStop.classList.remove("hidden");
}else{

  spanProxyStatusOn.classList.add("hidden");
  spanProxyStatusOff.classList.remove("hidden");

  btnProxyStart.classList.remove("hidden");
  btnProxyStop.classList.add("hidden");
}

if(options.activeProxy) {
  const types = ['http', 'https', 'socks4', 'socks5'];
  if(options.activeProxy.type) btnProxyType[types.indexOf(options.activeProxy.type)].classList.add("btn-green");
  inputproxyHost.value = options.activeProxy.host;
  inputproxyPort.value = options.activeProxy.port;
}


};

updatePopup(bgP.window.extOptions);



btnProxyStop.onclick = function(){
  bgP.window.extOptions.proxyEnabled = false;
  bgP.window.setOptions(bgP.window.extOptions);
  bgP.window.disableProxy();
  updatePopup(bgP.window.extOptions);
};

btnProxyStart.onclick = function(){
  bgP.window.extOptions.activeProxy.host = inputproxyHost.value;
  bgP.window.extOptions.activeProxy.port = inputproxyPort.value;
  bgP.window.extOptions.proxyEnabled = true;
  bgP.window.setOptions(bgP.window.extOptions);
  bgP.window.setProxy(bgP.window.extOptions.activeProxy);
  updatePopup(bgP.window.extOptions);
};


let displayAlert = (type, msg) => {
  if(type === "error"){
    document.getElementById("exAlertBox").classList.remove("alert-success");
    document.getElementById("exAlertBox").classList.add("alert-warning");
  }else if(type === "success"){
    document.getElementById("exAlertBox").classList.remove("alert-warning");
    document.getElementById("exAlertBox").classList.add("alert-success");
  }
  
  document.getElementById("alertMsg").innerHTML = msg;
  document.getElementById("exAlert").classList.remove("hidden");
}


let closeAlert = () => {
  const alert = document.getElementById("exAlert");
  if(alert){
    document.getElementById("exAlert").classList.add("hidden");
  }
}
closeAlert();

btn_close_alert.addEventListener("click", function(){
  closeAlert();
}); 



	const myTabs = document.querySelectorAll("ul.nav-tabs > li");
	function myTabClicks(tabClickEvent) {
		for (let i = 0; i < myTabs.length; i++) {
			myTabs[i].classList.remove("active");
		}

		const clickedTab = tabClickEvent.currentTarget; 
		clickedTab.classList.add("active");
		tabClickEvent.preventDefault();

		const myContentPanes = document.querySelectorAll(".tab-pane");

		for (let i = 0; i < myContentPanes.length; i++) {
			myContentPanes[i].classList.remove("active");
		}

		const anchorReference = tabClickEvent.target;
		const activePaneId = anchorReference.getAttribute("href");
		const activePane = document.querySelector(activePaneId);
		activePane.classList.add("active");

	}

	for (let i = 0; i < myTabs.length; i++) {
		myTabs[i].addEventListener("click", myTabClicks)
	}



/*

btn_add.addEventListener("click", function(){
  input.value = parseInt(input.value) + 10;
}); 
 

btn_remove.addEventListener("click", function(){
  if( (parseInt(input.value) - 10) > 0){
    input.value = parseInt(input.value) - 10;
  }else{
    displayAlert('error', "You can't go lower than 5 seconds!");
  }
}); 
 
*/


/*
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
*/


//<link rel="icon" type="image/png" href="/image1.png" id="icon"/>  

var logFunction = function(arr){
  console.log(arr);      
}

//console.log(chrome.extension.getBackgroundPage());
//console.log(chrome.extension.getBackgroundPage().timer);
//let bgTimerClass = (chrome.extension.getBackgroundPage().timer);







/*
timerStartButon.onclick = function(element) {

  let bgP = chrome.extension.getBackgroundPage();
  let inputSeconds = parseInt(input.value);
  if( inputSeconds >= 5 &&  inputSeconds <= 5000 ){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
 
      if( !(bgP.mapStartTimerQueue.has(tabs[0].id)) && !( bgP.mapTabswithTimer.has(tabs[0].id)) ) {
        
        chrome.tabs.executeScript(tabs[0].id,
          //{code: 'document.body.style.backgroundColor = "' + color + '";'}
      
          { code:               
            'document.getElementsByTagName("body")[0].click(); \n '+
            // When an audio alert from a tab is triggered first time from the Worker it may not pe played until the tab is activated
            // so in order to let know Chrome that this tab may play sounds in the future we play an inaudible btn click sound when 
            // registering the worker.
            'let startTimerBtnClickSound = "'+chrome.extension.getURL("/res/sounds/extremly_LV_btnClck.ogg")+'"; \n '+
            'startTimerBtnClickSound = new Audio(startTimerBtnClickSound); \n '+
            'startTimerBtnClickSound.click(); \n '+
            'startTimerBtnClickSound.play(); ',
                  runAt:"document_end" 
          }
          );
        
        bgP.mapStartTimerQueue.set(tabs[0].id, inputSeconds*1000);

        displayAlert('success', "An alert timer has been placed on this tab, alert will triger after "+ inputSeconds +" seconds after you left this tab!");


      }else{
      displayAlert('error', "An alert timer was already started on this tab!");
      }
    });

  } else{
    displayAlert('error', "Alert time must be between 5 and 5000 seconds!");
  }


};


timerStopButton.onclick = function() {
  let bgP = chrome.extension.getBackgroundPage();
  if(bgP.window.extOptions.recurentAlert ){


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if( !(bgP.mapStartTimerQueue.has(tabs[0].id)) && !( bgP.mapTabswithTimer.has(tabs[0].id)) ) {
    displayAlert('error', "There is repeating no alert timer to remove on this tab!");
  }else{
    bgP.mapStartTimerQueue.delete(tabs[0].id);
    bgP.mapTabswithTimer.delete(tabs[0].id);
    displayAlert('success', "The alert timer and reapting alert timer is stoped!");
  }
  });
}else{
  displayAlert('error', "This button can only be used when repeating alert is on, check the extension options page to change that.");
}
};


extOptions.onclick = function(element) {

  chrome.runtime.openOptionsPage();

};


*/