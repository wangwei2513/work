var soundFlag = navigator.appName.indexOf("iPanel") != -1?0:1; //默认0：支持， 1：不支持音效

var uiInputUrl = {
	textarea:"../input2013/input/input1.0.htm",//多行输入法
	input:"../input2013/input/input1.1.htm",//单行输入法
	inputandnumber:"../input2013/input/input1.2.htm",//单行带数字特殊字符输入法
	inputen:"../input2013/input/input1.3.htm?inputStatus=0",//单行带数字特殊字符输入法
	inputpsw:"../input2013/input/input1.3.htm?inputStatus=1",//密码单行带数字特殊字符输入法
	number:"../input2013/inputNum/inputNum.htm?inputStatus=0",//数字输入法
	psw:"../input2013/inputNum/inputNum.htm?inputStatus=1",//密码输入法
	date:"../input2013/date/date.htm",//日期输入法
	ipNum:"../input2013/inputNum/inputIPNum.htm"		// IP的输入法
}

/**
@ _type 输入法类型
@ _str  传递的数据
@ _length 字符长度（只针对数字、IP、密码）
@ _position 位置
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
		
		if(__input == "psw" || __input == "number" || __input == "inputen" || __input == "inputpsw"){  //输入的数字或者密码
			
			if( __str != "" && __length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&_str="+__str+"&len="+__length+"&top="+__position.top+"&left="+__position.left;
			}else if( __str != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&_str="+__str+"&top="+__position.top+"&left="+__position.left;
			}else if(__length != ""){
				inputWidget.location.href = uiInputUrl[__input]+"&len="+__length+"&top="+__position.top+"&left="+__position.left;
			}else{
				inputWidget.location.href = uiInputUrl[__input]+"&top="+__position.top+"&left="+__position.left;
				
			}
		}else if(__input == "date" || __input == "ipNum"){  //日期 和 IP
			if(__str != ""){
				inputWidget.location.href = uiInputUrl[__input]+"?_str="+__str+"&top="+__position.top+"&left="+__position.left;	
			}else{
				inputWidget.location.href = uiInputUrl[__input]+"?top="+__position.top+"&left="+__position.left;
			}
		}else{ //多行多列、单行单列、单行带数字特殊字符输入法
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
 //获取消息p2值的高8位，中8位，低16位
function toBin(_num){ //获取消息p2值的高8位，中8位，低16位
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


/*****************全局变量*******************/
//var keyReturnFlag = 0; //0 return false    1 return 1;	//********************************默认的就是截止，要流下一层，把这个值设成1，比如menu键
var iPanelKeyFlag = 0; //==1屏蔽按键 

//****************************系统消息事件处理*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	var keycode = event.which;
	var p2 = event.modifiers;			//p2值，有些消息可能会传过来p2值，将p2值传给doOtherKey
	keyReturnFlag = doOtherKey(keycode, p2);
	return keyReturnFlag;
}

