var useDNS = 1;//0为使用，1为不使用
var showPicFlag = 1;//是否显示广告图片：0表示播放视频，1表示显示广告图片
var useCompatibleIpanel=true;//第一进入请求列表时出现请求不到的情况，兼容处理,如果为true，需要配置ips中的ip地址
var playstyle = 0;//0为http，1为rtsp
var domain = {
	userlist:"http://access.homed.me/",
	userlogin:"http://access.homed.me/",
	registeruser:"http://access.homed.me/",
	videoGetInfo:"http://slave.homed.me/",
	streamSlave:"http://stream.slave.homed.me:13164/"
};
var ips = {
	userlist:"http://10.177.4.97:11160/",
	userlogin:"http://10.177.4.97:11160/",
	registeruser:"http://10.177.4.97:11160/",
	videoGetInfo:"http://10.177.4.97:13164/",
	streamSlave:"http://10.177.4.97:13164/"
};

var userlist = [domain,ips][useDNS]["userlist"]+"account/user/get_list?deviceno={1}&devicetype={2}&pageidx={3}&pagenum={4}";
var userlogin = [domain,ips][useDNS]["userlogin"]+"account/login?deviceno={1}&devicetype={2}&accounttype={3}&account={4}&accesstoken={5}&";
var registeruser = [domain,ips][useDNS]["registeruser"]+"account/user/register?username={1}&type={2}&accounttype={3}&nickname={4}&iconid=1&pwd={5}&deviceno={6}&devicetype={7}";
var requestUrl = [domain,ips][useDNS]["videoGetInfo"]+"media/video/get_info?accesstoken={1}&videoid={2}";
var videoId = ["100042255","100007944"][useDNS];//点播视频id
var access_token = "";
var device_id = "";
var playUrl = "";
 
 function getCemeraListIndex(num) {
 	if(num) {
 		if(useCompatibleIpanel) {
 			useCompatibleIpanel = false;
 			sessionStorage.setItem("useCompatibleIpanel","0");
 		}
 		return useDNS;
 	}
 	if(useCompatibleIpanel && useDNS == 0) {
 		var cpi = sessionStorage.getItem("useCompatibleIpanel");
 		if(cpi === "0") {
 			useCompatibleIpanel = false;
 		} else {
 			return 1;
 		}
 	}
 	return useDNS;
 }
 
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
	loginCardId = typeof(CAManager)!="undefined" ? CAManager.cardSerialNumber : typeof(CA)!="undefined" ? (CA.serialNumber || CA.card.cardId):["a8-bd-3a-fc-25-f2","a8-bd-3a-fc-25-b5"][useDNS];
	accessToken = getGlobalVar("accessToken");
	iDebug("[checkAccoutLogin]accessToken="+accessToken + ";loginCardId="+loginCardId);
	if(typeof(accessToken)=="undefinded" || accessToken == "" || accessToken == null){
		getUserListInfo();
	}else{
		var tmpCardId = getGlobalVar("loginDeviceNo");
		if(loginCardId && (loginCardId != tmpCardId)){//卡号变化后，也重新登录
			delGlobalVar("loginDeviceNo");
			delGlobalVar("accessToken");
			getUserListInfo();	
		} else {
			loginCallBack(accessToken);
		}
	}	
}

