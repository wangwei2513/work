/*var soundFlag = 1;	//Ĭ��0��֧�֣� 1����֧����Ч
if (navigator.appName.indexOf("iPanel")!=-1){
	soundFlag = 0;
	//iPanel.eventFrame.exitUrl = "http://192.168.60.88:8080/chrome_App/index.htm";
}*/
var soundFlag = navigator.appName.indexOf("iPanel") != -1?0:1; //Ĭ��0��֧�֣� 1����֧����Ч
if(navigator.appName.indexOf("iPanel") != -1){
	if(iPanel.misc.getGlobal("baseSoundVar")!=""){	
		var soundVar = iPanel.misc.getGlobal("baseSoundVar").split(",");
		soundFlag = typeof soundVar[0]=="undefined"?1: parseInt(soundVar[0]);
		soundFlag = soundFlag==0?1:0;//ϵͳ������0�ǹرգ����˴�1�ǹرգ�
	}
} 
var audioMixerServer = "";
var ipasServer = "http://access.homed.me/getIaps?da=";
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//�ж��Ƿ���advance�汾
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var isChromeFlag = navigator.userAgent.toLowerCase().indexOf("chrome")>=0?true:false;
var returnFalseFlag = false;			//�¼���ֹ
var returnTrueFlag = true;				//�¼�������һ��
if(navigatorFlag == "iPanel"){
 	returnFalseFlag = isAdvanceFlag?false:0;
	returnTrueFlag = isAdvanceFlag?true:1;	
}
/*****************����Ч�ϳɡ�����*******************/
/*if(typeof(iPanel.eventFrame.globalvarObj)=="undefined"){
	iPanel.eventFrame.globalvarObj = {};
}
//����ר��
iPanel.eventFrame.inputUrl = {
	textarea:"/global_chrome/input/input1.0/input1.0.htm",//�������뷨
	input:"/global_chrome/input/input1.0/input1.1.htm",//�������뷨
	number:"/global_chrome/input/inputNum/inputNum.htm",//�������뷨
	psw:"/global_chrome/input/inputNum/inputNum.htm?1",//�������뷨
	counter:"/global_chrome/input/inputCounter/inputCounter.htm",//���������뷨
	date:"/global_chrome/input/date/date.htm"//�������뷨
}

//����ר��
iPanel.eventFrame.b_inputUrl = {
	textarea:"/global_chrome/b_input/inputText/input.htm?1",//�������뷨
	input:"/global_chrome/b_input/inputText/input.htm?0",//�������뷨
	number:"/global_chrome/b_input/inputNum/input2.htm",//�������뷨
	psw:"/global_chrome/b_input/inputNum/input2.htm?1",//�������뷨
	counter:"/global_chrome/b_input/inputNum/input1.htm",//���������뷨
	date:"/global_chrome/input/date/date.htm"//�������뷨
}*/



/***************** ��ɫ *******************/
var roleParam = {//
	initDivId:"roleDiv", //��ɫԪ�������DIV
	spacing:160, //��ɫ���
	txtColor:"#000000",//�ı���ɫ
	info:[
		 {roleid:"00000101",name:"����",pic:"fc_picHead0_1.png"}
		,{roleid:"00000102",name:"�ְ�",pic:"fc_picHead0_2.png"}
		,{roleid:"00000103",name:"����",pic:"fc_picHead0_3.png"}
	]
}

/*****************ȫ�ֱ���*******************/
//var keyReturnFlag = returnFalseFlag; //0 return false    1 return true;	//*****Ĭ�ϵľ��ǽ�ֹ��Ҫ����һ�㣬�����ֵ���1������menu��
var iPanelKeyFlag = 0; //==1���ΰ��� 
var ___menuBtnNums = 0;
var ___menuTime = 0;
var iframeStatus = "";		//���ڲ鿴��ǰiframe�������ĸ�iframe

