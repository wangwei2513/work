var DEBUG=0;
var access_token = navigator.appName.indexOf("iPanel") != -1?iPanel.eventFrame.access_token:"TOKEN50001002";
var homed_id = navigator.appName.indexOf("iPanel") != -1?iPanel.eventFrame.home_id:"1234";
var deviceid = navigator.appName.indexOf("iPanel") != -1?(iPanel.eventFrame.device_id?iPanel.eventFrame.device_id:9999):9999;
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var user = null;
var ajaxObj=null;
var playurl = playAddress  = "http://10.14.41.246/application/playCase/vodPlay.htm"//http://web.eis/homed/app/education/education_homed/newPlay/play.php"//德州教育专区版专用播放
var result_video_info=null;			//事件流向下一层
var jyjyLabel = 7236;
var ajaxObjSeries = null;
function $(__id){
	return document.getElementById(__id);
}
var	defaultObj = [
					{"name":"运营集群","addr":"192.168.35.101","label":7236},
					{"name":"调试集群","addr":"192.168.101.130","label":34147},
					{"name":"开发集群","addr":"192.168.36.101","label":34147}
				];
getLabelByDns();				
function getLabelByDns(){//根据当前所在的集群，去选择对应的Label
	//iDebug("yanch homedconfig---"+network.ethernets[0].DNSServers[0]);
		var dns = network.ethernets[0].DNSServers[0];
		for(var i = 0;i<defaultObj.length;i++){
			iDebug("yanch homedconfig defaultObj[i].addr="+defaultObj[i].addr)
			if(defaultObj[i].addr == dns){
				jyjyLabel = defaultObj[i].label;
				iDebug("yanch homedconfig- jyjyLabel--"+jyjyLabel);
				break;
				}
			}
}	
/*获取url中携带参数*/
function getParam(_type,_url){
	var url = _url || window.location.href;
	if(new RegExp(".*\\b"+_type+"\\b(\\s*=([^&]+)).*", "gi").test(url)){
		return RegExp.$2;
	}else{
		return "";
	}
}
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,7);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}		
function getUrlParams(_key, _url, _spliter) {
	/**
	 * 获取标准URL的参数
	 * @_key：字符串，不支持数组参数（多个相同的key）
	 * @_url：字符串，（window）.location.href，使用时别误传入非window对象
	 * @_spliter：字符串，参数间分隔符
	 * 注意：
	 * 	1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
	 * 	2、非标准URL勿用（hash部分除外）
	 * 	3、query（？）与hash（#）中存在键值一样时，以数组返回
	 */
	if (typeof(_url) == "object") {
		var url = _url.location.href;
	} else {
		var url = _url ? _url : window.location.href;
	}
	if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
		return "";
	}
	var spliter = _spliter || "&";
	var haveQuery = false;
	if (url.indexOf("?") != -1) {
		var urlParams = url.split("?")[1];
		if (urlParams.indexOf(spliter) != -1) {
			urlParams = urlParams.split(spliter);
		} else {
			urlParams = [urlParams];
		}
		haveQuery = true;
	} else {
		var urlParams = [url];
	}
	if (urlParams[urlParams.length - 1].indexOf("#") != -1) {
		var urlTemp = urlParams[urlParams.length - 1].split("#");
		urlParams[urlParams.length - 1] = urlTemp[0];
		var hash = urlTemp[1];
		if (hash.indexOf(spliter) != -1) {
			hash = hash.split(spliter);
		} else {
			hash = [hash];
		}
		if (haveQuery == true) {
			urlParams = urlParams.concat(hash);
		} else {
			urlParams = hash;
		}
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

/****************************ajax请求 start**************************************/
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
	this.timeout = _timeout || 5000; //20s
	this.frequency = _frequency || 500; //10s
	this.requestTimes = _requestTimes || 1;
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";

	this.createXmlHttpRequest = function() {
		var xmlHttp = null;
		try { 
			xmlHttp = new XMLHttpRequest();
		} catch (exception) { 
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
		//iPanel.debug("[xmlHttp] method=" + this.method + "-->headers=" + _headers + "-->username=" +  this.username + "-->password=" + this.password);
		var target = this;
		var url;
		var data;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		if (this.method == "POST") { //encodeURIComponent
			url = encodeURI(this.url);
			//iPanel.debug("requestData url="+url)
			data = this.urlParameters;
			//iPanel.debug("requestData data="+data)
		} else {
			url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			data = null;
		}
		//iPanel.debug("[xmlHttp] username=" + this.username + "-->xmlHttp=" + this.xmlHttp + "typeof(open)=" + typeof(this.xmlHttp.open));
		if (this.username != "") {
			this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
		} else {
			this.xmlHttp.open(this.method, url, this.async);
		}
		//iPanel.debug("[xmlHttp] method=" + this.method + "-->url=" + url + "-->async=" + this.async);
		var contentType = false;
		if (this.headers != null) {
			for (var key in this.headers) {
				if (key.toLowerCase() == "content-type") {
					contentType = true;
				}
				//iPanel.debug("common__contentType=" + contentType);
				this.xmlHttp.setRequestHeader(key, this.headers[key]);
			}
		}
		if (!contentType) {
			//iPanel.debug("[xmlHttp] setRequestHeader");
			this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			//this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
			//this.xmlHttp.setRequestHeader("Content-type","application/xml;charset=utf-8")
		}
		if (this.charset != null) { //要使用responseXML就不能设置此属性
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		//iPanel.debug("[xmlHttp] " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
	};
	this.stateChanged = function() { //状态处理
		if (this.xmlHttp.readyState < 2) {
			//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		} else {
			//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) {
			this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);
		} else if (this.xmlHttp.readyState == 3) {
			if (this.xmlHttp.status == 401) {
				//iPanel.debug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {
			this.frame.clearTimeout(this.timer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
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
				//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
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
			//iPanel.debug("[xmlHttp] request again");
			target.counter++;
			target.requestData(target.method, target.headers, target.username, target.password);
		}, this.frequency);
	};
	this.requestAbort = function() {
		//iPanel.debug("[xmlHttp] call abort");
		this.frame.clearTimeout(this.timer);
		this.xmlHttp.abort();
		//iPanel.debug("[xmlHttp] call abort has called");
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
	
}
/****************************ajax请求 end**************************************/
/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
function showList(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? parent.mainFrame : __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;
	this.position = typeof(__position)=="undefined" ? 0 : __position;  
	this.focusPos = 0;      
	this.lastPosition = 0;
	this.lastFocusPos = 0;
	this.tempSize = 0;
	this.infinite = 0;
	
	this.fixedPos = Math.floor((this.listSize-1)/2);
	
	this.pageStyle  = 0;
	this.pageLoop   = null;
	this.showLoop   = null;
	this.focusLoop  = null;
	this.focusFixed = null;
	this.focusVary  = 1;
	this.focusStyle = 0;
	
	this.showType = 1;
	this.listSign = 0;
	this.listHigh = 30;
	this.listPage = 1;
	this.currPage = 1;
	
	this.focusDiv = -1;
	this.focusEvent = false;
	this.focusPlace = new Array();
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;
	
	this.haveData = function(){};
	this.notData = function(){};
	
	this.focusUp  = function(){this.changeList(-1);};
	this.focusDown= function(){this.changeList(1); };
	this.pageUp   = function(){this.changePage(-1);};
	this.pageDown = function(){this.changePage(1); };
	
	this.startShow = function(){
		this.initAttrib();
		this.setFocus();
		this.showList();
	}
	this.initAttrib = function(){	
		if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";
		if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;
				
		if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;
		if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;
		if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;
		if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;
		if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;
		
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
	this.initFocus = function(){
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
		if(this.showType == 0){
			this.focusPos = this.position%this.listSize;
		}else if(!this.focusFixed&&!this.showLoop){
			var tempNum = this.position-this.focusPos;
			if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
		}
	}
	this.initPlace = function(){
		var tmph = this.listHigh;
		var tmpp = [this.startPlace];		
		for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
		this.focusPlace = tmpp;
	}
	this.changeList = function(__num){
		if(this.dataSize==0) return;
		if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
		this.changePosition(__num);
		this.checkFocusPos(__num);
	}
	this.changePosition = function(__num){
		this.infinite += __num;
		this.lastPosition = this.position;	
		this.position = this.getPos(this.infinite, this.dataSize);
	}
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
			
			var tempNumUp = __num*this.fixedPos;
			var tempNumDown = __num*(this.listSize-1-this.fixedPos);
			
			if(this.focusPos+__num<0||this.focusPos+__num>this.listSize-1||this.focusFixed){				
				this.showList();
			}else if(this.showType==2&&!this.showLoop&&Math.abs(__num)==1&&((this.focusPos+__num==0&&this.position!=0)||(this.focusPos+__num==this.listSize-1&&this.position!=this.dataSize-1))){
				this.showList();
			}else if(this.showType==3&&!this.showLoop&&Math.abs(__num)==1&&((this.focusPos+tempNumUp==0&&this.lastPosition+tempNumUp!=0)||(this.focusPos+tempNumDown==this.listSize-1&&this.lastPosition+tempNumDown!=this.dataSize-1))){
				this.showList();
			}else{
				this.changeFocus(__num);
			}
		}		
	}
	this.changeFocus = function(__num){
		this.lastFocusPos = this.focusPos;
		this.focusPos += __num;
		this.setFocus(__num);
	}
	this.setFocus = function(__num){
		if(typeof(this.focusDiv)=="number") return;
		var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));
		if(typeof(this.focusDiv)=="string"){
			this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos]+"px";
		}else if(typeof(__num)=="undefined"||tempBool){
			this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
			if(this.focusEvent){
				this.focusDiv.onMoveStart();
				this.focusDiv.onMoveEnd();
			}
		}else if(__num!=0){
			this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
		}
	}	
	this.changePage = function(__num){	
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;
		if(this.showLoop){
			if(isBeginOrEnd&&!this.pageLoop) return;
			var tempNum = this.listSize*__num;
			if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
				this.changePosition(this.focusPos*-1);
				this.checkFocusPos(this.focusPos*-1);
			}
			this.changePosition(tempNum);
			this.checkFocusPos(tempNum);
		}else{
			if(this.dataSize<=this.listSize) return;
			if(this.showType==0){
				if(isBeginOrEnd&&!this.pageLoop) return;
				var endPageNum = this.dataSize%this.listSize;
				var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;
				var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;		
				var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize; 
				overNum = this.pageStyle==0 ? overNum : this.focusPos;
				tempNum = tempNum*__num-overNum;				
				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				var tempPos   = this.position-this.focusPos;
				var tempFirst = this.dataSize-this.tempSize;
				if(tempPos+__num<0||tempPos+__num>tempFirst){
					if(!this.pageLoop) return;
					tempPos = __num<0 ? tempFirst : 0;
				}else{
					tempPos += this.tempSize*__num;
					if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
				}		
				var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);
				this.changePosition(tempPos-this.position+tempNum); 
				this.showList();
			}
		}
	}
	this.showList = function(){
		var tempPos = this.position-this.focusPos;
		for(var i=tempPos; i<tempPos+this.listSize; i++){		
			var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };
			(i>=0&&i<this.dataSize)||(this.showLoop&&this.dataSize!=0) ? this.haveData(tempObj) : this.notData(tempObj);
		}
		if(this.dataSize == 0) this.currPage =0;
		else this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.listPage = Math.ceil(this.dataSize/this.listSize);
	}
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
 +------------------------------------------------------------------------------
 * 多行多列对象
 +------------------------------------------------------------------------------
	var parmObj = {
		DivId:     "L",            //行DIV的ID名称   
		focusId:   "focus",        //焦点的ID
		arrLength: listArr.length, //数据总长度
		row:       4,              //行数
		list:      5,              //列数
		rowHeight: 60,             //行高
		listWidth: 115,            //列宽
		focusX:    158,            //显示的第一行焦点X轴坐标
		focusY:    65,              //显示的第一行焦点X轴坐标
		direction: "top"       //方向 top 纵向 left 横向
	};
 +------------------------------------------------------------------------------
