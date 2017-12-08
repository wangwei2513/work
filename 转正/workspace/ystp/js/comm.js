//************��������*****************//
var debugMode = true;//�Ƿ�������ģʽ
/******************************** ��Ϣ�Ĵ���-start ***********************************************/
var ipanelAdvanced = 0;						//0:iPanel 3.0; 1:����
var userAgent = navigator.userAgent.toLowerCase();	//������汾������������3.0�ͻ�������
if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){
	ipanelAdvanced = 0;
}else{
	ipanelAdvanced = 1;	
}
var EVENT = {STOP:0, DOWN:1, ADVECTED:2};			//��Ϣ/����������
if(ipanelAdvanced){
	EVENT = {STOP:false, DOWN:true, ADVECTED:true};
}
/************************************ ��Ϣ�Ĵ���-end ****************************************/

/*************************************** �����ֵ-start ************************************************/
var Event = {
		mapping: function(ev){
			var _event = ev || event;
			var keycode = _event.which || _event.keyCode || _event.charCode;
			var code = "";
			var value = keycode;
			keycode = parseInt(keycode);
			switch(keycode){
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:
					code = "KEY_NUMBER";
					value = keycode-48;
					break;
				case 1:
				case 38://up
					code = "KEY_UP";
					break;
				case 2:
				case 40://down
					code = "KEY_DOWN";
					break;
				case 3:
				case 37://left
					code = "KEY_LEFT";
					break;
				case 4:
				case 39://right
					code = "KEY_RIGHT";
					break;
				case 13://enter
					code = "KEY_SELECT";
					break;
				case 340:
				case 8://back
				case 640:
				case 283:
					code = "KEY_BACK";
					break;
				case 114: //ͬ���м��
				case 339:
				case 27://exit
					code = "KEY_EXIT";
					break;
				default:
					code = "OTHER_MESSAGE";
					value = keycode;
					break;		
			}
			return {code: code,value:value};
		}
	};
