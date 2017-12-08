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

function getStrChineseLen(str,len){
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
				if (flag == 1)return str.substring(0,i-1)+"..";//修改,sunny,防止换行...
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
	this.focusObj = null;//焦点的对象{top:"10px",left:"10px",width:"10px",height:"10px"},{...}
	this.focusDiv = "focusDiv";//移动的DIV
	this.haveData = function(){};
	this.noData = function(){};
	
	this.isLoop = false; // 是否数据循环
	
	//属性
	this.currFocus = 0;//0到this.listSize之间
	this.currPage = 0;//当前页面
	this.maxPage = 0;//最大页面
	this.pageLoop = null;//是否循环翻页，true为是，false为否//_______________0624
	this.tempSize = 0;//实际显示数据的长度//_______________0624
	this.time = typeof(time)=="undefined" ? "200ms":time;
     //内部属性
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
	
	this.initData = function(){//初始化数据
		this.listData = [];
		if(this.dataSize==0) return ;
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
		if(this.dataSize < this.listSize){
			if(this.position > this.dataSize) this.position = this.dataSize -1;
			
			for(var i=0 ;i < this.dataSize ; i++){
				this.listData[i] = i;
			}
			this.currFocus = this.position % this.listSize;
		}else if((this.position+this.listSize) > this.dataSize){//在最后
			if(this.position>this.dataSize) this.position = this.dataSize -1;
			
			var tempStartPos = this.dataSize - this.listSize;
			this.currFocus = this.position - tempStartPos;
			for(var i=0,j=tempStartPos ;j< this.dataSize ; j++,i++){
				this.listData[i] = j;
			}
			
		}else{//在数据中间
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
	
	this.changeList = function(num){//翻条
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
	
	this.changePage = function(__num){//翻页
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.maxPage;  //判断当前是否首页跳转尾页或尾页跳转首页;
		if(isBeginOrEnd) return;
		if(this.dataSize<=this.listSize) return;
		//var currentPage = this.currPage;//当前页
		this.currPage += __num;
		this.getPageData(this.currPage);
		this.showList();
		//var firstPos = (this.currPage - 1) * this.listSize;//每页的第一个数据焦点的位置
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

//跑马灯
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

var fly_marquee_id = 0; //记录当前是哪个DIV正在显示中
var first_show = 1;
function showMarquee(){
	if (first_show){//如是第一次
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
			$("marquee_ad" + fly_marquee_id).style.top = "30px";//往下滚动
			$("marquee_ad" + (fly_marquee_id + 1)%2).style.webkitTransitionDuration = "500ms";
			$("marquee_ad" + (fly_marquee_id + 1)%2).style.top = "0px";//往下滚动
			fly_marquee_id = (fly_marquee_id + 1)%2;
		},5);
	}
	setTimeout("showMarquee();",5000);
}