 	/**
     * 图片列表条目预览
     * @param  {[type]} _data    		预览的图片地址数组
     * @param  {[type]} _imgSize 		显示参数，数组，[前，中，后],非数组则相当于[0,len,0]
     * @param {[type]} __position  		开始焦点位置,数组或者数字，[position,focusPos]，数字相当于[0,focusPos]
     * @param {[type]} __startplace  	焦点开始的位置
     * @param {[type]} _pre  			img标签id的前缀,默认"img_"，id下标从imgStart （0）开始
     * @return {[type]}         
     */
function imgList_w(_data, _imgSize, _position, _startplace, _pre){
	this.preload 	= 1;//开启图片预加载功能
	this.preloadTime=1000;//预加载延迟时间
 	this.imgStart 	= 0;//img标签id的下标
	this.focusDiv 	= -1;//焦点div
	this.imgDom 	= [];//dom缓存
	this.imgLoop	= 1;//是否循环显示图片
	this.imgHeight 	= 150;//焦点位置梯度，可以传数组
	this.changeType = 1;//焦点平滑移动方式
	this.imgSign 	= 1;//0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
	this.d 			= 70;//焦点滚动时缓动函数参数d
	this.moveTime 	= 5;//焦点滚动时焦点滑动interval参数
	this.moveFn 	= "easeOut";//焦点平滑滚动缓动函数 easeIn、easeOut、 easeInOut
	this.imgArr 	= _data || [];//操作图片数组
	this.pre 		= _pre || "img_";//dom里边img标签id的前缀
	this.startplace = _startplace || 0;//焦点开始绝对位置
	this.preLen 	= _imgSize&&_imgSize[0]||0;//前预览图片数量
	this.midLen 	= _imgSize&&_imgSize[1]||0;//中图片数量
	this.aftLen		= _imgSize&&_imgSize[2]||0;//后预览图片数量
	this.focusPos 	= _position&&_position[1]||0;//起始焦点
	this.changeCallBack = function(){};
	this.setContent = function(){};
	this.startShow = function(){
		if(this.imgArr.length===0) return;
		this.focusPos = this.focusPos>this.preLen+this.midLen-1?this.preLen+this.midLen-1:this.focusPos<this.preLen?this.preLen:this.focusPos;
		this.imgLen = this.preLen + this.midLen + this.aftLen;
		this.appendImg = [];
		this.focusPlace = this.startplace+this.focusPos*this.imgHeight;
		this.position = _position&&_position[0]||0;
		this.lastPosition = this.position;
		this.lastFocusPos = this.focusPos;
		this.posIsArr = "[object Array]"===Object.prototype.toString.call(this.imgHeight);
		this.changeType = this.changeType==1||this.changeType.toString().toLowerCase()==="scroll"?1:0;
		this.imgSign= parseInt(this.imgSign)===1||this.imgSign.toString().toLowerCase()==="left"?1:0;
		this.startAppendPos = this.position-this.focusPos<0?(this.imgArr.length+this.position-this.focusPos):this.position-this.focusPos;
		this.initDom();
		this.initImg();
		var pos = this.posIsArr?this.imgHeight[this.focusPos]:this.imgHeight*this.focusPos+this.startplace;
		if(this.imgSign===1 && !!this.focusDiv) this.focusDiv.style.left =  pos + "px";
		else if(!!this.focusDiv) this.focusDiv.style.top = pos + "px";
	};
	this.showFocus = function(){
		if(this.changeType === 1) {
			var s=this,ag =s.posIsArr,h=s.imgHeight,p=s.focusPos,f=s.tmplastfocuspos,e=ag?h[p]-h[f]:(p-f)*h,o=new s.fn(s.moveFn),i=0,c=Math.abs(e),a=0,d=s.d,tm=s.focusPlace||h[f]||0,l=s.focusDiv.style,r;
            clearInterval(s.intval);
            s.focusPlace += e;
            s.intval = setInterval(function(){
                if(a < c || e == 0) {
                    i++; a = parseInt(o(i,0,c*1.02,d));a = a > c ? c : a;r = tm + (e > 0 ? a : -a);
                    if(s.imgSign) l.left = r + "px"; else l.top = r + "px";
                    if(a === c)clearInterval(s.intval);
                }
            },s.moveTime);
		} else {
			var pos = this.posIsArr?this.imgHeight[this.focusPos]:this.imgHeight*this.focusPos+this.startplace;
			if(this.imgSign===1) this.focusDiv.style.left =  pos + "px";
			else this.focusDiv.style.top = pos + "px";
		}
	};
	this.initImg = function(){
		this.appendImg = [];
		var len1 = this.imgLen+this.startAppendPos<this.imgArr.length?this.imgLen:(this.imgArr.length-this.startAppendPos),
			len2 = this.imgLen - len1,self=this,tmp;
		for (var i = 0;i < len1;i++)this.appendImg.push(this.imgArr[this.startAppendPos+i]);
		for (var i = 0;i < len2;i++)this.appendImg.push(this.imgArr[i]);
		for (var i = 0;i < this.appendImg.length;i++) {
			tmp = this.appendImg[i]&&this.appendImg[i].src||this.appendImg[i]||"",dpos=this.startAppendPos+i>=this.imgArr.length?i+this.startAppendPos-this.imgArr.length:this.startAppendPos+i;
			if(!!this.imgDom[i]) this.imgDom[i].src = tmp;
			this.setContent({idPos:i,dataPos:dpos},tmp);
		}
		tmp = typeof this.appendImg[this.focusPos]==="object"?this.appendImg[this.focusPos].src:this.appendImg[this.focusPos];
		this.changeCallBack(tmp,this.position,this.focusPos,this.lastPosition,this.lastFocusPos);
		if(!!this.preload) setTimeout(function(){self.preloadImg(self.imgArr)},this.preloadTime);
	};
	this.changeImg = function(_num){
		var len = this.imgArr.length-this.imgLen,tmp=0,postmp,foctmp;
		postmp = this.position;
		this.lastStartAppendPos = this.startAppendPos;
		this.position += _num;
		this.position=this.position>this.imgArr.length-1?!!this.imgLoop?0:this.imgArr.length-1:this.position<0?!!this.imgLoop?this.imgArr.length-1:0:this.position;
		if(postmp!==this.position) this.lastPosition = postmp;
		tmp = !!this.imgLoop?this.focusPos<=this.preLen&&_num<0||_num>0&&this.focusPos>=this.preLen+this.midLen-1?_num:0:this.position<this.startAppendPos+this.preLen?-1:this.position>this.startAppendPos+this.preLen+this.midLen-1?1:0;
		if(tmp!== 0) {
			this.startAppendPos += tmp;
			this.startAppendPos=this.startAppendPos<0?(!!this.imgLoop?this.imgArr.length-1:0):this.startAppendPos>len?(!!this.imgLoop?(this.startAppendPos>this.imgArr.length-1?0:this.startAppendPos):len):this.startAppendPos;
			this.initImg();
		}
		tmp = !!this.imgLoop?this.focusPos>=this.preLen&&this.focusPos<=(this.preLen+this.midLen)?_num:0:_num<0&&this.focusPos>this.preLen?-1:_num>0&&this.focusPos<this.preLen+this.midLen-1?1:this.position+this.aftLen>this.imgArr.length-1?1:this.position<this.preLen?-1:0;
		postmp = this.focusPos,this.tmplastfocuspos=this.focusPos;
		this.focusPos += tmp;
		foctmp = !!this.imgLoop?[this.preLen,this.preLen+this.midLen-1]:[0,this.imgLen-1];
		this.focusPos = this.focusPos<=foctmp[0]?foctmp[0]:this.focusPos>=foctmp[1]?foctmp[1]:this.focusPos;
		if(postmp!==this.focusPos) {
			this.lastFocusPos = postmp;
			this.showFocus();
			tmp = this.appendImg[this.focusPos],  src = typeof tmp==="object"?tmp.src:tmp;
			this.changeCallBack(src,this.position,this.focusPos,this.lastPosition,this.lastFocusPos);
		}
		// console.log(this.focusPos)
	};
	this.initDom = function(){
		if(this.imgDom.length == 0) for (var i = this.imgStart;i < this.imgLen+this.imgStart;i++) this.imgDom.push(this.$(this.pre+i));
		this.focusDiv = this.$(this.focusDiv);
	};
	this.preloadImg = function(){
		if(this.imgArr.length === 0) return ;
		var self = this,
			imgLoad = function(i){
				if(self.imgArr.length-1<=i) return ;
				if(typeof self.imgArr[i] == "object") {
					imgLoad(++i);
					return ;
				}
				var img = new Image();
				img.src = self.imgArr[i];
				img.addEventListener("load",function(){
					self.imgArr[i] = img;
					imgLoad(++i);
				img.onerror = function(){imgLoad(++i);};
				},false);
			};
		imgLoad(0);
	};
	this.$ = function(id){return document.getElementById(id)}
	this.fn = function(_type){
            var Fn =  {
                easeInOut : function(t,b,c,d,a,p){ if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;  return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;},
                easeOut : function(t,b,c,d){return (t==d) ? b+c : c * (-Math.pow(2, -10 * t /d) + 1) + b;},
                easeIn: function(t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;},
                none : function(t,b,c,d){return c;},
            };
            return  Fn[_type];
         }
}