//****************************ϵͳ��Ϣ�¼�����*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	var keyReturnFlag = false;		//���ݷ���ֵ���ж�Ҫ��Ҫ������һ��
	var keycode = event.which;
	var p2 = event.modifiers;			//p2ֵ����Щ��Ϣ���ܻᴫ����p2ֵ����p2ֵ����doOtherKey
	keyReturnFlag = doOtherKey(keycode, p2);
	return keyReturnFlag;
}

var eventMatch={
	1:"up",
	38:"up",
	2:"down",
	40:"down",
	3:"left",
	37:"left",
	4:"right",
	39:"right",
	13:"enter",
	340:"back",
	8:"back",
	4097:"menu",
	512:"menu",
	36:"menu",
	513:"menu",
	4192:"menu"
};

/*
*@fun  doBasicKey: �����¼��������ϣ��£����ң��˳������أ�menu����ȷʵ���İ�����Ϣ��keyReturnFlag�Ǹ���doBasicKey�ķ���ֵ�������ģ�������Ĭ��ֵΪ0������Ϊ��ֹ��Ϣ��
*
*@fun  doOtherKey:��չ�¼�  ��Ҫ��ϵͳ������Щ��Ϣ��keyReturnFlag�Ǹ���doOtherKey�ķ���ֵ�������ģ�������Ĭ��ֵΪ1������Ϊ����Ϣ������һ����
*/
//****************************��ͨ������Ϣ�¼�����*****************************
//document.onkeypress = grabEvent;
//document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;		//�þ������Ϊ������google�ı��֣����˴˾��
function grabEvent(event){
	//iDebug("iframeStatus ="+iframeStatus+"--code ="+event.which+" iPanelKeyFlag===="+iPanelKeyFlag+" =====iframeStatus:"+iframeStatus);
	if(iPanelKeyFlag == 1) return false;	//������ĳ�����ʱ����Ҫ���¼���ֹ�����磬�ڻ��������У��������¼��������ڴ���widget
	var keyReturnFlag = returnFalseFlag;		//���ݷ���ֵ���ж�Ҫ��Ҫ������һ��
	if(iframeStatus != ""){
		var keycode = event.which;
		var p2 = event.modifiers;	
		keyReturnFlag = window.frames[iframeStatus].doBasicKey(eventMatch[keycode], p2);
	}else{
		var keycode = event.which;
		var p2 = event.modifiers;			//p2ֵ����Щ��Ϣ���ܻᴫ����p2ֵ����p2ֵ����doOtherKey
		if(keycode < 58 && keycode > 47){//���ּ�
			//numeric(keycode-48);
			keyReturnFlag = numeric(keycode-48);
		}else{
			switch(keycode){
				case 1://up
				case 38:
					if(iPanelKeyFlag == 1) return false;
					keyReturnFlag = doBasicKey("up",p2);
					break;
				case 2://down
				case 40:
//					add(iPanelKeyFlag+" =====iframeStatus:"+iframeStatus);
					if(iPanelKeyFlag == 1) return false;
					keyReturnFlag = doBasicKey("down",p2);
					break;
				case 3://left
				case 37:
					if(iPanelKeyFlag == 1) return false;
					keyReturnFlag = doBasicKey("left",p2);
					break;
				case 4://right
				case 39:
					if(iPanelKeyFlag == 1) return false;
					keyReturnFlag = doBasicKey("right",p2);
					//iDebug("right---keyReturnFlag="+keyReturnFlag);
					break;
				case 13://enter
					
					if(iPanelKeyFlag == 1) return false;
					keyReturnFlag = doBasicKey("enter",p2);
					//iDebug("enter---keyReturnFlag="+keyReturnFlag);
					break;
				case 340://����
				case 8:
					keyReturnFlag = doBasicKey("back",p2);
					break;
				case 513://�˵�
				case 4097:
				case 17:
					keyReturnFlag = doBasicKey("menu");
					break;
				case 512://��ҳ
				case 306:
				case 36:
					
					//keyReturnFlag = doBasicKey("menu");
					//keyReturnFlag = doBasicKey("portal");
					closeAllSound();
					if(typeof gotoPortal != "undefined"){
						gotoPortal(iPanel.eventFrame.webUiUrl,true);
					}else{
						window.location.href = iPanel.eventFrame.webUiUrl;
					}
				break;
				case 595://����+
					keyReturnFlag = doBasicKey("volUp");
					break;
				case 596://����-
					keyReturnFlag = doBasicKey("volDown");
					break;
				default:
					keyReturnFlag = doOtherKey(keycode, p2);
					break;
			}
		}
	}
	return keyReturnFlag;
}

