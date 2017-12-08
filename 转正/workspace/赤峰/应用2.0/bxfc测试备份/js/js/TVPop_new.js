// JavaScript Document

(function(){
	iDebug("yanch goToBackTv playAddress="+playAddress)
	//var playAddress="http://192.168.19.17/GS/HOMED/33/application/newPlay/play.php"
	//var playAddress="http://web.eis/newapp/yanch/education_homed/newPlay/play.php"
	var container=function(args){
		this.containInfo = args;
		this.divConName = this.containInfo.divConName || "_TVPopCon";
		this.textName = this.containInfo.textName || "_TVPopText";
		this.bottomName = this.containInfo.bottomName || "_TVPopBottom";
		this.bottomLeftName = this.containInfo.bottomLeftName || "_TVPopBottomLeft";
		this.bottomRightName = this.containInfo.bottomRightName || "_TVPopBottomRight";
		this.divConRightTableName = this.containInfo.bottomRightName || "_divConRightTable";
		this.TvDescName = this.containInfo.TvDescName || "_TvDesc";
		this.tdName = this.containInfo.tdName || "_popTd";
		this.menu_type = this.containInfo.menu_type;
		this.TVPopdata = this.containInfo.TVPopdata;
		this.whArr =  [[1280,720],[720,576],[640,576]],//高清标清屏幕尺寸
		this.rowNum = 6;//显示电视剧集的div行数
		this.colNum = 6;//显示电视剧集的div列数
		this.pageSize = this.rowNum * this.colNum;
		this.dataArr = {//电视剧集内容数组
			             totalNum:10,//总共电视剧集
		                obj:[],//每集电视的ID
						flag:[]};//有内容的集数
		this.dataLength = 0;//总的电视剧集数，最大是this.rowNum*this.colNum = 60
		this.width = "";//屏幕宽度，在没有给定弹出框大小的情况下使用
		this.height = "";
		this.pageFlag = this.TVPopdata.pageFlag;  //kongwm 记录从哪个页面进来的
		this.nowVideoid = this.TVPopdata.nowVideoid; //kongwm 记录焦点的位置 
		this.lastViewedIdx =  this.TVPopdata.lastViewedIdx;  //kongwm  看到的最后一集
		this.newFlagImg = "newFlagImg_";
		this.focusPos =0;
		this.focusArea = 0; 
		this.channelPos =0;
		this.channelFocus = 0;
		this.numSelect = function(){}//数字点击确定
		this.otherSelect = function(){}//更多点击确定
		this.showChannelFlag = 1;//是否显示频道名
		this.isType = this.TVPopdata.isType?this.TVPopdata.isType:this.TVPopdata.videoType;
		iDebug("varietyPop.js-----this.isType="+this.isType)
		this.currPage = 0;
		this.totalPage = 0;	
		this.firstValue = 0;	
		this.lastValue = 0;
		this.isiPanel = navigator.appName.indexOf("iPanel")==-1?false:true;
		
		this.init = function(){
			iDebug("yanch init playAddress="+playAddress)
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
			this.initNumArr();
			iDebug("this.TVPopdata.data.length:"+this.TVPopdata.data.length);
			iDebug(this.TVPopdata.data)
			this.createContainer();
			this.addDiv();
			this.creatTd();
			iDebug("TVPop.js-----init-----this.lastViewedIdx="+this.lastViewedIdx+"===this.nowVideoid==="+this.nowVideoid);
			if(this.pageFlag&&this.pageFlag==1){
				var nowPoss=this.isthisFocus(this.nowVideoid);
			}else{
				var nowPoss=this.isthisFocus(this.lastViewedIdx);
			}
		 	this.focusPos= nowPoss.pos;//kongwm 自己  执行此函数
			this.currPage = nowPoss.page;
			if(this.focusPos==null||typeof this.focusPos=="undefined"||this.currPage==null||typeof this.currPage=="undefined"){
				this.focusPos=0;
				this.currPage=0;
			}
			iDebug("TVPop.js-----init-----this.focusPos="+this.focusPos);
			this.initPopData();
			this.showFocus(this.focusPos);
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
			iDebug("TVPop.js-----creatTd-----tableWidth="+tableWidth);
			var tableHeight = parseInt(this.$(this.divConRightTableName).style.height);
			var tdWidth = parseInt(tableWidth/colNum);
			var tdHeight = parseInt(tableHeight/rowNum);
			iDebug("TVPop.js-----creatTd-----tdHeight="+tdHeight);
			tdHtml = '<table id="'+this.bottomRightName+'_td" style="position:absolute;  left:0px; top:0px; width:'+tableWidth+'px; height:'+tableHeight+'px; font-size:'+this.containInfo.divCon.fontSize+';color:'+this.containInfo.divCon.color+';" cellspacing="0" cellpadding="0">';
			var borderColor = this.containInfo.td.borderColor;
			for(var i=0; i<rowNum; i++){//@wangzhib保持弹出框和table背景色一致，不用多次设置背景色影响浏览器性能
				tdHtml += '<tr>';
				for(var j=0; j<colNum; j++){
				 // tdHtml += '<td id="'+this.tdName+(i*colNum+j)+'" width="'+tdWidth+'" height="'+tdHeight+'" align="center" valign="middle" bgcolor="'+this.containInfo.td.tdBg+'" style="border-left:solid 1px '+borderColor+'; border-top:solid 1px '+borderColor+';font-family:'+this.containInfo.fontFamily+'font-size:'+this.containInfo.divCon.fontSize+';color:'+this.containInfo.divCon.color+';"></td>';
					  tdHtml += '<td width="'+tdWidth+'" height="'+(tdHeight-1)+'" align="center" valign="middle" style="border-left:solid 1px '+borderColor+'; border-top:solid 1px '+borderColor+';font-family:'+this.containInfo.fontFamily+'font-size:'+this.containInfo.divCon.fontSize+';"><div id="'+this.tdName+(i*colNum+j)+'" style="position:absolute;left:'+tdWidth*(j)+'px;top:'+(tdHeight*(i))+'px; width:'+(tdWidth-1)+'px;height:'+tdHeight+'px;line-height:'+(tdHeight-1)+'px; text-align:center; color:'+this.containInfo.divCon.color+';" ></div><div id="'+this.newFlagImg+(i*colNum+j)+'" style="position:absolute;left:'+(tdWidth*(j+1)-14)+'px;top:'+tdHeight*(i)+'px; width:14px;height:14px; color:#fff;font-size:12px;" ></div></td>';
				}//kongwm
				tdHtml += '</tr>';
			}
			tdHtml += '</table>';
			this.$(this.divConRightTableName).innerHTML = tdHtml;
		}
		//kongwm 自己加的代码--------begin---//比较焦点的位置
		this.isthisFocus = function(_videoId){	
            var pageNum=0;
            var num=0;
			var tmp= parseInt(_videoId);
            var arrLen=this.dataArr.totalNum;
            for (var i=0;i<arrLen;){
				iDebug("TVPop.js---isthisFocus-------this.dataArr.obj[i].name="+this.dataArr.obj[i].name);
				if(this.dataArr.obj[i].name==tmp){  
				    num=i;
				    iDebug("TVPop.js-------isthisFocus----num="+num);
					if((this.dataArr.totalNum-1)%(this.pageSize-1)==0){
						 var totalPage=Math.ceil(this.dataArr.totalNum/(this.pageSize-1));
						 if(num>=(this.pageSize-1)*(totalPage-1)) {
						   pageNum=totalPage-1;
						   num=num-(this.pageSize-1)*pageNum;
						 }else{
							pageNum=Math.floor(num/(this.pageSize-1));
							num=num-(this.pageSize-1)*pageNum;
						 }
					 }else{
						  pageNum=Math.floor(num/(this.pageSize-1));
						  num=num-(this.pageSize-1)*pageNum;
					 }
				     iDebug("TVPop.js-------isthisFocus----num="+num);
				     iDebug("TVPop.js-------isthisFocus----this.currPage="+pageNum);
				     return 	{"page":pageNum,"pos":num};
				}else{
					i++;
				}
		   }
		   return  {"page":0,"pos":0};
	   }
		//kongwm 自己加的代码--------end---//比较焦点的位置
		this.isNewSeries = function(_num){
			//iDebug("TVPop.js-------this.isNewSeries----_num="+_num+"this.dataArr.obj[_num].update_time=="+this.dataArr.obj[_num].update_time);
			var updateTime = new Date(parseInt(this.dataArr.obj[_num].update_time)*1000);
			var nowDateTime = new Date();
			var time = nowDateTime.getTime() - updateTime.getTime();
			time = Math.floor(time/(24*60*60*1000));
			iDebug("TVPop.js-------this.isNewSeries----nowDateTime="+nowDateTime+"updateTime=="+updateTime+"==_num=="+_num+"=time=="+time);
			if(time<3&&this.dataArr.flag[_num]==1){
				this.dataArr.obj[_num].isNewFlag = true;
				this.TVPopdata.data[_num].isNewFlag = true;
				return true;
			}else{
				this.dataArr.obj[_num].isNewFlag = false;
				this.TVPopdata.data[_num].isNewFlag = false;
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
		
		//判断是否在数组中
		this.json_inArray = function(_num){
			var len = this.TVPopdata.data.length;
			for(var i=0;i<len;i++){
				if(this.TVPopdata.data[i].num==_num){
					return this.TVPopdata.data[i];	
				}
			}	
			return 0;
		}
		//初始化电视剧集数组的内容
		this.initNumArr = function(){
			//this.TVPopdata.data = this.TVPopdata.data.concat(this.TVPopdata.data,this.TVPopdata.data,this.TVPopdata.data,this.TVPopdata.data,this.TVPopdata.data,this.TVPopdata.data).slice(0,120);
			if(typeof this.TVPopdata.isType!="undefined" && this.TVPopdata.isType=="vod")	 this.showChannelFlag = 0;
			if(this.showChannelFlag==1){
				this.focusPos =0;
				var leng = this.TVPopdata.chanListArr.length;
				iDebug("this.initNumArr===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus+"---leng:"+(this.channelPos+this.channelFocus+leng)%leng);
				this.TVPopdata.data = this.TVPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].event_list;
			}
			iDebug("search.js---getSeriesListByDate===this.TVPopdata.data:"+JSON.stringify(this.TVPopdata.data));
			var tmpdata = [];
			for(var i=0;i<this.TVPopdata.data.length;i++){  //去除没有集数的数据
				if(typeof this.TVPopdata.data[i].num != "undefined"){
					tmpdata.push(this.TVPopdata.data[i]); 
				}	
			}
			
			//tmpdata.sort(this.by('num'));  //根据集数从小到大排序
			this.TVPopdata.data = tmpdata.slice(0);
			this.firstValue = Number(tmpdata[0].num);
			this.lastValue = Number(tmpdata[tmpdata.length-1].num);
			this.dataArr.totalNum = this.lastValue - this.firstValue+1;
			tmpdata = [];
			iDebug("search.js---getSeriesListByDate===this.firstValue:"+this.firstValue+",this.lastValue:"+this.lastValue);
			for(var i=this.firstValue,k=0;i<=this.lastValue;i++,k++){
				var tdata = this.json_inArray(i);
				if(tdata!=0){
					tmpdata.push(tdata);
					this.dataArr.flag[k] = 1;
				}else{
					tmpdata.push({"name":i});	
					this.dataArr.flag[k] = 0;
				}
				
			}
			this.dataArr.obj = tmpdata.slice(0);
			iDebug("search.js---getSeriesListByDate===this.dataArr.obj:"+JSON.stringify(this.dataArr.obj));
			this.TVPopdata.data = tmpdata.slice(0);
			iDebug("search.js---getSeriesListByDate===this.TVPopdata.data:"+JSON.stringify(this.TVPopdata.data));
			this.totalPage =Math.ceil(this.dataArr.totalNum/(this.pageSize-1));
		}
		//显示电视剧集数组的内容
		this.initPopData = function(){
			/*this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="10" width="100%" height="100%"><tr align="left" valign="middle" style="font-size:'
				+this.containInfo.divTop.fontSize+';color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><td>'
				+this.TVPopdata.textArr[0].substring(0,this.getRealLength(this.TVPopdata.textArr[0],22))+'</td><td align="right" valign="middle" >'
				+this.TVPopdata.textArr[1].substring(0,this.getRealLength(this.TVPopdata.textArr[1],10))+'</td></tr></table>';*/
			iDebug("TVPop_new.js----this.initPopData====this.TVPopdata.isType:"+this.TVPopdata.isType);
			if(typeof this.TVPopdata.isType!="undefined" && this.TVPopdata.isType=="vod")	 this.showChannelFlag = 0;
			if(this.showChannelFlag){
				if(this.TVPopdata.chanListArr.length>1){
				
					this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'+this.TVPopdata.textArr[0].substring(0,this.getRealLength(this.TVPopdata.textArr[0],22))+'</td><td id="arrow_0"  align="center" width="5%" style="visibility:hidden"><</td><td id="channelName_0" width="25%" align="center"></td><td id="channelName_1" width="25%" align="center"></td><td id="arrow_1"  align="center" width="5%" style="visibility:hidden">></td></tr></table>';
				}else{
					this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'+this.TVPopdata.textArr[0].substring(0,this.getRealLength(this.TVPopdata.textArr[0],22))+'</td><td id="channelName_0" width="25%" align="center"></td></tr></table>';
				}
				
				var leng = this.TVPopdata.chanListArr.length;
				var tmpChannelObj = this.TVPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
			}else{
				this.$(this.textName).innerHTML = '<table id="'+this.textName+1+'" cellpadding="0" width="100%" height="100%" style="padding-left:10px;font-size:24px;color:'+this.containInfo.divTop.color+'; font-family:'+this.containInfo.fontFamily+';"><tr height="60"><td id="currPrograme" style="font-size:'+this.containInfo.divTop.fontSize+';">'+this.TVPopdata.textArr[0].substring(0,this.getRealLength(this.TVPopdata.textArr[0],22))+'</td></tr></table>';
				var tmpChannelObj = this.TVPopdata;
			}
				iDebug("TVPop_new.js----this.initPopData====this.TVPopdata.programeDesc:"+this.TVPopdata.programeDesc);
			this.$(this.TvDescName).innerHTML =  "<div style='position:absolute;left:20px; top:18px; width:310px; height:300px;'>"+(this.TVPopdata.programeDesc==""?"暂无":(this.TVPopdata.programeDesc.substring(0,this.getRealLength(this.TVPopdata.programeDesc,36))+"..."))+"</div>";
		
			
			if(tmpChannelObj.posterPic!="") this.$(this.bottomLeftName).innerHTML = '<img src="'+tmpChannelObj.posterPic+'" width="320" height="400"/>';
			else this.$(this.bottomLeftName).innerHTML = '<img src="img/porster.png" width="320" height="400"/>';
			iDebug("TVPop_new.js----this.initPopData====this.TVPopdata.posterPic:"+this.TVPopdata.posterPic);
			iDebug("TVPop_new.js----this.initPopData====this.$(this.bottomLeftName).innerHTML:"+this.$(this.bottomLeftName).innerHTML);
			this.dataLength = this.dataArr.totalNum;
			var flag = false;
			for(var i=0;i<this.pageSize;i++){
				var tmpNum = this.currPage*(this.pageSize-1) + i;
				if(tmpNum<this.dataArr.totalNum){
					var isNewSeriesFlag = this.isNewSeries(tmpNum);
					iDebug("===this.dataArr.obj[tmpNum].last_viewed_time====="+this.dataArr.obj[tmpNum].last_viewed_time+"=isNewSeriesFlag=="+isNewSeriesFlag+"this.dataArr.flag[tmpNum]="+this.dataArr.flag[tmpNum]);
					if(this.dataArr.totalNum-this.currPage*(this.pageSize-1)==this.pageSize){ //最后完整一页
						this.$(this.tdName+i).innerHTML = this.dataArr.obj[tmpNum].name;	
						if(this.dataArr.obj[tmpNum].name.toString().length>=4){//kongwm
							this.$(this.tdName+i).style.fontSize = "20px";
						}
						if(this.dataArr.flag[tmpNum]==1){
							if(isNewSeriesFlag&&this.dataArr.obj[tmpNum].last_viewed_time==0&&this.isType=="vod"){
								this.$(this.tdName+i).style.color = "#098b0a";	
								this.getNewFlag(i);
							}else if(this.dataArr.obj[tmpNum].last_viewed_time >0&&this.isType=="vod"){
								this.$(this.tdName+i).style.color ="#ababab";	
								this.loseNewFlag(i);
							}else{
								this.$(this.tdName+i).style.color = this.containInfo.td.tdcolor;
								this.loseNewFlag(i);
							}
						}else{
							this.$(this.tdName+i).style.color = this.containInfo.divCon.color;
							this.loseNewFlag(i);
						}
					}else{
						if(i==this.pageSize-1 && this.currPage<this.totalPage-1){  //一屏幕最后一个为更多
							this.$(this.tdName+i).style.lineHeight = "50px";
							this.$(this.tdName+i).innerHTML = '<img src="img/more.png" style="position:relative;top:20px;" width="10" height="10"/>';	
							this.$(this.tdName+i).style.color = this.containInfo.td.tdcolor1; 
							this.loseNewFlag(i);
						}else{
							iDebug("----this.dataArr.obj[tmpNum].name.length-----"+this.dataArr.obj[tmpNum].name.length);
							this.$(this.tdName+i).innerHTML = this.dataArr.obj[tmpNum].name;	
							if(this.dataArr.obj[tmpNum].name.toString().length>=4){//kongwm
								this.$(this.tdName+i).style.fontSize = "20px";
							}
							if(this.dataArr.flag[tmpNum]==1){
								if(isNewSeriesFlag&&this.dataArr.obj[tmpNum].last_viewed_time==0&&this.isType=="vod"){
									this.$(this.tdName+i).style.color = "#098b0a";	
									this.getNewFlag(i);
								}else if(this.dataArr.obj[tmpNum].last_viewed_time >0&&this.isType=="vod"){
									this.$(this.tdName+i).style.color = "#ababab";	
									this.loseNewFlag(i);
								}else{
									this.$(this.tdName+i).style.color = this.containInfo.td.tdcolor;
									this.loseNewFlag(i);
								}
							}else{
								this.$(this.tdName+i).style.color = this.containInfo.divCon.color;
								this.loseNewFlag(i);
							}
							iDebug("this.$(this.tdName+"+i+").style.color:"+this.$(this.tdName+i).style.color);
						}
					}
				}else{
					this.$(this.tdName+i).innerHTML = "";	
					this.loseNewFlag(i);
				}
			}	
			if(this.showChannelFlag) this.showChannelName();
		}
		//显示焦点
	    this.showFocus = function(_pos){
			iDebug(this.tdName+_pos);
			var tmpPos = _pos+this.currPage*(this.pageSize-1);
			iDebug(this.tdName+_pos+"==showFocus==tmpPos==="+tmpPos);
			if(_pos == this.rowNum* this.colNum-1){//"更多两字的焦点颜色"
				this.$(this.TvDescName).innerHTML =  "<div style='position:absolute;left:20px; top:18px; width:310px; height:300px;'>"+((typeof this.TVPopdata.programeDesc=="undefined"||this.TVPopdata.programeDesc=="")?"暂无":(this.TVPopdata.programeDesc.substring(0,this.getRealLength(this.TVPopdata.programeDesc,36))+"..."))+"</div>";
				iDebug("TVPop_new.js----this.initPopData====this.TVPopdata.programeDesc:"+this.TVPopdata.programeDesc);
				this.$(this.tdName+_pos).style.color = this.containInfo.focusDiv.color;
			}else{
				this.$(this.tdName+_pos).style.color = this.containInfo.focusDiv.color;
				this.$(this.TvDescName).innerHTML ="<div style='position:absolute;left:20px; top:18px; width:310px; height:300px;'>"+((typeof this.dataArr.obj[tmpPos].video_desc=="undefined"||this.dataArr.obj[tmpPos].video_desc=="")?((typeof this.TVPopdata.programeDesc=="undefined"||this.TVPopdata.programeDesc=="")?"暂无":(this.TVPopdata.programeDesc.substring(0,this.getRealLength(this.TVPopdata.programeDesc,36))+"...")):((this.dataArr.obj[tmpPos].video_desc.substring(0,this.getRealLength(this.dataArr.obj[tmpPos].video_desc,36))+(this.getLength(this.dataArr.obj[tmpPos].video_desc)>36?"...":""))))+"</div>";
			}
			this.$(this.tdName+_pos).style.backgroundColor = this.containInfo.focusDiv.backgroundColor;
		};
		//焦点消失
		 this.disFocus = function(_pos){
			var tmpPos = _pos+this.currPage*(this.pageSize-1);
			iDebug(this.tdName+_pos+"=_pos=="+_pos+"==disFocus==tmpPos==="+tmpPos);
		    if(_pos == this.rowNum* this.colNum-1){
				 this.$(this.tdName+_pos).style.color = this.containInfo.td.tdcolor1;
			}else{
				if(this.dataArr.obj[tmpPos].isNewFlag&&this.dataArr.obj[tmpPos].last_viewed_time==0&&this.isType=="vod"){
					this.$(this.tdName+_pos).style.color = "#098b0a";
					//this.getNewFlag(tmpPos);
				}else if(this.dataArr.obj[tmpPos].last_viewed_time >0&&this.isType=="vod"){
					this.$(this.tdName+_pos).style.color = "#ababab";	
					//this.loseNewFlag(tmpPos);
				}else{
					this.$(this.tdName+_pos).style.color = this.containInfo.td.tdcolor;
					//this.loseNewFlag(tmpPos);
				}
			}
			//this.$(this.tdName+_pos).style.backgroundColor = this.containInfo.td.tdBg;
			this.$(this.tdName+_pos).style.backgroundColor = "";
			//this.$(this.TvDescName).innerHTML =  "";
		};
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
			if(this.focusArea==0)this.changePos(-1,0);
			else if(this.showChannelFlag&&this.focusArea==1) this.changeFocus(-1);
		};
		this.right = function(){
			if(this.focusArea==0)this.changePos(1,0);
			else if(this.showChannelFlag&&this.focusArea==1) this.changeFocus(1);
		};
		this.up = function(){
			iDebug("this.up");
			if(this.focusArea==0)this.changePos(-1,1);
		};
		this.down = function(){
			iDebug("this.down==this.TVPopdata.data.length:"+this.TVPopdata.data.length);
			if(this.focusArea==0)this.changePos(1,1);
			else if(this.showChannelFlag&&this.focusArea==1&&this.TVPopdata.data.length>0){
				this.focusArea = 0;
				this.showFocus(this.focusPos);
			iDebug("this.prePage==3333= this.focusPos:"+ this.focusPos);
				this.selectFocus(this.channelFocus);
			}
		};
		this.changePos = function(_num,_flag){
		     var prePos = this.focusPos;
             var nextPos = this.getNext(_num,_flag);
			 iDebug("tmpPage==this.changePos nextPos:"+nextPos+"==currPage:"+this.currPage);
			 
			 if(nextPos==-1&&this.currPage>=this.totalPage-1&&_num==1)return;
			 if(nextPos == -1&&this.currPage==0){
				 this.focusPos = prePos;
				 if(this.showChannelFlag){
					 this.focusArea = 1;
				 	 this.disFocus(this.focusPos);
				 	 this.onFocus(this.channelFocus);
				 }
				 return;
			 }else if(nextPos == -1&&_num==-1&&_flag==1){
				 conObj.prePage();	
				 return;
			 }
			 //0120 先消失焦点再刷新
			 this.disFocus(prePos);
			iDebug("this.prePage=== t444==this.currPage:"+ this.currPage+"==his.totalPage:"+ this.totalPage);
			 if(_num==1&&_flag==1&&this.currPage<this.totalPage-1&&this.focusPos>=30){
				 this.focusPos = this.pageSize-1;
				 this.doSelect();
				 return;
			 }else{
				  if(typeof nextPos == "number"){
					 this.focusPos = nextPos;				 
				  }else{
					this.currPage = nextPos.page;
					this.initPopData();
					this.focusPos = nextPos.pos;		  
				 }
			 }
			iDebug("this.prePage=== t444==his.focusPos:"+ this.focusPos);
			 this.showFocus(this.focusPos);
		}
		
		//移动时获取下一个位置
		this.getNext = function(_num,_flag){
			 iDebug("tmpPage==this.getNext _num:"+_num+"==_flag:"+_flag+"==this.focusPos:"+this.focusPos);
			 if(_flag == 0){//左右移动
				if(_num == -1){
					var temp = (this.focusPos-1)<=0?0:(this.focusPos-1);
					var tmpNum = this.currPage*(this.pageSize-1) + temp;
				   for(var i=tmpNum; i>=0; i--){
						 if(this.dataArr.flag[i] == 1){
							 var tmpPage = i>0?(Math.ceil((i+1)/(this.pageSize-1))-1):0;
							 iDebug("tmpPage==this.currPage:"+(tmpPage==this.currPage));
							 if(tmpPage==this.currPage){ 
							 iDebug("tmpPage==this.currPage:"+this.currPage+"==this.currPage:"+this.currPage+"==i:"+i);
							 	return i - this.currPage*(this.pageSize-1);
							 }else if(tmpPage>-1){
								return 	{"page":tmpPage,"pos":this.pageSize-1}
							 }
						 }
					}
				}else if(_num == 1){
					var tmpNum = this.currPage*(this.pageSize-1);
			 		iDebug("tmpPage==this.getNext tmpNum:"+tmpNum+"==this.pageSize:"+this.pageSize+"==this.currPage:"+this.currPage+"==this.totalPage:"+this.totalPage);
					for(var i=this.focusPos+1; i<this.pageSize; i++){
			 		iDebug("tmpPage==this.getNext this.dataArr.flag[tmpNum+i]:"+this.dataArr.flag[tmpNum+i]+"==i:"+i+"==this.currPage:"+this.currPage+"==this.totalPage:"+this.totalPage);
						 if(this.dataArr.flag[tmpNum+i] == 1 && i<this.pageSize-1){
							 return i;
						 }else if(i==this.pageSize-1 && this.currPage<this.totalPage-1){							 
							return this.pageSize-1;	 
						}
					}
				}
				
				return -1;
				
			 }else if(_flag == 1){//上下移动
				var tmpNum = this.currPage*(this.pageSize-1);
				
				if(_num == -1){
				   for(var i=this.focusPos-this.colNum; i>=0; i-=this.colNum){
						 if(this.dataArr.flag[tmpNum+i] == 1 && i>-1){
							 return i;
						 }
					}
					//对焦点移动的规则重新做优化
					var currRowNum = Math.floor(this.focusPos/this.colNum);
					for(var i=0;i<this.colNum;i++){
						if(currRowNum == Math.floor((this.focusPos+i)/this.colNum)){
							for(var j=this.focusPos+i-this.colNum; j>=0; j-=this.colNum){
								 if(this.dataArr.flag[tmpNum+j] == 1 && j>-1){
									 return j;
								 }
							}
						}
						if(currRowNum == Math.floor((this.focusPos-i)/this.colNum)){
							for(var j=this.focusPos-i-this.colNum; j>=0; j-=this.colNum){
								 if(this.dataArr.flag[tmpNum+j] == 1 && j>-1){
									 return j;
								 }
							}
						}
					}
					return -1;
				}else if(_num == 1){
					for(var i=this.focusPos+this.colNum; i<this.pageSize; i+=this.colNum){
						 if(this.dataArr.flag[tmpNum+i] == 1 && i<this.pageSize){
							 return i;
						 }
					}
					//对焦点移动的规则重新做优化
					var currRowNum = Math.floor(this.focusPos/this.colNum);//当前为第几行
					//在同一行中，上下移动的时候，依次在中间左右寻找最近的点来移动
					for(var i=0;i<this.colNum;i++){
						if(currRowNum == Math.floor((this.focusPos+i)/this.colNum)){//判断是否为同一行
							for(var j=this.focusPos+i+this.colNum; j<this.pageSize; j+=this.colNum){
								 if(this.dataArr.flag[tmpNum+j] == 1 && j<this.pageSize){
									 return j;
								 }
							}
						}
						if(currRowNum == Math.floor((this.focusPos-i)/this.colNum)){
							for(var j=this.focusPos-i+this.colNum; j<this.pageSize; j+=this.colNum){
								 if(this.dataArr.flag[tmpNum+j] == 1 && j<this.pageSize){
									 return j;
								 }
							}
						}
					}
				}
				if(this.currPage<this.totalPage-1){
					return this.pageSize-1;	 
				}
			 	return -1;
			} 
		};
		
		this.doSelect = function(){
			iDebug("[TVPop_new.js]---doSelect()---this.focusArea="+this.focusArea+",this.showChannelFlag="+this.showChannelFlag);
			if(this.showChannelFlag&&this.focusArea==1){
				return;
				var isPlayPageFlag = false;
				if(typeof gotoPortal!= "undefined"){
					iPanel.debug("yanch js 1")//abc窗口，播放页面不会刷新
					if(iPanel.mainFrame.location.href.indexOf("play.php") > -1){//在播放页面,手动刷新下页面
						isPlayPageFlag = true;
					}
				}
				iDebug("[TVPop_new.js]---doSelect()---this.channelPos="+this.channelPos+",isPlayPageFlag="+isPlayPageFlag);
				var chanId = this.TVPopdata.chanListArr[this.channelPos].chanl_id;
				iDebug("[TVPop_new.js]---doSelect()---isPlayPageFlag="+isPlayPageFlag+",chanId="+chanId);
				iPanel.eventFrame.openPage(playAddress,{type:"play",isMode:"channelId",channelId:chanId,listLabel:this.TVPopdata.listLabel,isAppFlag:1});	
				iPanel.debug("yanch js 2")
				if(isPlayPageFlag){//手动刷新页面onshow
					iPanel.mainFrame.onHide();
					iPanel.mainFrame.onShow();
				}
				var popWidget = iPanel.pageWidgets.getByName("popWidget");
				if(popWidget) popWidget.close();
				/*this.TVPopdata.data = this.TVPopdata.chanListArr[this.channelPos].list;
			    iDebug("TVPop.js-----doSelect-----this.channelPos="+this.channelPos);
				this.focusPos=0;
				this.initNumArr();
				if(this.pageFlag&&this.pageFlag==1){
					var nowPoss=this.isthisFocus();
					this.focusPos= nowPoss.pos;//kongwm 自己  执行此函数
					this.currPage = nowPoss.page;
					if(this.focusPos==null&&typeof this.focusPos=="undefined"&&this.currPage==null&&typeof this.currPage=="undefined"){
						this.focusPos=0;
						this.currPage=0;
					}
					iDebug("TVPop.js-----init-----this.focusPos="+this.focusPos);
					this.initData();
					this.showFocus(this.focusPos);
				}else{
					this.initData();
				   this.showFocus(this.focusPos);
				}*/
			}else{
				iPanel.debug("yanch js 3")
				if(this.focusPos == this.rowNum* this.colNum-1){
					this.currPage ++;
					this.disFocus(this.focusPos);
					iDebug("this.doSelect===this.focusPos:"+this.focusPos);
					this.initPopData();
					//var nextPos = this.getNext(1,0);
					//this.focusPos = 0;
					var focusNum =this.getRealFocus();
					this.focusPos = parseInt(focusNum.num);
					iDebug("this.doSelect=555==this.focusPos:"+this.focusPos);
					this.showFocus(this.focusPos);
				}else{
					this.goToBackTv()
				}
			}
			
		}
		this.getRealFocus = function(){
			var count=0;
			var numFlag = 0;
			for(var i=0;i<this.pageSize;i++){
				var tmpNum = this.currPage*(this.pageSize-1) + i;
				if(tmpNum<this.dataArr.totalNum){
					iDebug("this.dataArr.flag[tmpNum]="+this.dataArr.flag[tmpNum]);
					if(this.dataArr.flag[tmpNum]!=1){
						count++;
					}else{
						numFlag = i;
						return {num:numFlag};
					}
				}else{
					return {num:this.pageSize-1}; //都是不能点击的
				}
			}
			return {num:this.pageSize-1}; //都是不能点击的
		}
		this.prePage = function(){
			if(this.currPage>0){
				this.currPage--;
				this.disFocus(this.focusPos);
				var nextPos = this.getNext(-1,0);
			iDebug("this.prePage===nextPos:"+nextPos);
				if(typeof nextPos == "number"){
				 	 this.initPopData();
					 this.focusPos = nextPos;
			iDebug("this.prePage==111= this.focusPos:"+ this.focusPos);
				     this.showFocus(this.focusPos);	
				}else{
					this.currPage = nextPos.page;
					this.initPopData();
					this.focusPos = nextPos.pos;
			iDebug("this.prePage==222= this.focusPos:"+ this.focusPos);
					this.showFocus(this.focusPos);		  
				}
				
			}	
		}
		this.showChannelName = function(){
			var leng=this.TVPopdata.chanListArr.length;
			if(leng>2){
				$("arrow_0").style.visibility = "visible";
				$("arrow_1").style.visibility = "visible";
			}else if(leng>1){
				$("arrow_0").style.visibility = "hidden";
				$("arrow_1").style.visibility = "hidden";
			}
			var maxNum = leng>1?2:leng;
			for(var j = 0; j < maxNum; j++){
			iDebug("this.showChannelName===this.channelPos:"+this.channelPos);
			var tmpChannelObj = this.TVPopdata.chanListArr[(this.channelPos+j+leng)%leng];
				$("channelName_"+j).innerHTML = tmpChannelObj.chnl_name.substring(0,this.getRealLength(tmpChannelObj.chnl_name,12))
			}
			
			this.selectFocus(this.channelFocus)
		}
		this.changeFocus = function(_num){
			iDebug("this.changeFocus===this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus);
                this.loseFocus(this.channelFocus);
			if(this.channelFocus == 1 && _num==1||this.channelFocus == 0 && _num == -1){
				if(this.TVPopdata.chanListArr.length<=2){
					this.onFocus(this.channelFocus);return;
				}
				var leng = this.TVPopdata.chanListArr.length;
				this.channelPos=(this.channelPos +_num+leng)%leng;
				this.showChannelName();
				this.changeChanelEpg();
				/*var tmpChannelObj = this.TVPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
				this.getSeriesList(tmpChannelObj.series_name,tmpChannelObj.chanl_id,tmpChannelObj.idx_type);*/
            }else{
				var leng = this.TVPopdata.chanListArr.length;
				if(leng<=1){
					this.onFocus(this.channelFocus);return;
				}
				this.channelFocus += _num;
				if(this.channelFocus>2){
					this.channelFocus = 1;
				}else if(this.channelFocus<0){
					this.channelFocus = 0;
				}
				this.changeChanelEpg();
				/*var leng = this.TVPopdata.chanListArr.length;
				var tmpChannelObj = this.TVPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng];
				this.getSeriesList(tmpChannelObj.series_name,tmpChannelObj.chanl_id,tmpChannelObj.idx_type);
				iDebug("this.changeFocus==11=this.channelPos:"+this.channelPos+"==this.channelFocus:"+this.channelFocus);*/
            }
		}
		this.changeChanelEpg = function(){
			this.initNumArr();
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
			this.TVPopdata.data = _obj.data;
			this.initNumArr();
			this.initPopData();
			this.onFocus(this.channelFocus);
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
			iDebug("this.selectFocus===_pos:"+this.containInfo.td.titleSelBg);
			this.$("channelName_"+_pos).style.backgroundColor  = this.containInfo.td.titleSelBg;
			this.$("channelName_"+_pos).style.color = this.containInfo.td.titleSelColor;
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
			var PlayBackUrl=iPanel.getGlobalVar("PlayBackUrl");
			iPanel.debug("yanch TVPOP PlayBackUrl="+PlayBackUrl)
			//iPanel.debug("yanch TVPOP playAddress="+playAddress)
			//top.window.location=PlayBackUrl;
			var tmpNum = this.currPage*(this.pageSize-1) + this.focusPos;
			var backTvObj = this.dataArr.obj[tmpNum];
			iDebug(backTvObj);
			var sd  = typeof(backTvObj.url)!="undefined"?backTvObj.url:this.TVPopdata.url;
			var name = this.TVPopdata.textArr[0];
			var idxtype = "";
			if(this.showChannelFlag==1){
				var leng = this.TVPopdata.chanListArr.length;
				idxtype = this.TVPopdata.chanListArr[(this.channelPos+this.channelFocus+leng)%leng].idx_type;
			}
			var programId = backTvObj.program_id;
            var url = sd;//+"?tsstarttime="+tsstarttime+"&tsendtime="+tsendtime;
			
			iDebug("---popTV.htm-goToBackTv--url ="+url+"  name:"+name+"  chanId:"+this.TVPopdata.channelId+" programId:"+programId+";=======this.TVPopdata.seriesId="+this.TVPopdata.seriesId+",this.TVPopdata.isType"+this.TVPopdata.isType);
      if(this.isiPanel){
				//window.location.href = "play/play.php?playurl="+url+"||name="+name;	
			}else{
				iDebug("------------in--openPage");
				//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的) start
				var __params = {
					//type:"backTV",
					type:"backTV",//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的)
					name:name,
					idxtype:idxtype,
					playUrl:url,
					chanId:this.TVPopdata.channelId,
					programId:programId,
					actionPA:19,//选集看
					listLabel:this.TVPopdata.listLabel,
					isAppFlag:1,
					backUrl:PlayBackUrl
				}
				if(typeof this.TVPopdata.isType!="undefined" && this.TVPopdata.isType=="vod"){
					__params = {
						//type:"backTV",
						type:"vod",//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的)
						name:name,
						playUrl:url,
						chanId:this.TVPopdata.channelId,
						vodid:programId,
						actionPA:19,//选集看
						seriesId:this.TVPopdata.seriesId?this.TVPopdata.seriesId:0,
						listLabel:this.TVPopdata.listLabel,
						isAppFlag:1,
						backUrl:PlayBackUrl
					}
				}
				var isPlayPageFlag = false;
				if(typeof gotoPortal!= "undefined"){//abc窗口，播放页面不会刷新
					if(iPanel.mainFrame.location.href.indexOf("play.php") > -1){//在播放页面,手动刷新下页面
						isPlayPageFlag = true;
					}
				}
				iDebug("yanch goToBackTv playAddress="+playAddress)
				iPanel.eventFrame.openPage(
					playAddress,__params
				);
				//pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的) end
				if(isPlayPageFlag){//手动刷新页面onshow
					iPanel.mainFrame.onHide();
					iPanel.mainFrame.onShow();
				}
				var popWidget = iPanel.pageWidgets.getByName("popWidget");
				if(popWidget) popWidget.close();
			}
		};
		
		
			//对象排序
		this.by = function(name){
			return function(o, p){
				var a, b;
				if (typeof o === "object" && typeof p === "object" && o && p) {
					a = o[name];
					b = p[name];
					if (a === b) {
						return 0;
					}
					if (typeof a === typeof b) {
						return a < b ? -1 : 1;
					}
					return typeof a < typeof b ? -1 : 1;
				}
				else {
					iDebug("--by--error");
				}
			}
		};
		
	}
		
	
	//注册一个对象，将new comfirmComponent() 赋值给注册的对象
	creatTVpop = function(_TVPopCss){
		var _conObj = new container(_TVPopCss);
		return _conObj;
	};
})()