/*************************************** �����ֵ-end ************************************************/
function iDebug(str){
	if(!debugMode)return;
	if(navigator.appName.indexOf("iPanel") != -1){
		Utility.println(str);	
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

function $(__id){
	return document.getElementById(__id);
}

/***************************************showList  start*******************************/
function showList(__listSize, __dataSize, __position, __startplace, __f){
	//this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
	this.currWindow = __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //�б���ʾ�ĳ��ȣ�
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //�������ݵĳ��ȣ�
	this.position = typeof(__position)=="undefined" ? 0 : __position;  //��ǰ���ݽ����λ�ã�
	this.focusPos = 0;      //��ǰ�б����λ�ã�
	this.lastPosition = 0;  //ǰһ�����ݽ����λ�ã�
	this.lastFocusPos = 0;  //ǰһ���б����λ�ã�
	this.tempSize = 0;  //ʵ����ʾ�ĳ��ȣ�
	this.infinite = 0; //��¼��ֵ��������ȡ���ݽ����λ�ã�
	
	this.pageStyle  = 0;  //��ҳʱ����Ķ�λ��0��ʾ���䣬1��ʾ�Ƶ��б��ײ���
	this.pageLoop   = null;  //�Ƿ�ѭ����ҳ, true��ʾ�ǣ�false��ʾ��
	this.showLoop   = null;  //�Ƿ�ѭ����ʾ����,this.showLoop�������Ϊtrue,���Զ��򿪽�����βѭ����ѭ����ҳ��
	this.focusLoop  = null;  //�����Ƿ���βѭ���л���
	this.focusFixed = null;  //�����Ƿ�̶���this.focusFixed�������Ϊtrue,���Զ���ѭ����ʾ���ݣ�
	this.focusVary  = 1;  //�����㷢���ı�ʱ�����ǰ�󽹵��ľ���ֵ���ڴ�ֵʱ�������ٸ���this.focusStyle��ֵ�����ִ�����ֵ�������0������Ĭ��Ϊ1��
	this.focusStyle = 0;  //�л�����ʱ���б���ı�����ʽ��0��������1��ʾ������
	
	this.showType = 1; //���ֵ����ͣ�0��ʾ�ϵĳ��ַ�ʽ��1��ʾ�µĹ������ַ�ʽ��	
	this.listSign = 0; //0��ʾtop���ԣ�1��ʾleft����, Ҳ����ֱ����"top"��"left"��
	this.listHigh = 30;  //�б���ÿ���еĸ߶ȣ����������ݻ������飬���磺40 �� [40,41,41,40,42];
	this.listPage = 1;  //�б����ҳ������
	this.currPage = 1;  //��ǰ��������ҳ����
	
	this.focusDiv = -1;  //�б����ID���ƻ��߶���Ϊ�����������磺"focusDiv" �� new showSlip("focusDiv",0,3,40);
	this.focusPlace = new Array();  //��¼ÿ���б����λ��ֵ��
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //�б���Div��ʼλ�õ�ֵ��
	
	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	//���������������������յ�����Ϊ{idPos:Num, dataPos:Num}�Ķ��󣬸ö�������idPosΪ�б����ֵ������dataPosΪ���ݽ����ֵ��
	
	this.focusUp  = function(){this.changeList(-1);}; //���������ƶ���
	this.focusDown= function(){this.changeList(1); }; //���������ƶ���
	this.pageUp   = function(){this.changePage(-1);}; //�б�����۶ҳ��
	this.pageDown = function(){this.changePage(1); }; //�б�����۶ҳ��
	
	//��ʼ��ʾ�б���Ϣ
	this.startShow = function(){
		this.initAttrib();
		this.setFocus();
		this.showList();
	}
	//��ʼ���������ԣ�
	this.initAttrib = function(){	
		if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";  //����ֵת�����ַ�����
		if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;  //���û�������ķ���ֵ;
				
		if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;  //��ʼ�������Ƿ�̶�������û�û�ж��壬��Ĭ��Ϊfalse�������ǰshowType��0����ô���ù̶�����Ч�ģ�
		if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;  //��ʼ���Ƿ�ѭ����ʾ���ݣ�����û�û�ж��岢�ҽ���Ϊ�̶����ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע����ǽ���Ϊ�̶�ʱ����Ҫǿ�ƶ���Ϊfalse;
		if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;	//��ʼ���Ƿ�ѭ����ҳ������û�û�ж��岢��ѭ����ʾ���ݣ��ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע�����ѭ����ʾ����ʱ����Ҫǿ�ƶ���Ϊfalse;
		if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;   //��ʼ�������Ƿ���βѭ���л�������û�û�ж��岢��ѭ����ʾ���ݣ��ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע�����ѭ����ʾ����ʱ����Ҫǿ�ƶ���Ϊfalse;
		if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;   //������㲻�̶����������ݳ���С���б���ʾ���ȣ���ǿ������ѭ����ʾ����Ϊ��
		
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
	//��ʼ������λ�ã�
	this.initFocus = function(){
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
		if(this.showType == 0){  //��ǰshowTypeΪ0ʱ���û������б�������Ч�ģ�����ͨ�����ݽ�������ȡ��
			this.focusPos = this.position%this.listSize;
		}else if(!this.focusFixed&&!this.showLoop){  //��ǰshowTypeΪ1�����㲻�̶����Ҳ�ѭ����ʾ����ʱ���жϵ�ǰ�û�������б����Ƿ񳬳���Χ������������¶��壻
			var tempNum = this.position-this.focusPos;
			if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
		}
	}
	//����ÿ��(��)���ڵ�λ�ã��������������
	this.initPlace = function(){
		var tmph = this.listHigh;
		var tmpp = [this.startPlace];		
		for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
		this.focusPlace = tmpp;
	}
	//�л������λ��
	this.changeList = function(__num){
		if(this.dataSize==0) return;
		if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
		this.changePosition(__num);
		this.checkFocusPos(__num);
	}
	//�л����ݽ����ֵ
	this.changePosition = function(__num){
		this.infinite += __num;
		this.lastPosition = this.position;	
		this.position = this.getPos(this.infinite, this.dataSize);
	}
	//�����б��㲢ˢ���б�
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
	//�л��б����λ��
	this.changeFocus = function(__num){
		this.lastFocusPos = this.focusPos;
		this.focusPos += __num;
		this.setFocus(__num);
	}
	//���õ�����ǰ�����λ�ã�
	this.setFocus = function(__num){
		if(typeof(this.focusDiv)=="number") return;  //���û���役��DIV���򲻽������ò�����
		var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));  //�����㷢���ı�ʱ������ǰ�󽹵��ľ���ֵ��focusStyle��ֵ�жϽ������Ч����
		if(typeof(this.focusDiv)=="string"){  //ֱ�����ý���λ�ã�
			this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
		}else if(typeof(__num)=="undefined"||tempBool){  //ֱ�Ӷ�λ���㣻
			this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
		}else if(__num!=0){  //�������㣻
			this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
		}
	}	
	//�л�ҳ���б�ҳ
	this.changePage = function(__num){	

		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;  //�жϵ�ǰ�Ƿ���ҳ��תβҳ��βҳ��ת��ҳ;
		if(this.showLoop){   //���������ѭ����ʾ����ִ������ķ�ҳ���룻
			if(isBeginOrEnd&&!this.pageLoop) return;
			var tempNum = this.listSize*__num;
			if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
				this.changePosition(this.focusPos*-1);
				this.checkFocusPos(this.focusPos*-1);
			}
			this.changePosition(tempNum);
			this.checkFocusPos(tempNum);
		}else{
			if(this.dataSize<=this.listSize) return;  //������ݳ���С��������б���ʾ���ȣ��򲻽��з�ҳ��
			if(this.showType==0){

				if(isBeginOrEnd&&!this.pageLoop) return;   //�������ҳ��תβҳ��βҳ��ת��ҳ, this.pageLoopΪ���򲻽��з�ҳ��
				var endPageNum = this.dataSize%this.listSize;  //��ȡβҳ����;
				var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;  //�ж�Ŀ��ҳ�Ƿ�Ϊβҳ;
				var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;	  //�ж�Ŀ��ҳ�Ƿ�Ϊβҳ������ǲ��ҵ�ǰ�б�����ڻ����βҳ���������ȡ����֮��Ĳ		
				var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize;  //�жϵ�ǰ�Ƿ���ҳ��תβҳ��βҳ��ת��ҳ������ǲ���βҳС��this.listSize�����ȡ��ǰҳ������Ŀ��ҳ����Ĳ�ֵ������ΪĬ��ҳ����ʾ������
				overNum = this.pageStyle==0 ? overNum : this.focusPos;  //�жϵ�ǰ��ҳʱ�����style, 0��ʾ���䣬1��ʾ�Ƶ��б��ײ���
				tempNum = tempNum*__num-overNum;

				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				var tempPos   = this.position-this.focusPos;  //��ȡ��ǰҳ�б��ײ������ݽ��㣻
				var tempFirst = this.dataSize-this.tempSize;  //��ȡβҳ��һ�����ݽ����λ�ã�
				if(tempPos+__num<0||tempPos+__num>tempFirst){
					if(!this.pageLoop) return;  //��ѭ����ҳʱ�����������ȡ��ҳ������ݽ���;
					tempPos = __num<0 ? tempFirst : 0;
				}else{
					tempPos += this.tempSize*__num;
					if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
				}		
				var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;  //�жϵ�ǰ��ҳʱ�����style, ȡ���б���λ�ã�
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);  //���this.focusPos��Ϊ0�����ƶ��б��㵽�б��ײ���
				this.changePosition(tempPos-this.position+tempNum); 
				this.showList();
			}
		}
	}
	//��ʾ�б���Ϣ
	this.showList = function(){
		var tempPos = this.position-this.focusPos;	 //��ȡ��ǰҳ�б��ײ������ݽ��㣻
		for(var i=tempPos; i<tempPos+this.listSize; i++){		
			var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };  //����һ���������õ�ǰ�б�������ݽ���ֵ��
			( i >= 0 && i < this.dataSize)||(this.showLoop && this.dataSize !=0 ) ? this.haveData(tempObj) : this.notData(tempObj);  //��i��ֵ��this.dataSize�ķ�Χ�ڻ�����ѭ����ʾʱ��������ʾ���ݵĺ����������������ĺ�����
		}
		this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.listPage = Math.ceil(this.dataSize/this.listSize);
	}
	//����б���Ϣ
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
/***************************************showList  end*******************************/

