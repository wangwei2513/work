var soundFlag = navigator.appName.indexOf("iPanel") != -1?0:1; //Ĭ��0��֧�֣� 1����֧����Ч

var uiInputUrl = {
	textarea:"../input2013/input/input1.0.htm",//�������뷨
	input:"../input2013/input/input1.1.htm",//�������뷨
	inputandnumber:"../input2013/input/input1.2.htm",//���д����������ַ����뷨
	inputen:"../input2013/input/input1.3.htm?inputStatus=0",//���д����������ַ����뷨
	inputpsw:"../input2013/input/input1.3.htm?inputStatus=1",//���뵥�д����������ַ����뷨
	number:"../input2013/inputNum/inputNum.htm?inputStatus=0",//�������뷨
	psw:"../input2013/inputNum/inputNum.htm?inputStatus=1",//�������뷨
	date:"../input2013/date/date.htm",//�������뷨
	ipNum:"../input2013/inputNum/inputIPNum.htm"		// IP�����뷨
}

/**
@ _type ���뷨����
@ _str  ���ݵ�����
@ _length �ַ����ȣ�ֻ������֡�IP�����룩
@ _position λ��
*/
function iTimeInput(_type,_str,_length,_position,_dict){
	var __input = "";
	var __str = "";
	var __length = "";
	var __position = "";
	var __dict = "";
	
	if(typeof arguments[0] != "string"){
		__input = arguments[0].type;
		__str = arguments[0].str;
		__length = arguments[0].len;
		if(typeof arguments[0].left != "undefined" && typeof arguments[0].top != "undefined"){
			__position = {left:parseInt(arguments[0].left)+"px",top:parseInt(arguments[0].top)+"px"};
		}else{
			__position	= {top:"100px",left:"400px"};
		}
		__dict = arguments[0].dict;
	}else{
		__input = _type;
		__str = _str;
		__length = _length;
		__position = _position;
		__dict = _dict;	
	}
	
	var inputWidget = iPanel.pageWidgets.getByName("inputWidget");
	if(inputWidget == null){
		iPanel.pageWidgets.create("inputWidget",uiInputUrl[__input]);
		setTimeout(function(){
			iTimeInput(__input,__str,__length,__position,__dict);
		},300);	
	}else{
		__str = typeof __str != "undefined"?__str:"";
		
		__length = typeof __length != "undefined"?__length:200;
		
		if(__input=="input" || __input=="inputandnumber"){
			__length = __length>18?18:__length;
		}else if(__input=="textarea"){
			__length = __length>65?65:__length;
		}
		__position = typeof __position != "undefined"?__position:{top:"100px",left:"400px"};
		
		__dict = typeof __dict != "undefined"?__dict:"";
		
		if(__input == "psw" || __input == "number" || __input == "inputen" || __input == "inputpsw"){  //��������ֻ�������
			
			if( __str != "" && __length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&_str="+__str+"&len="+__length+"&top="+__position.top+"&left="+__position.left;
			}else if( __str != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&_str="+__str+"&top="+__position.top+"&left="+__position.left;
			}else if(__length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&len="+__length+"&top="+__position.top+"&left="+__position.left;
			}else{
				inputWidget.location.href = uiInputUrl[__input]+"&top="+__position.top+"&left="+__position.left;
				
			}
		}else if(__input == "date" || __input == "ipNum"){  //���� �� IP
			if(__str != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_str="+__str+"&top="+__position.top+"&left="+__position.left;	
			}else{
				inputWidget.location.href = uiInputUrl[__input]+"?top="+__position.top+"&left="+__position.left;
			}
		}else{ //���ж��С����е��С����д����������ַ����뷨
			if( __str != ""  && __dict != ""  && __length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_dict="+__dict+"&_str="+__str+"&len="+__length;
			}else if( __str != "" && __length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_str="+__str+"&len="+__length;
			}else if(__dict != ""  && __length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_dict="+__dict+"&len="+__length;
			}else if( __str != ""  && __dict != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_dict="+__dict+"&_str="+__str;
			}else if( __str != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_str="+__str;
			}else if(__dict != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_dict="+__dict;
			}else if(__length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?len="+__length;
			}else{
				inputWidget.location.href = uiInputUrl[__input];		
			}
		}
		setTimeout(function(){
			inputWidget.show();	
		},300);
	}
}
 //��ȡ��Ϣp2ֵ�ĸ�8λ����8λ����16λ
function toBin(_num){ //��ȡ��Ϣp2ֵ�ĸ�8λ����8λ����16λ
		var t1 = _num.toString(2);
		var str = "";
		for(i = 0; i < 32-t1.length; i++){
			str += "0";
		}
		t1 = str+t1;
		return[
			parseInt(t1.slice(0,16),2),
			parseInt(t1.slice(16),2)
		]
	}


/*****************ȫ�ֱ���*******************/
//var keyReturnFlag = 0; //0 return false    1 return 1;	//********************************Ĭ�ϵľ��ǽ�ֹ��Ҫ����һ�㣬�����ֵ���1������menu��
var iPanelKeyFlag = 0; //==1���ΰ��� 

