// HS_util.jsxinc
// version 1.0
//


function hs_osType() {
    if($.os.match("Mac")== "Mac") {
        return "Mac";
    } else if($.os.match("Win")== "Win") {
        return "Win";
    } else {
        return null;
    }
}

function hs_chkOSEncode() {

    var myEncoding;
	if(hs_osType() =="Win") {
		myEncoding = "CP932";
	} else if(hs_osType() =="Mac") {
		myEncoding = "UTF-8";
	} else {
        myEncoding = null;
    }
	return myEncoding;
}

function hs_getDateStamp(sep) {
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
}

function hs_getTimeStamp(sep) {
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
}



function hs_chkJPN() {
	if(app.language == 1613) {
		return true;
	} else {
		return false;
	}
}


function hs_chkMethod(methodDescription){
	if(methodDescription){
		 return true;
	}
	if(!methodDescription){
		return false;
	}
}


function hs_getIndex(itemName){
	var i;
	for (i=1; i<=app.project.items.length; i++){
		if (app.project.items[i].name == itemName)
		return i;
	}
	return -1;
}


function hs_chkItemNameExists(chkItemName){
	if(hs_getIndex(chkItemName) < 0) {
		return chkItemName;
	} else {
		for(var exNum = 1; 0 < hs_getIndex(chkItemName+"_"+exNum); exNum++) {};
		var newName = chkItemName + "_" + exNum;
		return newName;
	}
}


function hs_loadPref(file){
    if(file.exists){

        file.open("r");
        var fileContent = file.read();
        file.close();
        return fileContent;

    } else {
        return null;
    }
}


function  hs_savePref(file, folder, confTxt) {

    if(!folder.exists) {
        prefFolder = new Folder(folder);
        prefFolder.create();
        alert("Create new pref folder:\n" + prefFolder.fsName);
    }

    file.open("e");
    file.remove();
    file.close();
    file.open("w");
    file.write(confTxt);
    file.close();

	return;
}
