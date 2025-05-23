printMailPs();

function printMailPs() {
 const printMailPsBtn = document.getElementById("make_mail_ps");
 printMailPsBtn.addEventListener("click", e => {
  csInterface.evalScript(jsx_print_mail.toString() + ';jsx_print_mail();', function (result) {
   const infoStringSpan = document.querySelector('.footer__info-string-span');
   if (result) {
    let res = Math.round(result);
    res = '@-ps (' + formatTime(new Date()) + '): ' + divideNumberByPieces(res, ' ') + ' Kb\n';
    infoStringSpan.innerText += res;
   } else {
    infoStringSpan.innerText += 'error: ' + result;
   }

   // alert('evalScript result: ' + result);
  });
 });
}

function jsx_print_mail() {
 var printerNames = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
 var printPresets = ['mount-preview', 'sep_pdf'];
 var ppdNames = ['PPDFile Adobe PDF', 'PPDFile LaserGraver 4000'];

 var ad = activeDocument;

 try {
  var txtLay = ad.layers.getByName('@_tt');
  if (txtLay.visible) txtLay.visible = false;
 } catch (e) {
  // throw new Error('Layer @_tt does not exists');
 }

 /*
    var baseMountPath = '/D/work/!_mount/' + new Date().getFullYear() + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2);
   var jpgFilePath = baseMountPath + '/' + baseFileName + '/mount_' + baseFileName + '.jpg';
   var psFilePath = baseMountPath + '/' + baseFileName + '/mount_' + baseFileName + '.ps';
   * */

 // var printFolderPath = Folder.desktop + '/@/__test_print';

 var printFileName = ad.name.slice(0, -3);
 var printFolderPath = ad.path + '/jpg';
 var printFile = new File(printFolderPath + '/' + printFileName + '.ps');

 if (!new Folder(printFolderPath).exists) new Folder(printFolderPath).create();

 var jobPrintOpts = new PrintJobOptions();
 jobPrintOpts.file = printFile;
 jobPrintOpts.printArea = PrintingBounds.ARTWORKBOUNDS;

 var printOpts = new PrintOptions();
 printOpts.printPreset = printPresets[0];

 printOpts.jobOptions = jobPrintOpts;

 try {
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  ad.print(printOpts);
  userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
 } catch (e) {
  return e
 }

 // printFile.execute();

 return +printFile.length / (1024);

}

function divideNumberByPieces(x, delimiter) {
 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
}

function formatTime(date) {
 var d = date;
 d = [
  '0' + d.getHours(),
  '0' + d.getMinutes()
 ];
 for (var i = 0; i < d.length; i++) {
  d[i] = d[i].slice(-2);
 }
 return d.slice(0, 2).join(':');
}



