<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>popvariety</title>
<script>
<?php
	//include "js/homedconfig.js";
	include "js/js/varietyPopCss_new.js";
	include "js/js/varietyPop_new.js";
	include "js/js/keyevent.js";
	include "js/js/common.js";
	
?>

var varietyObj = null;
var onLoadFlag = false;
var closeWidgetKeyValue = 0;//记录具体按键关闭当前widget时，需要留到mainFrame的键值

initPage(window);
function init(){
	closeWidgetKeyValue = 0;
     varietyObj = new creatVarietyPop(varietyPopCss);
	 //varietyObj.numSelect = numSelect;//数字点击确定
	 //varietyObj.otherSelect = otherSelect;//更多点击确定
	// varietyObj.goBack = popgoBack;//返回
	 varietyObj.init();
	 varietyObj.appear();
	if(typeof top.dataPos != "undefined" && top.dataPos == 0){//add by huadw 2015-09-10,解决搜索页按确认后快速按菜单出现的弹出框在首页的问题
		top.window.hidePop();
	}	 
}
function initData(data){
	varietyObj.initData(data);
}
function numSelect(_focus){
	add("选择："+varietyPopdata.variety[_focus].id+"&nbsp;&nbsp;"+varietyPopdata.variety[_focus].date);
}
function otherSelect(){
	add("更多");
}
function popgoBack(){
}

function modifyData(data){
	//data  = tempData;
	iDebug(data);
	varietyPopCss.varietyPopdata = data;
	init();
}
//@pengjiao 2014.09.25   33上回看pop弹出框，焦点会先跳到上次点播的集数，再跳到第一个 
function hiddenPopDiv(_pos){
	if(varietyObj==null){
		 varietyObj = new creatVarietyPop(varietyPopCss);
	}
	varietyObj.disFocus(varietyObj.focusPos);
	varietyObj.showFocus(_pos);
}		
function eventHandler(eventObj){
	switch(eventObj.code){
		case "KEY_UP":
			varietyObj.up();
			return returnFalseFlag;
			break;
		case "KEY_DOWN":
			varietyObj.down();
			return returnFalseFlag;
			break;
		case "KEY_LEFT":
			varietyObj.left();
			return returnFalseFlag;
			break;
		case "KEY_RIGHT":
			varietyObj.right();
			return returnFalseFlag;
			break;
		case "KEY_SELECT":
			varietyObj.doSelect();
			return returnFalseFlag;
			break;
		case "KEY_MENU":
			if(typeof top.window.hidePop == "function"){
				return returnFalseFlag;
			}else{
				window.close();
				return returnTrueFlag;
			}
			break;
		case "KEY_HOMEPAGE":
			if(typeof top.window.hidePop == "function"){
				varietyObj.disAppear();
				top.window.hidePop();
				iDebug("key_homepage---hidePop---");
				closeWidgetKeyValue = eventObj.keycode;
				closeWidget();//关闭后，再次发送一次首页按键进行切换首页
			}else{
				closeWidgetKeyValue = eventObj.keycode;
				iDebug("key_homepage---wangzhib---");
				window.close();
				return returnTrueFlag;
			}
			return returnFalseFlag;
			break;
		case "KEY_BACK":
			varietyObj.disAppear();
			var type = isAdvanceFlag?0:2;
			if(typeof top.window.hidePop == "function"){
				top.window.hidePop();
				if(navigator.appName.indexOf("iPanel") != -1) iPanel.sendSimulateEvent(type,9666,4);
				return returnFalseFlag;
			}else{
				window.close();
				iPanel.sendSimulateEvent(type,9666,4);
			return EVENT.DOMN;
			}
			break;
		
		default:
			return commonHandler(eventObj);
			break;

	}
	
	if(isAdvanceFlag){
		eventObj.args.type = eventObj.args.type?true:false;
	}
	return eventObj.args.type;
}

function closeWidget(){
	iDebug("[popTv_new.php]---closeWidget()---closeWidgetKeyValue="+closeWidgetKeyValue);
	if(closeWidgetKeyValue>0){//关闭widget时，重新发送一次按键
		var type = isAdvanceFlag?0:2;
		iPanel.sendSimulateEvent(type,closeWidgetKeyValue,0);
		closeWidgetKeyValue = 0;
	}
}

function add(_str){
    //$("test").innerHTML += _str + "<br/>";
}
function $(_id){
    return document.getElementById(_id); 
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
//window.onload = modifyData;
</script>
<style>
* {
	font-family:'黑体';	
}
</style>
</head>

<body bgcolor="transparent" onUnload="closeWidget()">
<div id="popBG" style="position:absolute; left:0px; top:0px; width:1280px; height:720px; background-color:#000000; opacity:0.5; -webkit-transition-duration:200ms; z-index:50;"></div>

<div id="test" style="position:absolute; left:33px; top:20px; width:228px; height:68px; background-color:#333333; color:#000000; font-size:20px; line-height:20px; visibility:hidden;"></div>
</body>
<script>
onLoadFlag = true;//由于onload在iframe框架中被主页面调用了，3.0上会出现问题，故放这里
</script>
</html>
