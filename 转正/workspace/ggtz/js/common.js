function formatTime(formatter,d){
	var weekdays = {
		chi: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		eng: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	};
	
	if(!formatter || formatter == ""){
		formatter = "yyyy-MM-dd hh:mm";
	}
	if(!d){
		d = new Date();	
	}
	var year = d.getFullYear().toString();
	var month = (d.getMonth() + 1).toString();
	var date = d.getDate().toString();
	var day = d.getDay();
	var hour = d.getHours().toString();
	var minute = d.getMinutes().toString();
	var second = d.getSeconds().toString();

	var yearMarker = formatter.replace(/[^y|Y]/g,'');
	if (yearMarker.length == 0) {
		year = "";
	}

	var monthMarker = formatter.replace(/[^M]/g,'');
	if(monthMarker.length > 1) {
		if(month.length == 1) {
			month = "0" + month;
		}
	} else if (monthMarker.length == 0) {
		month = "";
	}

	var dateMarker = formatter.replace(/[^d|D]/g,'');
	if(dateMarker.length > 1) {
		if(date.length == 1) {
			date = "0" + date;
		}
	} else if (dateMarker.length == 0) {
		date = "";
	}

	var hourMarker = formatter.replace(/[^h]/g, '');
	if(hourMarker.length > 1) {
		if(hour.length == 1) {
			hour = "0" + hour;
		}
	} else if (hourMarker.length == 0) {
		hour = "";
	}

	var minuteMarker = formatter.replace(/[^m]/g, '');
	if(minuteMarker.length > 1) {
		if(minute.length == 1) {
			minute = "0" + minute;
		}
	} else if (minuteMarker.length == 0) {
		minute = "";
	}

	var secondMarker = formatter.replace(/[^s]/g, '');
	if(secondMarker.length > 1) {
		if(second.length == 1) {
			second = "0" + second;
		}
	} else if (secondMarker.length == 0) {
		second = "";
	}
	
	var result = formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dateMarker,date).replace(hourMarker,hour).replace(minuteMarker,minute).replace(secondMarker,second);
	
	var dayMarker = formatter.replace(/[^w|W]/g, ''); 
	if(dayMarker == "W"){//大写表示中文
		result = result.replace(dayMarker,weekdays["chi"][day]);
	}else if(dayMarker == "w"){//小写表示英文
		result = result.replace(dayMarker,weekdays["eng"][day]);	
	}
	return result;	
}
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

