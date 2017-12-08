var undefined;
//var appUrl = "http://192.168.60.88:8080";	//����Ӧ�������ص�·��
var appUrl = "http://apps.homed.tv";		//����Ӧ�������ص�·��
var __isPreload = false;			//�Ƿ�Ԥ�أ�false: ������iPanel��Ԥ�أ�true������new Image��Ԥ��
var inIpanel = false;
if (navigator.appName.indexOf("iPanel")!=-1){
	//inIpanel = true;
}
/**
 +------------------------------------------------------------------------------
 * ʱ�亯��
 +------------------------------------------------------------------------------
	 ���ڸ�ʽ�� 
	 ��ʽ YYYY/yyyy/YY/yy ��ʾ��� 
	 MM/M �·� 
	 W/w ���� 
	 dd/DD/d/D ���� 
	 hh/HH/h/H ʱ�� 
	 mm/m ���� 
	 ss/SS/s/S �� 
 +------------------------------------------------------------------------------
 */
function nowTime(formatStr,language){ 
	var str = formatStr; 
	var date = new Date();
	var Week = {
		cn:['��','һ','��','��','��','��','��'],
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


/*
 +------------------------------------------------------------------------------
 * ����ͼƬ����
 +------------------------------------------------------------------------------
 	var str = 0.21; //�ַ���������
	var imgObj = {
		"0":"images/score_0.png", 
		����
		"9":"images/score_9.png",
		".":"images/score_..png", //С����
		"clear":"images/tm.png" //���
		
	};
	var idName = "num"; //ͼƬIDǰ׺����
	var numLength = 4 ; //����ʾ��λ��
 +------------------------------------------------------------------------------
*/
function numImgchange(_str,_imgObj,_idName,_length){
	var str = new String(_str);
	var imgObj = _imgObj;
	for(var i=0; i<5; i++){
		if(i<str.length){
			var n = str.charAt(str.length-1-i);
			$(_idName+i).src = imgObj[n];
		}
		else $(_idName+i).src = imgObj["clear"]; //��� ͸��ͼƬ
	}
}

/**
 +------------------------------------------------------------------------------
 * ����������
 +------------------------------------------------------------------------------
 * @param {string} obj ���������div��id
 * @param {string} barId �������ɱ䲿�ֵ�id
 * @param {number} dataLength �ܵ����ݵĳ��� 
 * @param {number} listSize   �б�ĳ���
 * @param {number} maxLength  Ҫ����������ĳ���
 * @param {number} startPos  ��ʼ��λ��
 * @param {number} type  	���������ͣ�0 or "undefined":��ʾbarId ����Ҫ�ı����ĳ��ȣ� 1:�����б���������鳤�ȣ��һ����ı�top,height����
 * @param {string} duration  ������ʱ��
 
 args:{obj:"", barId:"",  duration:"", datalength:a, listSize:b, maxLength:c, startPos:d, type:e,}
 +------------------------------------------------------------------------------
 */
function scrollBar(args){
	this.obj = args.obj;	//�����ػ����ID
	this.barId = args.barId; 	//���������ͼƬ
	this.dataLength = args.dataLength;	//�����ݵĳ���
	this.listSize = args.listSize;	//�ɼ��б�ĳ���
	this.maxLength = args.maxLength;		//����ĳ���
	this.startPos = args.startPos;	//���λ��
	this.duration = args.duration;
	this.type = args.type; 	//��ǰ���������ͣ�0 or "undefined":��ʾbarId ����Ҫ�ı����ĳ��ȣ� 1:�����б���������鳤�ȣ��һ����ı�top,height����
	this.endPos = 0;
	this.scrollStep = 0;
	this.f = args.f || window;		//��ǰ����
	
	//��������ʹ��
	this.initScroll = function(){
		this.setDocument();
		this.showScrollInfo();
	}
	
	//����dom
	this.setDocument = function(){
		this.obj = this.$(this.obj);
		this.obj.style.webkitTransitionDuration = this.duration;
		if(typeof this.barId != "undefined"){
			this.barId = this.$(this.barId);
			//this.barId.style.webkitTransitionDuration = this.duration;
		}
	}
	
	//����scroll����Ϣ
	this.showScrollInfo = function(){
		var percent = 1;
		if(this.dataLength > this.listSize){
			percent = this.listSize/this.dataLength;
		}
		var barLength = percent*this.maxLength;
		if(typeof this.type != "undefined"  && this.type != 0){		//this.type����undefined �� this.type ��Ϊ0, Ҫ�ı䳤��
			if(typeof this.barId != "undefined"){	//��������barIdû����ģ����ı�id
				this.barId.style.height = Math.round(barLength) + "px";	
			}else{
				this.obj.style.height = Math.round(barLength) + "px";
			}	
			this.endPos = this.startPos + this.maxLength - barLength;		//��������յ�λ�ã� ��Ϊ����һ������ĳ��ȣ�Ҫ��ȥ
		}else{
			this.endPos = this.startPos + this.maxLength;	
		}
		if(this.dataLength > 1){	// ��ʣ��Ŀռ�ֳ� this.dataLength - 1 �ݣ�ÿ��Ϊthis.scrollStep
			this.scrollStep = (this.endPos - this.startPos)/(this.dataLength - 1);	
		}else{
			this.scrollStep = 0;
		}
	}
	
	//��������
	this.scroll = function(_pos){
		var tempValue = this.startPos + this.scrollStep * _pos;
		this.obj.style.top = Math.round(tempValue) + "px";
	}
	
	//��д
	this.$= function(id) {
		if(typeof(this.f) == "object"){
			return this.f.document.getElementById(id);
		}
		else{
			return document.getElementById(id);
		}
	}
}


/*
 +------------------------------------------------------------------------------
 * �����˵�����
 +------------------------------------------------------------------------------
	var parmObj = {
		divIdName:      "D",
		fixPos:          2,             //������λ�� D2
		menuDivAmount:   6,             //����DIV������
		menuLength:      tmArray.length //�����ܳ���
	};
 +------------------------------------------------------------------------------
*/
function fixFocusMenu(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.divIdName = _parmObj.divIdName;
	this.fixPos = _parmObj.fixPos; //������λ��
	this.menuPos = 0; //�����Ӧ������Ĭ��λ��
	this.menuDivAmount = _parmObj.menuDivAmount;
	this.record = []; //��¼ID
	this.menuLength = _parmObj.menuLength;	
	this.duration = 300;
	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.changeFrom = function(){};//�ı�˵���״̬
	
	this.showMenu = function (){
		var posArr = [];
		for(var i=0;i<this.menuDivAmount;i++){
			this.record[i] = i;
			if(i<this.fixPos)posArr[i] = (this.menuPos+this.menuLength-this.fixPos+i)%this.menuLength;
			else if(i==this.fixPos)posArr[i]=this.menuPos;
			else posArr[i] = (this.menuPos+i-this.fixPos)%this.menuLength;
		}
		for(var i=0;i<this.record.length;i++)this.haveData(this.record[i],posArr[i]);
	}
	
	this.changeFocus = function(_num){
		
		this.menuPos+=_num;
		if(this.menuPos<0)this.menuPos = this.menuLength-1;
		else if(this.menuPos>this.menuLength-1)this.menuPos = 0;
		
		for(var i=0;i<this.record.length;i++){
			this.record[i]= (_num>0)?(this.record[i]+1)%this.record.length:(this.record[i]+this.record.length-1)%this.record.length;
	//		add("this.record["+i+"]="+this.record[i]);
			var recordPos = this.record[i]
			if(_num>0&&i==this.record.length-1){//����
				this.$(this.divIdName+recordPos).style.webkitTransitionDuration = 0;
				this.haveData(recordPos,(this.menuPos+this.record.length-1-this.fixPos)%this.menuLength);
			}
			else if(_num<0&&i==0){
				this.$(this.divIdName+recordPos).style.webkitTransitionDuration = 0;
				this.haveData(recordPos,(this.menuPos+this.menuLength-this.fixPos)%this.menuLength);
			}
			else {
				this.$(this.divIdName+recordPos).style.webkitTransitionDuration = this.duration;
			}
		}
		this.changeFrom();
	}
	/* Ѱ�ҵ�ǰ�����Ӧ��ID ������һ��ID number */
	this.currId = function(){
		currId = this.record[this.fixPos];
		return currId;
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
//	this.duration = _parmObj.duration || 2000;
	this.duration = _parmObj.duration || 20;
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
	this.topDivTop = parseInt(this.firstDivTop-this.rowHeight); //�ƶ���DIV�������λ�ã�
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.listSize).style[this.direction]);//�ƶ���DIV�������λ�ã�
	this.actionCompleteFlag = true;
	this.t0 = -1;
	this.t1 = -1;
	
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
//		add("this.listPos="+this.listPos+"---position="+position+"---this.focusPos="+this.focusPos);
		for(var i=0; i<this.listSize+1; i++){
			this.recordLdiv[i]=i;
			if(i+position<this.arrLength){
//				add("i="+i+"---position="+position+"---this.arrLength="+this.arrLength);
				this.haveData(i,i+position);
			}
			
		}
	}
	
	
	/*��DIV�ƶ�*/
	this.moveLdiv = function(_num){
		//clearTimeout(this.t0);
		//clearTimeout(this.t1);
		if(!this.actionCompleteFlag) return;
        var self = this;
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
		var tmp =  _num>0?this.bottomDivTop:this.topDivTop;
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] =tmp+"px";	
		// this.t0 = setTimeout(function(){
		// 	$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style[self.direction] =tmp+"px";	
		// },10);
		
		var tmpNum = _num;
		this.actionCompleteFlag = false;
		this.t1 = setTimeout(function(){
			//console.log(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]+"==============");
			//$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style.webkitTransitionDuration = self.duration+2000+"ms";
			for(var i=0;i<self.listSize+1;i++){
				$(self.rowDivName+i).style.webkitTransitionDuration = self.duration+"ms";
				$(self.rowDivName+i).style[self.direction] =(parseInt($(self.rowDivName+i).style[self.direction]) -  _num*self.rowHeight )+"px";
			}
			self.reLdiv(tmpNum);
            self.actionCompleteFlag = true;
		}, 10);
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
		this.focusObj.style[this.direction] = this.focusStartPos + this.rowHeight*this.focusPos +"px";
	}
	
	/*�ƶ�����ĺ���*/ 
	this.changeFocus =  function(_num){
		var focusPosTemp = this.focusPos;
		var listPosTemp = this.listPos;
		this.focusPos += _num;
		this.listPos += _num;
//		add("focusPosTemp="+focusPosTemp+"...this.focusPos="+this.focusPos+"...this.listPos="+this.listPos+"...this.endline="+this.endline+"this.listSize="+this.listSize);
		if(this.listSize>this.arrLength){
			if(this.listPos<0){this.listPos=0;this.focusPos=0;return;}
			if(this.listPos>this.arrLength-1){
				this.listPos=this.arrLength-1;
				this.focusPos=focusPosTemp;
				return;
			}
		}
		else if(this.focusPos<this.startline&&_num==-1){
			if(this.firstFlag==true&&this.listPos==this.focusPos){
				if(this.listPos<0){
					this.listPos=0;
					this.focusPos=0;
					return;
				}
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
			//this.reLdiv(-1);
			return;
		}
		else if(this.focusPos>this.endline&&_num==1){
			if(this.lastFlag==true&&this.listPos+this.listSize-this.endline>this.arrLength){
				if(this.listPos>this.arrLength-1){
					this.listPos=this.arrLength-1;
					this.focusPos=this.listSize-1;
					return;
				}
				this.onfocus();
				return;
			}
			else {
				this.focusPos=focusPosTemp;
				if(this.listPos>this.arrLength-1){
					this.listPos=this.arrLength-1;
					return;
				}
			}
			
			if(this.listPos+this.listSize-this.endline-1<this.arrLength){
//				iDebug("--i="+this.recordLdiv[this.recordLdiv.length-1]);
//				iDebug(" pos="+(this.listPos+this.listSize-this.endline-1));
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],this.listPos+this.listSize-this.endline-1);
			}
			else this.notData(this.recordLdiv[this.recordLdiv.length-1]);
			this.moveLdiv(1);
			//this.reLdiv(1);
			return;
		}
		this.onfocus();
	}
	/* Ѱ�ҵ�ǰ�����Ӧ��ID ������һ��ID number */
	this.currId = function(){
		var currId = null;
//		iDebug("this.recordLdiv=="+this.recordLdiv)
//		currId = this.recordLdiv[this.focusPos];
		currId = this.recordLdiv[this.focusPos];
		return currId;
	}
}

