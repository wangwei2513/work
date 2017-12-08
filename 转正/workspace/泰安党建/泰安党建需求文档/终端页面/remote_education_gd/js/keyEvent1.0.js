/*var soundFlag = 1;	//默认0：支持， 1：不支持音效
if (navigator.appName.indexOf("iPanel")!=-1){
	soundFlag = 0;
	//iPanel.eventFrame.exitUrl = "http://192.168.60.88:8080/chrome_App/index.htm";
}*/
var soundFlag = navigator.appName.indexOf("iPanel") != -1?0:1; //默认0：支持， 1：不支持音效
if(navigator.appName.indexOf("iPanel") != -1){
	if(iPanel.misc.getGlobal("baseSoundVar")!=""){	
		var soundVar = iPanel.misc.getGlobal("baseSoundVar").split(",");
		soundFlag = typeof soundVar[0]=="undefined"?1: parseInt(soundVar[0]);
		soundFlag = soundFlag==0?1:0;//系统设置中0是关闭，而此处1是关闭；
	}
} 
var audioMixerServer = "";
var ipasServer = "http://access.homed.me/getIaps?da=";
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//判断是否是advance版本
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var isChromeFlag = navigator.userAgent.toLowerCase().indexOf("chrome")>=0?true:false;
var returnFalseFlag = false;			//事件截止
var returnTrueFlag = true;				//事件流向下一层
if(navigatorFlag == "iPanel"){
 	returnFalseFlag = isAdvanceFlag?false:0;
	returnTrueFlag = isAdvanceFlag?true:1;	
}
/*****************【音效合成】变量*******************/
/*if(typeof(iPanel.eventFrame.globalvarObj)=="undefined"){
	iPanel.eventFrame.globalvarObj = {};
}
//高清专用
iPanel.eventFrame.inputUrl = {
	textarea:"/global_chrome/input/input1.0/input1.0.htm",//多行输入法
	input:"/global_chrome/input/input1.0/input1.1.htm",//单行输入法
	number:"/global_chrome/input/inputNum/inputNum.htm",//数字输入法
	psw:"/global_chrome/input/inputNum/inputNum.htm?1",//密码输入法
	counter:"/global_chrome/input/inputCounter/inputCounter.htm",//计算器输入法
	date:"/global_chrome/input/date/date.htm"//日期输入法
}

//标清专用
iPanel.eventFrame.b_inputUrl = {
	textarea:"/global_chrome/b_input/inputText/input.htm?1",//多行输入法
	input:"/global_chrome/b_input/inputText/input.htm?0",//单行输入法
	number:"/global_chrome/b_input/inputNum/input2.htm",//数字输入法
	psw:"/global_chrome/b_input/inputNum/input2.htm?1",//密码输入法
	counter:"/global_chrome/b_input/inputNum/input1.htm",//计算器输入法
	date:"/global_chrome/input/date/date.htm"//日期输入法
}*/



/***************** 角色 *******************/
var roleParam = {//
	initDivId:"roleDiv", //角色元素输出的DIV
	spacing:160, //角色间距
	txtColor:"#000000",//文本颜色
	info:[
		 {roleid:"00000101",name:"妈妈",pic:"fc_picHead0_1.png"}
		,{roleid:"00000102",name:"爸爸",pic:"fc_picHead0_2.png"}
		,{roleid:"00000103",name:"宝宝",pic:"fc_picHead0_3.png"}
	]
}

/*****************全局变量*******************/
//var keyReturnFlag = returnFalseFlag; //0 return false    1 return true;	//*****默认的就是截止，要流下一层，把这个值设成1，比如menu键
var iPanelKeyFlag = 0; //==1屏蔽按键 
var ___menuBtnNums = 0;
var ___menuTime = 0;
var iframeStatus = "";		//用于查看当前iframe是流向哪个iframe

