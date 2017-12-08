/***********************文字滚动***********************/
//@denglc 20170514 ver1.0; 封装文字滚动对象;
//@denglc 20170519 ver1.1; 修改：停止滚动时，原有dom元素的style属性值复原，上个版本会在style中添加dom元素采用的默认值，比如style.verticalAlign=baseline;
var scroll = new scrollText();
function scrollText(){
	this.initFlag = false;	//初始化完成标识
	this.runFlag = false;	//文字滚动标识
	this.timer = null;		//定时器
}

scrollText.prototype.init = function(_element,_direction,_speed,_shift,_delay){
	//_element 要滚动文字dom元素,仅支持inline、inline-block、block,其它的会相应转换成inline-block,并设置部分属性
	//_direction 滚动方向,默认left
	//_speed 滚动速度等级,[1,10],默认1
	//_shift 无缝滚动间的留白,默认50,单位px,[0,Infinity)
	//_delay 每滚动完一次中间停留的时间,默认0,单位ms,[0,Infinity)
	if(this.initFlag || this.runFlag){
		// this.iDebug(">>>scrollText-->init-->it is running!");
		return false;
	}
	this.element = _element.nodeType === 1 ? _element : null;
	if(!this.element){
		// this.iDebug(">>>scrollText-->init-->this is not a element!");
		return false;
	}
	this.text = this.element.innerHTML || "";
	this.size = parseInt(this.getCurrentStyle(this.element,"font-size"),10) || parseInt(this.element.style.fontSize,10) || 0;
	if(!this.text || !this.size){
		// this.iDebug(">>>scrollText-->init-->text:"+this.text+"--size:"+this.size);
		return false;
	}
	this.direction = typeof _direction === "string" ? _direction.toLowerCase() === "left" ? "left" : _direction.toLowerCase() === "right" ? "right" : _direction.toLowerCase() === "top" ? "top" : _direction.toLowerCase() === "bottom" ? "bottom" : "left" : "left";
	this.speed = this.getNum(1,_speed) > 10 ? 10 : this.getNum(1,_speed) < 1 ? 1 : this.getNum(1,_speed);
	this.shift = Math.max(0,this.getNum(50,_shift));
	this.delay = Math.max(0,this.getNum(0,_delay));
	this.type = this.getCurrentStyle(this.element,"display") || this.element.style.display || "";
	// this.iDebug(">>>scrollText-->init-->text:"+this.text+"--size:"+this.size+"--direction:"+this.direction+"--speed:"+this.speed+"--shift:"+this.shift+"--delay:"+this.delay+"--display:"+this.type);
	this.style = this.element.style.cssText;
	// this.iDebug(">>>scrollText-->init-->original style:"+this.style);
	var maxWidth = parseInt(this.getCurrentStyle(this.element,"width"),10) || parseInt(this.element.style.width,10) || 0;
	var maxHeight = parseInt(this.getCurrentStyle(this.element,"height"),10) || parseInt(this.element.style.height,10) || 0;
	//对inline-block的设置不能先于maxWidth和maxHeight的获取
	if(this.type !== "block" || this.type !== "inline-block"){
		this.element.style.display = "inline-block";
		this.element.style.verticalAlign = "bottom";
	}
	this.timeCell = Math.floor(100/(Math.min(4,this.speed)));
	this.shiftCell =((this.direction === "left" || this.direction === "top") ? 1 : -1) * (2*(Math.max(4,this.speed)-4) || 1);
	// this.iDebug(">>>scrollText-->init-->maxWidth:"+maxWidth+"--maxHeight:"+maxHeight);
	if(this.direction === "left" || this.direction === "right"){
		var span = document.createElement("span");
		span.style.fontSize = this.size + "px";
		span.style.whiteSpace = "nowrap";
		span.innerHTML = this.text;
		document.body.appendChild(span);
		var width = span.offsetWidth;
		document.body.removeChild(span);
		// this.iDebug(">>>scrollText-->init-->width:"+width);
		if(width > maxWidth){
			this.element.innerHTML = "";
			this.element.style.width = (maxWidth == 0 ? width : maxWidth) + "px";
			this.element.style.whiteSpace = "nowrap";
			this.element.style.wordBreak = "";
			this.element.style.overflow = "hidden";
			var div1 = document.createElement("div");
			div1.innerHTML = this.text;
			div1.style.fontSize = this.size + "px";
			div1.style.width = width + "px";
			div1.style.display ="inline-block";
			var div2 = document.createElement("div");
			div2.innerHTML = this.text;
			div2.style.fontSize = this.size + "px";
			div2.style.width = width + "px";
			div2.style.display ="inline-block";
			div2.style.marginLeft = this.shift + "px";
			this.element.appendChild(div1);
			this.element.appendChild(div2);
			this.start = this.direction === "left" ? 0 : 2*width+this.shift;
			this.end = this.direction === "left" ? width + this.shift : width - (maxWidth || width);
			this.element.scrollLeft = this.start;
			this.initFlag = true;
		}
	}else{
		var width = maxWidth === 0 ? this.size : maxWidth;
		var div = document.createElement("div");
		div.innerHTML = this.text;
		div.style.fontSize = this.size + "px";
		div.style.width = width + "px";
		div.style.wordBreak = "break-all";
		document.body.appendChild(div);
		var height = div.offsetHeight;
		document.body.removeChild(div);
		// this.iDebug(">>>scrollText-->init-->height:"+height);
		if(height > maxHeight){
			this.element.innerHTML = "";
			this.element.style.height = (maxHeight == 0 ? height : maxHeight) + "px";
			this.element.style.width = width + "px";
			this.element.style.whiteSpace = "";
			this.element.style.wordBreak = "break-all";
			this.element.style.overflow = "hidden";
			var div1 = document.createElement("div");
			div1.innerHTML = this.text;
			div1.style.fontSize = this.size + "px";
			div1.style.width = width + "px";
			div1.style.height = height + "px";
			div1.style.display ="block";
			var div2 = document.createElement("div");
			div2.innerHTML = this.text;
			div2.style.fontSize = this.size + "px";
			div2.style.width = width + "px";
			div2.style.height = height + "px";
			div2.style.display ="block";
			div2.style.marginTop = this.shift + "px";
			this.element.appendChild(div1);
			this.element.appendChild(div2);
			this.start = this.direction === "top" ? 0 : 2*height+this.shift;
			this.end = this.direction === "top" ? height + this.shift : height - (maxHeight || height);
			this.element.scrollTop = this.start;
			this.initFlag = true;
		}
	}
	this.run(this);
};

