var BrowserType = getBrowserType();	//浏览器类型
var IPANEL30 = checkIPANEL30();	//是否为ipanel 3.0的浏览器
//控制消息流向 截止：EVENT.STOP  同层：EVENT.ADVECTED  下一层：EVENT.DOWN
var EVENT = {STOP:false, DOWN:true, ADVECTED:true};
if(IPANEL30){
	EVENT = {STOP:0, DOWN:1, ADVECTED:2};	
}

function $(__id){
	return document.getElementById(__id);
}

//打印函数
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,2);	
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

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

//检测当前是否为iPanel30浏览器
function checkIPANEL30(){
	var userAgent = navigator.userAgent.toLowerCase();
	var flag = false;	
	if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel3.0
		flag = true;
	}
	return flag;
}

/*获取ca卡号*/
function getCAId(){
	var tmpCardId = "";
	if(BrowserType == "iPanel"){
		tmpCardId = CA.card.serialNumber;
	}else if(browserType == "Inspur"){
		tmpCardId = iSTB.settings.get("sys:ca0:cardnumber");
	}	
	if(tmpCardId == "undefined" || tmpCardId == null){
		tmpCardId = "";
	}
	return tmpCardId;	
}

/*获取url参数*/
//getUrlParams("menuPos",window.location.href)
function getUrlParams(_key, _url, _spliter) {
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
		if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
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

/*检查字符串是否为有效值*/
function checkStrNull(_str){
	var tmpStr = "";
	if(typeof(_str) == "undefined" || _str == "null" || _str == "undefined"){
		tmpStr = "";
	}else{
		tmpStr = _str;
	}	
	return tmpStr;
}

/*返回字符串的汉字长度*/
function getStrChineseLength(str){
	var arr = str.split("");
	var n = arr.length;
	var i = 0;
	for(i = n - 1; i >= 0; i--){
		if(arr[i] != " " && arr[i] != "\t" && arr[i] != "\n"){
			break;
		}
		arr.pop();
	}
	n = i + 1;
	var c;
	var w = 0;
	for (i=0; i<n; i++) {
		c = arr[i].charCodeAt(0);
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			w++;
		}else {
			w+=2;
		}
	} 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
}

/*截取字符串,长度为汉字的长度*/
function subStr(str,len,suffix){
	var tmpStr = checkStrNull(str);
	if(tmpStr == "") return tmpStr;
	var arr = str.split("");
	var n = arr.length;
	var i = 0;
	for(i = n - 1; i >= 0; i--){
		if(arr[i] != " " && arr[i] != "\t" && arr[i] != "\n"){
			break;
		}
		arr.pop();
	}
	n = i + 1;
	str = arr.join("");
	var c;
	var w = 0;
	var flag0 = 0;//上上个字符是否是双字节
	var flag1 = 0;//上个字符是否是双字节
	var flag2 = 0;//当前字符是否是双字节
	for (i=0; i<n; i++) {
		c = arr[i].charCodeAt(0);
		flag0 = flag1;
		flag1 = flag2;
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			w++;
			flag2 = 0;
		}else {
			w+=2;
			flag2 = 1;
		}
		if(parseInt((w+1)/2)>len){
			if(typeof(suffix) == "undefined"){
				return str.substring(0,i);
			}
			else if(suffix.length == 1){
				return str.substring(0,i-1)+suffix;
			}
			else if(suffix.length == 2){
				if (flag1 == 1)return str.substring(0,i-1)+suffix;
				else return str.substring(0,i-2)+suffix;
			}
			else{
				if (flag1 == 1)return str.substring(0,i-2)+suffix;
				else{
					var num = flag0 == 1 ? 2 : 3;
					return str.substring(0,i-num)+suffix;
				}
			}
			break;
		}		 
	} 
	return str;
}

/*滚动字符串,长度为汉字的长度*/
function marqueeStr(_str,_len,_flag){
	var tmpStr = checkStrNull(_str);
	if(tmpStr == "") return tmpStr;
	var marqStr = _str;
	var len = getStrChineseLength(_str);
	if(len > _len){
		if(typeof(_flag) != "undefined"){//传参数表示需要设置marquee的width属性
			if(_flag.indexOf("px") != -1 || _flag.indexOf("%") != -1){
				marqStr = "<marquee width='" + _flag + "' >" + _str + "</marquee>";	
			}else{
				marqStr = "<marquee>" + _str + "</marquee>";
			}
		}else{
			marqStr = "<marquee>" + _str + "</marquee>";	
		}
	}
	return marqStr;
}

