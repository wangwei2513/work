<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>键盘</title>

<script>
<?php
	include "data.js";
	$jsArr = array("js/childGreen_color.js","js/shenlan_color.js", "js/purple_color.js","js/gray_color.js");
	/*if (isset($_COOKIE['input_ztID'])) {
		$ztID = $_COOKIE['input_ztID'];
		$tmpUrl = $jsArr[$ztID];
	} else*/if (isset($_GET['input_ztID'])) {
		$ztID = $_GET['input_ztID'];
		$tmpUrl = $jsArr[$ztID];
	} else {
		$ztID = 0;
		$tmpUrl = "js/childGreen_color.js";
	}
	if($tmpUrl == "") $tmpUrl="js/childGreen_color.js";
	include $tmpUrl;	
?>
</script>

<style>
<?php 
	$cssArr = array("css/childGreen_color.css","css/shenlan_color.css", "css/purple_color.css","css/gray_color.css");
	$cssUrl = $cssArr[$ztID];
	if($cssUrl == "") $cssUrl = "css/childGreen_color.css";
	include $cssUrl;
 ?> 
 </style>
 
<script>
	
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced") >= 0 ? true : false; // 判断是否是advance版本
var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1) ? "iPanel" : "other";

var focusArea = 0; // 0,键盘区域，1，文本选择区域，2，确定按钮, 3文本箭头，4，展开文本,5，文本框区域, 6，文本操作区域
var tempfocusArea = 0; // 移动前的焦点区域
var isUL = 0; // 0：小写，1：大写
var inputValue = ""; // 输入框值
var tempLetter = ""; // 当前输入的字符
var keyPos = 0; // 键盘区域焦点位置
var wordArr = []; // 文本数组
var currWordPage = 1; // 
var wordPage = 0; // 
var wordPos = 0; // 文本焦点位置
var isExpansion = 0; // 是否展开文本显示
var modeFlag = 0; // 0：全部，1：单字

var wordOperaPos = 0; // 0: 全部/单字，1：文本向上切换，2：文本向下切换

var tabW = 94; // 每个文字显示单元格的大小

var isJhPos = 0; // 键盘输入框的激活状态，0：未激活，1：已激活
var gbPos = 0; // 光标焦点位置
var keyType = 0; // 0是英文，1是中文
var keyboardStyle = 0; // 键盘显示格式，0：按照键盘显示，即QWE...,1：按顺序显示,即ABCD..

var letterArr = []; // 键盘字母数组

var beforeArr = []; // 中文模式下选择的字母数组

var tempT6Value = "";  // t6中的字符串

var gbTimer = -1; // 光标显示timeout
var isGB = false; // 光标是否显示

// 各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼
var changeEareColor = {
	"CE":globalColorConf.changeInputColor, // 英/拼
	"aA":globalColorConf.changeInputColor, // 如 a/A
	"QD":globalColorConf.changeInputColor // 全部/单字
};

// 各种输入切换按钮的字体大小 如 a/A，全部/单字，英/拼
var changeEareFontSize = {
	"CE": "20px", // 英/拼
	"aA": "20px", // 如 a/A
	"QD": "20px" // 全部/单字
};

var reqIp = "http://access.homed.tv/olime"; // 客户端的拼音或联想查词

//document.onkeydown = grabEvent;