*/
function tableSpan(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.focusPos = 0;//焦点的位置
	this.row = _parmObj.row;//显示的行数
	this.list = _parmObj.list;//列数
	this.rowHeight = _parmObj.rowHeight;//焦点移动的行高
	this.listWidth = _parmObj.listWidth;//焦点移动的列宽
	this.recordLdiv = []; //行移动后重新标记位置；
	this.duration = "100ms";
	this.startline = 0;//起始行 从0开始数，默认为0
	this.endline   = _parmObj.row-1;//其实列 从0开始数,默认为最后一行
	this.focusStart = [_parmObj.focusX,_parmObj.focusY+this.rowHeight*this.startline];//焦点开始的坐标
	this.listPos = this.list*this.startline;//数据的位置
	this.startPos = this.listPos-(this.focusPos+this.startline*this.list);//当前页，数据开始位置,用于焦点定位
	this.focusPosition = [];//焦点位置的坐标
	this.focusObj = this.$(_parmObj.focusId); //所要滑动的对象；
	this.rowDivName = _parmObj.DivId; //行DIV的ID名
	this.arrLength = _parmObj.arrLength;//数据总长度
	
	if(typeof _parmObj.direction == "undefined"){
		this.direction = "top";
	}else{
		this.direction =  _parmObj.direction;
	}
	
	this.firstDivTop = this.$(this.rowDivName+0).style[this.direction]; //第一个DIV的位置
	iDebug("--this.rowHeight:"+this.rowHeight);
	iDebug("--this.$(this.rowDivName+0).style[this.direction]:"+this.$(this.rowDivName+0).style[this.direction]);
	this.topDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction])-this.rowHeight+"px"; //移动行DIV最上面的位置；
	iDebug("--this.topDivTop:"+this.topDivTop);
	this.bottomDivTop = this.$(this.rowDivName+this.row).style[this.direction];//移动行DIV最下面的位置；
	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
	
	/*生成焦点位置坐标的数组*/
	this.initPosition = function(_initX,_initY,_spacingX,_spacingY,_focusRow,_focusList){
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i] = [];
		}
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i][0] = _initX + (i%_focusList)*_spacingX;
			this.focusPosition[i][1] = _initY + parseInt(i/_focusList)*_spacingY;
		}
	}
	/*初始化输出信息*/
	this.initInfo = function(){
		//清除所有信息
		for(var i=0;i<this.row+1;i++){
			for(var j=0;j<this.list;j++){
				this.notData(i,j,this.startPos);
			}
		}
		//还原DIV位置、创建最初的DIV顺序
		for(var i=0;i<this.row+1;i++){
			this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
			this.$(this.rowDivName+i).style[this.direction] = this.firstDivTop + this.rowHeight*i;
			this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration;
			this.recordLdiv[i]=i;
		}
		//输出信息
		this.startPos = this.listPos-(this.focusPos+this.startline*this.list);
		for(var i=0;i<this.row;i++){
			for(var j=0;j<this.list;j++){
				if(this.startPos>this.arrLength-1)return;
				if(this.startPos>=0)this.haveData(i,j,this.startPos);
				this.startPos++;
			}
		}
	}
	/*行DIV移动*/
	this.moveLdiv = function(_num){
		iDebug("this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]:"+this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]);
		iDebug("this.bottomDivTop:"+this.bottomDivTop);
		iDebug("this.topDivTop:"+this.topDivTop);
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] = _num>0?this.bottomDivTop:this.topDivTop;
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = this.duration;
		for(var i=0;i<this.row+1;i++){
			$(this.rowDivName+i).style[this.direction] = parseInt($(this.rowDivName+i).style[this.direction] ) - _num*this.rowHeight+"px";
		}
		
	}
	/*行移动后重新标记位置*/
	this.reLdiv = function(_num){
		if(_num>0){
			var temp = this.recordLdiv[0];
			this.recordLdiv.shift();
			this.recordLdiv.push(temp);
		}
		else {
			var temp = this.recordLdiv[this.recordLdiv.length-1];
			this.recordLdiv.pop();
			this.recordLdiv.unshift(temp);
		}
	}
	/*输出将要出现行的数据*/
	this.showLine = function(_num){
		var temp = (_num>0)?(this.row-this.endline-1):(-this.startline);//当前行和输出行的差；
		var position = (parseInt((this.listPos+this.list+temp*this.list)/this.list)-1)*this.list;//当前行的第一个	
		for(var i=0;i<this.list;i++){
			if(position+i<this.arrLength&&position+i>=0){
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
			else {
				this.notData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
		}
	}
	//******************************移动焦点的函数********************
	this.changeFocus =  function(_num){
		var tempPos = this.listPos;
		var tempFocusPos = this.focusPos;
		this.listPos += _num;
		this.focusPos += _num;
		if(this.focusPos>this.arrLength-1&&this.focusPosition.length >= this.arrLength){
			this.focusPos = tempPos;
			this.listPos = tempFocusPos;
		}
		else if(this.focusPos<0){
			this.focusPos = _num==-1?this.list-1:tempFocusPos;
			if(tempPos+_num<0){this.listPos = tempPos;this.focusPos=tempFocusPos;return;}
			this.showLine(-1);
			this.moveLdiv(-1);
			this.reLdiv(-1);
		}
		else if(this.focusPos>this.focusPosition.length-1){
			this.focusPos = _num==1?this.focusPos-this.list:tempFocusPos;
			if(tempPos+_num>this.arrLength-1){
				var allRow = parseInt((this.arrLength-1+this.list)/this.list);//总共多少页
				var currRow = parseInt((tempPos+this.list)/this.list);//原所在的行
				if(allRow==currRow){
					this.listPos = tempPos;
					this.focusPos = tempFocusPos;
					return;
				}
				this.listPos = this.arrLength-1;
				this.focusPos = this.focusPosition.length-(this.list-this.listPos%this.list);
			}
			this.showLine(1);
			this.moveLdiv(1);
			this.reLdiv(1);
		}
		else if(this.listPos>this.arrLength-1){
			this.listPos = this.arrLength-1;
			this.focusPos = this.focusPosition.length-(this.list-this.listPos%this.list);
		}
		this.onfocus();
	}
	//获取焦点
	this.onfocus = function(){
		if(this.direction == "left"){
			this.focusObj.style.top = this.focusPosition[this.focusPos][0]+"px";
		}else if(this.direction == "top"){
			this.focusObj.style.left = this.focusPosition[this.focusPos][0]+"px";
		}
		this.focusObj.style[this.direction] = this.focusPosition[this.focusPos][1]+"px";
	}
	
	this.currId = function(){
		//寻找当前焦点对应的ID ，返回一个对象:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list)];
		currIdArr._i = this.focusPos%this.list;
		return currIdArr;
	}
	
	this.currIdTemp = function(){
		//寻找当前焦点对应的ID ，返回一个对象:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list-1)];
		currIdArr._i = this.focusPos%this.list;
		//add(this.recordLdiv)
		//add(currIdArr._div)
		return currIdArr;
	}
	
	//初始化数据
	this.init = function(){
		if(this.arrLength <= this.list*this.endline){
			this.startline=0;
			this.focusStart = [];
			this.listPos = this.focusPos;
		}
		this.focusStart = [_parmObj.focusX,_parmObj.focusY+this.rowHeight*this.startline];
		this.startPos = this.listPos-(this.focusPos+this.startline*this.list);
		this.initPosition(this.focusStart[0],this.focusStart[1],this.listWidth,this.rowHeight,this.endline-this.startline+1,this.list);
		this.initInfo();
	}
}
//数据缓存封装
function hashTableClass(_maxLength) {
	/**
	 * 仿写java中的hashmap对象，进行数据缓存
	 * @_maxLength：整型，缓存条目数量
	 */
	this.maxLength = typeof(_maxLength) == "undefined" ? 50 : _maxLength;

	this.hash = new Object();
	this.arry = new Array(); //记录条目数量

	this.put = function(_key, _value, _notCover) {
		/**
		 * @_key：字符串型
		 * @_value：不限制类型
		 * @_notCover：布尔型，设定为真后不进行覆盖
		 */
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
		
		//iPanel.debug("common put _key="+_key);
		//iPanel.debug("common put _value="+_value);
		this.hash[_key] = typeof(_value) == "undefined" ? null : _value;
		//iPanel.debug("common put this.hash[_key]="+this.hash[_key]);
		
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
	//this.count = function() {var i = 0; for(var key in this.hash) {i++;} return i;};
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
var hashTableObj = new hashTableClass(200);
var tool = {
	isiPanel:(navigator.appName.indexOf("iPanel") != -1)?true:false, 
	checkTimes:0,
	maxCheckTimes:100,
	
	
	//字符串补位
    addZero:function (str, format){
        str = str +"";
        var len = format.length;
        return format.substring(0, len-str.length)+str;
    },
	//获取汉字的长度，一个汉字算两个字节
	getCharacterLength:function(_str){
		var _str = _str.replace(/[\(\)\-\\\[\]]/g, "0");
		if(this.isiPanel && !isAdvanceFlag){	//advance不走这里面
			var re = /[^\u2E80-\uFE4F]+/gi;		//iPanel匹配中文不一样，要加个非判断
		}else{
			var re = /[\u2E80-\uFE4F]+/gi;
		}
		
		var bb = _str.match(re);
		if(typeof bb == "undefined" || bb == "null"){
			return _str.length; 
		}
		var cc = "";
		if(bb!=null){
			cc = bb.join("");  
		}
		var totalLen = _str.length;
		var chLen = cc.length;
		var engLen = totalLen - chLen;
		var tW = chLen*2+engLen;
		//1121 处理两个< >，在页面显示时，这两个括号其实一起是占两个中文字大小的
		/*var strLeft=_str.indexOf("<",0);
		if(strLeft!=-1){
			tW+=1;
		}
		var strRight=_str.indexOf(">",0);
		if(strRight!=-1){
			tW+=1;
		}*/
		
		//1222 W,M英文大写也算是一个汉字  数字: 48-57 小写字母: 97-122 大写字母: 65-90
		for(var i=0;i<totalLen;i++){
			if((_str[i]==">")||(_str[i]=="<")||(_str.charCodeAt(i)>=65&&_str.charCodeAt(i)<=90)){
				tW+=1;
			}
		}
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
            var son_str = stbr.charAt(i);
            encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
            if (char_length >= len){
                var sub_len = char_length == len ? i+1 : i;
                return stbr.substr(0, sub_len);
                break;
            }
        }
		
		return stbr.substr(0, len);//@pengjiao 2014/7/29 修改节目名称分析规则中为undefined
    },
	toDate: function (time){
		iDebug("--yanch todate--init")
		var temp = time;
		//var temp=tmp+"";
		var mon = temp.substring(4,6);
		var dat = temp.substring(6,8);
		var str = mon+"-"+dat;
		return str;
		
	},
	//返回 2014-02-02或是 02-02
	changeToDate:function (time, flag){
		var tmp = parseInt(time);
		//var newTmp = new Date().getTime()-tmp;
		var d = new Date(tmp);
		iDebug(d);
		var t0 = this.addZero((d.getMonth()+1),"00");
		var t1 = this.addZero(d.getDate(),"00");
		//var str = /*d.getFullYear()+"-"*/+t0+"-"+t1+" "+this.addZero(d.getHours(),"00")+":"+this.addZero(d.getMinutes(),"00");
		if(typeof flag != "undefined"){
			var str = d.getFullYear()+"-"+t0+"-"+t1;	
		}else{
			var str = t0+"-"+t1;	
		}
		iDebug(str)
		return str;
	},
	//将毫秒数转换成date对象
    changeToFullDate:function (time){
        var tmp = time||0;
        var newTmp = new Date().getTime()-tmp;
        var d = new Date(newTmp);
        var str = d.getFullYear()+"-"+this.addZero((d.getMonth()+1),"00")+"-"+this.addZero(d.getDate(),"00");
        return str;
    }
};
/******************************获取剧集信息*********************
_id： 剧集id
_listLabel:所属栏目id
***************************************************************/
function getSeriseInfo(_id,_listLabel){
		if (ajaxObjSeries == null) {
		ajaxObjSeries = new ajaxClass();
		ajaxObjSeries.frame = window;
	} else {
		ajaxObjSeries.requestAbort();
	}
	ajaxObjSeries.frequency = 1000;  //请求失败后隔多长时间重新请求一次 
	ajaxObjSeries.requestTimes = 1;   //请求失败后重新请求多少次
	ajaxObjSeries.successCallback = function(_xmlHttp, _params) {
		iDebug("yanch getSeriseInfo success")
		var jsonData = _xmlHttp.responseText;
		var result_data_info = eval("(" + jsonData + ")");
			showSeriesPop(result_data_info,_id,_listLabel)
			
	};
	ajaxObjSeries.failureCallback = function(_xmlHttp, _params) {
		iDebug("yanch getSeriseInfo fail")
	};
	//修改字段名称
	ajaxObjSeries.url=[slaveAddr+"/media/series/get_info?accesstoken="+access_token+"&pageidx=1&pagenum=200&postersize=320x400|500x280&&seriesid="+_id,"data/rec.js"] [DEBUG]
	iDebug("common.js getSeriseInfo ajaxObjSeries.url ="+ajaxObjSeries.url);
	ajaxObjSeries.requestData("GET");
}
/******************************剧集弹出框*********************
_res： 点播剧集数据
_seriesid： 剧集id
_listLabel:所属栏目id
***************************************************************/
function showSeriesPop(_res,_seriesid,_listLabel){
	iDebug("yanch common showSeriesPop--init")
	var newFlag = 0; //默认为连续剧格
	var epgInfoList = _res;
	if(epgInfoList.video_list != null && typeof epgInfoList.video_list == "undefined") return;
	var popArr = [];
	var leng = epgInfoList.video_list.length;
	for(var i=0;i<leng;i++){
		var tmpObj = epgInfoList.video_list[i];
		var tmp = popArr[i] = {
			id:tmpObj.video_id,
			program_id:tmpObj.video_id,
			//name:tmpObj.video_name,
			program_name:tmpObj.video_name,
			name:tmpObj.series_idx,
			num:tmpObj.series_idx,
			type:"sd",//不知道这个还有什么用
			start_time:"", 
			end_time:"",
			is_view:tmpObj.is_view?tmpObj.is_view:0,//是否看过这一集
			video_desc:tmpObj.video_desc?tmpObj.video_desc:"",
			last_viewed_time:tmpObj.last_viewed_time?tmpObj.last_viewed_time:0,//最后一次看的时间
			update_time:tmpObj.update_time?tmpObj.update_time:0 ,//集数更新的时间
			url:tmpObj.video_url,//这个是数组，后面考虑换掉
		}	
		 var tempdate=tmp.name+"";
		iDebug("comAjaxRequest.js---fun seriesGetInfo()----epgInfoList.idx_type:"+epgInfoList.idx_type);
		if(tempdate.length == 8){
			iDebug("-------in---综艺期数-tempdate11:"+tempdate);
			//var str = tool.toDate(tempdate+"000");
			var temp = tempdate+"000";
		//var temp=tmp+"";
		var mon = temp.substring(4,6);
		var dat = temp.substring(6,8);
		var str = mon+"-"+dat;
			iDebug("---yanch str="+str)
			tempdate = str;
			tmp.name =tempdate;
			iDebug("search.js-----kongwm---------tmp.name="+tmp.name);
			newFlag = 3;	//点播中的综艺节目播放
		}else if(epgInfoList.idx_type==1&&typeof epgInfoList.extend_content!="undefined"&&epgInfoList.extend_content!=""){
			iDebug("yanch getseries 1")
			var tempObj = eval('('+epgInfoList.extend_content+')');	
			iDebug("yanch getseries 2 ="+tempObj)
			if(typeof tempObj!="undefined"&&tempObj!=""&& typeof tempObj.showtype!="undefined"&&tempObj.showtype!=""){//为该片花在视频上传中的媒资id
				iDebug("--myFav.htm---fun getAppDetail---tempObj.showtype:"+tempObj.showtype);
				var str = tempObj.showtype.substr(2)
				iDebug("yanch str str="+str)
				tmp.name = "第"+tempdate+str;
				iDebug("search.js111111111-----kongwm---------tmp.name="+tmp.name);
				newFlag = 3;	//点播中的综艺节目播
			}
		}
		 iDebug("comAjaxRequest.js---fun seriesGetInfo()-- tmp.name="+tmp.name);
	}
		if(newFlag == 3) {//将最新的一集放在第一个
			var tempPopLen=Math.ceil(popArr.length/2);
			var popLen=popArr.length-1;
			for(var i=0;i<tempPopLen;i++,popLen--){
				//交换位置
				var popTemp=popArr[i];
				popArr[i]=popArr[popLen];
				popArr[popLen]=popTemp;
			}
	 }
	var tmpData ={};
	tmpData.isType = "vod",//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的)
	tmpData.url = "";//不知道这个还有什么用
	tmpData.channelId = "";////不知道这个还有什么用
	tmpData.textArr = [epgInfoList.series_name,""];//数组里面为节目名，频道名			
	iDebug("===0===epgInfoList.series_desc:"+epgInfoList.series_desc);			
	tmpData.programeDesc =  epgInfoList.series_desc;
	iDebug("=getSeries==0===epgInfoList.poster_list.dir:"+epgInfoList.series_poster_list.dir);
	iDebug("==getSeries=0===epgInfoList.poster_list.list:"+epgInfoList.series_poster_list.list["320x400"]);
	tmpData.posterPic = "";
	tmpData.lastViewedIdx = epgInfoList.last_viewed_idx?epgInfoList.last_viewed_idx:0;//最后一次看到的集数
	if(typeof epgInfoList.series_poster_list!="undefined"&&typeof epgInfoList.series_poster_list.dir!="undefined"&&epgInfoList.series_poster_list.dir!=""&&typeof epgInfoList.series_poster_list.list!="undefined"){
		iDebug("==getSeries=0===epgInfoList.poster_list.list:"+epgInfoList.series_poster_list.list["320x400"]);
		tmpData.posterPic = epgInfoList.series_poster_list.dir + epgInfoList.series_poster_list.list["320x400"];
	}
	var listLabel = _listLabel||"";
	tmpData.totalNum = popArr.length;
	tmpData.data = popArr;
	var currUrl = top.window.location.href;
	if(currUrl.indexOf("?")!=-1){currUrl = currUrl.split("?")[0];}
	iDebug("--------currUrl = "+currUrl);
	if(typeof top.navPos!="undefined"){
		var url = top.window.location.href;
		if(url.indexOf("?")!=-1){url = url.split("?")[0];}
		iDebug("--detail.htm-2-classIsPurchasedAndAttribute--url:"+url);
		currUrl = url+"?navPos="+top.navPos+"&selectNavPos="+top.selectNavPos+"&focusPos="+listObj.focusPos+"&dataPos="+listObj.listPos;
	}
	tmpData.backUrl = currUrl;
	tmpData.seriesId = _seriesid;
	tmpData.listLabel=listLabel;	
	iDebug("2017/6/16 comAjaxRequest.js ---showSeriesPop---- tmpData.listLabel ="+tmpData.listLabel);
	// 什么时候是新闻，什么时候是连续剧，什么时候是综艺 目前陈恋的接口定义按分类来判断。
	var _url = "popTv.php";
	var isNewPortalFlag = navigatorFlag=="iPanel"?iPanel.eventFrame.isNewPortalFlag:1;
	if(newFlag == 0){
		var  _url = "popTv_new.php";
		window.showPop(_url, function(id){
			iDebug("search.js 111111111111id ="+id);
			iDebug("search.js 111111111111tmpData ="+tmpData);
			iDebug("search.js 111111111111tmpData ="+JSON.stringify(tmpData));
			window.frames[id].modifyData(tmpData);
		});	
	}else if(newFlag ==3){
		var _url = "popVariety_new.php";
		window.showPop(_url, function(id){
			iDebug("search.js 33333333id ="+id);
			window.frames[id].modifyData(tmpData);
		});	
	}
}
function videoGetInfo(_videoId,_callbackFun){
		if (ajaxObjSeries == null) {
		ajaxObjSeries = new ajaxClass();
		ajaxObjSeries.frame = window;
	} else {
		ajaxObjSeries.requestAbort();
	}
	ajaxObjSeries.frequency = 1000;  //请求失败后隔多长时间重新请求一次 
	ajaxObjSeries.requestTimes = 1;   //请求失败后重新请求多少次
	ajaxObjSeries.successCallback = function(_xmlHttp, _params) {
		iDebug("yanch videoGetInfo success")
		var jsonData = _xmlHttp.responseText;
		result_video_info = eval("(" + jsonData + ")");
		if (result_video_info.ret == 0) {
			result_video_info.type = 2;
			_callbackFun(result_video_info,_videoId);
		} else {
			ajaxErrorInfo("获取video点播信息失败！", result_video_info.ret);
		}
			
	};
	ajaxObjSeries.failureCallback = function(_xmlHttp, _params) {
		iDebug("yanch videoGetInfo fail")
	};
	//修改字段名称
	ajaxObjSeries.url=slaveAddr+"/media/video/get_info?accesstoken="+access_token+"&verifycode="+deviceid+"&postersize=500x280&videoid="+_videoId;
	iDebug("common.js getmediaInfo ajaxObjSeries.url ="+ajaxObjSeries.url);
	ajaxObjSeries.requestData("GET");
}


//返回字符串汉字长度 英文或特殊字符两个相当于一个汉字
/*
 *str:传入的字符串
 *len:字符串的最大长度,汉字的长度
 *返回截取的字符串
 */
function getStrChineseLen(str,len,suffix){
	var w = 0;
	str = str.replace(/[ ]*$/g,"");
	if(getStrChineseLength(str)>len){
		for (var i=0; i<str.length; i++) {
			 var c = str.charCodeAt(i);
			 var flag = 0;
			 //单字节加1
			 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			   w++;
			   flag = 0;
			 }else {
			   w+=2;
			   flag = 1;
			 }
			 if(parseInt((w+1)/2)>len){
				if (flag == 1)return str.substring(0,i-1)+suffix;//修改,sunny,防止换行...
				else return str.substring(0,i-1)+suffix;
				break;
			 }
		 
		} 
	}
	return str; 
}

function getStrChineseLength(str){
	iDebug("yanch homedconfig getStrChineseLength str="+str+";type="+typeof str)
	str = str.replace(/[ ]*$/g,"");
	var w = 0;
	for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
     //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       w++;
     }else {
       w+=2;
     }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
  
}