//****************************系统消息事件处理*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	var keyReturnFlag = false;		//根据返回值来判断要不要留至下一级
	var keycode = event.which;
	var p2 = event.modifiers;			//p2值，有些消息可能会传过来p2值，将p2值传给doOtherKey
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
*@fun  doBasicKey: 基本事件，包括上，下，左，右，退出，返回，menu键，确实键的按键消息。keyReturnFlag是根据doBasicKey的返回值来决定的，且它的默认值为0，表现为截止消息。
*
*@fun  doOtherKey:扩展事件  主要是系统发的那些消息，keyReturnFlag是根据doOtherKey的返回值来决定的，且它的默认值为1，表现为将消息留至下一级。
*/
//****************************普通按键消息事件处理*****************************
//document.onkeypress = grabEvent;
//document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;		//该句柄，是为了满足google的表现，加了此句柄
function grabEvent(event){
	//iDebug("iframeStatus ="+iframeStatus+"--code ="+event.which+" iPanelKeyFlag===="+iPanelKeyFlag+" =====iframeStatus:"+iframeStatus);
	if(iPanelKeyFlag == 1) return false;	//在满足某种情况时，需要把事件截止，比如，在滑动过程中，不触发事件，或者在创建widget
	var keyReturnFlag = returnFalseFlag;		//根据返回值来判断要不要留至下一级
	if(iframeStatus != ""){
		var keycode = event.which;
		var p2 = event.modifiers;	
		keyReturnFlag = window.frames[iframeStatus].doBasicKey(eventMatch[keycode], p2);
	}else{
		var keycode = event.which;
		var p2 = event.modifiers;			//p2值，有些消息可能会传过来p2值，将p2值传给doOtherKey
		if(keycode < 58 && keycode > 47){//数字键
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
				case 340://返回
				case 8:
					keyReturnFlag = doBasicKey("back",p2);
					break;
				case 513://菜单
				case 4097:
				case 17:
					keyReturnFlag = doBasicKey("menu");
					break;
				case 512://主页
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
				case 595://音量+
					keyReturnFlag = doBasicKey("volUp");
					break;
				case 596://音量-
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

var uiInputUrl = {
	textarea:"/global_chrome/googleInput/input/input1.0.htm",//多行输入法
	input:"/global_chrome/googleInput/input/input1.1.htm",//单行输入法
	inputandnumber:"/global_chrome/googleInput/input/input1.2.htm",//单行带数字特殊字符输入法
	number:"/global_chrome/googleInput/inputNum/inputNum.htm?inputStatus=0",//数字输入法
	psw:"/global_chrome/googleInput/inputNum/inputNum.htm?inputStatus=1",//密码输入法
	counter:"/global_chrome/googleInput/inputCounter/inputCounter.htm",//计算器输入法
	date:"/global_chrome/googleInput/date/date.htm",//日期输入法
	ipNum:"/global_chrome/googleInput/inputNum/inputIPNum.htm"		// IP的输入法
}

function iTimeInput(__input,__str,__length,__window,_position,_dict){
iPanel.debug("__length==="+__length + "__str===" +__input);
	var tempUrl = "";
	/*if(!_position){
		_position = {top:200,left:400};
	}*/
	if(__input == "psw" || __input == "number"){  //输入的数字或者密码
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
	}else if(__input == "date" || __input == "ipNum"){  //日期 和 IP
		if(__str != ""){
			tempUrl = uiInputUrl[__input]+"?_str="+__str+"&top="+_position.top+"&left="+_position.left;	
//			add("tempUrl="+tempUrl);
		}else{
			tempUrl = uiInputUrl[__input]+"?top="+_position.top+"&left="+_position.left;
		}
	}else if( typeof __str!= "undefined" && __str != ""){ //是否有传递的字符
		if(typeof _dict!="undefined" && _dict != ""){
			tempUrl = uiInputUrl[__input]+"?_str="+__str+"&_dict="+_dict;	
		}else{
			tempUrl = uiInputUrl[__input]+"?_str="+__str;
//			add("else....tempUrl="+tempUrl+";__str="+__str);		
		}
	}else{
		if(typeof _dict !="undefined" && _dict != ""){  //字库是否有字库
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
*创建一个iframe容器，@huangjm 2012.11.20
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
	
	//显示div
	this.show = function(args){
		this.div.style.visibility = "visible";
		this.showFLag =true;
	};
	//隐藏div
	this.minimize = function(){
		this.div.style.visibility = "hidden";	
		this.showFLag = false;
		document.body.removeChild(this.div);
	};
	//创建iframe的div容器
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
	
	//创建iframe
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
		if (obj.addEventListener){	//加载完 iframe的监听
			obj.addEventListener("load", this.callBack, false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("onload", this.callBack);
		}else{
			obj.onload = this.callBack;
		}
	};

	//取得当前的iframe
	this.getIframeObj = function(){
		return  window.frames[this.id];
	};
	//取得当前容纳iframe的div
	this.getContainer = function(){
		return this.div;
	};
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
	//iDebug("[keyEvent1.0.js]---connectServer()---soundFlag="+soundFlag);
	if(soundFlag) return;
	if(typeof(iPanel.eventFrame.currBgSound)!="undefined" && iPanel.eventFrame.currBgSound.length > 0){
		closeAllSound(); //@2011.6.10 添加 目前的库在做connectServer时会把之前的音效先断开，为配合playBgSound，要先清下变量
	}
	if (navigator.appName.indexOf("iPanel")!=-1){
		//iDebug("[keyEvent1.0.js]---connectServer()---iPanel.eventFrame.audioServer="+iPanel.eventFrame.audioServer);
		var server = iPanel.eventFrame.audioServer.split(":");
		if(server&&server.length>2){
			var serverIp = server[1].substring(2,server[1].length);
			var serverPort = parseInt(server[2].substring(0,server[2].length-1));
			if (navigator.appName.indexOf("iPanel")!=-1){
				iPanel.misc.setAudioMixerServer("UDP",serverIp,serverPort); //设置服务器信息
				iPanel.misc.connectAudioMixerServer(); //连接服务器
			}
		}
	}
}
//断开音效合成服务器
function disconnectServer(){
	if(soundFlag) return;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.disconnectAudioMixerServer();
	}
}
//播放音效
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
		if(_class>audioArr.length-1||_id>audioArr[_class].list.length-1) return;//20140923@wangzhib兼容数组越界问题
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

//暂停单个音效 @huangjm 2011.5.24
function pauseSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.pauseSoundEffect(soundId,flag,time);		//暂停单个音效
	}
}

//恢复单个音效 @huangjm 2011.5.24
function resumeSound(_class, _id, _flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	var soundId = getSoundId(_class, _id);
	if (navigator.appName.indexOf("iPanel")!=-1){
	 iPanel.misc.resumeSoundEffect(soundId,flag,time);
	}
}

//暂停全部音效 @huangjm 2011.5.24
function pauseAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.pauseAllSoundEffect(flag,time);
	}
}

