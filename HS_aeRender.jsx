//hs_aeRender.jsx
// Version 1.1.4
/*
+MIT License
Copyright (c) 2019 Hiroshi Saito
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var HS_aeRender = new Object();

HS_aeRender = {

    productname: "HS_aerender",
    version: "1.1.4",

    prefLoad: function() {
      var hs_aebatConfFile = new File(hs_aebatConfPath);
      if (hs_aebatConfFile.exists) {
        hs_aebatConfFile.open("r");
        eval(hs_aebatConfFile.read());
        hs_aebatConfFile.close();
      } else {

      }
    },

    chk_aerenderCmdPath: function(cmdPath) {
      if (!cmdPath.exists) {
        alert(cmdPath.fsName + "doesn't exist.");
        return false;
      } else {
        return true;
      }
    },

    chkJPN: function() {
      if (app.language == 1613) {
        return true;
      } else {
        return false;
      }
    },


    chkfileEncoding: function() {
      if ($.os.match("Win")) {
        myEncoding = "CP932";
      } else if ($.os.match("Mac")) {
        myEncoding = "UTF-8";
      }
      return myEncoding;
    },

    chkRQueue: function(alrt) {
      var qIndex = 0;
      var qArray = new Array();
      var noQ = "There's no item in render queue.";
      var qQ = app.project.renderQueue.numItems;

      if (qQ >= 1) {
        for (var i = 1; i <= qQ; i++) {
          var cQ = app.project.renderQueue.items[i];
          if (cQ.status == RQItemStatus.QUEUED) {
            qArray[qIndex] = cQ.comp;
            qIndex = qIndex + 1;
          }
        }
      }
      if (qIndex < 1) {
        if (alrt == true) {
          alert(noQ);
        }
        qCheck = false;
        return null;
      } else {
        qCheck = true;
        return qArray;
      }
    },

    getDateStamp: function(sep) {
      sep = (sep)?sep:'' ;
    	var today = new Date();
    	var strYear = today.getFullYear().toString();
    	var numMonth = (today.getMonth()+1);
    	var numDate = today.getDate();
      var numHour = today.getHours();
      var numMin = today.getMinutes();
      var numSec = today.getSeconds();

      var strMonth = (numMonth < 10) ? ("0"+ numMonth.toString()) : (numMonth.toString());
      var strDate = (numMonth < 10) ? ("0"+ numDate.toString()) : (numDate.toString());

      var strHour = (numHour < 10) ? ("0"+ numHour.toString()) : (numHour.toString());
      var strMin = (numMin < 10) ? ("0"+ numMin.toString()) : (numMin.toString());

      var strSec = (numSec < 10) ? ("0"+ numSec.toString()) : (numSec.toString());

    	var dateStamp = strYear  +sep+ strMonth  + sep + strDate;
    	return dateStamp;
    },

    getTimeStamp: function(sep) {
      sep = (sep)?sep:'' ;
    	var today = new Date();
      var numHour = today.getHours();
      var numMin = today.getMinutes();
      var numSec = today.getSeconds();

      var strHour = (numHour < 10) ? ("0"+ numHour.toString()) : (numHour.toString());
      var strMin = (numMin < 10) ? ("0"+ numMin.toString()) : (numMin.toString());
      var strSec = (numSec < 10) ? ("0"+ numSec.toString()) : (numSec.toString());

    	var timeStamp = strHour + sep +  strMin + sep + strSec ;
    	return timeStamp;
    },

    MainGUI: function() {
      var hs_aebat_scriptname = this.productname;
      var hs_aebat_ver = this.version;
      var hs_aebat_copyright = "Copyright (c) 2011-2019 Hiroshi Saito. All rights reserved.\n";
      var ALERT_save_once = "Need to save current project.";
      var ALERT_save_overwrite = "Save current project: Would you overwrite it ?";
      var hs_aebatFile = app.project.file;
      var hs_aebat_winLoc = [100, 100];
      var hs_aebatConf = "hs_aebatExport.conf";
      var aeStartUpFolder = Folder.startup;
      var aerenderCmdName = "aerender";

      var aerenderFolderPath, aebatExtension, aerenderCmdPath, aerenderCmd, aebatPathFlag, hs_aebatExportFolder;

      //GUI
      var maxmemUsage = [0, 100];
      var imgCache = [20, 100];
      var hs_aebat_maxmemUsage = 100;
      var hs_aebat_imgChache = 50;
      var chkSoundOption = false;
      var mprenderOption = false;
      var cpuPriority = 1;
      //

      if ($.os.match("Mac")) {
        aerenderFolderPath = aeStartUpFolder.parent.parent.parent;
        aebatExtension = ".command";
        aerenderCmdPath = aerenderFolderPath.fsName.replace(/\\\s/g, " ");

      } else if ($.os.match("Win")) {
        aerenderFolderPath = aeStartUpFolder;
        aerenderCmdPath = aerenderFolderPath.fsName;
        aerenderCmdName = aerenderCmdName + ".exe";
        aebatExtension = ".bat";

      } else {
        alert("This OS is not supported");
        return;
      }

      aerenderCmd = new File(aerenderFolderPath.fsName + "/" + aerenderCmdName);
      aebatPathFlag = this.chk_aerenderCmdPath(aerenderCmd);

      var mainWin = new Window("palette", hs_aebat_scriptname + ' ' + hs_aebat_ver);

      mainWin.location = hs_aebat_winLoc;
      mainWin.size = [400, 300];

      mainWin.inner = [10, mainWin.size[0] - 160];
      mainWin.btnArea = [mainWin.size[0] - 140, mainWin.size[0] - 10];

      mainWin.winTopAlign = 20;
      mainWin.btnHeight = [20, 10];

      mainWin.inner.panel = [10, mainWin.inner[1] - mainWin.inner[0] - 10];
      mainWin.panel_3 = mainWin.add('panel', [mainWin.inner[0], mainWin.winTopAlign, mainWin.inner[1], mainWin.winTopAlign + 120], 'Memory');

      mainWin.panel_3.text_1 = mainWin.panel_3.add('statictext', [mainWin.inner.panel[0], 20, mainWin.inner.panel[1] - 55, 35], 'Maximum memory usage(%):');
      mainWin.panel_3.slider_1 = mainWin.panel_3.add('slider', [mainWin.inner.panel[0], 45, mainWin.inner.panel[1] - 55, 60], hs_aebat_maxmemUsage, maxmemUsage[0], maxmemUsage[1]);

      if (parseFloat(app.version) < 7) {
        mainWin.panel_3.slider_1.value = hs_aebat_maxmemUsage;
      }
      mainWin.panel_3.slider_1_val = mainWin.panel_3.add('edittext', [mainWin.inner.panel[1] - 50, 35, mainWin.inner.panel[1] - 10, 55], mainWin.panel_3.slider_1.value);

      mainWin.panel_3.slider_1.onChange = function() {
        mainWin.panel_3.slider_1_val.text = parseInt(mainWin.panel_3.slider_1.value);
        hs_aebat_maxmemUsage = mainWin.panel_3.slider_1.value;
      }

      mainWin.panel_3.slider_1_val.onChange = function() {
        var VL = parseInt(mainWin.panel_3.slider_1_val.text);
        if (VL.isNaN == true) {
          VL = maxmemUsage[0];

        } else if (VL < maxmemUsage[0]) {
          VL = maxmemUsage[0];
          mainWin.panel_3.slider_1_val.text = VL;

        } else if (VL > maxmemUsage[1]) {
          VL = maxmemUsage[1];
          mainWin.panel_3.slider_1_val.text = VL;
        }
        mainWin.panel_3.slider_1.value = VL;
        hs_aebat_maxmemUsage = VL;
      }

      mainWin.panel_3.text_2 = mainWin.panel_3.add('statictext', [mainWin.inner.panel[0], 65, mainWin.inner.panel[1] - 55, 80], 'Image cache(%):')
      mainWin.panel_3.slider_2 = mainWin.panel_3.add('slider', [mainWin.inner.panel[0], 85, mainWin.inner.panel[1] - 55, 100], hs_aebat_imgChache, imgCache[0], imgCache[1])

      mainWin.panel_3.slider_2_val = mainWin.panel_3.add('edittext', [mainWin.inner.panel[1] - 50, 75, mainWin.inner.panel[1] - 10, 95], mainWin.panel_3.slider_2.value);

      mainWin.panel_3.slider_2.onChange = function() {
      mainWin.panel_3.slider_2_val.text = parseInt(mainWin.panel_3.slider_2.value);
        hs_aebat_imgChache = parseInt(mainWin.panel_3.slider_2.value);
      }

      mainWin.panel_3.slider_2_val.onChange = function() {
        var VL = parseInt(mainWin.panel_3.slider_2_val.text);

        if (VL.isNaN === true) {
          VL = imgCache[0]
        } else if (VL < imgCache[0]) {
          VL = imgCache[0];
          mainWin.panel_3.slider_2_val.text = VL;
        } else if (VL > imgCache[1]) {
          VL = imgCache[1];
          mainWin.panel_3.slider_2_val.text = VL;
        }
        mainWin.panel_3.slider_2.value = VL;
        hs_aebat_imgChache = VL;
      }

      mainWin.panel_5 = mainWin.add('panel', [mainWin.inner[0], mainWin.winTopAlign + 125, mainWin.inner[1], mainWin.winTopAlign + 125 + 70], 'Process priority');
      mainWin.panel_5.btn1 = mainWin.panel_5.add('radiobutton', [mainWin.inner.panel[0], 15, mainWin.inner.panel[0] + 60, 35], 'Low');
      mainWin.panel_5.btn2 = mainWin.panel_5.add('radiobutton', [mainWin.inner.panel[0] + 65, 15, mainWin.inner.panel[0] + 125, 35], 'Middle');
      mainWin.panel_5.btn3 = mainWin.panel_5.add('radiobutton', [mainWin.inner.panel[0] + 130, 15, mainWin.inner.panel[0] + 190, 35], 'High');
      mainWin.panel_5.btn1.value = (cpuPriority == 1);
      mainWin.panel_5.btn2.value = (cpuPriority == 2);
      mainWin.panel_5.btn3.value = (cpuPriority == 3);
      mainWin.panel_5.btn1.onClick = function() {cpuPriority = 1};
      mainWin.panel_5.btn2.onClick = function() {cpuPriority = 2};
      mainWin.panel_5.btn3.onClick = function() {cpuPriority = 3};

      mainWin.panel_4 = mainWin.add('panel', [mainWin.inner[0], mainWin.winTopAlign + 200, mainWin.inner[1], mainWin.winTopAlign + 200 + 50], 'Misc');
      mainWin.panel_4.sound = mainWin.panel_4.add('checkbox', [mainWin.inner.panel[0], 15, mainWin.inner.panel[1] / 2, 35], 'Sound');
      mainWin.panel_4.sound.value = chkSoundOption;

      mainWin._EXEC_ = mainWin.add('button', [mainWin.btnArea[0], mainWin.winTopAlign, mainWin.btnArea[1], mainWin.winTopAlign + mainWin.btnHeight[0] * 2], 'Start Batch Render');
      mainWin.winTopAlign = mainWin.winTopAlign + mainWin.btnHeight[0] * 2 + mainWin.btnHeight[1];

      mainWin._OK_ = mainWin.add('button', [mainWin.btnArea[0], mainWin.winTopAlign, mainWin.btnArea[1], mainWin.winTopAlign + mainWin.btnHeight[0]], 'Export');
      mainWin.winTopAlign = mainWin.winTopAlign + mainWin.btnHeight[0] + mainWin.btnHeight[1];
      mainWin.winTopAlign = mainWin.winTopAlign + mainWin.btnHeight[0] + mainWin.btnHeight[1];

      mainWin._ABOUT_ = mainWin.add('button', [mainWin.btnArea[0], mainWin.winTopAlign, mainWin.btnArea[1], mainWin.winTopAlign + mainWin.btnHeight[0]], 'About');
      mainWin._ABOUT_.onClick = function() {
        alert(hs_aebat_scriptname + " " + hs_aebat_ver + '\n' + hs_aebat_copyright + '\n' + 'https://github.com/hiroshisaito/HS_aeRender');
      }

      mainWin._OK_.onClick = function() {
        var saveFlag, overWriteFlag = false;
        if (HS_aeRender.chkRQueue(true) !== null) {
          if (app.project.file === null) {
            alert(ALERT_save_once);
            saveFlag = app.project.save();
          } else {
            overWriteFlag = confirm(ALERT_save_overwrite);
            if (overWriteFlag === true) {
              saveFlag = app.project.save();
            } else {
              saveFlag = app.project.saveWithDialog();
            }
          }

          if (saveFlag === true) {
            mprenderOption = '';
            var timestamp = HS_aeRender.getDateStamp() + HS_aeRender.getTimeStamp();
            var me = (app.project.file.name).split(".aep");
            var folderName = me[0] + "_aereder";
            var aepFile = app.project.file;
            var fileName = folderName + '_' + timestamp + aebatExtension;
            var aepDuplicatedFile, aepRenderFile;

            hs_aebatExportFolder = HS_aeRender.exportFolder(folderName);
            hs_aebat_filePath = hs_aebatExportFolder.fsName + "/" + fileName;
            aepDuplicatedFile = new File(hs_aebatExportFolder.fsName + '/' + me[0] + '_' + timestamp + '.aep')
            aepRenderFile = aepFile.copy(aepDuplicatedFile);

            //alert(aepRenderFile)
            if (aepRenderFile) {
              aebatFileText = HS_aeRender.aebatMakeCommand(mainWin.panel_4.sound.value, mainWin.panel_3.slider_1.value, parseInt(mainWin.panel_3.slider_2.value), cpuPriority, mprenderOption, aepDuplicatedFile);
              HS_aeRender.batchFileExport(hs_aebat_filePath, aebatFileText, false, ($.os.match("Mac")));
            } else {
              alert('Error: AEP file had not been duplicated.')
              return;
            }
          }
        }
      }

      mainWin._EXEC_.onClick = function() {
          var saveFlag, overWriteFlag = false;
          if (HS_aeRender.chkRQueue(true) !== null) {
            if (app.project.file === null) {
              alert(ALERT_save_once);
              saveFlag = app.project.save();
            } else {
              overWriteFlag = confirm(ALERT_save_overwrite);
              if (overWriteFlag === true) {
                saveFlag = app.project.save();
              } else {
                saveFlag = app.project.saveWithDialog();
              }
            }

            if (saveFlag === true) {
              mprenderOption = '';
              var timestamp = HS_aeRender.getDateStamp() + HS_aeRender.getTimeStamp();
              var me = (app.project.file.name).split(".aep");
              var folderName = me[0] + "_aereder";
              var aepFile = app.project.file;
              var fileName = folderName + '_' + timestamp + aebatExtension;
              var aepDuplicatedFile, aepRenderFile;

              hs_aebatExportFolder = HS_aeRender.exportFolder(folderName);
              hs_aebat_filePath = hs_aebatExportFolder.fsName + "/" + fileName;
              aepDuplicatedFile = new File(hs_aebatExportFolder.fsName + '/' + me[0] + '_' + timestamp + '.aep')
              aepRenderFile = aepFile.copy(aepDuplicatedFile);

              if (aepRenderFile) {
                aebatFileText = HS_aeRender.aebatMakeCommand(mainWin.panel_4.sound.value, mainWin.panel_3.slider_1.value, parseInt(mainWin.panel_3.slider_2.value), cpuPriority, mprenderOption, aepDuplicatedFile);
                HS_aeRender.batchFileExport(hs_aebat_filePath, aebatFileText, true, ($.os.match("Mac")));
              } else {
                alert('Error: AEP file had not been duplicated.')
                return
              }

            }
          }

          mainWin.onMove = function() {
            if (parseFloat(app.version) < 7) {
              hs_aebat_winLoc = [mainWin.bounds[0], mainWin.bounds[1]];
            } else {
              hs_aebat_winLoc = mainWin.location;
            }
          }
        }
        mainWin.show();
      },

      exportFolder: function(name) {
        var parentFolder = new Folder(app.project.file.parent);
        var aeRenderFolderPath = parentFolder.fsName + '/' + name
        var aeRenderFolder = new Folder(aeRenderFolderPath);

        if (!aeRenderFolder.exists) {
          aeRenderFolder.create();
        }

        return aeRenderFolder

      },

        aebatMakeCommand: function(sound, memusage, imgcache, priority, mpOption, aep) {
          var hs_aebatFile = aep;
          var hs_aebat_memusage = "-mem_usage" + " " + memusage + " " + imgcache;
          var cmdPath, hs_cpuPriority, hs_aebat_targetFile, prefixLangCode, soundoption, mp = '';
          var output;
          var soundoption = (sound == true) ? "-sound ON":"-sound OFF";

          if (($.os.match("Mac")) == "Mac") {
            if (priority == 1) {
              hs_cpuPriority = "nice -n 5";
            } else if (priority == 2) {
              hs_cpuPriority = "nice -n 0";
            } else if (priority == 3) {
              hs_cpuPriority = "nice -n -10";
            } else {
              alert("Error: CPU Priority (hs_aebat_makeCmd)");
            }

            cmdPath = HS_aeRender.aerenderPath();
            hs_aebat_targetFile = hs_aebatFile.fsName.replace(/\\\s/g, " ");
            output = hs_cpuPriority + " " + "\"" + cmdPath + "\" " + hs_aebat_memusage + " " + soundoption + " " + mp + " " + "-project \"" + hs_aebat_targetFile + "\"";

            return output;

          } else {
            if (priority == 1) {
              hs_cpuPriority = "/low";
            } else if (priority == 2) {
              hs_cpuPriority = "/belownormal";
            } else if (priority == 3) {
              hs_cpuPriority = "/normal";
            } else {
              alert("Error: CPU Priority (HS_aeRender.aebatMakeCommand)");
            }

            cmdPath = Folder.startup.fsName;
            hs_aebat_targetFile = hs_aebatFile.fsName;
            prefixLangCode = "";
            ($.locale == "ja_JP") ? (prefixLangCode = "chcp 932") : (prefixLangCode = "");
            output = prefixLangCode + "\n" + "start \"aerender\" /W " + hs_cpuPriority + " " + prefixLangCode + "|" + "\"" + cmdPath + "\\" + "aerender.exe\"" + " " + hs_aebat_memusage + " " + soundoption + " " + mp + " " + "-project " + "\"" + hs_aebat_targetFile + "\"";

            return output;
          }
          //alert(output);
          return output;

        },


        batchFileExport: function(path, battxt, batExecFlag, mac) {
          var batFile = new File(path);
          batFile.open("w");
          batFile.encoding = HS_aeRender.chkfileEncoding();
          batFile.write(battxt);
          batFile.close();

          if (mac == "Mac") {
            system.callSystem("chmod u+x "+ '"'+ batFile.fsName+ '"');
          }

          //alert("File exported to:\ "+path);
          if (batExecFlag == true) {
            batFile.execute();
          }

          return;
        },

        aerenderPath: function() {
          var aerenderFolderPath, aeCommand, aerenderCmdPath;

          if (parseFloat(app.version) < 8) {
            alert("HS_renderCore.jsxinc supports AfterEffects CS3 or above.");
            return null;
          } else {
            if (($.os.match("Mac")) == "Mac") { // Mac OS X
              aerenderFolderPath = Folder.startup.parent.parent.parent;
              aeCommand = File(aerenderFolderPath.fsName + "/aerender");

              if (aeCommand.exists) {
                aerenderCmdPath = aeCommand.fsName.replace(/\\\s/g, " ");
                return aerenderCmdPath;
              } else {
                return null;
              }


            } else if (($.os.match("Win")) == "Win") { //Windows
              aerenderFolderPath = Folder.startup;
              aeCommand = File(aerenderFolderPath + "\aerender.exe");

              if (aeCommand.exists) {
                aerenderCmdPath = aeCommand.fsName;
                return aerenderCmdPath;

              } else {
                return null;
              }

            } else {
              alert("This OS is not supported") //...just'n case
              return null;
            }
          }
        },

        startCheck: function() {
          var chkStatus,  chkPrefsSetting;

          if (parseFloat(app.version) < 14) {
            alert("This script requires AfterEffects 14.0 or above.");
            return false;
          } else {
            chkPrefsSetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
            if (!chkPrefsSetting) {
              alert("Permission Error: Check your Preference > Scripting & Expressions (or 'General' in CC2018).");
              return false;
            } else {
              chkStatus = this.MainGUI();
            }
          }
        }
    }

    this.HS_aeRender.startCheck();
