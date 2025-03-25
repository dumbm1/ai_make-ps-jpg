printMailPs();

function printMailPs() {
 const printMailPsBtn = document.getElementById("make_mail_ps");
 printMailPsBtn.addEventListener("click", e => {
  csInterface.evalScript(jsx_print_mail.toString() + ';jsx_print_mail();', function (result) {
   const infoStringSpan = document.querySelector('.footer__info-string-span');
   if (result) {
    let res = Math.round(result);
    res = divideNumberByPieces(res, ' ');
    infoStringSpan.innerText += 'ps-file size: ' + res + ' Kb\n';
   } else {
    infoStringSpan.innerText += 'result is: ' + result;
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