//DOM����---��ʼ----// add by zhoujh
function $(element) {
	var element = document.getElementById(element);
    return extend(element,domMethod);
}
var domMethod = {//DOM��չ����
	css:function(_opation){
		if(typeof(_opation)=="string"){
			return this.style[_opation];
		}else{
			extend(this.style,_opation);
		}
	},
	bg:function(_opation){
		if(/^#.+/.test(_opation)){//����ɫ
			this.style.backgroundColor = _opation;	
		}else{//����ͼƬ
			this.style.backgroundImage = "url("+_opation+")";	
		}
	}
}
function extend(destination, source){//��չ����
	for (var property in source){
		destination[property] = source[property];
	}
	return destination;	
}
//DOM����---����----//

var uiInputUrl = {
	textarea:"/global_chrome/googleInput/input/input1.0.htm",//�������뷨
	input:"/global_chrome/googleInput/input/input1.1.htm",//�������뷨
	inputandnumber:"/global_chrome/googleInput/input/input1.2.htm",//���д����������ַ����뷨
	number:"/global_chrome/googleInput/inputNum/inputNum.htm?inputStatus=0",//�������뷨
	psw:"/global_chrome/googleInput/inputNum/inputNum.htm?inputStatus=1",//�������뷨
	counter:"/global_chrome/googleInput/inputCounter/inputCounter.htm",//���������뷨
	date:"/global_chrome/googleInput/date/date.htm",//�������뷨
	ipNum:"/global_chrome/googleInput/inputNum/inputIPNum.htm"		// IP�����뷨
}

function iTimeInput(__input,__str,__length,__window,_position,_dict){
iPanel.debug("__length==="+__length + "__str===" +__input);
	var tempUrl = "";
	/*if(!_position){
		_position = {top:200,left:400};
	}*/
	if(__input == "psw" || __input == "number"){  //��������ֻ�������
		if(__str != "" && __length != ""){
			tempUrl = uiInputUrl[__input]+"&_str="+__str+"&len="+__length+"&top="+_position.top+"&left="+_position.left;
		}else if(__str != "" && __length == ""){
			tempUrl = uiInputUrl[__input]+"&_str="+__str+"&top="+_position.top+"&left="+_position.left;
		}else if(__str == "" && __length != ""){
			tempUrl = uiInputUrl[__input]+"&len="+__length+"&top="+_position.top+"&left="+_position.left;
//			add("tempUrl="+tempUrl);
		}else{
			tempUrl = uiInputUrl[__input]+"&top="+_position.top+"&left="+_position.left;
//			add("tempUrl="+tempUrl);
		}
	}else if(__input == "date" || __input == "ipNum"){  //���� �� IP
		if(__str != ""){
			tempUrl = uiInputUrl[__input]+"?_str="+__str+"&top="+_position.top+"&left="+_position.left;	
//			add("tempUrl="+tempUrl);
		}else{
			tempUrl = uiInputUrl[__input]+"?top="+_position.top+"&left="+_position.left;
		}
	}else if( typeof __str!= "undefined" && __str != ""){ //�Ƿ��д��ݵ��ַ�
		if(typeof _dict!="undefined" && _dict != ""){
			tempUrl = uiInputUrl[__input]+"?_str="+__str+"&_dict="+_dict;	
		}else{
			tempUrl = uiInputUrl[__input]+"?_str="+__str;
//			add("else....tempUrl="+tempUrl+";__str="+__str);		
		}
	}else{
		if(typeof _dict !="undefined" && _dict != ""){  //�ֿ��Ƿ����ֿ�
			tempUrl = uiInputUrl[__input]+"?_dict="+_dict;	
		}else{
			tempUrl = uiInputUrl[__input];		
		}
//		add("else....tempUrl="+tempUrl);
	}
			
	
	ifr_obj = new popInput({
			url:tempUrl, 
			left:0, 
			top:0, 
			width:1280, 
			height:720, 
			callBack:function(){
	//			window.frames["__ifr"].focus();
				iframeStatus = "__ifr";
			}
	});
	ifr_obj.create();
	setTimeout(function(){
		ifr_obj.show();
	}, 500);
}


