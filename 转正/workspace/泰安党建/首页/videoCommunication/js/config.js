var isGet = 0;//1:ʹ�ñ�������,0:��ȡ����
var debug = 0;//0:��������Ե�ַ,1:�����в��Ե�ַ
var debugMode = 0;//��ӡ��ʽ ==��0:ʹ�����÷�����ӡ 1:ʹ��ҳ��div���д�ӡ
var address = ["http://192.168.101.210:8088","http://10.191.85.207:9090"][debug];//̩��
var navigatorFlag = getBrowserType();//��ȡ���������:���ڸ������������ż���pc���˳�
var wsUrl = ["ws://10.191.85.207:9090/PartyMemberEduBackoffice_taian/websocket?placeMaster="+getCaNo(),"ws://10.191.85.207:9090/PartyMemberEduBackoffice_taian/sockjs/websocket?placeMaster="+getCaNo()][0];
//var address=["http://192.168.101.36:8080"][debug];//��˾����

var rootPath=["http://192.168.1.205:96","http://10.191.85.205:96","C:/Users/liuw/Desktop/Desktop"][debug];
var requestUrl=rootPath+"/guangdiandangjian/data/guangdiandangjian";


/***************************java��̨���ݽӿ�******************************/
/*********��ȡ��������е�������***********/
var areaQueryUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryAreaData","../testData/queryArea.js"][isGet];//��¼��֯����

/***********��ȡ��ǰca�����µĵ�����Ϣ:������һ���ͱ�����Ϣ**********/
var queryLoginPlaceUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/loginPlaceMaster?placeMaster={0}","../testData/queryLoginPlace.js"][isGet];

/*********�᳡����:���᳡,�ֻ᳡************/
var typeQueryUrl=[address+"/PartyMemberEduBackoffice_taian/meetingplaceController/queryIsMainMeetingPlace?stbUser={0}","../testData/queryType.js"][isGet];

/********��������ӿ�:�Զ���Ϊ���᳡************/
var creatMeetingURL = [address+"/PartyMemberEduBackoffice_taian/terminalController/createJoinPlace?joinMeetingName={0}&placeMaster={1}&type={2}","../testData/creatMeeting.js"][isGet];

/*********�����ֻ᳡�ӿ�:��Ӷ���ֻ᳡����̨*************/
var creatSubMeetingPlaceUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/createJoinPlace?joinMeetingName={0}&placeMaster={1}&type={2}&secondAreaIds={3}&themeId={4}","../testData/createJoinPlace.js"][isGet];

var joinMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/joinTheMeeting?placeMaster={0}&identifyValue={1}","../testData/joinMeeting.js"][isGet];

/*******��¼����ֻ��ֱ��******/
var noRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/createMeeting?meetingName={0}&placeMaster={1}&type={2}&identifyValue={3}","../testData/noRecordVideo.js"][isGet];

/*******¼��,ֱ���ӿ�******/
var playNoRecordUrl = [address+"/PartyMemberEduBackoffice_taian/meetingController/createNewMeeting?subject={0}&stbUser={1}&type={2}&identifyValue={3}","../testData/playNoRecord.js"][isGet];

/******��ʼ����¼���ӿ�******/
var startRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/startStream?placeMaster={0}&channelId={1}","../testData/startRecordVideo.js"][isGet];

/*****����¼��*****/
var endRecordUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/stopMeeting?channelId={0}&placeMaster={1}","../testData/endRecord.js"][isGet];//����¼����תΪ�㲥��ַ
var endRecordVideoUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/eventToVideo?placeMaster={0}&channelId={1}","../testData/endRecord.js"][isGet];//����¼����תΪ�㲥��ַ

/**************��ѯһ���᳡���ڽ��еĻ���*****************/
var queryProcessingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingMCSC?placeMaster={0}&type={1}&identifyValue={2}","../testData/meetingPlaceInfo.js"][isGet];//��ѯ���ڽ��еĻ���:��ȡ�᳡:���᳡�ͷֻ᳡

/**************��ѯ��ǰ��ca������������ڽ��е�ȫ������****************/
var queryProcessingSubMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingSubPlace?placeMaster={0}&type={1}","../testData/queryProcessingSubMeeting.js"][isGet];

