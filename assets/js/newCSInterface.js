// 'use strict';
let csInterface = new CSInterface();



// themeChanger(csInterface);
// fitPanelToContent();


/*
loadScript("CSInterface.js")
 .then(script => loadScript("reloadPanel.js"))
 .then(script => loadScript("themeChanger.js"))
 .then(script => loadScript("fitPanelToContent.js"))
 .then(script => {
  // скрипты загружены, мы можем использовать объявленные в них функции

  fitPanelToContent();
  changeTheme(csInterface);

 });

function loadScript(src) {
 return new Promise(function (resolve, reject) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => resolve(script);
  script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));

  document.head.append(script);
 });
}
*/



/*function themeChanger(csInterface) {
 let appSkinInfo = csInterface.hostEnvironment.appSkinInfo;

 updateThemeWithAppSkinInfo(appSkinInfo);

 csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

 /!**
  * Update the theme with the AppSkinInfo retrieved from the host product.
  *!/
 function updateThemeWithAppSkinInfo(appSkinInfo) {
  let fontSize = appSkinInfo.baseFontSize;
  let appBgColor = appSkinInfo.panelBackgroundColor.color;
  let html = document.documentElement;

  document.body.style.fontSize = fontSize + 'px';

  if (appBgColor.red < 180) {
   html.setAttribute('data-theme-dark', '');
   console.log("Dark theme");
  } else {
   html.removeAttribute('data-theme-dark');
   console.log("Light theme");
  }
  if (appBgColor.red == 50) {
   document.body.style.background = '#323232';
   console.log('bg darker');
  } else if (appBgColor.red == 83) {
   document.body.style.background = '#535353';
   console.log('gb dark');
  } else if (appBgColor.red == 184) {
   document.body.style.background = '#b8b8b8';
   console.log('bg light');
  } else if (appBgColor.red == 240) {
   document.body.style.background = '#f0f0f0';
   console.log('bg lighter');
  }
 }

 function onAppThemeColorChanged(event) {
  var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
  updateThemeWithAppSkinInfo(skinInfo);
 }
}*/

/*function fitPanelToContent() {
 setTimeout(function () {
  csInterface.resizeContent(document.documentElement.offsetWidth, document.documentElement.offsetHeight);
 }, 500);
}*/

/*
function reloadPanel() {
 location.reload();
}*/
