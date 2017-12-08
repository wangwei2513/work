var undefined;
//var appUrl = "http://192.168.60.88:8080";	//本地应用所搭载的路径
var appUrl = "http://apps.homed.tv";		//本地应用所搭载的路径
var __isPreload = false;			//是否预载，false: 不调用iPanel的预载，true：调用new Image的预载
var inIpanel = false;
if (navigator.appName.indexOf("iPanel")!=-1){
	//inIpanel = true;
}
/**
 +------------------------------------------------------------------------------
 * 时间函数
 +------------------------------------------------------------------------------
	 日期格式化 
	 格式 YYYY/yyyy/YY/yy 表示年份 
	 MM/M 月份 
	 W/w 星期 
	 dd/DD/d/D 日期 
	 hh/HH/h/H 时间 
	 mm/m 分钟 
	 ss/SS/s/S 秒 
 +------------------------------------------------------------------------------
 */
function nowTime(formatStr,language){ 
	var str = formatStr; 
	var date = new Date();
	var Week = {
		cn:['日','一','二','三','四','五','六'],
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
 * 数字图片对象
 +------------------------------------------------------------------------------
 	var str = 0.21; //字符串或数字
	var imgObj = {
		"0":"images/score_0.png", 
		……
		"9":"images/score_9.png",
		".":"images/score_..png", //小数点
		"clear":"images/tm.png" //清空
		
	};
	var idName = "num"; //图片ID前缀名字
	var numLength = 4 ; //能显示的位数
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
		else $(_idName+i).src = imgObj["clear"]; //清空 透明图片
	}
}

/**
 +------------------------------------------------------------------------------
 * 滚动条对象
 +------------------------------------------------------------------------------
 * @param {string} obj 滚动条外层div的id
 * @param {string} barId 滚动条可变部分的id
 * @param {number} dataLength 总的数据的长度 
 * @param {number} listSize   列表的长度
 * @param {number} maxLength  要滑动的区域的长度
 * @param {number} startPos  开始的位置
 * @param {number} type  	滑动的类型，0 or "undefined":表示barId 不需要改变它的长度， 1:根据列表长度算出滑块长度，且滑动改变top,height不变
 * @param {string} duration  滑动的时间
 
 args:{obj:"", barId:"",  duration:"", datalength:a, listSize:b, maxLength:c, startPos:d, type:e,}
 +------------------------------------------------------------------------------
 */