//恢复全部音效 @huangjm 2011.5.24
function resumeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
		iPanel.misc.resumeAllSoundEffect(flag,time);
	}
}

//关闭全部音效
function closeAllSound(_flag, _time){
	if(soundFlag) return;
	var flag = _flag || 0;
	var time  = _time || 200;
	if (navigator.appName.indexOf("iPanel")!=-1){
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

//暂停和恢复音较新加 @huangjm 2011.5.24
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
	iPanel.eventFrame.currBgSound = [_class,_id, jtUrl];//@huangjm, 2011.23, 
}

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

/***************************应用预载********************begin*/
/*
@appsPreLoad(args) args可以是：.html,  .js， .css， 各种图片格式, 也可以是数组
@如：appsPreLoad(["main.htm", ".secBg.png"], "data.js", "a.css");
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
		_arr.push(0);	//在应用里面默认都用非永住内存，所以给它一个flag 为0
	}
	iPanel.preDownload(tmpArr, _arr);	//预载的接口
}*/

/*
* @xiongzm 2011-8-10
* 设置单路音效的音量
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
* 获取单路音效当前的音量
*/
function getVolume(_class, _id){
	var soundId = getSoundId(_class, _id);
	return iPanel.misc.getVolume(soundId);
}
//防止没有加add打印的页面出错
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
	}else{//标准浏览器
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
*@desc:	主要用记全局变量，iPanel是用eventFrame来记，webkit内核用window.localStorage来记，其它用cookie来记
*/
(function(){
	//document.domain = "homed.me";
	var globalPos=function(){
		this.index = "";
		/**************取得当前的浏览器版本*******************/
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
		
		/**************设置全局变量*******************/
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
		
		/**************获取全局变量*******************/
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
		
		/****************重置变量*****************/
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
	
		/***********设定Cookie值***************/
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
		
		/**********获得Cookie解码后的值**************/
		this.getCookie=function(_name){
			var url = document.cookie;
			if(new RegExp(".*\\b"+_name+"\\b(\\s*=([^&;]+)).*", "gi").test(url)){
				return unescape(RegExp.$2);
			}else{
				return "";
			}
		}
	
		 /**********删除Cookie**************/
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
/*----------------------------------音效服务器的地址是域名，要过一定时间去更新，所以用一个widget来做定时处理--------end*/
function requestSoundServer(callback){
    iPanel.debug("------requestSoundServer---in");
    callback = callback||function(){iPanel.debug("---callback--默认空的---");};
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
				if(typeof res.IP=="undefined" || typeof res.port=="undefined")return;//@pengjiao 2014.12.16 音效服务器端口 和地址没有请求到
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