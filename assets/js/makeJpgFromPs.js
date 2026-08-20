'use strict';

try {
 mkJpg();
} catch (e) {
 alert(e);
}

function mkJpg() {
 const makeJpgFromPs_btn = document.getElementById("make_jpg_from_ps");
 makeJpgFromPs_btn.addEventListener("click", () => {

  const jpgRes = document.getElementById("jpg_res").value;
  const w_jpgRes = document.getElementById("w_jpg_res").value;
  const jpgQuality = document.getElementById("jpg_quality").value;
  const w_jpgQuality = document.getElementById("w_jpg_quality").value;

  csInterface.evalScript(
   ai_jsx_mkJpg.toString() +
   ';ai_jsx_mkJpg("' + jpgRes + '","' + w_jpgRes + '","' + jpgQuality + '","' + w_jpgQuality + '")',
   function (result) {
   });
 });
}

function ai_jsx_mkJpg(jpgRes, w_jpgRes, jpgQuality, w_jpgQuality) {
 if (!documents.length) throw new Error("ai_jsx_mkJgp: Блять, нет документа!");

 var ad = activeDocument;
 if (!new File(ad.fullName).exists) throw new Error('ai_jsx_mkJpg: Блять, документ не сохранен на диске!');

 var filePath = ad.path;
 var fileName = (ad.name).slice(0, -3);

 var bt = new BridgeTalk();
 bt.target = __getLastOrRunningTarget('photoshop');
 bt.body = psd_jsx_mkJpg.toString() +
  ';psd_jsx_mkJpg("' +
  filePath + '","' + fileName + '", "' + jpgRes + '","' + w_jpgRes + '", "' + jpgQuality + '","' + w_jpgQuality + '")';
 bt.send();

 function psd_jsx_mkJpg(filePath, fileName, jpgRes, w_jpgRes, jpgQuality, w_jpgQuality) {

  var baseMountPath, jpgFilePath, w_jpgFilePath, psFilePath, w_psFilePath;
  var isOut = fileName.match(/^out_/);
  var result, res1, res2;

  if (isOut) {
   fileName = fileName.slice(4);
   baseMountPath = '/C/!_mount/';
   jpgFilePath = baseMountPath + '/' + fileName + '/mount_' + fileName + '.jpg';
   w_jpgFilePath = baseMountPath + '/' + fileName + '/w_mount_' + fileName + '.jpg';
   psFilePath = baseMountPath + '/' + fileName + '/mount_' + fileName + '.ps';
   w_psFilePath = baseMountPath + '/' + fileName + '/w_mount_' + fileName + '.ps';
  } else if (isOut === null) {
   jpgFilePath = filePath + '/jpg/' + fileName + '.jpg';
   w_jpgFilePath = filePath + '/jpg/' + fileName + '_w' + '.jpg';
   psFilePath = filePath + '/jpg/' + fileName + '.ps';
   w_psFilePath = filePath + '/jpg/' + fileName + '_w' + '.ps';
  }

  try {
   res1 = 'Общий: ' + _saveJpg(psFilePath, jpgFilePath, jpgRes, jpgQuality) + '. ';
  } catch (e) {
   res1 = 'Общего вида нет. ';
  }
  try {
   res2 = 'Белая форма: ' + _saveJpg(w_psFilePath, w_jpgFilePath, w_jpgRes, w_jpgQuality);
  } catch (e) {
   res2 = 'Белой формы нет.';
  }
  /*
    result = res1 + res2;
  */

  /*
  var bt2 = new BridgeTalk();
    bt2.target = 'illustrator';
    bt2.body = 'function f() {alert("' + result + '");} f();';
    bt2.send();
    */

  function _saveJpg(psFilePath, jpgFilePath, jpgRes, jpgQuality) {
   var psFile = new File(psFilePath);

   if (!psFile.exists) throw new Error('psd_jsx_mkJpg >> _saveJpg: psFile does not exist');

   var openOptsEps = new EPSOpenOptions();
   openOptsEps.antialias = true;
   openOptsEps.constrainProportions = true;
   openOptsEps.resolution = +jpgRes;
   openOptsEps.mode = OpenDocumentMode.RGB;

   app.open(psFile, openOptsEps);

   var jpgFile = __f(jpgFilePath, jpgQuality);
   var jpgFileSize = Math.round(jpgFile.length / 1024);

   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
   var isRm = confirm('Размер jpg ' + jpgFile.name + ' — ' + jpgFileSize + ' Кб. Удалить .ps-файл?');
   if (isRm) psFile.remove();
   return Math.round(new File(jpgFilePath).length / 1024) + ' Кб';

   function __f(jpgFilePath, jpgQuality) {
    var jpgFile = new File(jpgFilePath);
    var saveOptsJpg = new JPEGSaveOptions();
    saveOptsJpg.embedColorProfile = true;
    saveOptsJpg.matte = MatteType.NONE;
    saveOptsJpg.quality = +jpgQuality;
    app.activeDocument.saveAs(jpgFile, saveOptsJpg, true, Extension.LOWERCASE);
    return jpgFile;
   }
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
}