function scrollBar(args){
	this.obj = args.obj;	//所承载滑块的ID
	this.barId = args.barId; 	//滑块里面的图片
	this.dataLength = args.dataLength;	//总数据的长度
	this.listSize = args.listSize;	//可见列表的长度
	this.maxLength = args.maxLength;		//滑块的长度
	this.startPos = args.startPos;	//起点位置
	this.duration = args.duration;
	this.type = args.type; 	//当前滑动的类型：0 or "undefined":表示barId 不需要改变它的长度， 1:根据列表长度算出滑块长度，且滑动改变top,height不变
	this.endPos = 0;
	this.scrollStep = 0;
	this.f = args.f || window;		//当前窗体
	
	//做滑动初使化
	this.initScroll = function(){
		this.setDocument();
		this.showScrollInfo();
	}
	
	//设置dom
	this.setDocument = function(){
		this.obj = this.$(this.obj);
		this.obj.style.webkitTransitionDuration = this.duration;
		if(typeof this.barId != "undefined"){
			this.barId = this.$(this.barId);
			//this.barId.style.webkitTransitionDuration = this.duration;
		}
	}
	
	//设置scroll的信息
	this.showScrollInfo = function(){
		var percent = 1;
		if(this.dataLength > this.listSize){
			percent = this.listSize/this.dataLength;
		}
		var barLength = percent*this.maxLength;
		if(typeof this.type != "undefined"  && this.type != 0){		//this.type不是undefined 和 this.type 不为0, 要改变长度
			if(typeof this.barId != "undefined"){	//若是里层的barId没定义的，外层改变id
				this.barId.style.height = Math.round(barLength) + "px";	
			}else{
				this.obj.style.height = Math.round(barLength) + "px";
			}	
			this.endPos = this.startPos + this.maxLength - barLength;		//算出它的终点位置， 因为多了一个滑块的长度，要减去
		}else{
			this.endPos = this.startPos + this.maxLength;	
		}
		if(this.dataLength > 1){	// 将剩余的空间分成 this.dataLength - 1 份，每份为this.scrollStep
			this.scrollStep = (this.endPos - this.startPos)/(this.dataLength - 1);	
		}else{
			this.scrollStep = 0;
		}
	}
	
	//滑动函数
	this.scroll = function(_pos){
		var tempValue = this.startPos + this.scrollStep * _pos;
		this.obj.style.top = Math.round(tempValue) + "px";
	}
	
	//简写
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
 * 定焦菜单对象
 +------------------------------------------------------------------------------
	var parmObj = {
		divIdName:      "D",
		fixPos:          2,             //定焦的位置 D2
		menuDivAmount:   6,             //所有DIV的数量
		menuLength:      tmArray.length //数据总长度
	};
 +------------------------------------------------------------------------------
*/
function fixFocusMenu(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.divIdName = _parmObj.divIdName;
	this.fixPos = _parmObj.fixPos; //定焦的位置
	this.menuPos = 0; //焦点对应的数据默认位置
	this.menuDivAmount = _parmObj.menuDivAmount;
	this.record = []; //记录ID
	this.menuLength = _parmObj.menuLength;	
	this.duration = 300;
	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.changeFrom = function(){};//改变菜单项状态
	
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
			if(_num>0&&i==this.record.length-1){//正向
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
	/* 寻找当前焦点对应的ID ，返回一个ID number */
	this.currId = function(){
		currId = this.record[this.fixPos];
		return currId;
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
//	this.duration = _parmObj.duration || 2000;
	this.duration = _parmObj.duration || 20;
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
	this.topDivTop = parseInt(this.firstDivTop-this.rowHeight); //移动行DIV最上面的位置；
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.listSize).style[this.direction]);//移动行DIV最下面的位置；
	this.actionCompleteFlag = true;
	this.t0 = -1;
	this.t1 = -1;
	
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
//		add("this.listPos="+this.listPos+"---position="+position+"---this.focusPos="+this.focusPos);
		for(var i=0; i<this.listSize+1; i++){
			this.recordLdiv[i]=i;
			if(i+position<this.arrLength){
//				add("i="+i+"---position="+position+"---this.arrLength="+this.arrLength);
				this.haveData(i,i+position);
			}
			
		}
	}
	
	
	/*行DIV移动*/
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
		this.focusObj.style[this.direction] = this.focusStartPos + this.rowHeight*this.focusPos +"px";
	}
	
	/*移动焦点的函数*/ 
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
	/* 寻找当前焦点对应的ID ，返回一个ID number */
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
 * 多行多列对象
 +------------------------------------------------------------------------------
	var parmObj = {
		DivId:     "L",            //行DIV的ID名称   
		focusId:   "focus",        //焦点的ID
		arrLength: listArr.length, //数据总长度
		row:       4,              //行数
		list:      5,              //列数
		rowHeight: 60,             //行高
		listWidth: 115,            //列宽
		focusX:    158,            //显示的第一行焦点X轴坐标
		focusY:    65,              //显示的第一行焦点X轴坐标
		direction: "top"       //方向 top 纵向 left 横向
	};
 +------------------------------------------------------------------------------
