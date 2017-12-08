(function(){
	var cell_x = 6;
	var cell_y = 3;
	var menu_type = 0;      //0，高清，1,标清(720*576) 2：标清(640*576)
	var overFlag = 1;  //0手动缩放出现，需要手动关闭，1自动从下往上划，自动关闭
	
	var _component ={
		"pos":{  left:"30px", top:"13px"}, 	//30px: 为左、右吃边的距离，13px: 上、下面吃边的	
		"BG":{	//条目的背景色
			backgroundColor:"#000000", 
			opacity:"1", 
			borderWidth:"1px",
			border:"#949699 solid",
			position:"absolute"
			},		
		
		"item":{			//水平的七个条目
			position:"absolute",
			textAlign:"center",
			verticalAlign:"middle"
			},
		"font":{		//dialog的文字信息
			fontSize:"48px",
			color:"#64924d"
		},
		itemCell:{x:cell_x, y:cell_y},
		menu_type:menu_type,
		overFlag:overFlag,
		zIndex:50	
	};  
	
	//function dialogComponent(args){
	var dialogComponent=function(args){
		this.componentInfo = args;
		this.duration = args.duration||"400ms";
		this.overFlag = args.overFlag;
		this.menu_type = args.menu_type;
		this.zIndex = args.zIndex;
		this.whArr = [[1280,720],[720,576],[640,576]];
		this.eatBorder = [[60,24],[48,44],[48,44]];
		this.wh = this.whArr[this.menu_type];
		this.table={x:16, y:14};		//一个页面全部的划分的格子数
		this.cell_width = (this.wh[0]-this.eatBorder[this.menu_type][0])/this.table.x;			//页面划分单元格的宽度
		this.cell_height = (this.wh[1]-this.eatBorder[this.menu_type][1])/this.table.y;		//页面划分单元格的高度
		
		this.container = null;		//dialog容器
		this.outDivBorderWidth = 2;		//最外层div有两个宽2像素的border
		this.itemObj = null;		//放条目的div
		
		this.showFlag = false;
		this.haveData = function(){}
		this.callback = function(){}
		
		this.init = function(){
			this.componentInfo.pos.left = this.menu_type == 0 ? "30px" : "24px";
			this.componentInfo.pos.top = this.menu_type == 0 ? "13px" : "22px";
			this.createContainer();
			//this.loadData();
		};
		
		this.createContainer = function(){
			var frag = document.createDocumentFragment();
			var itemCell = this.componentInfo.itemCell;
			this.container= this.createDom("div", frag);
			var _width = itemCell.x*this.cell_width+"px";
			var _height = itemCell.y*this.cell_height+"px";
			var _left =parseInt(this.componentInfo.pos.left)+Math.floor((this.table.x-itemCell.x)/2*this.cell_width)+"px";
			var _top = Math.floor((this.table.y-itemCell.y)/2*this.cell_height)-parseInt(this.componentInfo.pos.top)+"px";
			this.extend(this.container.style, {
						position:"absolute", 
						width:_width, 
						height:_height, 
						left:_left, 
						top:_top,
						border:"#635534 solid ", 
						borderWidth:this.outDivBorderWidth+"px",
						visibility:"hidden"
					});		//加了2D，与里面设置背景div就构成嵌套，
			
			this.createBg(this.container);
			this.createItem(this.container);
			document.body.appendChild(frag);
			
		};
		
		this.createBg=function(con){
			var itemCell = this.componentInfo.itemCell;
			var _width = itemCell.x*this.cell_width+2;
			var _height = itemCell.y*this.cell_height+2;
			var bg = this.createDom("div", con);
			this.extend(bg.style, this.componentInfo.BG);
			_width = parseInt(_width - 2*this.outDivBorderWidth)+"px";
			_height = parseInt(_height - 2*this.outDivBorderWidth)+"px";
			this.extend(bg.style, {width:_width, height:_height});
		};
		
		this.createItem=function(con){
			var itemCell = this.componentInfo.itemCell;
			var _height = parseInt(itemCell.y*this.cell_height-20)+"px";
			this.itemObj = this.createDom("div", con);
			this.extend(this.itemObj.style, {
					position:this.componentInfo.item.position,
					width:"100%", 
					height:_height, 
					left:"0px", 
					top:"0px",
					fontSize:this.componentInfo.font.fontSize,
					lineHeight:_height,
					color:this.componentInfo.font.color, 
					textAlign:this.componentInfo.item.textAlign
			});
		};
		
		this.loadData = function(args){
			this.callback = typeof args.callback == 'undefined'?function(){}:args.callback;
			var itemCell = this.componentInfo.itemCell;
			var _height = parseInt(itemCell.y*this.cell_height-20)+"px";
			if(args.id == 1){		//文本
				this.itemObj.innerHTML = args.content;	
			}else if(args.id == 2){		//图片
				this.itemObj.style.backgroundImage = "url("+args.content+")";
				this.itemObj.style.backgroundPosition = "center";
				this.itemObj.style.backgroundRepeat="no-repeat";
			}else{		//其它的
				this.itemObj.innerHTML = args.content;	
			}
		};
		
		this.appear=function(){
			this.showFlag = true;
			if(this.container.style.visibility == "hidden"){
				this.container.style.webkitTransitionDuration = "0s"
				this.container.style.zIndex = this.zIndex;
				this.container.style.opacity = "0";
				var that = this;
				if(this.overFlag==0){
					this.container.style.webkitTransform = "scale(0.9)";
					setTimeout(function(){
							that.container.style.webkitTransitionDuration = that.duration;
							that.container.style.visibility = "visible";
							that.container.style.opacity = "1";
							that.container.style.webkitTransform = "scale(1)";
					}, 200);
				}else if(this.overFlag==1){
					this.container.style.top = "720px";
					setTimeout(function(){
							that.container.style.webkitTransitionDuration = that.duration;
							that.container.style.visibility = "visible";
							that.container.style.opacity = "1";
							that.container.style.top = that.cell_height*10+"px";
							setTimeout(function(){
								that.container.style.opacity = "0";
								that.container.style.top = that.cell_height*8+"px";	
								setTimeout(function(){
									that.showFlag = false;
									that.container.style.visibility = "hidden";
									that.callback();
								},that.duration);
							},1000);
					}, 200);
				}
			}else{
				if(this.overFlag==0){
					this.container.style.opacity = "1";
					this.container.style.webkitTransform = "scale(1)";
				}
			}
		};
		
		this.disappear=function(){
			if(this.overFlag==0){
				this.showFlag = false;	
				this.container.style.webkitTransform = "scale(0.9)";
				this.container.style.opacity = "0";
			}
		};
		
		/*************创建dom的一般方法*********/
		this.createDom = function(tag, container){
			var dom = document.createElement(tag);
			container.appendChild(dom);
			return dom;
		};
		
		/*************扩展对象*********/
		this.extend=function(destination, source){ 
			for (var property in source){
				destination[property] = source[property];
			}
			return destination;	
		}
	}
	
	
	//注册一个对象，将new comfirmComponent() 赋值给注册的对象
	registObj = function(){
		var _dialogObj = new dialogComponent(_component);
		_dialogObj.init();
		return _dialogObj;
	};
})()
