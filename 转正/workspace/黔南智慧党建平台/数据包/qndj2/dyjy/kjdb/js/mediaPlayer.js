/*
*	��װ���صĹ淶,���Žӿ�
*/

function PlayObj(){
	this.browserType = "";
	this.mpObj = null;
	this.mediaId = 0;
	this.pauseFlag = 0;
	this.mediaUrl = "";
}
/*
* ��ʼ�����ڴ���������
*/
PlayObj.prototype.init = function(){
	this.browserType = this.getBrowserType();//��ȡ���������
	switch(this.browserType){
		case "advance":
			this.mpObj = new MediaPlayer();
			this.mediaId = this.mpObj.getPlayerInstanceID();
			this.debug("-fun:init--this.mediaId="+this.mediaId);
			VOD.changeServer("isma_v2", "ip");
		break;
		case "iPanel":
			VOD.changeServer("isma_v2", "ip");
		break;
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
	}
	return /enrich/.test(ua) ? 'EVM'
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
* ��mediaPlayer �󶨲�����Ч
*/
PlayObj.prototype.bindID = function(id){
	switch(this.browserType){
		case "advance":
			var tmpId = typeof id == "undefined"?this.mediaId:id;
			this.debug("-fun:bindID--tmpId="+tmpId);
			var flag = this.mpObj.bindPlayerInstance(tmpId);
			this.debug("-fun:bindID--flag="+flag);
		break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;	
	}
};

/*
* ����󶨣����ͷ���Դ���൱��close�Ĳ���
*/
PlayObj.prototype.unbindID = function(){
	switch(this.browserType){
		case "advance":
			this.debug("-fun:unbindID--mediaId="+this.mediaId);
			var flag = this.mpObj.unbindPlayerInstance(this.mediaId);
			this.debug("-fun:unbindID--flag="+flag);
		break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
* ���ݲ������ò���ģʽ��
* 0����setVideoDisplayArea()�������趨��height��width��left��top������ָ����λ�úʹ�С����ʾ��
* 1��ȫ����ʾ����ȫ���߶ȺͿ����ʾ(Ĭ��ֵ)��
* else
*/
PlayObj.prototype.setMode = function(mode){
	switch(this.browserType){
		case "advance":
			this.mode = mode;
			this.mpObj.setVideoDisplayMode(mode);
			this.mpObj.refresh();
		break;
		case "iPanel":break;
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
* ������Ƶ��λ��
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
		case "iPanel":
			media.video.setPosition(x,y,w,h);//x,y,w,h
		break;
		case "android":
			this.debug("====android====setPosition");
			DRMPlayer.setDisplay('{"x":'+x+', "y":'+y+', "w":'+w+', "h":'+h+'}');//����
		break;
		case "Inspur":
			iSTB.player.set_video_window(x,y,w,h);
		break;
		default:break;
	}
};

/*
* ���ò���·��,�첽���������ô�����ý���URL��ַ�����ô˲������м���Զ�������õ�mediaURL�ĺϷ��ԡ�
* ��URL�Ϸ�������ҳ�淢��MSG_MEDIA_URL_VALID��Ϣ��	value: 13001
* ��URL���Ϸ�������ҳ�淢��MSG_MEDIA_URL_INVALID��Ϣ��value: 13002
* ҳ��ֻ�н��յ�MSG_MEDIA_URL_VALID��Ϣ�󣬲ſ��Ե���play()�������в��š�
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
		case "iPanel":
			DVB.stopAV();
			media.AV.open(url, "VOD");
		break;
		case "android":
			//����ǰ��������ӿ�, ��һ��������೤ʱ������ݲſ�ʼ����, �ڶ�������������ݲ���, �ٴλ�����Ҫ����೤ʱ�������. ��λ���Ǻ���
			DRMPlayer.setPlayerBuffer(1500,1500);
			var mediaUrl = '{"url":"'+url+'","type":"hls","protected":false, "skeEnabled":false, "accountId":"","crmId":"","sessionId":"","ticket":"","cookie":"","isStartOver":false,"laUrl":""}';
			DRMPlayer.open(mediaUrl);
		break;
		case "Inspur":
			iSTB.player.play(url);
		break;		
		default:break;
	}
};

/*
* ipanel��������ò���·��,�첽��������ý����ʼ�㿪ʼ���ţ��Ե��ӹ㲥��ʵʱ��ʽ��ʼ���š�
* �����ųɹ�������ҳ�淢��MSG_MEDIA_PLAY_SUCCESS��Ϣ��value: 13003
* ������ʧ�ܣ�����ҳ�淢��MSG_MEDIA_PLAY_FAILED��Ϣ��value: 13004
*/
PlayObj.prototype.play = function(flag){//����0��ʾ�ں�̨���ţ���������1��ʾǰ̨����
	switch(this.browserType){
		case "advance":
			this.debug("--play---flag:"+flag);
			this.debug("--play--instance_id::"+this.mpObj.getPlayerInstanceID());
			if(typeof flag == "undefined") this.mpObj.play();
			else this.mpObj.play(flag);
			this.debug("-fun:play---in play--end");
		break;
		case "iPanel":
			media.AV.play();
		break;
		case "Inspur":
		break;
		case "android":break;
	}
};

/*
* ��ͣ������Ƶ��Ĭ�ϱ������һ֡
* flag:0,	����
* flag:1,	�������һ֡ 
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
		case "iPanel":
			media.AV.pause();
		break;
		case "android":
			DRMPlayer.pause();
		break;
		case "Inspur":
			iSTB.player.pause();
		break;
		default:break;
	}
};

/*
* ֹͣ������Ƶ,Ĭ�ϱ������һ֡
* flag:0,	����
* flag:1,	�������һ֡ 
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
		default:break;
	}
};


/*
*�ͷ���Դ����ͬ��unBindID
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
		case "android":break;
		case "Inspur":break;
		default:break;
	}
};

/*
*��ͣ�󣬻�ԭ������״̬
*/
PlayObj.prototype.resume = function(){
	this.debug("-fun:resume---");
	switch(this.browserType){
		case "advance":
			this.mpObj.resume();
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
		default:break;
	}
};

PlayObj.prototype.duration = function(){
	this.debug("-fun:duration---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":
			return this.mpObj.getMediaDuration();
		break;
		case "iPanel":break;
		case "android":
			this.debug("-fun:duration---DRMPlayer.getDuration()="+DRMPlayer.getDuration(),2);
			return DRMPlayer.getDuration()/1000;
		break;
		case "Inspur":
			return iSTB.player.get_duration();
		break;
		default:break;
	}
};

PlayObj.prototype.elapsed = function(){
	this.debug("-fun:elapsed---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":break;
			return this.mpObj.getCurrentPlayTime();	
		case "iPanel":
			return  media.AV.duration;
		break;
		case "android":
			this.debug("-fun:elapsed---DRMPlayer.getPosition()="+DRMPlayer.getPosition(),2);
			return Math.floor(DRMPlayer.getPosition()/1000);
		break;
		case "Inspur":
			return iSTB.player.get_position();
		break;
		default: break;
	}
};

PlayObj.prototype.seek =function(type, time){
	this.debug("-fun:seek---");
	this.debug("-fun:seek---this.mediaId="+this.mediaId);
	switch(this.browserType){
		case "advance":
			this.mpObj.enableTrickMode(1);
			this.mpObj.seek(type, time);	
		break;
		case "iPanel":break;
		case "android":
			this.debug("-fun:seek---type="+type+",time="+time,2);
			DRMPlayer.seekTo(time*1000);//����
		break;
		case "Inspur":
			iSTB.player.seek(time);
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
	switch(this.browserType){
		case "advance":
		case "iPanel":
			iPanel.debug("debug::"+str);
		break;
		case "android":
			DRMPlayer.log(str);
			break;
		case "Chrome":
			console.log("debug::"+str);
		break;
		case "Inspur":break;
		default:break;
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
