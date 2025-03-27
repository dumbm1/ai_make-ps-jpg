printWMailPs();

function printWMailPs() {
 const printWMailPsBtn = document.getElementById("make_w_mail_ps");
 printWMailPsBtn.addEventListener("click", e => {
  csInterface.evalScript(jsx_print_w_mail.toString() + ';jsx_print_w_mail();', function (result) {
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

function jsx_print_w_mail() {
 var printerNames = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
 var printPresets = ['mount-preview', 'sep_pdf'];
 var ppdNames = ['PPDFile Adobe PDF', 'PPDFile LaserGraver 4000'];

 var ad = activeDocument;

 var printFileName = ad.name.slice(0, -3);
 var printFolderPath = ad.path + '/jpg';
 var printFile = new File(printFolderPath + '/' + printFileName + '_w' + '.ps');

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

 return +printFile.length / (1024);
}

function divideNumberByPieces(x, delimiter) {
 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
}

