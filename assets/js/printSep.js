makeSepViaIndd();

/** Алгоритм
 *
 * Вручную выделить слои для сепараций
 * Нажать кнопку запуска скрипта
 *
 * Далее работает скрипт:
 * todo: проверка слоев на соответствие стандарту
 * экшн копирует выделенное - это от 1 до 4 слоев (__test-lay__ copy, out lak copy, out w copy 2, out color copy)
 * растрируем out w:
  * if (lay.name != out w copy 2) lay.visible = false
  * executeMenuCommand('selectall');
  * executeMenuCommand('grup');
  * d.rasterized(lay.goupItems[0]);
 * растрируем out color:
  * if (lay.name == out color) lay.visible = true; else lay.visible = false;
  * executeMenuCommand('selectall');
  * executeMenuCommand('grup');
  * d.rasterized(lay.goupItems[0]);
 * d.lays.add(), с именем for indd sep
 * все 4 слоя переместить в for indd sep
 * экшном сохранить копию с pdf-совместимостью, 1 артборд
 * todo: проверить, как ведет себя экшн при работе с одним артбордом - годится или нужно дополнительный записать
 * залинковать в Индизайн
 * отпечатать сепарации в индизайне
 * запустить .ps-файл
 * */

function makeSepViaIndd() {
 const makeSepBtn = document.getElementById("make_sep");
 const infoStringSpan = document.querySelector('.footer__info-string-span');
 const STAT_TEST = 'test';
 const STAT_ERR = 'error';
 const STAT_OK = 'ok, done, printed';

 makeSepBtn.addEventListener("click", (e) => {
  csInterface.evalScript(jsx_makeSepViaIndd.toString() + ';jsx_makeSepViaIndd();', function (result) {
   infoStringSpan.innerText += 'SEP: ' + result + '\nSTATUS: ' + STAT_TEST + '\n\n';
  });
 });
}

