/**********************************************/
//var parmObj = {
//	divIdName:      "D",
//	fixPos:          2,             //定焦的位置 D2
//	menuDivAmount:   6,             //所有DIV的数量
//	menuLength:      tmArray.length //数据总长度
//};
/**********************************************/

function fixFocusMenu(__parmObj){
	this.$ = function(__id){return document.getElementById(__id);}
	this.divIdName = __parmObj.divIdName;
	this.fixPos = __parmObj.fixPos; //定焦的位置
	this.menuPos = 0; //焦点对应的数据默认位置
	this.menuDivAmount = __parmObj.menuDivAmount;
	this.record = []; //记录ID
	this.menuLength = __parmObj.menuLength;	
	this.duration = 0;
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
	
	this.changeFocus = function(__num){
		this.menuPos+=__num;
		if(this.menuPos<0)this.menuPos = this.menuLength-1;
		else if(this.menuPos>this.menuLength-1)this.menuPos = 0;
		for(var i=0;i<this.record.length;i++){
			this.record[i]= (__num>0)?(this.record[i]+1)%this.record.length:(this.record[i]+this.record.length-1)%this.record.length;
			var recordPos = this.record[i]
			if(__num>0&&i==this.record.length-1){//正向
				this.$(this.divIdName+recordPos).style.webkitTransitionDuration = 0;
				this.haveData(recordPos,(this.menuPos+this.record.length-1-this.fixPos)%this.menuLength);
			}
			else if(__num<0&&i==0){
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
