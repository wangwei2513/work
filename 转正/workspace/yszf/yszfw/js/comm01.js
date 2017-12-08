/*
 * showList��������þ��ǿ�����ҳ���б�������Ϣ���¹����л��Լ���ҳ��
 * @__listSize    �б���ʾ�ĳ��ȣ�
 * @__dataSize    �������ݵĳ��ȣ�
 * @__position    ���ݽ����λ�ã�
 * @__startplace  �б���Div��ʼλ�õ�ֵ��
 */
function showList(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //�б���ʾ�ĳ��ȣ�
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //�������ݵĳ��ȣ�
	this.position = typeof(__position)=="undefined" ? 0 : __position;  //��ǰ���ݽ����λ�ã�
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //�б���Div��ʼλ�õ�ֵ��
	this.focusPos = 0;      //��ǰ�б����λ�ã�
	this.currPage = 1;		//��ǰ�ڵڼ�ҳ
	this.focusDiv = "";		//����id
	this.listHigh = 30;		//�б���ÿ���еĸ߶ȣ����������ֻ�������(���㴦��ÿһ��ʱ��topֵ)�����磺40 �� [140,181,223,263];
	this.listSign = "top";	//ȡֵ"top"��"left"��
	this.focusLoop = false;	//�����л��Ƿ�ѭ��
	this.pageLoop = false;	//��ҳ�Ƿ�ѭ��

	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����

	//��ʼ��ʾ�б���Ϣ
	this.startShow = function(){
		this.currPage = Math.ceil((this.position + 1) / this.listSize);
		this.setFocus();
		this.showList();
	};

	this.showList = function(){
		for(var i = (this.currPage - 1) * this.listSize; i < this.currPage * this.listSize; i++){
			var list = {"idPos":i % this.listSize, "dataPos":i};
			if(i < this.dataSize){
				this.haveData(list);
			}else{
				this.notData(list);
			}
		}
	};

	this.changeList = function(__num){
		if(this.dataSize == 0) return;
		if(((this.position == 0 && __num < 0) || (this.position == this.dataSize - 1 && __num > 0)) && !this.focusLoop) return;
		this.position = (this.position + __num + this.dataSize) % this.dataSize;
		this.setFocus();
		this.checkPage();
	};

	this.setFocus = function(){
		this.focusPos = this.position % this.listSize;
		if(typeof(this.listHigh) == "number"){
			this.$(this.focusDiv).style[this.listSign] = this.focusPos * this.listHigh + this.startPlace + "px";
		}
		else if(typeof(this.listHigh) == "object"){
			this.$(this.focusDiv).style[this.listSign] = this.listHigh[this.focusPos] + "px";
		}
	};

	this.checkPage = function(){
		var tempPage = Math.ceil((this.position + 1) / this.listSize);
		if(this.currPage == tempPage) return;
		this.currPage = tempPage;
		this.showList();
	};

	this.changePage = function(__num){
		if(this.dataSize == 0) return;
		var totalPage = Math.ceil(this.dataSize / this.listSize);
		if(totalPage <= 1) return;
		var currPage = Math.floor(this.position / this.listSize) + 1;
		if(((currPage == 1 && __num < 0) || (currPage == totalPage && __num > 0)) && !this.pageLoop) return;
		if((currPage == totalPage - 1 && this.position + this.listSize > this.dataSize - 1 && __num > 0) || (currPage == 1 && __num < 0)){
			this.position = this.dataSize - 1;
		}
		else if(currPage == totalPage && __num > 0){
			this.position = 0;
		}
		else{
			this.position = (this.position + __num * this.listSize + this.dataSize) % this.dataSize;
		}
		this.setFocus();
		this.checkPage();
	};

	this.$ = function(__id){
		return this.currWindow.document.getElementById(__id);
	}
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
		//iDebug("xmlhttp------------"+xmlhttp);
		/*if(typeof charset != "undefined") {
			xmlhttp.overrideMimeType("text/html; charset=" + charset);
		}	*/
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
function $(_id){
	return window.document.getElementById(_id);
}
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,7);	//����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}
function clearDefault(){ //������ ��DVB��ݼ����غ��˳�ǿ����Ϊ��ҳ��Ӧ��ʹ��
	if(navigator.appName === "WebKit Ranger"){
		iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE",1);
		// iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE",1);
	}
}

function resumeDefault(){ //������ �ָ����غ��˳�ΪDVB��ݼ�
	if(navigator.appName === "WebKit Ranger"){
		iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE",0);
		// iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE",0);
	}
}		