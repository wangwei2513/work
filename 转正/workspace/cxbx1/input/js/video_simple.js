(function(){	
	var _join_menu ={   
		"BG":{
			position:"absolute",
			backgroundColor:"#2B2C2C",
			left:"0px",
			top:"625px",
			width:"1280px",
			height:"95px",
			webkitTransitionDuration:"0m",
			zIndex:3
		},
		"playBtn":{
			position:"absolute",
			left:"80px",
			top:"16px",
			width:"70px",
			height:"60px",
			zIndex:4,
			color:"#ffffff",
			fontSize:"28px",
			lineHeight:"55px",
			textAlign:"center"
		},
		"line":{
			position:"absolute",
			left:"180px",
			top:"0px",
			width:"1px",
			height:"95px",
			zIndex:4,
			backgroundColor:"#000000",
		},
		"lineRight":{
			position:"absolute",
			left:"1050px",
			top:"0px",
			width:"1px",
			height:"95px",
			zIndex:4,
			backgroundColor:"#000000"
		},
		"ad":{
			position:"absolute",
			left:"1051px",
			top:"0px",
			width:"229px",
			height:"95px", 
			zIndex:6,
			backgroundImage:"url(images/ad.png)"
		},
		"tipDiv":{
			position:"absolute",
			/*left:"-295px",
			top:"602px",*/
			left:"162px",
			top:"602px",
			width:"80px",
			height:"29px", 
			zIndex:5,
			backgroundImage:"url(tip.png)",
			webkitTransitionDuration:"10ms",
			//backgroundColor:"#ffffff",
			opacity:"0",
			fontSize:"20px",
			textAlign:"left",
		},
		"chanName":{
			position:"absolute",
			left:"20px",
			top:"41px",
			width:"242px",
			height:"30px",
			fontSize:"30px",
			textAlign:"center",
			color:"#ffffff"
		},
		"chanNum":{
			position:"absolute",
			left:"20px",
			top:"0px",
			width:"242px",
			height:"40px",
			fontSize:"40px",
			textAlign:"center",
			color:"#ffffff"
		},
		"currProgramVod":{
			position:"absolute",
			left:"211px",
			top:"30px",
			width:"777px",
			height:"32px",
			fontSize:"30px",
			textAlign:"left",
			color:"#e5e5e5"
		},
		"currProgram":{
			position:"absolute",
			left:"283px",
			top:"24px",
			width:"600px",
			height:"26px",
			fontSize:"26px",
			textAlign:"left",
			color:"#e5e5e5"
		},
		"nextProgram":{
			position:"absolute",
			left:"283px",
			top:"51px",
			width:"600px",
			height:"20px",
			fontSize:"20px",
			textAlign:"left",
			color:"#878787"
		},
		"userName":{
			position:"absolute",
			left:"870px",
			top:"49px",
			width:"300px",
			height:"24px",
			fontSize:"22px",
			textAlign:"left",
			color:"#7d7d7d"
		},
		"pfTime":{
			position:"absolute",
			left:"780px",
			top:"24px",
			width:"300px",
			height:"54px",
			fontSize:"16px",
			lineHeight:"16px",
			textAlign:"left",
			color:"#e5e5e5"
		},
		"processBg":{
			position:"absolute",
			left:"202px",
			top:"8px",
			width:"826px",
			height:"15px",
			backgroundColor:"#040000"
		},
		"process":{
			position:"absolute",
			left:"202px",
			top:"8px",
			width:"0px",
			height:"15px",
			backgroundColor:"#0766AB",
			webkitTransitionDuration:"0ms"
		},
		"allTime":{
			position:"absolute",
			left:"870px",
			top:"24px",
			width:"220px",
			height:"26px",
			fontSize:"22px",
			color:"#7d7d7d",
			textAlign:"left"
		},
		"currTime":{
			position:"absolute",
			left:"998px",
			top:"40px",
			width:"70px",
			height:"24px",
			fontSize:"24px",
			color:"#656565",
			textAlign:"left"
		},
		"date":{
			position:"absolute",
			left:"1050px",
			top:"5px",
			width:"230px",
			height:"26px",
			fontSize:"26px",
			color:"#888888",
			lineHeight:"34px",
			paddingRight:"25px",
			textAlign:"center"
		},	
		menu_type:0//0,高清;标清类型1:720*576,2:640*526
	};

	var createMenuComponet = function(args,_type){
		this.appType = typeof _type == "undefined"?"vod":_type;//点播和回看共用vod类型，直播使用类型为play
		iPanel.debug("createMenuComponet--");
		this.menuContainer = null;        //最外层DIV
		this.outDivStyle = args.BG;
		this.line = null;
		this.lineStyle = args.line;
		this.outProcesser = null;		  //进度条外框
		this.outProcessStyle = args.processBg;
		this.processer = null;		      //进度条
		this.processStyle = args.process;
		if(this.appType == "play"){
			this.chaNamer = null;			  //频道名称
			this.chaNameStyle = args.chanName;
			this.chaNumer = null;             //频道号
			this.chaNumStyle = args.chanNum;
			this.pfTime = null;             //频道号
			this.pfTimeStyle = args.pfTime;
			this.currProgramer = null;		  //当前节目
			this.currProgramStyle = args.currProgram;
			this.nextProgramStyle = args.nextProgram;
			this.chaIconer = null;  
			this.lineStyle.left = "262px";
			this.processStyle.left = this.outProcessStyle.left = "283px";
			this.outProcessStyle.width = "745px";
		}	
		if(this.appType == "vod" || this.appType == "tstv"){
			this.currProgramer = null;		  //当前节目
			this.currProgramStyle = args.currProgramVod;
			this.playBtner = null;            //按钮
			this.playBtnStyle = args.playBtn;
			this.tipDiver = null;             //时间bar
			this.tipDivStyle = args.tipDiv;
			this.tipDiverLeft = parseInt(args.tipDiv.left);
		}
		this.userName = null;
		this.userStyle = args.userName;
		
		this.lineRight = null;
		this.lineRightStyle = args.lineRight;
		this.ad = null;
		this.adStyle = args.ad;
		
		this.allTimer = null;		      //总时长
		this.allTimeStyle = args.allTime; 
		this.allTimeLeft = parseInt(this.allTimeStyle.left);
		this.currTimer = null;		      //当前用时
		this.currTimeStyle = args.currTime; 
		this.currTimeLeft = parseInt(this.currTimeStyle.left);
		this.dater = null;                //日期
		this.dateStyle = args.date;
		this.dateLeft = parseInt(this.dateStyle.left);	
		
		
		this.outDivWebKit = args.outDivWebKit||"100ms";
		this.allTime = 100;               //总时长
		this.currTime = 0;                //当前用时
		this.currCha = args.currCha||0;//当前在哪项
		this.showFlag = 1;				  //默认是显示
		this.haveData = function(){};
		this.timer = -1;//定时器
		this.playPauseFlag = 0;//播放暂停开关
		this.menu_type = args.menu_type;  //标清类型
		this.lesX= 18;
		this.lesY = 15;
		this.unitWidth = 43;
		this.unitHeight = 39;
		this.hideTime = 5000;
		this.hideTimer = null;
		this.seeking = false;
		this.seekTimer =null;
		this.seekTime = 1200;
		this.dataTimer = null;
		this.multiplier = 1;//连续按快进快退的时候的倍速
		this.lastKeyPress = 0;//上次的按键 0表示无按键  1表示向右  -1表示向左
		this.destroyFlag = false;
		this.playFlag = true;
		this.cursorAddress = "http://192.168.36.123/poster/2/hdgdws/20130927/thumbnail_160500/";
		this.cursorHaveFlag = false;

		/*************初始操作*********/
		this.init = function(){
			this.createContainer();		//创建容器
			this.createSubItem();		//创建子条目
			this.showContainer();
		};
		
		/*************创建container*********/
		this.createContainer = function(){
			var fragment = document.createDocumentFragment();
			this.menuContainer = this.createDom("div", fragment);
			this.extend(this.menuContainer.style, this.outDivStyle);		
			document.body.appendChild(this.menuContainer);		
			if(this.appType == "vod" || this.appType == "tstv"){
				fragment = document.createDocumentFragment();
				this.tipDiver = this.createDom("div", fragment);
				this.extend(this.tipDiver.style, this.tipDivStyle);
				document.body.appendChild(this.tipDiver);
			}
		};
		
		this.resetTipDiver = function(){
			//document.body.removeChild(this.tipDiver);
			/*this.tipDiver.style.visibility = "hidden";
			//alert("this.tipDiver=111");
			this.tipDiver = document.getElementById("cursorDiv");
			this.tipDiverTime =  document.getElementById("cursorTime");	
			this.tipPicList = this.tipDiver.getElementsByTagName("img");
			this.tipDiverLeft = -295;
			this.tipDiver.style.left = this.tipDiverLeft+"px";
			this.tipDiver.style.top = "431px";
			this.tipDiver.style.visibility = "visible";
			this.initProcess();*/
		}
		
		/*************创建子条目********/
		this.createSubItem = function(){		
			if(this.appType == "play"){
				this.chaNamer = this.createDom("div", this.menuContainer);
				this.extend(this.chaNamer.style, this.chaNameStyle);
				this.chaNumer = this.createDom("div", this.menuContainer);
				this.extend(this.chaNumer.style, this.chaNumStyle);
				this.pfTime = this.createDom("div", this.menuContainer);
				this.extend(this.pfTime.style, this.pfTimeStyle);
				this.nextProgramer = this.createDom("div", this.menuContainer);
				this.extend(this.nextProgramer.style, this.nextProgramStyle);
			}
			this.currProgramer = this.createDom("div", this.menuContainer);
			this.extend(this.currProgramer.style, this.currProgramStyle);
			
			this.userName = this.createDom("div", this.menuContainer);
			this.extend(this.userName.style, this.userStyle);

			this.outProcesser = this.createDom("div", this.menuContainer);
			this.extend(this.outProcesser.style, this.outProcessStyle);
			this.line = this.createDom("div", this.menuContainer);
			this.extend(this.line.style, this.lineStyle);
			this.lineRight = this.createDom("div", this.menuContainer);
			this.extend(this.lineRight.style, this.lineRightStyle);
			var temp = Math.random()*2;
			if(temp >1){//概率性的显示广告
				this.ad = this.createDom("div", this.menuContainer);
				this.extend(this.ad.style, this.adStyle);
			}
			var fragment = document.createDocumentFragment();
			this.processer = this.createDom("div", fragment);
			this.extend(this.processer.style, this.processStyle);
			this.menuContainer.appendChild(this.processer);
			this.allTimer = this.createDom("div", this.menuContainer);
			this.extend(this.allTimer.style, this.allTimeStyle);
			this.currTimer = this.createDom("div", this.menuContainer);
			this.extend(this.currTimer.style, this.currTimeStyle);
			this.dater = this.createDom("div", this.menuContainer);
			this.extend(this.dater.style, this.dateStyle);
			if(this.appType == "vod" || this.appType == "tstv"){
				var fragment = document.createDocumentFragment();
				this.playBtner = this.createDom("div", fragment);
				this.extend(this.playBtner.style, this.playBtnStyle);
				this.menuContainer.appendChild(this.playBtner);
				this.playBtner.innerHTML = "|&nbsp;|";
			}			
			var self = this;
			setTimeout(function(){self.menuContainer.style.webkitTransitionDuration = self.outDivWebKit;},100)//2D元素加载要稍延后
		};
		
		/*************填充数据的操作*********/
		this.initDataInfo = function(){
			iPanel.debug("initDataInfo------------");
			if(this.appType == "play"){
				this.haveData(this.chaNamer, this.currCha, "chaName");//为当前频道名赋值	
				this.haveData(this.chaNumer, this.currCha, "chaNum");//频道号
				this.haveData(this.currProgramer, this.currCha, "currProgram");//vod 名称,为频道的时候为当前节目
				this.haveData(this.pfTime, this.currCha, "pfTime");//节目的开始和结束时间
			}
			//this.haveData(this.chaNumer, this.currCha, "proInfo");//相关描述
			if(this.appType == "vod" || this.appType == "tstv"){
				this.haveData(this.currProgramer, this.currCha, "chaName");//vod 名称,为频道的时候为当前节目
			}
			iPanel.debug("111111111111")
			//this.haveData(this.nextProgramer, this.currCha, "nextProgram");//下个节目
			
			this.haveData(this.allTimer, this.currCha, "allTime",this.getTimes(this.allTime));//总时长
			iPanel.debug("22222222222222222222222")
		};
		
		this.initUserInfo = function(_name){
			this.haveData(this.userName, this.currCha, "userName",_name);//下个节目
		}
		/*************加载数据后的操作*********/
		this.loadData = function(args){
			clearTimeout(this.timer);
			this.currCha = args.currCha;
			this.currTime = args.currTime;
			this.allTime = args.allTime;
			this.startTime = args.startTime;
			if(this.currTime>this.allTime) this.currTime = this.allTime;
			this.initDataInfo();
			this.processer.style.webkitTransitionDuration = "10ms";
			this.processer.style.width = "0px";
			this.processer.style.webkitTransitionDuration = this.outDivWebKit;
			if(this.appType == "vod" || this.appType == "tstv"){
				this.tipDiver.style.webkitTransitionDuration = "0ms";
				this.tipDiver.style.left = this.tipDiverLeft+"px";
				this.tipDiver.style.webkitTransitionDuration = this.outDivWebKit;
			}
			this.initProcess();
			this.startMove();
			this.displayDate();
			this.showContainer();
			/*(function(self){
				setTimeout(function(){
				self.initProcess();
				self.startMove();
				},100);
			})(this);*/
		};
		
		//显示当前日期详情
		this.displayDate = function(){
			if(typeof(this.destroyFlag) == "undefined"||this.destroyFlag) return;
			var date = dateSynchro;
			//alert(date.toLocaleString());
			var month = (parseInt(date.getMonth())+1).toString();
			var day = date.getDate().toString();
			var hour = date.getHours().toString();
			var min = date.getMinutes().toString();;
			var str = (hour.length<2?"0"+hour:hour)+":"+(min.length<2?"0"+min:min)+" 晴<br>";
			str += (month.length<2?"0"+month:month)+"/"+(day.length<2?"0"+day:day)+"&nbsp;";  
			var arr_week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
			var week = arr_week[date.getDay()];
			str += week;
		
			this.dater.innerHTML = str;
			var self = this;
			this.dataTimer = setTimeout(function(){self.displayDate();},61000);
		}
		
		//改变进度条
		this.initProcess = function(){
			iPanel.debug("this.appType="+this.appType);
			if(this.appType == "vod"|| this.appType == "tstv"){ 
				iPanel.debug("this.currTime="+this.currTime);
				var currTime;
				if(this.appType == "vod") currTime = this.getTimes(this.currTime);
				else currTime = this.getAbsTime(media.AV.TSTVStartTime,this.currTime);
				iPanel.debug("currTime="+currTime);
				var currPicTime = Math.round(this.currTime/10)*10;
				if(this.cursorHaveFlag){
					this.tipDiverTime.innerHTML = currTime;
					for(var i=0;i<5;i++){
						var timePic = 	currPicTime + (i-2)*10;
						if(timePic>=0) this.tipPicList[i].src = this.cursorAddress+"/"+timePic+".jpg";					
					}
				}else{
					this.tipDiver.innerHTML = currTime;
					/*for(var i=0;i<5;i++){
 						this.tipPicList[i].src = "images/seekImages/"+i*10+".jpg";
					}*/
				}
			}
			//this.currTimer.innerHTML = "时长";
			if(this.currTime<0) this.currTime = 0;
			if(this.allTime<1) this.allTime = 1;
			this.processer.style.width = parseInt((this.currTime/this.allTime)*parseInt(this.outProcesser.style.width))+"px";
			if(this.appType == "vod" || this.appType == "tstv"){
				var end = parseInt(this.processer.style.width);
				this.tipDiver.style.left = parseInt(this.tipDiverLeft+end)+"px";
			}
		}
		
		//模拟进度条移动
		this.startMove = function(){
			iPanel.debug("startMove__________start")
			clearTimeout(this.timer);
			var self = this;
			this.timer = setTimeout(function(){
				 iPanel.debug("self.destroyFlag=="+self.destroyFlag);
				 if(typeof(self.destroyFlag) != "undefined" && !self.destroyFlag)	self.startMove();
			},1000);			
			if(!this.playFlag){//当未播放成功的时候，不移动进度条
				return;
			}
			if(this.appType == "vod"){
				this.currTime = media.AV.elapsed;
			}else if(this.appType == "tstv"){
				this.currTime  = this.getRelativeTime(media.AV.TSTVStartTime,media.AV.TSTVPresentTime);
				this.allTime = this.getRelativeTime(media.AV.TSTVStartTime,media.AV.TSTVEndTime);
				this.haveData(this.allTimer, this.currCha, "allTime",1);
			}else if(this.appType == "play"){
				var nowTime = Math.round(dateSynchro.valueOf()/1000);
				this.currTime = nowTime - parseInt(this.startTime,10);//当前影片播放时间
			}
			if(this.currTime>this.allTime){
				this.currTime = this.allTime;
				return;
			}
			this.initProcess();
			iPanel.debug("startMove__________end")
		}
		
		this.getRelativeTime = function(_start,_end){//获取时间段
			//2013-10-15 16:43:00
			var sTime = _start.split(" ")[1];
			var eTime = _end.split(" ")[1];
			var sTimeArr,eTimeArr;
			if(typeof sTime !="undefined"  && typeof eTime !="undefined"){
				sTimeArr = sTime.split(":");
				eTimeArr = eTime.split(":");
				if(typeof eTimeArr !="undefined"  && typeof eTimeArr !="undefined"){
					if(eTimeArr[0]<sTimeArr[0])	eTimeArr[0]+=24;//默认此时换天了
					return (Math.floor(eTimeArr[0])*3600+Math.floor(eTimeArr[1])*60+Math.floor(eTimeArr[2]))-(Math.floor(sTimeArr[0])*3600+Math.floor(sTimeArr[1])*60+Math.floor(sTimeArr[2]));
				}
			}
			return 1;//默认为1秒
		}
		
		this.getAbsTime = function(_start,_curr,_type){
			//2009/03/25 10:10:10	
			var startSeconds = Date.parse(_start.replace(/-/g,"/"));//转化为秒数;
			var cuurSeconds = Math.floor(_curr)*1000+startSeconds;
			var d = new Date(cuurSeconds);
			var hms = this.addZero(d.getHours())+":"+this.addZero(d.getMinutes())+":"+this.addZero(d.getSeconds());
			if(_type == "all"){
				return d.getYear()+"/"+this.addZero(d.getMonth()+1)+"/"+this.addZero(d.getDate())+" "+hms;
			}
			return hms;
		}
		
		this.addZero = function(_str){
			_str = ""+_str;
			if(_str.length<2) return "0"+_str;
			return _str;
		}
		//播放暂停控制
		this.enterKeyAction = function(){
			if(this.seeking && (this.appType == "vod" || this.appType == "tstv")){
				if(this.appType == "vod") media.AV.seek(numberToTime(this.currTime));
				else media.AV.seek(this.getAbsTime(media.AV.TSTVStartTime,this.currTime,"all"));
				this.seeking = false;
				this.startMove();
				return "nothing";
			}
			if(this.showFlag && (this.appType == "vod"|| this.appType == "tstv")){
				this.playPauseFlag = this.playPauseFlag==1?0:1;
				this.playBtner.innerHTML = this.playPauseFlag==1?"|>":"|&nbsp;|";
				
				if(this.playPauseFlag==1){
					clearTimeout(this.timer);
					clearTimeout(this.hideTimer);
					media.AV.pause();
					return "pause";
				}else{
					media.AV.play();
					this.startMove();
					this.showContainer();
					return "play";
				}
			}else if(this.showFlag && this.appType != "tstv"){
				return "gotoPLTV";
			}else{
				this.showContainer();
				return "nothing";
			}
		};
		
		this.rightKeyAction = function(_num){
			if(this.showFlag){
				//每次1%
				if(this.lastKeyPress != 0){
					if(this.lastKeyPress == _num){
						this.multiplier = this.multiplier*2;//连续按同一个按键，速度加倍
						if(this.multiplier >8) this.multiplier = 8;
					}else{
						this.multiplier = this.multiplier/2;
						if(this.multiplier < 0.125) this.multiplier = 0.125;
					}	
				}
				this.lastKeyPress = _num;//记忆本次的按键方向，供下次使用
				
				var setp = Math.round(this.allTime*_num*this.multiplier/100);
				this.currTime = this.currTime+setp;
				if(this.currTime<0) this.currTime = 0;
				if(this.currTime>this.allTime) this.currTime = this.allTime-1;
				this.initProcess("seeking");
				var self = this;
				clearTimeout(this.seekTimer);
				this.seekTimer = setTimeout(function(){
					//alert("self.destroyFlag=="+self.destroyFlag);
					if(typeof(self.destroyFlag) == "undefined"||self.destroyFlag) return;
					if(self.appType == "vod") media.AV.seek(numberToTime(self.currTime));
					else media.AV.seek(self.getAbsTime(media.AV.TSTVStartTime,self.currTime,"all"));
					self.seeking = false;
					self.startMove();	
					self.resetMultiplier();
					 if(globalWidget.urlType == 1){//只有是视频的时候 进度条才消失
						   this.hideTimer = setTimeout(function(){self.backKeyAction()},self.hideTime);
					 }
					//self.hideTimer = setTimeout(function(){self.backKeyAction()},self.hideTime);
				},self.seekTime);
				clearTimeout(this.timer);
				clearTimeout(this.hideTimer);
				this.seeking = true;
				this.playFlag = false;
			}else{
				this.showContainer();
			}
		}
		
		this.resetMultiplier = function(){
			this.multiplier = 1;//连续按快进快退的时候的倍速
			this.lastKeyPress = 0;	
		}
		
		this.showContainer = function(){
			this.showFlag = 1;
			//this.menuContainer.style.opacity = "0.8";
			this.menuContainer.style.opacity = "1";
			if(this.appType == "vod" || this.appType == "tstv") this.tipDiver.style.opacity = "1";	
			var self = this;
			clearTimeout(self.hideTimer);
		     if(globalWidget.urlType == 1){//只有是视频的时候 进度条才消失
			   this.hideTimer = setTimeout(function(){self.backKeyAction()},self.hideTime);
			 }
			
			media.video.setPosition(0,0,1280,625);
		}
		//返回键控制
		this.backKeyAction = function(){
			iPanel.debug("this.destroyFlag=="+this.destroyFlag);
			if(this.showFlag &&typeof(this.destroyFlag) != "undefined" &&!this.destroyFlag){
				this.showFlag = 0;
				this.menuContainer.style.opacity = "0";
				if(this.appType == "vod" || this.appType == "tstv") this.tipDiver.style.opacity = "0";
				media.video.setPosition(0,0,1280,680);
			}
		};
		
		//把秒数转换为00:00:00格式
		this.getTimes = function(time){
			iPanel.debug("time="+time);
			var times = time;
			var min = parseInt(times/60);
			var second = 0;
			var hour = 0;
			if(min>0){
				second = times%60;
				second = second.toString().length==1?"0"+second:second;
				hour = parseInt(min/60)%24;
				if(hour>0){
					min = min%60;
					min = min.toString().length==1?"0"+min:min;
					hour = hour.toString().length==1?"0"+hour:hour;
					return hour+":"+min+":"+second;
				}else{
					min = min.toString().length==1?"0"+min:min;
					return "00:"+min+":"+second;
				}
			}else{
				second = times.toString().length==1?"0"+times:times;
				return "00:00:"+second;
			}
		}
		//销毁组件
		this.destroy = function(){
			clearTimeout(this.timer);
			clearTimeout(this.dataTimer);
			clearTimeout(this.hideTimer);
			clearTimeout(this.seekTimer);
			//this.destroyFlag = true;
			document.body.removeChild(this.menuContainer);
			if(this.appType == "vod" || this.appType == "tstv"){
				document.body.removeChild(this.tipDiver);
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
		};
	};
	
	//注册一个对象，将new createMenuComponet() 赋值给注册的对象
	registVideoObj = function(_type){
		var videoObj = new createMenuComponet(_join_menu,_type);
		videoObj.haveData = showMainText;
		videoObj.init();
		return videoObj;
	};
 })();		