/*
*����һ��iframe������@huangjm 2012.11.20
*/
function popInput(args){
	this.left = parseInt(args.left)||0;
	this.top = parseInt(args.top)||0;
	this.width = parseInt(args.width)||1280;
	this.height = parseInt(args.height)||720;
	this.id = args.id ||"__ifr";
	this.url = args.url||"";
	this.callBack =args.callBack||function(){};
	this.div = null;
	this.showFLag = false;
	
	this.create=function(){
		this.createDiv();
	};
	
	//��ʾdiv
	this.show = function(args){
		this.div.style.visibility = "visible";
		this.showFLag =true;
	};
	//����div
	this.minimize = function(){
		this.div.style.visibility = "hidden";	
		this.showFLag = false;
		document.body.removeChild(this.div);
	};
	//����iframe��div����
	this.createDiv = function(){
		this.div = document.createElement("div");
		this.div.style.position = "absolute";
		this.div.style.left = this.left+"px";
		this.div.style.top = this.top+"px";
		this.div.style.width = this.width+"px";
		this.div.style.height = this.height+"px";
		this.div.style.visibility = "hidden";
		this.div.style.zIndex = "101";
		document.body.appendChild(this.div);
		this.createIframe();
	};
	
	//����iframe
	this.createIframe = function(){
		var obj = document.createElement("iframe");
		obj.style.left = "0px";
		obj.style.top = "0px";
		obj.width = "100%";
		obj.height ="100%";
		obj.scrolling = "no";
		obj.frameborder = "0";
		
		obj.id = this.id;
		obj.name = this.id;
		obj.src = this.url;
		//document.body.appendChild(obj);
		this.div.appendChild(obj);
		if (obj.addEventListener){	//������ iframe�ļ���
			obj.addEventListener("load", this.callBack, false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("onload", this.callBack);
		}else{
			obj.onload = this.callBack;
		}
	};

	//ȡ�õ�ǰ��iframe
	this.getIframeObj = function(){
		return  window.frames[this.id];
	};
	//ȡ�õ�ǰ����iframe��div
	this.getContainer = function(){
		return this.div;
	};
}

/*****************��Ч����**********************/
var basicAudio = { /*������Ч*/
	basicPath:"publicAudio/basicAudio/",  //����·��
	move:"pub_0001.wav",//�ƶ�
	enter:"pub_0002.wav",//ȷ��
	pageGo:"pub_0003.wav", //ͬ��ҳ��ת��
	pageOpen:"pub_0004.wav", //�¼�ҳ�浯��
	keyboard:"pub_0005.wav",//����ȫ�ּ���
	date:"pub_0006.wav", //��������ģ��
	areakeyboard:"pub_0007.wav", //������̵���
	press:"pub_0008.wav", //���㰴�¶���
	turnList:"pub_0009.wav", //���㶯��-����Ŀ����
	turnPage:"pub_0010.wav",//���㶯��-��ҳ�Ķ�������ʾ
	focusCycle:"pub_0011.wav", //����ѭ��
	moveDiff:"pub_0012.wav", //�����ƶ�����-����ͬ�����ƶ�����
	moveSame:"pub_0013.wav", //�����ƶ�����-��ͬ�����ƶ�����
	areaScale:"pub_0014.wav", //��������
	inforExpand:"pub_0015.wav", //��Ѷչ��
	tipsBox:"pub_0016.wav", //��ʾ�൯������
	actionBox:"pub_0017.wav", //�в�����������
	errorEnd:"pub_0018.wav", //�ƶ������һ�����������ֹ
  	invalid:"20115101115103.wav", //��Ч������
  	success:"20115712175758.wav" //���óɹ�/�޸ĳɹ�/��ʾ�ɹ�/���ͳɹ�
};
//���ӷ�����
function connectServer(){
	//iDebug("[keyEvent1.0.js]---connectServer()---soundFlag="+soundFlag);
	if(soundFlag) return;
	if(typeof(iPanel.eventFrame.currBgSound)!="undefined" && iPanel.eventFrame.currBgSound.length > 0){
		closeAllSound(); //@2011.6.10 ��� Ŀǰ�Ŀ�����connectServerʱ���֮ǰ����Ч�ȶϿ���Ϊ���playBgSound��Ҫ�����±���
	}
	if (navigator.appName.indexOf("iPanel")!=-1){
		//iDebug("[keyEvent1.0.js]---connectServer()---iPanel.eventFrame.audioServer="+iPanel.eventFrame.audioServer);
		var server = iPanel.eventFrame.audioServer.split(":");
		if(server&&server.length>2){
			var serverIp = server[1].substring(2,server[1].length);
			var serverPort = parseInt(server[2].substring(0,server[2].length-1));
			if (navigator.appName.indexOf("iPanel")!=-1){
				iPanel.misc.setAudioMixerServer("UDP",serverIp,serverPort); //���÷�������Ϣ
				iPanel.misc.connectAudioMixerServer(); //���ӷ�����
			}
		}
	}
}
//�Ͽ���Ч�ϳɷ�����
function disconnectServer(){
	if(soundFlag) return;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.disconnectAudioMixerServer();
	}
}
//������Ч
function playSound(_class,_id,_volume, _flag, _time){
	if (navigator.appName.indexOf("iPanel")!=-1){
		//iDebug("[keyEvent1.0.js]---playSound---_class="+_class+",soundFlag="+soundFlag);
	}
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	//iDebug("[keyEvent1.0.js]---typeof(_class)="+typeof(_class));
	if(typeof(_class)=="number"){
		//iDebug("[keyEvent1.0.js]---_id="+_id);
		if(_class>audioArr.length-1||_id>audioArr[_class].list.length-1) return;//20140923@wangzhib��������Խ������
		if (navigator.appName.indexOf("iPanel")!=-1){
			var soundId = iPanel.eventFrame.audioServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
		}
		var times = parseInt(audioArr[_class].list[_id].times);
		if(typeof(_volume)=="undefined"){
			var volume = parseInt(audioArr[_class].list[_id].volume);
		}else{
			volume = parseInt(_volume);
		}
		
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		if (navigator.appName.indexOf("iPanel")!=-1){
			var soundId = iPanel.eventFrame.audioServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
		}
		var times = 1;
		var volume = 100;
	}
	if (navigator.appName.indexOf("iPanel")!=-1){
		//add("=="+soundId+"volume");
		iPanel.misc.openSoundEffect(soundId,times,volume, flag, time);
	}
}

