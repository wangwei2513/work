
var zhongshanUrl = "http://10.4.72.70:8080/play/playAction!getVodPlayRtsp.do";
var bendiPlayer = "http://10.4.72.70:8080/iPG/T-nsp_N9101/vodctrl/vodplay.htm";
var shengPlayer = "http://172.23.200.171/NewFrameWork/web/vodPlayer.html";
function sendAjax(url,data,callback,type) {
	var xmlhttp ;
	var isAsync = type?true:false;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		//$("testCon").innerText = "readyState:---------"+xmlhttp.readyState+"status:-----"+xmlhttp.status;
		if (xmlhttp.readyState == 4 ){
			
		    if (xmlhttp.status == 200 || xmlhttp.status == 0) {
		    	callback(xmlhttp.responseText);
		    }
	    }
	}
	if(data!=null && typeof data!="undefined") {
		xmlhttp.open("POST",url,isAsync);
		xmlhttp.send(data);
	}
	else {
		xmlhttp.open("GET",url,isAsync);
		xmlhttp.send(null);
	}
}

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

function $(id) {
	return document.getElementById(id);
}

function getByClass(className) {
	return document.getElementsByClassName(className);
}

function cutString(str,len){
	if(typeof str != "string"){
		return false;
	}
	return str.substring(0,len);
}

function getUserId() {
	var userId;
	try {
		if (DataAccess.getInfo) {//广东省网用
			userId = DataAccess.getInfo("UserInfo", "account");
		}
	} catch (e) {
		userId = 0;
	}
	return userId;
}

/**
 * @description 写cookie，设置全局参数
 * @param {string} _sName 全局参数名称
 * @param {string} _sValue 全局参数名称对于的值
 */

function setGlobalVar(_sName, _sValue) {
	try {
		_sValue = _sValue + "";
		if (Utility && Utility.setEnv) {
			Utility.setEnv(_sName, _sValue);
		} else if (iPanel && iPanel.setGlobalVar) {
			iPanel.setGlobalVar(_sName, _sValue);
		} else if (SysSetting && SysSetting.setEnv) {
			SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));
		}
	} catch (e) {
		document.cookie = escape(_sName) + "=" + escape(_sValue) + '; path=/';
	}
}

/**
 * @description 读cookie，获取全局参数
 * @param {string} _sName 全局参数名称（对应setGlobalVar方法中的_sName）
 * @return {string} result 返回值（对应setGlobalVar方法中的_sValue）
 */

function getGlobalVar(_sName) {
	var result = "";
	try {
		if (Utility && Utility.getEnv) {
			result = Utility.getEnv(_sName);
		} else if (iPanel && iPanel.getGlobalVar) {
			result = iPanel.getGlobalVar(_sName);
		} else if (SysSetting && SysSetting.getEnv) {
			result = decodeURIComponent(SysSetting.getEnv(_sName));
		}
		if (result == "undefined") {
			result = "";
		}
	} catch (e) {
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if (escape(_sName) == aCrumb[0]) {
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}

