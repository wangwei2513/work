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
				if (flag == 1)return str.substring(0,i-1)+"..";  //�޸�,sunny,��ֹ����...
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



function getUrlArgs(_name, str){
	var flag = new RegExp(".*\\b"+_name+"\\b(\\s*=([^&]+)).*", "gi").test(str);
	if(flag){
		return RegExp.$2;
	}else{
		return "";
	}
}

var timer=-1;
function showTime(){//ʵʱʱ��
	clearTimeout(timer);
	var now= new Date();//��ȡ��ǰʱ��
	var year0 = (now.getFullYear()).toString(); //��
	var month0 = (now.getMonth()+1).toString(); //��
	var date0 = (now.getDate()).toString(); //��
	var hour0=(now.getHours()).toString();//ʱ
	var minute0=(now.getMinutes()).toString();//��
	var second0=(now.getSeconds()).toString();//��
	if(month0<10)month0="0"+month0;
	if(date0<10)date0="0"+date0;
	if(hour0<10)hour0="0"+hour0;
	if(minute0<10)minute0="0"+minute0;
	if(second0<10)second0="0"+second0;
	$("time").innerText=year0+"/"+month0+"/"+date0+"  "+hour0+":"+minute0+":"+second0;
	timer = setTimeout('showTime()',1000);
}




function ScrollBar(id, barId, f) {
	this.obj = null;
	this.barObj = null;
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = f.document.getElementById(barId);
		}
	}else{
		this.obj =document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = document.getElementById(barId);
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
		}else{
			this.obj.style.height = Math.round(barLength) + "px";
		}
		this.endPos = this.startPos + (maxBarLength - barLength);
	}else{
		this.endPos = this.startPos + maxBarLength;
	}
	if(totalNum > 1){
		this.footStep = (this.endPos - this.startPos) / (totalNum - 1);
	}else{
		this.footStep = 0;
	}
};

ScrollBar.prototype.scroll = function(currPos) {
	var tempPos = this.startPos + this.footStep * currPos;
	this.obj.style.top = Math.round(tempPos) + "px";
}

function $(__id){
	return document.getElementById(__id);
}


function iDebug(_str){
	if(navigator.appName.indexOf("iPanel")>-1){
		iPanel.debug(_str);
	}else if(navigator.appName.indexOf("Netscape")>-1 || navigator.appName.indexOf("Google")>-1){
		console.log(_str);
	}else if(navigator.appName.indexOf("Opera")>-1){
		opera.postError(_str);
	}
}