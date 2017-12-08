/**
 * AJAX模块的封装   
*/
function AJAX_OBJ(_url, _successCallback, _failureCallback, _completeCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
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
		//iDebug("[xmlHttp] responseText: " + _xmlHttp.responseText);
	};
	this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
		//iDebug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
	};
	this.completeCallback = _completeCallback || function(_xmlHttp, _params) {
		//iDebug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
	};
	this.urlParameters = _urlParameters || "";
	this.callbackParams = _callbackParams || null;
	this.async = typeof(_async) == "undefined" ? true : _async;
	this.charset = _charset || null;
	this.timeout = _timeout || 30000; //30s
	this.frequency = _frequency || 5000; //5s
	this.requestTimes = _requestTimes || 3;
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";

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
		this.frame.clearTimeout(this.timer);
		this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
		this.headers = typeof(_headers) == "undefined" ? null : _headers;
		this.username = typeof(_username) == "undefined" ? "" : _username;
		this.password = typeof(_password) == "undefined" ? "" : _password;

		var target = this;
		var data = null;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		//iDebug("zhangjj [xmlHttp] this.method = "+this.method);
		if (this.method == "POST") { //encodeURIComponent
			var url = encodeURI(this.url);
			data = this.urlParameters;
			//iDebug("zhangjj requestData data = "+ data);
		} else {
			//var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			var url = this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters);
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
		//iDebug("zhangjj xmlHttp.send(): " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
		this.timer = this.frame.setTimeout(function() {
			target.checkStatus();
		}, this.timeout);
	};
	
	this.stateChanged = function() { //状态处理
		if (this.xmlHttp.readyState < 2) {
			//iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		} else {
			//iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) {
			/*this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);*/
		} else if (this.xmlHttp.readyState == 3) {
			if (this.xmlHttp.status == 401) {
				//iDebug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {
			//iDebug("zhangjj [xmlHttp] readyState = 4");
			this.frame.clearTimeout(this.timer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
				this.success();
			} else {
				this.failed();
			}
			this.complete();
		}
	};
	this.success = function() {
		//屏蔽掉返回的空数据
		if (!this.xmlHttp.responseText) return;
		
		//先判断是否是鉴权失败！
		var res = eval("("+this.xmlHttp.responseText+")");
		
		//非登录接口的9021和9022就需要跳转到登录首页
		if ((res.ret == 9021 || res.ret == 9022) && this.url.indexOf("/account/login") == -1) {
			this.iDebug("9021---url="+this.url+"---result="+this.xmlHttp.responseText);
			
			if (navigator.appName.indexOf("iPanel") != -1) {
				if (iPanel.eventFrame.showDialogTimes == 0) {
					iPanel.eventFrame.showDialogTimes = 1;
					iPanel.eventFrame.showdialog("请重新登录！");
					
					//收到9021、9022错误码时情况缓存中的token
					iPanel.misc.setGlobal(iPanel.eventFrame.da_id+"_token", "");
					iPanel.misc.save();
					
					setTimeout(function () {
						iPanel.eventFrame.showDialogTimes = 0;
						
						if(typeof top.httpInstance != "undefined" && top.httpInstance != null){
							top.httpInstance.stop(1);
							top.httpInstance.close();
						}
						
						if (typeof gotoPage != "undefined") {
							gotoPage(webclient+"/application/account/loginIndex.htm");
						} else {
							window.location.href = webclient+"/application/account/loginIndex.htm";
						}
					}, 1500);
				}
			}
		} else {
			if (this.callbackParams == null) {
				this.successCallback(this.xmlHttp, res);
			} else {
				this.successCallback(this.xmlHttp, this.callbackParams);
			}
			this.counter = 0;
		}
	};
	this.failed = function() {
		if (this.callbackParams == null) {
			this.failureCallback(this.xmlHttp);
		} else {
			this.failureCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.complete = function() {
		if (this.callbackParams == null) {
			this.completeCallback(this.xmlHttp);
		} else {
			this.completeCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
		if (this.xmlHttp.readyState != 4) {
			if (this.counter < this.requestTimes) {
				//iDebug("zhangjj [xmlHttp] requestAgain");
				this.requestAgain();
			} else {
				//iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
				this.failed();
				this.complete();
				this.requestAbort();
			}
		}
	};
	this.requestAgain = function() {
		this.requestAbort();
		var target = this;
		this.frame.clearTimeout(this.timer);
		this.timer = this.frame.setTimeout(function() {
			//iDebug("[xmlHttp] request again");
			target.counter++;
			target.requestData(target.method, target.headers, target.username, target.password);
		}, this.frequency);
	};
	this.requestAbort = function() {
		//iDebug("[xmlHttp] call abort");
		this.frame.clearTimeout(this.timer);
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
		} else if (this.xmlHttp.responseText.indexOf("<\?xml") != -1) {
			return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
		}
		return null;
	};
	this.iDebug = function (str) {
		if(navigator.appName.indexOf("iPanel") != -1){
			iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
		}else if(navigator.appName.indexOf("Opera") != -1){
			opera.postError(str);
		}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
			console.log(str);
		}
	}
}
