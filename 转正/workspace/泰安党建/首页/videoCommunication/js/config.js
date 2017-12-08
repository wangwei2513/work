var isGet = 0;//1:使用本地数据,0:获取数据
var debug = 0;//0:浏览器测试地址,1:机顶盒测试地址
var debugMode = 0;//打印方式 ==》0:使用内置方法打印 1:使用页面div进行打印
var address = ["http://192.168.101.210:8088","http://10.191.85.207:9090"][debug];//泰安
var navigatorFlag = getBrowserType();//获取浏览器类型:后期根据类型做播放兼容pc和浪潮
var wsUrl = ["ws://10.191.85.207:9090/PartyMemberEduBackoffice_taian/websocket?placeMaster="+getCaNo(),"ws://10.191.85.207:9090/PartyMemberEduBackoffice_taian/sockjs/websocket?placeMaster="+getCaNo()][0];
//var address=["http://192.168.101.36:8080"][debug];//公司测试

var rootPath=["http://192.168.1.205:96","http://10.191.85.205:96","C:/Users/liuw/Desktop/Desktop"][debug];
var requestUrl=rootPath+"/guangdiandangjian/data/guangdiandangjian";


/***************************java后台数据接口******************************/
/*********获取所存的所有地区数据***********/
var areaQueryUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryAreaData","../testData/queryArea.js"][isGet];//登录组织数据

/***********获取当前ca卡号下的地区信息:包括上一级和本地信息**********/
var queryLoginPlaceUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/loginPlaceMaster?placeMaster={0}","../testData/queryLoginPlace.js"][isGet];

/*********会场类型:主会场,分会场************/
var typeQueryUrl=[address+"/PartyMemberEduBackoffice_taian/meetingplaceController/queryIsMainMeetingPlace?stbUser={0}","../testData/queryType.js"][isGet];

/********创建会议接口:自动成为主会场************/
var creatMeetingURL = [address+"/PartyMemberEduBackoffice_taian/terminalController/createJoinPlace?joinMeetingName={0}&placeMaster={1}&type={2}","../testData/creatMeeting.js"][isGet];

/*********创建分会场接口:添加多个分会场到后台*************/
var creatSubMeetingPlaceUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/createJoinPlace?joinMeetingName={0}&placeMaster={1}&type={2}&secondAreaIds={3}&themeId={4}","../testData/createJoinPlace.js"][isGet];

var joinMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/joinTheMeeting?placeMaster={0}&identifyValue={1}","../testData/joinMeeting.js"][isGet];

/*******不录流，只是直播******/
var noRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/createMeeting?meetingName={0}&placeMaster={1}&type={2}&identifyValue={3}","../testData/noRecordVideo.js"][isGet];

/*******录流,直播接口******/
var playNoRecordUrl = [address+"/PartyMemberEduBackoffice_taian/meetingController/createNewMeeting?subject={0}&stbUser={1}&type={2}&identifyValue={3}","../testData/playNoRecord.js"][isGet];

/******开始会议录流接口******/
var startRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/startStream?placeMaster={0}&channelId={1}","../testData/startRecordVideo.js"][isGet];

/*****结束录流*****/
var endRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/stopMeeting?channelId={0}&placeMaster={1}","../testData/endRecord.js"][isGet];//结束录流，转为点播地址
var endRecordVideoUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/eventToVideo?placeMaster={0}&channelId={1}","../testData/endRecord.js"][isGet];//结束录流，转为点播地址

/**************查询一个会场正在进行的会议*****************/
var queryProcessingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingMCSC?placeMaster={0}&type={1}&identifyValue={2}","../testData/meetingPlaceInfo.js"][isGet];//查询正在进行的会议:获取会场:主会场和分会场

/**************查询当前绑定ca下属区域的正在进行的全部会议****************/
var queryProcessingSubMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingSubPlace?placeMaster={0}&type={1}","../testData/queryProcessingSubMeeting.js"][isGet];

/*******通过卡号查询点播视频*********/
var queryEndUrl_0 = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryPlaceFinishedMeeting?placeMaster={0}&type={1}","../testData/videoList0.js"][isGet];//获取远程培训、视频会议下的所有回看视频列表