/*获取时间*/
//formatTime("YYYY年MM月DD日 hh:mm:ss W");
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

/*全局变量封装（兼容ipanel3.0和其它浏览器）*/
var mySessionStorage = new globalVar();
function globalVar(){
	this.getItem = function(_str){
		var val = "";
		if(IPANEL30){
			val = iPanel.getGlobalVar(_str);
		}else{
			val = sessionStorage.getItem(_str);	
		}
		if(val == "" || val == null || val == "undefined" ) val = "";
		return val;
	};
	this.removeItem = function(_str){
		if(IPANEL30){
			iPanel.delGlobalVar(_str);
		}else{
			sessionStorage.removeItem(_str);	
		}
	}
	this.setItem = function(_key, _val){
		if(IPANEL30){
			iPanel.setGlobalVar(_key, _val);
		}else{
			sessionStorage.setItem(_key, _val);	
		}
	}
}

/*---设置获取全局变量----------------------------------------------*/
function setGlobalVar(sName, sValue) {
  try{ iPanel.setGlobalVar(sName,escape("" + sValue));}catch(e)
  { document.cookie = escape(sName) + "=" + escape(sValue);}
}
function getGlobalVar(sName){
  var result = null;
  try{ result = iPanel.getGlobalVar(sName);
  }catch(e){
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++){
      var aCrumb = aCookie[i].split("=");
      if (escape(sName) == aCrumb[0]){
        result = unescape(aCrumb[1]);
        break;
      }
    }
  }
  return result;
}

/*获取ajax请求路径*/
function getAjaxUrl() {
	var args = arguments;
	var paraLen = args.length - 1;//需要替换的参数个数
	var interfaceUrl = eval(args[0]);
	//iDebug(">>>smile common.js getAjaxUrl in... args[0]=" + args[0] + ",paraLen=" + paraLen + ",interfaceUrl=" + interfaceUrl);
	for(var i = 1; i <= paraLen; i++){
		interfaceUrl = interfaceUrl.replace(eval('/\\{'+i+'\\}/g'), args[i]);
	}
	//iDebug(">>>smile common.js getAjaxUrl out... interfaceUrl=" + interfaceUrl);
	return interfaceUrl;
}