/**获取username(用户号)**/
function getUserListInfo(){
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	accountAjaxObj.url = userlist.replace("{1}",loginCardId).replace("{2}","1").replace("{3}","1").replace("{4}","10");
	iDebug("[getUserListInfo]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		eval("var tpmObj="+responseText);
		//iDebug("[getUserListInfo]responseText="+ responseText);
		if(tpmObj.user_list && tpmObj.user_list.length > 0 && tpmObj.user_list[0].user_id){
			accoutLogin(tpmObj.user_list[0].user_id,1);	
		}else{
			registerUser();	
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();	
}

/**账号注册**/
function registerUser(){
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	accountAjaxObj.url = registeruser.replace("{1}",loginCardId).replace("{2}","2").replace("{3}","1").replace("{4}",loginCardId).replace("{5}",hex_md5("111111")).replace("{6}",loginCardId).replace("{7}","2");
	iDebug("[registerUser]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		//iDebug("[registerUser]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		if(tpmObj.user_id){
			accoutLogin(tpmObj.user_id,1);	
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
	accountAjaxObj.url = userlogin.replace("{1}",loginCardId).replace("{2}","1").replace("{3}",accounttype).replace("{4}",__account).replace("{5}","");
	iDebug("[accoutLogin]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		//iDebug("[accoutLogin]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		accessToken = tpmObj.access_token;
		loginCallBack(accessToken);
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
	access_token = __accessToken;
	device_id = loginCardId;
	if(typeof callBackStr != "undefined"){
		eval(callBackStr+"()");
	}
}

/*******************播放相关代码*********************/
function getVideoInfo() {
	var channelUrl = requestUrl.replace(/\{1}/g, access_token).replace(/\{2}/g, videoId);
	iDebug("getVideoInfo()--channelUrl:"+channelUrl);
    var channelAjax = new AJAX_OBJ(channelUrl,
    function(_xmlResponse, _res) {
       iDebug("[play.js]---getVideoInfo()---html==" + _xmlResponse.responseText);
        var data = _res;
        if (data.ret == 0) {
            playUrl = getPlayUrlByType(data.demand_url, "http://");
       		iDebug("[play.js]---getVideoInfo()---playUrl==" + playUrl);
            if (playUrl) playUrl += "?protocol=http";
            if (playUrl) {
                var play_token = data.play_token;
                if (playUrl.indexOf("?") >= 0) {
                    playUrl += "&playtype=demand&accesstoken=" + access_token + "&programid=" + videoId + "&playtoken=" + (play_token ? play_token: "ABCDEFGHIGK") + "&verifycode=" + device_id+"&auth=no";
                } else {
                    playUrl += "?playtype=demand&accesstoken=" + access_token + "&programid=" + videoId + "&playtoken=" + (play_token ? play_token: "ABCDEFGHIGK") + "&verifycode=" + device_id+"&auth=no";
                }
				if(useDNS == 1){
					playUrl = playUrl.replace(domain.streamSlave,ips.streamSlave);
				}
				//playUrl = "http://192.168.36.154/app/fujiao/heilongjiang/test/test.mp4";//测试地址
                playVedio();
            }
        }
    },
    function(_xmlResponse) {
        iDebug("[index.htm]---getVideoInfo()---onError---")
    });
    channelAjax.requestData()
}

function getPlayUrlByType(_urlArr, _keyWords, _nokeyWords) {
    if (_urlArr.length == 0) return null;
    for (var i = 0; i < _urlArr.length; i++) {
        if (_urlArr[i].indexOf(_keyWords) > -1) {
            if (typeof(_nokeyWords) != "undefined" && _urlArr[i].indexOf(_nokeyWords) > -1) continue;
            if (_urlArr[i].indexOf("rtsp://") > -1) {
                _urlArr[i] += "?qamname=" + (iPanel.eventFrame.area_code ? iPanel.eventFrame.area_code: "123");
                iDebug("-----_urlArr[i]-----" + _urlArr[i])
            } else if (_urlArr[i].indexOf("iad://") > -1) {
                _urlArr[i] += "?qamname=" + (iPanel.eventFrame.area_code ? iPanel.eventFrame.area_code: "123");
                iDebug("-----_urlArr[i]-----" + _urlArr[i])
            }
            return _urlArr[i]
        }
    }
    return null;
}

//Java 中调用 json字符串
//示例: {"type":0,"what":0,"extra":0}
//type 枚举:
//	static final int TYPE_PREPARED = 1;	
//	static final int TYPE_COMPLETE = 2;
//	static final int TYPE_ERROR = 3;
//	static final int TYPE_INFO = 4;
// what, extra 只有error 和 info 有, 具体值参考 https://developer.android.google.cn/reference/android/media/MediaPlayer.html

function getUrlParam(_url, _str) {
	var result = "";
	var URLstr = _url;
	if (URLstr.indexOf("?") > -1) {
		URLstr = URLstr.split("?")[1];
		var tempArr = URLstr.split("&");
		for (var i = 0; i < tempArr.length; i++) {
			var tempStr = tempArr[i].split("=");
			if (tempStr[0] == _str) {
				result = tempStr[1];
				return result
			}
		}
	}
	return result;
}

