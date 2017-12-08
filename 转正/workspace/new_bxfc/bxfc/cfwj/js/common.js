function $(_id){
     return document.getElementById(_id); 
   }
  //��ӡ����
  function iDebug(str){
  	if(navigator.appName.indexOf("iPanel") != -1){
  		iPanel.debug(str);	//����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
  	}else if(navigator.appName.indexOf("Opera") != -1){
  		opera.postError(str);
  	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
  		console.log(str);
  	}
  }
function sendAjax(url,data,callback) {
		var xmlhttp ;
		var isAsync = true;
		if(window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			if(typeof arguments.callee.activeXString != "string") {
				var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
				for(var i = 0, len = versions.length; i < len; i++) {
					try {
						xmlhttp = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
					} catch(ex) {
						//����
						if(len - 1 == i) {
							throw new Error("there is no xmlhttprequest object available");
						}
					}
				}
			} else {
				xmlhttp = new ActiveXObject(arguments.callee.activeXString);
			}
		}
		xmlhttp.overrideMimeType("text/html; charset=GBK");
		xmlhttp.onreadystatechange = function() {
			iDebug("readyState:---------"+xmlhttp.readyState+"status:-----"+xmlhttp.status);
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
/*----------------------------------------�����ַ������ֳ��� Ӣ�Ļ������ַ������൱��һ������---------------------------------------------------------*/
/*
 *str:������ַ���
 *len:�ַ�������󳤶�
 *���ؽ�ȡ���ַ���
 */
function getStrChineseLen(str,len){
	var w = 0;
	str = str.replace(/[ ]*$/g,"");
	if(getStrChineseLength(str)>len){
		for (var i=0; i<str.length; i++) {
			 var c = str.charCodeAt(i);
			 var flag = 0;
			 //���ֽڼ�1
			 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			   w++;
			   flag = 0;
			 }else {
			   w+=2;
			   flag = 1;
			 }
			 if(parseInt((w+1)/2)>len){
				if (flag == 1)return str.substring(0,i-1)+"..";//�޸�,sunny,��ֹ����...
				else return str.substring(0,i-2)+"..";
				break;
			 }
		 
		} 
	}
	return str; 
}

function getStrChineseLength(str){
	str = str.replace(/[ ]*$/g,"");
	var w = 0;
	for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
     //���ֽڼ�1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       w++;
     }else {
       w+=2;
     }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
}	
//*******************************��ȡ��׼URL�Ĳ��� start************************//
/**
 * ��ȡ��׼URL�Ĳ���
 * @_key���ַ�������֧����������������ͬ��key��
 * @_url���ַ�������window��.location.href��ʹ��ʱ�������window����
 * @_spliter���ַ�����������ָ���
 * ע�⣺
 * 	1���粻����ָ���������ؿ��ַ���������ֱ����ʾ��ʹ��ʱע���ж�
 * 	2���Ǳ�׼URL����
 * 	3��query��������hash��#���д��ڼ�ֵһ��ʱ�������鷵��
 */
function getUrlParams(_key, _url, _spliter) {
	//iPanel.debug("common.js===getUrlParams====_url" + _url);
	if (typeof(_url) == "object") {
		var url = _url.location.href;
	} else {
		var url = _url ? _url : window.location.href;
	}
	if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
		return "";
	}
	var spliter = _spliter || "&";
	var spliter_1 = "#";
	var haveQuery = false;
	var x_0 = url.indexOf(spliter);
	var x_1 = url.indexOf(spliter_1);
	var urlParams;
	if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
		if(url.indexOf("?") != -1) urlParams = url.split("?")[1];
		else if(url.indexOf("#") != -1) urlParams = url.split("#")[1];
		else urlParams = url.split(spliter)[1];
		if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//���ܳ��� url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2�������
			var v = [];
			if(urlParams.indexOf(spliter_1) != -1){
				v = urlParams.split(spliter_1);
				urlParams = [];
				for(var x = 0; x < v.length; x++){
					urlParams = urlParams.concat(v[x].split(spliter));
				}
			}else{
				urlParams = urlParams.split(spliter);
			}
		} else {
			urlParams = [urlParams];
		}
		haveQuery = true;
	} else {
		urlParams = [url];
	}
	var valueArr = [];
	for (var i = 0, len = urlParams.length; i < len; i++) {
		var params = urlParams[i].split("=");
		if (params[0] == _key) {
			valueArr.push(params[1]);
		}
	}
	if (valueArr.length > 0) {
		if (valueArr.length == 1) {
			return valueArr[0];
		}
		return valueArr;
	}
	return "";
}
function setGlobalVar(_name, _value){//����ȫ�ֱ���
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.setGlobalVar(_name, _value);
	}
	else{
		var b1 = JSON.stringify(_value);
		sessionStorage.setItem(_name, b1);
	}
}

function getGlobalVar(_name){//��ȡȫ�ֱ���
	if(navigator.appName.indexOf("iPanel") != -1){
		return iPanel.getGlobalVar(_name);
	}
	else{
		return JSON.parse(sessionStorage.getItem(_name));
	}
}

function delGlobalVar(_name){//ɾ��ȫ�ֱ���
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.delGlobalVar(_name);
	}
	else{
		sessionStorage.removeItem(_name);
	}
}


function showTime() {
				setInterval(function() {
					$("timer").innerHTML = new Date().Format("yyyy-MM-dd hh:mm");
				},1000);
			}
Date.prototype.Format = function (fmt) {
    var o = {
        "y+": this.getYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};			