/*Ajax对象封装*/
function AjaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
	this.url = _url || "";
	this.successCallback = _successCallback || function(_xmlHttp, _params) {};
	this.failureCallback = _failureCallback || function(_xmlHttp, _params) {};
	this.urlParameters = _urlParameters || "";
	this.callbackParams = _callbackParams || null;
	this.async = typeof(_async) == "undefined" ? true : _async;
	this.charset = _charset || null;
	this.timeout = _timeout || 8000; 
	this.frequency = _frequency || 500; 
	this.requestTimes = _requestTimes || 0;//请求失败后自动再次请求的次数，默认不自动再次请求
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";
	this.abortFlag = false;	//是否调用了abort接口，茁壮浏览器在调用abort后触发onreadystatechange，发送readyState为4，改变量是为了标示当前是中止导致发的4还是正常请求发的4

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
		this.frame.clearTimeout(this.timer);
		this.abortFlag = false;
		this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
		this.headers = typeof(_headers) == "undefined" ? null : _headers;
		this.username = typeof(_username) == "undefined" ? "" : _username;
		this.password = typeof(_password) == "undefined" ? "" : _password;
		var target = this;
		var url;
		var data;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		if (this.method == "POST") { 
			url = encodeURI(this.url);
			data = this.urlParameters;
		} else {
			url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			data = null;
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
			//this.xmlHttp.setRequestHeader("Content-type","application/xml");
			//this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
			this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");			
		}
		if (this.charset != null) { //要使用responseXML就不能设置此属性
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		this.xmlHttp.send(data);
	};
	this.stateChanged = function() { //状态处理
		if (this.xmlHttp.readyState < 2) {
			iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ",this.url=" + this.url);
		} else {
			iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + ",this.abortFlag=" + this.abortFlag + ",this.url=" + this.url);
		}

		var target = this;
		if (this.xmlHttp.readyState == 1) {
			this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);
		}else if (this.xmlHttp.readyState == 4) {
			this.frame.clearTimeout(this.timer);
			if(this.abortFlag) return;	//如果是因为中止导致发的4，则不继续触发成功或者失败函数
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0){
				//本地测试加上|| this.xmlHttp.status == 0;
				this.success();
			} else {
				this.failed();
			}
		}
	};
	this.success = function() {
		if (this.callbackParams == null) {
			this.successCallback(this.xmlHttp);
		} else {
			this.successCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.failed = function() {
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
		this.frame.clearTimeout(this.timer);
		this.abortFlag = true;
		this.xmlHttp.abort();
	};
	this.addParameter = function(_json) {
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
	this.getResponseXML = function() {
		if (this.xmlHttp.responseXML != null) {
			return this.xmlHttp.responseXML;
		} else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
			return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
		}
		return null;
	};
}

/*HashMap仿写，供页面缓存*/
var hashTableObj = new hashTableClass(100);
function hashTableClass(_maxLength) {
	this.maxLength = typeof(_maxLength) == "undefined" ? 50 : _maxLength;
	this.hash = new Object();
	this.arry = new Array(); //记录条目的key
	this.put = function(_key, _value, _notCover) {
		if (typeof(_key) == "undefined") {
			return false;
		}
		if (this.contains(_key) == true) {
			if (_notCover) {
				return false;
			}
		}
		this.limit();
		if (this.contains(_key) == false) {
			this.arry.push(_key);
		}
		this.hash[_key] = typeof(_value) == "undefined" ? null : _value;
		return true;
	};
	this.get = function(_key) {
		if (typeof(_key) != "undefined") {
			if (this.contains(_key) == true) {
				return this.hash[_key];
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	this.remove = function(_key) {
		if (this.contains(_key) == true) {
			delete this.hash[_key];
			for (var i = 0, len = this.arry.length; i < len; i++) {
				if (this.arry[i] == _key) {
					this.arry.splice(i, 1);
					break;
				}
			}
			return true;
		} else {
			return false;
		}
	};
	this.contains = function(_key) {
		return typeof(this.hash[_key]) != "undefined";
	};
	this.clear = function() {
		this.hash = {};
		this.arry = [];
	};
	this.limit = function() {
		if (this.arry.length >= this.maxLength) { //保存的对象数大于规定的最大数量
			var key = this.arry.shift(); //删除数组第一个数据，并返回数组原来第一个元素的值
			this.remove(key);
		}
	};
}

/***************************************showList  start*******************************/
function showList(__listSize, __dataSize, __position, __startplace, __f){
	//this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
	this.currWindow = __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //列表显示的长度；
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //所有数据的长度；
	this.position = typeof(__position)=="undefined" ? 0 : __position;  //当前数据焦点的位置；
	this.focusPos = 0;      //当前列表焦点的位置；
	this.lastPosition = 0;  //前一个数据焦点的位置；
	this.lastFocusPos = 0;  //前一个列表焦点的位置；
	this.tempSize = 0;  //实际显示的长度；
	this.infinite = 0; //记录数值，用来获取数据焦点的位置；
	
	this.pageStyle  = 0;  //翻页时焦点的定位，0表示不变，1表示移到列表首部；
	this.pageLoop   = null;  //是否循环翻页, true表示是，false表示否；
	this.showLoop   = null;  //是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
	this.focusLoop  = null;  //焦点是否首尾循环切换；
	this.focusFixed = null;  //焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
	this.focusVary  = 1;  //当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
	this.focusStyle = 0;  //切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；
	
	this.showType = 1; //呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式；	
	this.listSign = 0; //0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
	this.listHigh = 30;  //列表中每个行的高度，可以是数据或者数组，例如：40 或 [40,41,41,40,42];
	this.listPage = 1;  //列表的总页数量；
	this.currPage = 1;  //当前焦点所在页数；
	
	this.focusDiv = -1;  //列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40);
	this.focusPlace = new Array();  //记录每行列表焦点的位置值；
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //列表焦点Div开始位置的值；
	
	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
	//调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；
	
	this.focusUp  = function(){this.changeList(-1);}; //焦点向上移动；
	this.focusDown= function(){this.changeList(1); }; //焦点向下移动；
	this.pageUp   = function(){this.changePage(-1);}; //列表向上鄱页；
	this.pageDown = function(){this.changePage(1); }; //列表向下鄱页；
	
	//开始显示列表信息
	this.startShow = function(){
		this.initAttrib();
		this.setFocus();
		this.showList();
	}
	//初始化所有属性；
	this.initAttrib = function(){	
		if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";  //把数值转换成字符串；
		if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;  //设置滑动对象的方向值;
				
		if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;  //初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
		if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;  //初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false;
		if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;	//初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
		if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;   //初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
		if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;   //如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；
		
		if(this.focusVary<1) this.focusVary = 1;
		if(this.focusPos>=this.listSize) this.focusPos = this.listSize-1;
		if(this.focusPos<0) this.focusPos = 0;
		if(this.position>=this.dataSize) this.position = this.dataSize-1;
		if(this.position<0) this.position = 0;
		this.lastPosition = this.infinite = this.position;
		
		this.initPlace();
		this.initFocus();
		this.lastFocusPos = this.focusPos;
	}
	//初始化焦点位置；
	this.initFocus = function(){
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
		if(this.showType == 0){  //当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
			this.focusPos = this.position%this.listSize;
		}else if(!this.focusFixed&&!this.showLoop){  //当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
			var tempNum = this.position-this.focusPos;
			if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
		}
	}
	//处理每行(列)所在的位置，并保存在数组里；
	this.initPlace = function(){
		var tmph = this.listHigh;
		var tmpp = [this.startPlace];		
		for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
		this.focusPlace = tmpp;
	}
	//切换焦点的位置
	this.changeList = function(__num){
		if(this.dataSize==0) return;
		if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
		this.changePosition(__num);
		this.checkFocusPos(__num);
	}
	//切换数据焦点的值
	this.changePosition = function(__num){
		this.infinite += __num;
		this.lastPosition = this.position;	
		this.position = this.getPos(this.infinite, this.dataSize);
	}
	//调整列表焦点并刷新列表；
	this.checkFocusPos = function(__num){
		if(this.showType==0){	
			var tempNum  = this.showLoop ? this.infinite : this.position;
			var tempPage = Math.ceil((tempNum+1)/this.listSize);
			this.changeFocus(this.getPos(tempNum, this.listSize)-this.focusPos);
			if(this.currPage!=tempPage){ this.currPage = tempPage;this.showList(); }		
		}else{
			if((this.lastPosition+__num<0||this.lastPosition+__num>this.dataSize-1)&&!this.showLoop&&!this.focusFixed){
				this.changeFocus(__num*(this.tempSize-1)*-1);
				this.showList();
				return;
			}
			if(this.focusPos+__num<0||this.focusPos+__num>this.listSize-1||this.focusFixed){				
				this.showList();
			}else{
				this.changeFocus(__num);
			}
		}		
	}
	//切换列表焦点的位置
	this.changeFocus = function(__num){
		this.lastFocusPos = this.focusPos;
		this.focusPos += __num;
		this.setFocus(__num);
	}
	//设置调整当前焦点的位置；
	this.setFocus = function(__num){
		if(typeof(this.focusDiv)=="number") return;  //如果没定义焦点DIV，则不进行设置操作；
		var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));  //当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
		if(typeof(this.focusDiv)=="string"){  //直接设置焦点位置；
			this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
		}else if(typeof(__num)=="undefined"||tempBool){  //直接定位焦点；
			this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
		}else if(__num!=0){  //滑动焦点；
			this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
		}
	}	
	//切换页面列表翻页
	this.changePage = function(__num){	
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;  //判断当前是否首页跳转尾页或尾页跳转首页;
		if(this.showLoop){   //如果内容是循环显示，则执行下面的翻页代码；
			if(isBeginOrEnd&&!this.pageLoop) return;
			var tempNum = this.listSize*__num;
			if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
				this.changePosition(this.focusPos*-1);
				this.checkFocusPos(this.focusPos*-1);
			}
			this.changePosition(tempNum);
			this.checkFocusPos(tempNum);
		}else{
			if(this.dataSize<=this.listSize) return;  //如果数据长度小长或等于列表显示长度，则不进行翻页；
			if(this.showType==0){
				if(isBeginOrEnd&&!this.pageLoop) return;   //如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
				var endPageNum = this.dataSize%this.listSize;  //获取尾页个数;
				var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;  //判断目标页是否为尾页;
				var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;	  //判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；		
				var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize;  //判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
				overNum = this.pageStyle==0 ? overNum : this.focusPos;  //判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
				tempNum = tempNum*__num-overNum;				
				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				var tempPos   = this.position-this.focusPos;  //获取当前页列表首部的数据焦点；
				var tempFirst = this.dataSize-this.tempSize;  //获取尾页第一个数据焦点的位置；
				if(tempPos+__num<0||tempPos+__num>tempFirst){
					if(!this.pageLoop) return;  //不循环翻页时跳出，否则获取翻页后的数据焦点;
					tempPos = __num<0 ? tempFirst : 0;
				}else{
					tempPos += this.tempSize*__num;
					if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
				}		
				var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;  //判断当前翻页时焦点的style, 取得列表焦点位置；
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);  //如果this.focusPos不为0，则移动列表焦点到列表首部；
				this.changePosition(tempPos-this.position+tempNum); 
				this.showList();
			}
		}
	}
	//显示列表信息
	this.showList = function(){
		var tempPos = this.position-this.focusPos;	 //获取当前页列表首部的数据焦点；
		for(var i=tempPos; i<tempPos+this.listSize; i++){		
			var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };  //定义一个对象，设置当前列表焦点和数据焦点值；
			( i >= 0 && i < this.dataSize)||(this.showLoop && this.dataSize !=0 ) ? this.haveData(tempObj) : this.notData(tempObj);  //当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
		}
		this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.listPage = Math.ceil(this.dataSize/this.listSize);
	}
	//清除列表信息
	this.clearList = function(){
		for(var i=0; i<this.listSize; i++) this.notData( { idPos:i, dataPos:this.getPos(i, this.dataSize) } );
	}
	this.getPos = function(__num, __size){
		return __size==0 ? 0 : (__num%__size+__size)%__size;
	}
	this.$ = function(__id){
		return this.currWindow.document.getElementById(__id);
	}
}
/*
/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
// function showList(__listSize, __dataSize, __position, __startplace, __f){
// 	this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
// 	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //列表显示的长度；
// 	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //所有数据的长度；
// 	this.position = typeof(__position)=="undefined" ? 0 : __position;  //当前数据焦点的位置；
// 	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //列表焦点Div开始位置的值；
// 	this.focusPos = 0;      //当前列表焦点的位置；
// 	this.currPage = 1;		//当前在第几页
// 	this.focusDiv = "";		//焦点id
// 	this.listHigh = 30;		//列表中每个行的高度，可以是数字或者数组(焦点处于每一行时的top值)，例如：40 或 [140,181,223,263];
// 	this.listSign = "top";	//取值"top"或"left"；
// 	this.focusLoop = false;	//上下切换是否循环
// 	this.pageLoop = false;	//翻页是否循环

// 	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
// 	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；

// 	//开始显示列表信息
// 	this.startShow = function(){
// 		this.currPage = Math.ceil((this.position + 1) / this.listSize);
// 		this.setFocus();
// 		this.showList();
// 	};

// 	this.showList = function(){
// 		for(var i = (this.currPage - 1) * this.listSize; i < this.currPage * this.listSize; i++){
// 			var list = {"idPos":i % this.listSize, "dataPos":i};
// 			if(i < this.dataSize){
// 				this.haveData(list);
// 			}else{
// 				this.notData(list);
// 			}
// 		}
// 	};

// 	this.changeList = function(__num){
// 		if(this.dataSize == 0) return;
// 		if(((this.position == 0 && __num < 0) || (this.position == this.dataSize - 1 && __num > 0)) && !this.focusLoop) return;
// 		this.position = (this.position + __num + this.dataSize) % this.dataSize;
// 		this.setFocus();
// 		this.checkPage();
// 	};

// 	this.setFocus = function(){
// 		this.focusPos = this.position % this.listSize;
// 		if(typeof(this.listHigh) == "number"){
// 			this.$(this.focusDiv).style[this.listSign] = this.focusPos * this.listHigh + this.startPlace + "px";
// 		}
// 		else if(typeof(this.listHigh) == "object"){
// 			this.$(this.focusDiv).style[this.listSign] = this.listHigh[this.focusPos] + "px";
// 		}
// 	};

// 	this.checkPage = function(){
// 		var tempPage = Math.ceil((this.position + 1) / this.listSize);
// 		if(this.currPage == tempPage) return;
// 		this.currPage = tempPage;
// 		this.showList();
// 	};

// 	this.changePage = function(__num){
// 		if(this.dataSize == 0) return;
// 		var totalPage = Math.ceil(this.dataSize / this.listSize);
// 		if(totalPage <= 1) return;
// 		var currPage = Math.floor(this.position / this.listSize) + 1;
// 		if(((currPage == 1 && __num < 0) || (currPage == totalPage && __num > 0)) && !this.pageLoop) return;
// 		if((currPage == totalPage - 1 && this.position + this.listSize > this.dataSize - 1 && __num > 0) || (currPage == 1 && __num < 0)){
// 			this.position = this.dataSize - 1;
// 		}
// 		else if(currPage == totalPage && __num > 0){
// 			this.position = 0;
// 		}
// 		else{
// 			this.position = (this.position + __num * this.listSize + this.dataSize) % this.dataSize;
// 		}
// 		this.setFocus();
// 		this.checkPage();
// 	};

// 	this.$ = function(__id){
// 		return this.currWindow.document.getElementById(__id);
// 	}
// }


/*滚动条封装*/
function ScrollBar(id, barId, f) {
	this.obj = null;
	this.barObj = null;
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		this.barObj = f.document.getElementById(barId);
	}
	
	this.init = function(totalNum, pageSize, maxBarLength, startPos, fixBarLen) {//最后一个参数表示固定滚动条的长度，如果要动态计算就不要传
		this.startPos = startPos;
		var percent = 1;
		if (totalNum > pageSize) {
			percent = pageSize / totalNum;
		}
		var barLength = maxBarLength*percent;
		if(typeof(fixBarLen) == "undefined"){
			if(this.barObj != null){
				this.barObj.style.height = Math.round(barLength) + "px";
			}
			this.endPos = this.startPos + (maxBarLength - barLength);
		}else{
			this.endPos = this.startPos + (maxBarLength - fixBarLen);
		}
		if(totalNum > 1){
			this.footStep = (this.endPos - this.startPos) / (totalNum - 1);
		}else{
			this.footStep = 0;
		}
	},
	
	this.scroll = function(currPos) {
		var tempPos = this.startPos + this.footStep * currPos;
		this.obj.style.top = Math.round(tempPos) + "px";
	}
}