// function grabEvent(event) {
// 	var keycode = event.which;
// 	iDebug("input--index--grabEvent--keycode==" + keycode);
// 	return eventHandler(keycode);
// }
function eventHandler(eventObj) {
	//iDebug("input--index--eventHandler--keycode==" + keycode);
	var keyReturnFlag = navigator.appName.indexOf("iPanel") != -1 ? 1 : true; //根据返回值来判断要不要留至下一级
	switch (eventObj.code) {
		case "KEY_UP":     
			if (focusArea == 0) {
				keyMove(-13);
			} else if (focusArea == 1) {
				wordMove(-2);
			} else if (focusArea == 3) {
				$("r_arrow").style.backgroundColor = globalColorConf.tdBgColor1;
				$("r_arrow").style.color = globalColorConf.arrowColor;
				tempfocusArea = focusArea;
				showAndHideButton(true);
			} else if (focusArea == 5) {
				GBMove(-40);
			} else if (focusArea == 6) {
				$("wordOpera" + wordOperaPos).style.backgroundColor = globalColorConf.tdBgColor1;
				$("wordOpera" + wordOperaPos).style.color = globalColorConf.arrowColor;
				if (wordOperaPos == 0) {
					var str = $("wordOpera" + wordOperaPos).innerHTML;
					if (str.indexOf("color") > -1) { // 各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
						str = str.replace(/color:#[\w|\d]+;/, 'color:' + globalColorConf.changeInputColor + ';');
						$("wordOpera" + wordOperaPos).innerHTML = str;
					}
					focusArea = 3;
					$("r_arrow").style.backgroundColor = defaults.selectbgColor;
					$("r_arrow").style.color = globalColorConf.selectColor;
				} else {
					wordOperaPos--; 
					$("wordOpera" + wordOperaPos).style.backgroundColor = defaults.selectbgColor;
					$("wordOpera" + wordOperaPos).style.color = globalColorConf.selectColor;
					var str = $("wordOpera" + wordOperaPos).innerHTML;
					if (str.indexOf("color") > -1) { //各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
						str = str.replace(/color:#[\w|\d]+;/, 'color:' + defaults.selectColor + ';');
						$("wordOpera" + wordOperaPos).innerHTML = str;
					}
				}
			}
			keyReturnFlag = 0;
			break;
		case "KEY_DOWN":	
			if (focusArea == 0) {
				keyMove(13);
			} else if (focusArea == 1) {
				wordMove(2);
			} else if (focusArea == 2) {
				showAndHideButton(false);
			} else if (focusArea == 3) {
				$("r_arrow").style.backgroundColor = globalColorConf.tdBgColor1;
				$("r_arrow").style.color = globalColorConf.arrowColor;
				/*keyPos = 12;
				keyMove(0);
				focusArea = 0;*/
				if (isExpansion) {
					focusArea = 6;
					wordOperaPos = 0; 
					$("wordOpera" + wordOperaPos).style.backgroundColor = defaults.selectbgColor;
					$("wordOpera" + wordOperaPos).style.color = globalColorConf.selectColor;
					var str = $("wordOpera" + wordOperaPos).innerHTML;
					if (str.indexOf("color") > -1) { //各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
						str = str.replace(/color:#[\w|\d]+;/, 'color:' + defaults.selectColor + ';');
						$("wordOpera" + wordOperaPos).innerHTML = str;
					}
				} else {
					focusArea = 0;
					keyPos = 12;
					keyMove(0);
				}
			} else if (focusArea == 5) {
				GBMove(40);
			} else if (focusArea == 6) {
				var str = $("wordOpera" + wordOperaPos).innerHTML;
				if (str.indexOf("color") > -1) { // 各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
					str = str.replace(/color:#[\w|\d]+;/, 'color:' + globalColorConf.changeInputColor + ';');
					$("wordOpera" + wordOperaPos).innerHTML = str;
				}
				if (wordOperaPos < 2) {
					$("wordOpera" + wordOperaPos).style.backgroundColor = globalColorConf.tdBgColor1;
					$("wordOpera" + wordOperaPos).style.color = globalColorConf.arrowColor;
					wordOperaPos++; 
					$("wordOpera" + wordOperaPos).style.backgroundColor = defaults.selectbgColor;
					$("wordOpera" + wordOperaPos).style.color = globalColorConf.selectColor;
				}
				var str = $("wordOpera" + wordOperaPos).innerHTML;
				if (str.indexOf("color") > -1) { //各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
					str = str.replace(/color:#[\w|\d]+;/, 'color:' + defaults.selectColor + ';');
					$("wordOpera" + wordOperaPos).innerHTML = str;
				}
			}
			keyReturnFlag = 0;
			break;
		case "KEY_LEFT":	
			if (focusArea == 0) {
				keyMove(-1);
			} else if (focusArea == 1) {
				wordMove(-1);
			} else if (focusArea == 3) {
				$("r_arrow").style.backgroundColor = globalColorConf.tdBgColor1;
				$("r_arrow").style.color = globalColorConf.arrowColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
				focusArea = 1;
			} else if (focusArea == 2) {
				$("inputButton").style.backgroundColor = globalColorConf.tdBgColor1;
				$("inputButton").style.color = globalColorConf.inputButtonColor;
				$("keyinput").style.backgroundColor = defaults.selectbgColor;
				$("inputValue").style.color = globalColorConf.selectColor;
				if (tempLetter != "") {
					if (isJhPos == 0) {
						inputValue += tempLetter;
						tempLetter = "";
						gbPos = inputValue.length;
						beforeArr = [];
					} else {
						inputValue = inputValue.substring(0, gbPos) + tempLetter + inputValue.substring(gbPos, inputValue.length);
						tempLetter = "";
						beforeArr = [];
					}
				}
				isJhPos = 1;
				showGB();
				focusArea = 5;
			} else if (focusArea == 5) {
				GBMove(-1);
			} else if (focusArea == 6) {
				var str = $("wordOpera" + wordOperaPos).innerHTML;
				if (str.indexOf("color") > -1) { // 各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
					str = str.replace(/color:#[\w|\d]+;/, 'color:' + globalColorConf.changeInputColor + ';');
					$("wordOpera" + wordOperaPos).innerHTML = str;
				}
				$("wordOpera" + wordOperaPos).style.backgroundColor = globalColorConf.tdBgColor1;
				$("wordOpera" + wordOperaPos).style.color = globalColorConf.arrowColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
				focusArea = 1;
			}
			keyReturnFlag = 0;
			break;
		case "KEY_RIGHT":	
			if (focusArea == 0) {
				keyMove(1);
			} else if (focusArea == 1) {
				wordMove(1);
			} else if (focusArea == 5) {
				GBMove(1);
			}
			keyReturnFlag = 0;
			break;
		case "KEY_SELECT":
			doSelect();
			keyReturnFlag = 0;
			break;
		case "KEY_BACK":
			goBack();
			keyReturnFlag = 0;
			break;
		case 513: // 菜单
		case 36:
		case 768:
		case 4098:
			exitWidget();
			break;
		case 512: // 主页	
		case 306: // 小房子那个键 
		case 17: // PC 上ctrl
			exitWidget();
			keyReturnFlag = 1;
			break;
		case 595: //音量+
			break;
		case 596: //音量-
			break;
		case 32:
			break;
		default:
			break;
	}
	if (isAdvanceFlag || navigatorFlag != "iPanel") {
		keyReturnFlag = keyReturnFlag ? true : false;
	}
	iDebug("keyReturnFlag=" + keyReturnFlag);
	return keyReturnFlag;
};
function init() {
	iDebug("input--index.php--init");
	if(navigatorFlag == "iPanel"){
		if(typeof  iPanel.eventFrame.globalSysInfo != "undefined"){
			if(typeof iPanel.eventFrame.globalSysInfo.keyboardLanguage !="undefined"){
				keyType = parseInt(iPanel.eventFrame.globalSysInfo.keyboardLanguage);
				defaults.isEng = keyType;
			}
			if(typeof iPanel.eventFrame.globalSysInfo.keyboardStyle!="undefined"){
				keyboardStyle = parseInt(iPanel.eventFrame.globalSysInfo.keyboardStyle);
			}
		}
	}

	// 判断是否是用iframe打开
	if (self.frameElement && self.frameElement.tagName == "IFRAME" && parent.inputObj) { 
	  initParam(parent.inputObj);
	} else {
		initParam();
	}
	
}

/**
 * [initParam description]
 * @fun
 * @desc 初始化键盘参数
 * @DateTime 2017-04-17T11:55:33+0800
 * @param    {[type]}                 _obj [键盘参数]
 * @return   {[type]}                      [description]
 */
function initParam(_obj) { 
	iDebug("input--index--initParam--_obj = " + JSON.stringify(_obj));
	defaults = extend(defaults, _obj || {});

	defaults.htmlDom = $("inputValue"); // 输入框dom元素
	defaults.htmlDom.innerHTML = "";
	focusArea = 0;
	keyPos = 3;
	currWordPage = 1;
	wordArr = [];
	wordPage = 0;
	wordPos = 0;
	isExpansion = 0;
	modeFlag = 0;  
	reqIp = defaults.reqIp =="" ? reqIp : defaults.reqIp;	
	changeEareColor = {
		"CE":globalColorConf.changeInputColor, // 英/拼
		"aA":globalColorConf.changeInputColor, // 如 a/A
		"QD":globalColorConf.changeInputColor // 全部/单字
	};
	initInputData();
	initKeyboardData();
	keyMove(0);
	showGB();
	//initElementPosition();
}

/**
 * [initInputData description]
 * @fun
 * @desc 初始化文本框
 * @DateTime 2017-04-17T12:05:04+0800
 * @return   {[type]}                 [description]
 */
function initInputData() {
	iDebug("input--index.php---initData()---");
	$("keyinputFrame").style.zIndex = defaults.outzIndex;
	if (defaults.isWebkit == 1) {
		$("keyinputFrame").style.webkitTranstionDuration = defaults.duration;
	}

	if (defaults.type == 1) { // 0：字符串输入模式，1：密码输入模式
		defaults.isEng = 0;
		if (defaults.strLength == 10000000) {
			defaults.strLength = 6;
		}
		defaults.intr = "请输入密码";
	}

	if (defaults.type == 0) { // 字符串输入模式
		var currTempStrLen = getCharacterLength(defaults.inputValue);
		var tempCount = 0;
		var tempFlag = 1;
		for (var i = 0; i < defaults.inputValue.length; i++) {
			tempCount += getCharacterLength(defaults.inputValue.substring(i, i + 1));
			if (tempCount > defaults.strLength) {
				inputValue = defaults.inputValue.substring(0, i - 1);
				tempFlag = 0;
				break;
			}
		}
		if (tempFlag) {
			inputValue = defaults.inputValue;
		}
	} else { // 密码输入模式
		inputValue = defaults.inputValue.length > defaults.strLength ? defaults.inputValue.substring(0, defaults.strLength) : defaults.inputValue;
	}

	if (inputValue == "") {
		clearTimeout(gbTimer);
		defaults.htmlDom.innerHTML = defaults.intr;
	} else {
		gbPos = inputValue.length;
		showGB();
	}
}

/**
 * [initKeyboardData description]
 * @fun
 * @desc 初始化键盘数据
 * @DateTime 2017-04-17T13:56:03+0800
 * @return   {[type]}                 [description]
 */
function initKeyboardData() {
	iDebug("input--index.php---initKeyboardData()---");
	wordArr = [];
	wordPage = 0;
	currWordPage = 1;
	beforeArr = [];

	// 英/中显示判断
	if (defaults.isEng == 0) { // 英
		ehStr = "英<span style='font-size:" + changeEareFontSize["CE"] + "; color:" + changeEareColor["CE"] + ";'>/中</span>";
	} else if (defaults.isEng == 1) { // 中
		ehStr = "中<span style='font-size:" + changeEareFontSize["CE"] + "; color:" + changeEareColor["CE"] + ";'>/英</span>";
	}
	$("e20").innerHTML = ehStr;

	if (keyboardStyle == 1) { // 按字母顺序排列的
		letterArr = isUL ? UletterArrCopy.slice(0) : LletterArrCopy.slice(0);
		letterIdArr = letterIdArrCopy.slice(0);
	} else { // 按键盘顺序排列的
		letterArr = isUL ? UletterArr.slice(0) : LletterArr.slice(0);
		letterIdArr = letterIdArr.slice(0);
	}

	$("e10").innerHTML = isUL ? "A<span style='font-size:" + changeEareFontSize["aA"] + "; color:" + changeEareColor["aA"] + ";'>/a</span>" : "a<span style='font-size:" + changeEareFontSize["aA"] + "; color:" + changeEareColor["aA"] + ";'>/A</span>";

	if (defaults.isEng > 0) {
		$("keyinput").style.top = "422px";
		$("r_arrow").style.visibility = "visible";
		$("keyword").style.visibility = "visible";
	} else {
		$("keyinput").style.top = "479px";
		$("keyword").style.visibility = "hidden";
		$("r_arrow").style.visibility = "hidden";
	}

	if (focusArea == 6) {
		$("txtRight").style.visibility = "visible";

		$("wordOpera" + wordOperaPos).style.backgroundColor = defaults.selectbgColor;
		$("wordOpera" + wordOperaPos).style.color = globalColorConf.selectColor;
	} else {
		$("txtRight").style.visibility = "hidden";
	}

	showLetter();
	inputPosition();
	initElementPosition();
}

/**
 * [showLetter description]
 * @fun
 * @desc 字母数据填充
 * @DateTime 2017-04-17T14:11:50+0800
 * @return   {[type]}                 [description]
 */
function showLetter() {
	iDebug("input--index--showLetter")
	for (var i = 0; i < letterIdArr.length; i++) {
		for (var j = 0; j < letterIdArr[i].ids.length; j++) {
			$(letterIdArr[i].ids[j]).style.backgroundColor = globalColorConf.tdBgColor3;
		}
		$(letterIdArr[i].ids[0]).innerHTML = letterArr[i].txt;
	}
}

/**
 * [inputPosition description]
 * @fun
 * @desc input框定位
 * @DateTime 2017-04-17T14:14:57+0800
 * @return   {[type]}                 [description]
 */
function inputPosition() {
	iDebug("input--index--inputPosition");
	var len = getCharacterLength(inputValue + tempLetter);
	var temprow = 1;
	if (len <= 71) {
		temprow = 1;
	} else {
		temprow = Math.ceil((len - 71) / 79) + 1;
	}
	if (temprow > 1) {
		$("keyinput").style.height = 35 + temprow * 40 + "px";
		if (defaults.isEng > 0) {
			$("keyinput").style.top = 444 - temprow * 40 + "px";
		} else {
			$("keyinput").style.top = 501 - temprow * 40 + "px";
		}
	} else {
		$("keyinput").style.height = 17 + temprow * 40 + "px";
		if (defaults.isEng > 0) {
			$("keyinput").style.top = 462 - temprow * 40 + "px";
		} else {
			$("keyinput").style.top = 519 - temprow * 40 + "px";
		}
	}
}

/**
 * [initElementPosition description]
 * @fun
 * @desc 初始化元素位置
 * @DateTime 2017-04-17T14:16:30+0800
 * @return   {[type]}                 [description]
 */
function initElementPosition(){
	if (navigatorFlag == "iPanel") {
		$("wordRow0").style.top = "0px";
		$("wordRow1").style.top = "55px";
		$("wordRow2").style.top = "110px";
		$("wordRow3").style.top = "166px";
		$("wordRow0").style.height = "55px";
		$("wordRow1").style.height = "54px";
		$("wordRow2").style.height = "55px";
		$("wordRow3").style.height = "74px";
		$("keyword").style.lineHeight = "51px";
		$("inputButton").style.lineHeight = "51px";
		for (var i = 0; i < idArr.length; i++) {
			$(idArr[i].ids[0]).style.width = "94px";
		}
		var tempCount = 0;
		var tempWidth = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 12; j++) {
				tempWidth = (i + 1) * tabW;
				if (j == 0) {
					tempCount = 0;
					$("word" + i + "_" + j).style.left = "0px";
					$("word" + i + "_" + j).style.width = tempWidth + 28 + "px";
					$("wordfirst" + i + "_" + j).style.width = tabW + "px";
					$("wordfirst" + i + "_" + j).style.left = "29px";
					tempCount += tempWidth + 28;
					$("wordfirst" + i + "_" + j).innerHTML = "";
				} else {
					$("word" + i + "_" + j).style.left = tempCount + "px";
					$("word" + i + "_" + j).style.width = tabW + "px";
					$("word" + i + "_" + j).innerHTML = "";
					tempCount += tempWidth;
				}
			}
		}
	} else {
		$("wordRow0").style.top = "0px";
		$("wordRow1").style.top = "55px";
		$("wordRow2").style.top = "111px";
		$("wordRow3").style.top = "167px";
		$("wordRow0").style.height = "55px";
		$("wordRow1").style.height = "55px";
		$("wordRow2").style.height = "55px";
		$("wordRow3").style.height = "74px";
		$("keyword").style.lineHeight = "55px";
		$("inputButton").style.lineHeight = "55px";
		for (var i = 0; i < idArr.length; i++) {
			$(idArr[i].ids[0]).style.width = "94px";
		}
		var tempCount = 0;
		var tempWidth = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 12; j++) {
				tempWidth = (i + 1) * tabW;
				if (j == 0) {
					tempCount = 0;
					$("word" + i + "_" + j).style.left = "0px";
					$("word" + i + "_" + j).style.width = tempWidth + 29 + "px";
					$("wordfirst" + i + "_" + j).style.width = (tabW - 1) + "px";
					$("wordfirst" + i + "_" + j).style.left = "30px";
					$("wordfirst" + i + "_" + j).innerHTML = "";
					tempCount += tempWidth + 30;
				} else {
					$("word" + i + "_" + j).style.left = tempCount + "px";
					$("word" + i + "_" + j).style.width = (tabW - 1) + "px";
					$("word" + i + "_" + j).innerHTML = "";
					tempCount += tempWidth;
				}
			}
		}
	}
	/*$("wordRow0").style.top = "0px";
	$("wordRow1").style.top = "55px";
	$("wordRow2").style.top = "110px";
	$("wordRow3").style.top = "166px";
	$("wordRow0").style.height = "55px";
	$("wordRow1").style.height = "54px";
	$("wordRow2").style.height = "55px";
	$("wordRow3").style.height = "74px";
	$("keyword").style.lineHeight = "51px";
	$("inputButton").style.lineHeight = "51px";
	for (var i = 0; i < idArr.length; i++) {
		$(idArr[i].ids[0]).style.width = "94px";
	}
	var tempCount = 0;
	var tempWidth = 0;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 12; j++) {
			tempWidth = (i + 1) * tabW;
			if (j == 0) {
				tempCount = 0;
				$("word" + i + "_" + j).style.left = "0px";
				$("word" + i + "_" + j).style.width = tempWidth + 29 + "px";
				$("wordfirst" + i + "_" + j).style.width = tabW + "px";
				$("wordfirst" + i + "_" + j).style.left = "29px";
				tempCount += tempWidth + 29;
				$("wordfirst" + i + "_" + j).innerHTML = "";
			} else {
				$("word" + i + "_" + j).style.left = tempCount + "px";
				$("word" + i + "_" + j).style.width = tabW + "px";
				$("word" + i + "_" + j).innerHTML = "";
				tempCount += tempWidth;
			}
		}
	}*/
}

/**
 * [showGB description]
 * @fun
 * @desc 光标显示
 * @DateTime 2017-04-17T14:22:31+0800
 * @return   {[type]}                 [description]
 */
function showGB() {
	clearTimeout(gbTimer);
	var tempValue = (defaults.type == 0 ? inputValue : getXX(inputValue));
	var tempcolor = focusArea == 5 ? globalColorConf.cursorSelectColor : globalColorConf.cursorColor;
	if (isJhPos == 0) {
		if (tempLetter == "") {
			if (isGB) {
				defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>|</span>";
				isGB = false;
			} else {
				defaults.htmlDom.innerHTML = tempValue;
				isGB = true;
			}
		} else {
			if (isGB) {
				defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>" + tempLetter + "|</span>";
				isGB = false;
			} else {
				defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>" + tempLetter + "</span>";
				isGB = true;
			}
		}
	} else {
		if (tempLetter == "") {
			if (isGB) {
				if (gbPos == tempValue.length) {
					defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>|</span>";
				} else {
					defaults.htmlDom.innerHTML = tempValue.substring(0, gbPos) + "<span style='color:" + tempcolor + ";'>|</span>" + tempValue.substring(gbPos, tempValue.length);
				}
				isGB = false;
			} else {
				if (gbPos == tempValue.length) {
					defaults.htmlDom.innerHTML = tempValue;
				} else {
					defaults.htmlDom.innerHTML = tempValue.substring(0, gbPos) + "<span style='color:" + tempcolor + ";'>&nbsp;</span>" + tempValue.substring(gbPos, tempValue.length);
				}
				isGB = true;
			}
		} else {
			if (isGB) {
				if (gbPos == tempValue.length + tempLetter.length) {
					defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>" + tempLetter + "|</span>";
				} else {
					defaults.htmlDom.innerHTML = tempValue.substring(0, gbPos) + "<span style='color:" + tempcolor + ";'>" + tempLetter + "|</span>" + tempValue.substring(gbPos, tempValue.length);
				}
				isGB = false;
			} else {
				if (gbPos == tempValue.length + tempLetter.length) {
					defaults.htmlDom.innerHTML = tempValue + "<span style='color:" + tempcolor + ";'>" + tempLetter + "</span>";
					//defaults.htmlDom.innerHTML = tempValue+tempLetter;	
				} else {
					defaults.htmlDom.innerHTML = tempValue.substring(0, gbPos) + "<span style='color:" + tempcolor + ";'>" + tempLetter + "&nbsp;</span>" + tempValue.substring(gbPos, tempValue.length);
				}
				isGB = true;
			}
		}
	}
	iDebug("input--index.php--showGB--defaults.htmlDom.innerHTML:" + defaults.htmlDom.innerHTML);
	gbTimer = setTimeout(showGB, 500);
}

/**
 * [keyMove description]
 * @fun
 * @desc 键盘移动 
 * @DateTime 2017-04-17T14:23:07+0800
 * @param    {[type]}                 _num [description]
 * @return   {[type]}                      [description]
 */
function keyMove(_num) {
	iDebug("input--index--keyMove--keyPos==" + keyPos + " , --_num=" + _num);
	var classname = "";
	if (idArr[keyPos].type == 0) { // 数字
		classname = globalColorConf.tdBgColor2;
	} else if (idArr[keyPos].type == 1 || idArr[keyPos].type == 3) { // 字母
		classname = globalColorConf.tdBgColor3;
	} else {
		classname = globalColorConf.tdBgColor1;
	}

	if (keyPos + _num < 0) {
		for (var i = 0; i < idArr[keyPos].ids.length; i++) {
			$(idArr[keyPos].ids[i]).style.backgroundColor = classname;
		}

		$(idArr[keyPos].ids[0]).style.color = defaults.color;

		if (keyPos == 12 && defaults.isEng == 1) {
			//移动到箭头
			$("r_arrow").style.backgroundColor = defaults.selectbgColor;
			$("r_arrow").style.color = globalColorConf.selectColor;
			focusArea = 3;
		} else {
			if (wordArr.length > 0 && defaults.isEng == 1) {
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
				tempfocusArea = focusArea;
				focusArea = 1;
			} else {
				tempfocusArea = focusArea;
				showAndHideButton(true);
			}
		}
		return;
	} else if (keyPos + _num > idArr.length - 1) {
		return;
	}

	for (var i = 0; i < idArr[keyPos].ids.length; i++) {
		$(idArr[keyPos].ids[i]).style.backgroundColor = classname;
	}

	$(idArr[keyPos].ids[0]).style.color = defaults.color;
	var str = $(idArr[keyPos].ids[0]).innerHTML;
	iDebug("input--index--keyMove--str.indexOf('color')>-1== " + (str.indexOf("color") > -1));
	if (str.indexOf("color") > -1) { // 各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
		str = str.replace(/color:#[\w|\d]+;/, 'color:' + globalColorConf.changeInputColor + ';');
		$(idArr[keyPos].ids[0]).innerHTML = str;
	}

	keyPos += _num;
	classname = "#ffca28";

	for (var i = 0; i < idArr[keyPos].ids.length; i++) {
		$(idArr[keyPos].ids[i]).style.backgroundColor = classname;
	}
	$(idArr[keyPos].ids[0]).style.color = defaults.selectColor;

	var str = $(idArr[keyPos].ids[0]).innerHTML;
	iDebug("input--index--keyMove--str.indexOf('color')>-1--222== " + (str.indexOf("color") > -1));
	if (str.indexOf("color") > -1) { //各种输入切换按钮的文字颜色 如 a/A，全部/单字，英/拼 做特殊处理
		str = str.replace(/color:#[\w|\d]+;/, 'color:' + defaults.selectColor + ';');
		$(idArr[keyPos].ids[0]).innerHTML = str;
	}
}

/**
 * [showAndHideButton description]
 * @fun
 * @desc 显示或隐藏提交按钮
 * @DateTime 2017-04-17T14:47:17+0800
 * @param    {[type]}                 _flag [description]
 * @return   {[type]}                       [description]
 */
function showAndHideButton(_flag){
	if (_flag) {
		$("inputButton").style.backgroundColor = defaults.selectbgColor;
		$("inputButton").style.color = globalColorConf.selectColor;
		focusArea = 2;
	} else {
		$("inputButton").style.backgroundColor = globalColorConf.tdBgColor1;
		$("inputButton").style.color = globalColorConf.inputButtonColor;
		if (tempfocusArea == 0) {
			keyMove(0);
		} else if (tempfocusArea == 3) {
			$("r_arrow").style.backgroundColor = defaults.selectbgColor;
			$("r_arrow").style.color = globalColorConf.selectColor;
		} else {
			if (wordArr.length > 0) {
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
			} else {
				keyMove(0);
				tempfocusArea = 0;
			}
		}
		focusArea = tempfocusArea;
	}
}

/**
 * [doSelect description]
 * @fun
 * @desc 确定键
 * @DateTime 2017-04-17T14:51:08+0800
 * @return   {[type]}                 [description]
 */
function doSelect() {
	iDebug("input--index.php----doSelect--focusArea:" + focusArea + " , idArr[keyPos].type:" + idArr[keyPos].type + " , gbPos:" + gbPos);
	if (focusArea == 0) { // 键盘区域
		if (idArr[keyPos].type == 0) { // 数字
			var bl = isIFElseBuffer();
			if (bl) return;
			iDebug("input--index.php---doSelect--inputValue:" + inputValue + "--idArr[keyPos].index:" + idArr[keyPos].index + "--keyPos:" + keyPos + "--numIdArr[idArr[keyPos].index].value:" + numIdArr[idArr[keyPos].index].value);
			if (gbPos == inputValue.length) {
				inputValue += numIdArr[idArr[keyPos].index].value + "";
				gbPos = inputValue.length;
			} else {
				inputValue = inputValue.substring(0, gbPos) + (numIdArr[idArr[keyPos].index].value + "") + inputValue.substring(gbPos, inputValue.length);
				gbPos = gbPos + (numIdArr[idArr[keyPos].index].value + "").length;
			}
			if (defaults.type == 1) {
				showPasswordTxt(function() {
					showGB();
				})
			} else {
				showGB();
			}
			inputPosition();
		} else if (idArr[keyPos].type == 1) { // 字母
			if (defaults.isEng == 1) {
				if (getCharacterLength(inputValue) == defaults.strLength) return;
				tempLetter += letterArr[idArr[keyPos].index].txt;
				beforeArr = getPinyinArr(tempLetter);
				if (defaults.type == 1) {
					showPasswordTxt(function() {
						showGB();
					})
				} else {
					showGB();
				}
				getAjaxData(tempLetter);
			} else if (defaults.isEng == 0) {
				if (getCharacterLength(inputValue) == defaults.strLength) return;
				if (gbPos == inputValue.length) {
					inputValue += letterArr[idArr[keyPos].index].txt + "";
					gbPos = inputValue.length;
				} else {
					inputValue = inputValue.substring(0, gbPos) + letterArr[idArr[keyPos].index].txt + inputValue.substring(gbPos, inputValue.length);
					gbPos = gbPos + letterArr[idArr[keyPos].index].txt.length;
				}
				if (defaults.type == 1) {
					showPasswordTxt(function() {
						showGB();
					})
				} else {
					showGB();
				}
			}
			inputPosition();
		} else if (idArr[keyPos].type == 4) { //中英文切换
			var bl = isIFElseBuffer();
			if (defaults.type == 1) return;
			if (defaults.isEng == 0) {
				defaults.isEng = 1;
			} else if (defaults.isEng == 1) {
				defaults.isEng = 0;
			}
			isUL = 0; //变成小写	
			changeEareColor["aA"] = globalColorConf.changeInputColor;
			changeEareColor["CE"] = defaults.selectColor;
			initKeyboardData();
		} else if (idArr[keyPos].type == 2) { // 大小写切换
			var bl = isIFElseBuffer();
			if (defaults.isEng > 0) return;
			if (isUL) { //当前是大写
				isUL = 0; //变成小写
				defaults.isEng = 0;
				letterArr = LletterArr.slice(0);
			} else {
				isUL = 1;
				defaults.isEng = 0;
				letterArr = UletterArr.slice(0);
			}
			changeEareColor["CE"] = globalColorConf.changeInputColor;
			changeEareColor["aA"] = defaults.selectColor;
			initKeyboardData();
		} else if (idArr[keyPos].type == 3) { // 清空
			clearTimeout(gbTimer);
			defaults.htmlDom.innerHTML = "";
			inputValue = "";
			tempLetter = "";
			gbPos = 0;
			showGB();
		}
	} else if (focusArea == 1) { // 文本区域
		if (modeFlag == 1) { // 全部
			var tempWordStr = wordArr[wordPage][wordPos].word;
			if (getCharacterLength(inputValue) + getCharacterLength(tempWordStr) <= defaults.strLength) {
				if (gbPos == inputValue.length) {
					inputValue += tempWordStr;
					gbPos = inputValue.length;
				} else {
					inputValue = inputValue.substring(0, gbPos) + tempWordStr + inputValue.substring(gbPos, inputValue.length);
					gbPos = gbPos + tempWordStr.length;
				}
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
				if (beforeArr.length > 0) {
					var removeStr = beforeArr.shift();
					tempLetter = tempLetter.replace(removeStr, "");
				} else {
					tempLetter = "";
					beforeArr = [];
				}
				if (tempLetter == "") {
					getWordData(tempWordStr);
				} else {
					if (beforeArr.length > 0) {
						getAjaxData(beforeArr[0]);
					} else {
						getAjaxData(tempLetter);
					}
				}
			}
		} else { // 单字
			tempLetter = "";
			var tempWordStr = wordArr[wordPage][wordPos].word;
			if (getCharacterLength(inputValue) + getCharacterLength(tempWordStr) <= defaults.strLength) {
				if (gbPos == inputValue.length) {
					inputValue += tempWordStr;
					gbPos = inputValue.length;
				} else {
					inputValue = inputValue.substring(0, gbPos) + tempWordStr + inputValue.substring(gbPos, inputValue.length);
					gbPos = gbPos + tempWordStr.length;
				}
				getWordData(tempWordStr);
			}
			beforeArr = [];
		}
		if (defaults.type == 1) {
			showPasswordTxt(function() {
				showGB();
			})
		} else {
			showGB();
		}
		inputPosition();
	} else if (focusArea == 2) { // 确定按钮
		isIFElseBuffer();
		$("keyword").style.height = "55px";
		$("wordOpera0").innerHTML = tempT6Value;
		wordPage = 0;
		currWordPage = 1;
		isExpansion = 0;
		$("inputButton").style.backgroundColor = globalColorConf.tdBgColor1;
		$("inputButton").style.color = globalColorConf.inputButtonColor;
		initElementPosition();
		wordArr = [];
		wordPage = 0;
		currWordPage = 1;
		beforeArr = [];
		setTimeout(function() {
			defaults.callback(inputValue);
		}, 100);
	} else if (focusArea == 3) { // 文本箭头
		if (isExpansion == 0) {
			$("keyword").style.height = "242px";
			tempT6Value = $("wordOpera0").innerHTML;
			modeFlag = 0;
			$("wordOpera0").innerHTML = "<span style='font-size:" + changeEareFontSize["QD"] + ";'>全部<span style='font-size:14px; color:" + changeEareColor["QD"] + "; '>/单字</span></span>";
			isExpansion = 1;
			$("txtRight").style.visibility = "visible";
		} else if (isExpansion == 1) {
			$("keyword").style.height = "55px";
			$("wordOpera0").innerHTML = tempT6Value;
			wordPage = 0;
			currWordPage = 1;
			showWord();
			isExpansion = 0;
			$("txtRight").style.visibility = "hidden";
		}
	} else if (focusArea == 6) { // 文本操作 
		if (wordOperaPos == 0) { // 全部、单字点击
			if (modeFlag == 0) { // 全部切换单字
				modeFlag = 1;
				$("wordOpera0").innerHTML = "<span style='font-size:" + changeEareFontSize["QD"] + "'>单字<span style='font-size:14px; color:" + defaults.selectColor + ";'>/全部</span></span>";
				if (beforeArr.length > 0) {
					getAjaxData(beforeArr[0]);
				} else {
					if (tempLetter != "") {
						getAjaxData(tempLetter);
					}
				}
			} else { // 单字切换全部
				modeFlag = 0;
				$("wordOpera0").innerHTML = "<span style='font-size:20px;'>全部<span style='font-size:14px; color:" + defaults.selectColor + ";'>/单字</span></span>";
				if (tempLetter != "") {
					getAjaxData(tempLetter);
				}
			}
		} else if (wordOperaPos == 1) { // 文本向上切换
			if (isExpansion) {
				wordPageOprea(-1);
			}
		} else if (wordOperaPos == 2) { // 文本向下切换
			if (isExpansion) {
				wordPageOprea(1);
			}
		}
	}
}

/**
 * [showWord description]
 * @fun
 * @desc 显示搜索文本
 * @DateTime 2017-04-17T15:03:20+0800
 * @return   {[type]}                 [description]
 */
function showWord() {
	var tempCount = 0;
	var tempWidth = "";
	for (var i = 0; i < 4; i++) {
		var tempPage = (currWordPage - 1) * 4 + i;
		if (tempPage < wordArr.length) {
			for (var j = 0; j < 12; j++) {
				if (j < wordArr[(currWordPage - 1) * 4 + i].length) {
					tempWidth = wordArr[tempPage][j].cellNumber * tabW;
					if (j == 0) {
						tempCount = 0;
						var marginLeft = 30;
						if (navigatorFlag == "iPanel") {
							marginLeft = 28;
							$("word" + i + "_" + j).style.width = (tempWidth + 28) + "px";
						} else {
							$("word" + i + "_" + j).style.width = (tempWidth + 29) + "px";
						}
						$("word" + i + "_" + j).style.left = "0px";
						$("wordfirst" + i + "_" + j).style.left = marginLeft + "px";
						$("wordfirst" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth + "px" : (tempWidth - 1) + "px";
						$("wordfirst" + i + "_" + j).innerHTML = wordArr[tempPage][j].word;
						tempCount += tempWidth + marginLeft;
					} else {
						$("word" + i + "_" + j).style.left = navigatorFlag == "iPanel" ? tempCount + 1 + "px" : tempCount + "px";
						$("word" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth - 1 + "px" : (tempWidth - 1) + "px";
						$("word" + i + "_" + j).innerHTML = wordArr[tempPage][j].word;
						tempCount += tempWidth;
					}

				} else {
					tempWidth = tabW;
					if (j == 0) {
						tempCount = 0;
						var marginLeft = 30;
						if (navigatorFlag == "iPanel") {
							marginLeft = 28;
							$("word" + i + "_" + j).style.width = (tempWidth + 28) + "px";
						} else {
							$("word" + i + "_" + j).style.width = (tempWidth + 29) + "px";
						}
						$("word" + i + "_" + j).style.left = "0px";
						$("wordfirst" + i + "_" + j).style.left = marginLeft + "px";
						$("wordfirst" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth + "px" : (tempWidth - 1) + "px";
						$("wordfirst" + i + "_" + j).innerHTML = "&nbsp;&nbsp;";
						tempCount += tempWidth + marginLeft;
					} else {
						$("word" + i + "_" + j).style.left = navigatorFlag == "iPanel" ? tempCount + 1 + "px" : tempCount + "px";
						$("word" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth - 1 + "px" : (tempWidth - 1) + "px";
						$("word" + i + "_" + j).innerHTML = "&nbsp;&nbsp;";
						tempCount += tempWidth;
					}
				}
			}
		} else {
			for (var j = 0; j < 12; j++) {
				tempWidth = tabW;
				if (j == 0) {
					tempCount = 0;
					var marginLeft = 30;
					if (navigatorFlag == "iPanel") {
						marginLeft = 28;
						$("word" + i + "_" + j).style.width = (tempWidth + 28) + "px";
					} else {
						$("word" + i + "_" + j).style.width = (tempWidth + 29) + "px";
					}
					$("word" + i + "_" + j).style.left = "0px";
					$("wordfirst" + i + "_" + j).style.left = marginLeft + "px";
					$("wordfirst" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth + "px" : (tempWidth - 1) + "px";
					$("wordfirst" + i + "_" + j).innerHTML = "&nbsp;&nbsp;";
					tempCount += tempWidth + marginLeft;
				} else {
					$("word" + i + "_" + j).style.left = navigatorFlag == "iPanel" ? tempCount + 1 + "px" : tempCount + "px";
					$("word" + i + "_" + j).style.width = navigatorFlag == "iPanel" ? tempWidth - 1 + "px" : (tempWidth - 1) + "px";
					$("word" + i + "_" + j).innerHTML = "&nbsp;&nbsp;";
					tempCount += tempWidth;
				}
			}
		}
	}
	if (focusArea == 1) {
		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
	}
}

/**
 * [wordMove description]
 * @fun
 * @desc 文本焦点移动
 * @DateTime 2017-04-17T15:04:06+0800
 * @param    {[type]}                 _num [description]
 * @return   {[type]}                      [description]
 */
function wordMove(_num) {
	if (Math.abs(_num) == 1) {
		if (wordPos + _num < 0 && _num == -1) return;

		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
		if (wordPos + _num > wordArr[wordPage].length - 1 && _num == 1) {
			//移动到箭头
			$("r_arrow").style.backgroundColor = defaults.selectbgColor;
			$("r_arrow").style.color = globalColorConf.selectColor;
			focusArea = 3;
			return;
		}
		wordPos += _num;
	} else {
		if (isExpansion == 1) {
			if (_num < 0) {
				$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
				$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
				if (wordPage == 0) { //切换到确定按钮
					tempfocusArea = focusArea;
					showAndHideButton(true);
					return;
				} else {
					wordPage--;
				}
			} else {
				if (wordPage == wordArr.length - 1) {
					return;
				} else {
					$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
					$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
					wordPage++;
					if (wordPos > wordArr[wordPage].length - 1) {
						wordPos = wordArr[wordPage].length - 1;
					}
				}
			}
		} else {
			$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
			$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
			if (_num > 0) { // 切换到键盘
				keyMove(0);
				focusArea = 0;
				return;
			} else if (_num < 0) { // 切换到确定按钮
				tempfocusArea = focusArea;
				showAndHideButton(true);
				return;
			}
		}
	}

	var tempPage = Math.ceil((wordPage + 1) / 4);
	if (tempPage != currWordPage) {
		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
		currWordPage = tempPage;
		wordPos = 0;
		showWord();
		return;
	}

	$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
	$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;

}

/**
 * [GBMove description]
 * @fun
 * @desc 光标移动
 * @DateTime 2017-04-18T15:26:09+0800
 * @param    {[type]}                 _num [description]
 */
function GBMove(_num){
	if (gbPos + _num < 0) return;
	if (gbPos + _num > inputValue.length) {
		if (_num == 1) {
			$("keyinput").style.backgroundColor = globalColorConf.tdBgColor3;
			$("inputValue").style.color = globalColorConf.inputValueColor;
			showAndHideButton(true);
		} else {
			bottomChangeArea();
		}
		return;
	}
	gbPos += _num;
	showGB();
}

/**
 * [bottomChangeArea description]
 * @fun
 * @desc 焦点移动到底部
 * @DateTime 2017-04-18T15:27:03+0800
 * @return   {[type]}                 [description]
 */
function bottomChangeArea(){
	$("keyinput").style.backgroundColor = globalColorConf.tdBgColor3;
	$("inputValue").style.color = globalColorConf.inputValueColor;
	if (tempfocusArea == 0) {
		keyMove(0);
	} else if (tempfocusArea == 3) {
		$("r_arrow").style.backgroundColor = defaults.selectbgColor;
		$("r_arrow").style.color = globalColorConf.selectColor;
	} else {
		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = defaults.selectbgColor;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.selectColor;
	}
	focusArea = tempfocusArea;
}

/**
 * [goBack description]
 * @fun
 * @desc 返回键
 * @DateTime 2017-04-17T14:51:36+0800
 * @return   {[type]}                 [description]
 */
function goBack() {
	iDebug("input--index.php----fun goBack--inputValue:" + inputValue + "--tempLetter:" + tempLetter + "--gbPos:" + gbPos);
	if ((inputValue + tempLetter).length > 0) {
		if (focusArea == 1) {
			$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
			$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
		}
		if (tempLetter.length > 0) {
			tempLetter = tempLetter.substring(0, tempLetter.length - 1);
			beforeArr = getPinyinArr(tempLetter);
			getAjaxData(tempLetter);
		} else {
			if (gbPos == inputValue.length) {
				inputValue = inputValue.substring(0, inputValue.length - 1);
				gbPos = inputValue.length;
			} else {
				inputValue = inputValue.substring(0, gbPos - 1) + inputValue.substring(gbPos, inputValue.length);
				gbPos = gbPos - 1;
				if (gbPos < 0) gbPos = 0;
			}
			getWordData(inputValue.substring(gbPos - 1, gbPos));
		}


		if (tempLetter != "") {
			showGB();
		} else {
			if (inputValue == "") {
				window.clearTimeout(gbTimer);
				defaults.htmlDom.innerHTML = defaults.intr;
			} else {
				showGB();
			}
		}
		inputPosition();
	} else {
		exitWidget();
	}
}

/**
 * [exitWidget description]
 * @fun
 * @desc 隐藏键盘
 * @DateTime 2017-04-17T17:38:40+0800
 * @return   {[type]}                 [description]
 */
function exitWidget(){
	if (focusArea == 0) {
		if (idArr[keyPos].type == 0) { // 数字
			classname = globalColorConf.tdBgColor2;
		} else if (idArr[keyPos].type == 1 || idArr[keyPos].type == 3) { // 字母
			classname = globalColorConf.tdBgColor3;
		} else {
			classname = globalColorConf.tdBgColor1;
		}

		for (var i = 0; i < idArr[keyPos].ids.length; i++) {
			$(idArr[keyPos].ids[i]).style.backgroundColor = classname;
		}
		$(idArr[keyPos].ids[0]).style.color = defaults.color;
	} else if (focusArea == 1) {
		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
	} else if (focusArea == 2) {
		$("inputButton").style.backgroundColor = globalColorConf.tdBgColor1;
		$("inputButton").style.color = globalColorConf.inputButtonColor;
	} else if (focusArea == 3) {
		$("r_arrow").style.backgroundColor = globalColorConf.tdBgColor1;
		$("r_arrow").style.color = globalColorConf.arrowColor;
	} else if (focusArea == 4) {
		$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
		$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
	} else if (focusArea == 5) {
		$("keyinput").style.backgroundColor = globalColorConf.tdBgColor3;
		$("inputValue").style.color = globalColorConf.inputValueColor;
	} else if (focusArea == 6) {
		$("wordOpera" + wordOperaPos).style.backgroundColor = globalColorConf.tdBgColor1;
		$("wordOpera" + wordOperaPos).style.color = globalColorConf.arrowColor;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 12; j++) {
			if (j == 0) {
				$("wordfirst" + i + "_" + j).innerHTML = "";
			} else {
				$("word" + i + "_" + j).innerHTML = "";
			}
		}
	}
	$("keyword").style.height = "55px";
	initElementPosition();
	setTimeout(function() {
		if (typeof defaults.backmethod) defaults.backmethod(); //确保当前页面方法是否存在
	}, 100);
}

/**
 * [isIFElseBuffer description]
 * @fun
 * @desc 判断是否超过最大长度
 * @DateTime 2017-04-17T14:52:47+0800
 * @return   {Boolean}                [description]
 */
function isIFElseBuffer(){
	if (defaults.type == 0) { // 字符串输入模式
		var tempSpeLength = getCharacterLength(inputValue);
	} else { // 密码输入模式
		var tempSpeLength = inputValue.length;
	}
	if (tempSpeLength == defaults.strLength) return true;

	if (tempLetter != "") {
		if (tempSpeLength + tempLetter.length < defaults.strLength) {
			if (defaults.isEng < 2) {
				inputValue += tempLetter;
				gbPos = inputValue.length;
			}
			tempLetter = "";
			beforeArr = [];
		}
		if (inputValue.length == defaults.strLength) {
			showGB();
			return true;
		} else {
			showGB();
		}
	}
	return false;
}

/**
 * [getPinyinArr description]
 * @fun
 * @desc 根据输入的字母获取匹配的拼音
 * @DateTime 2017-04-17T15:06:08+0800
 * @param    {[type]}                 _pinyin [description]
 * @return   {[type]}                         [description]
 */
function getPinyinArr(_pinyin) {
	var arr = [];
	var str = "";

	function matchPinyinStr(index) {
		str += _pinyin.substring(index, index + 1);
		var r = matchPinyin(str);
		if (r == null) {
			var temppinyin = str.substring(0, str.length - 1);
			arr.push(temppinyin);
			str = str.replace(arr.join(""), "");
		}
		index++;
		if (index <= _pinyin.length - 1) {
			matchPinyinStr(index);
		}
	}
	matchPinyinStr(0);
	return arr;
}

/**
 * [matchPinyin description]
 * @fun
 * @desc 匹配拼音是否存在
 * @DateTime 2017-04-17T15:07:24+0800
 * @param    {[type]}                 _pinyin [description]
 * @return   {[type]}                         [description]
 */
function matchPinyin(_pinyin){
	var re = new RegExp(_pinyin, "i");
	var r = re.exec(pinyin);
	return r;
}

/**
 * [getAjaxData description]
 * @fun
 * @desc 字母获取汉字, 拼音查询
 * @DateTime 2017-04-17T15:08:53+0800
 * @param    {[type]}                 _data [description]
 * @return   {[type]}                       [description]
 */
function getAjaxData(_data) {
	_data = _data.toLowerCase();
	var url = reqIp + "?pinyin=" + _data + "&dict=" + defaults.dict + "&pn=0&num=200";
	var xmlhttp;
	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var arr = eval('(' + xmlhttp.responseText + ')');
			arr = arr[0];
			var tempArr = [];
			for (var i = 0; i < arr.length - 1; i++) {
				navigatorFlag == "iPanel" ? tempArr.push(iPanel.getDisplayString(arr[i][0])) : tempArr.push(arr[i][0]);
			}

			if (arr.length > 0 && arr[arr.length - 1][0] != "end") {
				navigatorFlag == "iPanel" ? tempArr.push(iPanel.getDisplayString(arr[arr.length - 1][0])) : tempArr.push(arr[arr.length - 1][0]);
			}
			var tempIndex = 0;
			if (tempArr.length > 0) {
				wordArr = [];
			}
			var cellNumber = 0;
			var rowPos = 0;
			var tempRowArr = [];
			for (var i = 0; i < tempArr.length; i++) {
				var temp = cellNumber;
				var tempCharacterLen = getCrossCellNumber(getCharacterLength(tempArr[i]));
				if (tempCharacterLen > 0) {
					cellNumber += tempCharacterLen;
					if (cellNumber > 12) {
						//将上一行最后一个格子跨满一行
						tempRowArr[tempRowArr.length - 1].cellNumber = tempRowArr[tempRowArr.length - 1].cellNumber + (12 - temp);
						cellNumber = tempCharacterLen;
						wordArr.push(tempRowArr);
						tempRowArr = [];
						tempRowArr.push({
							"word": tempArr[i],
							cellNumber: tempCharacterLen
						});
						if (i == tempArr.length - 1) {
							wordArr.push(tempRowArr);
						}
					} else {
						tempRowArr.push({
							"word": tempArr[i],
							cellNumber: tempCharacterLen
						});
						tempIndex++;
						if (i == tempArr.length - 1) {
							wordArr.push(tempRowArr);
						}
					}
				}
			}
			wordPage = 0;
			wordPos = 0;
			showWord();
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

/**
 * [getCrossCellNumber description]
 * @fun
 * @desc 基于字节获取跨格子的个数
 * @DateTime 2017-04-17T15:10:17+0800
 * @param    {[type]}                 _character [description]
 * @return   {[type]}                            [description]
 */
function getCrossCellNumber(_character){
	var len = 0;
	if (_character > 0 && _character <= 2) {
		len = 1;
	} else if (_character > 2 && _character <= 6) {
		len = 2;
	} else if (_character > 6 && _character <= 12) {
		len = 4;
	} else if (_character > 12 && _character <= 16) {
		len = 5;
	} else if (_character > 16 && _character <= 22) {
		len = 6;
	} else if (_character > 22 && _character <= 26) {
		len = 7;
	} else if (_character > 26 && _character <= 30) {
		len = 8;
	} else if (_character > 31 && _character <= 34) {
		len = 9;
	} else if (_character > 34 && _character <= 40) {
		len = 10;
	} else if (_character > 40 && _character <= 44) {
		len = 11;
	} else if (_character > 44 && _character <= 48) {
		len = 12;
	} else if (_character > 48 && _character <= 54) {
		len = 13;
	} else if (_character > 54 && _character <= 58) {
		len = 14;
	} else if (_character > 58 && _character <= 62) {
		len = 15;
	} else if (_character > 62 && _character <= 68) {
		len = 16;
	} else if (_character > 68 && _character <= 72) {
		len = 17;
	} else if (_character > 72 && _character <= 78) {
		len = 18;
	} else if (_character > 78) {
		len = 19;
	}
	return len;
}	

/**
 * [getWordData description]
 * @fun
 * @desc 词联想, 联想输入法查询
 * @DateTime 2017-04-17T15:11:29+0800
 * @param    {[type]}                 _data [description]
 * @return   {[type]}                       [description]
 */
function getWordData(_data) {
	var url = reqIp + "?wd=" + encodeURI(_data) + "&pn=0&num=200";
	var xmlhttp;
	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var arr = eval('(' + xmlhttp.responseText + ')');
			if (typeof arr.ret != "undefined") return;
			arr = arr[0];
			var tempArr = [];
			for (var i = 0; i < arr.length - 1; i++) {
				navigator.userAgent.toLowerCase().indexOf("ipanel") != -1 ? tempArr.push(iPanel.getDisplayString(arr[i][0])) : tempArr.push(arr[i][0]);
			}
			if (arr.length > 0 && arr[arr.length - 1][0] != "end") {
				navigator.userAgent.toLowerCase().indexOf("ipanel") != -1 ? tempArr.push(iPanel.getDisplayString(arr[arr.length - 1][0])) : tempArr.push(arr[arr.length - 1][0]);
			}
			var tempIndex = 0;
			if (tempArr.length > 0) {
				wordArr = [];
			}
			var cellNumber = 0;
			var rowPos = 0;
			var tempRowArr = [];
			for (var i = 0; i < tempArr.length; i++) {
				var temp = cellNumber;
				var tempCharacterLen = getCrossCellNumber(getCharacterLength(tempArr[i]));
				if (tempCharacterLen > 0) {
					cellNumber += tempCharacterLen;
					if (cellNumber > 12) {
						//将上一行最后一个格子跨满一行
						tempRowArr[tempRowArr.length - 1].cellNumber = tempRowArr[tempRowArr.length - 1].cellNumber + (12 - temp);
						cellNumber = tempCharacterLen;
						wordArr.push(tempRowArr);
						tempRowArr = [];
						tempRowArr.push({
							"word": tempArr[i],
							cellNumber: tempCharacterLen
						});
						if (i == tempArr.length - 1) {
							wordArr.push(tempRowArr);
						}
					} else {
						tempRowArr.push({
							"word": tempArr[i],
							cellNumber: tempCharacterLen
						});
						tempIndex++;
						if (i == tempArr.length - 1) {
							wordArr.push(tempRowArr);
						}
					}
				}
			}

			$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
			$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
			if (isExpansion == 1) {
				$("keyword").style.height = "55px";
				$("wordOpera0").innerHTML = tempT6Value;
				currWordPage = 1;
				isExpansion = 0;
				$("txtRight").style.visibility = "hidden";
			}
			wordPage = 0;
			wordPos = 0;
			showWord();
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

/**
 * [wordPageOprea description]
 * @fun
 * @desc 汉字翻页
 * @DateTime 2017-04-17T17:33:02+0800
 * @param    {[type]}                 _num [description]
 * @return   {[type]}                      [description]
 */
function wordPageOprea(_num) {
	if (currWordPage + _num < 1 || currWordPage + _num > wordArr.length) return;
	$("word" + wordPage % 4 + "_" + wordPos).style.backgroundColor = globalColorConf.tdBgColor4;
	$("word" + wordPage % 4 + "_" + wordPos).style.color = globalColorConf.wordColor;
	currWordPage += _num;
	wordPage = (currWordPage - 1) * 4;
	wordPos = 0;
	showWord();
}


/**
 * [getXX description]
 * @fun
 * @desc 将字符串转换为*
 * @DateTime 2017-04-17T13:54:02+0800
 * @param    {[type]}                 str [description]
 * @return   {[type]}                     [description]
 */
function getXX(str) {
	var tempStr = "";
	for (var i = 0; i < str.length; i++) {
		tempStr += "*";
	}
	return tempStr;
}

/**
 * [getCharacterLength description]
 * @fun
 * @desc 获取字符串长度
 * @DateTime 2017-04-17T13:53:18+0800
 * @param    {[type]}                 _str [description]
 * @return   {[type]}                      [description]
 */
function getCharacterLength(_str) {
	var _str = _str.replace(/[\(\)\-\\\[\]]/g, "0");
	var re = "";
	if (navigatorFlag == "iPanel" && !isAdvanceFlag) {
		re = /[^\u2E80-\uFE4F]+/gi; //iPanel匹配中文不一样，要加个非判断
	} else { //chrome,advance
		re = /[\u2E80-\uFE4F]+/gi;
	}
	var bb = _str.match(re);
	if (typeof bb == "undefined" || bb == "null") {
		return _str.length;
	}
	var cc = "";
	if (bb != null) {
		cc = bb.join("");
	}
	var totalLen = _str.length;
	var chLen = cc.length;
	var engLen = totalLen - chLen;
	var tW = chLen * 2 + engLen;
	return tW;
}

/**
 * [extend description]
 * @fun
 * @desc 扩展对象
 * @DateTime 2017-04-17T11:57:15+0800
 * @param    {[type]}                 destination [待修改对象]
 * @param    {[type]}                 source      [待合并到第一个对象的对象。 ]
 * @return   {[type]}                             [description]
 */
function extend(destination, source){
	for(var property in source){
		destination[property] = source[property];
	}
	return destination;
}

function $(id){
	return document.getElementById(id);	
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
window.onload = init;
</script>
</head>
<body style="width:1280px; height:720px; overflow:hidden;" bgcolor="transparent">

<div id="keyinputFrame" style="position:absolute; top:0px; left:0px; width:1280px; height:720px;">
<div id="keyinput" style="position:absolute; top:422px; left:0px; width:1280px; height:57px;">
    <div id="inputValue" style="position:absolute; top:13px; left:48px; width:1200px; height:auto; line-height:40px;"></div>
    <div id="inputButton" style="position:absolute; bottom:0px; right:0px; width:123px; height:55px; line-height:55px; text-indent:30px;">确定</div>
</div>

<!-- 键盘 -->
<div id="keybord" style="position:absolute; left:0px;  top:534px; width:1280px; height:186px;">
	<table id="keytable" width="100%" border="0" cellspacing="0" cellpadding="0" rules="all">
		<tr>
			<td id="num1_1" class="numbg" style="width: 29px; border-right: none;"></td>
			<td id="num1" class="numbg" style="border-left: none;">1</td>
			<td id="num2" class="numbg">2</td>
			<td id="num3" class="numbg">3</td>
			<td id="e0" class="letterbg">q</td>
			<td id="e1" class="letterbg">w</td>
			<td id="e2" class="letterbg">e</td>
			<td id="e3" class="letterbg">r</td>
			<td id="e4" class="letterbg">t</td>
			<td id="e5" class="letterbg">y</td>
			<td id="e6" class="letterbg">u</td>
			<td id="e7" class="letterbg">i</td>
			<td id="e8" class="letterbg">o</td>
			<td id="e9" class="letterbg" style="border-right: none;">p</td>
			<td id="e9_9" class="letterbg" style="width: 29px; border-left: none;"></td>
		</tr>
		<tr>
			<td id="num4_4" class="numbg" style="width: 29px; border-right: none;"></td>
			<td id="num4" class="numbg" style="border-left: none;">4</td>
			<td id="num5" class="numbg">5</td>
			<td id="num6" class="numbg">6</td>
			<td id="e10" class="opreabg">A/a</td>
			<td id="e11" class="letterbg">a</td>
			<td id="e12" class="letterbg">s</td>
			<td id="e13" class="letterbg">d</td>
			<td id="e14" class="letterbg">f</td>
			<td id="e15" class="letterbg">g</td>
			<td id="e16" class="letterbg">h</td>
			<td id="e17" class="letterbg">j</td>
			<td id="e18" class="letterbg">k</td>
			<td id="e19" class="letterbg" style="border-right: none;">l</td>
			<td id="e19_19" class="letterbg" style="width: 29px; border-left: none;"></td>
		</tr>
		<tr>
			<td id="num7_7" class="numbg" style="width: 29px; border-right: none; border-bottom: none;"></td>
			<td id="num7" class="numbg" style="border-left: none; border-bottom: none;">7</td>
			<td id="num8" class="numbg" style="border-bottom: none;">8</td>
			<td id="num9" class="numbg" style="border-bottom: none;">9</td>
			<td id="num0" class="numbg" style="border-bottom: none;">0</td>
			<td id="e20" class="opreabg" style="border-bottom: none;">英/中</td>
			<td id="e21" class="letterbg" style="border-bottom: none;">z</td>
			<td id="e22" class="letterbg" style="border-bottom: none;">x</td>
			<td id="e23" class="letterbg" style="border-bottom: none;">c</td>
			<td id="e24" class="letterbg" style="border-bottom: none;">v</td>
			<td id="e25" class="letterbg" style="border-bottom: none;">b</td>
			<td id="e26" class="letterbg" style="border-bottom: none;">n</td>
			<td id="e27" class="letterbg" style="border-bottom: none;">m</td>
			<td id="t0" class="letterbg" style="border-right: none; border-bottom: none; font-size: 28px; text-align: left; text-indent: 30px;">清空</td>
			<td id="t0_0" class="letterbg" style="width: 29px; border-left: none; border-bottom: none;"></td>
		</tr>
		<tr>
			<td id="num7_7_7" class="numbg" style="width: 29px; height: 29px; border-right: none; border-top: none;"></td>
			<td id="num7_7_7_7" class="numbg" style=" height: 29px; border-left: none; border-top: none;"></td>
			<td id="num8_8" class="numbg" style=" height: 29px; border-top: none;"></td>
			<td id="num9_9" class="numbg" style=" height: 29px; border-top: none;"></td>
			<td id="num0_0" class="numbg" style=" height: 29px; border-top: none;"></td>
			<td id="e20_20" class="opreabg" style=" height: 29px; border-top: none;"></td>
			<td id="e21_21" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e22_22" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e23_23" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e24_24" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e25_25" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e26_26" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="e27_27" class="letterbg" style=" height: 29px; border-top: none;"></td>
			<td id="t0_0_0" class="letterbg" style=" height: 29px; border-right: none; border-top: none;"></td>
			<td id="t0_0_0_0" class="letterbg" style="width: 29px; height: 29px; border-left: none; border-top: none;"></td>
		</tr>
	</table>
</div>	

<!-- 搜索文本显示 -->
<div id="keyword" style="position: absolute; width: 1188px; top: 479px; height: 55px; line-height: 55px; visibility: visible; overflow: hidden;">
	<div id="wordRow0" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 55px;" class="wordbottomborder">
		<div id="word0_0" style="position:absolute; left:0px; top:0px; height:100%; width:89px; z-index:19;" class="wordrightborder">
			<div id="wordfirst0_0" style="position:absolute; top:0px; left:28px; width:60px; height:100%; text-align:center;"></div>
		</div>
		<div id="word0_1" style="position:absolute; left:89px; top:0px;height:100%; width:60px; text-align:center; z-index:18;" class="wordrightborder"></div>
		<div id="word0_2" style="position:absolute; left:150px; top:0px; height:100%; width:60px; text-align:center; z-index:17;" class="wordrightborder"></div>
		<div id="word0_3" style="position:absolute; left:211px; top:0px; height:100%; width:60px; text-align:center; z-index:16;" class="wordrightborder"></div>
		<div id="word0_4" style="position:absolute; left:272px; top:0px; height:100%; width:60px; text-align:center; z-index:15;" class="wordrightborder"></div>
		<div id="word0_5" style="position:absolute; left:333px; top:0px; height:100%; width:60px; text-align:center; z-index:14;" class="wordrightborder"></div>
		<div id="word0_6" style="position:absolute; left:394px; top:0px; height:100%; width:60px; text-align:center; z-index:13;" class="wordrightborder"></div>
		<div id="word0_7" style="position:absolute; left:455px; top:0px; height:100%; width:60px; text-align:center; z-index:12;" class="wordrightborder"></div>
		<div id="word0_8" style="position:absolute; left:516px; top:0px; height:100%; width:60px; text-align:center; z-index:11;" class="wordrightborder"></div>
		<div id="word0_9" style="position:absolute; left:577px; top:0px; height:100%; width:60px; text-align:center; z-index:10;" class="wordrightborder"></div>
		<div id="word0_10" style="position:absolute; left:638px; top:0px; height:100%; width:60px; text-align:center; z-index:9;" class="wordrightborder"></div>
		<div id="word0_11" style="position:absolute; left:699px; top:0px; height:100%; width:60px; text-align:center; z-index:8;" class="wordrightborder"></div>
	</div>

	<div id="wordRow1" style="position:absolute; top:56px; left:0px; width:100%; height:55px;" class="wordbottomborder wordtopborder">
		<div id="word1_0" style="position:absolute; left:0px; top:0px; height:100%; width:89px; z-index:19;" class="wordrightborder"><div id="wordfirst1_0" style="position:absolute; top:0px; left:28px; width:60px; height:100%; text-align:center;"></div></div>
		<div id="word1_1" style="position:absolute; left:89px; top:0px; height:100%; width:60px; text-align:center; z-index:18;" class="wordrightborder"></div>
		<div id="word1_2" style="position:absolute; left:150px; top:0px; height:100%; width:60px; text-align:center; z-index:17;" class="wordrightborder"></div>
		<div id="word1_3" style="position:absolute; left:211px; top:0px; height:100%; width:60px; text-align:center; z-index:16;" class="wordrightborder"></div>
		<div id="word1_4" style="position:absolute; left:272px; top:0px; height:100%; width:60px; text-align:center; z-index:15;" class="wordrightborder"></div>
		<div id="word1_5" style="position:absolute; left:333px; top:0px; height:100%; width:60px; text-align:center; z-index:14;" class="wordrightborder"></div>
		<div id="word1_6" style="position:absolute; left:394px; top:0px; height:100%; width:60px; text-align:center; z-index:13;" class="wordrightborder"></div>
		<div id="word1_7" style="position:absolute; left:455px; top:0px; height:100%; width:60px; text-align:center; z-index:12;" class="wordrightborder"></div>
		<div id="word1_8" style="position:absolute; left:516px; top:0px; height:100%; width:60px; text-align:center; z-index:11;" class="wordrightborder"></div>
		<div id="word1_9" style="position:absolute; left:577px; top:0px; height:100%; width:60px; text-align:center; z-index:10;" class="wordrightborder"></div>
		<div id="word1_10" style="position:absolute; left:638px; top:0px; height:100%; width:60px; text-align:center; z-index:9;" class="wordrightborder"></div>
		<div id="word1_11" style="position:absolute; left:699px; top:0px; height:100%; width:60px; text-align:center; z-index:8;" class="wordrightborder"></div>
	</div>
	
	<div id="wordRow2" style="position:absolute; top:112px; left:0px; width:100%; height:55px;" class="wordbottomborder wordtopborder">
		<div id="word2_0" style="position:absolute; left:0px; top:0px; height:100%; width:89px; z-index:19;" class="wordrightborder"><div id="wordfirst2_0" style="position:absolute; top:0px; left:28px; width:60px; height:100%; text-align:center;"></div></div>
		<div id="word2_1" style="position:absolute; left:89px; top:0px; height:100%; width:60px; text-align:center; z-index:18;" class="wordrightborder"></div>
		<div id="word2_2" style="position:absolute; left:150px; top:0px; height:100%; width:60px; text-align:center; z-index:17;" class="wordrightborder"></div>
		<div id="word2_3" style="position:absolute; left:211px; top:0px; height:100%; width:60px; text-align:center; z-index:16;" class="wordrightborder"></div>
		<div id="word2_4" style="position:absolute; left:272px; top:0px; height:100%; width:60px; text-align:center; z-index:15;" class="wordrightborder"></div>
		<div id="word2_5" style="position:absolute; left:333px; top:0px; height:100%; width:60px; text-align:center; z-index:14;" class="wordrightborder"></div>
		<div id="word2_6" style="position:absolute; left:394px; top:0px; height:100%; width:60px; text-align:center; z-index:13;" class="wordrightborder"></div>
		<div id="word2_7" style="position:absolute; left:455px; top:0px; height:100%; width:60px; text-align:center; z-index:12;"  class="wordrightborder"></div>
		<div id="word2_8" style="position:absolute; left:516px; top:0px; height:100%; width:60px; text-align:center; z-index:11;" class="wordrightborder"></div>
		<div id="word2_9" style="position:absolute; left:577px; top:0px; height:100%; width:60px; text-align:center; z-index:10;" class="wordrightborder"></div>
		<div id="word2_10" style="position:absolute; left:638px; top:0px; height:100%; width:60px; text-align:center; z-index:9;" class="wordrightborder"></div>
		<div id="word2_11" style="position:absolute; left:699px; top:0px; height:100%; width:60px; text-align:center; z-index:8;" class="wordrightborder"></div>
	</div>

	<div id="wordRow3" style="position:absolute; top:168px; left:0px; width:100%; height:76px;" class="wordtopborder">
		<div id="word3_0" style="position:absolute; left:0px; top:0px; height:100%; width:89px; z-index:19;" class="wordrightborder"><div id="wordfirst3_0" style="position:absolute; top:0px; left:28px; width:60px; height:100%; text-align:center;"></div></div>
		<div id="word3_1" style="position:absolute; left:89px; top:0px; height:100%; width:60px; text-align:center; z-index:18;" class="wordrightborder"></div>
		<div id="word3_2" style="position:absolute; left:150px; top:0px; height:100%; width:60px; text-align:center; z-index:17;" class="wordrightborder"></div>
		<div id="word3_3" style="position:absolute; left:211px; top:0px; height:100%; width:60px; text-align:center; z-index:16;" class="wordrightborder"></div>
		<div id="word3_4" style="position:absolute; left:272px; top:0px; height:100%; width:60px; text-align:center; z-index:15;" class="wordrightborder"></div>
		<div id="word3_5" style="position:absolute; left:333px; top:0px; height:100%; width:60px; text-align:center; z-index:14;" class="wordrightborder"></div>
		<div id="word3_6" style="position:absolute; left:394px; top:0px; height:100%; width:60px; text-align:center; z-index:13;" class="wordrightborder"></div>
		<div id="word3_7" style="position:absolute; left:455px; top:0px; height:100%; width:60px; text-align:center; z-index:12;" class="wordrightborder"></div>
		<div id="word3_8" style="position:absolute; left:516px; top:0px; height:100%; width:60px; text-align:center; z-index:11;" class="wordrightborder"></div>
		<div id="word3_9" style="position:absolute; left:577px; top:0px; height:100%; width:60px; text-align:center; z-index:10" class="wordrightborder"></div>
		<div id="word3_10" style="position:absolute; left:638px; top:0px; height:100%; width:60px; text-align:center; z-index:9;" class="wordrightborder"></div>
		<div id="word3_11" style="position:absolute; left:699px; top:0px; height:100%; width:60px; text-align:center; z-index:8;" class="wordrightborder"></div>
	</div>  
 </div>

<!-- 文本显示右边操作栏 -->
<div id="txtRight" style="position: absolute; width: 124px; height: 195px;  top: 535px; right:0px; z-index: 99; visibility: hidden;" class="opreabg">
	<table id="txtRightTable" width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td id="wordOpera0" height="54" style="text-indent: 30px;" class="txtOperaBorder"></td>
		</tr>
		<tr>
			<td id="wordOpera1" height="55" style="text-indent: 30px;" class="txtOperaBorder">▲</td>
		</tr>
		<tr>
			<td id="wordOpera2" height="85" style="text-indent: 30px;" class="txtOperaBorder">▼</td>
		</tr>
	</table>
	
</div>
<!-- 文本箭头 --> 
<div id="r_arrow" style="position: absolute; width: 123px; height: 55px; line-height: 55px;  top: 479px; right:0px;  text-indent:30px; z-index: 99;" class="opreabg">▼</div>
	
</div>
</body>
</html>