function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
	/**
	 * AJAX通过GET或POST的方式进行异步或同步请求数据
	 * 注意：
	 * 	1、服务器240 No Content是被HTTP标准视为请求成功的
	 * 	2、要使用responseXML就不能设置_charset，需要直接传入null
	 * 	3、_frame，就是实例化本对象的页面对象，请尽量保证准确，避免出现难以解释的异常
	 */
	/**
	 * @param{string} _url: 请求路径
	 * @param{function} _successCallback: 请求成功后执行的回调函数，带一个参数（可扩展一个）：new XMLHttpRequest()的返回值
	 * @param{function} _failureCallback: 请求失败/超时后执行的回调函数，参数同成功回调，常用.status，.statusText
	 * @param{string} _urlParameters: 请求路径所需要传递的url参数/数据
	 * @param{*} _callbackParams: 请求结束时在回调函数中传入的参数，自定义内容
	 * @param{boolean} _async: 是否异步调用，默认为true：异步，false：同步
	 * @param{string} _charset: 请求返回的数据的编码格式，部分iPanel浏览器和IE6不支持，需要返回XML对象时不能使用
	 * @param{number} _timeout: 每次发出请求后多长时间内没有成功返回数据视为请求失败而结束请求（超时）
	 * @param{number} _frequency: 请求失败后隔多长时间重新请求一次
	 * @param{number} _requestTimes: 请求失败后重新请求多少次
	 * @param{object} _frame: 窗体对象，需要严格控制，否则会有可能出现页面已经被销毁，回调还执行的情况
	 */
	this.url = _url || "";
	this.successCallback = _successCallback || function(_xmlHttp, _params) {
		//iPanel.debug("[xmlHttp] responseText: " + _xmlHttp.responseText);
	};
	this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
		//iPanel.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
	};
	this.urlParameters = _urlParameters || "";
	this.callbackParams = _callbackParams || null;
	this.async = typeof(_async) == "undefined" ? true : _async;
	this.charset = _charset || null;
	this.timeout = _timeout || 30000; //15s
	this.frequency = _frequency || 10000; //10s
	this.requestTimes = _requestTimes || 0;
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";

	this.checkTimeout = 500;
	this.checkTimer = -1;
	this.checkCount = -1;

	this.createXmlHttpRequest = function() {
		var xmlHttp = null;
		try { //Standard
			xmlHttp = new XMLHttpRequest();
		} catch (exception) { //Internet Explorer
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (exception) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (exception) {
					return false;
				}
			}
		}
		return xmlHttp;
	};
	
	this.xmlHttp = this.createXmlHttpRequest();

	this.requestData = function(_method, _headers, _username, _password) {
		/**
		 * @param{string} _method: 传递数据的方式，POST/GET
		 * @param{string} _headers: 传递数据的头信息，json格式
		 * @param{string} _username: 服务器需要认证时的用户名
		 * @param{string} _password: 服务器需要认证时的用户密码
		 */
		this.xmlHttp = this.createXmlHttpRequest();
		this.frame.clearTimeout(this.timer);
		this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
		this.headers = typeof(_headers) == "undefined" ? null : _headers;
		this.username = typeof(_username) == "undefined" ? "" : _username;
		this.password = typeof(_password) == "undefined" ? "" : _password;

		var target = this;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		if (this.method == "POST") { //encodeURIComponent
			var url = encodeURI(this.url);
			var data = this.urlParameters;
		} else {
			//var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			var url = encodeURI(encodeURI(this.url));
			//iPanel.debug("[xm] xmlHttp get url00="+url);
			var data = null;
		}
		if (this.username != "") {
			this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
		} else {
			this.xmlHttp.open(this.method, url, this.async);
		}
		var contentType = false;
		if (this.headers != null) {
			for (var key in this.headers) {
				if (key.toLowerCase() == "content-type") {
					contentType = true;
				}
				this.xmlHttp.setRequestHeader(key, this.headers[key]);
			}
		}
		if (!contentType) {
			this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		if (this.charset != null) { //要使用responseXML就不能设置此属性
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		//iPanel.debug("[xmlHttp] requestData " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
		this.checkReadyState();
		this.timer = this.frame.setTimeout(function(){
			target.checkStatus();
		}, this.timeout);
	};
	this.checkReadyState = function(){
		var target = this;
		this.frame.clearTimeout(this.checkTimer);
		this.checkTimer = this.frame.setTimeout(function() {
			//iPanel.debug("global checkReadyState target.xmlHttp.readyState="+target.xmlHttp.readyState);
			//iPanel.debug("global checkReadyState target.xmlHttp.status="+target.xmlHttp.status);
			if(target.xmlHttp.readyState == 4 && (target.xmlHttp.status == 200 || target.xmlHttp.status == 204 || target.xmlHttp.status == 0)){
				target.stateChanged();
			}
			else{
				target.checkCount++;
				if((target.checkCount * target.checkTimeout) >= target.timeout){
					target.checkStatus();
				}
				else {
					target.checkReadyState();
				}
			}
        }, this.checkTimeout);
	};
	this.stateChanged = function() { //状态处理
	//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		if (this.xmlHttp.readyState < 2) {
			
		} else {
			//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) {
		/*this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout); */
		} else if (this.xmlHttp.readyState == 3) {
			if (this.xmlHttp.status == 401) {
			  //iPanel.debug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {
			this.frame.clearTimeout(this.timer);
			this.frame.clearTimeout(this.checkTimer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 ||this.xmlHttp.status == 0){
				//iPanel.debug("[xmlHttp] this.xmlHttp.resposeText=" + this.xmlHttp.responseText);
				this.success();
			}
			/*else if(this.xmlHttp.status == 0){
				iPanel.debug("global_stateChanged_this.xmlHttp.status==0--一般为0的状态是库里发的");
			}*/else {
				//iPanel.debug("global_stateChanged_this.xmlHttp.status=="+this.xmlHttp.status);
				this.failed();
			}
		}
	};
	this.success = function() {
		this.checkCount = -1;
		this.frame.clearTimeout(this.checkTimer);
		if (this.callbackParams == null) {
			this.successCallback(this.xmlHttp);
		} else {
			this.successCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.failed = function() {
		this.checkCount = -1;
		this.frame.clearTimeout(this.checkTimer);
		if (this.callbackParams == null) {
			this.failureCallback(this.xmlHttp);
		} else {
			this.failureCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
		if (this.xmlHttp.readyState != 4) {
			if (this.counter < this.requestTimes) {
				this.requestAgain();
			} else {
				this.failed();
				this.requestAbort();
			}
		}
	};
	this.requestAgain = function() {
		this.requestAbort();
		var target = this;
		this.frame.clearTimeout(this.timer);
		this.timer = this.frame.setTimeout(function() {
			target.counter++;
			target.requestData(target.method, target.headers, target.username, target.password);
		}, this.frequency);
	};
	this.requestAbort = function() {
		this.checkCount = -1;
		this.frame.clearTimeout(this.timer);
		this.frame.clearTimeout(this.checkTimer);
		//iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp="+typeof this.xmlHttp);
	   //iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp.abort="+typeof this.xmlHttp.abort);
		//abort()方法可以停止一个XMLHttpRequest对象对HTTP的请求，把该对象恢复到初始状态
		this.xmlHttp.abort();
	};
	this.addParameter = function(_json) {
		/**
		 * @param{object} _json: 传递的参数数据处理，只支持json格式
		 */
		var url = this.url;
		var str = this.urlParameters;
		for (var key in _json) {
			if (url.indexOf("?") != -1) {
				url = "";
				if (str == "") {
					str = "&" + key + "=" + _json[key];
				} else {
					str += "&" + key + "=" + _json[key];
				}
				continue;
			}
			if (str == "") {
				str += "?";
			} else {
				str += "&";
			}
			str += key + "=" + _json[key];
		}
		this.urlParameters = str;
		return str;
	};
	this.getResponseXML = function() { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
		if (this.xmlHttp.responseXML != null) {
			return this.xmlHttp.responseXML;
		} else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
			return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
		}
		return null;
	};
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