/*******通过areaId查询点播视频********/
var queryEndUrl_1 = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryAreaFinishedMeeting?placeMaster={0}&areaId={1}&type={2}","../testData/videoList1.js"][isGet];//视频回看:这个获取三会一课的回看数据
/*************查询历史会议***************/
var historyUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryLookBacks?placeMaster={0}&timeType={1}&type=0&page=1&rows=100",""][isGet];
/*************查询最近会议***************/
var LatestMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryLatestMeeting?placeMaster={0}&type={1}",""][isGet];
/*************查询正在进行中的会议***************/
var MeetingDetailUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingMCSR?placeMaster={0}&type={1}&identifyValue={2}",""][isGet];
/*************获取主题***************/
var queryThemesUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryThemes?placeMaster={0}&type={1}&page=1&rows=1",""][isGet];

/************************homed接口****************************/
//var cardNo = "00-27-1a-00-fd-77";
//var cardNo = "00-27-1a-00-69-96";
var loginType = 0;				//0 盒子mac地址 1 ca卡号
var cardNo = getCaNo();//CA卡号:暂时写死:00-27-1a-00-6b-6c  00-27-1a-00-67-d3   8538002343236584"8538002125006924"getCaNo()
var userPwd = "96e79218965eb72c92a549dd5a330112";//111111原密码md5加密后的字符串
var userName="zz"+(cardNo==""?getCaNo():cardNo);//用户名:泰安

//var userName="zz"+(cardNo==""?getCaNo():cardNo.split("-").join(""));


var homedDebug = 2;//0:本机浏览器测试地址，1:机顶盒端测试地址 2:公司测试地址
var homedAccessSuffix = ["http://192.168.1.204:12690","http://10.191.85.204:12690","http://access.homed.me"][homedDebug];
var homedSlaveSuffix = ["http://192.168.1.204:13160","http://10.191.85.204:13160","http://slave.homed.me"][homedDebug];
var homedDtvSuffix = ["http://192.168.1.202.12890","http://10.191.85.202:12890","http://dtv.homed.me"][homedDebug];
var playUrlSuffix = ["http://192.168.1.204:13164/playurl","http://10.191.85.204:13164/playurl","http://httpdvb.slave.homed.me:13164/playurl"][homedDebug];//直播与点播地址前缀:根据ilogSlave/config/config.js来的//http://httpdvb.slave.homed.me:13160/playurl


var getUseInfo = [homedAccessSuffix+"/account/user/get_list?deviceno={0}&devicetype={1}&iconsize=140x140","../testData/userInfoList.js"][isGet];
var homedLogin = [homedAccessSuffix+"/account/login?deviceno={0}&devicetype={1}&accounttype={2}&account={3}&pwd={4}&accesstoken={5}&isforce=1","../testData/homedLogin.js"][isGet];
var livePlay = homedSlaveSuffix+"/monitor/channel/get_info?accesstoken={0}&chnlid={1}";//根据频道id获取直播视频
var backWacth = [homedSlaveSuffix+"/media/video/get_info?accesstoken={0}&videoid={1}&verifycode={2}","../testData/video.js"][isGet]; //获取当个点播地址
var stopRecord = homedDtvSuffix+"/media/record/stop?accesstoken={0}&chnlid={1}";//测试时候使用，结束录流  //http://192.168.1.202.12890/media/record/stop?accesstoken={0}&chnlid={1}

function getCaNo(){
	var cardId = "";
	if(navigatorFlag == "Inspur"){
		cardId = iSTB.settings.get("sys:ca0:cardnumber");
		cardId = cardId.toUpperCase();
	}else if(navigatorFlag == "iPanel"){
		cardId = [network.ethernets[0].MACAddress,CA.card.cardId][loginType];
		cardId = cardId.replace(/:/g,"-");
	}else{
		cardId = "8538002343434353";
	}
	return cardId;
}

function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? "iPanel":/enrich/.test(ua) ? "EVM": /wobox/.test(ua) ? "Inspur": window.ActiveXObject ? "IE": document.getBoxObjectFor || /firefox/.test(ua) ? "FireFox": window.openDatabase && !/chrome/.test(ua) ? "Safari": /opr/.test(ua) ? "Opera": window.MessageEvent && !document.getBoxObjectFor ? "Chrome":"";
}

function add(eleId,msg){
	$(eleId).innerHTML = msg+"</br>";
}