//��ͣ������Ч @huangjm 2011.5.24
function pauseSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.pauseSoundEffect(soundId,flag,time);		//��ͣ������Ч
	}
}

//�ָ�������Ч @huangjm 2011.5.24
function resumeSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
	if (navigator.appName.indexOf("iPanel")!=-1){
	 iPanel.misc.resumeSoundEffect(soundId,flag,time);
	}
}

//��ͣȫ����Ч @huangjm 2011.5.24
function pauseAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.pauseAllSoundEffect(flag,time);
	}
}

//�ָ�ȫ����Ч @huangjm 2011.5.24
function resumeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.resumeAllSoundEffect(flag,time);
	}
}

//�ر�ȫ����Ч
function closeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.eventFrame.currBgSound = [];
		iPanel.misc.closeAllSoundEffect(flag, time);	
	}
}
//�ر�ָ����Ч
function closeSound(_class,_id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if(typeof(_class)=="number"){
		if(audioArr[_class].list[_id].name!="undefined"){
			if (navigator.appName.indexOf("iPanel")!=-1){
				var soundId = iPanel.eventFrame.audioServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
			}
		}else{
			return;	
		}
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		if (navigator.appName.indexOf("iPanel")!=-1){
			var soundId = iPanel.eventFrame.audioServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
		}
	}
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.closeSoundEffect(soundId, flag, time);
	}
}

