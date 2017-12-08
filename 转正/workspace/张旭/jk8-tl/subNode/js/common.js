var BrowserType = getBrowserType();	//���������
var IPANEL30 = checkIPANEL30();	//�Ƿ�Ϊipanel 3.0�������
//������Ϣ���� ��ֹ��EVENT.STOP  ͬ�㣺EVENT.ADVECTED  ��һ�㣺EVENT.DOWN
var EVENT = {STOP:false, DOWN:true, ADVECTED:true};
if(IPANEL30){
	EVENT = {STOP:0, DOWN:1, ADVECTED:2};	
}

function $(__id){
	return document.getElementById(__id);
}

//��ӡ����
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,2);	
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

//��ȡ������汾
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

//��⵱ǰ�Ƿ�ΪiPanel30�����
function checkIPANEL30(){
	var userAgent = navigator.userAgent.toLowerCase();
	var flag = false;	
	if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel3.0
		flag = true;
	}
	return flag;
}

/*��ȡca����*/
function getCAId(){
	var tmpCardId = "";
	if(BrowserType == "iPanel"){
		// tmpCardId = CA.card.serialNumber;
		tmpCardId = CA.card.cardId;
	}else if(BrowserType == "Inspur"){
		tmpCardId = iSTB.settings.get("sys:ca0:cardnumber");
	}	
	if(tmpCardId == "undefined" || tmpCardId == null){
		tmpCardId = "";
	}
	return tmpCardId;	
}

/*��ȡurl����*/
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

/*����ַ����Ƿ�Ϊ��Чֵ*/
function checkStrNull(_str){
	var tmpStr = "";
	if(typeof(_str) == "undefined" || _str == "null" || _str == "undefined"){
		tmpStr = "";
	}else{
		tmpStr = _str;
	}	
	return tmpStr;
}

/*�����ַ����ĺ��ֳ���*/
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

/*��ȡ�ַ���,����Ϊ���ֵĳ���*/
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
	var flag0 = 0;//���ϸ��ַ��Ƿ���˫�ֽ�
	var flag1 = 0;//�ϸ��ַ��Ƿ���˫�ֽ�
	var flag2 = 0;//��ǰ�ַ��Ƿ���˫�ֽ�
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

