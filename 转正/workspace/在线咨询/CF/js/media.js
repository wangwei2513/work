/*
*NGB多实例里面要求切台时用http,播放时用Dvb
* TV对象,将play,stop,close结合起来
*/
var currPlayMode = "http",
	playType = "HTTP",
	currMediaId = 0;
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//判断是否是advance版本
if(isAdvanceFlag){	
	var TV = {
		httpSetposition:function(x,y,w,h){
			if(httpInstance == null) return;
			httpInstance.setPosition(x,y,w,h);
		},
		dvbSetposition:function(x,y,w,h){
			if(dvbInstance == null) return;
			dvbInstance.setPosition(x,y,w,h);
		},
		httpSetSource:function(url, _id){
			if(httpInstance == null) return;
			if(url){ openPlayRate(_id);}//切换片源上报
			iDebug("---dvbSetSource--httpInstance.mediaId::"+httpInstance.mediaId);
			httpInstance.setSource(url);
		},
		dvbSetSource:function(url, _id){
			if(dvbInstance == null) return;
			if(url){ openPlayRate(_id);}//切换片源上报
			iDebug("---dvbSetSource--dvbInstance.mediaId::"+dvbInstance.mediaId);
			dvbInstance.setSource(url);
		},
		httpPlay:function(flag){
			if(httpInstance == null) return;
			iDebug("---dvbPlay--httpPlay.mediaId::"+httpInstance.mediaId);
			if(typeof flag == "undefined") httpInstance.play();	
			else httpInstance.play(flag);	//pp依据需求改的
			//currPlayMode = "http";
			//httpInstanceStopFlag = false;
		},
		dvbPlay:function(flag){
			if(dvbInstance == null) return;
			iDebug("---dvbPlay--dvbInstance.mediaId::"+dvbInstance.mediaId);
			iDebug("---dvbPlay--flag::"+flag);
			if(typeof flag == "undefined"){
				dvbInstance.play();
			}else{
				dvbInstance.play(0);
			}
			//dvbInstanceStopFlag = false;
			//currPlayMode = "dvb";
		},
		stopHttp:function(flag){
			if(httpInstance == null) return;
			if(typeof flag == "undefined"){
				httpInstance.stop();
			}else{
				httpInstance.stop(flag);
			}
			//httpInstanceStopFlag = true;
		},
		stopDvb:function(flag){
			if(dvbInstance == null) return;
			if(typeof flag == "undefined"){
				dvbInstance.stop();
			}else{
				dvbInstance.stop(flag);
			}
			//dvbInstanceStopFlag = true;
		},	
		pauseHttp:function(){
			if(currPlayMode =="http" || bothMediaExistFlag) httpInstance.pause();
			else dvbInstance.pause();
		},
		closeHttp:function(){
			iDebug("--closeHttp--in");
			if(httpInstance == null) return;
			httpInstance.close();	
		},
		closeDvb:function(){
			iDebug("--closeDvb--in");
			if(dvbInstance == null) return;
			dvbInstance.close();
		},
		httpResume:function(){
			if(currPlayMode =="http" || bothMediaExistFlag) httpInstance.resume();
			else dvbInstance.resume();
		},
		httpDuration:function(){
			iDebug("httpDuration------------currPlayMode="+currPlayMode);
			iDebug("httpInstance.mediaId="+httpInstance.mediaId);
			iDebug("dvbInstance.mediaId="+dvbInstance.mediaId);
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.duration();	
			return dvbInstance.duration();	
		},
		httpElapsed:function(){	//它返回 '000000'这样的一个六位数，要处理下
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.elapsed();
			return dvbInstance.elapsed();
		},
		httpSeek:function(type, time){
			iDebug("currPlayMode="+currPlayMode);
			iDebug("httpInstance.mediaId="+httpInstance.mediaId);
			if(playEndFlag) return;//已经播放结束了，不执行seek
			if(currPlayMode =="http" || bothMediaExistFlag) httpInstance.seek(type, time);	
			else dvbInstance.seek(type, time);	
		},
		tstvStartTime:function(){
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.startTime();
			return dvbInstance.startTime();
		},
		tstvEndTime:function(){
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.endTime();	
			return dvbInstance.endTime();
		},
		tstvPresentTime:function(){
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.presentTime();
			return dvbInstance.presentTime();
		},
		currMode:function(){
			iDebug("currMode__currPlayMode="+currPlayMode);
			if(currPlayMode =="http" || bothMediaExistFlag) return httpInstance.getPlaybackMode();
			return dvbInstance.getPlaybackMode();	
		},
		setSpeed:function(num){
			iDebug("setSpeed__currPlayMode="+currPlayMode);
			if(currPlayMode =="http" || bothMediaExistFlag) httpInstance.setPace(num);
			else dvbInstance.setPace(num);		
		}
	}
}else{
	var TV = {
		httpSetposition:function(x,y,w,h){
			media.video.setPosition(x,y,w,h);
		},
		dvbSetposition:function(x,y,w,h){
			dvbInstance.setPosition(x,y,w,h);
		},
		httpSetSource:function(url, _id){
			if(url){ openPlayRate(_id);}//切换片源上报
			media.AV.open(url,playType);
		},
		dvbSetSource:function(url, _id){
			if(url){ openPlayRate(_id);}//切换片源上报
			if(videoType.isPlay && playChanType == "dvb"){
				DVB.playLiveTV(Math.floor(frequency)*10000,68750,"64-QAM",Math.floor(serviceId));
			}else{
				media.AV.open(url,playType);
			}
		},
		httpPlay:function(flag){
			media.AV.play();	
		},
		dvbPlay:function(flag){
			media.AV.play();	
		},
		stopHttp:function(flag){
			media.AV.stop();
		},
		stopDvb:function(flag){
			media.AV.stop();
		},	
		pauseHttp:function(){
			media.AV.pause();
		},
		closeHttp:function(){
			if(videoType.isPlay && playChanType == "dvb") DVB.stopLiveTV();
			else media.AV.close();
		},
		closeDvb:function(){
			if(videoType.isPlay && playChanType == "dvb") DVB.stopLiveTV();
			else media.AV.close();
		},
		httpResume:function(){
			media.AV.play();
		},
		httpDuration:function(){
			return media.AV.duration;	
		},
		httpElapsed:function(){	//它返回 '000000'这样的一个六位数，要处理下
			return media.AV.elapsed;
		},
		httpSeek:function(type, time){
			if(playEndFlag) return;//已经播放结束了，不执行seek
			media.AV.seek(time);	
		},
		tstvStartTime:function(){
			return media.AV.TSTVStartTime;
		},
		tstvEndTime:function(){
			return media.AV.TSTVEndTime;	
		},
		tstvPresentTime:function(){
			return media.AV.TSTVPresentTime();
		},
		currMode:function(){
			return media.AV.statue();	
		},
		setSpeed:function(num){
			if(num>0) media.AV.forward(num);
			else if(num<0) media.AV.backward(-num);
		}
	}	
}


function newInstance(){
	newHttpInstance();
	//newDvbInstance();
}

function newHttpInstance(){
	iDebug("------newInstance--------------0");
	httpInstance = new PlayObj();
	httpInstance.init();
	httpInstance.bindID();
	httpInstance.setMode(0);
	iDebug("------newInstance--------------1");
}

function newDvbInstance(){	
	iDebug("------newInstance--------------2");
	dvbInstance = new PlayObj();
	dvbInstance.init();
	dvbInstance.bindID();
	dvbInstance.setMode(0);
	iDebug("------newInstance--------------3");
}