/*******ͨ�����Ų�ѯ�㲥��Ƶ*********/
var queryEndUrl_0 = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryPlaceFinishedMeeting?placeMaster={0}&type={1}","../testData/videoList0.js"][isGet];//��ȡԶ����ѵ����Ƶ�����µ����лؿ���Ƶ�б�

/*******ͨ��areaId��ѯ�㲥��Ƶ********/
var queryEndUrl_1 = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryAreaFinishedMeeting?placeMaster={0}&areaId={1}&type={2}","../testData/videoList1.js"][isGet];//��Ƶ�ؿ�:�����ȡ����һ�εĻؿ�����
/*************��ѯ��ʷ����***************/
var historyUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryLookBacks?placeMaster={0}&timeType={1}&type=0&page=1&rows=100",""][isGet];
/*************��ѯ�������***************/
var LatestMeetingUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryLatestMeeting?placeMaster={0}&type={1}",""][isGet];
/*************��ѯ���ڽ����еĻ���***************/
var MeetingDetailUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryProcessingMeetingMCSR?placeMaster={0}&type={1}&identifyValue={2}",""][isGet];
/*************��ȡ����***************/
var queryThemesUrl = [address+"/PartyMemberEduBackoffice_taian/terminalController/queryThemes?placeMaster={0}&type={1}&page=1&rows=1",""][isGet];

/************************homed�ӿ�****************************/
//var cardNo = "00-27-1a-00-fd-77";
//var cardNo = "00-27-1a-00-69-96";
var loginType = 0;				//0 ����mac��ַ 1 ca����
var cardNo = getCaNo();//CA����:��ʱд��:00-27-1a-00-6b-6c  00-27-1a-00-67-d3   8538002343236584"8538002125006924"getCaNo()
var userPwd = "96e79218965eb72c92a549dd5a330112";//111111ԭ����md5���ܺ���ַ���
var userName="zz"+(cardNo==""?getCaNo():cardNo);//�û���:̩��

//var userName="zz"+(cardNo==""?getCaNo():cardNo.split("-").join(""));


var homedDebug = 2;//0:������������Ե�ַ��1:�����ж˲��Ե�ַ 2:��˾���Ե�ַ
var homedAccessSuffix = ["http://192.168.1.204:12690","http://10.191.85.204:12690","http://access.homed.me"][homedDebug];
var homedSlaveSuffix = ["http://192.168.1.204:13160","http://10.191.85.204:13160","http://slave.homed.me"][homedDebug];
var homedDtvSuffix = ["http://192.168.1.202.12890","http://10.191.85.202:12890","http://dtv.homed.me"][homedDebug];
var playUrlSuffix = ["http://192.168.1.204:13164/playurl","http://10.191.85.204:13164/playurl","http://httpdvb.slave.homed.me:13164/playurl"][homedDebug];//ֱ����㲥��ַǰ׺:����ilogSlave/config/config.js����//http://httpdvb.slave.homed.me:13160/playurl


var getUseInfo = [homedAccessSuffix+"/account/user/get_list?deviceno={0}&devicetype={1}&iconsize=140x140","../testData/userInfoList.js"][isGet];
var homedLogin = [homedAccessSuffix+"/account/login?deviceno={0}&devicetype={1}&accounttype={2}&account={3}&pwd={4}&accesstoken={5}&isforce=1","../testData/homedLogin.js"][isGet];
var livePlay = homedSlaveSuffix+"/monitor/channel/get_info?accesstoken={0}&chnlid={1}";//����Ƶ��id��ȡֱ����Ƶ
var backWacth = [homedSlaveSuffix+"/media/video/get_info?accesstoken={0}&videoid={1}&verifycode={2}","../testData/video.js"][isGet]; //��ȡ�����㲥��ַ
var stopRecord = homedDtvSuffix+"/media/record/stop?accesstoken={0}&chnlid={1}";//����ʱ��ʹ�ã�����¼��  //http://192.168.1.202.12890/media/record/stop?accesstoken={0}&chnlid={1}

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


