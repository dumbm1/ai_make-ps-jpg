const _printerList = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
const _printPresetList = ['mount-preview', 'sep3', 'sep_pdf'];

makeMailJpg();

function makeMailJpg() {
 const makeMailJpg = document.getElementById("make_mail_jpg");

 makeMailJpg.addEventListener("click", e => {
  console.log("Make mail jpg");

  csInterface.evalScript(_makeMailJpg.toString() + ';_makeMailJpg();', function (result) {
   console.log(result);
  });
 })
}

function _makeMailJpg() {

 try {
  var ad = activeDocument;
  var filePath = ad.path;
  var fileName = (ad.name).slice(0, -3);

  var bt = new BridgeTalk();
  bt.target = __getLastOrRunningTarget('photoshop');
  bt.body = __makeMailJpg.toString() + ';__makeMailJpg("' + filePath + '","' + fileName + '")';
  bt.send();

  function __makeMailJpg(filePath, fileName) {

   var jpgFilePath = filePath + '/jpg/' + fileName + '.jpg';
   var jpgFilePath_w = filePath + '/jpg/' + fileName + '_w' + '.jpg';
   var psFilePath = filePath + '/jpg/' + fileName + '.ps';
   var psFilePath_w = filePath + '/jpg/' + fileName + '_w' + '.ps';

   var jpgQuality = 12;
   var psFile = new File(psFilePath);
   var psFile_w = new File(psFilePath_w);
   var jpgFileSize;
   var JPG_MAX_FILE_SIZE = 5 * 1024 * 1024;
   var JPG_MAX_FILE_SIZE_W = 2 * 1024 * 1024;

   var openOptsEps = new EPSOpenOptions();
   openOptsEps.antialias = true;
   openOptsEps.constrainProportions = true;
   openOptsEps.resolution = 300;
   openOptsEps.mode = OpenDocumentMode.RGB;

   _saveAllJpg(psFile, jpgFilePath, JPG_MAX_FILE_SIZE);
   _saveAllJpg(psFile_w, jpgFilePath_w, JPG_MAX_FILE_SIZE_W);

function _saveAllJpg(psFile, jpgFilePath, maxFileSize){
 app.open(psFile, openOptsEps);

 jpgFileSize = __saveOneJpg(jpgFilePath, jpgQuality);

 for (var i = 0; i <= 6; i++) {

  if (jpgFileSize > maxFileSize && new File(jpgFilePath).exists) {
   new File(jpgFilePath).remove();
   jpgQuality -= 2;
   jpgFileSize = __saveOneJpg(jpgFilePath, jpgQuality);
  } else {
   break;
  }
 }

 app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

   function __saveOneJpg(jpgFilePath, jpgQuality) {
    var jpgFile = new File(jpgFilePath);

    var saveOptsJpg = new JPEGSaveOptions();
    saveOptsJpg.embedColorProfile = true;
    saveOptsJpg.matte = MatteType.NONE;
    saveOptsJpg.quality = jpgQuality;

    app.activeDocument.saveAs(jpgFile, saveOptsJpg, true, Extension.LOWERCASE);
    jpgFileSize = jpgFile.length;
    return jpgFileSize;
   }
  }

  function __getLastOrRunningTarget(targetName) {
   var targetsAll = BridgeTalk.getTargets('-100000');
   var targets = [];

   for (var i = 0; i < targetsAll.length; i++) {
    var obj = targetsAll[i];
    if (obj.match(targetName)) {
     targets.push(obj);
    }
   }

   for (var j = 0; j < targets.length; j++) {
    var targ = targets[j];
    if (BridgeTalk.isRunning(targ)) {
     return targ;
    }
   }

   return targets[targets.length - 1];
  }
 } catch (e) {
  return ('line: ' + e.line + '\\nerror: ' + e.message);
 }
}