/*
*@fun  doBasicKey: 基本事件，包括上，下，左，右，退出，返回，menu键，确实键的按键消息。keyReturnFlag是根据doBasicKey的返回值来决定的，且它的默认值为0，表现为截止消息。
*
*@fun  doOtherKey:扩展事件  主要是系统发的那些消息，keyReturnFlag是根据doOtherKey的返回值来决定的，且它的默认值为1，表现为将消息留至下一级。
*/
//****************************普通按键消息事件处理*****************************
//document.onkeypress = grabEvent;
//document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;		//该句柄，是为了满足google的表现，加了此句柄
function grabEvent(event){
	if(iPanelKeyFlag == 1) return false;	//在满足某种情况时，需要把事件截止，比如，在滑动过程中，不触发事件，或者在创建widget
	var keyReturnFlag = 0;		//根据返回值来判断要不要留至下一级
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
			
		case 340://返回
		case 8:
			keyReturnFlag = doBasicKey("back",p2, keycode);
			break;
			
		case 513://菜单
		case 36:
		case 17:
			keyReturnFlag = doBasicKey("menu",p2, keycode);
			break;

		case 595://音量+
		case 87:
			keyReturnFlag = doBasicKey("volUp",p2, keycode);
			break;
			
		case 596://音量-
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

//DOM处理---开始----// add by zhoujh
function $(element) {
	var element = document.getElementById(element);
    return extend(element,domMethod);
}
var domMethod = {//DOM扩展方法
	css:function(_opation){
		if(typeof(_opation)=="string"){
			return this.style[_opation];
		}else{
			extend(this.style,_opation);
		}
	},
	bg:function(_opation){
		if(/^#.+/.test(_opation)){//背景色
			this.style.backgroundColor = _opation;	
		}else{//背景图片
			this.style.backgroundImage = "url("+_opation+")";	
		}
	}
}
function extend(destination, source){//扩展对象
	for (var property in source){
		destination[property] = source[property];
	}
	return destination;	
}
//DOM处理---结束----//


/***************************iconLoading********************begin*/
/*
*@_info:{}传入你要给iconLoading所要设的位置及图片，请注意当前设的值，只在下一个跳转页面起作用
*set_loadingInfo({pic:"", width:"", height:"", top:"", left:""}), 这些参数都是可选的
*/
function setLoading(_info){
	var iconWidget = iPanel.pageWidgets.getByName("iconloading");
	iconWidget.set_loadingInfo(_info);	
}

/*
*将iconLoading置回原来的位置和图片 
*/
function resetLoading(){
	var iconWidget = iPanel.pageWidgets.getByName("iconloading");
	iconWidget.reset_loadingInfo();
}
/***************************iconLoading********************end*/

//防止没有加add打印的页面出错
function add(){}

//显示消息提示
var dialogObj = null;
function showdialog(_str){
	dialogObj = registObj();
	dialogObj.loadData({id:1, content:_str});
	if(dialogObj.showFlag==false){	
		dialogObj.appear();
	}	
}
//发送消息
function sendMessage(msg,dstSourceIds,_flag){//    msg消息 JSON对象    dstSourceIds  收信方名称数组[accountName] 
	var flag  = _flag || 0;
	add("accountId==="+iPanel.eventFrame.account_id)
	var tmpAccount = IMSG.getAccountById(iPanel.eventFrame.account_id);
	add("tmpAccount==="+tmpAccount)
	add("接收者账号==="+dstSourceIds.length)
	var result = tmpAccount.sendMessage(msg,dstSourceIds,flag,86400);
	add("result=="+msg)
	if(result==0){
		add("发送错误，检查是否登录");
	}
}
//向服务器请求离线消息的个数。
function requestOfflineMsgNum(){
	var OfflineMsgAccount = IMSG.getAccountById(iPanel.eventFrame.account_id);
	var resault =OfflineMsgAccount.requestOfflineMsgNum();
	add("向服务器请求离线消息的个数接口返回值："+resault);
}

//向服务器请求离线消息的内容。
function requestOfflineMsg(num){
	var resault =OfflineMsgAccount.requestOfflineMsg(num); 
	add("接口返回值："+resault);
}
//提取本地未读完的消息
function getLocalOfflineMsg(msgNum){
	var localMsgNum = OfflineMsgAccount.getLocalOfflineMsgNum();
	add("您本地还有"+localMsgNum+"条离线信息未取");
	var accountId = OfflineMsgAccount.id;
	var rqNum = parseInt(msgNum);
	getNotifyResult(accountId,2,rqNum);
}
//向服务器请求离线消息的内容。
function requestOfflineMsg(num){
	var OfflineMsgAccount = IMSG.getAccountById(accountId);
	var resault =OfflineMsgAccount.requestOfflineMsg(num); 
	add("接口返回值："+resault);
	}
//获取本地离线消息的内容。
function getLocalOfflineMsg(msgNum){
	var localMsgNum = OfflineMsgAccount.getLocalOfflineMsgNum();
	debug("您本地还有"+localMsgNum+"条离线信息未取");
	var accountId = OfflineMsgAccount.id;
	var rqNum = parseInt(msgNum);
	getNotifyResult(accountId,2,rqNum);
	}
//获取通知的结果
function getNotifyResult(accountId,tmpType,msgNum){
	var tmpAccount = IMSG.getAccountById(accountId);
	if (msgNum == undefined)
	{	
		var str = tmpAccount.getNotifyResult(tmpType);
		add("获取到的结果为："+str);
		if (tmpType == 1){
			var json1 = eval(str);
			//alert(json1[0].msgContent);
			var serverOfflineMsgNum = parseInt(json1[0].msgContent);//服务器离线信息的数量
			add("服务器离线信息的数量:"+serverOfflineMsgNum);	
			if (serverOfflineMsgNum != 0){ //如果服务器的离线信息的数量为0则不再请求内容。
				showdialog("离线消息"+serverOfflineMsgNum+"条")
				//requestOfflineMsg(serverOfflineMsgNum);
				getLocalOfflineMsg(serverOfflineMsgNum);
				}		
			}
	}
	else if(tmpType == 2){
		var str = tmpAccount.getNotifyResult(tmpType,msgNum);
		add("获取到的结果为："+str);
	}
}

/*****************音效新增**********************/
var basicAudio = { /*基本音效*/
	basicPath:"publicAudio/basicAudio/",  //基本路径
	move:"pub_0001.wav",//移动
	enter:"pub_0002.wav",//确定
	pageGo:"pub_0003.wav", //同级页面转换
	pageOpen:"pub_0004.wav", //下级页面弹出
	keyboard:"pub_0005.wav",//弹出全局键盘
	date:"pub_0006.wav", //调用日历模块
	areakeyboard:"pub_0007.wav", //区域键盘弹出
	press:"pub_0008.wav", //焦点按下动作
	turnList:"pub_0009.wav", //焦点动作-翻条目动作
	turnPage:"pub_0010.wav",//焦点动作-翻页的动作及提示
	focusCycle:"pub_0011.wav", //焦点循环
	moveDiff:"pub_0012.wav", //焦点移动规则-不相同内容移动动作
	moveSame:"pub_0013.wav", //焦点移动规则-相同内容移动动作
	areaScale:"pub_0014.wav", //区域缩放
	inforExpand:"pub_0015.wav", //资讯展开
	tipsBox:"pub_0016.wav", //提示类弹出框动作
	actionBox:"pub_0017.wav", //有操作弹出框动作
	errorEnd:"pub_0018.wav", //移动到最后一个，或操作禁止
  	invalid:"20115101115103.wav", //无效操作音
  	success:"20115712175758.wav" //设置成功/修改成功/提示成功/发送成功
};


//连接服务器
function connectServer(){
	if(soundFlag) return;
    var _type = "wav";
    if(navigator.appName.indexOf("Netscape") != -1){//audio 鎾斁
        var videoTag = document.createElement("audio");
        videoTag.id = "audio";
        videoTag.type =_type=="mp3"?"audio/mpeg":"audio/audio/wav";
        videoTag.src="";
        document.body.appendChild(videoTag);
        return;
    }
    if(typeof iPanel.eventFrame.currBgSound == "undefined") iPanel.eventFrame.currBgSound = [];
    if(iPanel.eventFrame.currBgSound.length > 0){
        closeAllSound(); //@2011.6.10 娣诲姞
	}
	audioMixerServer = iPanel.eventFrame.audioServer;
	var server = audioMixerServer.split(":");
	var serverIp = server[1].substring(2,server[1].length);
	var serverPort = parseInt(server[2].substring(0,server[2].length-1));
	iPanel.misc.setAudioMixerServer("UDP",serverIp,serverPort); //设置服务器信息
	iPanel.misc.connectAudioMixerServer(); //连接服务器
}
//断开音效合成服务器
function disconnectServer(){
	if(soundFlag) return;
    if(navigator.appName.indexOf("Netscape") != -1){//audio 鎾斁
        $("audio").pause();
        $("audio").stop();
        return;
    }
	iPanel.misc.disconnectAudioMixerServer();
}
//播放音效
function playSound(_class,_id,_volume, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")==-1){
        audioMixerServer = "http://192.168.60.88/";     //灏嗗叕鍏遍煶鏁堟斁缃?0.88锛屽彲浠ョ敤chrome璋冪敤
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
		if(times==-1){  //寰幆鎾斁
			$("audio").loop = "loop";
		}else{
			$("audio").loop = "";
		}
        $("audio").play();
    }
}