/*��ȡURL����*/
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

//�����ָ�����ȡ�ַ�����
//str:Ҫ������ַ���  lenҪȡ���������� __type��1��ʾֱ�ӷ���ԭ�ַ�������ȡֵ���ؿ�
function getChiDisplayString(str,len,__type,__addStr){
    var totalLength=0;
    var toMarqueeFlag = false;
    var position=0;
    for(var i=0;i<str.length;i++){
        var intCode=str.charCodeAt(i);
        if((intCode >= 0x0001 && intCode <= 0x007e) || (0xff60<=intCode && intCode<=0xff9f)){
            totalLength+=1;//�����ĵ����ַ����ȼ�1
        }else{
            totalLength+=2;//�����ַ��������2
        }
		var tmpLength = totalLength % 2 == 0 ? (totalLength/2) : (parseInt(totalLength/2)+1) ;
        if(tmpLength > len){
            position = i;
            toMarqueeFlag = true;
            break;
        }
    }
    if(toMarqueeFlag){//������ָ������
		if(typeof __addStr == "undefined") __addStr = "";
		return str.substring(0,position)+__addStr;
	}
	if(__type == 1) return str;
	return "";
}

Date.prototype.Format = function (fmt) {
    var o = {
        "y+": this.getYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function $(_id){
	return document.getElementById(_id);
}
/*ˢ����ҳ��ʾʱ��*/
/*function refreshTime(){
	 var nowDate = new Date();
	 $("presentTime").innerText = nowDate.Format("yyyy-MM-dd hh:mm"); 
	 setTimeout("refreshTime();",60000);
}
*/

Date.prototype.Format = function (fmt) {
    var o = {
        "y+": this.getYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};