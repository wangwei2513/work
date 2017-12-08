/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；焦点到始/末位置后再按上下键是类似翻页的效果。
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
function showList1(__listSize, __dataSize, __position, __startplace, __f){
	this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
	this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //列表显示的长度；
	this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //所有数据的长度；
	this.position = typeof(__position)=="undefined" ? 0 : __position;  //当前数据焦点的位置；
	this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //列表焦点Div开始位置的值；
	this.focusPos = 0;      //当前列表焦点的位置；
	this.currPage = 1;		//当前在第几页
	this.focusDiv = -1;		//焦点id，如果不重新设置，则默认-1表示不进行焦点设置操作
	this.listHigh = 30;		//列表中每个行的高度，可以是数字或者数组(焦点处于每一行时的top值)，例如：40 或 [140,181,223,263];
	this.listSign = "top";	//取值"top"或"left"；
	this.focusLoop = false;	//上下切换是否循环
	this.pageLoop = false;	//翻页是否循环

	this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
	this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；

	//开始显示列表信息
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
		if(typeof(this.focusDiv) == "number") return;  //如果没定义焦点元素，则不进行设置
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