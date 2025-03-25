const _printerList = ['Printer Adobe PDF', 'Printer Adobe PostScript File'];
const _printPresetList = ['mount-preview', 'sep3', 'sep_pdf'];
const _ppdFile = 'PPDFile Adobe PDF';

makeJpgFromPs();

function makeJpgFromPs() {
 const makeJpgFromPs_btn = document.getElementById("make_jpg_from_ps");
 console.log('да блять!!! кнопку взял');

 makeJpgFromPs_btn.addEventListener("click", e => {
  console.log("Make jpg from ps");

  // console.log(csInterface);

  csInterface.evalScript(_makeJpgFromPs.toString() + ';_makeJpgFromPs();', function (result) {
   // alert('evalScript result: ' + result);
  });
 })
}

function _makeJpgFromPs() {

 try {
  var ad = activeDocument;
  var filePath = ad.path;
  var fileName = (ad.name).slice(0, -3);
  // alert('filePath: ' + filePath);
  // alert('fileName: ' + fileName);

  var bt = new BridgeTalk();
  bt.target = __getLastOrRunningTarget('photoshop');
  bt.body = __makeJpgFromPs.toString() + ';__makeJpgFromPs("' + filePath + '","' + fileName + '")';
  bt.send();

  function __makeJpgFromPs(filePath, fileName) {
   var baseMountPath, jpgFilePath, jpgFilePath_w, psFilePath, psFilePath_w;
   var isOut = fileName.match(/^out_/);

   if (isOut) {
    fileName = fileName.slice(4);
    // alert('isOut, fileName: ' + fileName);
    try {
     baseMountPath = '/D/work/!_mount/';
     jpgFilePath = baseMountPath + '/' + fileName + '/mount_' + fileName + '.jpg';
     jpgFilePath_w = baseMountPath + '/' + fileName + '/w_mount_' + fileName + '.jpg';
     psFilePath = baseMountPath + '/' + fileName + '/mount_' + fileName + '.ps';
     psFilePath_w = baseMountPath + '/' + fileName + '/w_mount_' + fileName + '.ps';
     // alert('isOut==true, fileName is: ' + fileName + ', ps-file exists: ' + new File(psFilePath).exists);
    } catch (e) {
     alert('isOut error: ' + e);
    }

   } else if (isOut === null) {
    try {
     jpgFilePath = filePath + '/jpg/' + fileName + '.jpg';
     jpgFilePath_w = filePath + '/jpg/' + fileName + '_w' + '.jpg';
     psFilePath = filePath + '/jpg/' + fileName + '.ps';
     psFilePath_w = filePath + '/jpg/' + fileName + '_w' + '.ps';
    } catch (e) {
     alert('isOut===null error: ' + e);
    }
   }

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

   _saveJpg(psFile, jpgFilePath, JPG_MAX_FILE_SIZE);
   _saveJpg(psFile_w, jpgFilePath_w, JPG_MAX_FILE_SIZE_W);

   function _saveJpg(psFile, jpgFilePath, maxFileSize) {
    app.open(psFile, openOptsEps);

    jpgFileSize = __saveJpg(jpgFilePath, jpgQuality);

    for (var i = 0; i <= 6; i++) {

     if (jpgFileSize > maxFileSize && new File(jpgFilePath).exists) {
      new File(jpgFilePath).remove();
      jpgQuality -= 2;
      jpgFileSize = __saveJpg(jpgFilePath, jpgQuality);
     } else {
      break;
     }
    }

    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
   }

   function __saveJpg(jpgFilePath, jpgQuality) {
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
  return ('line: ' + e.line + '\nerror: ' + e.message);
 }
}
