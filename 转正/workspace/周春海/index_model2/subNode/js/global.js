function nowTime(formatStr,language){ 
	var str = formatStr; 
	var date = new Date();
	var Week = {
		cn:['������','����һ','���ڶ�','������','������','������','������'],
		en:['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
				
	}
	str=str.replace(/yyyy|YYYY/,date.getFullYear()); 
	str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100)); 
	str=str.replace(/MM/,(date.getMonth()+1)>9?(date.getMonth()+1).toString():'0' + (date.getMonth()+1)); 
	str=str.replace(/M/g,date.getMonth() + 1); 
	str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate()); 
	str=str.replace(/d|D/g,date.getDate()); 
	str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours()); 
	str=str.replace(/h|H/g,date.getHours()); 
	str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes()); 
	str=str.replace(/m/g,date.getMinutes()); 
	str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds()); 
	str=str.replace(/s|S/g,date.getSeconds()); 
	if(language=="en"){
		str=str.replace(/w|W/g,Week.en[date.getDay()]); 
	}
	else {
		str=str.replace(/w|W/g,Week.cn[date.getDay()]); 
	}
	return str; 
} 

/*----------------------------------------------------------------��ֵӳ��----------------------------------------------------------------------*/
var Event = {
	mapping: function(__event){
		__event=__event||event;
		var keycode = __event.which||__event.keyCode;	//alert(keycode);
		//console.log("global.js keycode = "+keycode);
		var code = "";
		var args = {};
		//if(keycode < 327 && keycode > 336){//������ӵļ�ֵ
		if(keycode < 58 && keycode > 47){//���ּ�
			args = {modifiers: __event.modifiers, value: (keycode - 48), type: 0, isGlobal: false};
			//iPanel.debug("global.js_Event_code_args.value=="+args.value);
			code = "KEY_NUMERIC";
		} else {
			var args = {modifiers: __event.modifiers, value: keycode, type: 0, isGlobal: false};
			switch(keycode){
				case 1:
				case 38:
				case 87:
					code = "KEY_UP";
					break;
				case 2:
				case 40:
				case 83:
					code = "KEY_DOWN";
					break;
				case 3:
				case 37:
				case 65:
				case 97:
					code = "KEY_LEFT";
					break;
				case 4:
				case 39:
				case 68:
				case 100:
					code = "KEY_RIGHT";
					break;
				case 13:
					code = "KEY_SELECT";
					break;
				case 339://Ĭ������ȥ��UI�е�eventpage�����˳�˫���ڱ�Ӧ���У����Ҫ�õ�����Ҫreturn 0;�ص�
				case 27:
					code = "KEY_EXIT";
					args.type = 1;
					break;
				case 340://Ĭ������ȥ���ڱ�Ӧ���У����Ҫ�õ�����Ҫreturn 0;�ص�
				case 283:
				case 8:
					code = "KEY_BACK";
					break;
				case 832:
				case 320:
					code = "KEY_RED";
					args.type = 1;
					break;
				case 45://������
					code = "KEY_VOLUME_UP";
					break;
				case 61://������
					code = "KEY_VOLUME_DOWN";
					break;
				case 835://blue
				case 323:
					code = "KEY_BLUE";
					break;
				case 322:
					code = "KEY_YELLOW";
					args.type = 1;
					break;
				case 833:
					code = "KEY_GREEN";
					break;
				case 372:
				case 290:
				case 306:
				case 33:
					code = "KEY_PAGE_UP";
					break;
				case 373:
				case 291:
				case 307:
				case 34:
					code = "KEY_PAGE_DOWN";
					break;
				case 67:
				case 99:
					code = "KEY_MUTE";
					break;
				case 72://Ĭ������ȥ���ڱ�Ӧ���У����Ҫ�õ�����Ҫreturn 0;�ص�
				case 104:
					code = "KEY_HOMEPAGE";
					args.type = 1;
					break;
				case 513://Ĭ������ȥ���ڱ�Ӧ���У����Ҫ�õ�����Ҫreturn 0;�ص�
				case 104:	
					code = "KEY_MENU";
					args.type = 1;
					break;
				case 10909:
					code = "NGOD_C1_ANNOUNCE";
					break;
				case 5500:
				case 12057:	
					code = "IP_NETWORK_CONNECT";
					break;
				case 5501:
				case 12056:
					code = "IP_NETWORK_DISCONNECT";
					break;
				case 5502:
				case 12059:
					code = "IP_NETWORK_READY";
					break;
				case 5503:
				case 12058:
					code = "IP_NETWORK_FAILED";
					break;
				case 5551:
				case 10002:
					code = "CABLE_CONNECT_FAILED";
					break;
				case 5550:
				case 10001:	
					code = "CABLE_CONNECT_SUCCESS";
					break;
				case 13001:								
					code = "MSG_MEDIA_URL_VALID";				
					break;
				case 13002:								
					code = "MSG_MEDIA_URL_INVALID";				
					break;
				case 13003:								
					code = "MSG_MEDIA_PLAY_SUCCESS";			
					break;
				case 13004:								
					code = "MSG_MEDIA_PLAY_FAILED";				
					break;
				case 13005:								
					code = "MSG_MEDIA_SETPACE_SUCCESS";			
					break;
				case 13006:								
					code = "MSG_MEDIA_SETPACE_FAILED";			
					break;
				case 13007:								
					code = "MSG_MEDIA_SEEK_SUCCESS";			
					break;
				case 13008:								
					code = "MSG_MEDIA_SEEK_FAILED";				
					break;
				case 13009:								
					code = "MSG_MEDIA_PAUSE_SUCCESS";			
					break;
				case 13010:								
					code = "MSG_MEDIA_PAUSE_FAILED";			
					break;
				case 13011:								
					code = "MSG_MEDIA_RESUME_SUCCESS";			
					break;
				case 13012:								
					code = "MSG_MEDIA_RESUME_FAILED";			
					break;
				case 13013:								
					code = "MSG_MEDIA_STOP_SUCCESS";			
					break;
				case 13014:								
					code = "MSG_MEDIA_STOP_FAILED";				
					break;
				default:
					code = "OTHER_EVENT";
					args.type = 1;
					break;
			}
		}
		return {code: code, args: args};
	}
};

