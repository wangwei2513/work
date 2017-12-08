/*************************************** 定义播放器-start **********************************************/
var $MP = "";
var mediaID = 0;
var MPlayer = {
		browserType:"",
		getBrowserType:function(){	
			var ua = navigator.userAgent.toLowerCase();
			if(/ipanel/.test(ua)){
				if(/advance/.test(ua))return "advance";//advance
				return "iPanel";//3.0
			}
			return /enrich/.test(ua) ? 'EVM'
				: /wobox/.test(ua) ? 'Inspur'
				: window.ActiveXObject ? 'IE'
				: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
				: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
				: /opr/.test(ua) ? 'Opera'
				: /android/.test(ua) ? 'android'
				: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
				: '';
		},
		init:function(){//初始化播放器
			this.browserType = this.getBrowserType();//初始化浏览器信息
			switch(this.browserType){
				case "iPanel":
					VOD.changeServer("isma_v2", "ip");
					return 0;	
				break;
				case "advance":
					VOD.changeServer("isma_v2", "ip");	
					var flag = 0;
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
				break;
				case "android":return 0;break;
				default:return 0;break;
			}			
		},
		play:function(__url,__type){
			// iDebug("----->>Portal common.js MPlayer->play_url="+__url+",play_type="+__type);
			// if((__url==null || typeof __url=="undefined") &&__type==null){
				switch(this.browserType){
					case "iPanel":media.AV.play();break;
					case "advance":$MP.play();$MP.enableTrickMode(1);break;
					case "android":break;
					case "Inspur":iSTB.player.play(__url);break;
					default:break;
				}
			// }else if(__url == "" || __url == null || typeof __url == "undefined"){
			// 	iDebug("---->>index.htm->common.js->MPlayer->play url is null, stop it.");
			// }
		},
		setMediaSource:function(__url){
			switch(this.browserType){
				case "iPanel":
					DVB.stopAV();
					media.AV.open(__url, "VOD");
				break;
				case "advance":
					var flag = $MP.setMediaSource(__url);
					iDebug("-fun:setMediaSource---flag="+flag);
				break;
				case "android":break;
				default:break;
			}
		},
		setPosition:function(__x, __y, __w, __h){
			__x=__x||0; 
			__y=__y||0; 
			__w=__w||480; 
			__h=__h||360;
			iDebug("---->>index.htm->common.js->MPlayer->setPosition x="+__x+",y="+__y+",w="+__w+",h="+__h);
			switch(this.browserType){
				case "iPanel":
					media.video.setPosition(__x, __y, __w, __h);//x,y,w,h
				break;
				case "advance":
					var flag0=$MP.setVideoDisplayMode(0);
					iDebug("setPosition()--flag0="+flag0);
					var rec = new Rectangle();
					rec.left  = __x;
					rec.top   = __y;
					rec.width = __w;
					rec.height= __h;
					iDebug("setPosition()--rec="+typeof(rec)); 
					var flag1 = $MP.setVideoDisplayArea(rec);
					iDebug("setPosition()--flag1="+flag1);
					var flag2 = $MP.refresh();
					iDebug("setPosition()--flag2="+flag2);
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.set_video_window(__x,__y,__w,__h);
					break;
				default:break;
			}
		},
		stop:function(__type){
			iDebug("---->>index.htm->common.js->MPlayer->stop type="+__type);
			switch(this.browserType){
				case "iPanel":
					VOD.changeServer("seachange_v2","dvb");
					DVB.stopAV(0);
					media.AV.stop(__type);
					media.AV.close();
				break;
				case "advance":
					VOD.changeServer("seachange_v2","dvb");
					$MP.stop();
					$MP.clearVideoOutput();//清帧
					if(__type == 1)$MP.unbindPlayerInstance($MP.playerInstanceID);	
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.stop();
					break;
				default:break;
			}
		},
		pause:function(){
			iDebug("---->>index.htm->common.js->MPlayer->pause");
			switch(this.browserType){
				case "iPanel":
					media.AV.pause();
				break;
				case "advance":
					$MP.pause();
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.pause();
					break;
				default:break;
			}
		},
		resume:function(){
			iDebug("---->>index.htm->common.js->MPlayer->resume");
			switch(this.browserType){
				case "iPanel":
					media.AV.play();
				break;
				case "advance":
					$MP.resume();
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.resume();
					break;
				default:break;
			}
		},
		setMute:function(){
			iDebug("---->>index.htm->common.js->MPlayer->setMute");
			switch(this.browserType){
				case "iPanel":break;
				case "advance":
					AudioSetting.mute();
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.mute();
					break;
				default:break;
			}
		},
		setUnmute:function(){
			iDebug("---->>index.htm->common.js->MPlayer->setUnmute");
			switch(this.browserType){
				case "iPanel":break;
				case "advance":
					AudioSetting.unMute();
					break;
				case "android":break;
				case "Inspur":
					iSTB.player.unmute();
					break;
				default:break;
			}
		},
		getMuteStatus:function(){
			switch(this.browserType){
				case "iPanel":break;
				case "advance":
					var muteStatus = AudioSetting.isMute();
					iDebug("---->>index.htm->common.js->MPlayer->getMuteStatus isMute="+muteStatus);
					return muteStatus;
					break;
				case "android":break;
				case "Inspur":
					var muteStatus = iSTB.progdata.getmutestatus();
					return muteStatus;
					break;
				default:break;
			}
		},
		setVolume:function(__vol){
			iDebug("---->>index.htm->common.js->MPlayer->setVolume vol="+__vol);
			switch(this.browserType){
				case "iPanel":break;
				case "advance":				
					$MP.setVolume(__vol);
					break;
				case "android":break;
				case "Inspur":
					iSTB.player.set_volume(__vol);
					break;
				default:break;
			}
		},
		getVolume:function(){
			switch(this.browserType){
				case "iPanel":break;
				case "advance":
					var __vol = $MP.getVolume();
					iDebug("---->>index.htm->common.js->MPlayer->getVolume vol="+__vol);
					return __vol;
				break;
				case "android":break;
				case "Inspur":
					var __vol = iSTB.player.get_volume();
					return __vol;
					break;
				default:break;
			}
		},
		getElapsed:function(){
			switch(this.browserType){
				case "iPanel":
					var currTime = media.AV.elapsed;
					iDebug("---->>index.htm->common.js->MPlayer->getElapsed currTime="+currTime);
					return currTime;
					break;
				case "advance":
					var currTime = $MP.getCurrentPlayTime();
					iDebug("---->>index.htm->common.js->MPlayer->getElapsed currTime="+currTime);
					return currTime;
					break;
				case "android":break;
				case "Inspur":
					var currTime = iSTB.player.get_position();
					return currTime;
					break;
				default:break;
			}
		},
		getDuration:function(){
			switch(this.browserType){
				case "iPanel":
					var duration = media.AV.duration;
					iDebug("---->>index.htm->common.js->MPlayer->getDuration duration="+duration);
					return duration;
				break;
				case "advance":
					var duration = $MP.getMediaDuration();
					iDebug("---->>index.htm->common.js->MPlayer->getDuration duration="+duration);
					return duration;
				break;
				case "android":break;
				case "Inspur":
					var duration = iSTB.player.get_duration();
					return duration;
					break;
				default:break;
			}
		},
		seek:function(__sec){
			switch(this.browserType){
				case "iPanel":
					media.AV.seek(__sec);
				break;
				case "advance":
					 var returnValue = $MP.seek(1,__sec);//type:1 相对时间  2：绝对时间
					 iDebug("----->seek()--returnValue="+returnValue);
				break;
				case "android":break;
				case "Inspur":
					iSTB.player.seek(__sec);
					break;
				default:break;
			}
		},
		setEventCallback:function(__eventCallback){}
};
/*************************************** 定义播放器-end ************************************************/