//��ͣ�ͻָ������¼� @huangjm 2011.5.24
function getSoundId(_class, _id){
	var soundId = "";
	if(typeof(_class)=="number"){
		if(audioArr[_class].list[_id].name!="undefined"){
			if (navigator.appName.indexOf("iPanel")!=-1){
				soundId = iPanel.eventFrame.audioServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
			}
		}else{
			return;	
		}
		
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		if (navigator.appName.indexOf("iPanel")!=-1){
			soundId = iPanel.eventFrame.audioServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
		}
	}
	return soundId;
}


/*--------���ű�������
���Զ�ͣ����¼��ȫ�ֱ����еĵ�ǰ������Ч���ٲ����µı�����Ч
*/
function playBgSound(_class,_id){
	if(soundFlag) return;
	//��ͣ����ǰ���ű�������
	var jtUrl = audioArr[_class].list[_id].jtUrl ;		//@huangjm, 2011.23, ���ܳ��ֵ������ͬ����class��id, ���ԼӸ��ļ����ж�
	if(typeof(iPanel.eventFrame.currBgSound)!="undefined"&&iPanel.eventFrame.currBgSound.length!=0){
		var currBgSound = iPanel.eventFrame.currBgSound;
		if(_class==currBgSound[0]&&_id==currBgSound[1] && jtUrl == currBgSound[2]){ //ͬһ������ @huangjm, 2011.23, 
			return;	
		}
			closeSound(currBgSound[0],currBgSound[1]);
		}
	playSound(_class,_id);
	iPanel.eventFrame.currBgSound = [_class,_id, jtUrl];//@huangjm, 2011.23, 
}

/***************************iconLoading********************begin*/
/*
*@_info:{}������Ҫ��iconLoading��Ҫ���λ�ü�ͼƬ����ע�⵱ǰ���ֵ��ֻ����һ����תҳ��������
*set_loadingInfo({pic:"", width:"", height:"", top:"", left:""}), ��Щ�������ǿ�ѡ��
*/
function setLoading(_info){
	var iconWidget = iPanel.pageWidgets.getByName("iconloading");
	iconWidget.set_loadingInfo(_info);	
}

/*
*��iconLoading�û�ԭ����λ�ú�ͼƬ 
*/
function resetLoading(){
	var iconWidget = iPanel.pageWidgets.getByName("iconloading");
	iconWidget.reset_loadingInfo();
}
/***************************iconLoading********************end*/

//��ֹû�м�add��ӡ��ҳ�����
function add(){}

/***************************Ӧ��Ԥ��********************begin*/
/*
@appsPreLoad(args) args�����ǣ�.html,  .js�� .css�� ����ͼƬ��ʽ, Ҳ����������
@�磺appsPreLoad(["main.htm", ".secBg.png"], "data.js", "a.css");
*/
/*function appsPreLoad(){		//@huangjm 2011-6-27
	var _leng = arguments.length;
	var _arr = [];
	var tmpArr = [];
	for(var i = 0; i < _leng; i++){
		if(arguments[i] instanceof Array){
			tmpArr = tmpArr.concat(arguments[i]);
		}else if(typeof arguments[i] == "string" && arguments[i] != ""){
			tmpArr.push(arguments[i]);
		}
		
	}
	for(var i = 0; i < tmpArr.length; i ++){
		_arr.push(0);	//��Ӧ������Ĭ�϶��÷���ס�ڴ棬���Ը���һ��flag Ϊ0
	}
	iPanel.preDownload(tmpArr, _arr);	//Ԥ�صĽӿ�
}*/