//****************************ϵͳ��Ϣ�¼�����*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	var keycode = event.which;
	var p2 = event.modifiers;			//p2ֵ����Щ��Ϣ���ܻᴫ����p2ֵ����p2ֵ����doOtherKey
	keyReturnFlag = doOtherKey(keycode, p2);
	return keyReturnFlag;
}

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
	if(iPanelKeyFlag == 1) return false;	//������ĳ�����ʱ����Ҫ���¼���ֹ�����磬�ڻ��������У��������¼��������ڴ���widget
	var keyReturnFlag = 0;		//���ݷ���ֵ���ж�Ҫ��Ҫ������һ��
	var keycode = event.which;
	var p2 = event.modifiers;	
	switch(keycode){
		case 1://up
		case 38:
			if(iPanelKeyFlag == 1) return false;
			keyReturnFlag = doBasicKey("up",p2, keycode);
			break;
			
		case 2://down
		case 40:
			if(iPanelKeyFlag == 1) return false;
			keyReturnFlag = doBasicKey("down",p2, keycode);
			break;
			
		case 3://left
		case 37:
			if(iPanelKeyFlag == 1) return false;
			keyReturnFlag = doBasicKey("left",p2, keycode);
			break;
			
		case 4://right
		case 39:
			if(iPanelKeyFlag == 1) return false;
			keyReturnFlag = doBasicKey("right",p2, keycode);
			break;
			
		case 13://enter
			if(iPanelKeyFlag == 1) return false;
			keyReturnFlag = doBasicKey("enter",p2, keycode);
			break;
			
		case 340://����
		case 8:
			keyReturnFlag = doBasicKey("back",p2, keycode);
			break;
			
		case 513://�˵�
		case 36:
		case 17:
			keyReturnFlag = doBasicKey("menu",p2, keycode);
			break;

		case 595://����+
		case 87:
			keyReturnFlag = doBasicKey("volUp",p2, keycode);
			break;
			
		case 596://����-
		case 81:
			keyReturnFlag = doBasicKey("volDown",p2, keycode);
			break;
			
		case 32:
			keyReturnFlag = doBasicKey("spaceBar",p2, keycode);
			break;			
			
		default:
			keyReturnFlag = doOtherKey(keycode, p2, keycode);
			break;
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

//��ʾ��Ϣ��ʾ
var dialogObj = null;
function showdialog(_str){
	dialogObj = registObj();
	dialogObj.loadData({id:1, content:_str});
	if(dialogObj.showFlag==false){	
		dialogObj.appear();
	}	
}
//������Ϣ
function sendMessage(msg,dstSourceIds,_flag){//    msg��Ϣ JSON����    dstSourceIds  ���ŷ���������[accountName] 
	var flag  = _flag || 0;
	add("accountId==="+iPanel.eventFrame.account_id)
	var tmpAccount = IMSG.getAccountById(iPanel.eventFrame.account_id);
	add("tmpAccount==="+tmpAccount)
	add("�������˺�==="+dstSourceIds.length)
	var result = tmpAccount.sendMessage(msg,dstSourceIds,flag,86400);
	add("result=="+msg)
	if(result==0){
		add("���ʹ��󣬼���Ƿ��¼");
	}
}
//�����������������Ϣ�ĸ�����
function requestOfflineMsgNum(){
	var OfflineMsgAccount = IMSG.getAccountById(iPanel.eventFrame.account_id);
	var resault =OfflineMsgAccount.requestOfflineMsgNum();
	add("�����������������Ϣ�ĸ����ӿڷ���ֵ��"+resault);
}

//�����������������Ϣ�����ݡ�
function requestOfflineMsg(num){
	var resault =OfflineMsgAccount.requestOfflineMsg(num); 
	add("�ӿڷ���ֵ��"+resault);
}
//��ȡ����δ�������Ϣ
function getLocalOfflineMsg(msgNum){
	var localMsgNum = OfflineMsgAccount.getLocalOfflineMsgNum();
	add("�����ػ���"+localMsgNum+"��������Ϣδȡ");
	var accountId = OfflineMsgAccount.id;
	var rqNum = parseInt(msgNum);
	getNotifyResult(accountId,2,rqNum);
}
//�����������������Ϣ�����ݡ�
function requestOfflineMsg(num){
	var OfflineMsgAccount = IMSG.getAccountById(accountId);
	var resault =OfflineMsgAccount.requestOfflineMsg(num); 
	add("�ӿڷ���ֵ��"+resault);
	}
//��ȡ����������Ϣ�����ݡ�
function getLocalOfflineMsg(msgNum){
	var localMsgNum = OfflineMsgAccount.getLocalOfflineMsgNum();
	debug("�����ػ���"+localMsgNum+"��������Ϣδȡ");
	var accountId = OfflineMsgAccount.id;
	var rqNum = parseInt(msgNum);
	getNotifyResult(accountId,2,rqNum);
	}
//��ȡ֪ͨ�Ľ��
function getNotifyResult(accountId,tmpType,msgNum){
	var tmpAccount = IMSG.getAccountById(accountId);
	if (msgNum == undefined)
	{	
		var str = tmpAccount.getNotifyResult(tmpType);
		add("��ȡ���Ľ��Ϊ��"+str);
		if (tmpType == 1){
			var json1 = eval(str);
			//alert(json1[0].msgContent);
			var serverOfflineMsgNum = parseInt(json1[0].msgContent);//������������Ϣ������
			add("������������Ϣ������:"+serverOfflineMsgNum);	
			if (serverOfflineMsgNum != 0){ //�����������������Ϣ������Ϊ0�����������ݡ�
				showdialog("������Ϣ"+serverOfflineMsgNum+"��")
				//requestOfflineMsg(serverOfflineMsgNum);
				getLocalOfflineMsg(serverOfflineMsgNum);
				}		
			}
	}
	else if(tmpType == 2){
		var str = tmpAccount.getNotifyResult(tmpType,msgNum);
		add("��ȡ���Ľ��Ϊ��"+str);
	}
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
	if(soundFlag) return;
    var _type = "wav";
    if(navigator.appName.indexOf("Netscape") != -1){//audio 播放
        var videoTag = document.createElement("audio");
        videoTag.id = "audio";
        videoTag.type =_type=="mp3"?"audio/mpeg":"audio/audio/wav";
        videoTag.src="";
        document.body.appendChild(videoTag);
        return;
    }
    if(typeof iPanel.eventFrame.currBgSound == "undefined") iPanel.eventFrame.currBgSound = [];
    if(iPanel.eventFrame.currBgSound.length > 0){
        closeAllSound(); //@2011.6.10 添加
	}
	audioMixerServer = iPanel.eventFrame.audioServer;
	var server = audioMixerServer.split(":");
	var serverIp = server[1].substring(2,server[1].length);
	var serverPort = parseInt(server[2].substring(0,server[2].length-1));
	iPanel.misc.setAudioMixerServer("UDP",serverIp,serverPort); //���÷�������Ϣ
	iPanel.misc.connectAudioMixerServer(); //���ӷ�����
}
//�Ͽ���Ч�ϳɷ�����
function disconnectServer(){
	if(soundFlag) return;
    if(navigator.appName.indexOf("Netscape") != -1){//audio 播放
        $("audio").pause();
        $("audio").stop();
        return;
    }
	iPanel.misc.disconnectAudioMixerServer();
}
//������Ч
function playSound(_class,_id,_volume, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")==-1){
        audioMixerServer = "http://192.168.60.88/";     //将公共音效放�?0.88，可以用chrome调用
    }
	if(typeof(_class)=="number"){
		var soundId = audioMixerServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
		var times = parseInt(audioArr[_class].list[_id].times);
		if(typeof(_volume)=="undefined"){
			var volume = parseInt(audioArr[_class].list[_id].volume);
		}else{
			var volume = parseInt(_volume);
		}
		
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		var soundId = audioMixerServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
        var times = typeof _id == 'undefined' ? 1 : _id;
		var volume = 100;
	}
    if(navigator.appName.indexOf("iPanel")!=-1){
		iDebug("---do--PlaySound");
		iPanel.misc.openSoundEffect(soundId,times,volume, flag, time);
    }else{
        $("audio").pause();
        $("audio").src= soundId;
		if(times==-1){  //循环播放
			$("audio").loop = "loop";
		}else{
			$("audio").loop = "";
		}
        $("audio").play();
    }
}

