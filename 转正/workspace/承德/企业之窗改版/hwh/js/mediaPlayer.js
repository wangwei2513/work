﻿/*
*	封装播控的规范,播放接口
*/

function PlayObj(){
	this.browserType = "";
	this.mpObj = null;
	this.mediaId = 0;
	this.pauseFlag = 0;
	this.mediaUrl = "";
}
/*
* 初始化用于创建播放器
*/
PlayObj.prototype.init = function(){
	this.browserType = this.getBrowserType();//获取浏览器类型
	switch(this.browserType){
		case "advance":
			this.mpObj = new MediaPlayer();
			this.mediaId = this.mpObj.getPlayerInstanceID();
			this.debug("-fun:init--this.mediaId="+this.mediaId);
		break;
		case "iPanel":
			VOD.changeServer("isma_v2", "ip");
		break;
		case "coship":
			this.mpObj = new MediaPlayer();
			this.mediaId = this.mpObj.etNativePlayerInstanceId();
			this.debug("-fun:init coship--this.mediaId="+this.mediaId);
			break;
		case "suma":break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
	
};

PlayObj.prototype.getBrowserType = function(){
	var ua = navigator.userAgent.toLowerCase();
	iDebug("mediaPlayer--getBrowserType--ua="+ua);
	if(/ipanel/.test(ua)){
		if(/advance/.test(ua))return "advance";//advance
		return "iPanel";//3.0
	}else if(typeof rocmeSTB != "undefined"){//内蒙古数码
		return "suma";
	}
	return /enrich/.test(ua) ? 'EVM'
		: /coship/.test(ua) ? 'coship'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		:/android/.test(ua)?'android'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: '';
}

/*
* 与mediaPlayer 绑定才能有效
*/
PlayObj.prototype.bindID = function(id){
	switch(this.browserType){
		case "advance":
			var tmpId = typeof id == "undefined"?this.mediaId:id;
			this.debug("-fun:bindID--tmpId="+tmpId);
			var flag = this.mpObj.bindPlayerInstance(tmpId);
			this.debug("-fun:bindID--flag="+flag);
			break;
		case "coship"://0表示绑定成功，-1表示绑定失败
			var tmpId = typeof id == "undefined"?this.mediaId:id;
			this.debug("-fun:bindID coship--tmpId="+tmpId);
			var flag = this.mpObj.bindNativePlayerInstance(tmpId);
			this.debug("-fun:bindID coship--flag="+flag);
			break;
		case "suma":break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;	
	}
};

/*
* 解除绑定，会释放资源，相当于close的操作
*/
PlayObj.prototype.unbindID = function(id){
	switch(this.browserType){
		case "advance":
			var tmpId = typeof id == "undefined"?this.mediaId:id;
			this.debug("-fun:unbindID--tmpId="+tmpId);
			var flag = this.mpObj.unbindPlayerInstance(tmpId);
			this.debug("-fun:unbindID--flag="+flag);
			break;
		case "coship"://0表示释放成功，-1表示释放失败
			var tmpId = typeof id == "undefined"?this.mediaId:id;
			this.debug("-fun:unbindID coship--tmpId="+tmpId);
			var flag = this.mpObj.releaseMediaPlayer(tmpId);
			this.debug("-fun:unbindID coship--flag="+flag);
			break;
		case "suma":break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
* 依据参数设置播放模式，
* 0：按setVideoDisplayArea()方法中设定的height、width、left和top属性所指定的位置和大小来显示；
* 1：全屏显示，按全屏高度和宽度显示(默认值)；
* else
*/
PlayObj.prototype.setMode = function(mode){
	switch(this.browserType){
		case "advance":
			this.mode = mode;
			this.mpObj.setVideoDisplayMode(mode);
			this.mpObj.refresh();
			break;
		case "coship":
			this.mode = mode;
			this.mpObj.setVideoDisplayMode(mode);
			break;
		case "suma":break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
* 设置视频的位置
*/
PlayObj.prototype.setPosition = function(x,y,w,h){
	switch(this.browserType){
		case "advance":
			this.videoX = x;
			this.videoY = y;
			this.videoW = w;
			this.videoH = h;
			videoRectangle = new Rectangle();
			videoRectangle.left= x;
			videoRectangle.top= y;
			videoRectangle.width = w;
			videoRectangle.height= h;
			this.mpObj.setVideoDisplayArea(videoRectangle);
			this.debug("====refresh====");
			this.mpObj.refresh();
			break;
		case "suma":
			this.debug("====rocmeSTB====setPosition");
			rocmeSTB.player.setVideoWindow(x,y,w,h);
			break;
		case "iPanel":
			media.video.setPosition(x,y,w,h);//x,y,w,h
			break;
		case "android":
			this.debug("====android====setPosition");
			DRMPlayer.setDisplay('{"x":'+x+', "y":'+y+', "w":'+w+', "h":'+h+'}');//像素
			break;
		case "Inspur":
			iSTB.player.set_video_window(x,y,w,h);
			break;
		case "coship":
			this.mpObj.setMatchMethod(2);//设置视频输出自适应方式
			this.mpObj.setVideoDisplayArea(x,y,w,h);
			this.mpObj.refreshVideoDisplay();//调整视频的显示，与setVideoDisplayMode或setVideoDisplayArea一起使用
			this.mpObj.setCurrentAudioChannel("Stereo"); //设置声道立体声
			break;
		default:break;
	}
};

/*
* 设置播放路径,异步方法，设置待播放媒体的URL地址。设置此参数后，中间件自动检测设置的mediaURL的合法性。
* 若URL合法，则向页面发送MSG_MEDIA_URL_VALID消息；	value: 13001
* 若URL不合法，则向页面发送MSG_MEDIA_URL_INVALID消息。value: 13002
* 页面只有接收到MSG_MEDIA_URL_VALID消息后，才可以调用play()方法进行播放。
*/
PlayObj.prototype.setSource = function(url,s_flag){
	switch(this.browserType){
		case "advance":
			this.mediaUrl = url;
			this.debug("-fun:setSource---url="+url);
			if(typeof s_flag == "undefined"){
				var flag =this.mpObj.setMediaSource(url);
			}else{
				var flag =this.mpObj.setMediaSource(url,flag);	
			}
			this.debug("-fun:setSource---flag="+flag);
			break;
		case "suma":
			// 0表示成功，其他为错误码
			var flag = rocmeSTB.player.play(url);
			this.debug("rocmeSTB:setSource---flag="+flag);
			break;
		case "iPanel":
			DVB.stopAV();
			media.AV.open(url, "VOD");
			break;
		case "android":
			//播放前调用这个接口, 第一个代表缓冲多长时间的数据才开始播放, 第二个代表如果数据不足, 再次缓冲需要缓冲多长时间的数据. 单位都是毫秒
			DRMPlayer.setPlayerBuffer(1500,1500);
			var mediaUrl = '{"url":"'+url+'","type":"hls","protected":false, "skeEnabled":false, "accountId":"","crmId":"","sessionId":"","ticket":"","cookie":"","isStartOver":false,"laUrl":""}';
			DRMPlayer.open(mediaUrl);
			break;
		case "Inspur":
			iSTB.player.play(url);
			break;
		case "coship":
			this.mpObj.setSingleMedia(url);
			break;
		default:break;
	}
};

/*
* ipanel浏览器设置播放路径,异步方法，从媒体起始点开始播放，对电视广播以实时方式开始播放。
* 若播放成功，则向页面发送MSG_MEDIA_PLAY_SUCCESS消息；value: 13003
* 若播放失败，则向页面发送MSG_MEDIA_PLAY_FAILED消息。value: 13004
*/
PlayObj.prototype.play = function(flag){//参数0表示在后台播放，不传或者1表示前台播放
	switch(this.browserType){
		case "advance":
			this.debug("--play---flag:"+flag);
			this.debug("--play--instance_id::"+this.mpObj.getPlayerInstanceID());
			if(typeof flag == "undefined") this.mpObj.play();
			else this.mpObj.play(flag);
			// this.debug("-fun:play---in play--end");
			break;
		case "suma":
			break;
		case "iPanel":
			media.AV.play();
			break;
		case "Inspur":break;
		case "coship"://成功返回0，否则返回其它
			var flag = this.mpObj.playFromStart();//从媒体起始点开始播放
			this.debug("coship:play---in play--flag="+flag);
			break;
		case "android":break;
	}
};

/*
* 暂停播放视频，默认保持最后一帧
* flag:0,	黑屏
* flag:1,	保持最后一帧 
*/
PlayObj.prototype.pause = function(flag){
	switch(this.browserType){
		case "advance":
			var flag = typeof flag == "undefined"?1:flag;
			this.debug("-fun:pause----flag="+flag);
			this.mpObj.enableTrickMode(1);
			this.mpObj.setPauseMode(flag);
			this.mpObj.pause();
			break;
		case "suma":
			rocmeSTB.player.pause();
			break;
		case "iPanel":
			media.AV.pause();
			break;
		case "android":
			DRMPlayer.pause();
			break;
		case "Inspur":
			iSTB.player.pause();
			break;
		case "coship":
			this.debug("-fun:pause--coship--flag="+flag);
			this.mpObj.setStopMode(flag);
			this.mpObj.pause();
			break;
		default:break;
	}
};

/*
* 停止播放视频,默认保持最后一帧
* flag:0,	黑屏
* flag:1,	保持最后一帧 
*/
PlayObj.prototype.stop = function(flag){
	switch(this.browserType){
		case "advance":
			var flag = typeof flag == "undefined"?1:flag;
			this.debug("-fun:stop----flag="+flag);
			this.debug("-fun:stop--this.mediaId="+this.mediaId);
			this.mpObj.setPauseMode(flag);
			this.mpObj.stop();
			break;
		case "suma":
			rocmeSTB.player.stop();
			break;
		case "iPanel":
			DVB.stopAV(0);
			media.AV.stop(flag);
			media.AV.close();
			break;
		case "android":
			DRMPlayer.close();
			break;
		case "Inspur":
			iSTB.player.stop();
			break;
		case "coship":
			this.debug("-fun:stop--coship--flag="+flag);
			this.mpObj.setStopMode(flag);
			this.mpObj.stop();//停止正在播放的媒体，并释放机顶盒本地播放器的相关资源
			break;
		default:break;
	}
};


/*
*释放资源，等同于unBindID
*/
PlayObj.prototype.close = function(){
	switch(this.browserType){
		case "advance":
			VOD.changeServer("seachange_v2","dvb");
			this.unbindID();
			break;
		case "iPanel":
			VOD.changeServer("seachange_v2","dvb");
			break;
		case "coship":
			this.unbindID();
			break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
*暂停后，还原到播放状态
*/
PlayObj.prototype.resume = function(){
	this.debug("-fun:resume---");
	switch(this.browserType){
		case "advance":
			this.mpObj.resume();
			break;
		case "suma":
			rocmeSTB.player.resume();
			break;
		case "iPanel":
			media.AV.play();
			break;
		case "android":
			DRMPlayer.resume();
			break;
		case "Inspur":
			iSTB.player.resume();
			break;
		case "coship":
			this.mpObj.resume();
			break;
		default:break;
	}
};

PlayObj.prototype.duration = function(){
	this.debug("-fun:duration---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":
			return this.mpObj.getMediaDuration();
			break;
		case "suma":
			return rocmeSTB.player.getDuration();
			break;
		case "iPanel":break;
		case "android":
			this.debug("-fun:duration---DRMPlayer.getDuration()="+DRMPlayer.getDuration(),2);
			return DRMPlayer.getDuration()/1000;
			break;
		case "Inspur":
			return iSTB.player.get_duration();
			break;
		case "coship":
			return this.mpObj.getMediaDuration();//获取当前播放的媒体的总时长，单位：秒
			break;
		default:break;
	}
};

PlayObj.prototype.elapsed = function(){
	// this.debug("-fun:elapsed---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":
			this.debug("-fun:elapsed--getCurrentPlayTime="+this.mpObj.getCurrentPlayTime());
			return this.mpObj.getCurrentPlayTime();	
			break;
		case "suma":
			this.debug("-fun:rocmeSTB--elapsed="+rocmeSTB.player.getPosition());
			return rocmeSTB.player.getPosition();
			break;
		case "iPanel":
			return media.AV.duration;
			break;
		case "android":
			this.debug("-fun:elapsed---DRMPlayer.getPosition()="+DRMPlayer.getPosition(),2);
			return Math.ceil(DRMPlayer.getPosition()/1000);
			break;
		case "Inspur":
			return iSTB.player.get_position();
			break;
		case "coship":
			return this.mpObj.getCurrentPlayTime();//获取媒体播放到的当前时间点，单位：秒
			break;
		default: 
			return 0;
			break;
	}
};

PlayObj.prototype.seek =function(type, time){
	this.debug("-fun:seek---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":
			this.mpObj.enableTrickMode(1);
			this.mpObj.seek(type, time);	
			break;
		case "suma":
			rocmeSTB.player.seek(time);
			break;
		case "iPanel":break;
		case "android":
			this.debug("-fun:seek---type="+type+",time="+time,2);
			DRMPlayer.seekTo(time*1000);//毫秒
			break;
		case "Inspur":
			iSTB.player.seek(time);
			break;
		case "coship":
			this.mpObj.playByTime(type,time);//1：Normal Play Time；2：Absolute Time
			break;
		default:break;
	}
};

PlayObj.prototype.startTime = function(){
	this.debug("-fun:startTime---");
	switch(this.browserType){
		case "advance":
			return this.mpObj.getTSTVStartTime();
		break;
		case "iPanel":break;
		case "android":break;
		default:break;
	}
};

PlayObj.prototype.endTime = function(){
	this.debug("-fun:endTime---");
	switch(this.browserType){
		case "advance":
			return this.mpObj.getTSTVEndTime();	
		break;
		case "iPanel":break;
		case "android":break;
		default:break;
	}
};

PlayObj.prototype.presentTime = function(){
	this.debug("-fun:presentTime---");
	switch(this.browserType){
		case "advance":
			return this.mpObj.getTSTVPresentTime();
		break;
		case "iPanel":break;
		case "android":break;
		default:break;
	}
};

PlayObj.prototype.debug = function(str){
	if(configFlag == true && $("logDebug")){
		$("logTxt").innerHTML += str+"</br>";	
		$("logDebug").style.visibility = "visible";
	}else{
		switch(this.browserType){
			case "advance":
			case "iPanel":
				iPanel.debug(str);
				break;
			case "suma":
				rocmeSTB.event.debug(str);
				break;
			case "android":
				DRMPlayer.log(str);
				break;
			case "Chrome":
				console.log(str);
				break;
			case "coship":
				Utility.println("JSPrint", "0x3FFFFFFF", str)
				break;
			case "Inspur":break;
			default:break;
		}
	}
};

PlayObj.prototype.getPlaybackMode = function(){
	this.debug("-fun:getPlaybackMode---");
	switch(this.browserType){
		case "advance":
			return this.mpObj.getPlaybackMode();	
		break;
		case "iPanel":break;
		case "android":break;
		default:break;
	}
};

PlayObj.prototype.setPace = function(num){
	this.debug("-fun:getPlaybackMode---");
	switch(this.browserType){
		case "advance":
			return this.mpObj.setPace(num);	
		break;
		case "iPanel":break;
		case "android":break;
		default:break;
	}
};
