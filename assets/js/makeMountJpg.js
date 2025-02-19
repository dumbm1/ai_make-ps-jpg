const printerList = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
const printPresetList = ['mount-preview', 'sep3', 'sep_pdf'];

makeMountJpg();

function makeMountJpg() {
 const makeMountJpg = document.getElementById("make_mount_jpg");

 makeMountJpg.addEventListener("click", e => {
  console.log("Make mount jpg");
  let csInt = new CSInterface();

  csInt.evalScript(_makeMountJpg.toString() + ';_makeMountJpg();', function (result) {
   console.log(result);
  });
 })

}

function _makeMountJpg() {

 try {
  var ad = activeDocument;
  var baseFileName = (ad.name).slice(4, -3);

  var bt = new BridgeTalk();
  bt.target = __getLastOrRunningTarget('photoshop');
  bt.body = __makeMountJpg.toString() + ';__makeMountJpg("' + baseFileName + '")';
  bt.send();

  function __makeMountJpg(baseFileName) {

   var baseMountPath = '/D/work/!_mount/' + new Date().getFullYear() + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2);
   var jpgFilePath = baseMountPath + '/' + baseFileName + '/mount_' + baseFileName + '.jpg';
   var psFilePath = baseMountPath + '/' + baseFileName + '/mount_' + baseFileName + '.ps';

   var jpgQuality = 12;
   var psFile = new File(psFilePath);
   var jpgFileSize;
   var JPG_MAX_FILE_SIZE = 5 * 1024 * 1024;

   var openOptsEps = new EPSOpenOptions();
   openOptsEps.antialias = true;
   openOptsEps.constrainProportions = true;
   openOptsEps.resolution = 300;
   openOptsEps.mode = OpenDocumentMode.RGB;

   app.open(psFile, openOptsEps);

   jpgFileSize = __saveAsJpg(jpgFilePath, jpgQuality);

   for (var i = 0; i <= 6; i++) {

    if (jpgFileSize > JPG_MAX_FILE_SIZE && new File(jpgFilePath).exists) {
     new File(jpgFilePath).remove();
     jpgQuality -= 2;
     jpgFileSize = __saveAsJpg(jpgFilePath, jpgQuality);
    } else {
     break;
    }
   }

   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

   function __saveAsJpg(jpgFilePath, jpgQuality) {
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
