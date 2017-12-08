// JavaScript Document

(function(){
	var container=function(args){
		this.containInfo = args;
		this.divConName = this.containInfo.divConName || "_varietyPopCon";
		this.textName = this.containInfo.textName || "_varietyPopText";
		this.bottomName = this.containInfo.bottomName || "_varietyPopBottom";
		this.bottomLeftName = this.containInfo.bottomLeftName || "_varietyPopBottomLeft";
		this.bottomRightName = this.containInfo.bottomRightName || "_varietyPopBottomRight";
		this.divConRightTableName = this.containInfo.bottomRightName || "_divConRightTable";
		this.TvDescName = this.containInfo.TvDescName || "_TvDesc";
		this.tdName = this.containInfo.tdName || "_vPopTd";
		this.menu_type = this.containInfo.menu_type;
		this.varietyPopdata = this.containInfo.varietyPopdata;
		this.whArr =  [[1280,720],[720,576],[640,576]],//高清标清屏幕尺寸
		this.rowNum = 6;//显示综艺节目集数的div行数
		this.colNum = 1;//显示综艺节目集数的div列数
		this.pageSize = this.rowNum * this.colNum;
		this.dataLength = 0;//总的综艺节目集数数，最大是this.rowNum*this.colNum = 60
		this.width = "";//屏幕宽度，在没有给定弹出框大小的情况下使用
		this.height = "";
		this.nowVideoid=this.varietyPopdata.nowVideoid?this.varietyPopdata.nowVideoid:0; //kongwm 自己 记录焦点的位置  nowPos=“20150809
		 this.pageFlag=this.varietyPopdata.pageFlag?this.varietyPopdata.pageFlag:0;  //kongwm 记录从哪个页面进来的
		this.lastViewedIdx =  this.varietyPopdata.lastViewedIdx?this.varietyPopdata.lastViewedIdx:0;  //kongwm  看到的最后一集”
		 this.newArr=[]; //kongwm 显示综艺节目集数的数组
		this.newFlagImg = "newFlagImg_";
		this.focusPos=0; 
		this.channelPos =0;
		this.channelFocus = 0;
		this.focusArea = 0;//焦点区域
		this.isType = this.varietyPopdata.isType?this.varietyPopdata.isType:this.varietyPopdata.videoType;
		iDebug("varietyPop.js-----this.isType="+this.isType)
		this.numSelect = function(){}//数字点击确定
		this.otherSelect = function(){}//更多点击确定
		this.showChannelFlag = 1;//是否显示频道名
		this.goBack = function(){}
		
		this.currPage = 0;
		this.totalPage = 0;		
		this.lastValue = 0;
		this.isiPanel = navigator.appName.indexOf("iPanel")==-1?false:true;
		this.onloadData = function(){
			if(typeof this.varietyPopdata.isType!="undefined" && this.varietyPopdata.isType=="vod")	 this.showChannelFlag = 0;
			if(this.showChannelFlag==1){
				var leng = this.varietyPopdata.chanListArr.length;
				iDebug("this.initNumArr===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus+"---leng:"+(this.channelPos+this.channelFocus+leng)%leng);
				this.varietyPopdata.data = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].event_list;
				this.nowVideoid=this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].nowVideoid; //kongwm 自己 记录焦点的位置  nowPos="20150809"
				this.pageFlag=this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].pageFlag;  //kongwm 记录从哪个页面进来的
				this.lastViewedIdx =  this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].lastViewedIdx;  //kongwm  看到的最后一集
				//this.isType = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].isType?this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].isType:this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].videoType;
				this.dataLength = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].event_total;
				this.totalPage = Math.ceil(this.dataLength/(this.pageSize));
			}else{
				this.dataLength = this.varietyPopdata.totalNum;
				this.totalPage = Math.ceil(this.dataLength/(this.pageSize));
			}
		}
		this.init = function(){
			this.onloadData();
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
			this.creatTd();
			if(this.pageFlag&&this.pageFlag==1){
			  	var nowPoss=this.isthisFocus(this.nowVideoid);
			}else{
				var nowPoss=this.isthisFocus(this.lastViewedIdx);
				//var nowPoss=this.isthisFocus(1);
			}
			this.focusPos= nowPoss.pos;//kongwm 执行此函数
			this.currPage = nowPoss.page;
			iDebug("TVPop.js-----init-----this.focusPos="+this.focusPos);
			if(this.focusPos==null||typeof this.focusPos=="undefined"||this.currPage==null||typeof this.currPage=="undefined"){
				this.focusPos=0;
				this.currPage=0;
			}
			this.initPopData();
			
			iDebug("----fun this.showFocus---111:");
			this.showFocus(this.focusPos);
			iDebug("varietyPop.js----------this.focusPos="+this.focusPos);
		};
		//创建弹出框div
		this.createContainer = function(){
		      var divCon = document.createElement("div");
			  divCon.id = this.divConName; 
			  this.extend(divCon.style, this.containInfo.BG);
			  if(this.containInfo.BG.left == "" || typeof this.containInfo.BG.left == "undefined"){
					divCon.style.left = parseInt(this.width/16*4)+"px";
					divCon.style.top = parseInt(this.height/16*3)+"px";
					divCon.style.width = parseInt(this.width/16*7)+"px";
					divCon.style.height = parseInt(this.height/4*2)+"px";
			  }
			  document.body.appendChild(divCon);
		};
		//给现将div分成上下两个div
		this.addDiv = function(){
			   var html = "";
			   var con = this.$(this.divConName);
			   var divTop = document.createElement("div");
			   var width = parseInt(con.style.width);
			   var height = parseInt(con.style.height);
			   divTop.style.left = "0px";
			   divTop.style.top = "0px";
			   divTop.style.width = width + "px";
			   if(this.containInfo.divTop.height == "" || typeof this.containInfo.divTop.height == "undefined"){
				    divTop.style.height = parseInt(height/(this.rowNum+1))+"px";
			   }
			   divTop.id = this.textName;
			   this.extend(divTop.style, this.containInfo.divTop);
			   con.appendChild(divTop);//添加上方内容div
			   var divbottom = document.createElement("div");
			   divbottom.style.left = "0px";
			   divbottom.style.top = divTop.style.height;
			   divbottom.style.width = width + "px";
			   divbottom.style.height = (height - parseInt(divTop.style.height)) + "px";
			   divbottom.id = this.bottomName;
			   this.extend(divbottom.style, this.containInfo.divCon);
			   con.appendChild(divbottom);//添加上方内容div
			   
			   //左下方div创建
			var divbottom = this.$(this.bottomName);
			var divbottomLeft = document.createElement("div");
			divbottomLeft.style.left = "0px";
			divbottomLeft.style.top = "0px";
			divbottomLeft.style.height = (height - parseInt(divTop.style.height)) + "px";
			divbottomLeft.id = this.bottomLeftName;
			this.extend(divbottomLeft.style, this.containInfo.divConLeft);
			divbottom.appendChild(divbottomLeft);//添加左下方内容div  
			
			//右下方div创建
			var divbottom = this.$(this.bottomName);
			var divbottomRight = document.createElement("div");
			divbottomRight.style.left = parseInt(divbottomLeft.style.width) + "px";
			divbottomRight.style.top = "0px";
			divbottomRight.style.height = (height - parseInt(divTop.style.height)) + "px";
			divbottomRight.id = this.bottomRightName;
			this.extend(divbottomRight.style, this.containInfo.divConRight);
			divbottom.appendChild(divbottomRight);//添加左下方内容div 
			
			//右下方内容简介div创建
			var divbottomRight = this.$(this.bottomRightName);
			var divbottomRightDesc = document.createElement("div");
			divbottomRightDesc.style.left = "0px";
			divbottomRightDesc.style.top = "0px";
			divbottomRightDesc.id = this.TvDescName;
			iDebug("TVPop.js-----init-----this.TvDescName="+this.TvDescName);
			this.extend(divbottomRightDesc.style, this.containInfo.divConDesc);
			divbottomRight.appendChild(divbottomRightDesc);//添加左下方内容div 
			
			//右下方表格div创建
			var divbottomRight = this.$(this.bottomRightName);
			var divbottomRightTable = document.createElement("div");
			divbottomRightTable.style.left = "0px";
			divbottomRightTable.style.top = parseInt(this.$(this.TvDescName).style.height) + "px";
			divbottomRightTable.style.width = parseInt(this.$(this.bottomRightName).style.width) + "px";
			divbottomRightTable.style.height  = parseInt(this.$(this.bottomRightName).style.height) - parseInt(this.$(this.TvDescName).style.height) + "px";
			divbottomRightTable.id = this.divConRightTableName;
			this.extend(divbottomRightTable.style, this.containInfo.divConRightTable);
			divbottomRight.appendChild(divbottomRightTable);//添加左下方内容div 
		};
		//给下方div添加table
		this.creatTd = function(){
			var tdHtml = "";
			var rowNum = this.rowNum;
			var colNum = this.colNum;
			var tableWidth = parseInt(this.$(this.divConRightTableName).style.width);
			var tableHeight = parseInt(this.$(this.divConRightTableName).style.height);
			var tdWidth = parseInt(tableWidth/colNum);
			var tdHeight = parseInt(tableHeight/rowNum);
			tdHtml = '<table id="'+this.bottomName+'_td" style="position:absolute; left:0px; top:0px; width:'+tableWidth+'px; hight:'+tableHeight+'px;" cellspacing="0">';
			
			var borderColor = this.containInfo.td.borderColor;
			
			for(var i=0; i<rowNum; i++){//@wangzhib保持弹出框和table背景色一致，不用多次设置背景色影响浏览器性能
				tdHtml += '<tr>';
				for(var j=0; j<colNum; j++){
				   // tdHtml += '<td id="'+this.tdName+(i*colNum+j)+'" width="'+tdWidth+'" height="'+tdHeight+'" align="left" valign="middle"  style="border-left:solid 1px '+borderColor+'; border-top:solid 1px '+borderColor+';font-family:'+this.containInfo.fontFamily+'; font-size:'+this.containInfo.td.sizeS+';"></td>';
				   tdHtml += '<td width="'+tdWidth+'" height="'+tdHeight+'" align="left" valign="middle" style="border-bottom:solid 1px '+borderColor+'; border-left:solid 1px '+borderColor+';font-family:'+this.containInfo.fontFamily+'font-size:'+this.containInfo.td.sizeS+';"><div id="'+this.tdName+(i*colNum+j)+'" style="position:absolute;left:'+tdWidth*(j)+'px;top:'+tdHeight*(i)+'px; width:'+tdWidth+'px;height:'+tdHeight+'px;line-height:'+tdHeight+'px; text-align:left; color:'+this.containInfo.td.tdcolorS+';overflow:hidden; white-space:normal; word-break:break-all;" ></div><div id="'+this.newFlagImg+(i*colNum+j)+'" style="position:absolute;left:'+(tdWidth*(j+1)-14)+'px;top:'+tdHeight*(i)+'px; width:14px;height:14px; color:#fff;font-size:12px;" ></div></td>';
				}
				tdHtml += '</tr>';
			}
			tdHtml += '</table>';
			this.$(this.divConRightTableName).innerHTML = tdHtml;
		}
		//显示综艺节目集数数组的内容
		this.initPopData = function(){
			//this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%"><tr align="left" valign="middle" style="font-size:'+this.containInfo.divTop.fontSize+';color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><td>'+this.varietyPopdata.textArr[0].substring(0,this.getRealLength(this.varietyPopdata.textArr[0],22))+'</td><td align="right" valign="middle" >'+this.varietyPopdata.textArr[1].substring(0,this.getRealLength(this.varietyPopdata.textArr[1],10))+'</td></tr></table>';
			
			iDebug("TVPop_new.js----this.initData====this.TVPopdata.isType:"+ (typeof this.varietyPopdata.isType));
			if(typeof this.varietyPopdata.isType!="undefined" && this.varietyPopdata.isType=="vod")	 this.showChannelFlag = 0;
			if(this.showChannelFlag){
				iDebug("===this.varietyPopdata.chanListArr.length:"+this.varietyPopdata.chanListArr);
				if(this.varietyPopdata.chanListArr.length>1){
					this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'	+this.varietyPopdata.textArr[0].substring(0,this.getRealLength(this.varietyPopdata.textArr[0],20))+'</td>	<td id="arrow_0"  align="center" width="5%" style="visibility:hidden"><</td><td id="channelName_0" width="25%" align="center"></td><td id="channelName_1" width="25%" align="center"></td><td id="arrow_1"  align="center" width="5%" style="visibility:hidden">></td></tr></table>';
				}else{
					this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'	+this.varietyPopdata.textArr[0].substring(0,this.getRealLength(this.varietyPopdata.textArr[0],20))+'</td>	<td id="channelName_0" width="25%" align="center"></td></tr></table>';
				}
				var leng = this.varietyPopdata.chanListArr.length;
				var tmpChannelObj = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
			}else{
				this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'	+this.varietyPopdata.textArr[0].substring(0,this.getRealLength(this.varietyPopdata.textArr[0],20))+'</td>	</tr></table>';
				var tmpChannelObj = this.varietyPopdata;
			}
			this.$(this.TvDescName).innerHTML =  "<div style='position:absolute;left:20px; top:20px; width:310px; height:300px;'>"+(this.varietyPopdata.programeDesc==""?"暂无":(this.varietyPopdata.programeDesc.substring(0,this.getRealLength(this.varietyPopdata.programeDesc,40))+"..."))+"</div>";
			iDebug("TVPop_new.js----this.initData====this.varietyPopdata.programeDesc:"+this.varietyPopdata.programeDesc);
			
			if(tmpChannelObj.posterPic!="")this.$(this.bottomLeftName).innerHTML = '<img src="'+tmpChannelObj.posterPic+'" width="320" height="400"/>';
			else this.$(this.bottomLeftName).innerHTML = '<img src="img/porster.png" width="320" height="400"/>';
			
			iDebug("TVPop_new.js----this.initData====this.varietyPopdata.posterPic:"+this.varietyPopdata.posterPic);
			iDebug("TVPop_new.js----this.initData====this.varietyPopdata.posterPic:"+this.varietyPopdata.posterPic);
			/*this.dataLength = this.varietyPopdata.totalNum;
			this.totalPage = Math.ceil(this.dataLength/(this.pageSize));*/
			
			this.showData();
			if(this.showChannelFlag) this.showChannelName();
		};
		//kongwm 自己加的代码--------begin---//比较焦点的位置
		this.isthisFocus=function(_videoId){
			var num=0;
			var pageNum=0;
		    var arrLen=this.varietyPopdata.totalNum;
			iDebug("varietyPop.js----------this.nowVideoid=_videoId="+_videoId);
			if(_videoId.toString.length==8){
		    	var	tmp= this.toDate(_videoId);
			}else{
				var	tmp=_videoId;
			}
			iDebug("varietyPop.js----------toDate(time)=tmp="+tmp);
			for (var i=0;i<arrLen;){
				iDebug("varietyPop.js-----isthisFocus-----this.varietyPopdata.data[i].name="+ this.varietyPopdata.data[i].name);
				if(this.varietyPopdata.data[i].name==tmp){  
					num=i;
				    iDebug("varietyPop.js-------isthisFocus----num="+num);
                    pageNum=Math.floor(num/(this.pageSize-1));
                    num=num-(this.pageSize-1)*pageNum;
				    iDebug("varietyPop.js-------isthisFocus----num="+num);
					iDebug("varietyPop.js-------isthisFocus----this.currPage="+pageNum);
					return 	{"page":pageNum,"pos":num};
				}else{
					i++;
				}
			}
			return 	{"page":0,"pos":0};
		};
	    this.toDate =function (time){
			var temp = time;
			//var temp=tmp+"";
			var mon = temp.substring(4,6);
			var dat = temp.substring(6,8);
			var str = mon+"-"+dat;
			return str;
	     };
		//kongwm 自己加的代码--------end---//比较焦点的位置
		this.isNewSeries = function(_num){
			iDebug("varietyPop.js-------this.varietyPopdata.data[_num].update_time=="+this.varietyPopdata.data[_num].update_time);
			 if(_num>this.varietyPopdata.data.length-1) return;
			var updateTime = new Date(parseInt(this.varietyPopdata.data[_num].update_time)*1000);
			var nowDateTime = new Date();
			var time = nowDateTime.getTime() - updateTime.getTime();
			time = Math.floor(time/(24*60*60*1000));
			iDebug("varietyPop.js-------this.isNewSeries----nowDateTime="+nowDateTime+"updateTime=="+updateTime+"==_num=="+_num+"=time=="+time);
			if(time<3){
				this.varietyPopdata.data[_num].isNewFlag = true;
				return true;
			}else{
				this.varietyPopdata.data[_num].isNewFlag = false;
				return false;
			}
		}
		this.getNewFlag = function(_pos){
			if(this.isType!="vod") return;
			this.$(this.newFlagImg+_pos).style.backgroundColor = "#098b0a";
			this.$(this.newFlagImg+_pos).innerHTML = "新";
		}
		this.loseNewFlag = function(_pos){
			if(this.isType!="vod") return;
			this.$(this.newFlagImg+_pos).style.backgroundColor = "";
			this.$(this.newFlagImg+_pos).innerHTML = "";
		}
		this.showData = function(){
			for(var i=0; i<this.pageSize; i++){
				//var tmpNum = this.currPage*(this.pageSize-1) + i;
				var tmpNum = this.currPage*this.pageSize + i;
				iDebug("this.showData  i ="+tmpNum);
				if(tmpNum < this.dataLength){
					var isNewSeriesFlag = this.isNewSeries(tmpNum);
					iDebug("===this.varietyPopdata.data[tmpNum].last_viewed_time====="+this.varietyPopdata.data[tmpNum].last_viewed_time+"=isNewSeriesFlag=="+isNewSeriesFlag);
					/*if(i ==  this.pageSize - 1){
						iDebug("this.showData  i:"+i);
						this.$(this.tdName+i).innerHTML = "更多";
						this.$(this.tdName+i).style.color = this.containInfo.td.tdcolor;
						
					 }else{*/
						 var speacial = tmpNum;	//下一面因为有一个更多，所以要减一个
						 var _date = '<span id = "'+this.tdName+i+'_1" style="color:'+this.containInfo.td.tdcolorS+'; font-size:'+this.containInfo.td.sizeS+';padding-top:6px; padding-left:10px;">'+this.varietyPopdata.data[speacial].name+"&nbsp;"+(this.varietyPopdata.data[speacial].program_name.substring(0,this.getRealLength(this.varietyPopdata.data[speacial].program_name,20)))+'</span>';
						 this.$(this.tdName+i).innerHTML = /*_number+*/ _date;
						  if(isNewSeriesFlag&&this.varietyPopdata.data[tmpNum].last_viewed_time==0&&this.isType=="vod"){
							 this.$(this.tdName+i+'_1').style.color = "#098b0a";	
							 this.getNewFlag(i);
						  }else if(this.varietyPopdata.data[tmpNum].last_viewed_time>0&&this.isType=="vod"){
						  	 this.$(this.tdName+i+'_1').style.color = "#ababab";	
							 this.loseNewFlag(i);
						  }else{
							  this.$(this.tdName+i+'_1').style.color = this.containInfo.td.tdcolorS;
							  this.loseNewFlag(i);
						  }
					/* }*/
				}else{
					this.$(this.tdName+i).innerHTML = "&nbsp;"
					this.loseNewFlag(i);
				}
				
			}	
		};
		
		//显示焦点
	    this.showFocus = function(_pos){
			iDebug(this.tdName+_pos);
			var tmpPos = _pos+this.currPage*(this.pageSize);
			 if(_pos == this.rowNum* this.colNum-1){
				 this.$(this.tdName+_pos%this.pageSize).style.color = this.containInfo.focusDiv.color;
			 }else{
			     //this.$(this.tdName+_pos+"_0").style.color = this.containInfo.focusDiv.color;
				 this.$(this.tdName+_pos%this.pageSize+"_1").style.color = this.containInfo.focusDiv.color;
			 }
			this.$(this.tdName+_pos%this.pageSize).style.backgroundColor = this.containInfo.focusDiv.backgroundColor;
			this.showDecText(tmpPos);
			
		};
		//焦点消失
		 this.disFocus = function(_pos){
			var tmpPos = this.currPage*(this.pageSize) + _pos;
		    if(_pos == this.rowNum* this.colNum-1){
				 this.$(this.tdName+_pos%this.pageSize).style.color = this.containInfo.td.tdcolor;
			}else{
			     //this.$(this.tdName+_pos+"_0").style.color = this.containInfo.td.tdcolorB;
				 if(this.varietyPopdata.data[tmpPos].isNewFlag&&this.varietyPopdata.data[tmpPos].last_viewed_time==0&&this.isType=="vod"){
					this.$(this.tdName+_pos%this.pageSize+"_1").style.color = "#098b0a";
					//this.getNewFlag(tmpPos);
				 }else if(this.varietyPopdata.data[tmpPos].last_viewed_time>0&&this.isType=="vod"){
					this.$(this.tdName+_pos%this.pageSize+"_1").style.color = "#ababab";
					//this.loseNewFlag(tmpPos);	
				 }else{
					this.$(this.tdName+_pos%this.pageSize+"_1").style.color = this.containInfo.td.tdcolorS;
					//this.loseNewFlag(tmpPos);
				 }
			}
			this.showDecText(tmpPos);
			//this.$(this.tdName+_pos%this.pageSize).style.backgroundColor = this.containInfo.td.tdBg;
			this.$(this.tdName+_pos%this.pageSize).style.backgroundColor = "";
		};
		this.showDecText = function (tmpPos){
			this.$(this.TvDescName).innerHTML = "<div style='position:absolute;left:20px; top:18px; width:310px; height:300px;'>"+(this.varietyPopdata.data[tmpPos].video_desc==""?(this.varietyPopdata.programeDesc==""?"暂无":(this.varietyPopdata.programeDesc.substring(0,this.getRealLength(this.varietyPopdata.programeDesc,40))+"...")):((this.varietyPopdata.data[tmpPos].video_desc.substring(0,this.getRealLength(this.varietyPopdata.data[tmpPos].video_desc,40))+(this.getLength(this.varietyPopdata.data[tmpPos].video_desc)>40?"...":""))))+"</div>";
		}
		//弹出框显示
		this.appear = function(){
			  this.$(this.divConName).style.visibility = "visible";
		};
		//弹出框消失
		this.disAppear = function(){
			this.$(this.divConName).style.visibility = "hidden";
			$("popBG").style.visibility = "hidden";
		};
		this.left = function(){
			if(this.showChannelFlag&&this.focusArea==1) this.changeFocus(-1);
			else this.changePos(-1);
		};
		this.right = function(){
			if(this.showChannelFlag&&this.focusArea==1) this.changeFocus(1);
			else this.changePos(1);
		};
		this.up = function(){
			this.changePos(-1*this.colNum);
		};
		this.down = function(){
			iDebug("this.down==this.varietyPopdata.data.length:"+this.varietyPopdata.data.length);
			if(this.focusArea==0){
				this.changePos(1*this.colNum);
			}else if(this.showChannelFlag&&this.focusArea==1&&this.varietyPopdata.data.length>0){
				this.focusArea = 0;
				this.selectFocus(this.channelFocus);
				this.showFocus(this.focusPos);
			}
		};
		this.changePos = function(_num){
			var prePos = this.focusPos;
			//alert("actionDataLength="+actionDataLength)
			var lastPageDateLength = this.dataLength%(this.pageSize);
			iDebug("---this.changePos---this.focusPos:"+this.focusPos+"--lastPageDateLength:"+lastPageDateLength+"--_num:"+_num+"--this.currPage:"+this.currPage+"--this.totalPage:"+this.totalPage);
			//if(lastPageDateLength<=this.focusPos+_num&&this.currPage>=(this.totalPage-1)) return;
			if(_num==this.colNum){
				if(this.focusPos == (this.rowNum* this.colNum-1)&&this.currPage<(this.totalPage-1)){
					iDebug("===this.changePos");
					//this.otherSelect();
					this.disFocus(this.focusPos);
					this.currPage ++;
					this.showData();
					this.focusPos = 0;
					this.showFocus(this.focusPos);
					return;
				}
			}
			if(_num==-this.colNum){
				if(this.focusPos==0&&this.currPage > 0){
					this.disFocus(this.focusPos);
					this.currPage --;
					this.showData();
					this.focusPos = this.rowNum;
					this.showFocus(this.focusPos);
				}else if(this.showChannelFlag&&this.focusPos==0&&this.currPage==0){
					iDebug("this.changePos===555=this.channelFocus:"+this.channelFocus);
					this.focusArea = 1;
					this.disFocus(this.focusPos);
					this.onFocus(this.channelFocus);
				}
			}
			
            this.focusPos += _num;
			iDebug("===this.changePos===this.dataLength:"+this.dataLength+"===lastPageDateLength:"+lastPageDateLength+"===this.pageSize:"+this.pageSize);
			if(lastPageDateLength == 0) lastPageDateLength = this.pageSize;
			var actionDataLength = lastPageDateLength+(this.totalPage-1)*this.pageSize;
			var tmp = actionDataLength > (this.currPage+1)*this.pageSize?(this.currPage+1)*this.pageSize:actionDataLength;
			iDebug("===this.changePos===tmp:"+tmp+"===this.focusPos:"+this.focusPos+"===this.currPage:"+this.currPage+"===_num:"+_num+"===this.totalPage:"+this.totalPage);
			if(this.focusPos<0){
			      this.focusPos = prePos;
				  return;
			}
			if(this.currPage*this.pageSize + this.focusPos>=tmp){//向下垂直距离上没有，移动到最后一个位置上
				this.focusPos = (tmp-1)%this.pageSize;
			}			
			
			this.disFocus(prePos);
			this.showFocus(this.focusPos);
		}

		this.doSelect = function(){
			iDebug("[varietyPop_new.js]---doSelect()---this.focusArea="+this.focusArea+",this.showChannelFlag="+this.showChannelFlag);
			/*if(this.focusPos == this.rowNum* this.colNum-1){
				//this.otherSelect();
				this.disFocus(this.focusPos);
				this.currPage ++;
				this.showData();
				this.focusPos = 0;
				this.showFocus(this.focusPos);
			}else */
			if(this.focusArea==0){
				this.goToBackTv();
			}else if(this.showChannelFlag&&this.focusArea==1){//进入直播频道
				return;
				var isPlayPageFlag = false;
				if(typeof gotoPortal!= "undefined"){//abc窗口，播放页面不会刷新
					if(iPanel.mainFrame.location.href.indexOf("play.php") > -1){//在播放页面,手动刷新下页面
						isPlayPageFlag = true;
					}
				}
				iDebug("[varietyPop_new.js]---doSelect()---this.channelPos="+this.channelPos+",this.channelFocus="+this.channelFocus);
				var chanId = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus)%this.varietyPopdata.chanListArr.length].chanl_id;
				iDebug("[varietyPop_new.js]---doSelect()---isPlayPageFlag="+isPlayPageFlag+",chanId="+chanId);
				iPanel.eventFrame.openPage(playAddress,{type:"play",isMode:"channelId",channelId:chanId});	
				if(isPlayPageFlag){//手动刷新页面onshow
					iPanel.mainFrame.onHide();
					iPanel.mainFrame.onShow();
				}
				var popWidget = iPanel.pageWidgets.getByName("popWidget");
				if(popWidget) popWidget.close();
				/*this.varietyPopdata.data = [];
				 this.newArr=[];
				this.focusPos = 0;
				this.varietyPopdata.data = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus)%this.varietyPopdata.chanListArr.length].list;
			    iDebug("varietyPop.js-----doSelect-----this.channelPos="+(this.channelPos+this.channelFocus)%this.varietyPopdata.chanListArr.length);
				if(this.pageFlag&&this.pageFlag==1){
					var nowPoss=this.isthisFocus();
					this.focusPos= nowPoss.pos;//kongwm 自己  执行此函数
					this.currPage = nowPoss.page;
					iDebug("varietyPop.js---if--doSelect-----this.focusPos="+this.focusPos);
					if(this.focusPos==null&&typeof this.focusPos=="undefined"&&this.currPage==null&&typeof this.currPage=="undefined")
					{
						this.focusPos=0;
						this.currPage=0;
					}
				   this.initPopData();
				  this.showFocus(this.focusPos);
				   //this.showFocus(this.focusPos);
				   iDebug("varietyPop.js--if22---doSelect-----this.focusPos="+this.focusPos);
				}else{
				   this.initPopData();
				   this.showFocus(this.focusPos);
				   iDebug("varietyPop.js--else---doSelect-----this.focusPos="+this.focusPos);
				}*/
			}
			
		};
		
		this.doBack = function(eventObj){
			var flag = returnFalseFlag;
			if(this.currPage > 0){
				this.disFocus(this.focusPos);
				this.currPage --;
				this.showData();
				this.focusPos = 0;
				this.showFocus(this.focusPos);
			}else{
				this.disAppear();
				var type = isAdvanceFlag?0:2;
				if(typeof top.window.hidePop == "function"){
					top.window.hidePop();
					if(navigator.appName.indexOf("iPanel") != -1) iPanel.sendSimulateEvent(type,9666,4);
				}else{
					if(eventObj.code == "KEY_HOMEPAGE") flag = returnTrueFlag;
					window.close();
					iPanel.sendSimulateEvent(type,9666,4);
				}
			}
			return flag;
		};
		this.showChannelName = function(){
			var leng=this.varietyPopdata.chanListArr.length;
			if(leng>2){
				$("arrow_0").style.visibility = "visible";
				$("arrow_1").style.visibility = "visible";
			}else if(leng>1){
				$("arrow_0").style.visibility = "hidden";
				$("arrow_1").style.visibility = "hidden";
			}
			var maxNum = leng>1?2:leng;
			for(var j = 0; j < maxNum; j++){
			var leng=this.varietyPopdata.chanListArr.length;
			iDebug("this.showChannelName===this.channelPos:"+this.channelPos);
			var tmpChannelObj = this.varietyPopdata.chanListArr[(this.channelPos+j)%leng];
				$("channelName_"+j).innerHTML = tmpChannelObj.chnl_name.substring(0,this.getRealLength(tmpChannelObj.chnl_name,12))
			}
			
			this.selectFocus(this.channelFocus)
		}
		this.changeFocus = function(_num){
			iDebug("this.changeFocus===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus);
                this.loseFocus(this.channelFocus);
			if(this.channelFocus == 1 && _num==1||this.channelFocus == 0 && _num == -1){
				var leng = this.varietyPopdata.chanListArr.length;
				if(leng<=2){
					this.onFocus(this.channelFocus);return;
				}
				this.channelPos=(this.channelPos +_num+leng)%leng;
				this.showChannelName();
				/*var tmpChannelObj = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
				this.getSeriesList(tmpChannelObj.series_name,tmpChannelObj.chanl_id,tmpChannelObj.idx_type);*/
				this.changeChanelEpg();
            }else{
				var leng = this.varietyPopdata.chanListArr.length;
				if(leng<=1){
					this.onFocus(this.channelFocus);return;
				}
			iDebug("this.changeFocus===leng:"+leng+"==this.channelFocus:"+this.channelFocus);
				
				this.channelFocus += _num;
				if(this.channelFocus>=1){
					this.channelFocus = 1;
				}else if(this.channelFocus<0){
					this.channelFocus = 0;
				}
				iDebug("this.changeFocus===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus);
				this.changeChanelEpg();
				/*var leng = this.varietyPopdata.chanListArr.length;
				var tmpChannelObj = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
				this.getSeriesList(tmpChannelObj.series_name,tmpChannelObj.chanl_id,tmpChannelObj.idx_type);*/
            }
		}
		this.onFocus = function(_pos){
			$("channelName_"+_pos).style.backgroundColor = this.containInfo.focusDiv.backgroundColor;
			$("channelName_"+_pos).style.color = this.containInfo.focusDiv.color;
		}
		this.loseFocus = function(_pos){
			$("channelName_"+_pos).style.backgroundColor  = this.containInfo.td.titleBg;
			$("channelName_"+_pos).style.color = this.containInfo.td.titleColor;
		}
		
		this.selectFocus = function(_pos){
			this.$("channelName_"+_pos).style.backgroundColor  = this.containInfo.td.titleSelBg;
			this.$("channelName_"+_pos).style.color = this.containInfo.td.titleSelColor;
		}
		this.changeChanelEpg = function(){
			this.onloadData();
			this.initPopData();
			this.onFocus(this.channelFocus);
		}
		
		this.getSeriesList = function(_name,_chanId,_idxType){
			if(navigator.appName.indexOf("iPanel") != -1){
				if(iPanel.mainFrame.location.href.indexOf("tvodDetail.php") > -1 || iPanel.mainFrame.location.href.indexOf("play.php") > -1){
					iPanel.mainFrame.getSeriesListByDate(_name,_chanId,_idxType);	
				}else if(iPanel.mainFrame.location.href.indexOf("index.php") > -1){
					top.window.frames["ifr_1"].getSeriesListByDate(_name,_chanId,_idxType);
				}
			}else{
				if(top.window.location.href.indexOf("tvodDetail.php") > -1){
					top.getSeriesListByDate(_name,_chanId,_idxType);	
				}else{
					top.window.frames["ifr_1"].getSeriesListByDate(_name,_chanId,_idxType);
				}	
			}
		}
		this.initData = function(_obj){
			return;
			iDebug("TVPop_new.js---initData===_obj:"+JSON.stringify(_obj));
			
			var leng = this.varietyPopdata.chanListArr.length;
			iDebug("this.initNumArr===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus+"---leng:"+(this.channelPos+this.channelFocus+leng)%leng);
			this.varietyPopdata.data = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].event_list;
			this.initPopData();
			this.onFocus(this.channelFocus);
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
		};
		
		this.getSTRDate = function(time){
			var date = new Date(Number(time)*1000);
			var hours = date.getHours();  //当前小时
			var minutes = date.getMinutes(); //当前分钟
			var seconds = date.getSeconds(); //秒
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var date = date.getDate();
			var str =year+""+(month<=9?"0"+month:month)+""+(date<=9?"0"+date:date)+""+(hours<=9?"0"+hours:hours)+""+(minutes<=9?"0"+minutes:minutes)+""+(seconds<=9?"0"+seconds:seconds);
			return str;
		};
		
		this.getRealLength = function(_str,_len){
			if(_str.length <= _len/2) return _str.length;
			var num = 0;
			//var re = /^[\u4e00-\u9fa5]*$/;
			for(var i=0;i<_str.length;i++){
				if(_str.charCodeAt(i)>255 || (_str.charCodeAt(i)>=65 && _str.charCodeAt(i)<=90)) num+=2;//>255认为是汉字和大写字母
				else num++
				if(num>=_len) return i+1;//超过的时候，只截取前面的部分。
			}
			return _str.length;
		};
		this.getLength = function(_str){
			var num = 0;
			//var re = /^[\u4e00-\u9fa5]*$/;
			for(var i=0;i<_str.length;i++){
				if(_str.charCodeAt(i)>255 || (_str.charCodeAt(i)>=65 && _str.charCodeAt(i)<=90)) num+=2;//>255认为是汉字和大写字母
				else num++;
			}
			return num;
		};
		
		this.goToBackTv = function(){
			var tmpNum = this.currPage*(this.pageSize) + this.focusPos;
			//if(this.currPage>0){
				//tmpNum = this.currPage*this.pageSize + this.focusPos-1;//@pengjiao 2014.12.31 回看节目，选集列表中的选集日期和真实的播放日期不符,显示的日期拿的是后一集的url

			//}
			var backTvObj = this.varietyPopdata.data[tmpNum];
			var sd = typeof(backTvObj.url)!="undefined"?backTvObj.url:this.varietyPopdata.url;
			var name = this.varietyPopdata.textArr[0];
			var idxtype = "";
			if(this.showChannelFlag==1){
				var leng = this.varietyPopdata.chanListArr.length;
				idxtype = this.varietyPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].idx_type;
			}
			var programId = backTvObj.program_id;
            var url = sd;//+"?tsstarttime="+tsstarttime+"&tsendtime="+tsendtime;
			iDebug("-varietyPop.js---programId:"+programId);
			iDebug("-varietyPop.js---programId:"+programId);
      if(this.isiPanel){
				top.window.location.href = "play/play.php?playurl="+url+"||name="+name;	
			}else{
				iDebug("-----wangwei1-------in--openPage");
				// kongwm 自己加的代码--------------begin-------------//
				var __params = {
					//type:"backTV",
					// type:"backTV",
					videoId:this.varietyPopdata.id,
					// idxtype:idxtype,
					// playUrl:url,
					// chanId:this.varietyPopdata.channelId,
					// programId:programId,
					backUrl:(this.varietyPopdata.backUrl?this.varietyPopdata.backUrl:iPanel.eventFrame.webUiUrl)+"?pageShow=ifr_1"
				}
				if(typeof this.varietyPopdata.isType!="undefined" && this.varietyPopdata.isType=="vod"){
					__params = {
						//type:"backTV",
						// type:"vod",//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的)
						videoId:this.varietyPopdata.id,
						// playUrl:url,
						// chanId:this.varietyPopdata.channelId,
						// vodid:programId,
						// seriesId:this.varietyPopdata.seriesId?this.varietyPopdata.seriesId:0,
						backUrl:(this.varietyPopdata.backUrl?this.varietyPopdata.backUrl:iPanel.eventFrame.webUiUrl)+"?pageShow=ifr_1"
					}
				}
				var isPlayPageFlag = false;
				if(typeof gotoPortal!= "undefined"){//abc窗口，播放页面不会刷新
					if(iPanel.mainFrame.location.href.indexOf("play.php") > -1){//在播放页面,手动刷新下页面
						isPlayPageFlag = true;
					}
				}
				iPanel.eventFrame.openPage(
					playAddress,__params
				);
				if(isPlayPageFlag){//手动刷新页面onshow
					iPanel.mainFrame.onHide();
					iPanel.mainFrame.onShow();
				}
				// kongwm 自己加的代码--------------end-------------//
				var popWidget = iPanel.pageWidgets.getByName("popWidget");
				if(popWidget) popWidget.close();
			}
		};

	}
		
	
	//注册一个对象，将new comfirmComponent() 赋值给注册的对象
	creatVarietyPop = function(_varietyPopCss){
		var _conObj = new container(_varietyPopCss);
		return _conObj;
	};
})()
