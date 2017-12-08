function $(id){
	return document.getElementById(id);
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
	//iPanel.debug("ScrollBar----------------");
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
	
	this.listReverse = 1;
	
	this.focusDiv = -1;  //�б����ID���ƻ��߶���Ϊ�����������磺"focusDiv" �� new showSlip("focusDiv",0,3,40);
	this.focusPlace = new Array();  //��¼ÿ���б����λ��ֵ��
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //�б���Div��ʼλ�õ�ֵ��
	
	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	//���������������������յ�����Ϊ{idPos:Num, dataPos:Num}�Ķ��󣬸ö�������idPosΪ�б����ֵ������dataPosΪ���ݽ����ֵ��
	
	this.focusUp  = function(){
		if(this.listReverse == 1){
			this.changeList(-1);
		}else{
			this.changeList(1);
		}
	}; //���������ƶ���
	this.focusDown= function(){
		iDebug("this.listReverse="+this.listReverse);
		if(this.listReverse == 1){
			this.changeList(1); 
		}else{
			this.changeList(-1); 
		}
	}; //���������ƶ���
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
		for(var i=1; i<this.listSize; i++){
			//tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
			tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : (this.listReverse)*tmph*i+tmpp[0];
		}
		this.focusPlace = tmpp;
	}
	//�л������λ��
	this.changeList = function(__num){
		if(this.dataSize==0) return;
		if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) { return false; }
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
				//getRecommend();
			}else{
				this.changeFocus(__num);
				//getRecommend();	
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
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;//_______________0624
		//iPanel.debug("________eventsize"+this.dataSize);
		//iPanel.debug("________eventsize"+this.listSize);
		//iPanel.debug("________eventsize"+this.tempSize);
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
		////iPanel.debug("____event_listData"+tempList);
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
		//iPanel.debug("______event_currentPage"+this.currPage);
		var firstPos = 0;
		var endPos = 0;
		if(this.currPage == this.maxPage){
			firstPos = this.dataSize - this.listSize;
			//endPos = this.dataSize - 1 - firstPos;
			//iPanel.debug("111111111");
		}
		else{
			firstPos = (this.currPage - 1) * listSize;
			//endPos = firstPos + this.listSize - 1;
			//iPanel.debug("222222");
		}
		endPos = firstPos + this.listSize - 1;
		//var previousPosition = this.position;
		this.currFocus = 0;
		////iPanel.debug("_____event_currFocus"+changeNum);
		this.position = firstPos;
		this.changeFocus(0);
		//var firstPos = (this.currPage - 1) * listSize;
		//iPanel.debug("_____event_firstPos"+firstPos);
		//iPanel.debug("_____event_endPos"+endPos);
		for(var i=firstPos,j=0;i<endPos+1;i++,j++){
			this.listData[j] = i;
		}
		//iPanel.debug("____event_listData"+this.listData);
	}
	
	this.changeList = function(num){//����
		if(this.dataSize == 0 ) return ;
		var tempEnd = this.dataSize ;
		//iPanel.debug("eventpage.htm--------this.changeList--num="+num+"----tempEnd="+tempEnd+";this.isLoop="+this.isLoop+";this.position="+this.position);
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
				//iPanel.debug("------tempEnd="+tempEnd+";this.dataSize="+this.dataSize);
				this.currFocus = tempEnd -1;
				//iPanel.debug("-----aaa-tempEnd="+tempEnd+";this.dataSize="+this.dataSize);
				var tempStartPos = this.dataSize - this.listSize <0 ? 0:(this.dataSize - this.listSize);
				
				this.currFocus = this.position - tempStartPos;
				for(var i=0,j=tempStartPos ;j< this.dataSize ; j++,i++){
					this.listData[i] = j;
				}
				this.changeFocus(0);
			}else 	if ( tempEnd-1 == this.position  &&  num >0 ){
				
				this.position = 0;
				
				var tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize ;
				//iPanel.debug("----------tempEnd--="+tempEnd);
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
		//iPanel.debug("______event_isBeginOrEnd"+isBeginOrEnd);
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
		//iPanel.debug("class----showList---tempLen="+tempLen+";length="+this.listData.length+";this.listSize="+this.listSize);
		for(var i =0;i< this.listSize ; i++){
			if(i<tempLen){
				this.haveData({idPos:i,dataPos:this.listData[i]});
			}else{
				this.noData({idPos:i,dataPos:i});
			}
		}
		this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.maxPage = Math.ceil(this.dataSize/this.listSize);
		//iPanel.debug("_____event"+this.currPage);
		//iPanel.debug("_____event"+this.maxPage);
	}
	
	this.$ = function (id){
		if(typeof(f)=="object")
			return f.document.getElementById(id);
		else
			//return iPanel.mainFrame.document.getElementById(id);
			return window.document.getElementById(id);
	}

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
            //iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ",this.url=" + this.url);
        } else {
            //iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + ",this.abortFlag=" + this.abortFlag + ",this.url=" + this.url);
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
        this.xmlHttp.onreadystatechange = function() {
            //abort会触发一个失败的状态，这里将这个置空，避免异常
        };
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

function ajax_js(_url,fun){
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.overrideMimeType("text/html; charset=gbk");
	oXmlHttp.open('GET',_url, true);
	oXmlHttp.onreadystatechange = function() {
		if ( oXmlHttp.readyState == 4 )  {
			if ( oXmlHttp.status == 200 || oXmlHttp.status == 0) {
				fun(oXmlHttp.responseText);
			}
		}
	} 
	oXmlHttp.send(null);
}

/*---���û�ȡȫ�ֱ���----------------------------------------------*/
function setGlobalVar(sName, sValue) {
  try{ iPanel.setGlobalVar(sName,escape("" + sValue));}catch(e){ document.cookie = escape(sName) + "=" + escape(sValue);}
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
	var IPANEL30 = checkIPANEL30();
    function checkIPANEL30(){
        var userAgent = navigator.userAgent.toLowerCase();
        var flag = false;   
        if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel3.0
            flag = true;
        }
        return flag;
    }
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