/*
 +------------------------------------------------------------------------------
 * ���ж��ж���
 +------------------------------------------------------------------------------
	var parmObj = {
		DivId:     "L",            //��DIV��ID����   
		focusId:   "focus",        //�����ID
		arrLength: listArr.length, //�����ܳ���
		row:       4,              //����
		list:      5,              //����
		rowHeight: 60,             //�и�
		listWidth: 115,            //�п�
		focusX:    158,            //��ʾ�ĵ�һ�н���X������
		focusY:    65,              //��ʾ�ĵ�һ�н���X������
		direction: "top"       //���� top ���� left ����
	};
 +------------------------------------------------------------------------------
*/
function tableSpan(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.focusPos = 0;//�����λ��
	this.row = _parmObj.row;//��ʾ������
	this.list = _parmObj.list;//����
	this.rowHeight = _parmObj.rowHeight;//�����ƶ����и�
	this.listWidth = _parmObj.listWidth;//�����ƶ����п�
	this.recordLdiv = []; //���ƶ������±��λ�ã�
	this.duration = "300ms";
	this.startline = 0;//��ʼ�� ��0��ʼ����Ĭ��Ϊ0
	this.endline   = _parmObj.row-1;//��ʵ�� ��0��ʼ��,Ĭ��Ϊ���һ��
	this.focusStart = [_parmObj.focusX,_parmObj.focusY+this.rowHeight*this.startline];//���㿪ʼ������
	this.listPos = this.list*this.startline;//���ݵ�λ��
	this.startPos = this.listPos-(this.focusPos+this.startline*this.list);//��ǰҳ�����ݿ�ʼλ��,���ڽ��㶨λ
	this.focusPosition = [];//����λ�õ�����
	this.focusObj = this.$(_parmObj.focusId); //��Ҫ�����Ķ���
	this.rowDivName = _parmObj.DivId; //��DIV��ID��
	this.arrLength = _parmObj.arrLength;//�����ܳ���
	
	if(typeof _parmObj.direction == "undefined"){
		this.direction = "top";
	}else{
		this.direction =  _parmObj.direction;
	}
	
	this.firstDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction]); //��һ��DIV��λ��
	this.topDivTop = parseInt(this.$(this.rowDivName+0).style.top)-this.rowHeight; //�ƶ���DIV�������λ�ã�
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.row).style[this.direction]);//�ƶ���DIV�������λ�ã�
	this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
	
	/*���ɽ���λ�����������*/
	this.initPosition = function(_initX,_initY,_spacingX,_spacingY,_focusRow,_focusList){
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i] = [];
		}
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i][0] = _initX + (i%_focusList)*_spacingX;
			this.focusPosition[i][1] = _initY + parseInt(i/_focusList)*_spacingY;
		}
	}
	/*��ʼ�������Ϣ*/
	this.initInfo = function(){
		//���������Ϣ
		for(var i=0;i<this.row+1;i++){
			for(var j=0;j<this.list;j++){
				this.notData(i,j,this.startPos);
			}
		}
		//��ԭDIVλ�á����������DIV˳��
		for(var i=0;i<this.row+1;i++){
			this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
			this.$(this.rowDivName+i).style[this.direction] = parseInt(this.firstDivTop) + this.rowHeight*i+"px";
			this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration;
			this.recordLdiv[i]=i;
		}
		//�����Ϣ
		this.startPos = this.listPos-(this.focusPos+this.startline*this.list);
		for(var i=0;i<this.row;i++){
			for(var j=0;j<this.list;j++){
				if(this.startPos>this.arrLength-1)return;
				if(this.startPos>=0)this.haveData(i,j,this.startPos);
				this.startPos++;
			}
		}
	}
	/*��DIV�ƶ�*/
	this.moveLdiv = function(_num){
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
		var tmp =  _num>0?this.bottomDivTop:this.topDivTop;
		//console.log(this.recordLdiv[this.recordLdiv.length-1]);
		$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] =parseInt(tmp)+"px"
		var self = this;
		setTimeout(function(){
			$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style.webkitTransitionDuration = self.duration;
			for(var i=0;i<self.row+1;i++){
				$(self.rowDivName+i).style[self.direction] =parseInt($(self.rowDivName+i).style[self.direction])-_num*self.rowHeight+"px";
		}
			self.reLdiv(_num);
		},1);
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
	/*�����Ҫ�����е�����*/
	this.showLine = function(_num){
		var temp = (_num>0)?(this.row-this.endline-1):(-this.startline);//��ǰ�к�����еĲ
		var position = (parseInt((this.listPos+this.list+temp*this.list)/this.list)-1)*this.list;//��ǰ�еĵ�һ��	
		for(var i=0;i<this.list;i++){
			if(position+i<this.arrLength&&position+i>=0){
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
			else {
				this.notData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
		}
	}
	//******************************�ƶ�����ĺ���********************
	this.changeFocus =  function(_num){
		var tempPos = this.listPos;
		var tempFocusPos = this.focusPos;
		this.listPos += _num;
		this.focusPos += _num;
		if(this.focusPos>this.arrLength-1&&this.focusPosition.length >= this.arrLength){
			this.focusPos = tempPos;
			this.listPos = tempFocusPos;
		}
		else if(this.focusPos<0){
			this.focusPos = _num==-1?this.list-1:tempFocusPos;
			if(tempPos+_num<0){this.listPos = tempPos;this.focusPos=tempFocusPos;return;}
			this.showLine(-1);
			this.moveLdiv(-1);
			//this.reLdiv(-1);
		}
		else if(this.focusPos>this.focusPosition.length-1){
			this.focusPos = _num==1?this.focusPos-this.list:tempFocusPos;
			if(tempPos+_num>this.arrLength-1){
				var allRow = parseInt((this.arrLength-1+this.list)/this.list);//�ܹ�����ҳ
				var currRow = parseInt((tempPos+this.list)/this.list);//ԭ���ڵ���
				if(allRow==currRow){
					this.listPos = tempPos;
					this.focusPos = tempFocusPos;
					return;
				}
				this.listPos = this.arrLength-1;
				this.focusPos = this.focusPosition.length-(this.list-this.listPos%this.list);
			}
			this.showLine(1);
			this.moveLdiv(1);
			//this.reLdiv(1);
		}
		else if(this.listPos>this.arrLength-1){
			this.listPos = this.arrLength-1;
			this.focusPos = this.focusPosition.length-(this.list-this.listPos%this.list);
		}
		this.onfocus();
	}
	//��ȡ����
	this.onfocus = function(){
		if(this.direction == "left"){
			this.focusObj.style.top = this.focusPosition[this.focusPos][0]+"px";
		}else if(this.direction == "top"){
			this.focusObj.style.left = this.focusPosition[this.focusPos][0]+"px";
		}
		this.focusObj.style[this.direction] = this.focusPosition[this.focusPos][1]+"px";
	}
	
	this.currId = function(){
		//Ѱ�ҵ�ǰ�����Ӧ��ID ������һ������:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list)];
		currIdArr._i = this.focusPos%this.list;
		return currIdArr;
	}
	
	this.currIdTemp = function(){
		//Ѱ�ҵ�ǰ�����Ӧ��ID ������һ������:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list-1)];
		currIdArr._i = this.focusPos%this.list;
		//add(this.recordLdiv)
		//add(currIdArr._div)
		return currIdArr;
	}
	
	//��ʼ������
	this.init = function(){
		if(this.arrLength <= this.list*this.endline){
			this.startline=0;
			this.focusStart = [];
			this.listPos = this.focusPos;
		}
		this.focusStart = [_parmObj.focusX,_parmObj.focusY+this.rowHeight*this.startline];
		this.startPos = this.listPos-(this.focusPos+this.startline*this.list);
		this.initPosition(this.focusStart[0],this.focusStart[1],this.listWidth,this.rowHeight,this.endline-this.startline+1,this.list);
		this.initInfo();
	}
}

/*
 +------------------------------------------------------------------------------
 * JSģ���������
 +------------------------------------------------------------------------------
	id��            ��ǩID
	type��          ��������
	start_str       ��ʼֵ
	cursor_img      ��ý��� ʱ ���ͼƬ
	blank_img       ʧȥ���� ʱ ���ͼƬ
	img_height      ����ͼƬ�߶�
	max_world       ����������󳤶�
 +------------------------------------------------------------------------------
*/
function input_obj(id,type,start_str,cursor_img,blank_img,img_height,max_world){
	this.id				=	id; //������Ӧtd��id���������޸�
	this.type			=	(typeof(type)=="undefined"?'normal':type);
	this.start_str		=	(typeof(start_str)=="undefined"?'':start_str);//�ı����г�ʼ��Ĭ��ֵ
	this.cursor_img		=	(typeof(cursor_img)=="undefined"?'images/focus_input.gif':cursor_img);//����ͼƬ����,Ĭ��Ϊ'focus.gif',�������޸�
	this.blank_img		=	(typeof(blank_img)=="undefined"?'images/global_tm.gif':blank_img);//͸��ͼƬ����,Ĭ��Ϊ'global_tm.gif',�������޸�
	this.img_height		=	(typeof(img_height)=="undefined"?25:img_height);//ͼƬ�ĸ߶�,Ĭ��Ϊ25,�������޸�
	this.max_world		=	(typeof(max_world)=="undefined"?6:max_world);//�������������ַ���,Ĭ��Ϊ4,�������޸�
	this.input_timeout	=	-1;//����ʱ��timeout flag
	this.num_list		=	[
								["0"],
								[".","1"],
								["A","B","C","2","a","b","c"],
								["D","E","F","3","d","e","f"],
								["G","H","I","4","g","h","i"],
								["J","K","L","5","j","k","l"],
								["M","N","O","6","m","n","o"],
								["P","Q","R","S","7","p","q","r","s"],
								["T","U","V","8","t","u","v"],
								["W","X","Y","Z","9","w","x","y","z"]
							];//���뷨֮���л�������
	this.input_str		=	this.start_str;//�������ĸ
	this.list_index		=	 -1;//���µļ���λ��
	this.input_index	=	 0;//�����ж�Ӧ��ĸ��λ��
	this.cursor_pos		=	 this.input_str.length;//��ǹ���λ��
	this.pwd_mark		=	"��";//��������ʱ��ʾ�������Ǻ�


	/*-------------------------�Թ���ʼ��----------------------------------*/
	this.show_cursor=function(){
		this.$(this.id).innerHTML = this.get_str();
	};
	

	/*-----------------------�Բ��񵽵ļ�ֵ���д���,�������������ʾ------------------------*/
	this.get_input=function(num){
		if(this.type == "password"||this.type == "num"){//��������Ϊ���������
			if(this.input_str.length<this.max_world){//�������ַ�����С��max_world��ʱ�򽫲�����Ӧ
				this.input_str=this.input_str.substr(0,this.cursor_pos)+num+this.input_str.substr(this.cursor_pos);
				this.cursor_pos++; 
				this.$(this.id).innerHTML = this.get_str();
			}	
		}else{//�����Ϊ����
			if(this.list_index == num){//�ظ�����ͬһ����
				if(this.input_str.length<(this.max_world+1)){//�������ַ�������max_world��ʱ�򽫲�����Ӧ
					this.input_index++;
					if (this.input_index>=this.num_list[num].length) this.input_index=0;
					clearTimeout(this.input_timeout);
					var self = this;
					this.input_timeout = setTimeout(function(){self.list_index=-1}, 800);//����800��������Ϊ������ͬһ����.	
					var select_list = this.num_list[this.list_index];
					this.input_str = this.input_str.substr(0,(this.cursor_pos-1)) + select_list[this.input_index]+this.input_str.substr(this.cursor_pos);//��ͬһ������ʱ��ֻ�ı�input_str�����һ����ĸ
					this.$(this.id).innerHTML = this.get_str();
				}
			}else{//�����¼��ǰ����λ��,���Ѷ�Ӧ�ļ�����ĸд��input_str
				if(this.input_str.length<this.max_world){//�������ַ�����С��max_world��ʱ�򽫲�����Ӧ
					this.list_index = num;
					clearTimeout(this.input_timeout);
					var self = this;
					this.input_timeout = setTimeout(function(){self.list_index=-1}, 800);//����800��������Ϊ������ͬһ����.	
					this.input_index = 0;//��ԭinput_index��ֵ
					var select_list = this.num_list[this.list_index];
					this.input_str=this.input_str.substr(0,this.cursor_pos)+select_list[this.input_index]+this.input_str.substr(this.cursor_pos);
					this.cursor_pos++; 
					this.$(this.id).innerHTML = this.get_str();
				}
			}
		}
	};


	/*-------------------------ɾ�����ǰ����Ǹ�����---------------------------*/  
	this.del_input=function (){
		if (this.input_str.length>0&&this.cursor_pos>0){
			this.cursor_pos--;
			this.input_str = this.input_str.substr(0,this.cursor_pos)+this.input_str.substr(this.cursor_pos+1);
			this.$(this.id).innerHTML = this.get_str();
		}
	};


	/*-------------------------�ƶ�����λ��-----------------------------*/
	this.move_input=function(num){
		this.cursor_pos+=num;
		if(this.cursor_pos<0) this.cursor_pos=0;
		else if(this.cursor_pos>this.input_str.length) this.cursor_pos = this.input_str.length;
		this.$(this.id).innerHTML = this.get_str();
	};


	/*----Ϊ���ù���������ƶ������в���������ζ�������,
				��ÿ���ַ�֮�䶼������һ���͹���Сһ����͸��ͼƬ,���溯����Ҫ��ʵ���������---*/

	this.get_str=function(){
		var b_img = '<img src='+this.blank_img+' width=2 height='+this.img_height+'>';
		var c_img = '<img src='+this.cursor_img+' width=2 height='+this.img_height+'>';
		var temp_str = ((this.cursor_pos>0)?b_img:c_img);
		if(this.type == "password"){//��������Ϊ����
			for (var i=0;i<this.input_str.length;i++){
				if(i==(this.cursor_pos-1)) temp_str+= this.pwd_mark+c_img;
				else temp_str+= this.pwd_mark+b_img;
			}
		}else if(this.type == "num"){
			for (var i=0;i<this.input_str.length;i++){
				if(i==(this.cursor_pos-1)) temp_str+= this.input_str.charAt(i)+c_img;
				else temp_str+= this.input_str.charAt(i)+b_img;
			}		
		}else{
			if(this.cursor_pos>0){
				for (var i=0;i<(this.cursor_pos-1);i++){
					temp_str+=this.input_str.substr(i,1)+b_img;
				}
				temp_str+=this.input_str.substr((this.cursor_pos-1),1)+c_img;
			}
			for (var j=this.cursor_pos;j<this.input_str.length;j++){
				temp_str+=this.input_str.substr(j,1)+b_img;
			}
		}
		return temp_str;
	};
	
	/*----------------------����ʧȥ����ʱ�Ĳ���-------------------------------*/
	this.lose_focus = function(){
		var b_img = '<img src='+this.blank_img+' width=2 height='+this.img_height+'>';
		var temp_str = b_img;
		if(this.type == "password"){//��������Ϊ����
			for (var i=0;i<this.input_str.length;i++){
				temp_str+= this.pwd_mark+b_img;
			}
		}else{
			for (var i=0;i<this.input_str.length;i++){
				temp_str+= this.input_str.charAt(i)+b_img;
			}		
		}
		this.$(this.id).innerHTML = temp_str;
	}

	/*----------------�򵥵Ķ���һ����ȡid�ķ���---------------*/
	this.$= function(id) {
		return document.getElementById(id);
	}
};



//iPanel.eventFrame.roleUrl = "../global_chrome/rolePic/";
/*��ɫѡ�����*/
function appRole(_roleParam){
	this.initDivId = _roleParam.initDivId;
	this.spacing = _roleParam.spacing;
	this.txtColor = _roleParam.txtColor;
	this.info = _roleParam.info;
	this.roleUrl = iPanel.eventFrame.roleUrl;
	this.rolePos = 0;
	this.roleHtml = "";
	this.roleFocusStat = function(){
		this.$("rolefocus").style.webkitTransform = "scale(1.1);"
		this.$("rolefocus").style.webkitTransform = "scale(1);"
	}
	this.init = function(){
		this.$(this.initDivId).style.left = (1280-(this.spacing*(this.info.length-1)+134))/2;
		for(var i=0; i<this.info.length; i++){
			var _picUrl = (this.info[i].pic.toString().indexOf("http")==-1)? (this.roleUrl+this.info[i].pic) : this.info[i].pic;
			this.roleHtml += '<div id="role'+i+'" style="position:absolute; top:0px; left:'+this.spacing*i+'px; width:134px; height:127px; -webkit-transform:scale(1); -webkit-transition-duration:200ms;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td height="88" align="center"><img id="rolePic'+i+'" thumbnail="true" autokeepscaling="false" src="'+_picUrl+'" style="width:85px; height:85px;" /></td></tr><tr><td height="44" align="center" style="font-size:24px;color:'+this.txtColor+'" id="roleName'+i+'">'+this.info[i].name+'</td></tr></table><img style="position:absolute; left: 21px; top: -2px;" src="ui://pbg.png" width="96" height="96" /></div>';
		}
		this.roleHtml += '<img id="rolefocus" src="ui://roleFocus.png" style="position:absolute;-webkit-transition-duration:200ms;opacity:0;top:-24px; left:4px;-webkit-transform:scale(1.2);z-index:20" />';
	}
	
	this.showRole = function(){
		this.$(this.initDivId).innerHTML = this.roleHtml;
		var self = this;
		setTimeout(function(){self.roleFocus(0);},500);
		setTimeout(function(){
			self.$("rolefocus").style.opacity = 1;
			self.$("rolefocus").style.webkitTransform = "scale(1)";
		},800);
	}
	
	this.initRole = function(){
		this.init();
		this.showRole();
	}
	
	this.roleFocus = function(_num){
		if((this.rolePos==0&&_num<0)||(this.rolePos==this.info.length-1&&_num>0)){
			this.$("role"+this.rolePos).style.webkitTransform = "scale(1.2)";
		}
		else {
			this.$("role"+this.rolePos).style.webkitTransform = "scale(1)";
		}
		this.rolePos+=_num;
		if(this.rolePos<0){
			this.rolePos = 0;
			this.roleFocusStat();
		}
		if(this.rolePos>this.info.length-1){
			this.rolePos = this.info.length-1;
			this.roleFocusStat();
		}
		this.$("role"+this.rolePos).style.webkitTransform = "scale(1.2)";
		this.$("rolefocus").style.left =4+ this.spacing*this.rolePos;
	}
	this.roleSelect = function(){
		this.$("rolefocus").style.webkitTransform = "scale(1.4);"
		this.$("rolefocus").style.opacity = 0;
	}
	this.$= function(id){return document.getElementById(id);}
}



//���˵�����������ȫ�ְ�ť
//���ò˵�������
function iTimeMenu(menuArr,backArr,appInfo){
	this.menuKeyWidgets = null;
	this.backKeyWidgets = null;
	this.menuArr = menuArr;
	this.backArr = backArr;
	this.appInfo = appInfo;
	this.default_fun = "showAppInfo|changeRole|appSet|goAppHome|exitApp";
	this.nullfun = function(){};
	this.loadWidgetFlag = 0;		//0: ��ʾδ���ع�widget, 1: ���ع�
	
	
	//��ʼ���˵�����
	this.initMenuArr = function(){
		//iDebug("---initMenuArr----inIpanel:"+inIpanel);//false
		if(!inIpanel){
			var self = this;
			this.menuKeyWidgets = new popUP({id:"menuKey", url:appUrl+"/global_chrome/html/menuKey.htm", zIndex:500, callback:function(){
				self.menuKeyWidgets.getIframeObj("menuKey").pass_value = []; //��ֵ
				self.menuKeyWidgets.getIframeObj("menuKey").appInfo = self.appInfo||self.menuKeyWidgets.getIframeObj("menuKey").appInfo;
				self.menuKeyWidgets.getIframeObj("menuKey").menuArr = self.menuArr||self.menuKeyWidgets.getIframeObj("menuKey").menuArr;
			}});
			this.backKeyWidgets = new popUP({id:"backKey", url:appUrl+"/global_chrome/html/backKey.htm", zIndex:500, callback:function(){
				self.backKeyWidgets.getIframeObj("backKey").backArr = self.backArr||self.backKeyWidgets.getIframeObj("backKey").backArr;
			}});			
			return;
		}		
//		add("---initMenuArr----1=="+this.menuKeyWidgets);
		this.menuKeyWidgets = iPanel.pageWidgets.getByName("menuKey");
		this.backKeyWidgets = iPanel.pageWidgets.getByName("backKey");
		if(this.menuKeyWidgets !=null && this.backKeyWidgets != null){
//			add("------in--initMenuArr");
			this.menuKeyWidgets.pass_value = []; //��ֵ
			if(typeof this.backArr=="undefined"||typeof this.menuArr=="undefined"||typeof this.appInfo=="undefined")return;
			this.menuKeyWidgets.appInfo = this.appInfo||this.menuKeyWidgets.appInfo;
			this.menuKeyWidgets.menuArr = this.menuArr||this.menuKeyWidgets.menuArr;
			this.backKeyWidgets.backArr = this.backArr||this.menuKeyWidgets.backArr;
		}else{
			this.createWidget();	
		}
	};
	this.createWidget =function(){
		if(this.menuKeyWidgets ==null && this.backKeyWidgets == null&& this.loadWidgetFlag == 0){
			iPanel.pageWidgets.create("menuKey", appUrl+"/global_chrome/html/menuKey.htm");//���˵�������
			iPanel.pageWidgets.create("backKey",  appUrl + "/global_chrome/html/backKey.htm");//�����ء�����
			this.createWidgetOK();
		}else{
			this.loadWidgetFlag = 1;
		}
	};
	this.createWidgetOK = function(){
		var menuWidget = iPanel.pageWidgets.getByName("menuKey");
		var backWidget = iPanel.pageWidgets.getByName("backKey");	
		if(menuWidget != null && backWidget != null){
			//���˵�������
			menuWidget.moveTo(0, 0);
			menuWidget.resizeTo(1280, 720);
			//�����ء�����
			backWidget.moveTo(0, 0);
			backWidget.resizeTo(1280, 720);
			this.menuKeyWidgets = menuWidget;
			this.backKeyWidgets = backWidget;
			this.initMenuArr();
		}else{
			var self = this;
			setTimeout(function(){self.createWidgetOK()}, 200);
		}
	}
	//����[����]�˵�
	this.showBack = function(){
//		add("this.backKeyWidgets==="+this.backKeyWidgets);
//		add("inIpanel==="+inIpanel);
		if(this.backKeyWidgets == null) return;
		if(!inIpanel){
			this.backKeyWidgets.show();
			this.backKeyWidgets.getIframeObj("backKey").init();
			
		}else{
			this.backKeyWidgets.show();
			this.backKeyWidgets.init();
		}
	}
	//����ϵͳ�˵�
	this.showMenu = function(){
		//add("this.menuKeyWidgets==="+this.menuKeyWidgets);
		//add("inIpanel==="+inIpanel);
		if(this.menuKeyWidgets == null)return;
		if(!inIpanel){
			this.menuKeyWidgets.show();
			this.menuKeyWidgets.getIframeObj("menuKey").initlist();
			//this.menuKeyWidgets.getIframeObj("menuKey").select();
		}else{
			this.menuKeyWidgets.show();
			this.menuKeyWidgets.initlist();
		}
	}
	//�����˵��ϣ������أ�����Ҫ��ӵ�һЩ����
	this.menuBackFun = function(_fun){
		if(this.menuKeyWidgets == null)return;
		//this.menuKeyWidgets.gobackfun = _fun;�������д����֮ǰ��һ������ΪinIpanel��ֵΪtrue��ע�͵�@wangjuan 2014.09.25
		!inIpanel?this.menuKeyWidgets.gobackfun = _fun:this.menuKeyWidgets.getIframeObj("menuKey").gobackfun;
	}
	//�����˵��ϣ������أ�����Ҫ��ӵ�һЩ����
	this.backBackFun = function(_fun){
		if(this.backKeyWidgets == null)return;
		inIpanel?this.backKeyWidgets.gobackfun = _fun:this.backKeyWidgets.gobackfun;
	}
	//��ֵ
	this.passVable = function(_parm){
		if(typeof _parm != "undefined"){
			inIpanel?this.menuKeyWidgets.pass_value:this.menuKeyWidgets.getIframeObj("menuKey").pass_value = _parm;
		}
		return inIpanel?this.menuKeyWidgets.pass_value:this.menuKeyWidgets.getIframeObj("menuKey").pass_value;
	}
	
	//���Ӻ�����ֻ��� showAppInfo|changeRole|appSet|goAppHome|exitApp
	this.addFun = function(_fun,_addfun){
		if(this.default_fun.indexOf(_fun)>-1){
			if(inIpanel){
				eval('iPanel.pageWidgets.getByName("menuKey").addFunObj.'+_fun) = _addfun;
			}else{
				eval('this.menuKeyWidgets.getIframeObj("menuKey").addFunObj.'+_fun) = _addfun;
			}
		}
	}
	//��ԭ����ʼ����Ϣ
	this.reduction = function(){
		var re_pass_value = [];
		var re_menuArr = [{ name:"������ҳ",
							fun:function(){
								if(inIpanel){
									iPanel.mainFrame.location.href = iPanel.eventFrame.webUiUrl;
								}else{
									goBackUrl();
									//parent.window.location.href = "http://192.168.60.88:8080/chrome_App/index.htm";
								}
							},
							widget:[]
						}];
		var re_appInfo = "iTime��Ȩ����";
		var re_backArr = [{fun:this.nullfun,widget:[]},{fun:this.nullfun,widget:[]}];
		this.menuKeyWidgets.getIframeObj("menuKey").pass_value = []; 
		this.menuKeyWidgets.getIframeObj("menuKey").appInfo = re_appInfo;
		this.menuKeyWidgets.getIframeObj("menuKey").menuArr = re_menuArr;
		this.backKeyWidgets.getIframeObj("backKey").backArr = re_backArr;
		this.clearAddFun();
	}
	//������и��Ӻ���
	this.clearAddFun = function(){
		this.backBackFun(this.nullfun);
		this.menuBackFun(this.nullfun);
		var re_addFunObj = {"changeRole":this.nullfun,"showAppInfo":this.nullfun,"appSet":this.nullfun,"goAppHome":this.nullfun,"exitApp":this.nullfun};
		this.menuKeyWidgets.getIframeObj("menuKey").addFunObj = re_addFunObj;
		this.backKeyWidgets.getIframeObj("backKey").addFunObj = {"exitApp":this.nullfun};
	}
}


/*
*����һ��iframe������@huangjm 2012.11.20
*/
var global_iframe_id = [];		//Ҫȷ��_index  ���id��global_iframe_id�ĵ�һ��Ԫ��

function popUP(args){
	this.id = args.id ||"__ifr";
	this.url = args.url;
	this.left = parseInt(args.left)||0;
	this.top = parseInt(args.top)||0;
	this.width = parseInt(args.width)||1280;
	this.height = parseInt(args.height)||720;
	this.callback =args.callback||function(){};
	this.duration = args.duration || 300;
	this.div = null;
	this.zIndex = parseInt(args.zIndex)||500;
	//this.zIndex = parseInt(args.zIndex)||1;//old value
	this.showFLag = false;
	
	//��ʾdiv
	this.show = function(args){
		if(this.div != null){
			this.div.style.visibility = "visible";
		}
		this.showFLag = true;
		global_iframe_id.push(this.id);
	};
	
	//����div
	this.minimize = function(id){
		var tmp = id||this.id;
		if(this.div != null) this.div.style.visibility = "hidden";	
		this.showFLag =false;
		for(var i = 0; i < global_iframe_id.length; i++){
			if(global_iframe_id[i] == tmp){
				global_iframe_id.splice(i, 1);
			}	
		}
		//global_iframe_id.pop();
	};
	
	//����iframe��div����
	this.createDiv = function(){
		this.div = document.createElement("div");
		this.div.style.position = "absolute";
		this.div.style.left = this.left+"px";
		this.div.style.top = this.top+"px";
		this.div.style.width = this.width+"px";
		this.div.style.height = this.height+"px";
		this.div.style.zIndex = this.zIndex;
		this.div.style.webkitTransitionDuration = this.duration+"ms";
		this.div.style.visibility = "hidden";
		document.body.appendChild(this.div);
		this.createIframe();
	};
	
	//����iframe
	this.createIframe = function(){
		var obj = document.createElement("iframe");
		var self = this;
		obj.style.left = "0px";
		obj.style.top = "0px";
		obj.width = "100%";
		obj.height ="100%";
		obj.scrolling = "no";
		obj.frameborder = "0";
		// setTimeout(function(){
		// 	obj.style.webkitTransitionDuration = self.duration+"ms";
		// },100);
	
		obj.id = this.id;
		obj.name = this.id;
		obj.src = this.url;
		//document.body.appendChild(obj);
		this.div.appendChild(obj);
		if (obj.addEventListener){	//������ iframe�ļ���
			obj.addEventListener("load", this.callback, false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("onload", this.callback);
		}else{
			obj.onload = this.callback;
		}
	};
	
	//iframe��תҳ��
	this.iframeLocation = function(url){
			var ifr = this.getIframeObj();
			iPanel.debug("--iframeLocaton---url ="+url);
			ifr.window.location.href = url;
	};
	
	//ȡ�õ�ǰ��iframe
	this.getIframeObj = function(){
		return  window.frames[this.id];
	};
	
	//ȡ�õ�ǰ����iframe��div
	this.getContainer = function(){
		return this.div;
	};
	
	this.createDiv();
}

/***************************Ӧ��Ԥ��********************begin*/
/*
@appsPreLoad(args) args�����ǣ�.html,  .js�� .css�� ����ͼƬ��ʽ, Ҳ����������
@�磺appsPreLoad(["main.htm", ".secBg.png"], "data.js", "a.css");
*/
function appsPreLoad(){		//@huangjm 2011-6-27
	var _leng = arguments.length;
	var _arr = [];
	var tmpArr = [];
	for(var i = 0; i < _leng; i++){
		if(arguments[i] instanceof Array){
			tmpArr = tmpArr.concat(arguments[i]);
		}else if(typeof arguments[i] == "string" && arguments[i] != ""){
			tmpArr.push(arguments[i]);
		}
	}
	for(var i = 0; i < tmpArr.length; i ++){
		_arr.push(0);	//��Ӧ������Ĭ�϶��÷���ס�ڴ棬���Ը���һ��flag Ϊ0
	}
	if(__isPreload){		//����iPanel api
		iPanel.preDownload(tmpArr, _arr);	//Ԥ�صĽӿ�
	}else{		//����new Image��Ԥ��
		var len = _arr.length;
		var result = [];
		for(var i = 0; i <len; i++){
			if(/.*\.(gif|bmp|png|jpg)$/.test(tmpArr[i])){
				result[result.length] = tmpArr[i];
			}
		}
		document.imageArray = new Array(len);
		var r_len = result.length;
		for(var i = 0; i <r_len; i++){
			document.imageArray[i] = new Image;
			document.imageArray[i].src = result[i];
			document.imageArray[i].onload =( function(i){
				if(typeof materialLoading != "undefined"){
					materialLoading(parseInt((i+1)/r_len*100));
				}
			})(i);
		}
	}
}

/***************************Ӧ��Ԥ��********************end*/

//��ӡ����
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}