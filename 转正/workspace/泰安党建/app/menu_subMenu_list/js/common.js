function $(id){
	return document.getElementById(id);
}

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
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
//*******************�����ַ������ֳ��� Ӣ�Ļ������ַ������൱��һ������ start*******************//
/*
 *str:������ַ���
 *len:�ַ�������󳤶�
 *���ؽ�ȡ���ַ���
 */
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//�ж��Ƿ���advance�汾
var tool = {
	isiPanel:(navigator.appName.indexOf("iPanel") != -1)?true:false, 
	checkTimes:0,
	maxCheckTimes:100,	
	//��ȡ���ֵĳ��ȣ�һ�������������ֽ�
	getCharacterLength:function(_str){
		var _str = _str.replace(/[����]/g, "00");//���ַ��������������滻��"00"
		_str = _str.replace(/[\(\)\-\\\[\]]/g, "0");//���ַ������������е���Щ�ַ��滻��"0"
		if(this.isiPanel && !isAdvanceFlag){	//advance����������
			var re = /[^\u2E80-\uFE4F]+/gi;		//iPanelƥ�����Ĳ�һ����Ҫ�Ӹ����ж�
		}else{
			var re = /[\u2E80-\uFE4F]+/gi;
		}
		
		var bb = _str.match(re);//�ҵ�ƥ��������ַ�����������ص���������ʽ��
		if(typeof bb == "undefined" || bb == "null"){
			return _str.length; 
		}
		var cc = "";
		if(bb!=null){
			cc = bb.join("");  
		}
		var totalLen = _str.length;		//ԭ�ַ�������
		var chLen = cc.length; 			//���Ĵ��ĳ���
		var engLen = totalLen - chLen;	//���Ȳ���������ַ�������
		var tW = chLen*2+engLen;		//���ĳ�*2+�����ĳ�
		/*//W,MӢ�Ĵ�дҲ����һ������  ����: 48-57 Сд��ĸ: 97-122 ��д��ĸ: 65-90
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
				num+=2;//>255��Ϊ�Ǻ���
			}else{
				num++;
			}
			if(num>=_len) return i+1;//������ʱ��ֻ��ȡǰ��Ĳ��֡�
		}
		return _str.length;
	},

	//��ȡ�ַ���
	cutStr:function(stbr, len){
        var char_length = 0;
        for (var i = 0; i < stbr.length; i++){
            var son_str = stbr.charAt(i);//��i���ַ�
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
	str = str.replace(/[ ]*$/g,"..");
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
/*��ȡurl��Я������*/
function getParam(_type,_url){
	var url = _url || window.location.search;
	if(new RegExp(".*\\b"+_type+"\\b(\\s*=([^&]+)).*", "gi").test(_url)){
		return RegExp.$2;
	}else{
		return null;
	}
}

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

function ScrollBar(id, barId, f) {
	this.obj = null;
	this.barObj = null;
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = f.document.getElementById(barId);
		}
	} else {
		this.obj = window.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = window.document.getElementById(barId);
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

function showList2D(listSize,dataSize,pos,time,f){
	this.listSize = listSize;
	this.dataSize = dataSize;
	this.position = pos;
	this.focusObj = null;//����Ķ���{top:"10px",left:"10px",width:"10px",height:"10px"},{...}
	this.focusDiv = "focusDiv";//�ƶ���DIV
	this.haveData = function(){};
	this.noData = function(){};
	
	this.isLoop = false; // �Ƿ�����ѭ��
	
	//����
	this.currFocus = 0;//0��this.listSize֮��
	this.currPage = 0;//��ǰҳ��
	this.maxPage = 0;//���ҳ��
	this.pageLoop = null;//�Ƿ�ѭ����ҳ��trueΪ�ǣ�falseΪ��//_______________0624
	this.tempSize = 0;//ʵ����ʾ���ݵĳ���//_______________0624
	this.time = typeof(time)=="undefined" ? "200ms":time;
     //�ڲ�����
	this.listData = [];
	this.startShow = function(){
		this.initAttrib();//_______________0624
		this.initData();
		if(this.dataSize ==0){
			this.$(this.focusDiv).style.visibility="hidden";
		}else{
			//this.currFocus = this.position % this.listSize;
			//this.$(this.focusDiv).style.visibility="visible";
			this.$(this.focusDiv).style.webkitTransitionDuration = "0s";
			this.$(this.focusDiv).style.top 	= this.focusObj[this.currFocus].top;
			this.$(this.focusDiv).style.left 	= this.focusObj[this.currFocus].left;
			this.$(this.focusDiv).style.width 	= this.focusObj[this.currFocus].width;
			this.$(this.focusDiv).style.height 	= this.focusObj[this.currFocus].height;
		}
		this.showList();
	}
	
	this.initAttrib = function(){//_______________0624
		if(this.pageLoop  == null) this.pageLoop   = this.isLoop ? true : false;
	}
	
	this.initData = function(){//��ʼ������
		this.listData = [];
		if(this.dataSize==0) return ;
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
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
			//endPos = this.dataSize - 1 - firstPos;
		}
		else{
			firstPos = (this.currPage - 1) * listSize;
			//endPos = firstPos + this.listSize - 1;
		}
		endPos = firstPos + this.listSize - 1;
		//var previousPosition = this.position;
		this.currFocus = 0;
		this.position = firstPos;
		this.changeFocus(0);
		//var firstPos = (this.currPage - 1) * listSize;
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
		//var currentPage = this.currPage;//��ǰҳ
		this.currPage += __num;
		this.getPageData(this.currPage);
		this.showList();
		//var firstPos = (this.currPage - 1) * this.listSize;//ÿҳ�ĵ�һ�����ݽ����λ��
		//this.changePosition(pageSize);
		//this.initData();
		//this.showList();
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


function ajax_js(_url,fun){
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.overrideMimeType("text/html; charset=gbk");
	oXmlHttp.open('GET',_url, true);
	oXmlHttp.onreadystatechange = function() {
		if (oXmlHttp.readyState == 4 )  {
			if (oXmlHttp.status == 200 || oXmlHttp.status == 0) {
				fun(oXmlHttp.responseText);
			}
		}
	} 
	oXmlHttp.send(null);
}

//�����
var marqueeContent = ["",""];
function getMarquee(){
	var Mar0_remember = sessionStorage.getItem("marqueeContent0");
	if (Mar0_remember != "" && Mar0_remember != "undefined" && typeof(Mar0_remember) != "undefined") {
		marqueeContent[0] = Mar0_remember;
	}
	var Mar1_remember = sessionStorage.getItem("marqueeContent1");
	if (Mar1_remember != "" && Mar1_remember != "undefined" && typeof(Mar1_remember) != "undefined") {
		marqueeContent[1] = Mar1_remember;
	}
}

var fly_marquee_id = 0; //��¼��ǰ���ĸ�DIV������ʾ��
var first_show = 1;
function showMarquee(){
	if (first_show){//���ǵ�һ��
		first_show = 0;
		$("marquee_ad" + fly_marquee_id).innerText = marqueeContent[fly_marquee_id];
	}
	else{
		$("marquee_ad" + (fly_marquee_id + 1)%2).style.webkitTransitionDuration = "0ms";
		$("marquee_ad" + (fly_marquee_id + 1)%2).style.top = "-30px";
		$("marquee_ad" + (fly_marquee_id + 1)%2).innerText = marqueeContent[(fly_marquee_id + 1)%2];	
		$("marquee_ad" + fly_marquee_id).style.webkitTransitionDuration = "0ms";

		setTimeout(function(){
			$("marquee_ad" + fly_marquee_id).style.webkitTransitionDuration = "500ms";
			$("marquee_ad" + fly_marquee_id).style.top = "30px";//���¹���
			$("marquee_ad" + (fly_marquee_id + 1)%2).style.webkitTransitionDuration = "500ms";
			$("marquee_ad" + (fly_marquee_id + 1)%2).style.top = "0px";//���¹���
			fly_marquee_id = (fly_marquee_id + 1)%2;
		},5);
	}
	setTimeout("showMarquee();",5000);
}

var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
// ����ȫ�ֱ���
function setGlobalParam(key,value){
	if(navigatorFlag == "iPanel"){//�ж��ǲ���iPanel
		iPanel.setGlobalVar(key,value);
	}else{
		sessionStorage.setItem(key,value);
	}
}

// ��ȡȫ�ֱ���
function getGlobalParam(key){
	if(navigatorFlag == "iPanel"){
		return iPanel.getGlobalVar(key);
	}else{
		return sessionStorage.getItem(key);
	}
}

// �Ƴ�ȫ�ֱ���
function delGlobalParam(key){
	if(navigatorFlag == "iPanel"){
		iPanel.delGlobalVar(key);
	}else{
		sessionStorage.removeItem(key);
	}
}
/**
 * AJAXģ��ķ�װ   
*/
function AJAX_OBJ(_url, _successCallback, _failureCallback, _completeCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
	/**
	 * AJAXͨ��GET��POST�ķ�ʽ�����첽��ͬ����������
	 * ע�⣺
	 * 	1��������240 No Content�Ǳ�HTTP��׼��Ϊ����ɹ���
	 * 	2��Ҫʹ��responseXML�Ͳ�������_charset����Ҫֱ�Ӵ���null
	 * 	3��_frame������ʵ�����������ҳ������뾡����֤׼ȷ������������Խ��͵��쳣
	 */
	/**
	 * @param{string} _url: ����·��
	 * @param{function} _successCallback: ����ɹ���ִ�еĻص���������һ������������չһ������new XMLHttpRequest()�ķ���ֵ
	 * @param{function} _failureCallback: ����ʧ��/��ʱ��ִ�еĻص�����������ͬ�ɹ��ص�������.status��.statusText
	 * @param{string} _urlParameters: ����·������Ҫ���ݵ�url����/����
	 * @param{*} _callbackParams: �������ʱ�ڻص������д���Ĳ������Զ�������
	 * @param{boolean} _async: �Ƿ��첽���ã�Ĭ��Ϊtrue���첽��false��ͬ��
	 * @param{string} _charset: ���󷵻ص����ݵı����ʽ������iPanel�������IE6��֧�֣���Ҫ����XML����ʱ����ʹ��
	 * @param{number} _timeout: ÿ�η��������೤ʱ����û�гɹ�����������Ϊ����ʧ�ܶ��������󣨳�ʱ��
	 * @param{number} _frequency: ����ʧ�ܺ���೤ʱ����������һ��
	 * @param{number} _requestTimes: ����ʧ�ܺ�����������ٴ�
	 * @param{object} _frame: ���������Ҫ�ϸ���ƣ�������п��ܳ���ҳ���Ѿ������٣��ص���ִ�е����
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
		 * @param{string} _method: �������ݵķ�ʽ��POST/GET
		 * @param{string} _headers: �������ݵ�ͷ��Ϣ��json��ʽ
		 * @param{string} _username: ��������Ҫ��֤ʱ���û���
		 * @param{string} _password: ��������Ҫ��֤ʱ���û�����
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
		if (this.charset != null) { //Ҫʹ��responseXML�Ͳ������ô�����
			this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
		}
		iDebug("common.js [xmlHttp]  send(): " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
		this.timer = this.frame.setTimeout(function() {
			target.checkStatus();
		}, this.timeout);//5�����״̬
	};
	
	this.stateChanged = function() { //״̬����������״̬0~4
		// 0 �� ��δ��ʼ������û�е���send()����
		// 1�� �����룩�ѵ���send()���������ڷ�������
		if (this.xmlHttp.readyState < 2) {
			iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		} else {
			iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) { //��������ɣ�send()����ִ����ɣ��Ѿ����յ�ȫ����Ӧ����
			/*this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);*/
		} else if (this.xmlHttp.readyState == 3) {//�����������ڽ�����Ӧ����
			// status��XMLHttpRequest�����һ�����ԣ���ʾ��Ӧ��HTTP״̬��
			if (this.xmlHttp.status == 401) {//������Ȩʧ��
				iDebug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {//����ɣ���Ӧ���ݽ�����ɣ������ڿͻ��˵�����
			this.frame.clearTimeout(this.timer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0) {//���׳ɹ�||�����յ�����������ϢΪ��
				this.success();
			} else {
				this.failed();
			}
			this.complete();
		}
	};
	this.success = function() {
		//���ε����صĿ�����
		if (!this.xmlHttp.responseText) return;
		
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
	this.complete = function() {
		if (this.callbackParams == null) {
			this.completeCallback(this.xmlHttp);
		} else {
			this.completeCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.checkStatus = function() { //��ʱ����ָ��ʱ����û�гɹ�������Ϣ����ʧ�ܴ���
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
		 * @param{object} _json: ���ݵĲ������ݴ���ֻ֧��json��ʽ
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
