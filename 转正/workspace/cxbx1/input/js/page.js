// JavaScript Document

	
/*parmObj = {
	pageDivId:"page",			//显示区和隐藏区的DIV名称 (page0 page1)
	focusId:"focus",			//焦点ID
	arrLength:dataArr.length,	//数据总长度
	row:3,						//显示区的行数
	list:4,						//显示区的列数		
	rowHeight:200,				//行高
	listWidth:300,				//列宽
	leftArrowId:"leftArrow",	//内容区左边箭头的ID
	rightArrowId:"rightArrow"	//内容区右边箭头的ID
	haveDotArea:1,				//是否有页码？ 0没有、1有	
	//如果haveDotArea为0 下边这些不需要传*************控制页码信息
	dotWidth:20,				//页码小圆点宽度，注：0-9这9个数字的宽度应该一样
	dotHeight:16,				//小圆点的高 用于使小圆点垂直居中
	dotAreaDivBg:"pageBg",		//写入页码小圆点和数字背景DIV的id（做页码区的背景的渐隐和渐现用.没有可不写））
	dotAreaDivID:"",			//写入页码小圆点和数字的DIV的ID 
	//dotAreaDivBgImg:"images/dotAreaDivBgImg.png",	//页码区DIV的背景图片路径 用于辨别焦点域的变化(从内容区跳到页码区)
	leftArrowId:"leftArrow",	//页码区左边箭头Id
	rightArrowId:"rightArrow",	//页码区右边箭头Id
	dotImgSrc:"images/dotImg.png",	//小圆点的图片路径
    numImgName:"images/pageNum",		//页码数字的名称	//"images/pageNum0.png"—"images/pageNum9.png"
	dotFocusId:"dotFocus",			//页码区的焦点（移动的圈圈）
	focusScale:"1.1"					//焦点从内容区进入页码区时，要不要缩放的效果。不写时默认为1.1的放大倍数
	**********************
}*/

