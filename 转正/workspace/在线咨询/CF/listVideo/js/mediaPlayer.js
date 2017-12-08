/*
*	��װNGB�Ĺ淶,���Žӿ�
*/

function PlayObj(){
	this.mpObj = null;
	this.mediaId = 0;
	this.pauseFlag = 0;
	this.mediaUrl = ""
}
/*
* ��ʼ�����ڴ���������
*/
PlayObj.prototype.init = function(){
	this.mpObj = new MediaPlayer();
	this.mediaId = this.mpObj.getPlayerInstanceID();
	this.debug("-fun:init--this.mediaId="+this.mediaId);
	//this.bindID();
};

/*
* ��mediaPlayer �󶨲�����Ч
*/
PlayObj.prototype.bindID = function(id){
	var tmpId = typeof id == "undefined"?this.mediaId:id;
	this.debug("-fun:bindID--tmpId="+tmpId);
	var flag = this.mpObj.bindPlayerInstance(tmpId);
	this.debug("-fun:bindID--flag="+flag);
};

/*
* ����󶨣����ͷ���Դ���൱��close�Ĳ���
*/
PlayObj.prototype.unbindID = function(){
	this.debug("-fun:unbindID--mediaId="+this.mediaId);
	var flag = this.mpObj.unbindPlayerInstance(this.mediaId);
	this.debug("-fun:unbindID--flag="+flag);
};

/*
* ���ݲ������ò���ģʽ��
* 0����setVideoDisplayArea()�������趨��height��width��left��top������ָ����λ�úʹ�С����ʾ��
* 1��ȫ����ʾ����ȫ���߶ȺͿ����ʾ(Ĭ��ֵ)��
* else
*/
PlayObj.prototype.setMode = function(mode){
	this.mode = mode;
	this.mpObj.setVideoDisplayMode(mode);
	this.mpObj.refresh();
};

/*
* ������Ƶ��λ��
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
* ���ò���·��,�첽���������ô�����ý���URL��ַ�����ô˲������м���Զ�������õ�mediaURL�ĺϷ��ԡ�
* ��URL�Ϸ�������ҳ�淢��MSG_MEDIA_URL_VALID��Ϣ��	value: 13001
* ��URL���Ϸ�������ҳ�淢��MSG_MEDIA_URL_INVALID��Ϣ��value: 13002
* ҳ��ֻ�н��յ�MSG_MEDIA_URL_VALID��Ϣ�󣬲ſ��Ե���play()�������в��š�
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
* ���ò���·��,�첽��������ý����ʼ�㿪ʼ���ţ��Ե��ӹ㲥��ʵʱ��ʽ��ʼ���š�
* �����ųɹ�������ҳ�淢��MSG_MEDIA_PLAY_SUCCESS��Ϣ��value: 13003
* ������ʧ�ܣ�����ҳ�淢��MSG_MEDIA_PLAY_FAILED��Ϣ��value: 13004
*/
PlayObj.prototype.play = function(flag){//����0��ʾ�ں�̨���ţ���������1��ʾǰ̨����
	this.debug("--play---flag:"+flag);
	this.debug("--play--instance_id::"+this.mpObj.getPlayerInstanceID());
	if(typeof flag == "undefined") this.mpObj.play();
	else this.mpObj.play(flag);
	this.debug("-fun:play---in play--end");
};

/*
* ��ͣ������Ƶ��Ĭ�ϱ������һ֡
* flag:0,	����
* flag:1,	�������һ֡ 
*/
PlayObj.prototype.pause = function(flag){
	var flag = typeof flag == "undefined"?1:flag;
	this.debug("-fun:pause----flag="+flag);
	this.mpObj.enableTrickMode(1);
	this.mpObj.setPauseMode(flag);
	this.mpObj.pause();
};

/*
* ֹͣ������Ƶ,Ĭ�ϱ������һ֡
* flag:0,	����
* flag:1,	�������һ֡ 
*/
PlayObj.prototype.stop = function(flag){
	var flag = typeof flag == "undefined"?1:flag;
	this.debug("-fun:stop----flag="+flag);
	this.debug("-fun:stop--this.mediaId="+this.mediaId);
	this.mpObj.setPauseMode(flag);
	this.mpObj.stop();
};

/*
*�ͷ���Դ����ͬ��unBindID
*/
PlayObj.prototype.close = function(){
	this.unbindID();
};

/*
*��ͣ�󣬻�ԭ������״̬
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