//��ͣ������Ч @huangjm 2011.5.24
function pauseSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
    if(navigator.appName.indexOf("iPanel")!=-1){
        iPanel.misc.pauseSoundEffect(soundId,flag,time);		//暂停单个音效
    }else{
        $("audio").pause();
    }
}

//�ָ�������Ч @huangjm 2011.5.24
function resumeSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
    if(navigator.appName.indexOf("iPanel")!=-1){
	 iPanel.misc.resumeSoundEffect(soundId,flag,time);
    }else{
        $("audio").play();
    }
}

//��ͣȫ����Ч @huangjm 2011.5.24
function pauseAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.misc.pauseAllSoundEffect(flag,time);
}
}

//�ָ�ȫ����Ч @huangjm 2011.5.24
function resumeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.misc.resumeAllSoundEffect(flag,time);
}
}

//�ر�ȫ����Ч
function closeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
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
			var soundId = audioMixerServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
		}else{
			return;	
		}
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		var soundId = audioMixerServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
	}
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.misc.closeSoundEffect(soundId, flag, time);
}
}

//��ͣ�ͻָ������¼� @huangjm 2011.5.24
function getSoundId(_class, _id){
	var soundId = "";
	if(typeof(_class)=="number"){
		if(audioArr[_class].list[_id].name!="undefined"){
			soundId = audioMixerServer + audioArr[_class].list[_id].jtUrl + audioArr[_class].list[_id].name;
		}else{
			return;	
		}
		
	}else if(typeof(_class)=="string"){
		var tempObj = null;
		soundId = audioMixerServer + basicAudio.basicPath + eval("tempObj = basicAudio."+_class);
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
	
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.eventFrame.currBgSound = [_class,_id, jtUrl];//@huangjm, 2011.23, 
}
}

//��ӡ����
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}