function flip(_parmObj){
	this.$ = function(_id){return document.getElementById(_id)};
	this.focusPos = 0;								//焦点位置
	this.dataPos = 0;								//数据位置
	this.pageDivId = _parmObj.pageDivId;			//显示区和隐藏区的DIV名称 (page0 page1)
	this.focusId = _parmObj.focusId || "";			//焦点ID
	this.arrLength = _parmObj.arrLength;			//数据总长度
	this.row = _parmObj.row;						//显示区的行数
	this.list = _parmObj.list;						//显示区的列数
	this.leftDivLeft = -720;						//显示区向左移出的位置
	this.rightDivLeft = 720;						//显示区向右移出的位置
	this.moveDuration = "top";
	this.duration = "0ms";
	this.rowHeight = _parmObj.rowHeight;			//行高	
	this.listWidth = _parmObj.listWidth;			//列宽
	this.haveDotArea = _parmObj.haveDotArea || 0;	//是否有页码？ 0没有、1有
	this.focusX = this.focusId==""?0:parseInt($(this.focusId).style.left);		//焦点的left值
	this.focusY = this.focusId==""?0:parseInt($(this.focusId).style.top);			//焦点的top值

	this.leftArrowId = _parmObj.leftArrowId || "";	//左边箭头Id
	this.rightArrowId = _parmObj.rightArrowId || "";//右边箭头Id	
	
	this.pageSize = this.row*this.list;			//每页的长度
	this.haveData = function(){}; 				//在显示列表信息时，有数据信息就会调用该方法
	this.notData = function(){}; 					//在显示列表信息时，无数据信息就会调用该方法
	this.totlePage = 0;								//总页码
	this.currPage = 1;								//当前页
	this.currPageDiv = 0;							//记录当前页面显示的DIV 0为初始显示的 1为初始隐藏的
	this.otherPageDiv = 1;							//隐藏的DIV
	this.areaFlag = 0;								//记录当前操作的是内容区还是页码区
	this.firstDivLeft = parseInt(this.$(this.pageDivId+0).style.left);
	this.secondDivLeft = parseInt(this.$(this.pageDivId+1).style.left);
	this.leftArrowLeft = this.leftArrowId==""?0:parseInt(this.$(this.leftArrowId).style.left);
	this.rightArrowLeft = this.rightArrowId==""?0:parseInt(this.$(this.rightArrowId).style.left);
	this.timeout = [];				//计时器数组
	this.flag = 0;					//移动页码时页面是否已经刷新
	this.firstFresh = 0;			//移动页码时移到第一页时页面是否已经刷新
	this.lastFresh = 0;				//移动页码时移到最后一页时页面是否已经刷新
	//页码区单行单列对象
	this.dotDiv = [];				//页码小圆点的数组
	this.DotFocusPos = 0;			//页码区焦点位置
	this.DotFocusStartLeft = 0;		//页码区焦点起始位置
	this.DotFirstDivLeft = 0;		//第一个DIV的位置
	this.DotLeftDivLeft = 0; 		//移动行DIV最上面的位置；
	this.DotRightDivLeft = 0;		//移动行DIV最下面的位置；
	this.dotFocusId = _parmObj.dotFocusId || "";	//页码区的焦点（移动的圈圈）
	/********初始化：信息输出、焦点定位********/
	this.init = function(){
		this.totlePage = Math.ceil(this.arrLength/this.pageSize);
		this.currPage = this.dataPos==0?1:Math.ceil(this.dataPos/this.pageSize);
		//左右箭头控制
		this.changeArrow();
		/******信息区DIV重新排列******/
		/*去除两个DIV和焦点的渐变效果*/
		this.$(this.pageDivId+0).style.webkitTransitionDuration = "0ms";
		this.$(this.pageDivId+1).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		/*获取当前应该显示哪个DIV*/
		this.currPageDiv = (this.currPage-1)%2;
		/*获取需要隐藏的DIV*/
		this.otherPageDiv = this.currPageDiv==0?1:0;
		this.$(this.pageDivId+this.currPageDiv).style[this.moveDuration] = this.firstDivLeft+"px";
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = this.secondDivLeft+"px";
		
		/*重置两个DIV和焦点的渐变效果*/
		this.$(this.pageDivId+0).style.webkitTransitionDuration = "300ms";
		this.$(this.pageDivId+1).style.webkitTransitionDuration = "300ms";
		/*输出信息*/
		for(var i=0;i<this.pageSize;i++){
			if(this.dataPos-this.focusPos+i<this.arrLength){
				this.haveData(this.currPageDiv,i,this.dataPos-this.focusPos+i);
			}else{
				this.notData(this.currPageDiv,i,this.dataPos-this.focusPos+i);
			}
		}
		/*焦点定位*/
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		this.$(this.focusId).style.webkitTransitionDuration = this.duration;
		
	}
	/*移动焦点函数*/
	this.changeFocus = function(_num){
		if(this.dataPos+_num<this.arrLength&&this.dataPos+_num>=0){
			this.dataPos += _num
			this.focusPos += _num;
			if(this.dataPos<0)this.dataPos=0;
			else if(this.dataPos>this.arrLength)this.dataPos=this.arrLength-1;
			clearTimeout(this.timeout[5]);
			if((this.focusPos+this.list+1)%this.list==0&&_num==-1&&(this.dataPos-this.pageSize+1)>=0){	
				/*按左时焦点移到最左边并且左边有数据	向左滑动*/
				this.focusPos -= _num;
				this.dataPos += _num*(this.pageSize-1);
				this.changePage(-1);
			}else if((this.focusPos+this.list+1)%this.list==0&&_num==-1&&(this.dataPos-this.pageSize+1)<0){	
				/*按左时焦点移到最左边并且左边没有数据*/
				this.focusPos -= _num;
				this.dataPos -= _num;
				this.onFocus();
			}else if(this.focusPos%this.list==0&&_num==1&&(this.dataPos+this.pageSize-this.focusPos)<this.arrLength){	
				/*按右时焦点移到最右边且右边有数据	向右边滑*/
				if(this.arrLength-this.pageSize*this.currPage<this.pageSize&&this.arrLength%this.pageSize<this.focusPos){
					this.focusPos = this.arrLength%this.pageSize-1;
					this.dataPos = this.arrLength-1;
				}else{
					this.focusPos -= _num;
					this.dataPos += _num*(this.pageSize-1);
				}
				this.changePage(1);
			}else if(this.focusPos%this.list==0&&_num==1&&(this.dataPos+this.pageSize-this.focusPos)>=this.arrLength){
				/*按右时焦点移到最右边并且右边没有数据	焦点做滑出移进效果*/
				this.focusPos -= _num;
				this.dataPos -= _num;
				this.onFocus();
			}else if(this.focusPos>this.pageSize-1 && _num==this.list){
				 var tempfocus = this.focusPos%(this.row*this.list);
				 this.focusPos = this.dataPos+tempfocus==this.arrLength?tempfocus-1:tempfocus;
				 this.changePage(1);
				 //this.onFocus();
			}else if(this.focusPos<0 && _num==-this.list){
				this.focusPos = this.dataPos%this.pageSize;
				this.changePage(-1);
			}else{}
			if(this.focusPos%this.list==0 && this.currPage>1){	//左边临界点时 左箭头跳动
				this.arrowMove(this.leftArrowId,-1,this.areaFlag,1);
			}else if((this.focusPos+this.list+1)%this.list==0 && this.currPage<this.totlePage){		//右边临界点时 右箭头跳动
				this.arrowMove(this.rightArrowId,1,this.areaFlag,1);
			}
		}else if((this.dataPos+_num>=this.arrLength || this.dataPos+_num<0) && (_num==-1||_num==1)){
			this.onFocus();
		}
		
	}
	this.onFocus = function(){
		var self = this;
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.opacity = "0";
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		this.$(this.focusId).style.webkitTransitionDuration = this.duration;
		this.$(this.focusId).style.opacity = "1";
	}
	/*移动页DIV函数 _num为-1向左移动 _num为1向右移动*/
	this.changePage = function(_num){
		//隐藏焦点和箭头
		if(this.leftArrowId!=""){
			this.$(this.leftArrowId).style.visibility = "hidden";
			this.$(this.rightArrowId).style.visibility = "hidden";
		}
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.opacity = "0";
		/*******将即将移进的DIV先放到左边或者右边并给其输出信息******/
		this.$(this.pageDivId+this.otherPageDiv).style.webkitTransitionDuration = "0ms";
		var moveLeft = _num==1?this.rightDivLeft:this.leftDivLeft;		//判断是把即将移动的DIV隐藏在左边还是右边
		var hidLeft = _num==1?this.leftDivLeft:this.rightDivLeft;		//判断是把即将移动的DIV隐藏在左边还是右边
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = moveLeft+"px";		//移动位置
		for(var i=0;i<this.pageSize;i++){								//输出信息
			if(this.dataPos-this.focusPos+i<this.arrLength){
				this.haveData(this.otherPageDiv,i,this.dataPos-this.focusPos+i);
			}else{
				this.notData(this.otherPageDiv,i,this.dataPos-this.focusPos+i);
			}
		}
		
		//还原渐变
		this.$(this.pageDivId+this.currPageDiv).style.webkitTransitionDuration = this.duration;
		this.$(this.pageDivId+this.otherPageDiv).style.webkitTransitionDuration = this.duration;
		//移动两个DIV
		this.$(this.pageDivId+this.currPageDiv).style[this.moveDuration] = hidLeft+"px";
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = this.firstDivLeft+"px";
		
		
		
		this.currPage += _num;
		if(this.currPage<1)this.currPage=1;
		else if(this.currPage>this.totlePage)this.currPage=this.totlePage;
		//当前显示哪个DIV
		this.currPageDiv = (this.currPage-1)%2;
		//隐藏哪个DIV
		this.otherPageDiv = this.currPageDiv==0?1:0;
		
		this.dataPos = (this.currPage-1)*this.pageSize+this.focusPos>this.arrLength?this.arrLength-1:(this.currPage-1)*this.pageSize+this.focusPos;
		this.focusPos = (this.currPage-1)*this.pageSize+this.focusPos>this.arrLength?this.arrLength%this.pageSize-1:this.focusPos;
		
		//焦点重新定位
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		
		var self = this;
		this.timeout[5] = setTimeout(function(){
			self.$(self.focusId).style.webkitTransitionDuration = this.duration;
			self.$(self.focusId).style.opacity = "1";
			self.changeArrow();
		},500);
	}
	
	this.changeArrow = function(){
		//左右箭头控制
		if(this.leftArrowId!="" && this.totlePage>1){
			if(this.currPage<2){
				clearInterval(this.timeout[1]);
				this.$(this.leftArrowId).style.left = this.leftArrowLeft + "px";
				this.$(this.leftArrowId).style.visibility = "hidden";
				this.$(this.rightArrowId).style.visibility = "visible";
			}else if(this.currPage>1 && this.currPage<this.totlePage){
				this.$(this.leftArrowId).style.visibility = "visible";
				this.$(this.rightArrowId).style.visibility = "visible";
			}else if(this.currPage>this.totlePage-1){
				clearInterval(this.timeout[1]);
				this.$(this.rightArrowId).style.left = this.rightArrowLeft + "px";
				this.$(this.leftArrowId).style.visibility = "visible";
				this.$(this.rightArrowId).style.visibility = "hidden";
			}
		}
	}
	this.arrowMove = function(_id,_pos,_areaFlag,_flag){
		if(this.leftArrowId!=""){
			clearInterval(this.timeout[1]);
			this.$(this.leftArrowId).style.left = this.leftArrowLeft + "px";
			this.$(this.rightArrowId).style.left = this.rightArrowLeft + "px";
			if(_areaFlag==0&&_flag==1){
				var tempLeft = parseInt(this.$(_id).style.left);
				this.timeout[1] = setInterval(function(){
					this.$(_id).style.left = parseInt(this.$(_id).style.left)+_pos*2+"px";
					if(parseInt(this.$(_id).style.left)>tempLeft+6 || parseInt(this.$(_id).style.left)<tempLeft-6)_pos = _pos==1?-1:1;
				},50)
			}
		}
	}
	//返回一个当前焦点所在位置的id
	this.currId = function(){
		var currId = {page:null,num:null};
		currId.page = this.currPageDiv;
		currId.num = this.focusPos;
		return currId;
	}
	this.hid = function(_id){
		this.$(_id).style.webkitTransform = "scale("+this.scale+")";
		this.$(_id).style.opacity = "0";
	}
	this.vis = function(_id){
		this.$(_id).style.visibility = "visible";
		this.$(_id).style.opacity = "1";
		this.$(_id).style.webkitTransform = "scale(1)";
	}
}