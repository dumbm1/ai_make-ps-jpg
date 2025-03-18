const infoStringSpan = document.querySelector('.footer__info-string-span');

makeMailSep();

function makeMailJpg() {
}

function makeMailSep() {
 const mailSepBtn = document.getElementById("make_mail_sep");
 mailSepBtn.addEventListener("click", e => {
  csInterface.evalScript(jsx_print.toString() + ';jsx_print("mailSep");', function (result) {
   if (result) {
    let res = Math.round(result);
    res = divideNumByPieces(res, ' ');
    infoStringSpan.innerText = 'sep-file size: ' + res + ' Kb';
    fitPanelToContent();
   } else {
    infoStringSpan.innerText = 'result is: ' + result;
    fitPanelToContent();
   }

   // alert('evalScript result: ' + result);
  });
 });
}

function makeMountJpg() {
}

function makeMountSep() {
}

/***
 jsx-lib
 */

function jsx_print(printType /*String 'mailSep' 'mailJpg' 'mountSep' 'mountJpg'*/) {
 var printerNames = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
 var printPresets = ['mount-preview', 'sep_pdf', 'sep_test'];
 var ppdNames = ['PPDFile Adobe PDF'];

 var ad = activeDocument;
 var printFolderPath, printFileName, printFile, printPreset, printerName,
  executePrintFile = false;

 switch (printType) {
  case 'mailSep':
   printFolderPath = ad.path + '/jpg';
   printFileName = 'sep_' + ad.name.slice(0, -3);
   printFile = new File(printFolderPath + '/' + printFileName + '.ps');
   printerName = printerNames[0];
   printPreset = printPresets[2];
   executePrintFile = true;

   break;
  case 'mailJpg':
   break;
  case 'mountSep':
   break;
  case 'mountJpg':
   break;
  default:
   alert('Ха-ха-ха! Ты дебил!');
 }

 if (!new Folder(printFolderPath).exists) new Folder(printFolderPath).create();

 var jobPrintOpts = new PrintJobOptions();
 jobPrintOpts.file = printFile;
 jobPrintOpts.printArea = PrintingBounds.ARTWORKBOUNDS;
/* jobPrintOpts.printAllArtboards = false;
 jobPrintOpts.artboardRange = '0';*/

 var colSepOpts = new PrintColorSeparationOptions();
 colSepOpts.colorSeparationMode = PrintColorSeparationMode.HOSTBASEDSEPARATION;

 /*var paperOpts = new PrintPaperOptions();
 paperOpts.height = 1000.0;
 paperOpts.width = 1000.0;*/

 var printOpts = new PrintOptions();
 printOpts.jobOptions = jobPrintOpts;
 printOpts.colorSeparationOptions = colSepOpts;
/* printOpts.paperOptions = paperOpts;*/
 // printOpts.printPreset = printPreset;
 printOpts.printerName = printerName;
 printOpts.PPDName = ppdNames[0];

 try {
  // app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  ad.print(/*printOpts*/);
  userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
 } catch (e) {
  return e
 }

 if (executePrintFile) printFile.execute();

 return +printFile.length / (1024);
}

/*js-lib*/
function divideNumByPieces(x, delimiter) {
 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
}
