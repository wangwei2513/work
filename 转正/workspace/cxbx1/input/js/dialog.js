(function(){
	var cell_x = 6;
	var cell_y = 3;
	var menu_type = 0;      //0�����壬1,����(720*576) 2������(640*576)
	var overFlag = 1;  //0�ֶ����ų��֣���Ҫ�ֶ��رգ�1�Զ��������ϻ����Զ��ر�
	
	var _component ={
		"pos":{  left:"30px", top:"13px"}, 	//30px: Ϊ���ҳԱߵľ��룬13px: �ϡ�����Աߵ�	
		"BG":{	//��Ŀ�ı���ɫ
			backgroundColor:"#000000", 
			opacity:"1", 
			borderWidth:"1px",
			border:"#949699 solid",
			position:"absolute"
			},		
		
		"item":{			//ˮƽ���߸���Ŀ
			position:"absolute",
			textAlign:"center",
			verticalAlign:"middle"
			},
		"font":{		//dialog��������Ϣ
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
		this.table={x:16, y:14};		//һ��ҳ��ȫ���Ļ��ֵĸ�����
		this.cell_width = (this.wh[0]-this.eatBorder[this.menu_type][0])/this.table.x;			//ҳ�滮�ֵ�Ԫ��Ŀ��
		this.cell_height = (this.wh[1]-this.eatBorder[this.menu_type][1])/this.table.y;		//ҳ�滮�ֵ�Ԫ��ĸ߶�
		
		this.container = null;		//dialog����
		this.outDivBorderWidth = 2;		//�����div��������2���ص�border
		this.itemObj = null;		//����Ŀ��div
		
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
					});		//����2D�����������ñ���div�͹���Ƕ�ף�
			
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
			if(args.id == 1){		//�ı�
				this.itemObj.innerHTML = args.content;	
			}else if(args.id == 2){		//ͼƬ
				this.itemObj.style.backgroundImage = "url("+args.content+")";
				this.itemObj.style.backgroundPosition = "center";
				this.itemObj.style.backgroundRepeat="no-repeat";
			}else{		//������
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
		
		/*************����dom��һ�㷽��*********/
		this.createDom = function(tag, container){
			var dom = document.createElement(tag);
			container.appendChild(dom);
			return dom;
		};
		
		/*************��չ����*********/
		this.extend=function(destination, source){ 
			for (var property in source){
				destination[property] = source[property];
			}
			return destination;	
		}
	}
	
	
	//ע��һ�����󣬽�new comfirmComponent() ��ֵ��ע��Ķ���
	registObj = function(){
		var _dialogObj = new dialogComponent(_component);
		_dialogObj.init();
		return _dialogObj;
	};
})()
