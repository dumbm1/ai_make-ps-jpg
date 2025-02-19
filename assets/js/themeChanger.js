function changeTheme(csInterface) {
 let appSkinInfo = csInterface.hostEnvironment.appSkinInfo;

 updateThemeWithAppSkinInfo(appSkinInfo);

 csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

 /**
  * Update the theme with the AppSkinInfo retrieved from the host product.
  */
 function updateThemeWithAppSkinInfo(appSkinInfo) {
  let fontSize = appSkinInfo.baseFontSize;
  let appBgColor = appSkinInfo.panelBackgroundColor.color;
  let html = document.documentElement;

  let fontFam = appSkinInfo.baseFontFamily;

  console.log(appBgColor);

  html.style.fontSize = fontSize + 'px';

  if (appBgColor.red == 50) {
   html.setAttribute('data-theme', 'darker');
  } else if (appBgColor.red == 83) {
   html.setAttribute('data-theme', 'dark');
  } else if (appBgColor.red == 184) {
   html.setAttribute('data-theme', 'light');
  } else if (appBgColor.red == 240) {
   html.removeAttribute('data-theme');
  }
 }

 function onAppThemeColorChanged(event) {
  var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
  updateThemeWithAppSkinInfo(skinInfo);
 }
}
