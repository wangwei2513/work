/****登陆homed的方式: 0:mac账号 1:盒子序列号 2:ca卡号****/
var cardSerialNum = 0; 
var isIP = 1;	// 0：ip，1：域名
var accessAddr = ["http://10.71.54.203:12690","http://access.homed.me"][isIP];
var slaveAddr = ["http://10.71.54.203:13160","http://slave.homed.me:13160"][isIP];
var webclientAddr = ["http://10.71.54.203:13160","http://webclient.homed.me"][isIP];
// 播放地址
var prePlayUrl = ["http://10.71.54.203:13164","http://stream.slave.homed.me:13164"][isIP]+"/playurl";

// 播放页面地址
var playAddr = webclientAddr+"/application/newPlay/play.php";

// 获取用户列表
var userlist = accessAddr+"/account/user/get_list?deviceno={1}&devicetype={2}&pageidx={3}&pagenum={4}";
// 登录接口
var userlogin = accessAddr+"/account/login?deviceno={1}&devicetype={2}&accounttype={3}&account={4}&accesstoken={5}";
// 注册接口
var registeruser = accessAddr+"/account/user/register?username={1}&type={2}&accounttype={3}&nickname={4}&iconid=1&pwd={5}&deviceno={6}&devicetype={7}"


// 获取剧集信息接口
var seriesUrl = slaveAddr+"/media/series/get_info?accesstoken={1}&seriesid={2}&pageidx=1&pagenum=200";
// 获取视频详情
var videoDetailUrl = slaveAddr+"/media/video/get_info";


/*
*账号的查询，注册和登录处理
*/
var accountAjaxObj = null;//账户相关操作ajax对象
var loginCardId = "";//账户的ca卡号
var callBackStr = "";//登录成功后的回调
var accessToken = "";
/**判断是否登录过或者ca卡号有变化**/
function checkAccoutLogin(__callBackStr){	
	if(typeof __callBackStr != "undefined") callBackStr = __callBackStr;
	else callBackStr = "";
	loginCardId = getCaNo(); 
	accessToken = getGlobalVar("accessToken");
	if(typeof gotoPortal!="undefined"){
		accessToken = iPanel.eventFrame.access_token?iPanel.eventFrame.access_token:accessToken;
		loginCardId = iPanel.eventFrame.device_id?iPanel.eventFrame.device_id:loginCardId;
	}
	iDebug("[checkAccoutLogin]accessToken="+accessToken + ";loginCardId="+loginCardId);
	if(typeof(accessToken)=="undefinded" || accessToken == "" || accessToken == null){
		getUserListInfo();
	}else{
		var tmpCardId = getGlobalVar("loginDeviceNo");
		if(checkStrNull(loginCardId)!="" && loginCardId != tmpCardId && checkStrNull(tmpCardId)!=""){//卡号变化后，也重新登录
			delGlobalVar("loginDeviceNo");
			delGlobalVar("accessToken");
			getUserListInfo();	
		} else {
			loginCallBack(accessToken);
		}
	}	
}

// devicetype  终端设备类型，取值0：全部；1：机顶盒；2：CA卡；3：手机；4：pad；5：电脑。与deviceid对应。
/**获取username(用户号)**/
function getUserListInfo(){
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	var devicetype = (cardSerialNum==0||cardSerialNum==1)?1:2;
	accountAjaxObj.url = userlist.replace("{1}",loginCardId).replace("{2}",devicetype).replace("{3}","1").replace("{4}","10");
	iDebug("[getUserListInfo]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		// iDebug("[getUserListInfo]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		if(tpmObj.ret == 0){
			if(tpmObj.user_list && tpmObj.user_list.length > 0){
				if(devicetype == 1){
					accoutLogin(tpmObj.user_list[0].user_name);
				}else{
					accoutLogin(tpmObj.user_list[0].user_id,1);	
				}
			}else{
				registerUser();	
			}
		}else{
			registerUser();
			iDebug("[getUserListInfo] ret="+tpmObj.ret+"; msg:"+tpmObj.ret_msg);
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();	
}

// accounttype  表示注册账户类型  1:用户名注册 2：手机号注册 3：邮箱注册。
// account	根据accounttype定  登录账号，与accounttype对应：
// 1）userid，用户id；
// 2）username，用户名；
// 3）telephone，手机号。
/**账号注册**/
function registerUser(){
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	var type = (cardSerialNum==0||cardSerialNum==1)?0:2;
	var accounttype = 1;
	var devicetype = (cardSerialNum==0||cardSerialNum==1)?1:2;
	accountAjaxObj.url = registeruser.replace("{1}",loginCardId).replace("{2}",type).replace("{3}",accounttype).replace("{4}",loginCardId).replace("{5}","111111").replace("{6}",loginCardId).replace("{7}",devicetype);
	iDebug("[registerUser]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		iDebug("[registerUser]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		if(tpmObj.ret == 0){
			if(tpmObj.user_id){
				accoutLogin(tpmObj.user_id,1);	
			}
		}else{
			iDebug("[registerUser] ret="+tpmObj.ret+"; msg:"+tpmObj.ret_msg);
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();
}

/**登录，__type:1 userId登录，其他为username登录**/
function accoutLogin(__account,__type){
	var accounttype = 2;
	if(__type == 1) accounttype = 1;
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}	
	var devicetype = (cardSerialNum==0||cardSerialNum==1)?1:2;
	accountAjaxObj.url = userlogin.replace("{1}",loginCardId).replace("{2}",devicetype).replace("{3}",accounttype).replace("{4}",__account).replace("{5}","");
	iDebug("[accoutLogin]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		// iDebug("[accoutLogin]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		if(tpmObj.ret == 0){
			accessToken = tpmObj.access_token;
			loginCallBack(accessToken);
		}else{
			iDebug("[accoutLogin] ret="+tpmObj.ret+"; msg:"+tpmObj.ret_msg);
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();
}

/**登录成功后的操作**/
function loginCallBack(__accessToken){
	iDebug("[loginCallBack]accessToken="+ __accessToken);
	setGlobalVar("accessToken",__accessToken);
	setGlobalVar("loginDeviceNo",loginCardId);
	if(typeof callBackStr != "undefined"){
		eval(callBackStr+"()");
	}
}

function getCaNo(){
	var navigatorFlag = getBrowserType();
	var cardId = "";
	iDebug("dj+---getCaNo--navigatorFlag="+navigatorFlag);
	if(navigatorFlag == "Inspur"){//浪潮
		cardId = iSTB.settings.get("sys:ca0:cardnumber");
		cardId = cardId.toUpperCase();
	}else if(navigatorFlag == "iPanel" || navigatorFlag == "advance"){
		cardId = [network.ethernets[0].MACAddress,hardware.smartCard.serialNumber,CA.card.cardId][cardSerialNum]; //使用MAC地址登陆
	}else if(navigatorFlag == "android"){
		var json = DRMPlayer.getNetworkInfo();
		// iDebug("dj+---getCaNo--json="+json);
		json = eval(DRMPlayer.getNetworkInfo());
		for(var i=0;i<json.length;i++){
			if(json[i].name == "eth0"){
				cardId = [json[i].mac,"",""][cardSerialNum];
				break;
			}
		}
	}else{//00-28-1a-00-66-06
		cardId = ["28-a5-ee-21-7f-eb","1234567890","8538002343236584"][cardSerialNum];
	}
	return cardId.toLowerCase();
}

/********浏览器类型判断**********/
function getBrowserType(){	
	var ua = navigator.userAgent.toLowerCase();
	//iDebug("--getBrowserType--ua="+ua);
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