function jsx_makeSepViaIndd() {

 var d = activeDocument;
 var dName = d.name.slice(0, -3);
 var dPath = d.path;
 var rmFolder = new Folder(dPath + '/rm');
 var firstArtbWidth = d.artboards[0].artboardRect[2];
 var firstArtbHeith = d.artboards[0].artboardRect[3];

 if (!rmFolder.exists) rmFolder.create();

 var str = (dPath + '/rm/' + dName + '_copy@' + (new Date().getTime().toString()).slice(2));
 var str_compatible = encodeStrToAnsii(new File(str).fsName);

 var actStr = makeActStr_SaveFirstArtbWithPdfComp(str_compatible);

 runAction(actStr, "Action Name", "Set Name");

 var bt = new BridgeTalk();
 bt.target = _getLastOrRunningTarget('indesign');
 bt.body = _placeToIndd.toString() + ';' + _print.toString() +
  ';_placeToIndd("' + str + '","' + firstArtbWidth + '","' + firstArtbHeith + '")' + ';_print(' + str + ')';
 bt.send();

 function _print(str) {
  try {
   var ad = app.activeDocument;
   var prfs = ad.printPreferences;
   prfs.colorOutput = ColorOutputModes.SEPARATIONS;
   prfs.printer = Printer.postscriptFile;
   prfs.printFile = str.slice(-3) + '.ps';
  } catch (e) {
   alert(e);
  }

  app.activeDocument.print();
 }

 function _placeToIndd(fPathAi, w, h) {

  var re_ext = new RegExp('\.[^\.]+$'),
   fPathIndd;

  if (fPathAi.match(re_ext) != null) {
   fPathIndd = fPathAi.replace(re_ext, '.indd');
  } else {
   fPathIndd = fPathAi + '.indd';
  }

  var doc = app.documents.add();
  doc.documentPreferences.pageHeight = h + 'pt';
  doc.documentPreferences.pageWidth = w + 'pt';

  doc.viewPreferences.verticalMeasurementUnits =
   doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;

  doc.pages.item(0).marginPreferences.top =
   doc.pages.item(0).marginPreferences.bottom =
    doc.pages.item(0).marginPreferences.left =
     doc.pages.item(0).marginPreferences.right = 0;

  app.activeDocument.layoutWindows[0].overprintPreview = true;
  app.activeDocument.layoutWindows[0].zoom(ZoomOptions.FIT_PAGE);

  var rect = doc.rectangles.add();
  rect.fillColor =
   rect.strokeColor = doc.swatches[0];
  rect.geometricBounds = [0, 0, h + 'pt', w + 'pt']; // top left hight width

  rect.place(new File(fPathAi), false);
  rect.fit(FitOptions.CENTER_CONTENT);

//     doc.save ( new File ( fPathIndd ), true, 'File for overprint CMYK preview of procentage of colors', true );

  return fPathIndd;
 }

 function _getLastOrRunningTarget(targetName) {
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

 function runAction(aiActionString, aiActionName, aiActionSetName) {
  var f = new File('~/ScriptAction.aia');
  f.open('w');
  f.write(aiActionString);
  f.close();
  app.loadAction(f);
  f.remove();

  app.doScript(aiActionName, aiActionSetName, false); // action name, set name
  app.unloadAction(aiActionSetName, ""); // set name
 }

 function encodeStrToAnsii(str) {
  var result = '';
  for (var i = 0; i < str.length; i++) {
   var chr = File.encode(str[i]);
   chr = chr.replace(/%/gmi, '');
   if (chr.length == 1) {
    result += chr.charCodeAt(0).toString(16);
   } else {
    result += chr.toLowerCase();
   }
  }
  return result;
 }

 function convAnsiiToString(s) {
  var res = '';
  var cod = '';
  for (var i = 0; i < s.length; i += 2) {
   cod = s.slice(i, i + 2);
   if (cod == '00') continue;
   res += String.fromCharCode(parseInt(cod, 16));
  }
  return res;
 }

 function makeActStr_SaveFirstArtbWithPdfComp(str_compatible) {
  return "/version 3" +
   "/name [ 14" +
   "	31617274625f7064662d636f6d70" +
   "]" +
   "/isOpen 1" +
   "/actionCount 1" +
   "/action-1 {" +
   "	/name [ 14" +
   "		31617274625f7064662d636f6d70" +
   "	]" +
   "	/keyIndex 0" +
   "	/colorIndex 0" +
   "	/isOpen 1" +
   "	/eventCount 1" +
   "	/event-1 {" +
   "		/useRulersIn1stQuadrant 0" +
   "		/internalName (adobe_saveDocumentAs)" +
   "		/localizedName [ 7" +
   "			53617665204173" +
   "		]" +
   "		/isOpen 1" +
   "		/isOn 1" +
   "		/hasDialog 1" +
   "		/showDialog 0" +
   "		/parameterCount 13" +
   "		/parameter-1 {" +
   "			/key 1668116594" +
   "			/showInPalette -1" +
   "			/type (boolean)" +
   "			/value 1" +
   "		}" +
   "		/parameter-2 {" +
   "			/key 1885627936" +
   "			/showInPalette -1" +
   "			/type (boolean)" +
   "			/value 1" +
   "		}" +
   "		/parameter-3 {" +
   "			/key 1668445298" +
   "			/showInPalette -1" +
   "			/type (integer)" +
   "			/value 24" +
   "		}" +
   "		/parameter-4 {" +
   "			/key 1702392878" +
   "			/showInPalette -1" +
   "			/type (integer)" +
   "			/value 1" +
   "		}" +
   "		/parameter-5 {" +
   "			/key 1768842092" +
   "			/showInPalette -1" +
   "			/type (integer)" +
   "			/value 0" +
   "		}" +
   "		/parameter-6 {" +
   "			/key 1918989423" +
   "			/showInPalette -1" +
   "			/type (real)" +
   "			/value 100.0" +
   "		}" +
   "		/parameter-7 {" +
   "			/key 1886545516" +
   "			/showInPalette -1" +
   "			/type (integer)" +
   "			/value 0" +
   "		}" +
   "		/parameter-8 {" +
   "			/key 1936548194" +
   "			/showInPalette -1" +
   "			/type (boolean)" +
   "			/value 1" +
   "		}" +
   "		/parameter-9 {" +
   "			/key 1935764588" +
   "			/showInPalette -1" +
   "			/type (boolean)" +
   "			/value 0" +
   "		}" +
   "		/parameter-10 {" +
   "			/key 1936875886" +
   "			/showInPalette -1" +
   "			/type (ustring)" +
   "			/value [ 1" +
   "				31" +
   "			]" +
   "		}" +
   "		/parameter-11 {" +
   "			/key 1851878757" +
   "			/showInPalette -1" +
   "			/type (ustring)" +
   "   /value [ " + str_compatible.length / 2 + "" + // string length
   "               " + str_compatible +
   "			]" +
   "		}" +
   "		/parameter-12 {" +
   "			/key 1718775156" +
   "			/showInPalette -1" +
   "			/type (ustring)" +
   "			/value [ 35" +
   "				41646f626520496c6c7573747261746f7220416e7920466f726d617420577269" +
   "				746572" +
   "			]" +
   "		}" +
   "		/parameter-13 {" +
   "			/key 1702392942" +
   "			/showInPalette -1" +
   "			/type (ustring)" +
   "			/value [ 6" +
   "				61692c616974" +
   "			]" +
   "		}" +
   "	}" +
   "}";
 }
}
