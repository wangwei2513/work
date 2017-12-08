function showDialog(_str){
	dialogWidget.show();
	dialogWidget.showDialog(_str);
}
/*
 +------------------------------------------------------------------------------
 +------------------------------------------------------------------------------
	var parmObj = {
		dataPos:0, //数据焦点位置 默认在0
		listSize:3, //列表显示的条目数
		conDiv:"focusDiv0",//外层div名称
		rowDivName:"focusDiv0_", //行DIV的ID名
		textArr:"",//要显示的内容数组，包括中英文的
		focusPos:0,//焦点的位置
		valueArr:"",//设定值的数组
	};
 +------------------------------------------------------------------------------
*/
function listChange(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.dataPos = _parmObj.dataPos; //焦点位置 默认在 0
	this.listSize = _parmObj.listSize; //列表显示的条目数
	this.conDiv = _parmObj.conDiv;
	this.rowDivName = _parmObj.rowDivName; //行DIV的ID名
	this.direction  = typeof(_parmObj.direction)=="undefined"?"top" : _parmObj.direction;
	this.textArr = _parmObj.textArr;
	this.arrLength = _parmObj.textArr.length;
	this.focusPos = _parmObj.focusPos;
	this.valueArr = _parmObj.valueArr;
	this.haveData = function(){};
	/*初始化输出信息*/
	this.init = function(){
		//输出信息
		this.showDate();
	}
	this.showDate = function(){
		var position = this.dataPos;
		for(var i=0; i<this.listSize; i++){
			var dataPos = (i-this.focusPos)+position;
			if(dataPos < 0 )dataPos += this.arrLength;
			if(dataPos >= this.arrLength)dataPos -= this.arrLength;
			this.haveData(i,dataPos);
		}
	}
	
	/*移动焦点的函数*/ 
	this.changeFocus =  function(_num){
		this.dataPos += _num;
		if(this.dataPos < 0 )this.dataPos += this.arrLength;
		if(this.dataPos >= this.arrLength)this.dataPos -= this.arrLength;
		this.showDate();
	};
	this.visibile = function(){
		this.$(this.conDiv).style.visibility = "visible";
	};
	this.hidden = function(){
		this.$(this.conDiv).style.visibility = "hidden";
	}
	
}

/*
 +------------------------------------------------------------------------------
 * 单行单列对象
 +------------------------------------------------------------------------------
	var parmObj = {
		DivId:        "L",             //行DIV的ID名称   
		focusId:      "focus",         //焦点的ID
		arrLength:     listArr.length, //数据总长度
		listSize:      7,              //行数
		rowHeight:     40,             //行高
		focusStartPos: 85              //显示的第一行焦点Y轴坐标
	    direction:     "top"             //方向 top 纵向 left 横向
	};
 +------------------------------------------------------------------------------
*/
function listSlip(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.listPos = 0; //数据位置 默认在 0
	this.focusPos = 0; //焦点位置 默认在 0
	this.duration = _parmObj.duration || 300;
	this.focusStartPos = _parmObj.focusStartPos;//焦点 在显示的第一行焦点Y轴坐标
	this.listSize = _parmObj.listSize; //列表显示的条目数
	this.startline = 0;//起始行 从0开始数
	this.endline   = this.listSize-1;//其实列 从0开始数
	this.firstFlag = true;//按向上的时候是否能滑到 第一条行目的位置
	this.lastFlag = false;//按向下的时候是否能滑到 最后一条行目的位置;
	this.rowHeight = _parmObj.rowHeight;//焦点移动的行高
	this.recordLdiv = []; //记录滑动DIV位置；
	this.arrLength = _parmObj.arrLength;
	this.focusObj = this.$(_parmObj.focusId); //焦点；
	this.rowDivName = _parmObj.DivId; //行DIV的ID名
	this.direction  = typeof(_parmObj.direction)=="undefined"?"top" : _parmObj.direction;
	//this.direction = _parmObj.direction || "top";//方向
	this.firstDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction]);//第一个DIV的位置
	this.topDivTop = this.firstDivTop-this.rowHeight; //移动行DIV最上面的位置；
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.listSize).style[this.direction]);//移动行DIV最下面的位置；
	
	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
	/*初始化输出信息*/
	this.initInfo = function(){
		//清除所有信息
		for(var i=0;i<this.listSize+1;i++){
				this.notData(i);
		}
		
		//还原DIV位置、创建最初的DIV顺序
		for(var i=0;i<this.listSize+1;i++){
			this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
			this.$(this.rowDivName+i).style[this.direction] = this.firstDivTop+this.rowHeight*i+"px";
			this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration+"ms";
			this.recordLdiv[i]=i;
		}
		//输出信息
		var position = this.listPos-this.focusPos;//当前页第一个
		for(var i=0; i<this.listSize+1; i++){
			this.recordLdiv[i]=i;
			if(i+position<this.arrLength)this.haveData(i,i+position);
		}
	}
	
	
	/*行DIV移动*/
	this.moveLdiv = function(_num){
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] = _num>0?this.bottomDivTop+"px":this.topDivTop+"px";
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = this.duration+"ms";
		for(var i=0;i<this.listSize+1;i++){
			$(this.rowDivName+i).style[this.direction] = parseInt($(this.rowDivName+i).style[this.direction]) - _num*this.rowHeight +"px";
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
	/*获取焦点*/
	this.onfocus = function(){
		this.focusObj.style[this.direction] = this.focusStartPos + this.rowHeight*this.focusPos+"px";
	}
	
	/*移动焦点的函数*/
	this.changeFocus =  function(_num){
		var focusPosTemp = this.focusPos;
		var listPosTemp = this.listPos;
		this.focusPos += _num;
		this.listPos += _num;
		if(this.listSize>this.arrLength){
			if(this.listPos<0){this.listPos=0;this.focusPos=0;return;}
			if(this.listPos>this.arrLength-1){this.listPos=this.arrLength-1;this.focusPos=focusPosTemp;return;}
		}
		else if(this.focusPos<this.startline&&_num==-1){
			if(this.firstFlag==true&&this.listPos==this.focusPos){
				if(this.listPos<0){this.listPos=0;this.focusPos=0;return;}
				this.onfocus();
				return;
			}
			else {
				this.focusPos=focusPosTemp;
				if(this.listPos<0){this.listPos=0;return;}
			}
			if(this.listPos-this.startline>=0){
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],this.listPos-this.startline);
			}
			else this.notData(this.recordLdiv[this.recordLdiv.length-1]);
			this.moveLdiv(-1);
			this.reLdiv(-1);
			return;
		}
		else if(this.focusPos>this.endline&&_num==1){
			if(this.lastFlag==true&&this.listPos+this.listSize-this.endline>this.arrLength){
				if(this.listPos>this.arrLength-1){this.listPos=this.arrLength-1;this.focusPos=this.listSize-1;return;}
				this.onfocus();
				return;
			}
			else {
				this.focusPos=focusPosTemp;
				if(this.listPos>this.arrLength-1){this.listPos=this.arrLength-1;return;}
			}
			if(this.listPos+this.listSize-this.endline-1<this.arrLength){
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],this.listPos+this.listSize-this.endline-1);
			}
			else this.notData(this.recordLdiv[this.recordLdiv.length-1]);
			this.moveLdiv(1);
			this.reLdiv(1);
			return;
		}
		this.onfocus();
	}
	/* 寻找当前焦点对应的ID ，返回一个ID number */
	this.currId = function(){
		var currId = null;
		currId = this.recordLdiv[this.focusPos];
		return currId;
	}
}

