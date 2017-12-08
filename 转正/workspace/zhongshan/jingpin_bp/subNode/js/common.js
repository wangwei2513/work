var browserType = getBrowserType();	//浏览器类型

//获取浏览器版本
function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? 'iPanel'
		: /enrich/.test(ua) ? 'EVM'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: ''
		;	
}


/*全局变量封装（兼容ipanel3.0和其它浏览器）*/
var mySessionStorage = new globalVar();
function globalVar(){
	this.getItem = function(_str){
		var val = "";
		if(browserType == "iPanel"){
			val = iPanel.getGlobalVar(_str);
		}else{
			val = sessionStorage.getItem(_str);	
		}
		if(val == "" || val == null || val == "undefined" ) val = "";
		return val;
	};
	this.removeItem = function(_str){
		if(browserType == "iPanel"){
			iPanel.delGlobalVar(_str);
		}else{
			sessionStorage.removeItem(_str);	
		}
	}
	this.setItem = function(_key, _val){
		if(browserType == "iPanel"){
			iPanel.setGlobalVar(_key, _val);
		}else{
			sessionStorage.setItem(_key, _val);	
		}
	}
}

function sendAjax(url,data,callback,charset,type) {
	var xmlhttp ;
	var isAsync = type?true:false;
	xmlhttp = new XMLHttpRequest();
	if(typeof charset !== 'undefined') {
		xmlhttp.overrideMimeType("text/html; charset=" + charset);
	}
	xmlhttp.onreadystatechange = function() {
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