scrollText.prototype.run = function(self){
	var self = self;
	if(!self.initFlag){
		// self.iDebug(">>>scrollText-->run-->stop running or cause some mistakes!");
		return false;
	}
	self.runFlag = true;
	clearTimeout(self.timer);
	self.timer = setTimeout(function(){
		if(self.direction === "left" || self.direction === "right"){
			if((self.direction === "left" && self.element.scrollLeft >= self.end) || (self.direction === "right" && self.element.scrollLeft <= self.end)){
				self.element.scrollLeft = self.start;
				setTimeout(function(){self.run(self);},self.delay);
			}
			else{
				self.element.scrollLeft += self.shiftCell;
				self.run(self);
			}
		}else{
			if((self.direction === "top" && self.element.scrollTop >= self.end) || (self.direction === "bottom" && self.element.scrollTop <= self.end)){
				self.element.scrollTop = self.start;
				setTimeout(function(){self.run(self);},self.delay);
			}
			else{
				self.element.scrollTop += self.shiftCell;
				self.run(self);
			}
		}
	},self.timeCell);
};

scrollText.prototype.stop = function(){
	if(!this.runFlag){
		// this.iDebug(">>>scrollText-->stop-->it does not run or it has a mistake!");
		return false;
	}
	clearTimeout(this.timer);
	this.element.innerHTML = this.text;
	if(this.direction === "left" || this.direction === "right"){
		this.element.scrollLeft = 0;
	}else{
		this.element.scrollTop = 0;
	}
	this.element.style.cssText = this.style;
	this.initFlag = false;
	this.runFlag = false;
	// this.iDebug(">>>scrollText-->stop-->success!");
};

scrollText.prototype.getCurrentStyle = function(obj,attr){	//获取元素的style属性
	if(obj.currentStyle){//IE
		return obj.currentStyle[attr];
	}
	else if(window.getComputedStyle){//非IE
		return document.defaultView.getComputedStyle(obj,null)[attr];	//参数DOM 伪类如:after 暂不考虑加伪类的情况
	}
	else{
		return null;
	}
};

scrollText.prototype.getNum = function(_defaultNum,_changeNum){
	return typeof _changeNum === "number" ? _changeNum : isNaN(parseInt(_changeNum,10)) ? _defaultNum : parseInt(_changeNum,10);
};

scrollText.prototype.iDebug = function(_str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(_str);	//假如要看打印的时间，可以改：iPanel.debug(_str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(_str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(_str);
	}
};
/******************************************************/