//暂停单个音效 @huangjm 2011.5.24
function pauseSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
    if(navigator.appName.indexOf("iPanel")!=-1){
        iPanel.misc.pauseSoundEffect(soundId,flag,time);		//鏆傚仠鍗曚釜闊虫晥
    }else{
        $("audio").pause();
    }
}

//恢复单个音效 @huangjm 2011.5.24
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

//暂停全部音效 @huangjm 2011.5.24
function pauseAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.misc.pauseAllSoundEffect(flag,time);
}
}

//恢复全部音效 @huangjm 2011.5.24
function resumeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.misc.resumeAllSoundEffect(flag,time);
}
}

//关闭全部音效
function closeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.eventFrame.currBgSound = [];
	iPanel.misc.closeAllSoundEffect(flag, time);
}	
}
//关闭指定音效
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

//暂停和恢复音较新加 @huangjm 2011.5.24
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


/*--------播放背景音乐
会自动停掉记录在全局变量中的当前播放音效，再播放新的背景音效
*/
function playBgSound(_class,_id){
	if(soundFlag) return;
	//先停掉当前播放背景音乐
	var jtUrl = audioArr[_class].list[_id].jtUrl ;		//@huangjm, 2011.23, 可能出现的情况是同样的class和id, 所以加个文件夹判断
	if(typeof(iPanel.eventFrame.currBgSound)!="undefined"&&iPanel.eventFrame.currBgSound.length!=0){
		var currBgSound = iPanel.eventFrame.currBgSound;
		if(_class==currBgSound[0]&&_id==currBgSound[1] && jtUrl == currBgSound[2]){ //同一个声音 @huangjm, 2011.23, 
			return;	
		}
			closeSound(currBgSound[0],currBgSound[1]);
		}
	playSound(_class,_id);
	
    if(navigator.appName.indexOf("iPanel")!=-1){
	iPanel.eventFrame.currBgSound = [_class,_id, jtUrl];//@huangjm, 2011.23, 
}
}

//打印测试
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}