function $(__id){
	return document.getElementById(__id);
}

var tmpAgent = navigator.userAgent.toLowerCase();
if (tmpAgent.indexOf("android") > -1) {
	tmpAgent = "android";       //android
} else if (tmpAgent.indexOf("coship") > -1) {
	tmpAgent = 'coship';		//ͬ��
} else if (tmpAgent.indexOf('hi3110') > -1 || tmpAgent.indexOf('i686') > -1) {
	tmpAgent = 'huawei';		//��Ϊ
} else if (tmpAgent.indexOf('ipad') > -1) {
	tmpAgent = 'suma_vision';	//������Ѷ
} else if (tmpAgent.indexOf('gefo') > -1) {
	tmpAgent = 'cntv';		//CNTV
} else if (tmpAgent.indexOf('ipanel') > -1) {
	tmpAgent = 'ipanel';		//��׳
} else if (tmpAgent.indexOf('firefox') > -1) {
	tmpAgent = 'dvn';			//���
} else {
	tmpAgent = 'suma_vision';	//Ĭ��������Ѷ
}
switch (tmpAgent) {
case 'coship':
case 'huawei':
	document.onkeypress = function () {return eventHandler(Event.mapping(event), 1);};
	break;
case 'ipanel':
case 'suma_vision'://��google������ܣ���ȡ������suma_vision
	//document.onkeypress = function () {console.log("onkeypress");return eventHandler(Event.mapping(event), 1);};//google�ܴ����¼���onkeydown
	document.onkeydown = function () {return eventHandler(Event.mapping(event), 1);};
	document.onirkeypress = function () {return eventHandler(Event.mapping(event), 1);};
	document.onsystemevent = function () {return eventHandler(Event.mapping(event), 2);};
	break;
case 'cntv':
case 'dvn':
	document.onkeydown = function () {return eventHandler(Event.mapping(event), 1);};
	break;
default:
	document.onkeypress = function () {return eventHandler(Event.mapping(event), 1);};
	break;
}


