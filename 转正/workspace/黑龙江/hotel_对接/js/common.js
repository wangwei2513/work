function getSmartCardId(){ 
	try{
		return typeof CAManager != "undefined" ? CAManager.cardSerialNumber : (typeof CA != "undefined" ? (CA.serialNumber || CA.card.serialNumber) : "");
	} catch (e){ 
		return "";
	} 
}

var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var webkitFlag = false;
var EVENT = {STOP:0, DOWN:1, ADVECTED:2};//控制消息流向 截止：EVENT.STOP  同层：EVENT.ADVECTED  下一层：EVENT.DOWN
var userAgent = navigator.userAgent.toLowerCase();
if(userAgent.indexOf("ipanel") == -1 || (userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") != -1)){
	webkitFlag = true;
	EVENT = {STOP:false, DOWN:true, ADVECTED:true};	
}
if(webkitFlag){
	document.onkeydown = function () {return (eventHandler(eventMapping(event), 1));};
}else{
	document.onkeypress = function () {return (eventHandler(eventMapping(event), 1));};
	document.onirkeypress = function () {return (eventHandler(eventMapping(event), 1));};
   
}
 document.onsystemevent = function () {return (eventHandler(eventMapping(event), 2));};

/*键值映射
args不定义type，消息流向由页面控制（调用EVENT.STOP/EVENT.DOWN/EVENT.ADVECTED）
页面定义eventHandler方法处理按键
*/
function eventMapping(__event){
	var keycode = __event.which || __event.keycode;
	var code = "";
	var args = {};
	if(keycode < 58 && keycode > 47){//数字键
		args = {modifiers: __event.modifiers, value: (keycode - 48)};
		code = "KEY_NUM";
	} else {
		var args = {modifiers: __event.modifiers, value: keycode};
		switch(keycode){
			case 1:
			case 38://advanced_value
				code = "KEY_UP";
				break;
			case 2:
			case 40://advanced_value
				code = "KEY_DOWN";
				break;
			case 3:
			case 37://advanced_value
				code = "KEY_LEFT";
				break;
			case 4:
			case 39://advanced_value
				code = "KEY_RIGHT";
				break;
			case 13:
				code = "KEY_SELECT";
				break;
			case 27://advanced_value
			case 339:
				code = "KEY_EXIT";
				break;
			case 8://advanced_value
			case 340:
				code = "KEY_BACK";
				break;
			case 33://advanced_value
			case 372://page up
			case 374:
				code = "KEY_PAGE_UP";
				break;
			case 34://advanced_value
			case 373:
			case 375:
				code = "KEY_PAGE_DOWN";
				break;
			case 72:
			case 512://首页
			case 4098://advanced_value
				code = "KEY_HOMEPAGE";
				break;
			case 66:
			case 513://菜单键
			case 4097://advanced_value
				code = "KEY_MENU";
				break;
			case 832://red
			case 2305://advanced_value
				code = "KEY_RED";
				break;
			case 833://green
			case 2306://advanced_value
				code = "KEY_GREEN";
				break;
			case 834://yellow
			case 2307://advanced_value
				code = "KEY_YELLOW";
				break;
			case 835://blue
			case 2308://advanced_value
				code = "KEY_BLUE";
				break;
			case 5202://EIS_VOD_PREPAREPLAY_SUCCESS
				code = "EIS_VOD_PREPAREPLAY_SUCCESS";
				break;
			case 5203:
				code = "EIS_VOD_CONNECT_FAILED";
				break;
			case 5225:
				code = "EIS_VOD_USER_EXCEPTION";
				break;					
			case 5206:
				code = "EIS_VOD_PLAY_FAILED";
				break;
			case 5210:
				code = "EIS_VOD_PROGRAM_END";
				break;
			case 5410:
				code = "EIS_MP3_WORDS_DOWNLOAD_SUCCESS";//mp3歌词下发成功
				break;
			case 5411:
				code = "EIS_MP3_WORDS_DOWNLOAD_FAILED";//mp3歌词息发失败
				break;
			case 5412:
				code = "EIS_MP3_WORDS_SHOW";//应用，应用收到该消息后显示下一句歌词。
				break;
			case 5205:
				code = "EIS_VOD_PLAY_SUCCESS";
				break;
			case 187:
		    case 595://音量+
			case 4109://德州项目
				code="KEY_VOLUME_UP";
				name = "音量+";
				break;
			case 189:
			case 596://音量-
			case 4110://德州项目
				code="KEY_VOLUME_DOWN";
				name = "音量-";
				break;
			case 13001://媒体源路径有效
				code = "MSG_MEDIA_URL_VALID";
				break;
			case 13002://媒体源路径无效
				code = "MSG_MEDIA_URL_INVALID";
				break;
			case 13003://开始播放成功
				code = "MSG_MEDIA_PLAY_SUCCESS";	
				break;
			case 13004://开始播放失败
				code = "MSG_MEDIA_PLAY_FAILED";
				break;
			case 13005://步长设置成功
				code = "MSG_MEDIA_SETPACE_SUCCESS";
				break;
			case 13006://步长设置失败
				code = "MSG_MEDIA_SETPACE_FAILED";	
				break;
			case 13007://设置播放时间点成功
				code = "MSG_MEDIA_SEEK_SUCCESS";	
				break;
			case 13008://设置播放时间点失败
				code = "MSG_MEDIA_SEEK_FAILED";	
				break;
			case 13009://暂停播放成功
				code = "MSG_MEDIA_PAUSE_SUCCESS";	
				break;
			case 13010://暂停播放失败
				code = "MSG_MEDIA_PAUSE_FAILED";	
				break;
			case 13011://恢复播放成功
				code = "MSG_MEDIA_RESUME_SUCCESS";	
				break;
			case 13012://恢复播放失败
				code = "MSG_MEDIA_RESUME_FAILED";	
				break;
			case 13013://停止播放成功
				code = "MSG_MEDIA_STOP_SUCCESS";	
				break;
			case 13014://停止播放失败
				code = "MSG_MEDIA_STOP_FAILED";
				break;
			case 13015:// 播放结束
				code = "MSG_MEDIA_END_OF_STREAM";	
			break;
		}
	}
	return {code: code, args: args};
}

/*获取url中携带参数*/
function getParam(_type,_url){
	var url = _url || window.location.search;
	if(new RegExp(".*\\b"+_type+"\\b(\\s*=([^&]+)).*", "gi").test(_url)){
		return RegExp.$2;
	}else{
		return null;
	}
}

//*******************返回字符串汉字长度 英文或特殊字符两个相当于一个汉字 start*******************//
/*
 *str:传入的字符串
 *len:字符串的最大长度
 *返回截取的字符串
 */
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//判断是否是advance版本
var tool = {
	isiPanel:(navigator.appName.indexOf("iPanel") != -1)?true:false, 
	checkTimes:0,
	maxCheckTimes:100,	
	//获取汉字的长度，一个汉字算两个字节
	getCharacterLength:function(_str){
		var _str = _str.replace(/[\(\)\-\\\[\]]/g, "0");//把字符串中中括号中的这些字符替换成"0"
		if(this.isiPanel && !isAdvanceFlag){	//advance不走这里面
			var re = /[^\u2E80-\uFE4F]+/gi;		//iPanel匹配中文不一样，要加个非判断
		}else{
			var re = /[\u2E80-\uFE4F]+/gi;
		}
		
		var bb = _str.match(re);//找到匹配的中文字符串（多个返回的是数组形式）
		if(typeof bb == "undefined" || bb == "null"){
			return _str.length; 
		}
		var cc = "";
		if(bb!=null){
			cc = bb.join("");  
		}
		var totalLen = _str.length;		//原字符串长度
		var chLen = cc.length; 			//中文串的长度
		var engLen = totalLen - chLen;	//长度差（即非中文字符串长）
		var tW = chLen*2+engLen;		//中文长*2+非中文长
		/*//W,M英文大写也算是一个汉字  数字: 48-57 小写字母: 97-122 大写字母: 65-90
		var specialChar = /[\<\>|A-Z]/gi;
		if(_str.match(specialChar)!=null&&typeof _str.match(specialChar)!="undefined"){
			tW += _str.match(specialChar).length;
		}*/
		return tW;
	},
	
	getRealLength:function(_str,_len){
		if(_str.length <= _len/2) return _str.length;
		var num = 0;
		//var re = /^[\u4e00-\u9fa5]*$/;
		for(var i=0;i<_str.length;i++){
			if(_str.charCodeAt(i)>255||(_str.charCodeAt(i)>=65&&_str.charCodeAt(i)<=90)){
				num+=2;//>255认为是汉字
			}else{
				num++;
			}
			if(num>=_len) return i+1;//超过的时候，只截取前面的部分。
		}
		return _str.length;
	},

	//截取字符串
	cutStr:function(stbr, len){
        var char_length = 0;
        for (var i = 0; i < stbr.length; i++){
            var son_str = stbr.charAt(i);//第i个字符
            encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
            if (char_length >= len){
                var sub_len = char_length == len ? i+1 : i;
                return stbr.substr(0, sub_len);
                break;
            }
        }
		
		return stbr.substr(0, len);
    }
}

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
	this.timeout = _timeout || 5000; //5s
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
		//iDebug("[xmlHttp] this.method = "+this.method);
		if (this.method == "POST") { //encodeURIComponent
			var url = encodeURI(this.url);
			data = this.urlParameters;
			iDebug("requestData data = "+ data);
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
		iDebug("common.js [xmlHttp]  send(): " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
		this.timer = this.frame.setTimeout(function() {
			target.checkStatus();
		}, this.timeout);//5秒后检查状态
	};
	
	this.stateChanged = function() { //状态处理，有五种状态0~4
		// 0 － （未初始化）还没有调用send()方法
		// 1－ （载入）已调用send()方法，正在发送请求
		if (this.xmlHttp.readyState < 2) {
			iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		} else {
			iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) { //（载入完成）send()方法执行完成，已经接收到全部响应内容
			/*this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);*/
		} else if (this.xmlHttp.readyState == 3) {//（交互）正在解析响应内容
			// status是XMLHttpRequest对象的一个属性，表示响应的HTTP状态码
			if (this.xmlHttp.status == 401) {//请求授权失败
				iDebug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {//（完成）响应内容解析完成，可以在客户端调用了
			this.frame.clearTimeout(this.timer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0) {//交易成功||请求收到，但返回信息为空
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
		/*var res = eval("("+this.xmlHttp.responseText+")");
		//非登录接口的9021和9022就需要跳转到登录首页
		if ((res.ret == 9021 || res.ret == 9022) && this.url.indexOf("/account/login") == -1) {
			iDebug("9021---url="+this.url+"---result="+this.xmlHttp.responseText);
			
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
							gotoPage(loginURL);
						} else {
							window.location.href = loginURL;
						}
					}, 1500);
				}
			}
		} else {*/
			if (this.callbackParams == null) {
				this.successCallback(this.xmlHttp);
			} else {
				this.successCallback(this.xmlHttp, this.callbackParams);
			}
			this.counter = 0;
		// }
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
		this.onreadystatechange = function() {};
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
}

/*--------------------------------------------------------------------------showList封装----------------------------------------------------------------*/
/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
function showList(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? window : __f;
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
		// this.infinite += __num;
		// this.lastPosition = this.position;	
        // this.position = this.getPos(this.infinite, this.dataSize);
        this.infinite += __num
        console.log("this.infinite"+this.infinite)
        this.lastPosition = this.position
        console.log("this.infinite"+this.lastPosition)
        this.position = this.getPos(this.infinite, this.dataSize)
        console.log("this.infinite"+this.position)
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
        console.log("738"+tempPos)
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

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

function $(id){
	return document.getElementById(id);
}

// 设置全局变量
function setGlobalParam(key,value){
	if(navigatorFlag == "iPanel"){//判断是不是iPanel
		iPanel.setGlobalVar(key,value);
	}else{
		sessionStorage.setItem(key,value);
	}
}

// 获取全局变量
function getGlobalParam(key){
	if(navigatorFlag == "iPanel"){
		return iPanel.getGlobalVar(key);
	}else{
		return sessionStorage.getItem(key);
	}
}

// 移除全局变量
function delGlobalParam(key){
	if(navigatorFlag == "iPanel"){
		iPanel.delGlobalVar(key);
	}else{
		sessionStorage.removeItem(key);
	}
}

/************************************滚动条的封装************************************/
function ScrollBar(id, barId, f) {
	//iDebug("ScrollBar----------------");
	this.obj = null;
	this.barObj = null;
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = f.document.getElementById(barId);
		}
	} else {
		this.obj = iPanel.mainFrame.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = iPanel.mainFrame.document.getElementById(barId);
		}
	}
}

ScrollBar.prototype.init = function(totalNum, pageSize, maxBarLength, startPos, type) {
	this.startPos = startPos;
	var percent = 1;
	if (totalNum > pageSize) {
		percent = pageSize / totalNum;
	}
	var barLength = percent * maxBarLength;
	if(typeof(type) != "undefined"){
		if(this.barObj != null){
			this.barObj.style.height = Math.round(barLength) + "px";
		}
		else{
			this.obj.style.height = Math.round(barLength) + "px";
		}
		this.endPos = this.startPos + (maxBarLength - barLength);
	}
	else{
		this.endPos = this.startPos + maxBarLength;
	}
	if(totalNum > 1){
		this.footStep = (this.endPos - this.startPos) / (totalNum - 1);
	}
	else{
		this.footStep = 0;
	}
};

ScrollBar.prototype.scroll = function(currPos) {
	var tempPos = this.startPos + this.footStep * currPos;
	this.obj.style.top = Math.round(tempPos) + "px";
}


/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */        
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}

var date = null;
function timeShow() {
	date = new Date();
    $("currTime").innerText = date.pattern("HH:mm");
    $("currDate").innerText = date.pattern("yyyy/MM/dd");
    setTimeout(function (){
        timeShow(); 
    },60000);
}

// 根据orders字段的值从小到大重新排列栏目
function QuickSort(array) {
	var temp = 0;
	for (var i = 0; i < array.length; i++){
		for (var j = 0; j < array.length - i -1; j++){
			if (array[j].Orders > array[j + 1].Orders){
				temp = array[j + 1];
				array[j + 1] = array[j];
				array[j] = temp;
			}
		}
	}
	return array;
}

function covert2Json(thinfo,info) {
	var resultJson = [];
	for(var i = 0; i < info.length ; i++) {
		var tmpData = {};
		for(var __atrribute in thinfo[0]) {
			if(thinfo[0][__atrribute]) {
				tmpData[thinfo[0][__atrribute]] = decodeURI(info[i][__atrribute]);
			}			
		}
		if(info[i]["subth"]) {//解析子节点
			tmpData["submenu"] = covert2Json(info[i]["subth"],info[i]["submenu"]);
		}
		resultJson.push(tmpData);
	}
	return resultJson;
}