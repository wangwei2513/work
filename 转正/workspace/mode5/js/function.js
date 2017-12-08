/*
 * _listSize: 显示的长度
 * _dataSize: 数据长度
 * _pos: 数据位置
 * _focusPos: 焦点位置
 * _time: 移动时间，默认200ms
 * _frame: window
 */
function showListCSS2D(_listSize, _dataSize, _pos, _focusPos, _time, _frame) {
	this.listSize = _listSize;
	this.dataSize = _dataSize;
	this.position = parseInt(_pos, 10);
	this.currFocus = _focusPos || 0; // 焦点的位置
	this.time = typeof(_time) == "undefined" ? "400ms" : _time;
	this.with2D = this.time != 0 ? true : false;
	this.frame = _frame;

	this.haveData = function() {}; //显示数据的内容
	this.noData = function() {}; //多余的DIV隐藏掉
	this.arrTop = []; //div的焦点位置
	this.startTop = {}; //最后一个
	this.endTop = {};
	this.arrTopObj = []; //div的对象

	//属性
	this.endFocus = 0;
	this.startFocus = 0;
	this.hideDivFlag = "right";
	this.hideDivTimeout = -1;

	//内部属性
	this.listData = []; //数据的的列表
	this.listDiv = []; //记录DIV的位置焦点
	this.allFlag = true; //true表示数据满，false表示数据不满

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

	this.initData = function() { //初始化数据
		this.listData = [];
		this.listDiv = [];
		if (this.dataSize == 0) {
			return;
		}
		if (!this.allFlag) { //false
			var tempLength = this.listSize - this.dataSize;
			var tempPos0 = Math.ceil(tempLength / 2);
			this.listSize = this.dataSize;
			this.currFocus = Math.ceil((this.dataSize - 1) / 2); //改变焦点位置
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

		this.endFocus = this.listDiv[0]; //第一个
		this.startFocus = this.listDiv[this.listSize]; //表示最后一个，需要隐藏
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

	this.changeList = function(_num) { //翻条
		if (this.dataSize == 0) {
			return;
		}
		this.position = (this.position + _num + this.dataSize) % this.dataSize;
		this.currFocus = (this.currFocus + _num + (this.listSize + 1)) % (this.listSize + 1);
		this.changeFocus(_num);
		this.getData(_num);
		this.showList();
	};

	this.changeFocus = function(_num) {
		if (_num < 0) { //和椭圆实现方式不一样
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
			for (var i = 0; i < this.listSize + 1; i++) {
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
		return document.getElementById(_id);
	};
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
			this.$(this.focusDiv).style.visibility="visible";
			//this.$(this.focusDiv).style.webkitTransitionDuration = "0ms";
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
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;//_______________0624
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
		//iPanel.debug("____event_listData"+tempList);
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
		//iPanel.debug("_____event_currFocus"+changeNum);
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
	
	this.changeList = function(num){//翻条
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
		//this.$(this.focusDiv).style.webkitTransitionDuration = this.time ;
		this.$(this.focusDiv).style.top = this.focusObj[this.currFocus].top;
		this.$(this.focusDiv).style.left = this.focusObj[this.currFocus].left;
		this.$(this.focusDiv).style.width = this.focusObj[this.currFocus].width;
		this.$(this.focusDiv).style.height = this.focusObj[this.currFocus].height;
	}
	
	this.changePage = function(__num){//翻页
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.maxPage;  //判断当前是否首页跳转尾页或尾页跳转首页;
		//iPanel.debug("______event_isBeginOrEnd"+isBeginOrEnd);
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
			return document.getElementById(id);
	}

}

function showList(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? window : __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;
	this.position = typeof(__position)=="undefined" ? 0 : __position;  
	this.focusPos = 0;      
	this.lastPosition = 0;
	this.lastFocusPos = 0;
	this.tempSize = 0;
	this.infinite = 0;
	
	this.fixedPos = Math.floor((this.listSize-1)/2);
	
	this.pageStyle  = 0;
	this.pageLoop   = null;
	this.showLoop   = null;
	this.focusLoop  = null;
	this.focusFixed = null;
	this.focusVary  = 1;
	this.focusStyle = 0;
	
	this.showType = 1;
	this.listSign = 0;
	this.listHigh = 30;
	this.listPage = 1;
	this.currPage = 1;
	
	this.focusDiv = -1;
	this.focusEvent = false;
	this.focusPlace = new Array();
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;
	
	this.haveData = function(){};
	this.notData = function(){};
	
	this.focusUp  = function(){this.changeList(-1);};
	this.focusDown= function(){this.changeList(1); };
	this.pageUp   = function(){this.changePage(-1);};
	this.pageDown = function(){this.changePage(1); };
	
	this.startShow = function(){
		this.initAttrib();
		this.setFocus();
		this.showList();
	}
	this.initAttrib = function(){	
		if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";
		if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;
				
		if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;
		if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;
		if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;
		if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;
		if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;
		
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
	this.initFocus = function(){
		this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
		if(this.showType == 0){
			this.focusPos = this.position%this.listSize;
		}else if(!this.focusFixed&&!this.showLoop){
			var tempNum = this.position-this.focusPos;
			if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
		}
	}
	this.initPlace = function(){
		var tmph = this.listHigh;
		var tmpp = [this.startPlace];		
		for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
		this.focusPlace = tmpp;
	}
	this.changeList = function(__num){
		if(this.dataSize==0 || this.dataSize ==1) return;
		if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
		this.changePosition(__num);
		this.checkFocusPos(__num);
	}
	this.changePosition = function(__num){
		this.infinite += __num;
		this.lastPosition = this.position;	
		this.position = this.getPos(this.infinite, this.dataSize);
	}
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
			
			var tempNumUp = __num*this.fixedPos;
			var tempNumDown = __num*(this.listSize-1-this.fixedPos);
			
			if(this.focusPos+__num<0||this.focusPos+__num>this.listSize-1||this.focusFixed){				
				this.showList();
			}else if(this.showType==2&&!this.showLoop&&Math.abs(__num)==1&&((this.focusPos+__num==0&&this.position!=0)||(this.focusPos+__num==this.listSize-1&&this.position!=this.dataSize-1))){
				this.showList();
			}else if(this.showType==3&&!this.showLoop&&Math.abs(__num)==1&&((this.focusPos+tempNumUp==0&&this.lastPosition+tempNumUp!=0)||(this.focusPos+tempNumDown==this.listSize-1&&this.lastPosition+tempNumDown!=this.dataSize-1))){
				this.showList();
			}else{
				this.changeFocus(__num);
			}
		}		
	}
	this.changeFocus = function(__num){
		this.lastFocusPos = this.focusPos;
		this.focusPos += __num;
		this.setFocus(__num);
	}
	this.setFocus = function(__num){
		if(typeof(this.focusDiv)=="number") return;
		var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));
		if(typeof(this.focusDiv)=="string"){
			this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos]+"px";
		}else if(typeof(__num)=="undefined"||tempBool){
			this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
			if(this.focusEvent){
				this.focusDiv.onMoveStart();
				this.focusDiv.onMoveEnd();
			}
		}else if(__num!=0){
			this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
		}
	}	
	this.changePage = function(__num){
		if(this.dataSize==0) return;
		var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;
		if(this.showLoop){
			if(isBeginOrEnd&&!this.pageLoop) return;
			var tempNum = this.listSize*__num;
			if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
				this.changePosition(this.focusPos*-1);
				this.checkFocusPos(this.focusPos*-1);
			}
			this.changePosition(tempNum);
			this.checkFocusPos(tempNum);
		}else{
			if(this.dataSize<=this.listSize) return;
			if(this.showType==0){
				if(isBeginOrEnd&&!this.pageLoop) return;
				var endPageNum = this.dataSize%this.listSize;
				var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;
				var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;		
				var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize; 
				overNum = this.pageStyle==0 ? overNum : this.focusPos;
				tempNum = tempNum*__num-overNum;				
				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				var tempPos   = this.position-this.focusPos;
				var tempFirst = this.dataSize-this.tempSize;
				if(tempPos+__num<0||tempPos+__num>tempFirst){
					if(!this.pageLoop) return;
					tempPos = __num<0 ? tempFirst : 0;
				}else{
					tempPos += this.tempSize*__num;
					if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
				}		
				var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);
				this.changePosition(tempPos-this.position+tempNum); 
				this.showList();
			}
		}
	}
	this.showList = function(){
		var tempPos = this.position-this.focusPos;
		for(var i=tempPos; i<tempPos+this.listSize; i++){		
			var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };
			(i>=0&&i<this.dataSize)||(this.showLoop&&this.dataSize!=0) ? this.haveData(tempObj) : this.notData(tempObj);
		}
		this.currPage = Math.ceil((this.position+1)/this.listSize);
		this.listPage = Math.ceil(this.dataSize/this.listSize);
	}
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