/*
* @xiongzm 2011-8-10
* ���õ�·��Ч������
*/
function setVolume(_class, _id, _volume, _flag, _time){
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
	var volume = _volume || getSoundId(_class, _id);
	iPanel.misc.setVolume(soundId,volume,flag,time);
}

/*
* @xiongzm 2011-8-10
* ��ȡ��·��Ч��ǰ������
*/
function getVolume(_class, _id){
	var soundId = getSoundId(_class, _id);
	return iPanel.misc.getVolume(soundId);
}
//��ֹû�м�add��ӡ��ҳ�����
(function(){
	var div = null
	add = function(str, visible){
		if(div == null){
			createFlag = true;
			div = document.createElement("div");
			div.style.position="absolute";
			div.style.left = "600px";
			div.style.top = "200px";
			div.style.width = "600px";
			div.style.height = "100px";
			div.style.fontSize = "20px";
			div.style.color = "#FF0000";
			div.style.webkitTransitionDuration = "1s";
			div.style.zIndex = "100";
			div.style.backgroundColor = "#CCCCCC";
			div.innerHTML = str;
			document.body.appendChild(div);
		}else{
			div.style.visibility = visible||"visible";
			div.innerHTML = str;
		}
	}
})();
function goBackUrl(){
	closeAllSound();
	var appBackUrl  =  GP.getBackUrl("appBackUrl1")||GP.getBackUrl("appBackUrl");
	//iDebug("[keyEvent1.0.js]---goBackUrl()---appBackUrl="+appBackUrl);
	if(navigatorFlag == "iPanel"){
		if(appBackUrl){
			GP.reset("appBackUrl1");
			gotoPage(appBackUrl);
		}else{
			if(typeof gotoPortal != "undefined"){
				gotoPortal();
			}else{
				iPanel.mainFrame.location.href = iPanel.eventFrame.exitUrl+"?pageShow=ifr_1";
			}
		}
	}else{//��׼�����
		window.location.href = appBackUrl;
	}
}
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str, 2);	
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}
/*
*@author: huangjm 2012.12.24
*@desc:	��Ҫ�ü�ȫ�ֱ�����iPanel����eventFrame���ǣ�webkit�ں���window.localStorage���ǣ�������cookie����
*/
(function(){
	//document.domain = "homed.me";
	var globalPos=function(){
		this.index = "";
		/**************ȡ�õ�ǰ��������汾*******************/
		this.getBrowser=function(){
			var tmp = "";
			var str = navigator.appName;
			if(str.indexOf("iPanel") != -1){
				tmp = "iPanel";
			}else if(str.indexOf("Miscrosoft") != -1){
				tmp = "Miscrosoft";
			}else if(str.indexOf("Google") != -1){
				tmp = "Google";
			}else if(str.indexOf("Netscape")!= -1){
				tmp = "Netscape";
			}else if(str.indexOf("Opera")!=-1){
				tmp="Opera";
			}
			return tmp;
		};
		
		/**************����ȫ�ֱ���*******************/
		this.set = function(){
			var index = arguments[0]+"";
			var value = arguments[1]+"";
			value = value.replace("|", "#0#0#");
			//console.log("----index="+index+"--value="+value)
			this.index = index;
			if(this.getBrowser()=="iPanel"){
				if(typeof iPanel.eventFrame.__globalPos == "undefined"){
					iPanel.eventFrame.__globalPos={};
				}
				iPanel.eventFrame.__globalPos[index] = value;
			}else{
				if(window.localStorage){
					window.localStorage.setItem(index,value);
				}else{
					this.setCookie(index, value);
				}
			}
		};
		
		/**************��ȡȫ�ֱ���*******************/
		this.get = function(){
			var index=arguments[0];
			var str = "";
			var tmp = "";
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					str = iPanel.eventFrame.__globalPos[index];	
					tmp = str;
				}
			}else{
				if(window.localStorage){
					str = window.localStorage.getItem(index);
					if(str) tmp = str;
				}else{
					str= this.getCookie(index);
					if(str.indexOf("|") != -1){
					  tmp = str.replace("#0#0#", "|");
					}
					tmp = str;
				}
			}	
			//var tmp  = decodeURI(str);
			return tmp;
		};
		
		/****************���ñ���*****************/
		this.reset=function(){
			var index=arguments[0];
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					iPanel.eventFrame.__globalPos[index] = "";	
				}
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					storage[index]="";
				}else{
					this.delCookie(index);
				}
			}	
		};
	
		/***********�趨Cookieֵ***************/
		this.setCookie=function(name, value){
			var expdate = new Date();
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : 5*12*30*24*60*60;
			var path = (argc > 3) ? argv[3] : "/";
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
			var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
			document.cookie = name + "=" + escape(value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
			+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
			+((secure == true) ? "; secure" : "");
		};
		
		/**********���Cookie������ֵ**************/
		this.getCookie=function(_name){
			var url = document.cookie;
			if(new RegExp(".*\\b"+_name+"\\b(\\s*=([^&;]+)).*", "gi").test(url)){
				return unescape(RegExp.$2);
			}else{
				return "";
			}
		}
	
		 /**********ɾ��Cookie**************/
		this.delCookie=function(name){
			var exp = new Date();
			exp.setTime (exp.getTime() - 1);
			var cval = this.getCookie(name);
			document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
		}
		this.setBackUrl=function(toUrl,currUrl){
			var startPos = toUrl.lastIndexOf("/")+1;
			var endPos = toUrl.indexOf("?");
			if(endPos<startPos) endPos = toUrl.length;
			this.set(toUrl.substring(startPos,endPos),currUrl);
			//iDebug("setBackUrl()---name="+toUrl.substring(startPos,endPos)+",value="+currUrl);
		}
		this.getBackUrl=function(currUrl){
			if(!currUrl) currUrl = window.location.href;
			var startPos = currUrl.lastIndexOf("/")+1;

			var endPos = currUrl.indexOf("?");
			if(endPos<startPos) endPos = currUrl.length;
			var tmpUrl = this.get(currUrl.substring(startPos,endPos));
			//iDebug("getBackUrl()---name="+currUrl.substring(startPos,endPos)+",backUrl="+tmpUrl);
			return tmpUrl;
		}
	};		
	
	GP = new globalPos();
})();
/*----------------------------------��Ч�������ĵ�ַ��������Ҫ��һ��ʱ��ȥ���£�������һ��widget������ʱ����--------end*/
function requestSoundServer(callback){
    iPanel.debug("------requestSoundServer---in");
    callback = callback||function(){iPanel.debug("---callback--Ĭ�Ͽյ�---");};
    var xmlhttp;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){  
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
		  //iDebug("[keyEvent1.0.js]---requestSoundServer()---xmlhttp.responseText="+xmlhttp.responseText);
            var res = eval('('+xmlhttp.responseText+')');
            if(res.ret=="0"){
				if(typeof res.IP=="undefined" || typeof res.port=="undefined")return;//@pengjiao 2014.12.16 ��Ч�������˿� �͵�ַû������
                iPanel.eventFrame.audioServer =res.IP+":"+res.port+"/";
                callback();
            }else{
            
            }
       }
    }
    var da_id = "";
    if(navigator.appName.indexOf("iPanel") != -1 && typeof iPanel.eventFrame.da_id != "undefined"){
        da_id = iPanel.eventFrame.da_id;
    }else{
        da_id = "50001002";
    }
    xmlhttp.open("GET",ipasServer+da_id,true);
    xmlhttp.send();
}
if(navigator.appName.indexOf("iPanel") != -1){
	if(typeof iPanel.eventFrame.audioServer=="undefined")  requestSoundServer(connectServer);
}