/*��ȡurl������Ĳ���*/
function RequestUrl(__url, argname){ 
	var arrStr = __url.substring(__url.indexOf("?")+1).split("&"); 
	for(var i =0;i<arrStr.length;i++){ 
		var loc = arrStr[i].indexOf(argname+"="); 
		if(loc!=-1){ return arrStr[i].replace(argname+"=","").replace("?",""); break; } 
	} 
	return ""; 
}

/*--------------------------------------------------------------------------showList��װ----------------------------------------------------------------*/
/*
 * showList��������þ��ǿ�����ҳ���б�������Ϣ���¹����л��Լ���ҳ��
 * @__listSize    �б���ʾ�ĳ��ȣ�
 * @__dataSize    �������ݵĳ��ȣ�
 * @__position    ���ݽ����λ�ã�
 * @__startplace  �б���Div��ʼλ�õ�ֵ��
 */
function showList(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? window : __f;
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

/**********************************��������ScrollBar��װ*****************************************/
/**
 * ��������������ʾ��ǰλ��ռ��λ�õı���
 * @param id ���Ի�����ģ��
 * @param barId ���ƻ�����Χ��ģ��
 */
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



/*----------------------------------------------------------------------����Ч����װ-----------------------------------------------------------------*/
/*
 * _listSize: ��ʾ�ĳ���
 * _dataSize: ���ݳ���
 * _pos: ����λ��
 * _focusPos: ����λ��
 * _time: �ƶ�ʱ�䣬Ĭ��200ms
 * _frame: window
 */
function showListCSS2D(_listSize, _dataSize, _pos, _focusPos, _time, _frame) {		 
	this.listSize = _listSize;
	this.dataSize = _dataSize;
	this.position = parseInt(_pos, 10);
	this.currFocus = _focusPos || 0; // �����λ��
	this.time = typeof(_time) == "undefined" ? "400ms" : _time;
	this.with2D = this.time != 0 ? true : false;
	this.frame = _frame;

	this.haveData = function() {}; //��ʾ���ݵ�����
	this.noData = function() {}; //�����DIV���ص�
	this.arrTop = []; //div�Ľ���λ��
	this.startTop = {}; //���һ��
	this.endTop = {};
	this.arrTopObj = []; //div�Ķ���

	//����
	this.endFocus = 0;
	this.startFocus = 0;
	this.hideDivFlag = "right";
	this.hideDivTimeout = -1;

	//�ڲ�����
	this.listData = []; //���ݵĵ��б�
	this.listDiv = []; //��¼DIV��λ�ý���
	this.allFlag = true; //true��ʾ��������false��ʾ���ݲ���

	this.startShow = function() {
		for (var i = 0, len = this.arrTopObj.length; i < len; i++) {
			this.arrTopObj[i] = this.$(this.arrTopObj[i]);
		}
		if (this.listSize > this.dataSize) {
			this.allFlag = false;
			for (var i = this.dataSize + 1; i < this.listSize + 1; i++) {
				this.noData({
					idPos: i
				});
			}
		} else {
			this.allFlag = true;
		}
		this.initData();
		this.showList();
	};

	this.getFocusPos = function() {
		return {
			idPos: this.currFocus,
			dataPos: this.position,
			focusPos: 0
		}
	};

	this.initData = function() { //��ʼ������
		this.listData = [];
		this.listDiv = [];
		if (this.dataSize == 0) {
			return;
		}
		if (!this.allFlag) { //false
			var tempLength = this.listSize - this.dataSize;
			var tempPos0 = Math.ceil(tempLength / 2);
			this.listSize = this.dataSize;
			this.currFocus = Math.ceil((this.dataSize - 1) / 2); //�ı佹��λ��
			this.startTop = {
				width: "0px",
				height: "0px",
				top: "0px",
				left: "0px"
			};
			this.startTop.width = this.arrTop[tempPos0 - 1].width;
			this.startTop.height = this.arrTop[tempPos0 - 1].height;
			this.startTop.top = this.arrTop[tempPos0 - 1].top;
			this.startTop.left = this.arrTop[tempPos0 - 1].left;
			var temparrTop = this.arrTop;
			this.arrTop = [];
			for (var i = tempPos0, j = 0; j < this.dataSize + 1; i++, j++) {
				var tempObj = {
					width: "0px",
					height: "0px",
					top: "0px",
					left: "0px"
				};
				tempObj.width = temparrTop[i].width;
				tempObj.height = temparrTop[i].height;
				tempObj.top = temparrTop[i].top;
				tempObj.left = temparrTop[i].left;
				this.arrTop[j] = tempObj;
			}
		}

		for (var i = this.currFocus, j = 0; i < this.listSize + 1; j++, i++) {
			this.listData[i] = (this.position + j) % this.dataSize;
			this.listDiv[i] = (this.currFocus + j) % (this.listSize + 1);
		}

		for (var i = 0, j = this.currFocus - 1; i < this.currFocus; j--, i++) {
			this.listData[j] = (this.position - i - 1 + this.dataSize) % this.dataSize;
			this.listDiv[j] = (this.currFocus - i + this.listSize) % (this.listSize + 1);
		}
		for (var i = 0; i < this.listSize + 1; i++) {
			this.focusData({
				idPos: this.listDiv[i],
				dataPos: i,
				num: 0,
				flag: 0
			});
		}

		this.endFocus = this.listDiv[0]; //��һ��
		this.startFocus = this.listDiv[this.listSize]; //��ʾ���һ������Ҫ����
		//if (!this.allFlag) { //false
			//this.arrTopObj[this.startFocus].style.opacity = 0;
		//}
	};

	this.getData = function(_num) {
		var tempList = this.listData;
		var temp = 0;
		if (_num > 0) {
			var start = this.listData[0];
			for (var i = 0; i < this.listSize; i++) {
				this.listData[i] = this.listData[i + 1] % this.dataSize;
			}
			this.listData[this.listSize] = (this.listData[this.listSize] + _num + this.dataSize) % this.dataSize;
		} else {
			var start = this.listData[0];
			for (var i = this.listSize; i > 0; i--) {
				this.listData[i] = this.listData[i - 1];
			}
			this.listData[0] = (start + _num + this.dataSize) % this.dataSize;
		}
	};

	this.changeList = function(_num) { //����
		if (this.dataSize == 0) {
			return;
		}
		this.position = (this.position + _num + this.dataSize) % this.dataSize;
		//iPanel.debug("showListCss2dClass_changeList_position=="+this.position);
		this.currFocus = (this.currFocus + _num + (this.listSize + 1)) % (this.listSize + 1);
		this.changeFocus(_num);
		this.getData(_num);
		this.showList();
	};

	this.changeFocus = function(_num) {
		if (_num < 0) { //����Բʵ�ַ�ʽ��һ��
			for (var i = 0; i < this.listSize + 1; i++) {
				this.focusData({
					idPos: this.listDiv[this.listSize],
					dataPos: 0,
					num: _num,
					flag: 0
				});
			}
			var t = this.listDiv[this.listSize];
			for (var i = this.listSize; i > 0; i--) {
				this.listDiv[i] = this.listDiv[i - 1];
			}
			this.listDiv[0] = t;

			this.endFocus = this.listDiv[0];
			this.startFocus = this.listDiv[this.listSize];
		} else {
			//iPanel.debug("showListCss2dClass changeFocus this.listSize=="+this.listSize);
			for (var i = 0; i < this.listSize + 1; i++){
				this.focusData({
					idPos: this.listDiv[i],
					dataPos: i,
					num: _num,
					flag: 0
				});
			}
			this.endFocus = this.listDiv[0];
			this.startFocus = this.listDiv[this.listSize];

			var t = this.listDiv[0];
			for (var i = 0; i < this.listSize; i++) {
				this.listDiv[i] = this.listDiv[i + 1];
			}
			this.listDiv[this.listSize] = t;
		}
		
		//iPanel.debug("showListCss2dClass changeFocus this.endFocus="+this.endFocus);
		this.changeHideDiv(_num);
		var self = this;
		clearTimeout(this.hideDivTimeout);
		this.hideDivTimeout = setTimeout(function(){
			for (var i = 0; i < self.listSize + 1; i++) {
				self.focusData({
					idPos: self.listDiv[i],
					dataPos: i,
					num: _num,
					flag: 1
				});
			}
		},10);
		
	};

	this.changeHideDiv = function(_num){
		//iPanel.debug("showListCss2dClass changeHideDiv this.hideDivFlag="+this.hideDivFlag);
			if(_num > 0){
				if(this.hideDivFlag == "left"){
					var tempPos = this.endFocus == 0 ? (this.listSize) : (this.endFocus - 1); 
					if (this.with2D == true) {
						this.arrTopObj[tempPos].style.webkitTransitionDuration = "0s";
					}
					for (var key in this.endTop) {
						this.arrTopObj[tempPos].style[key] = this.endTop[key];
					}
				}
			}
			else{
				if(this.hideDivFlag == "right"){
					if (this.with2D == true) {						
						this.arrTopObj[this.endFocus].style.webkitTransitionDuration = "0s";
					}
					for (var key in this.startTop) {
						this.arrTopObj[this.endFocus].style[key] = this.startTop[key];
					}
				}
			}

			if(this.hideDivFlag == "right" && _num > 0){
				this.hideDivFlag = "left"; 
			}
			if(this.hideDivFlag == "left" && _num < 0){
				this.hideDivFlag = "right"; 
			}
	}

	this.focusData = function(_list) {
		if (_list.flag == 0) {
			if (this.with2D == true) {
				this.arrTopObj[_list.idPos].style.webkitTransitionDuration = "0s";
			}
			if (_list.num < 0) {
				var obj = this.startTop;
			} else {
				var obj = this.arrTop[_list.dataPos];
			}
			for (var key in obj) {
				this.arrTopObj[_list.idPos].style[key] = obj[key];
			}
			if (this.with2D == true) {
				this.arrTopObj[_list.idPos].style.webkitTransitionDuration = this.time;
			}
		} else {
			if (this.with2D == true) {
				this.arrTopObj[_list.idPos].style.webkitTransitionDuration = this.time;
			}

			if (_list.idPos == this.endFocus) {
				if(_list.num > 0){
					for (var key in this.startTop) {
						this.arrTopObj[_list.idPos].style[key] = this.startTop[key];
					}
					return;
				}
				else{
					//iPanel.debug("focusData_this.arrTopObj[_list.idPos].style.left="+this.arrTopObj[_list.idPos].style.left);
					for (var key in this.arrTop[0]) {
						this.arrTopObj[_list.idPos].style[key] = this.arrTop[0][key];
					}

					return;
				}
			}

			for (var key in this.arrTop[_list.dataPos]) {
				this.arrTopObj[_list.idPos].style[key] = this.arrTop[_list.dataPos][key];
			}
		}
	};

	this.showList = function() {
		if (this.dataSize == 0) {
			return;
		}
		for (var i = 0; i < this.listSize; i++) {
			this.haveData({
				idPos: this.listDiv[i],
				dataPos: this.listData[i]
			});
		}
	};

	this.$ = function(_id) {
		if (typeof(_id) == "object") {
			return _id;
		}
		return this.frame.document.getElementById(_id);
	};
}

/**--------------------------------------------------------ajax�����װ_start--------------------------------------------------------------------------**/
function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
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
		//iPanel.debug("[xmlHttp] responseText: " + _xmlHttp.responseText);
	};
	this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
		//iPanel.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
	};
	this.urlParameters = _urlParameters || "";
	this.callbackParams = _callbackParams || null;
	this.async = typeof(_async) == "undefined" ? true : _async;
	this.charset = _charset || null;
	this.timeout = _timeout || 30000; //15s
	this.frequency = _frequency || 10000; //10s
	this.requestTimes = _requestTimes || 0;
	this.frame = _frame || window;

	this.timer = -1;
	this.counter = 0;

	this.method = "GET";
	this.headers = null;
	this.username = "";
	this.password = "";

	this.checkTimeout = 500;
	this.checkTimer = -1;
	this.checkCount = -1;

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
		this.xmlHttp = this.createXmlHttpRequest();
		this.frame.clearTimeout(this.timer);
		this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
		this.headers = typeof(_headers) == "undefined" ? null : _headers;
		this.username = typeof(_username) == "undefined" ? "" : _username;
		this.password = typeof(_password) == "undefined" ? "" : _password;

		var target = this;
		this.xmlHttp.onreadystatechange = function() {
			target.stateChanged();
		};
		if (this.method == "POST") { //encodeURIComponent
			var url = encodeURI(this.url);
			var data = this.urlParameters;
		} else {
			//var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
			var url = this.url;//encodeURI(encodeURI(this.url));
			//iPanel.debug("xmlHttp get url="+url);
			var data = null;
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
		//iPanel.debug("[xmlHttp] requestData " + this.method + " url: " + url + ", data: " + data);
		this.xmlHttp.send(data);
		this.checkReadyState();
		this.timer = this.frame.setTimeout(function(){
			target.checkStatus();
		}, this.timeout);
	};
	this.checkReadyState = function(){
		var target = this;
		this.frame.clearTimeout(this.checkTimer);
		this.checkTimer = this.frame.setTimeout(function() {
			//iPanel.debug("global checkReadyState target.xmlHttp.readyState="+target.xmlHttp.readyState);
			//iPanel.debug("global checkReadyState target.xmlHttp.status="+target.xmlHttp.status);
			if(target.xmlHttp.readyState == 4 && (target.xmlHttp.status == 200 || target.xmlHttp.status == 204 || target.xmlHttp.status == 0)){
				target.stateChanged();
			}
			else{
				target.checkCount++;
				if((target.checkCount * target.checkTimeout) >= target.timeout){
					target.checkStatus();
				}
				else {
					target.checkReadyState();
				}
			}
        }, this.checkTimeout);
	};
	this.stateChanged = function() { //״̬����
	//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
		if (this.xmlHttp.readyState < 2) {
			
		} else {
			//iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
		}

		var target = this;
		if (this.xmlHttp.readyState == 2) {
		/*this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout); */
		} else if (this.xmlHttp.readyState == 3) {
			if (this.xmlHttp.status == 401) {
				//iPanel.debug("[xmlHttp] Authentication, need correct username and pasword");
			}
		} else if (this.xmlHttp.readyState == 4) {
			this.frame.clearTimeout(this.timer);
			this.frame.clearTimeout(this.checkTimer);
			if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 ||this.xmlHttp.status == 0){
				////iPanel.debug("[xmlHttp] this.xmlHttp.resposeText=" + this.xmlHttp.responseText);
				this.success();
			}
			/*else if(this.xmlHttp.status == 0){
				//iPanel.debug("global_stateChanged_this.xmlHttp.status==0--һ��Ϊ0��״̬�ǿ��﷢��");
			}*/else {
				//iPanel.debug("global_stateChanged_this.xmlHttp.status=="+this.xmlHttp.status);
				this.failed();
			}
		}
	};
	this.success = function() {
		this.checkCount = -1;
		this.frame.clearTimeout(this.checkTimer);
		if (this.callbackParams == null) {
			this.successCallback(this.xmlHttp);
		} else {
			this.successCallback(this.xmlHttp, this.callbackParams);
		}
		this.counter = 0;
	};
	this.failed = function() {
		this.checkCount = -1;
		this.frame.clearTimeout(this.checkTimer);
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
		this.checkCount = -1;
		this.frame.clearTimeout(this.timer);
		this.frame.clearTimeout(this.checkTimer);
		////iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp="+typeof this.xmlHttp);
		////iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp.abort="+typeof this.xmlHttp.abort);
		//abort()��������ֹͣһ��XMLHttpRequest�����HTTP�����󣬰Ѹö���ָ�����ʼ״̬
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
		} else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
			return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
		}
		return null;
	};
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

