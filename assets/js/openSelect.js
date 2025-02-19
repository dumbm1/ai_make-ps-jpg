/**
 *
 * @param {HTMLElement} opts.elemTrigger - some element trigger to select open
 * @param {HTMLElement} opts.elemSelect
 * @return {HTMLElement} selected option
 * */
function openSelect(opts) {
 let elemTrigger = opts.elemTrigger;
 let elemSelect = opts.elemSelect;
 let attrSelectOpen = 'data-select-open';

 document.addEventListener('click', (e) => {

  if (e.target == elemTrigger) {
   if (!elemSelect.hasAttribute(attrSelectOpen)) {
    elemSelect.focus();
    elemSelect.size = elemSelect.length;
    elemSelect.setAttribute(attrSelectOpen, '');
   } else {
    elemSelect.size = 1;
    elemSelect.removeAttribute(attrSelectOpen);
   }
  } else {
   elemSelect.size = 1;
   elemSelect.removeAttribute(attrSelectOpen);
  }
 });

 document.addEventListener('keyup', (e) => {
  if (e.code == 'Enter' && elemSelect.hasAttribute(attrSelectOpen) && (!event.ctrlKey && !event.metaKey)) {
   elemSelect.size = 1;
   elemSelect.removeAttribute(attrSelectOpen);
   console.log(elemSelect.querySelectorAll('option')[elemSelect.selectedIndex]);
  }
 });

 return elemSelect.querySelectorAll('option')[elemSelect.selectedIndex];
}