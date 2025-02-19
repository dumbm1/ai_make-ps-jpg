accordion();

function accordion () {
 let accordion = document.getElementsByClassName('accordion__summary')[0];

  accordion.addEventListener('click', target => {
   fitPanelToContent();
 })
}