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
		menu_type:0//0,����;��������1:720*576,2:640*526
	};

	var createMenuComponet = function(args,_type){
		this.appType = typeof _type == "undefined"?"vod":_type;//�㲥�ͻؿ�����vod���ͣ�ֱ��ʹ������Ϊplay
		iPanel.debug("createMenuComponet--");
		this.menuContainer = null;        //�����DIV
		this.outDivStyle = args.BG;
		this.line = null;
		this.lineStyle = args.line;
		this.outProcesser = null;		  //���������
		this.outProcessStyle = args.processBg;
		this.processer = null;		      //������
		this.processStyle = args.process;
		if(this.appType == "play"){
			this.chaNamer = null;			  //Ƶ������
			this.chaNameStyle = args.chanName;
			this.chaNumer = null;             //Ƶ����
			this.chaNumStyle = args.chanNum;
			this.pfTime = null;             //Ƶ����
			this.pfTimeStyle = args.pfTime;
			this.currProgramer = null;		  //��ǰ��Ŀ
			this.currProgramStyle = args.currProgram;
			this.nextProgramStyle = args.nextProgram;
			this.chaIconer = null;  
			this.lineStyle.left = "262px";
			this.processStyle.left = this.outProcessStyle.left = "283px";
			this.outProcessStyle.width = "745px";
		}	
		if(this.appType == "vod" || this.appType == "tstv"){
			this.currProgramer = null;		  //��ǰ��Ŀ
			this.currProgramStyle = args.currProgramVod;
			this.playBtner = null;            //��ť
			this.playBtnStyle = args.playBtn;
			this.tipDiver = null;             //ʱ��bar
			this.tipDivStyle = args.tipDiv;
			this.tipDiverLeft = parseInt(args.tipDiv.left);
		}
		this.userName = null;
		this.userStyle = args.userName;
		
		this.lineRight = null;
		this.lineRightStyle = args.lineRight;
		this.ad = null;
		this.adStyle = args.ad;
		
		this.allTimer = null;		      //��ʱ��
		this.allTimeStyle = args.allTime; 
		this.allTimeLeft = parseInt(this.allTimeStyle.left);
		this.currTimer = null;		      //��ǰ��ʱ
		this.currTimeStyle = args.currTime; 
		this.currTimeLeft = parseInt(this.currTimeStyle.left);
		this.dater = null;                //����
		this.dateStyle = args.date;
		this.dateLeft = parseInt(this.dateStyle.left);	
		
		
		this.outDivWebKit = args.outDivWebKit||"100ms";
		this.allTime = 100;               //��ʱ��
		this.currTime = 0;                //��ǰ��ʱ
		this.currCha = args.currCha||0;//��ǰ������
		this.showFlag = 1;				  //Ĭ������ʾ
		this.haveData = function(){};
		this.timer = -1;//��ʱ��
		this.playPauseFlag = 0;//������ͣ����
		this.menu_type = args.menu_type;  //��������
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
		this.multiplier = 1;//������������˵�ʱ��ı���
		this.lastKeyPress = 0;//�ϴεİ��� 0��ʾ�ް���  1��ʾ����  -1��ʾ����
		this.destroyFlag = false;
		this.playFlag = true;
		this.cursorAddress = "http://192.168.36.123/poster/2/hdgdws/20130927/thumbnail_160500/";
		this.cursorHaveFlag = false;

		/*************��ʼ����*********/
		this.init = function(){
			this.createContainer();		//��������
			this.createSubItem();		//��������Ŀ
			this.showContainer();
		};
		
		/*************����container*********/
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
		
		/*************��������Ŀ********/
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
			if(temp >1){//�����Ե���ʾ���
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
			setTimeout(function(){self.menuContainer.style.webkitTransitionDuration = self.outDivWebKit;},100)//2DԪ�ؼ���Ҫ���Ӻ�
		};
		
		/*************������ݵĲ���*********/
		this.initDataInfo = function(){
			iPanel.debug("initDataInfo------------");
			if(this.appType == "play"){
				this.haveData(this.chaNamer, this.currCha, "chaName");//Ϊ��ǰƵ������ֵ	
				this.haveData(this.chaNumer, this.currCha, "chaNum");//Ƶ����
				this.haveData(this.currProgramer, this.currCha, "currProgram");//vod ����,ΪƵ����ʱ��Ϊ��ǰ��Ŀ
				this.haveData(this.pfTime, this.currCha, "pfTime");//��Ŀ�Ŀ�ʼ�ͽ���ʱ��
			}
			//this.haveData(this.chaNumer, this.currCha, "proInfo");//�������
			if(this.appType == "vod" || this.appType == "tstv"){
				this.haveData(this.currProgramer, this.currCha, "chaName");//vod ����,ΪƵ����ʱ��Ϊ��ǰ��Ŀ
			}
			iPanel.debug("111111111111")
			//this.haveData(this.nextProgramer, this.currCha, "nextProgram");//�¸���Ŀ
			
			this.haveData(this.allTimer, this.currCha, "allTime",this.getTimes(this.allTime));//��ʱ��
			iPanel.debug("22222222222222222222222")
		};
		
		this.initUserInfo = function(_name){
			this.haveData(this.userName, this.currCha, "userName",_name);//�¸���Ŀ
		}
		/*************�������ݺ�Ĳ���*********/
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
		
		//��ʾ��ǰ��������
		this.displayDate = function(){
			if(typeof(this.destroyFlag) == "undefined"||this.destroyFlag) return;
			var date = dateSynchro;
			//alert(date.toLocaleString());
			var month = (parseInt(date.getMonth())+1).toString();
			var day = date.getDate().toString();
			var hour = date.getHours().toString();
			var min = date.getMinutes().toString();;
			var str = (hour.length<2?"0"+hour:hour)+":"+(min.length<2?"0"+min:min)+" ��<br>";
			str += (month.length<2?"0"+month:month)+"/"+(day.length<2?"0"+day:day)+"&nbsp;";  
			var arr_week = ["������","����һ","���ڶ�","������","������","������","������"];
			var week = arr_week[date.getDay()];
			str += week;
		
			this.dater.innerHTML = str;
			var self = this;
			this.dataTimer = setTimeout(function(){self.displayDate();},61000);
		}
		
		//�ı������
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
			//this.currTimer.innerHTML = "ʱ��";
			if(this.currTime<0) this.currTime = 0;
			if(this.allTime<1) this.allTime = 1;
			this.processer.style.width = parseInt((this.currTime/this.allTime)*parseInt(this.outProcesser.style.width))+"px";
			if(this.appType == "vod" || this.appType == "tstv"){
				var end = parseInt(this.processer.style.width);
				this.tipDiver.style.left = parseInt(this.tipDiverLeft+end)+"px";
			}
		}
		
		//ģ��������ƶ�
		this.startMove = function(){
			iPanel.debug("startMove__________start")
			clearTimeout(this.timer);
			var self = this;
			this.timer = setTimeout(function(){
				 iPanel.debug("self.destroyFlag=="+self.destroyFlag);
				 if(typeof(self.destroyFlag) != "undefined" && !self.destroyFlag)	self.startMove();
			},1000);			
			if(!this.playFlag){//��δ���ųɹ���ʱ�򣬲��ƶ�������
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
				this.currTime = nowTime - parseInt(this.startTime,10);//��ǰӰƬ����ʱ��
			}
			if(this.currTime>this.allTime){
				this.currTime = this.allTime;
				return;
			}
			this.initProcess();
			iPanel.debug("startMove__________end")
		}
		
		this.getRelativeTime = function(_start,_end){//��ȡʱ���
			//2013-10-15 16:43:00
			var sTime = _start.split(" ")[1];
			var eTime = _end.split(" ")[1];
			var sTimeArr,eTimeArr;
			if(typeof sTime !="undefined"  && typeof eTime !="undefined"){
				sTimeArr = sTime.split(":");
				eTimeArr = eTime.split(":");
				if(typeof eTimeArr !="undefined"  && typeof eTimeArr !="undefined"){
					if(eTimeArr[0]<sTimeArr[0])	eTimeArr[0]+=24;//Ĭ�ϴ�ʱ������
					return (Math.floor(eTimeArr[0])*3600+Math.floor(eTimeArr[1])*60+Math.floor(eTimeArr[2]))-(Math.floor(sTimeArr[0])*3600+Math.floor(sTimeArr[1])*60+Math.floor(sTimeArr[2]));
				}
			}
			return 1;//Ĭ��Ϊ1��
		}
		
		this.getAbsTime = function(_start,_curr,_type){
			//2009/03/25 10:10:10	
			var startSeconds = Date.parse(_start.replace(/-/g,"/"));//ת��Ϊ����;
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
		//������ͣ����
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
				//ÿ��1%
				if(this.lastKeyPress != 0){
					if(this.lastKeyPress == _num){
						this.multiplier = this.multiplier*2;//������ͬһ���������ٶȼӱ�
						if(this.multiplier >8) this.multiplier = 8;
					}else{
						this.multiplier = this.multiplier/2;
						if(this.multiplier < 0.125) this.multiplier = 0.125;
					}	
				}
				this.lastKeyPress = _num;//���䱾�εİ������򣬹��´�ʹ��
				
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
					 if(globalWidget.urlType == 1){//ֻ������Ƶ��ʱ�� ����������ʧ
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
			this.multiplier = 1;//������������˵�ʱ��ı���
			this.lastKeyPress = 0;	
		}
		
		this.showContainer = function(){
			this.showFlag = 1;
			//this.menuContainer.style.opacity = "0.8";
			this.menuContainer.style.opacity = "1";
			if(this.appType == "vod" || this.appType == "tstv") this.tipDiver.style.opacity = "1";	
			var self = this;
			clearTimeout(self.hideTimer);
		     if(globalWidget.urlType == 1){//ֻ������Ƶ��ʱ�� ����������ʧ
			   this.hideTimer = setTimeout(function(){self.backKeyAction()},self.hideTime);
			 }
			
			media.video.setPosition(0,0,1280,625);
		}
		//���ؼ�����
		this.backKeyAction = function(){
			iPanel.debug("this.destroyFlag=="+this.destroyFlag);
			if(this.showFlag &&typeof(this.destroyFlag) != "undefined" &&!this.destroyFlag){
				this.showFlag = 0;
				this.menuContainer.style.opacity = "0";
				if(this.appType == "vod" || this.appType == "tstv") this.tipDiver.style.opacity = "0";
				media.video.setPosition(0,0,1280,680);
			}
		};
		
		//������ת��Ϊ00:00:00��ʽ
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
		//�������
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
		};
	};
	
	//ע��һ�����󣬽�new createMenuComponet() ��ֵ��ע��Ķ���
	registVideoObj = function(_type){
		var videoObj = new createMenuComponet(_join_menu,_type);
		videoObj.haveData = showMainText;
		videoObj.init();
		return videoObj;
	};
 })();		