function jsonToString(_obj) {
	if (typeof(JSON) == "object" && typeof(JSON.stringify) == "function") {
		return JSON.stringify(_obj);
	}
	var THIS = this;
	switch (typeof(_obj)) {
	case "string":
		return "\"" + _obj.replace(/(["\\])/g, "\\$1") + "\"";
	case "array":
		return "[" + _obj.map(THIS.jsonToString).join(",") + "]";
	case "object":
		if (_obj instanceof Array) {
			var strArr = [];
			var len = _obj.length;
			for (var i = 0; i < len; i++) {
				strArr.push(THIS.jsonToString(_obj[i]));
			}
			return "[" + strArr.join(",") + "]";
		} else if (_obj == null) {
			return "null";
		} else {
			var string = [];
			for (var property in _obj) {
				string.push(THIS.jsonToString(property) + ":" + THIS.jsonToString(_obj[property]));
			}
			return "{" + string.join(",") + "}";
		}
	case "number":
		return _obj;
	default:
		return _obj;
	}
}

/*-------------------------------------------------�㶫ʡ���м���淶�����û�ȡȫ�ֱ���----------------------------------------------*/
/*
function setGlobalVar(sName, sValue) {
	try{ iPanel.setGlobalVar(sName,escape("" + sValue));}catch(e){ document.cookie = escape(sName) + "=" + escape(sValue);}
}

function getGlobalVar(sName){
	var result = null;
	try{ 
		result = iPanel.getGlobalVar(sName);
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
//*/
/*�õ����ܿ���*/
function getSmartCardId(){ 
	try{
		return typeof CAManager != "undefined" ? CAManager.cardSerialNumber : (typeof CA != "undefined" ? (CA.serialNumber || CA.card.serialNumber) : "");
	} catch (e){ 
		return "";
	} 
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
/** * ��Date����չ���� Date ת��Ϊָ����ʽ��String * ��(M)����(d)��12Сʱ(h)��24Сʱ(H)����(m)����(s)����(E)������(q)
    ������ 1-2 ��ռλ�� * ��(y)������ 1-4 ��ռλ��������(S)ֻ���� 1 ��ռλ��(�� 1-3 λ������) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 �� 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 �ܶ� 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 ���ڶ� 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */        
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //�·�         
    "d+" : this.getDate(), //��         
    "h+" : this.getHours(), //Сʱ         
    "H+" : this.getHours(), //Сʱ         
    "m+" : this.getMinutes(), //��         
    "s+" : this.getSeconds(), //��         
    "q+" : Math.floor((this.getMonth()+3)/3), //����         
    "S" : this.getMilliseconds() //����         
    };         
    var week = {         
    "0" : "��",         
    "1" : "һ",         
    "2" : "��",         
    "3" : "��",         
    "4" : "��",         
    "5" : "��",         
    "6" : "��"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "����" : "��") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}

function setGlobalVar(sName,sValue) {
	try {
		if(typeof GlobalVarManager != "undefined") {
			if(typeof sValue == "string") {
				GlobalVarManager.setItemStr(sName,sValue);
			} else {
				GlobalVarManager.setItemValue(sName, sValue);
			}
		} else if(typeof iPanel != "undefined") {
			iPanel.setGlobalVar(sName, sValue);
		} else {
			sessionStorage.setItem(sName, sValue);
		}
	} catch(e) {
		document.cookie = escape(sName) + "=" + escape(sValue);
	}
}

function getGlobalVar(sName) {
	var result = null;
	try {
		if(typeof GlobalVarManager != "undefined") {
			result = GlobalVarManager.getItemValue(sName);
			if(!isValid(result)) {
				result = GlobalVarManager.getItemStr(sName);
			}
		} else if(typeof iPanel != "undefined") {
			result = iPanel.getGlobalVar(sName);
		} else {
			result = sessionStorage.getItem(sName);
		}
	} catch(e) {
		var aCookie = document.cookie.split("; ");
		for (var i = 0,num=aCookie.length; i < num; i++) {
			var aCrumb = aCookie[i].split("=");
			if(escape(sName) == aCrumb[0]) {
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}

function delGlobalVar(sName) {
	try {
		if(typeof(GlobalVarManager) != "undefined") {
			GlobalVarManager.removeItem(sName);
		} else if(typeof iPanel != "undefined") {
			iPanel.delGlobalVar(sName);
		} else {
			sessionStorage.removeItem(sName);
		}
	} catch(e) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getGlobalVar(sName);
		document.cookie = sName + "=" + cval + "; expires=" + exp.toGMTString();
	}
}

function isValid(arg) {
	if(arg != null && arg != "" && arg != "undefined" && typeof arg != "undefined" && !isNaN(arg)) {
		return true;
	} 
	return false;
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
		if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {
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


/*
 * showList��������þ��ǿ�����ҳ���б�������Ϣ���¹����л��Լ���ҳ��
 * @__listSize    �б���ʾ�ĳ��ȣ�
 * @__dataSize    �������ݵĳ��ȣ�
 * @__position    ���ݽ����λ�ã�
 * @__startplace  �б���Div��ʼλ�õ�ֵ��
 */
function showList1(__listSize, __dataSize, __position, __startplace, __f){
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

function sortBy(filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
};