function ScrollBar(id, barId, f) {
	this.obj = null;
	this.barObj = null;
	
	iPanel.debug("ScrollBar id= "+id);
	if (typeof(f) == "object"){
		this.obj = f.document.getElementById(id);
		iPanel.debug("ScrollBar this.obj 111");
		if(typeof(barId) != "undefined"){
			this.barObj = f.document.getElementById(barId);
		}
	} else {
		this.obj = mainFrameWindow.document.getElementById(id);
		if(typeof(barId) != "undefined"){
			this.barObj = mainFrameWindow.document.getElementById(barId);
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
};

var util = {
	/**
	 * util.array对象，用来放置与Array有关的工具
	 */
	array : {
		/**
		 * util.array.add方法，将array2数组插到指定的position位置上
		 * @param {array} array1 要被插入的数组
		 * @param {array} array2 要插入的数组
		 * @param {int} position 要插入的位置，默认为在array1最后面，从0开始算起
		 * @return {array} 插入好的数组
		 */

		add : function(array1,array2,position) {
			if (typeof(position) == "number") {
				var temp_array1 = [];
				var temp_array2 = [];
				var array = [];
				
				if (typeof(array1.slice) != "undefined") {	//某些对象返回的数组不支持slice方法，因此采用其他方法实现
					temp_array1 = array1.slice(0,position);
					temp_array2 = array1.slice(position,array1.length);
				}
				else {
					var len = array1.length;
					for (var i = 0; i < len; i ++) {
						if (i < position) {
							temp_array1[temp_array1.length] = array1[i];
						}
						else {
							temp_array2[temp_array2.length] = array1[i];
						}
					}
				}
				
				array = temp_array1.concat(array2);
				
				return array.concat(temp_array2);
			}
			else {
				return array1.concat(array2);
			}
		}
	}
};





// JavaScript Document
/*
 * showSlip对象的作用就是控制Div层的滑动；
 * @__name  所要滑动对象的ID名称；
 * @__sign  “0”表示上下滑动，“1”表示左右滑动；
 * @__delay 此值是控制步长的，每次滑动的步长就是到终点所剩距离的__delay分之一,默认值(4)；
 * @__time  滑动间隔时间,默认值(40)；
 */
function showSlip(__name, __sign, __delay, __time, __f){
	this.Windows = typeof(__f)=="undefined" ? iPanel.mainFrame : __f;
	this.moveObj = this.Windows.document.getElementById(__name);
	this.moveSize = 500;  
	this.moveType = 1;     
	this.moveSign = typeof(__sign)=="number"?(__sign==0?"top":"left") : __sign; 
	this.endPlace  = this.moveObj.style[this.moveSign]; 
	this.currPlace = this.endPlace; 
	this.loadtimer = null;
	this.spaceTime = __time;  
	this.delayValue = __delay==="2D" ? -1 : __delay;
	this.stepSize   = 2;	
	this.stepType   = 0;	
	if(this.delayValue==-1) this.moveObj.style.webkitTransitionDuration = this.spaceTime+"ms"
	this.listener = ["onMoveStart", "onMoveProgress", "onMoveEnd"];
	this.addListener = function(__obj){
		var temp = this.listener;
		for(var i=0; i<temp.length; i++) this[temp[i]] = typeof(__obj[temp[i]])=="function" ? __obj[temp[i]] : function(){};
	}
	this.delListener = function(){
		var temp = this.listener;
		for(var i=0; i<temp.length; i++) this[temp[i]] = function(){};
	}
	this.delListener();
	
	this.moveStart = function(__type, __size){
		this.moveStop();
		this.onMoveStart();
		this.moveType = __type;
		this.moveSize = __size;
		this.endPlace += this.moveSize*this.moveType;
		this.moveGoto();
	}
	this.moveGoto = function(){
		if(this.delayValue==-1){
			this.currPlace = this.endPlace;
			this.setcurrPlace();
			var self = this;
			this.loadtimer = this.Windows.setTimeout(function(){self.onMoveEnd();},this.spaceTime);
		}else{
			var tempStep = this.stepType == 0 ? Math.ceil(Math.abs((this.endPlace-this.currPlace)/this.delayValue))*this.moveType : this.stepSize*this.moveType;
			this.currPlace += tempStep;
			if((this.moveType==-1&&this.currPlace<=this.endPlace)||(this.moveType==1&&this.currPlace>=this.endPlace)||tempStep==0){ 
				this.currPlace = this.endPlace;
				this.setcurrPlace();
				this.onMoveEnd();
			}else{
				this.setcurrPlace();
				this.onMoveProgress();
				var self = this;
				this.Windows.clearTimeout(this.loadtimer);
				this.loadtimer = this.Windows.setTimeout(function(){self.moveGoto();},this.spaceTime*100);
			}
		}
	}
	this.setcurrPlace = function(){
		this.moveObj.style[this.moveSign] = this.currPlace + "px";
	}
	this.tunePlace = function(__num){
		this.endPlace  = __num; 
		this.currPlace = this.endPlace;
		if(this.delayValue==-1) this.moveObj.style.webkitTransitionDuration = "0ms";
		this.setcurrPlace();
		//if(this.delayValue!=-1) this.moveObj.style.webkitTransitionDuration = this.spaceTime+"ms";
	}
	this.moveStop = function(){ this.Windows.clearTimeout(this.loadtimer);}
}