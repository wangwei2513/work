/*************************************** 定义播放器-start **********************************************/
var $MP="";
var mediaID = 0;
var MPlayer = {
		init:function(){//初始化播放器:这样的定义写法不知道有没有错误
			/*if($MP==""||$MP==null) {
				if(typeof(MediaPlayer)!="undefined")
				$MP = new MediaPlayer();
			}
			//mediaID = $MP.getPlayerInstanceID();
			/**通过全局变量获取mediaID，防止连续获取mediaID时，mediaID不断增加问题
			if(typeof(GlobalVarManager)!= "undefined" && GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") == null) {
				mediaID = $MP.getPlayerInstanceID();
				GlobalVarManager.setItemValue("PLAYER_INSTANCE_ID",mediaID);
			}else if(typeof(GlobalVarManager)!= "undefined" && GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") != null) {
				mediaID = GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID");
			} else {
				mediaID = $MP.getPlayerInstanceID();
			}
			var flag = $MP.bindPlayerInstance(mediaID);
			iDebug("---->>index.htm->common.js->MPlayer->init_flag="+flag);
			return flag;*/
			
			var flag=0;
			if($MP==""||$MP==null) {
				if(typeof(MediaPlayer)!="undefined")
				$MP = new MediaPlayer();
			}
			if(typeof(GlobalVarManager)!= "undefined" && (GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") == null || GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") != 0)) {
				mediaID = $MP.getPlayerInstanceID();
				GlobalVarManager.setItemValue("PLAYER_INSTANCE_ID",mediaID);
			}else if(typeof(GlobalVarManager)!= "undefined" && GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") != null && GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID") != 0) {
				mediaID = GlobalVarManager.getItemValue("PLAYER_INSTANCE_ID");
				flag = $MP.bindPlayerInstance(mediaID);
				if(flag == 0){
					mediaID = $MP.getPlayerInstanceID();
					GlobalVarManager.setItemValue("PLAYER_INSTANCE_ID",mediaID);			
				}		
			}else{
				mediaID = $MP.getPlayerInstanceID();
			}
			if(flag==0){
				flag = $MP.bindPlayerInstance(mediaID);
			}
			return flag;
		},
		play:function(__url,__type){
			iDebug("----->>Portal common.js MPlayer->play_url="+__url+",play_type="+__type);
			if((__url==null || typeof __url=="undefined") &&__type==null){
				iDebug("---->>index.htm->common.js->MPlayer->play url=,type=, play it.");
				$MP.play();
				return;
			}else if(__url==""||__url==null || typeof __url=="undefined"){
				iDebug("---->>index.htm->common.js->MPlayer->play url is null, stop it.");
				return;
			}
		   	$MP.setMediaSource(__url);
		},
		setPosition:function(__x, __y, __w, __h){
			__x=__x||0; 
			__y=__y||0; 
			__w=__w||480; 
			__h=__h||360;
			iDebug("---->>index.htm->common.js->MPlayer->setPosition x="+__x+",y="+__y+",w="+__w+",h="+__h);
			
			var flag0=$MP.setVideoDisplayMode(0);
			iDebug("setPosition()--flag0="+flag0);
	        var rec = new Rectangle();
			rec.left=__x;
			rec.top =__y;
			rec.width = __w;
			rec.height=__h;
			iDebug("setPosition()--rec="+typeof(rec)); 
	        var flag1=$MP.setVideoDisplayArea(rec);
			iDebug("setPosition()--flag1="+flag1);
	        var flag2=$MP.refresh();
			iDebug("setPosition()--flag2="+flag2);
		},
		stop:function(__type){
			iDebug("---->>index.htm->common.js->MPlayer->stop type="+__type);
			$MP.stop();
			$MP.clearVideoOutput();//清帧
			if(__type == 1)$MP.unbindPlayerInstance($MP.playerInstanceID);	
		},
		pause:function(){
			try{
				iDebug("---->>index.htm->common.js->MPlayer->pause");
				$MP.pause();
			}catch(E){}
		},
		resume:function(){
			try{
				iDebug("---->>index.htm->common.js->MPlayer->resume");
				$MP.resume();
			}catch(E){}
		},
		setMute:function(){
			try{
				iDebug("---->>index.htm->common.js->MPlayer->setMute");
				AudioSetting.mute();
			}catch(E){}
		},
		setUnmute:function(){
			try{
				iDebug("---->>index.htm->common.js->MPlayer->setUnmute");
				AudioSetting.unMute();
			}catch(E){}
		},
		getMuteStatus:function(){
			try{
				var muteStatus = AudioSetting.isMute();
				iDebug("---->>index.htm->common.js->MPlayer->getMuteStatus isMute="+muteStatus);
				return muteStatus;
			}catch(E){}
		},
		setVolume:function(__vol){
			try{
				iDebug("---->>index.htm->common.js->MPlayer->setVolume vol="+__vol);
				$MP.setVolume(__vol);
			}catch(E){}
		},
		getVolume:function(){
			try{
				var __vol = $MP.getVolume();
				iDebug("---->>index.htm->common.js->MPlayer->getVolume vol="+__vol);
				return __vol;
			}catch(E){}
		},
		getElapsed:function(){
			try{
				var currTime = $MP.getCurrentPlayTime();
				iDebug("---->>index.htm->common.js->MPlayer->getElapsed currTime="+currTime);
				return currTime;
			}catch(E){}
		},
		getDuration:function(){
			try{
				var duration = $MP.getMediaDuration();
				iDebug("---->>index.htm->common.js->MPlayer->getDuration duration="+duration);
				return duration;
			}catch(E){}
		},
		seek:function(__sec){
			 var returnValue=$MP.seek(1,__sec);//type:1 相对时间  2：绝对时间
			 iDebug("----->seek()--returnValue="+returnValue);
		},
		setEventCallback:function(__eventCallback){
			
		}
};
/*************************************** 定义播放器-end ************************************************/