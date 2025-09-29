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
  var JPG_MAX_FILE_SIZE_FACTOR = 5;

  var bt = new BridgeTalk();
  bt.target = __getLastOrRunningTarget('photoshop');
  bt.body = __makeJpgFromPs.toString() + ';__makeJpgFromPs("' + filePath + '","' + fileName + '", "' + JPG_MAX_FILE_SIZE_FACTOR + '")';
  bt.send();

  function __makeJpgFromPs(filePath, fileName, JPG_MAX_FILE_SIZE_FACTOR) {
   var baseMountPath, jpgFilePath, jpgFilePath_w, psFilePath, psFilePath_w;
   var isOut = fileName.match(/^out_/);
   var result = '', res1 = '', res2 = '';

   if (isOut) {
    fileName = fileName.slice(4);
    // alert('isOut, fileName: ' + fileName);
    try {
     baseMountPath = '/C/work/!_mount/';
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
   JPG_MAX_FILE_SIZE_FACTOR = +JPG_MAX_FILE_SIZE_FACTOR;
   var JPG_MAX_FILE_SIZE_FACTOR_W = 1.5;
   var JPG_MAX_FILE_SIZE = JPG_MAX_FILE_SIZE_FACTOR * 1024 * 1024;
   var JPG_MAX_FILE_SIZE_W = JPG_MAX_FILE_SIZE_FACTOR_W * 1024 * 1024;

   var openOptsEps = new EPSOpenOptions();
   openOptsEps.antialias = true;
   openOptsEps.constrainProportions = true;
   openOptsEps.resolution = 300;
   openOptsEps.mode = OpenDocumentMode.RGB;

   try {
    res1 = 'jpg ' + _saveJpg(psFile, jpgFilePath, JPG_MAX_FILE_SIZE) + '. ';
   } catch (e) {
    res1 = '';
   }
   try {
    res2 = 'w_jpg ' + _saveJpg(psFile_w, jpgFilePath_w, JPG_MAX_FILE_SIZE_W);
   } catch (e) {
    res2 = '';
   }
   result = res1 + res2;

   function _saveJpg(psFile, jpgFilePath, maxFileSize) {
    if (!psFile.exists) throw new Error('psFile does not exist');

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
    psFile.remove();
    return '(' + formatTime(new Date()) + '): ' + Math.round(new File(jpgFilePath).length / 1024) + ' Mb';
   }

   var bt2 = new BridgeTalk();
   bt2.target = 'illustrator';
   bt2.body = 'function f() {alert("' + result + '");} f();';
   bt2.send();

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

   function formatDate(date) {
    var d = date;
    // форматировать дату, с учетом того, что месяцы начинаются с 0
    d = [
     '0' + d.getDate(),
     '0' + (d.getMonth() + 1),
     '' + d.getFullYear(),
     '0' + d.getHours(),
     '0' + d.getMinutes()
    ];
    for (var i = 0; i < d.length; i++) {
     d[i] = d[i].slice(-2);
    }
    return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
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
