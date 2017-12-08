/*
*	封装NGB的规范,播放接口
*/

function PlayObj(){
	this.mpObj = null;
	this.mediaId = 0;
	this.pauseFlag = 0;
	this.mediaUrl = ""
}
/*
* 初始化用于创建播放器
*/
PlayObj.prototype.init = function(){
	this.mpObj = new MediaPlayer();
	this.mediaId = this.mpObj.getPlayerInstanceID();
	this.debug("-fun:init--this.mediaId="+this.mediaId);
	//this.bindID();
};

/*
* 与mediaPlayer 绑定才能有效
*/
PlayObj.prototype.bindID = function(id){
	var tmpId = typeof id == "undefined"?this.mediaId:id;
	this.debug("-fun:bindID--tmpId="+tmpId);
	var flag = this.mpObj.bindPlayerInstance(tmpId);
	this.debug("-fun:bindID--flag="+flag);
};

/*
* 解除绑定，会释放资源，相当于close的操作
*/
PlayObj.prototype.unbindID = function(){
	this.debug("-fun:unbindID--mediaId="+this.mediaId);
	var flag = this.mpObj.unbindPlayerInstance(this.mediaId);
	this.debug("-fun:unbindID--flag="+flag);
};

/*
* 依据参数设置播放模式，
* 0：按setVideoDisplayArea()方法中设定的height、width、left和top属性所指定的位置和大小来显示；
* 1：全屏显示，按全屏高度和宽度显示(默认值)；
* else
*/
PlayObj.prototype.setMode = function(mode){
	this.mode = mode;
	this.mpObj.setVideoDisplayMode(mode);
	this.mpObj.refresh();
};

/*
* 设置视频的位置
*/
PlayObj.prototype.setPosition = function(x,y,w,h){
	this.videoX = x;
	this.videoY = y;
	this.videoW = w;
	this.videoH = h;
	var videoRectangle = new Rectangle();
	videoRectangle.left= x;
	videoRectangle.top= y;
	videoRectangle.width = w;
	videoRectangle.height= h;
	this.mpObj.setVideoDisplayArea(videoRectangle);
	this.mpObj.refresh();
};

/*
* 设置播放路径,异步方法，设置待播放媒体的URL地址。设置此参数后，中间件自动检测设置的mediaURL的合法性。
* 若URL合法，则向页面发送MSG_MEDIA_URL_VALID消息；	value: 13001
* 若URL不合法，则向页面发送MSG_MEDIA_URL_INVALID消息。value: 13002
* 页面只有接收到MSG_MEDIA_URL_VALID消息后，才可以调用play()方法进行播放。
*/
PlayObj.prototype.setSource = function(url,s_flag){
	this.mediaUrl = url;
	this.debug("-fun:setSource---url="+url);
	if(typeof s_flag == "undefined"){
		var flag =this.mpObj.setMediaSource(url);
	}else{
		var flag =this.mpObj.setMediaSource(url,flag);	
	}
	this.debug("-fun:setSource---flag="+flag);
};

/*
* 设置播放路径,异步方法，从媒体起始点开始播放，对电视广播以实时方式开始播放。
* 若播放成功，则向页面发送MSG_MEDIA_PLAY_SUCCESS消息；value: 13003
* 若播放失败，则向页面发送MSG_MEDIA_PLAY_FAILED消息。value: 13004
*/
PlayObj.prototype.play = function(flag){//参数0表示在后台播放，不传或者1表示前台播放
	this.debug("--play---flag:"+flag);
	this.debug("--play--instance_id::"+this.mpObj.getPlayerInstanceID());
	if(typeof flag == "undefined") this.mpObj.play();
	else this.mpObj.play(flag);
	this.debug("-fun:play---in play--end");
};

/*
* 暂停播放视频，默认保持最后一帧
* flag:0,	黑屏
* flag:1,	保持最后一帧 
*/
PlayObj.prototype.pause = function(flag){
	var flag = typeof flag == "undefined"?1:flag;
	this.debug("-fun:pause----flag="+flag);
	this.mpObj.enableTrickMode(1);
	this.mpObj.setPauseMode(flag);
	this.mpObj.pause();
};

/*
* 停止播放视频,默认保持最后一帧
* flag:0,	黑屏
* flag:1,	保持最后一帧 
*/
PlayObj.prototype.stop = function(flag){
	var flag = typeof flag == "undefined"?1:flag;
	this.debug("-fun:stop----flag="+flag);
	this.debug("-fun:stop--this.mediaId="+this.mediaId);
	this.mpObj.setPauseMode(flag);
	this.mpObj.stop();
};

/*
*释放资源，等同于unBindID
*/
PlayObj.prototype.close = function(){
	this.unbindID();
};

/*
*暂停后，还原到播放状态
*/
PlayObj.prototype.resume = function(){
	this.debug("-fun:resume---");
	this.mpObj.resume();
};

PlayObj.prototype.duration = function(){
	this.debug("-fun:duration---this.mediaId="+this.mediaId);
	return this.mpObj.getMediaDuration();
};

PlayObj.prototype.elapsed = function(){
	this.debug("-fun:elapsed---this.mediaId="+this.mediaId);
	return this.mpObj.getCurrentPlayTime();	
};

PlayObj.prototype.seek =function(type, time){
	this.debug("-fun:seek---");
	this.debug("-fun:seek---this.mediaId="+this.mediaId);
	this.mpObj.enableTrickMode(1);
	this.mpObj.seek(type, time);	
};

PlayObj.prototype.startTime = function(){
	this.debug("-fun:startTime---");
	return this.mpObj.getTSTVStartTime();
};

PlayObj.prototype.endTime = function(){
	this.debug("-fun:endTime---");
	return this.mpObj.getTSTVEndTime();	
};

PlayObj.prototype.presentTime = function(){
	this.debug("-fun:presentTime---");
	return this.mpObj.getTSTVPresentTime();
};

PlayObj.prototype.debug = function(str){
	//Utility.println("debug::"+str);
	iPanel.debug("debug::"+str);
};

PlayObj.prototype.getPlaybackMode = function(){
	this.debug("-fun:getPlaybackMode---");
	return this.mpObj.getPlaybackMode();	
};

PlayObj.prototype.setPace = function(num){
	this.debug("-fun:getPlaybackMode---");
	this.mpObj.setPace(num);	
};
