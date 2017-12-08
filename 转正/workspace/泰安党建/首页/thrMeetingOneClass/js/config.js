/**暂时单独，后期整合时合并**/
/**修改部分**/
var DEBUG = 1;//0 本地假数据 1 请求接口数据
var address = "http://192.168.101.210:8088/PartyMemberEduBackoffice_taian";//后台部署地址
var accessAddress = "http://access.homed.me:12690";//access.homed.me
var slaveAddress = "http://api.slave.homed.me:13160";//slave其他模块域名
var streamAddress = "http://stream.slave.homed.me:13164";//slave推流模块域名
var httpdvbAddress = "http://httpdvb.slave.homed.me:13164";//httpdvb
var loginType = 0;//终端设备类型 登录方式 0 机顶盒(MAC) 1 CA卡 
/**不需修改部分**/
var Api = {
	"queryAreaData":["data/queryAreaData.js",address+"/terminalController/queryAreaData"][DEBUG],//查询系统中所有区域数据
	"login":["data/login.js",address+"/terminalController/loginPlaceMaster?placeMaster={0}"][DEBUG],//会场登陆，可以获取到当前会场的信息
	"queryNotices":["data/queryNotices.js",address+"/terminalController/queryNotices?placeMaster={0}&page={1}&rows={2}"][DEBUG],//查询后台保存的通知
	"queryThemes":["data/queryThemes.js",address+"/terminalController/queryThemes?placeMaster={0}&type={1}&page={2}&rows={3}"][DEBUG],//查询后台保存的议题列表
	"createJoinPlace":["data/createJoinPlace.js",address+"/terminalController/createJoinPlace?joinMeetingName={0}&placeMaster={1}&type={2}&secondAreaIds={3}&themeId={4}"][DEBUG],//发起会议，邀请多个分会场参加并成为主会场
	"createMeeting":["data/createMeeting.js",address+"/terminalController/createMeeting?meetingName={0}&placeMaster={1}&type={2}&identifyValue={3}"][DEBUG],//进入创建直播可录流的会议
	"startRec":["data/startRec.js",address+"/terminalController/startStream?placeMaster={0}&channelId={1}"][DEBUG],//开始录流
	"stopRec":["data/stopRec.js",address+"/terminalController/eventToVideo?placeMaster={0}&channelId={1}"][DEBUG],//结束录流
	"stopMeeting":["data/stopMeeting.js",address+"/terminalController/stopMeeting?placeMaster={0}&channelId={1}"][DEBUG],//结束会议
	"queryMeetings":["data/queryMeetings.js",address+"/terminalController/queryMeetings?placeMaster={0}&type={1}&timeType={2}&isFinished={3}&page={4}&rows={5}"][DEBUG],//查询会议数据
	"querySubMeeting":["data/querySubMeeting.js",address+"/terminalController/queryProcessingMeetingSubPlace?placeMaster={0}&type={1}&secondPlaceMaster={2}"][DEBUG],//上级查询下级正在进行中的会议
	"querySupMeeting":["data/querySupMeeting.js",address+"/terminalController/getParentAreaTypeMeeting?placeMaster={0}&type={1}&parentPlaceMaster={2}"][DEBUG],//下级收看上级正在进行中的会议
	"queryLookBacks":["data/queryLookBacks.js",address+"/terminalController/queryLookBacks?placeMaster={0}&type={1}&timeType={2}&page={3}&rows={4}&isOwnPlace={5}"][DEBUG],//根据会议类型，时间分类，获取会议回看列表
	"userInfo":["data/userInfo.js",accessAddress+"/account/user/get_list?deviceno={0}&devicetype={1}&pageidx=1&pagenum=10"][DEBUG],//获取机顶盒用户列表
	"userLogin":["data/userLogin.js",accessAddress+"/account/login?deviceno={0}&devicetype={1}&accounttype={2}&account={3}&pwd=96e79218965eb72c92a549dd5a330112&accesstoken="][DEBUG],//机顶盒用户登录
	"getPlayToken":["data/getPlayToken.js",slaveAddress+"/media/get_authority_info?accesstoken={0}&programid={1}&playtype=demand&protocol=http&tokentab=0"][DEBUG]//点播获取视频playtoken
};
var browserType = getBrowserType();//获取浏览器类型
var cardNo = getCaNo();//获取设备唯一标识符 与JAVA后台绑定一致
var playUrlSuffix = streamAddress + "/playurl";
var livePlay = httpdvbAddress + "/playurl";
function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? 'iPanel'
		: /enrich/.test(ua) ? 'EVM'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: ''
		;
}
/**可修改部分，跟现场不对的需要修改**/
function getCaNo(){//浪潮和iPanel的获取 其他走默认 现场可根据实际情况修改获取方法
	var cardId = "";
	if(browserType == "Inspur"){
		cardId = ["",iSTB.settings.get("sys:ca0:cardnumber").toUpperCase()][loginType];
	}else if(browserType == "iPanel"){
		cardId = [network.ethernets[0].MACAddress,CA.card.cardId][loginType];
		cardId = cardId.replace(/:/g,"-");
	}else{
		cardId = "00-27-1a-00-63-26";
	}
	iDebug(">>>browserType:"+browserType+"|cardId:"+cardId);//这句不要注释掉
	return cardId;
}