/**************** URL加解码封装 - start ******************/
//由于有些项目无法正常使用encodeURIComponent和decodeURIComponent，所以这里做了一个特殊封装
function encodeURICom(_str){
	var newStr = encodeURIComponent(_str);
	newStr = newStr.replace(/%/g,"%ZB");
	return newStr;
}

function decodeURICom(_str){
	var newStr = _str.replace(/%ZB/g,"%");
	newStr = decodeURIComponent(newStr);
	return newStr;
}
/**************** URL加解码封装 - end ******************/

function goPortal(){ // 跳转到portal首页
	var backUrl = "";
	var backtoportal = window.name;
	if(backtoportal != null&& backtoportal != "" && backtoportal != undefined) {
		 backUrl = backtoportal;
	}else if(window.location.href.indexOf("?http") > -1 || window.location.href.indexOf("?file")>-1){
		 backUrl = window.location.href.split("?")[1];	
	}else{
		var backtoportal2 = localStorage.getItem("portal");
		if (backtoportal2 != null&& backtoportal2 != "" && backtoportal2 != undefined) {
			backUrl = backtoportal2;
		}
	}
	if(backUrl!=""){
		window.location.href = backUrl;	
	}
}

function dealColumnJSURL(_str){ // 从栏目列表的内容页返回上一层时jsurl需要减去两个层级
	var newStr = _str.substring(0,_str.length - 1);
	var index = newStr.lastIndexOf("/");
	newStr = newStr.substring(0,index + 1);
	return newStr;
}

function dealColumnTitle(_str){ // 从栏目列表的内容页返回上一层时title需要减去一个层级
	var index = _str.lastIndexOf(">");
	var newStr = _str.substring(0,index);
	return newStr;
}