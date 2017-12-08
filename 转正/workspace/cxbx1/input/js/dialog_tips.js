// JavaScript Document

(function(){
	var dialog_tip=function(args){
		this.containInfo = args;
		this.divConName = args.divConName || "_divContainer";
		this.textName = args.textName || "_textDiv";
		this.btnName = args.btnName || "_D";
		this.menu_type = args.menu_type;
		this.whArr =  [[1280,720],[720,576],[640,576]],//高清标清屏幕尺寸
		this.btnCount = args.btnCount || 3;
		this.divArr = [];//文本跟选择按钮分为四个区域，此数组保存四个模块的id
		this.width = "";//屏幕宽度，在没有给定弹出框大小的情况下使用
		this.height = "";
		this.data = args.data;
		this.focusArea = 0;
		//this.initData = function(){}
		this.leftDoSelect = function(){}; 
		this.middleDoSelect = function(){}; 
		this.rightDoSelect = function(){}; 
		this.goBack = function(){}
		this.init = function(){
			if(this.menu_type == "" || typeof this.menu_type == "undefined"){
			          var height = 720;
					  var menu_type = 0;
					  if(navigator.appName.indexOf("iPanel") != -1){
						  height = document.body.clientHeight;
					  }
					  if(height == 720){
						 this.menu_type = 0; 
					  }else  if(height == 576){
						 this.menu_type = 1; 
					  }else  if(height == 726){
						 this.menu_type = 2; 
					  }
			}
			this.width = this.whArr[this.menu_type][0];
		    this.height = this.whArr[this.menu_type][1];
			this.createContainer();
			this.addDiv();
			this.initData();
			this.showFocus();
		};
		this.createContainer = function(){
		      var divCon = document.createElement("div");
			  divCon.id = this.divConName; 
			  this.extend(divCon.style, this.containInfo.BG);
			  if(this.containInfo.BG.left == "" || typeof this.containInfo.BG.left == "undefined"){
					divCon.style.left = parseInt(this.width/3*1)+"px";
					divCon.style.top = parseInt(this.height/3*1)+"px";
					divCon.style.width = parseInt(this.width/3*1)+"px";
					divCon.style.height = parseInt(this.height/3*1)+"px";
			  }
			  divCon.style.overflow = "hidden";
			  document.body.appendChild(divCon);
		};
		this.addDiv = function(){
			   var html = "";
			   var con = this.$(this.divConName);
			   var left = parseInt(parseInt(con.style.width)/this.btnCount);
			   var width = parseInt(parseInt(con.style.width)/this.btnCount)
			   var divTop = document.createElement("div");
			   if(this.containInfo.divTop.height == "" || typeof this.containInfo.divTop.height == "undefined"){
			   var top = parseInt(parseInt(con.style.height)/4*3);
			   var height = parseInt(parseInt(con.style.height)/4);
					 divTop.style.height = height*3+"px";
			   }else{
				     var top = parseInt(this.containInfo.divTop.height);
					 var height = parseInt(this.containInfo.BG.height)-parseInt(this.containInfo.divTop.height); 
					 divTop.style.height = this.containInfo.divTop.height;
			   }
			   divTop.style.left = "0px";
			   divTop.style.top = "0px";
			   divTop.style.width = con.style.width;
			   divTop.id = this.textName;
			   this.extend(divTop.style, this.containInfo.divTop);
			   con.appendChild(divTop);
			   for(var i=0; i<this.btnCount; i++){
				    var divText = document.createElement("div");
					divText.id = this.btnName+i;
					divText.style.left = left*i+"px";
					divText.style.top = top +"px";
					divText.style.width = width+"px";
					divText.style.height = height+"px";
					divText.style.lineHeight = height+"px";
					this.extend(divText.style, this.containInfo.divCon);
					con.appendChild(divText);
					this.divArr[this.divArr.length] = divText.id;
			   }
			   for(var i=0; i<this.btnCount-1; i++){//设置选择按钮中间的边框
			         this.$(this.divArr[i]).style.borderRight = this.containInfo.divCon.borderTop;
					 this.$(this.divArr[i+1]).style.borderLeft = this.containInfo.divCon.borderTop;
			   }
		}
/*
*/
		this.initData = function(){
			 $(this.textName).innerHTML = '<table width="100%" height="100%" cellpadding="15"><tr><td  width="100%" style="color:'+this.containInfo.textColor+'";>'+this.data.textArr[1]+'</td></tr></table>';
	 for(var i=0; i<this.btnCount; i++){
		 $(this.divArr[i]).innerHTML = "<b>"+this.data.selectText[i]+"<b>";
     }
			
		}
	    this.showFocus = function(){
			for(var i=0; i<this.btnCount; i++){
			      this.$(this.divArr[i]).style.backgroundColor = this.containInfo.divCon.backgroundColor;
			      this.$(this.divArr[i]).style.color = this.containInfo.divCon.color;
			}
			  
			this.$(this.divArr[this.focusArea]).style.backgroundColor = this.containInfo.focusDiv.backgroundColor;
			this.$(this.divArr[this.focusArea]).style.color = this.containInfo.focusDiv.color;
		}
		this.appear = function(){
			  this.$(this.divConName).style.visibility = "visible";
		};
		this.disAppear = function(){
		       this.$(this.divConName).style.visibility = "hidden";
		};
		this.changeFocus = function(_num){
             this.focusArea += _num;
			 if(this.focusArea <0)this.focusArea=0
			 if(this.focusArea>this.btnCount-1)this.focusArea=this.btnCount-1;
			 this.showFocus();	 
		};
		this.doSelect = function(){
			 if(this.btnCount == 3){
				   if(this.focusArea==0){
					   this.leftDoSelect();
					}else if(this.focusArea==1){
						this.middleDoSelect();
					}else if(this.focusArea==2){
						this.rightDoSelect();
					}
			 }else if( this.btnCount == 2){
		            if(this.focusArea==0){
					   this.leftDoSelect();
					}else if(this.focusArea==1){
						this.rightDoSelect();
					}
			 }
		}
		
		/*************扩展对象*********/
		this.extend = function(destination, source){ 
			for (var property in source){
				destination[property] = source[property];
			}
			return destination;	
		};
		this.$ = function(_id){
		       return document.getElementById(_id);
		}
	}
		
	
	//注册一个对象，将new comfirmComponent() 赋值给注册的对象
	dialog_tips = function(_dialogCss){
		var _conObj = new dialog_tip(_dialogCss);
		return _conObj;
	};
})()
