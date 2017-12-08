function showDialog(_str){
	dialogWidget.show();
	dialogWidget.showDialog(_str);
}
/*
 +------------------------------------------------------------------------------
 +------------------------------------------------------------------------------
	var parmObj = {
		dataPos:0, //���ݽ���λ�� Ĭ����0
		listSize:3, //�б���ʾ����Ŀ��
		conDiv:"focusDiv0",//���div����
		rowDivName:"focusDiv0_", //��DIV��ID��
		textArr:"",//Ҫ��ʾ���������飬������Ӣ�ĵ�
		focusPos:0,//�����λ��
		valueArr:"",//�趨ֵ������
	};
 +------------------------------------------------------------------------------
*/
function listChange(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.dataPos = _parmObj.dataPos; //����λ�� Ĭ���� 0
	this.listSize = _parmObj.listSize; //�б���ʾ����Ŀ��
	this.conDiv = _parmObj.conDiv;
	this.rowDivName = _parmObj.rowDivName; //��DIV��ID��
	this.direction  = typeof(_parmObj.direction)=="undefined"?"top" : _parmObj.direction;
	this.textArr = _parmObj.textArr;
	this.arrLength = _parmObj.textArr.length;
	this.focusPos = _parmObj.focusPos;
	this.valueArr = _parmObj.valueArr;
	this.haveData = function(){};
	/*��ʼ�������Ϣ*/
	this.init = function(){
		//�����Ϣ
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
	
	/*�ƶ�����ĺ���*/ 
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
 * ���е��ж���
 +------------------------------------------------------------------------------
	var parmObj = {
		DivId:        "L",             //��DIV��ID����   
		focusId:      "focus",         //�����ID
		arrLength:     listArr.length, //�����ܳ���
		listSize:      7,              //����
		rowHeight:     40,             //�и�
		focusStartPos: 85              //��ʾ�ĵ�һ�н���Y������
	    direction:     "top"             //���� top ���� left ����
	};
 +------------------------------------------------------------------------------
*/
function listSlip(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.listPos = 0; //����λ�� Ĭ���� 0
	this.focusPos = 0; //����λ�� Ĭ���� 0
	this.duration = _parmObj.duration || 300;
	this.focusStartPos = _parmObj.focusStartPos;//���� ����ʾ�ĵ�һ�н���Y������
	this.listSize = _parmObj.listSize; //�б���ʾ����Ŀ��
	this.startline = 0;//��ʼ�� ��0��ʼ��
	this.endline   = this.listSize-1;//��ʵ�� ��0��ʼ��
	this.firstFlag = true;//�����ϵ�ʱ���Ƿ��ܻ��� ��һ����Ŀ��λ��
	this.lastFlag = false;//�����µ�ʱ���Ƿ��ܻ��� ���һ����Ŀ��λ��;
	this.rowHeight = _parmObj.rowHeight;//�����ƶ����и�
	this.recordLdiv = []; //��¼����DIVλ�ã�
	this.arrLength = _parmObj.arrLength;
	this.focusObj = this.$(_parmObj.focusId); //���㣻
	this.rowDivName = _parmObj.DivId; //��DIV��ID��
	this.direction  = typeof(_parmObj.direction)=="undefined"?"top" : _parmObj.direction;
	//this.direction = _parmObj.direction || "top";//����
	this.firstDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction]);//��һ��DIV��λ��
	this.topDivTop = this.firstDivTop-this.rowHeight; //�ƶ���DIV�������λ�ã�
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.listSize).style[this.direction]);//�ƶ���DIV�������λ�ã�
	
	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	/*��ʼ�������Ϣ*/
	this.initInfo = function(){
		//���������Ϣ
		for(var i=0;i<this.listSize+1;i++){
				this.notData(i);
		}
		
		//��ԭDIVλ�á����������DIV˳��
		for(var i=0;i<this.listSize+1;i++){
			this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
			this.$(this.rowDivName+i).style[this.direction] = this.firstDivTop+this.rowHeight*i+"px";
			this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration+"ms";
			this.recordLdiv[i]=i;
		}
		//�����Ϣ
		var position = this.listPos-this.focusPos;//��ǰҳ��һ��
		for(var i=0; i<this.listSize+1; i++){
			this.recordLdiv[i]=i;
			if(i+position<this.arrLength)this.haveData(i,i+position);
		}
	}
	
	
	/*��DIV�ƶ�*/
	this.moveLdiv = function(_num){
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] = _num>0?this.bottomDivTop+"px":this.topDivTop+"px";
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = this.duration+"ms";
		for(var i=0;i<this.listSize+1;i++){
			$(this.rowDivName+i).style[this.direction] = parseInt($(this.rowDivName+i).style[this.direction]) - _num*this.rowHeight +"px";
		}
	}
	/*���ƶ������±��λ��*/
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
	/*��ȡ����*/
	this.onfocus = function(){
		this.focusObj.style[this.direction] = this.focusStartPos + this.rowHeight*this.focusPos+"px";
	}
	
	/*�ƶ�����ĺ���*/
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
	/* Ѱ�ҵ�ǰ�����Ӧ��ID ������һ��ID number */
	this.currId = function(){
		var currId = null;
		currId = this.recordLdiv[this.focusPos];
		return currId;
	}
}

//�����ַ������ֳ��� Ӣ�Ļ������ַ������൱��һ������
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
		  if(type == 0 || type == 1){//��Ƶ/��Ƶ
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
		  else if(type == 2){//ͼƬ
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