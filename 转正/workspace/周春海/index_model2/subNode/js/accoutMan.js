
/*
*�˺ŵĲ�ѯ��ע��͵�¼����
*/
var accountAjaxObj = null;//�˻���ز���ajax����
var loginCardId = "";//�˻���ca����
var callBackStr = "";//��¼�ɹ���Ļص�
var accessToken = "";
/**�ж��Ƿ��¼������ca�����б仯**/
function checkAccoutLogin(__callBackStr){	
	if(typeof __callBackStr != "undefined") callBackStr = __callBackStr;
	else callBackStr = "";
	loginCardId =  typeof(hardware)!="undefined" ?hardware.STB.serialNumber:"88888888";
	access_token = getGlobalVar("accessToken");
	iDebug("[checkAccoutLogin]access_token="+access_token + ";loginCardId="+loginCardId);
	if(typeof(access_token)=="undefinded" || access_token == "" || access_token == null){
		getUserListInfo();
	}else{
		var tmpCardId = getGlobalVar("loginDeviceNo");
		if(loginCardId && (loginCardId != tmpCardId)){//���ű仯��Ҳ���µ�¼
			delGlobalVar("loginDeviceNo");
			delGlobalVar("accessToken");
			getUserListInfo();	
		} else {
			loginCallBack(access_token);
		}
	}	
}

/**��ȡusername(�û���)**/
function getUserListInfo(){
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	accountAjaxObj.url = userlist.replace("{1}",loginCardId).replace("{2}","2").replace("{3}","1").replace("{4}","10");
	iDebug("[getUserListInfo]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		eval("var tpmObj="+responseText);
		iDebug("[getUserListInfo]responseText="+ responseText);
		if(tpmObj.user_list && tpmObj.user_list.length > 0 && tpmObj.user_list[0].user_name){
			accoutLogin(tpmObj.user_list[0].user_name);	
		}else{
			registerUser();	
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();	
}

/**�˺�ע��**/
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
		iDebug("[registerUser]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		if(tpmObj.user_id){
			accoutLogin(tpmObj.user_id,1);	
		}else if(tpmObj.ret == 9203){//��ʾ�Ѿ�ע����ˣ����û���ȥ��¼��type��2
			accoutLogin(loginCardId,2);	
		}
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();	
}

/**��¼��__type:1 userId��¼������Ϊusername��¼**/
function accoutLogin(__account,__type){
	var accounttype = 2;
	if(__type == 1) accounttype = 1;
	if(accountAjaxObj == null) {
		accountAjaxObj = new ajaxClass();
	} else {
		accountAjaxObj.requestAbort();
	}
	accountAjaxObj.url = userlogin.replace("{1}",loginCardId).replace("{2}","2").replace("{3}",accounttype).replace("{4}",__account).replace("{5}","");
	iDebug("[accoutLogin]url="+ accountAjaxObj.url);
	accountAjaxObj.successCallback = function(xhr) {
		var responseText = xhr.responseText;
		iDebug("[accoutLogin]responseText="+ responseText);
		eval("var tpmObj="+responseText);
		access_token = tpmObj.access_token;
		loginCallBack(access_token);
	};
	accountAjaxObj.failureCallback = function(xhr){
		
	};
	accountAjaxObj.requestData();
}

/**��¼�ɹ���Ĳ���**/
function loginCallBack(__accessToken){
	iDebug("[loginCallBack]access_token="+ __accessToken);
	setGlobalVar("accessToken",__accessToken);
	setGlobalVar("loginDeviceNo",loginCardId);
	if(typeof callBackStr != "undefined"){
		eval(callBackStr+"()");
	}
}