printMount();

function printMount() {
 const printMountBtn = document.getElementById("print_mount");
 printMountBtn.addEventListener("click", e => {
  csInterface.evalScript(jsx_print.toString() + ';jsx_print();', function (result) {
   alert('evalScript result: ' + result);
  });
 });
}

function jsx_print() {
 var printerNames = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
 var printPresets = ['mount-preview', 'sep_pdf'];
 var ppdNames = ['PPDFile Adobe PDF', 'PPDFile LaserGraver 4000'];

 var ad = activeDocument;
 var printFolderPath = Folder.desktop + '/@/__test_print';
 var printFileName = ad.name.slice(0, -3);
 var printFile = new File(printFolderPath + '/' + printFileName + '.ps');

 if (!new Folder(printFolderPath).exists) new Folder(printFolderPath).create();

 var jobPrintOpts = new PrintJobOptions();
 jobPrintOpts.file = printFile;
 jobPrintOpts.printArea = PrintingBounds.ARTWORKBOUNDS;


/* var CMOpts = new PrintColorManagementOptions();
 CMOpts.colorProfileMode = PrintColorProfile.PRINTERPROFILE;
 CMOpts.name = 'ColorMatch RGB';
 CMOpts.intent = PrintColorIntent.RELATIVECOLORIMETRIC;*/

/* var fontOpts = new PrintFontOptions();
 fontOpts.downloadFonts = PrintFontDownloadMode.DOWNLOADSUBSET;
 fontOpts.fontSubstitution = FontSubstitutionPolicy.SUBSTITUTEOBLIQUE;*/

 var printOpts = new PrintOptions();
 // printOpts.jobOptions = jobPrintOpts;
 // printOpts.colorManagementOptions = CMOpts;
 // printOpts.fontOptions = fontOpts;

 /*printOpts.PPDName = ppdNames[0];
 printOpts.printerName = printerNames[0];
 printOpts.printPreset = printPresets[2];*/


 printOpts.printPreset = printPresets[0];
/* printOpts.PPDName = ppdNames[0];
 printOpts.printerName = printerNames[1];*/

 printOpts.jobOptions = jobPrintOpts;



 try{
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  ad.print(printOpts);
  userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
 } catch(e) {return e}

 // printFile.execute();

 return +printFile.length/(1024*1024);
}