*/
function tableSpan(_parmObj){
	this.$ = function(_id){return document.getElementById(_id);}
	this.focusPos = 0;//焦点的位置
	this.row = _parmObj.row;//显示的行数
	this.list = _parmObj.list;//列数
	this.rowHeight = _parmObj.rowHeight;//焦点移动的行高
	this.listWidth = _parmObj.listWidth;//焦点移动的列宽
	this.recordLdiv = []; //行移动后重新标记位置；
	this.duration = "300ms";
	this.startline = 0;//起始行 从0开始数，默认为0
	this.endline   = _parmObj.row-1;//其实列 从0开始数,默认为最后一行
	this.focusStart = [_parmObj.focusX,_parmObj.focusY+this.rowHeight*this.startline];//焦点开始的坐标
	this.listPos = this.list*this.startline;//数据的位置
	this.startPos = this.listPos-(this.focusPos+this.startline*this.list);//当前页，数据开始位置,用于焦点定位
	this.focusPosition = [];//焦点位置的坐标
	this.focusObj = this.$(_parmObj.focusId); //所要滑动的对象；
	this.rowDivName = _parmObj.DivId; //行DIV的ID名
	this.arrLength = _parmObj.arrLength;//数据总长度
	
	if(typeof _parmObj.direction == "undefined"){
		this.direction = "top";
	}else{
		this.direction =  _parmObj.direction;
	}
	
	this.firstDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction]); //第一个DIV的位置
	this.topDivTop = parseInt(this.$(this.rowDivName+0).style.top)-this.rowHeight; //移动行DIV最上面的位置；
	this.bottomDivTop = parseInt(this.$(this.rowDivName+this.row).style[this.direction]);//移动行DIV最下面的位置；
	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
	
	/*生成焦点位置坐标的数组*/
	this.initPosition = function(_initX,_initY,_spacingX,_spacingY,_focusRow,_focusList){
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i] = [];
		}
		for(var i=0;i<_focusRow*_focusList;i++){
			this.focusPosition[i][0] = _initX + (i%_focusList)*_spacingX;
			this.focusPosition[i][1] = _initY + parseInt(i/_focusList)*_spacingY;
		}
	}
	/*初始化输出信息*/
	this.initInfo = function(){
		//清除所有信息
		for(var i=0;i<this.row+1;i++){
			for(var j=0;j<this.list;j++){
				this.notData(i,j,this.startPos);
			}
		}
		//还原DIV位置、创建最初的DIV顺序
		for(var i=0;i<this.row+1;i++){
			this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
			this.$(this.rowDivName+i).style[this.direction] = parseInt(this.firstDivTop) + this.rowHeight*i+"px";
			this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration;
			this.recordLdiv[i]=i;
		}
		//输出信息
		this.startPos = this.listPos-(this.focusPos+this.startline*this.list);
		for(var i=0;i<this.row;i++){
			for(var j=0;j<this.list;j++){
				if(this.startPos>this.arrLength-1)return;
				if(this.startPos>=0)this.haveData(i,j,this.startPos);
				this.startPos++;
			}
		}
	}
	/*行DIV移动*/
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
	/*输出将要出现行的数据*/
	this.showLine = function(_num){
		var temp = (_num>0)?(this.row-this.endline-1):(-this.startline);//当前行和输出行的差；
		var position = (parseInt((this.listPos+this.list+temp*this.list)/this.list)-1)*this.list;//当前行的第一个	
		for(var i=0;i<this.list;i++){
			if(position+i<this.arrLength&&position+i>=0){
				this.haveData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
			else {
				this.notData(this.recordLdiv[this.recordLdiv.length-1],i,position+i);
			}
		}
	}
	//******************************移动焦点的函数********************
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
				var allRow = parseInt((this.arrLength-1+this.list)/this.list);//总共多少页
				var currRow = parseInt((tempPos+this.list)/this.list);//原所在的行
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
	//获取焦点
	this.onfocus = function(){
		if(this.direction == "left"){
			this.focusObj.style.top = this.focusPosition[this.focusPos][0]+"px";
		}else if(this.direction == "top"){
			this.focusObj.style.left = this.focusPosition[this.focusPos][0]+"px";
		}
		this.focusObj.style[this.direction] = this.focusPosition[this.focusPos][1]+"px";
	}
	
	this.currId = function(){
		//寻找当前焦点对应的ID ，返回一个对象:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list)];
		currIdArr._i = this.focusPos%this.list;
		return currIdArr;
	}
	
	this.currIdTemp = function(){
		//寻找当前焦点对应的ID ，返回一个对象:{_div,_i};
		var currIdArr = {_div:null,_i:null};
		currIdArr._div = this.recordLdiv[Math.floor((this.focusPos+this.list)/this.list-1)];
		currIdArr._i = this.focusPos%this.list;
		//add(this.recordLdiv)
		//add(currIdArr._div)
		return currIdArr;
	}
	
	//初始化数据
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
 * JS模拟器输入框
 +------------------------------------------------------------------------------
	id：            标签ID
	type：          输入类型
	start_str       初始值
	cursor_img      获得焦点 时 光标图片
	blank_img       失去焦点 时 光标图片
	img_height      焦点图片高度
	max_world       输入文字最大长度
 +------------------------------------------------------------------------------
*/
function input_obj(id,type,start_str,cursor_img,blank_img,img_height,max_world){
	this.id				=	id; //输入框对应td的id，可自行修改
	this.type			=	(typeof(type)=="undefined"?'normal':type);
	this.start_str		=	(typeof(start_str)=="undefined"?'':start_str);//文本框中初始的默认值
	this.cursor_img		=	(typeof(cursor_img)=="undefined"?'images/focus_input.gif':cursor_img);//光标的图片名称,默认为'focus.gif',可自行修改
	this.blank_img		=	(typeof(blank_img)=="undefined"?'images/global_tm.gif':blank_img);//透明图片名称,默认为'global_tm.gif',可自行修改
	this.img_height		=	(typeof(img_height)=="undefined"?25:img_height);//图片的高度,默认为25,可自行修改
	this.max_world		=	(typeof(max_world)=="undefined"?6:max_world);//定义最多输入的字符数,默认为4,可自行修改
	this.input_timeout	=	-1;//输入时的timeout flag
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
							];//输入法之间切换的内容
	this.input_str		=	this.start_str;//输入的字母
	this.list_index		=	 -1;//按下的键的位置
	this.input_index	=	 0;//键盘中对应字母的位置
	this.cursor_pos		=	 this.input_str.length;//标记光标的位置
	this.pwd_mark		=	"●";//输入密码时显示出来的星号


	/*-------------------------对光标初始化----------------------------------*/
	this.show_cursor=function(){
		this.$(this.id).innerHTML = this.get_str();
	};
	

	/*-----------------------对捕获到的键值进行处理,并在输入框中显示------------------------*/
	this.get_input=function(num){
		if(this.type == "password"||this.type == "num"){//如果输入的为密码或数字
			if(this.input_str.length<this.max_world){//当输入字符数不小于max_world的时候将不再响应
				this.input_str=this.input_str.substr(0,this.cursor_pos)+num+this.input_str.substr(this.cursor_pos);
				this.cursor_pos++; 
				this.$(this.id).innerHTML = this.get_str();
			}	
		}else{//输入的为文字
			if(this.list_index == num){//重复按下同一个键
				if(this.input_str.length<(this.max_world+1)){//当输入字符数大于max_world的时候将不再响应
					this.input_index++;
					if (this.input_index>=this.num_list[num].length) this.input_index=0;
					clearTimeout(this.input_timeout);
					var self = this;
					this.input_timeout = setTimeout(function(){self.list_index=-1}, 800);//超过800毫秒则不认为按的是同一个键.	
					var select_list = this.num_list[this.list_index];
					this.input_str = this.input_str.substr(0,(this.cursor_pos-1)) + select_list[this.input_index]+this.input_str.substr(this.cursor_pos);//按同一个键的时候只改变input_str的最后一个字母
					this.$(this.id).innerHTML = this.get_str();
				}
			}else{//否则记录当前键的位置,并把对应的键的字母写入input_str
				if(this.input_str.length<this.max_world){//当输入字符数不小于max_world的时候将不再响应
					this.list_index = num;
					clearTimeout(this.input_timeout);
					var self = this;
					this.input_timeout = setTimeout(function(){self.list_index=-1}, 800);//超过800毫秒则不认为按的是同一个键.	
					this.input_index = 0;//还原input_index的值
					var select_list = this.num_list[this.list_index];
					this.input_str=this.input_str.substr(0,this.cursor_pos)+select_list[this.input_index]+this.input_str.substr(this.cursor_pos);
					this.cursor_pos++; 
					this.$(this.id).innerHTML = this.get_str();
				}
			}
		}
	};


	/*-------------------------删除光标前面的那个文字---------------------------*/  
	this.del_input=function (){
		if (this.input_str.length>0&&this.cursor_pos>0){
			this.cursor_pos--;
			this.input_str = this.input_str.substr(0,this.cursor_pos)+this.input_str.substr(this.cursor_pos+1);
			this.$(this.id).innerHTML = this.get_str();
		}
	};


	/*-------------------------移动光标的位置-----------------------------*/
	this.move_input=function(num){
		this.cursor_pos+=num;
		if(this.cursor_pos<0) this.cursor_pos=0;
		else if(this.cursor_pos>this.input_str.length) this.cursor_pos = this.input_str.length;
		this.$(this.id).innerHTML = this.get_str();
	};


	/*----为了让光标在左右移动过程中不出现字体晃动的现象,
				在每个字符之间都加入了一个和光标大小一样的透明图片,下面函数主要是实现这个功能---*/

	this.get_str=function(){
		var b_img = '<img src='+this.blank_img+' width=2 height='+this.img_height+'>';
		var c_img = '<img src='+this.cursor_img+' width=2 height='+this.img_height+'>';
		var temp_str = ((this.cursor_pos>0)?b_img:c_img);
		if(this.type == "password"){//如果输入的为密码
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
	
	/*----------------------定义失去焦点时的操作-------------------------------*/
	this.lose_focus = function(){
		var b_img = '<img src='+this.blank_img+' width=2 height='+this.img_height+'>';
		var temp_str = b_img;
		if(this.type == "password"){//如果输入的为密码
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

	/*----------------简单的定义一个获取id的方法---------------*/
	this.$= function(id) {
		return document.getElementById(id);
	}
};



//iPanel.eventFrame.roleUrl = "../global_chrome/rolePic/";
/*角色选择对象*/
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



//【菜单】键，触发全局按钮
//设置菜单的内容
function iTimeMenu(menuArr,backArr,appInfo){
	this.menuKeyWidgets = null;
	this.backKeyWidgets = null;
	this.menuArr = menuArr;
	this.backArr = backArr;
	this.appInfo = appInfo;
	this.default_fun = "showAppInfo|changeRole|appSet|goAppHome|exitApp";
	this.nullfun = function(){};
	this.loadWidgetFlag = 0;		//0: 表示未加载过widget, 1: 加载过
	
	
	//初始化菜单数组
	this.initMenuArr = function(){
		//iDebug("---initMenuArr----inIpanel:"+inIpanel);//false
		if(!inIpanel){
			var self = this;
			this.menuKeyWidgets = new popUP({id:"menuKey", url:appUrl+"/global_chrome/html/menuKey.htm", zIndex:500, callback:function(){
				self.menuKeyWidgets.getIframeObj("menuKey").pass_value = []; //传值
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
			this.menuKeyWidgets.pass_value = []; //传值
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
			iPanel.pageWidgets.create("menuKey", appUrl+"/global_chrome/html/menuKey.htm");//【菜单】按键
			iPanel.pageWidgets.create("backKey",  appUrl + "/global_chrome/html/backKey.htm");//【返回】按键
			this.createWidgetOK();
		}else{
			this.loadWidgetFlag = 1;
		}
	};
	this.createWidgetOK = function(){
		var menuWidget = iPanel.pageWidgets.getByName("menuKey");
		var backWidget = iPanel.pageWidgets.getByName("backKey");	
		if(menuWidget != null && backWidget != null){
			//【菜单】按键
			menuWidget.moveTo(0, 0);
			menuWidget.resizeTo(1280, 720);
			//【返回】按键
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
	//弹出[返回]菜单
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
	//弹出系统菜单
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
	//弹出菜单上，按返回，还需要添加的一些函数
	this.menuBackFun = function(_fun){
		if(this.menuKeyWidgets == null)return;
		//this.menuKeyWidgets.gobackfun = _fun;下面这行代码跟之前不一样，因为inIpanel赋值为true被注释掉@wangjuan 2014.09.25
		!inIpanel?this.menuKeyWidgets.gobackfun = _fun:this.menuKeyWidgets.getIframeObj("menuKey").gobackfun;
	}
	//弹出菜单上，按返回，还需要添加的一些函数
	this.backBackFun = function(_fun){
		if(this.backKeyWidgets == null)return;
		inIpanel?this.backKeyWidgets.gobackfun = _fun:this.backKeyWidgets.gobackfun;
	}
	//传值
	this.passVable = function(_parm){
		if(typeof _parm != "undefined"){
			inIpanel?this.menuKeyWidgets.pass_value:this.menuKeyWidgets.getIframeObj("menuKey").pass_value = _parm;
		}
		return inIpanel?this.menuKeyWidgets.pass_value:this.menuKeyWidgets.getIframeObj("menuKey").pass_value;
	}
	
	//附加函数，只针对 showAppInfo|changeRole|appSet|goAppHome|exitApp
	this.addFun = function(_fun,_addfun){
		if(this.default_fun.indexOf(_fun)>-1){
			if(inIpanel){
				eval('iPanel.pageWidgets.getByName("menuKey").addFunObj.'+_fun) = _addfun;
			}else{
				eval('this.menuKeyWidgets.getIframeObj("menuKey").addFunObj.'+_fun) = _addfun;
			}
		}
	}
	//还原，初始化信息
	this.reduction = function(){
		var re_pass_value = [];
		var re_menuArr = [{ name:"返回主页",
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
		var re_appInfo = "iTime版权所有";
		var re_backArr = [{fun:this.nullfun,widget:[]},{fun:this.nullfun,widget:[]}];
		this.menuKeyWidgets.getIframeObj("menuKey").pass_value = []; 
		this.menuKeyWidgets.getIframeObj("menuKey").appInfo = re_appInfo;
		this.menuKeyWidgets.getIframeObj("menuKey").menuArr = re_menuArr;
		this.backKeyWidgets.getIframeObj("backKey").backArr = re_backArr;
		this.clearAddFun();
	}
	//清空所有附加函数
	this.clearAddFun = function(){
		this.backBackFun(this.nullfun);
		this.menuBackFun(this.nullfun);
		var re_addFunObj = {"changeRole":this.nullfun,"showAppInfo":this.nullfun,"appSet":this.nullfun,"goAppHome":this.nullfun,"exitApp":this.nullfun};
		this.menuKeyWidgets.getIframeObj("menuKey").addFunObj = re_addFunObj;
		this.backKeyWidgets.getIframeObj("backKey").addFunObj = {"exitApp":this.nullfun};
	}
}


/*
*创建一个iframe容器，@huangjm 2012.11.20
*/
var global_iframe_id = [];		//要确保_index  这个id是global_iframe_id的第一个元素

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
	
	//显示div
	this.show = function(args){
		if(this.div != null){
			this.div.style.visibility = "visible";
		}
		this.showFLag = true;
		global_iframe_id.push(this.id);
	};
	
	//隐藏div
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
	
	//创建iframe的div容器
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
	
	//创建iframe
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
		if (obj.addEventListener){	//加载完 iframe的监听
			obj.addEventListener("load", this.callback, false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("onload", this.callback);
		}else{
			obj.onload = this.callback;
		}
	};
	
	//iframe跳转页面
	this.iframeLocation = function(url){
			var ifr = this.getIframeObj();
			iPanel.debug("--iframeLocaton---url ="+url);
			ifr.window.location.href = url;
	};
	
	//取得当前的iframe
	this.getIframeObj = function(){
		return  window.frames[this.id];
	};
	
	//取得当前容纳iframe的div
	this.getContainer = function(){
		return this.div;
	};
	
	this.createDiv();
}

/***************************应用预载********************begin*/
/*
@appsPreLoad(args) args可以是：.html,  .js， .css， 各种图片格式, 也可以是数组
@如：appsPreLoad(["main.htm", ".secBg.png"], "data.js", "a.css");
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
		_arr.push(0);	//在应用里面默认都用非永住内存，所以给它一个flag 为0
	}
	if(__isPreload){		//调用iPanel api
		iPanel.preDownload(tmpArr, _arr);	//预载的接口
	}else{		//利用new Image做预载
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

/***************************应用预载********************end*/

//打印测试
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}