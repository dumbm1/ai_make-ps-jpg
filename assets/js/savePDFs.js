savePdfs();

function savePdfs() {
 const savePdfsBtn = document.getElementById("save_pdfs");
 const infoStringSpan = document.querySelector('.footer__info-string-span');
 const STAT_TEST = 'test';
 const STAT_ERR = 'error';
 const STAT_OK = 'ok, done, printed';

 savePdfsBtn.addEventListener("click", (e) => {
  csInterface.evalScript(jsx_savePdfs.toString() + ';jsx_savePdfs();', function (result) {
   infoStringSpan.innerText += 'SEP: ' + result + '\nSTATUS: ' + STAT_TEST + '\n\n';
  });
 });
}

function jsx_savePdfs() {
 var ad = activeDocument;
 var presSp00 = 'sp_00';
 var presAeForMail = 'ae-for-mail-01';
 var fileNameBase = ad.name.slice(4, -3);
 var folderPathSep = '//win11en-aeie24/tests/lalala/_sep';
 var folderPathJpg = '//win11en-aeie24/tests/lalala/_jpg';

 var pdfFileSep = new File(folderPathSep + '/' + fileNameBase + '.pdf');
 var pdfFileJpg = new File(folderPathJpg + '/' + fileNameBase + '.pdf');

 if (!new Folder(folderPathSep).exists) new Folder(folderPathSep).create();
 if (!new Folder(folderPathJpg).exists) new Folder(folderPathJpg).create();

 var saveOptsSep = new PDFSaveOptions();
 var saveOptsJpg = new PDFSaveOptions();

 saveOptsSep.pDFPreset = presSp00;
 saveOptsJpg.pDFPreset = presAeForMail;

 ad.saveAs(pdfFileSep, saveOptsSep);
 ad.saveAs(pdfFileJpg, saveOptsJpg);
}