function gotoUrl(_url){
	window.location.href = _url;
}

function setGlobalVar(_name, _value){//设置全局变量
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.setGlobalVar(_name, _value);
	}
	else{
		var b1 = JSON.stringify(_value);
		sessionStorage.setItem(_name, b1);
	}
}

function getGlobalVar(_name){//获取全局变量
	if(navigator.appName.indexOf("iPanel") != -1){
		return iPanel.getGlobalVar(_name);
	}
	else{
		return JSON.parse(sessionStorage.getItem(_name));
	}
}

function delGlobalVar(_name){//删除全局变量
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.delGlobalVar(_name);
	}
	else{
		sessionStorage.removeItem(_name);
	}
}
function getBackUrl(currUrl){
			if(!currUrl) currUrl = window.location.href;
			var startPos = currUrl.lastIndexOf("/")+1;
			var endPos = currUrl.indexOf("?");
			if(endPos<startPos) endPos = currUrl.length;
			var tmpUrl = getGlobalVar(currUrl.substring(startPos,endPos));
			iDebug("getBackUrl()--clobalobj.js-name="+currUrl.substring(startPos,endPos)+",backUrl="+tmpUrl);
			return tmpUrl;
}

/*
*@author: huangjm 2012.12.24
*@desc:	主要用记全局变量，iPanel是用eventFrame来记，webkit内核用window.localStorage来记，其它用cookie来记
*/
(function(){
	var globalPos=function(){
		this.index = "";
		/**************取得当前的浏览器版本*******************/
		this.getBrowser=function(){
			var tmp = "";
			var str = navigator.appName;
			if(str.indexOf("iPanel") != -1){
				tmp = "iPanel";
			}else if(str.indexOf("Miscrosoft") != -1){
				tmp = "Miscrosoft";
			}else if(str.indexOf("Google") != -1){
				tmp = "Google";
			}else if(str.indexOf("Netscape")!= -1){
				tmp = "Netscape";
			}else if(str.indexOf("Opera")!=-1){
				tmp="Opera";
			}
			return tmp;
		};
		
		/**************设置全局变量*******************/
		this.set = function(){
			var index = arguments[0]+"";
			var value = arguments[1]+"";
			value = value.replace("|", "#0#0#");
			//console.log("----index="+index+"--value="+value)
			this.index = index;
			if(this.getBrowser()=="iPanel"){
				if(typeof iPanel.eventFrame.__globalPos == "undefined"){
					iPanel.eventFrame.__globalPos={};
				}
				iPanel.eventFrame.__globalPos[index] = value;
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					storage[index]=value;
				}else{
					this.setCookie(index, value);
				}
			}
		};
		
		/**************获取全局变量*******************/
		this.get = function(){
			var index=arguments[0];
			var str = "";
			var tmp = "";
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					str = iPanel.eventFrame.__globalPos[index];	
					tmp = str;
				}
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					str = storage[index];
					if(typeof str != "undefined") tmp = str;
				}else{
					str= this.getCookie(index);
					if(str.indexOf("|") != -1){
					  tmp = str.replace("#0#0#", "|");
					}
					tmp = str;
				}
			}	
			//var tmp  = decodeURI(str);
			return tmp;
		};
		
		/****************重置变量*****************/
		this.reset=function(){
			var index=arguments[0];
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					iPanel.eventFrame.__globalPos[index] = "";	
				}
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					storage[index]="";
				}else{
					this.delCookie(index);
				}
			}	
		};
	
		/***********设定Cookie值***************/
		this.setCookie=function(name, value){
			var expdate = new Date();
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : 5*12*30*24*60*60;
			var path = (argc > 3) ? argv[3] : "/";
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
			var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
			document.cookie = name + "=" + escape(value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
			+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
			+((secure == true) ? "; secure" : "");
		};
		
		/**********获得Cookie解码后的值**************/
		this.getCookie=function(_name){
			var url = document.cookie;
			if(new RegExp(".*\\b"+_name+"\\b(\\s*=([^&;]+)).*", "gi").test(url)){
				return unescape(RegExp.$2);
			}else{
				return "";
			}
		}
	
		 /**********删除Cookie**************/
		this.delCookie=function(name){
			var exp = new Date();
			exp.setTime (exp.getTime() - 1);
			var cval = this.getCookie(name);
			document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
		}
		this.setBackUrl=function(toUrl,currUrl){
			var startPos = toUrl.lastIndexOf("/")+1;
			var endPos = toUrl.indexOf("?");
			if(endPos<startPos) endPos = toUrl.length;
			this.set(toUrl.substring(startPos,endPos),currUrl);
			iDebug("setBackUrl()---name="+toUrl.substring(startPos,endPos)+",value="+currUrl);
		}
		this.getBackUrl=function(currUrl){
			if(!currUrl) currUrl = window.location.href;
			var startPos = currUrl.lastIndexOf("/")+1;

			var endPos = currUrl.indexOf("?");
			iDebug("getBackUrl()---currUrl="+currUrl+",startPos="+startPos+",endPos="+endPos+",startPos="+startPos);
			if(endPos<startPos) endPos = currUrl.length;
			var tmpUrl = this.get(currUrl.substring(startPos,endPos));
			iDebug("getBackUrl()---name="+currUrl.substring(startPos,endPos)+",backUrl="+tmpUrl);
			return tmpUrl;
		}
	};		
	
	GP = new globalPos();
})();
/*------------数据采集------------*/
/**
 * [collect 数据采集]
 */