//返回字符串汉字长度 英文或特殊字符两个相当于一个汉字
/*
 *str:传入的字符串
 *len:字符串的最大长度
 *返回截取的字符串
 */
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

function DMR_play(){
	  var geturl = NDMR.sourcePath;
	  iPanel.debug("global.js_6804_geturl="+geturl);
	  var name = NDMR.sourceName; 
	  iPanel.debug("global.js_6804_name="+name);
	  add("DMR_play---geturl="+geturl);
	  add("DMR_play---name="+name)
	  if(geturl != 0 && backUrl.indexOf("ui://init.htm") == -1){
		  var type = checkFileType(geturl);
		  add("DMR_play----type="+type);
		  if(type == 0 || type == 1){//音频/视频
			  globalWidget.upnpPlayType = type == 0 ? "audio" : "video";
			  globalWidget.upnpUrl = geturl;
			  globalWidget.unpnName = name;
			  globalWidget.urlType = type;
			  backUrl = iPanel.mainFrame.location.href;
			  iPanel.debug("eventpage_6804_backUrl="+backUrl);
			 media.AV.stop(0);
	         media.AV.close();
			 //iPanel.eventFrame.openPage("http://192.168.60.88/otherTest/playTest/GRID_UI_NEW_5/play.htm?type="+type,{type:"vod",name:name,url:geturl});
			 iPanel.eventFrame.openPage("ui://play.htm?type="+type,{type:"vod",name:name,url:geturl})
		  }
		  else if(type == 2){//图片
			  globalWidget.upnpPlayType = "picture";
			  globalWidget.upnpUrl = geturl;
			  globalWidget.unpnName = name;
			  backUrl = iPanel.mainFrame.location.href;
			  media.AV.stop(0);
	          media.AV.close();
			 iPanel.mainFrame.location.href = "ui://dlanPic.htm?temp=1";
		  }
	  }
}

var backUrl = "";

var fileType=[[".mp3",".wma",".wav",".ape",".midi",".MP3",".flac",".m4a",".ogg"],
			  [".mp4",".wmv",".ts",".flv",".rmvb",".vob",".mov",".mkv",".mpg",".avi",".dat",".f4v",".m2ts",".trp",".tp"],
			  [".gif",".jpg",".JPG",".png",".bmp"]];
function checkFileType(_url){
	var sx = _url.substring(_url.lastIndexOf("."));
	iPanel.debug("fileList_checkFileType_sx="+sx);
	for(var i = 0; i < fileType.length; i++){
		for(var j = 0; j < fileType[i].length; j++){
			if(sx == fileType[i][j]){
				return i;
			}
		}
	}
	return -1;
}