/*�����ַ���,����Ϊ���ֵĳ���*/
function marqueeStr(_str,_len,_flag){
	var tmpStr = checkStrNull(_str);
	if(tmpStr == "") return tmpStr;
	var marqStr = _str;
	var len = getStrChineseLength(_str);
	if(len > _len){
		if(typeof(_flag) != "undefined"){//��������ʾ��Ҫ����marquee��width����
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

/*��ȡʱ��*/
//formatTime("YYYY��MM��DD�� hh:mm:ss W");
function formatTime(formatter,d){
	var weekdays = {
		chi: ["������", "����һ", "���ڶ�", "������", "������", "������", "������"],
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
	if(dayMarker == "W"){//��д��ʾ����
		result = result.replace(dayMarker,weekdays["chi"][day]);
	}else if(dayMarker == "w"){//Сд��ʾӢ��
		result = result.replace(dayMarker,weekdays["eng"][day]);	
	}
	return result;	
}

/*ȫ�ֱ�����װ������ipanel3.0�������������*/
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

/*��ȡajax����·��*/
function getAjaxUrl() {
	var args = arguments;
	var paraLen = args.length - 1;//��Ҫ�滻�Ĳ�������
	var interfaceUrl = eval(args[0]);
	//iDebug(">>>smile common.js getAjaxUrl in... args[0]=" + args[0] + ",paraLen=" + paraLen + ",interfaceUrl=" + interfaceUrl);
	for(var i = 1; i <= paraLen; i++){
		interfaceUrl = interfaceUrl.replace(eval('/\\{'+i+'\\}/g'), args[i]);
	}
	//iDebug(">>>smile common.js getAjaxUrl out... interfaceUrl=" + interfaceUrl);
	return interfaceUrl;
}

/*Ajax�����װ*/
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
	this.requestTimes = _requestTimes || 0;//����ʧ�ܺ��Զ��ٴ�����Ĵ�����Ĭ�ϲ��Զ��ٴ�����
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";
	this.abortFlag = false;	//�Ƿ������abort�ӿڣ���׳������ڵ���abort�󴥷�onreadystatechange������readyStateΪ4���ı�����Ϊ�˱�ʾ��ǰ����ֹ���·���4�����������󷢵�4

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
		if (this.charset != null) { //Ҫʹ��responseXML�Ͳ������ô�����
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		this.xmlHttp.send(data);
	};
	this.stateChanged = function() { //״̬����
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
			if(this.abortFlag) return;	//�������Ϊ��ֹ���·���4���򲻼��������ɹ�����ʧ�ܺ���
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0){
				//���ز��Լ���|| this.xmlHttp.status == 0;
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
	this.checkStatus = function() { //��ʱ����ָ��ʱ����û�гɹ�������Ϣ����ʧ�ܴ���
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

/*HashMap��д����ҳ�滺��*/
var hashTableObj = new hashTableClass(100);
function hashTableClass(_maxLength) {
	this.maxLength = typeof(_maxLength) == "undefined" ? 50 : _maxLength;
	this.hash = new Object();
	this.arry = new Array(); //��¼��Ŀ��key
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
		if (this.arry.length >= this.maxLength) { //����Ķ��������ڹ涨���������
			var key = this.arry.shift(); //ɾ�������һ�����ݣ�����������ԭ����һ��Ԫ�ص�ֵ
			this.remove(key);
		}
	};
}


/*
 * showList��������þ��ǿ�����ҳ���б�������Ϣ���¹����л��Լ���ҳ��
 * @__listSize    �б���ʾ�ĳ��ȣ�
 * @__dataSize    �������ݵĳ��ȣ�
 * @__position    ���ݽ����λ�ã�
 * @__startplace  �б���Div��ʼλ�õ�ֵ��
 */
function showList2D(listSize,dataSize,pos,time,f){
	this.listSize = listSize;
	this.dataSize = dataSize;
	this.position = pos;
	this.focusObj = null;//����Ķ���{top:"10px",left:"10px",width:"10px",height:"10px"},{...}
	this.focusDiv = "itemFocusDiv";//�ƶ���DIV
	this.haveData = function(){};
	this.noData = function(){};
	
	this.isLoop = false; // �Ƿ�����ѭ��
	
	//����
	this.currFocus = 0;//0��this.listSize֮��
	this.currPage = 0;//��ǰҳ��
	this.maxPage = 0;//���ҳ��
	this.pageLoop = null;//�Ƿ�ѭ����ҳ��trueΪ�ǣ�falseΪ��
	this.tempSize = 0;//ʵ����ʾ���ݵĳ���
	this.time = typeof(time)=="undefined" ? "200ms":time;
     //�ڲ�����
	this.listData = [];
	this.startShow = function(){
		this.initAttrib();
		this.initData();
		if(this.dataSize ==0){
			this.$(this.focusDiv).style.visibility="hidden";
		}else{
			this.$(this.focusDiv).style.webkitTransitionDuration = "0s";
			this.$(this.focusDiv).style.top 	= this.focusObj[this.currFocus].top;
			this.$(this.focusDiv).style.left 	= this.focusObj[this.currFocus].left;
			this.$(this.focusDiv).style.width 	= this.focusObj[this.currFocus].width;
			this.$(this.focusDiv).style.height 	= this.focusObj[this.currFocus].height;
		}
		this.showList();
	}
	
	this.initAttrib = function(){
		if(this.pageLoop  == null) this.pageLoop   = this.isLoop ? true : false;
	}
	
	this.initData = function(){//��ʼ������
		this.listData = [];
		if(this.dataSize==0) return ;
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;;
		if(this.dataSize < this.listSize){
			if(this.position > this.dataSize) this.position = this.dataSize -1;
			
			for(var i=0 ;i < this.dataSize ; i++){
				this.listData[i] = i;
			}
			this.currFocus = this.position % this.listSize;
		}else if((this.position+this.listSize) > this.dataSize){//�����
			if(this.position>this.dataSize) this.position = this.dataSize -1;
			
			var tempStartPos = this.dataSize - this.listSize;
			this.currFocus = this.position - tempStartPos;
			for(var i=0,j=tempStartPos ;j< this.dataSize ; j++,i++){
				this.listData[i] = j;
			}
			
		}else{//�������м�
			this.currFocus = 0;
			var tempStartPos = this.position;
			var tempLength = this.position+this.listSize;
			for(var i=0,j=tempStartPos ;j< tempLength ; j++,i++){
				this.listData[i] = j;
			}
		}
	}
	
	this.getData = function(num){
		var tempList = this.listData;
		var temp = 0;
		if(num < 0){
			for(var i=this.listData.length-1 ; i >0  ; i--){
				this.listData[i] = this.listData[i-1];
			}
			this.listData[0] = tempList[0] +num ;
		}else{
			for(var i=0 ; i < this.listData.length -1  ; i++){
					this.listData[i] = this.listData[i+1];
			}
			this.listData[this.listData.length - 1] = tempList[this.listData.length - 1] +num ;
		}
	}
	
	this.getPageData = function(__page){
		var firstPos = 0;
		var endPos = 0;
		if(this.currPage == this.maxPage){
			firstPos = this.dataSize - this.listSize;
		}
		else{
			firstPos = (this.currPage - 1) * listSize;
		}
		endPos = firstPos + this.listSize - 1;
		this.currFocus = 0;
		this.position = firstPos;
		this.changeFocus(0);
		for(var i=firstPos,j=0;i<endPos+1;i++,j++){
			this.listData[j] = i;
		}
	}
	
	this.changeList = function(num){//����
		if(this.dataSize == 0 ) return ;
		var tempEnd = this.dataSize ;
		if(!this.isLoop){
			if(( this.position==0 && num < 0 ) || ( tempEnd-1 == this.position  &&  num >0 ) ) return ;
			
			this.position += num;
			
			 tempEnd = this.listData.length < parseInt(this.listSize) ? this.listData.length  : parseInt(this.listSize) ;
			 
			this.changeFocus(num);
			
			if(this.listData[0] > this.position || this.listData[tempEnd-1]  < this.position )
				this.getData(num);
			this.showList();
		}else {
			if( this.position==0 && num < 0 ){
				this.position = this.dataSize -1;
				tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize ;
				this.currFocus = tempEnd -1;
				var tempStartPos = this.dataSize - this.listSize <0 ? 0:(this.dataSize - this.listSize);
				
				this.currFocus = this.position - tempStartPos;
				for(var i=0,j=tempStartPos ;j< this.dataSize ; j++,i++){
					this.listData[i] = j;
				}
				this.changeFocus(0);
			}else 	if ( tempEnd-1 == this.position  &&  num >0 ){
				
				this.position = 0;
				
				var tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize ;
				for(var i = 0;i < tempEnd;i++)
					this.listData[i] = i;	
				this.currFocus = 0;
				this.changeFocus(0);
			}else {
				this.position += num;
				tempEnd = this.listData.length < parseInt(this.listSize) ? this.listData.length  : parseInt(this.listSize) ;
				this.changeFocus(num);
				if(this.listData[0] > this.position || this.listData[tempEnd-1]  < this.position )
					this.getData(num);
			}
			this.showList();
		}
	}
	
	this.changeFocus = function(num){
		
		var tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize ;
		if((this.currFocus ==0 && num <0) || (this.currFocus == tempEnd-1 && num > 0 )) return ;
		this.currFocus += num ;
	//	this.$(this.focusDiv).style.webkitTransitionDuration = this.time ;
		this.$(this.focusDiv).style.webkitTransitionDuration = "100ms";
		this.$(this.focusDiv).style.top = this.focusObj[this.currFocus].top;
		this.$(this.focusDiv).style.left = this.focusObj[this.currFocus].left;
		this.$(this.focusDiv).style.width = this.focusObj[this.currFocus].width;
		this.$(this.focusDiv).style.height = this.focusObj[this.currFocus].height;
	}
	
	this.changePage = function(__num){//��ҳ
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.maxPage;  //�жϵ�ǰ�Ƿ���ҳ��תβҳ��βҳ��ת��ҳ;
		if(isBeginOrEnd) return;
		if(this.dataSize<=this.listSize) return;
		this.currPage += __num;
		this.getPageData(this.currPage);
		this.showList();
	}
	
	this.showList = function(){
		if(this.dataSize ==0) return;
		
		var tempLen = this.listData.length;
		for(var i =0;i< this.listSize ; i++){
			if(i<tempLen){
				this.haveData({idPos:i,dataPos:this.listData[i]});
			}else{
				this.noData({idPos:i,dataPos:i});
			}
		}
		this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.maxPage = Math.ceil(this.dataSize/this.listSize);
	}
	
	this.$ = function (id){
		if(typeof(f)=="object")
			return f.document.getElementById(id);
		else
			return window.document.getElementById(id);
	}

}


/*��������װ*/
function ScrollBar(id, barId, f) {
	this.obj = null;
	this.barObj = null;
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		this.barObj = f.document.getElementById(barId);
	}
	
	this.init = function(totalNum, pageSize, maxBarLength, startPos, fixBarLen) {//���һ��������ʾ�̶��������ĳ��ȣ����Ҫ��̬����Ͳ�Ҫ��
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

/**************** URL�ӽ����װ - start ******************/
//������Щ��Ŀ�޷�����ʹ��encodeURIComponent��decodeURIComponent��������������һ�������װ
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
/**************** URL�ӽ����װ - end ******************/

function goPortal(){ // ��ת��portal��ҳ
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

function dealColumnJSURL(_str){ // ����Ŀ�б������ҳ������һ��ʱjsurl��Ҫ��ȥ�����㼶
	var newStr = _str.substring(0,_str.length - 1);
	var index = newStr.lastIndexOf("/");
	newStr = newStr.substring(0,index + 1);
	return newStr;
}

function dealColumnTitle(_str){ // ����Ŀ�б������ҳ������һ��ʱtitle��Ҫ��ȥһ���㼶
	var index = _str.lastIndexOf(">");
	var newStr = _str.substring(0,index);
	return newStr;
}