var collectData = {
    T: "",
    ID: "",
    PT: "",
    P: "",
    A: "",
    PA: ""
}; 
function collect(_type, _id, _Parenttype,_Parentid, _action) {
    iDebug("education---collect()--- _type = " + _type + " _id = " + _id + " _name = " + _name + " _action = " + _action);
    if (!tvRate) tvRate = new rate();
    collectData.T = typeof _type == "undefined" ? null : _type;
    collectData.ID = typeof _id == "undefined" ? null : _id;
    collectData.PT = typeof _Parenttype == "undefined" ? null : _Parenttype;
    collectData.P = typeof _Parentid == "undefined" ? null : _Parentid;
    collectData.A = typeof _action == "undefined" ? null : _action;
    tvRate.postRate("education", collectData);
}
var collectSearchData = {
    K: "",
    A: "",
    C: "",
    R: ""
}; 
function collectSearch(_keyWord,_area,_type,_result) {
	iDebug("education---collect()--- _keyWord = " + _keyWord + " _area = " + _area + " _type = " + _type + " _result = " + _result);
	if (!tvRate) tvRate = new rate();
	collectSearchData.K = typeof _keyWord == "undefined" ? null : _keyWord;
	collectSearchData.A = typeof _area == "undefined" ? null : _area;
	collectSearchData.C = typeof _type == "undefined" ? null : _type;
	collectSearchData.R = typeof _result == "undefined" ? null : _result;
	tvRate.postRate("search", collectSearchData);
	}