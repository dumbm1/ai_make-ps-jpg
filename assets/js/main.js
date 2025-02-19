try {
 fitPanelToContent();

 changeTheme(csInterface);

 let reloadButton = document.getElementById("reload_btn");
 reloadButton.addEventListener('click', reloadPanel);

} catch (e) {
 console.log(e);
}