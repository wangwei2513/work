var dataAjaxPath = "menu.js";
var menuBox = null;
var subMenuBox = null;
var ajaxObj = null;
var menuMaxSize = 5;
var menuLen = 5;
var focusArea = 0;//0表示焦点在一级栏目上，1表示焦点在二级栏目上
var menuPos = mySessionStorage.getItem('menuPos')?parseInt(mySessionStorage.getItem('menuPos')):0;
var subMenuPos = 0;
var filePath = "";
var changePageTimeout = -1;
var getTokenTimeout = -1;

var exitUrl = "";

if(typeof iPanel != "undefined"){
	iPanel.eventFrame.initPage(window);
	iPanel.eventFrame.flag = 2;
}

var menuImageUrl = [{"focus":"images/pic1_01_jd.png","blur":"images/pic1_01.png"},{"focus":"images/pic1_02_jd.png","blur":"images/pic1_02.png"},{"focus":"images/pic1_03_jd.png","blur":"images/pic1_03.png"},{"focus":"images/pic1_04_jd.png","blur":"images/pic1_04.png"},{"focus":"images/pic1_05_jd.png","blur":"images/pic1_05.png"}];

var subMenuLen = [6,5,4,6,6];

var focusLocationArr = [
//我的用电
[{id:0,up:-1,down:1,left:3,right:2},
{id:1,up:0,down:0,left:3,right:2},
{id:2,up:-1,down:-1,left:0,right:3},
{id:3,up:-1,down:4,left:2,right:4},
{id:4,up:3,down:5,left:3,right:0},
{id:5,up:4,down:3,left:2,right:0}],

//停电告知
[{id:0,up:-1,down:1,left:4,right:3},
{id:1,up:0,down:2,left:4,right:3},
{id:2,up:1,down:0,left:4,right:3},
{id:3,up:-1,down:-1,left:0,right:4},
{id:4,up:-1,down:-1,left:3,right:0}],

//业务办理
[{id:0,up:-1,down:-1,left:3,right:1},
{id:1,up:-1,down:2,left:0,right:3},
{id:2,up:1,down:1,left:0,right:3},
{id:3,up:-1,down:-1,left:1,right:0}],

//资讯活动
[{id:0,up:-1,down:1,left:3,right:2},
{id:1,up:0,down:0,left:3,right:2},
{id:2,up:-1,down:-1,left:0,right:3},
{id:3,up:-1,down:4,left:2,right:0},
{id:4,up:3,down:5,left:2,right:0},
{id:5,up:4,down:3,left:2,right:0}],

//企业风采
[{id:0,up:-1,down:1,left:3,right:2},
{id:1,up:0,down:0,left:3,right:2},
{id:2,up:-1,down:-1,left:0,right:3},
{id:3,up:-1,down:4,left:2,right:0},
{id:4,up:3,down:5,left:2,right:0},
{id:5,up:4,down:3,left:2,right:0}]
];

var inputTextArr = ["输入电户号快速绑定","输入电户号快速查询","","输入电户号快速查询<br/>您的专属客服经理","解除绑定"];
var tipArr = ["绑定成功，正在返回","请求超时，请稍后再试","解绑成功，正在返回"];

var inputArea = 0;
var inputValue = "";


var inputTipShowFlag = false;
var resultMsgShowFlag = false;
var resultTipShowFlag = false;
var payTipShowFlag = false;
var inputBtnPos = 0;
var inputBtnPicArr = [{focus:"images/btn1_01_jd.png",blur:"images/btn1_01.png"},{focus:"images/btn1_02_jd.png",blur:"images/btn1_02.png"}];
var inputTextBgArr = {focus:"images/icon1_04_1.png",blur:"images/icon1_04.png"};

document.onkeydown = eventHandler;
document.onirkeydown = eventHandler;
document.onsystemevent = eventHandler;
function eventHandler(key){
  var e = key || event;
  var keycode = e.keyCode || e.which || e.charCode;
  iDebug("index.htm keycode="+keycode);
  if(keycode<=57 && keycode>=48){
		if(inputTipShowFlag && inputArea == 0){
			if(inputValue.length >15 )return;
			var _value = keycode - 48;
			inputValue += _value;
			iDebug("later value="+inputValue);
			$("inputTipText").innerText = inputValue;
			return;
		}
  }
  switch (keycode) {
    case 1:   // up
    case 38:
      changeUD(-1);
      return false;
      break;
    case 2:   // down
    case 40:
      changeUD(1);
      return false;
      break;
    case 3:   // left
    case 37:
	   changeLR(-1);
      return false;
      break;
    case 4:   // right
    case 39:
	  changeLR(1);
      return false;
      break;
    case 13:
	  doSelect();
      return false;
      break;
    case 8:
	case 340:
	case 27:
	case 339:
      goBack();
      event.returnValue = false;
      return false;
      break;
	case 13001:		
		play();
		return false;
	case 13009:	
		pause();
		return false;
	case 13011:
		resume();
		return false;
	case 13002:	
	case 13003:	
	case 13004:	
	case 13010:	
	case 13012:	
	case 13013:
	case 13014:	
		messageTips(keycode);
		return false;
  }
}

function goBack(){
	if(payTipShowFlag || resultMsgShowFlag){
		closeAllTip();
		showTip(4);
	}else if(inputTipShowFlag){
		if(inputArea == 0){
			inputValue = inputValue.substring(0,inputValue.length-1);
			$("inputTipText").innerText = inputValue;
		}else{
			closeAllTip();
			showTip(4);
		}
	}else{
		history.back();
	}
}

function closeAllTip(){
	payTipShowFlag = false;
	$("payDiv").style.visibility = "hidden";
	inputTipShowFlag = false;
	inputValue = "";
	$("inputTipText").innerText = "";
	$("inputTipDiv").style.visibility = "hidden";
	resultTipShowFlag = false;
	$("resultMsg").innerHTML = "";
	$("resultTip").style.visibility = "hidden";
	resultMsgShowFlag = false;
	$("resultMsgDiv").style.visibility = "hidden";
	$("subMenuFocus").style.visibility = "hidden";
}

function showTip(flag){
	if(flag == 0){
		payTipShowFlag = true;
		$("payDiv").style.visibility = "visible";	
	}else if(flag == 1){
		inputTipShowFlag = true;
		$("inputTipDiv").style.visibility = "visible";
	}else if(flag == 2){
		resultTipShowFlag = true;
		$("resultTip").style.visibility = "visible";
	}else if(flag == 3){
		resultMsgShowFlag = true;
		$("resultMsgDiv").style.visibility = "visible";
	}else if(flag == 4){
		$("subMenuFocus").style.visibility = "visible";
	}
}

function hideTip(flag){
	if(flag == 0){
		payTipShowFlag = false;
		$("payDiv").style.visibility = "hidden";	
	}else if(flag == 1){
		inputTipShowFlag = false;
		$("inputTipDiv").style.visibility = "hidden";
	}else if(flag == 2){
		resultTipShowFlag = false;
		$("resultTip").style.visibility = "hidden";
	}else if(flag == 3){
		resultMsgShowFlag = false;
		$("resultMsgDiv").style.visibility = "hidden";
	}else if(flag == 4){
		$("subMenuFocus").style.visibility = "hidden";
	}
}


var beforePosition = 0;
function changeUD(_num){
	if(focusArea == 0){
		if(menuBox!=null){
			 clearFocus();
			 focusArea = 1;
			 showFocus();
		}
	}else{
		if(inputTipShowFlag){
			changeInputArea(_num);
			return;	
		}
		if(resultMsgShowFlag || resultTipShowFlag || payTipShowFlag)return;
		clearFocus();
		beforePosition = subMenuPos;
		if(_num > 0 || _num < 0){
			subMenuPos = _num>0 ? focusLocationArr[menuBox.position][subMenuPos].down : focusLocationArr[menuBox.position][subMenuPos].up;
		}
		if(subMenuPos == -1){
			focusArea = 0;
			showFocus();	
			subMenuPos = beforePosition;
			return;
		}
		showFocus();	
	}
}

function changeLR(_num){
	if(focusArea == 0){
		if(menuBox!=null){
            hiddenAllDiv();
			$("div"+menuBox.position).style.visibility = "hidden";
			clearFocus();
			exit();
			menuBox.changeList(_num);
			subMenuPos = 0;
			mySessionStorage.setItem("menuPos",menuBox.position || 0);
			if(menuBox.position == 3 || menuBox.position == 4){
				playVedio();
				ajaxSubMenuData();
			}else{
				ajaxSubMenuData();
			}
			
			$("div"+menuBox.position).style.visibility = "visible";
			showFocus();
			$("mute").style.visibility = "hidden";
		}
	}else{
		if(inputTipShowFlag){
			changeInputBtn(_num);
			return;
		}
		if(resultMsgShowFlag){
			changeResultTip(_num);
			return;
		}
		if(resultTipShowFlag || payTipShowFlag)return;
		clearFocus();
		beforePosition = subMenuPos;
		subMenuPos = _num>0 ? focusLocationArr[menuBox.position][subMenuPos].right : focusLocationArr[menuBox.position][subMenuPos].left;
		if(subMenuPos == -1){
			focusArea = 0;
			showFocus();	
			subMenuPos = beforePosition;
			return;
		}
		showFocus();
	}
}


function changeDiv1List(_num){
	if(listBox.position == 0 && _num<0){
		clearFocus();
		focusArea = 0;
		showFocus();		
	}else{
		listBox.changeList(_num);
	}
}

function doSelect(){
	if(focusArea == 1){
		if(menuBox.position == 0){
			if(resultMsgShowFlag){
				closeAllTip();
				if(subMenuPos == 1){
					if(resultMsgBtnPos == 0){
						showTip(0);
					}else{
						showTip(4);
					}
					return;
				}else if(subMenuPos == 3){
					if(resultMsgBtnPos == 0){
						showTip(4);
						return;
					}else{
						showTip(4);	
					}
					return;	
				}
			}
			if(subMenuPos == 2){
				if(!payTipShowFlag){
					closeAllTip();
					showTip(0);
				}
				return;
			}else if(subMenuPos != 5){
			if(!inputTipShowFlag){
				closeAllTip();
				showTip(1);
				$("inputTipTitle").innerHTML = inputTextArr[subMenuPos];
			}else{
				if(subMenuPos == 0 && inputArea == 1){
					closeAllTip();
					if(inputBtnPos == 0){
						bind();
					}else{
						showTip(4);
					}
				}else if(subMenuPos == 1 && inputArea == 1){
					closeAllTip();
					if(inputBtnPos == 0){
						checkInfo();
					}else{
						showTip(4);
					}
				}else if(subMenuPos == 3 && inputArea == 1){
					closeAllTip();
					if(inputBtnPos == 0){
						kefuInfo();
					}else{
						showTip(4);
					}
				}else if(subMenuPos == 4 && inputArea == 1){
					closeAllTip();
					if(inputBtnPos == 0){
						unbind();
					}else{
						showTip(4);
					}
				}
			}
			}
			return;
		}
		
		mySessionStorage.setItem("focusArea",1);
		if(subMenuData[subMenuPos].clickable == 0) return;//不可点击
		if(menuBox.position == 0 && subMenuPos == 1) return;
		
		mySessionStorage.setItem("menuPos",menuBox.position || 0);
		mySessionStorage.setItem("subMenuPos",subMenuPos || 0);
		if(subMenuData[subMenuPos].linkUrl != ""){
			window.location.href = subMenuData[subMenuPos].linkUrl;
		}else{
			var _currUrl = window.location.href;
			_currUrl = _currUrl.substring(0,_currUrl.indexOf("index.htm"));
			_currUrl = _currUrl +menuData[menuBox.position].enName+"/"+ subMenuData[subMenuPos].enName + "/index.htm?random="+(Math.random()+"").substring(0,6);
			window.location.href = _currUrl;
		}	
	}	
}

function changeInputArea(_num){
	$("inputTextBg").style.backgroundImage = "url("+inputTextBgArr.blur+")";
	$("inputTipBtn"+inputBtnPos).src = inputBtnPicArr[inputBtnPos].blur;
	inputArea = (inputArea + _num + 2)%2;
	if(inputArea == 0){
		$("inputTextBg").style.backgroundImage = "url("+inputTextBgArr.focus+")";
		$("inputTipBtn"+inputBtnPos).src = inputBtnPicArr[inputBtnPos].blur;
	}else{
		$("inputTextBg").style.backgroundImage = "url("+inputTextBgArr.blur+")";
		$("inputTipBtn"+inputBtnPos).src = inputBtnPicArr[inputBtnPos].focus;		
	}
}

function changeInputBtn(_num){
	$("inputTipBtn"+inputBtnPos).src = inputBtnPicArr[inputBtnPos].blur;
	inputBtnPos = (inputBtnPos + _num + 2)%2;
	$("inputTipBtn"+inputBtnPos).src = inputBtnPicArr[inputBtnPos].focus;
}

var resultMsgBtnPos = 0;
function changeResultTip(_num){
	$("resultMsgBtn"+resultMsgBtnPos).src = inputBtnPicArr[resultMsgBtnPos].blur;
	resultMsgBtnPos = (resultMsgBtnPos + _num + 2)%2;
	$("resultMsgBtn"+resultMsgBtnPos).src = inputBtnPicArr[resultMsgBtnPos].focus;
}

function bind(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		iDebug(">>>bind responseText="+_xmlHttp.responseText);
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined"){
			if(jsonData.code == 0){
				showTip(2);
				$("resultMsg").innerHTML = tipArr[0];
				setTimeout("closeAllTip();bindInfo()",2000);
			}
		}else{
			
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = binding;
	iDebug(">>>bind url="+binding);
	var data = "ca="+cardId+"&stbid="+stbId+"&usernum="+inputValue;
    ajaxObj1.urlParameters = data;
	iDebug(">>>bind urlParameters="+data);
	ajaxObj1.requestData("post");
}

function bindInfo(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		iDebug(">>>bindInfo responseText="+_xmlHttp.responseText);
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined"){
			if(jsonData.flag == 0){
				showTip(4);
				$("bindOkInfoDiv").style.visibility = "visible";
				$("bindOkInfo").innerHTML = "绑定户号："+jsonData.usernum
				+"<br/>地址："+jsonData.addr
				+"<br/>缴费金额："+jsonData.yue+"元"
				+"<br/>我的客服："+""
				+"<br/>联系方式："+"";
			}
		}else{
			$("bindOkInfo").innerHTML = "绑定户号：<br/>地址：<br/>缴费金额：<br/>我的客服：<br/>联系方式：";
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = kgele+[inputValue,""][isDebugUrl];
	iDebug(">>>bindInfo url="+ajaxObj1.url);
	ajaxObj1.requestData("post");
}

function unbind(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		iDebug(">>>unbind responseText="+_xmlHttp.responseText);
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined"){
			if(jsonData.code == 0){
				showTip(2);
				$("resultMsg").innerHTML = tipArr[2];
				setTimeout(function (){
					closeAllTip();
					showTip(4);
				},2000);
			}
		}else{
			showTip(2);
			$("resultMsg").innerHTML = tipArr[1];
			setTimeout(function (){
				closeAllTip();
				showTip(4);
			},2000);
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = unbundling;
	var data = "ca="+cardId+"&stbid="+stbId+"&usernum="+inputValue;
    ajaxObj1.urlParameters = data;
	iDebug(">>>unbind url="+ajaxObj1.url);
	ajaxObj1.requestData("post");
}

function checkInfo(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		iDebug(">>>checkInfo responseText="+_xmlHttp.responseText);
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined"){
			if(jsonData.Ok == true){
				showTip(3);
				$("resultMsgInfo").innerHTML = "姓名："+""
				+"<br/>金额："+""
				+"<br/>地址："+"";
			}else{
				showTip(3);
				$("resultMsgInfo").innerHTML = "姓名：<br/>金额：<br/>地址：";
			}
		}else{
			
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = GetJlInfoByYhbh+[inputValue,""][isDebugUrl];
	iDebug(">>>checkInfo url="+ajaxObj1.url);
	ajaxObj1.requestData();	
}

function kefuInfo(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		iDebug(">>>kefuInfo responseText="+_xmlHttp.responseText);
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined"){
			if(jsonData.Ok == true){
				showTip(3);
				$("resultMsgInfo").innerHTML = "姓名："+jsonData.info.JL_NAME
				+"<br/>地址："+"";
			}else{
				showTip(3);
				$("resultMsgInfo").innerHTML = "姓名：<br/>地址：";	
			}
		}else{
			
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = GetJlInfoByYhbh+[inputValue,""][isDebugUrl];
	iDebug(">>>kefuInfo url="+ajaxObj1.url);
	ajaxObj1.requestData("post");
}

function init(){
	getParms();
	ajaxMenuData();
	loginSuccess();
	showTime();
}

function getParms(){
	menuPos = mySessionStorage.getItem("menuPos");
	iDebug("getParms—menuPos = "+menuPos+" typeof menuPos="+typeof menuPos);
	if(menuPos == 0) menuPos = menuPos+"";
	if(typeof menuPos != "undefined"  && menuPos != null && menuPos != "undefined" && menuPos != ""){
			
	}else{
		menuPos = 0;	
	}
	focusArea = mySessionStorage.getItem("focusArea");
	if(focusArea == 0) focusArea = focusArea+"";
	if(typeof focusArea != "undefined" && focusArea != null && focusArea != "undefined" && focusArea != ""){
		
	}else{
		focusArea = 0;	
	}
	subMenuPos = mySessionStorage.getItem("subMenuPos") || 0;
	mySessionStorage.removeItem("menuPos");
	mySessionStorage.removeItem("focusArea");
	mySessionStorage.removeItem("subMenuPos");
	menuPos = parseInt(menuPos);
	focusArea = parseInt(focusArea);
	subMenuPos = parseInt(subMenuPos);
	iDebug("list.htm--focusArea="+focusArea+"|menuPos="+menuPos+"|subMenuPos="+subMenuPos);
}

function loginSuccess(){
	iDebug(">>>>index.htm loginSuccess...");
	showWeather();
}


function loginFail(){
	iDebug(">>>>index.htm loginFail...");
}


function ajaxMenuData(){
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined" && jsonData.length > 0){
			menuData = jsonData;
			showMenuData();
		}else{
			noMenuData();
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		noMenuData();	
	};
	ajaxObj1.url = dataAjaxPath;
	ajaxObj1.requestData();
}

function showMenuData(){
	menuBox = new showList(menuLen,menuData.length,menuPos,261,window);
	menuBox.focusDiv = "focus";
	menuBox.listSign = "left";
	menuBox.listHigh = 170;
	menuBox.focusLoop = true;	
	menuBox.pageLoop = true;
	menuBox.haveData = function(_list){
		$("menu" + _list.idPos).src = menuImageUrl[_list.dataPos].blur;
	};
	menuBox.notData = function(_list){
		$("menu" + _list.idPos).src = "";
	};
	menuBox.startShow();
	requestVedioData();
	ajaxSubMenuData();
	clearFocus();
	showFocus();
}

function noMenuData(){
	for(var i=0;i<menuLen;i++){
		$("menu"+i).src = "";
	}
}

var subMenuData = [];
function ajaxSubMenuData(){
	subMenuData = [];
	var ajaxObj1 = null;
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	ajaxObj1.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		var jsonData = eval('(' + _xmlHttp.responseText + ')');
		if(typeof(jsonData) != "undefined" && jsonData.length > 0){
			subMenuData = jsonData;
			iDebug(">>>subMenu_len="+subMenuData.length);
            showSubMenuData();
            hiddenAllDiv();
			$("div"+menuPos).style.visibility = "visible";
		}
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {
		
	};
	ajaxObj1.url = menuData[menuBox.position].enName+"/"+dataAjaxPath;
	ajaxObj1.requestData();
}

function hiddenAllDiv() {
    for (var i = 0; i < 5; i++) {
        $("div"+i).style.visibility = "hidden";
    }
}

function showSubMenuData(){
	subMenuBox = new showList(subMenuLen[menuBox.position],subMenuData.length,subMenuPos,-13,window);
	subMenuBox.focusDiv = "subMenuFocus";
	subMenuBox.listSign = "left";
	subMenuBox.focusLoop = true;	
	subMenuBox.pageLoop = true;
	subMenuBox.haveData = function(_list){
		if((menuBox.position == 3 || menuBox.position == 4) && _list.idPos == 2){
			$("subMenuPic"+ menuBox.position + _list.idPos).src = "";
		}else{
			$("subMenuPic"+ menuBox.position + _list.idPos).src = subMenuData[_list.dataPos].focusImageUrl;
		}
	};
	subMenuBox.notData = function(_list){
		$("subMenuPic"+ menuBox.position + _list.idPos).src = "";
	};
	subMenuBox.startShow();
	clearFocus();
	showFocus();
}

function clearFocus(){
	$("menu"+menuBox.focusPos).src = menuImageUrl[menuBox.position].blur;
	$("subMenuFocus").style.visibility = "hidden";
}

function showFocus(){
	if(focusArea == 0){
		$("menu"+menuBox.focusPos).src = menuImageUrl[menuBox.position].focus;
	}else if(focusArea == 1){
		$("menu"+menuBox.focusPos).src = menuImageUrl[menuBox.position].focus;
		var tmp_width = $("subMenuPic" + menuBox.position + subMenuPos).width;
		var tmp_height = $("subMenuPic" + menuBox.position + subMenuPos).height;
		var tmp_left = $("subMenuDiv" + menuBox.position + subMenuPos).style.left;
		var tmp_top = $("subMenuDiv" + menuBox.position + subMenuPos).style.top;
		showTip(4);
		//iDebug("left="+tmp_left+" top="+tmp_top+" width="+tmp_width+" height="+tmp_height);
		$("subMenuFocus").style.height = 136 + parseInt(tmp_height) + "px";
		$("subMenuFocus").style.width = 152 + parseInt(tmp_width) + "px";
		$("subMenuFocus").style.left = (parseInt(tmp_left)-70) + "px";
		$("subMenuFocus").style.top = (parseInt(tmp_top)-65) + "px";
	}
	if(menuBox.position == 3 || menuBox.position == 4){
		$("smallVedioBgDiv").style.visibility = "hidden";
	}else{
		$("smallVedioBgDiv").style.visibility = "visible";
	}
}

function showTime(){
	var currTime = formatTime("hh:mm:ss",new Date());
	$("time").innerText = currTime;
	setTimeout("showTime()",1000);
}

function showWeather(){
	get_weather_Url = get_weather_Url + access_token ;
	iDebug("index_showWeather_get_weather_Url = " + get_weather_Url);
	var ajaxObj = null;
	ajaxObj = new AjaxClass();
	ajaxObj.frame = window;
	//ajaxObj.charset = "gbk";
	ajaxObj.successCallback = function(_xmlHttp, _params) {
		//iDebug("index_weatherSuccess__" + _xmlResponse.responseText);
		var resultInfo = eval('('+_xmlHttp.responseText+')');
		if (resultInfo.ret == 0) {
			if (resultInfo.list && resultInfo.list.length > 0){
				$("weather").innerHTML = "今天"+" "+resultInfo.list[0].weather+" "+resultInfo.list[0].temp;
			}
		}
	};
	ajaxObj.failureCallback = function(_xmlHttp, _params) {};
	ajaxObj.url = get_weather_Url;
	ajaxObj.requestData();
}

/********************小视频播放开始***************************/
var videoId = "";
var playUrl = "";
var ajaxObj = null;
var timeout0 = -1;
var times = 0;
var vodMode = "IP";
function requestVedioData(){
	programListUrl = programListUrl+access_token;
	iDebug("programListUrl = " + programListUrl);
	ajaxObj = null;
	ajaxObj = new AjaxClass();
	ajaxObj.frame = window;
	//ajaxObj.charset = "gbk";
	ajaxObj.successCallback = function(_xmlHttp, _params) {
		//iDebug("requestVedioData="+_xmlHttp.responseText);
		var _res = eval('(' + _xmlHttp.responseText + ')');
		var res = _res;
		if (res.ret == 0) {
			var list = res.list;
			if (list == null || list.length == 0) {
				iDebug("列表为空！");
			} else {
				videoId = list[0].id;
				iDebug("videoId="+videoId);
				//$("name").innerText = list[0].name;
				if(list[0].series_total>1){//剧集获取详情
					getSeriesInfo();
				}else{//单集获取详情
					getVideoInfo();
				}
			}
		} else {
			iDebug("获取列表失败！", res.ret);
		}
	};
	ajaxObj.failureCallback = function(_xmlHttp, _params) {};
	ajaxObj.url = programListUrl;
	ajaxObj.requestData();
}

/*******************播放相关代码*********************/
function getSeriesInfo() {
	seriesInfoUrl = seriesInfoUrl +"accesstoken="+access_token+"&seriesid="+videoId+"&pageidx=1&pagenum=1";
	iDebug("getVideoInfo-->seriesInfoUrl="+seriesInfoUrl);	
	ajaxObj1 = new AjaxClass();
	ajaxObj1.frame = window;
	//ajaxObj.charset = "gbk";
	ajaxObj1.successCallback = function(_xmlHttp, _params) {
		var _res = eval('(' + _xmlHttp.responseText + ')');
		//iDebug("getSeriesInfo txt="+_xmlHttp.responseText);
        var data = _res;
        if (data.ret == 0) {
		   if(data.video_list.length==0)return;
           videoId = data.video_list[0].video_id;
		   getVideoInfo();
        }
	};
	ajaxObj1.failureCallback = function(_xmlHttp, _params) {iDebug("[index.htm]---getVideoInfo()---onError---")};
	ajaxObj1.url = seriesInfoUrl ;
	ajaxObj1.requestData();
}

function getVideoInfo() {
	vedioInfoUrl = vedioInfoUrl +"accesstoken="+access_token+"&videoid=" + videoId;
	iDebug("getVideoInfo-->vedioInfoUrl="+vedioInfoUrl);	
	if (ajaxObj != null) {
		ajaxObj.requestAbort();
	}
	ajaxObj = new AjaxClass();
	ajaxObj.frame = window;
	//ajaxObj.charset = "gbk";
	ajaxObj.successCallback = function(_xmlHttp, _params) {
		var _res = eval('(' + _xmlHttp.responseText + ')');
        var data = _res;
        if (data.ret == 0) {
			var demand_url = data.demand_url;
			if (vodMode == "DVB") {
				playUrl = getPlayUrlByType(demand_url, "rtsp://");
				playUrl += "&ipqam=1";
			} else if (vodMode == "RTSPIP"){
				playUrl = getPlayUrlByType(demand_url, "rtsp://");	
			} else if (vodMode == "IP") {
				playUrl = getPlayUrlByType(demand_url, "http://");
				playUrl += "?protocol=http";
			}
			if (isDNS == 1) {// 需要将域名替换成IP
				var tmpStr = playUrl.split("://")[0];
				var tmpUrl = playUrl.split(tmpStr + "://")[1];
				tmpUrl = tmpUrl.substr(0,tmpUrl.indexOf("/"));
	
				if (tmpUrl.indexOf(":") > -1){
					// 有端口号
					playUrl = playUrl.replace(/(:\/\/)(.*?)(:)/i,"://" + streamIP + ":");
				} else {
					// 无端口号
					playUrl = playUrl.replace(/(:\/\/)(.*?)(\/)/i,"://" + streamIP + "/");
				}
			}
			
            if (playUrl) {
                var play_token = data.play_token;
                if (playUrl.indexOf("?") >= 0) {
                    playUrl += "&";
                } else {
                    playUrl += "?";
                }
				playUrl += "playtype=demand&accesstoken=" + parent.access_token + "&programid=" + videoId + "&playtoken=" + (play_token ? play_token: "ABCDEFGHIGK") + "&verifycode=" + device_id+"&auth=no";
				
				iDebug("playUrl before==" + playUrl);
				if(isDNS == 1){
					playUrl = playUrl.replace(streamSlave[0],streamSlave[1]);
				}
                iDebug("playUrl=" + playUrl);
				if(menuBox.position == 3 || menuBox.position == 4){
					playVedio();
				}
            }
        }
	};
	ajaxObj.failureCallback = function(_xmlHttp, _params) {iDebug("[index.htm]---getVideoInfo()---onError---")};
	ajaxObj.url = vedioInfoUrl ;
	ajaxObj.requestData();
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

var playTimeout = -1;
function playVedio(){
	iDebug("playVedio__playUrl="+playUrl);
	if(playUrl != null ) {
		MPlayer.init();
		MPlayer.setPosition(374,221,608,385);
		MPlayer.play(playUrl);
		firstLoadCheckMute();
	}
}
/****************** 定义播放器-start *******************/
var MPlayer = {
	$MID:0,
	$browser:"stb",
	checkBrowser: function() {
		var appName = navigator.appName;
		if(typeof MediaPlayer != "undefined") {
			this.$browser = "NGB";
		}else if(appName.indexOf("Google") != -1 || appName.indexOf("Netscape") != -1) {
			this.$browser = "PC";
		}
		iDebug("[MPlayer]checkBrowser browser="+this.$browser);
	},
	init:function(){//初始化播放器
		this.checkBrowser();
		if(this.$browser == "NGB") {
			if(window.$MP == "" || window.$MP == null) window.$MP = new MediaPlayer();
			this.$MID = $MP.getPlayerInstanceID();
			var flag = $MP.bindPlayerInstance(this.$MID);
			iDebug("[MPlayer] bind flag="+flag+";;mediaId="+this.$MID);
			
			/*if (vodMode == "DVB") {
				VOD.changeServer("cisco_dmx", "dvb");
			} else if (vodMode == "RTSPIP"){
				VOD.server.controlHeartbeatCycle = 30;
				VOD.server.heartbeatCycle = 25;
				VOD.server.heartbeatTimeout = 120;
				VOD.changeServer("cisco_dmx", "ip");
			}else if (vodMode == "IP") {
				VOD.server.mode = "IP";
			}*/
		}
	},
	play:function(__url, __type){
		//iDebug("[MPlayer]play typeof $MP="+ typeof($MP) + ";$MP="+$MP);
		if(this.$browser == "NGB") {
			if(__url==null && __type==null){
				$MP.play();
				iDebug("[MPlayer]play start");
				return;
			}else if(__url==""||__url==null){
				return;
			}
		    $MP.setMediaSource(__url);
		    iDebug("[MPlayer]play url="+__url);
	    }
	},
	setPosition:function(__x, __y, __w, __h){
		__x=__x||0; 
		__y=__y||0; 
		__w=__w||1280; 
		__h=__h||720;
		if(this.$browser == "NGB") {
			$MP.setVideoDisplayMode(0);
	        /*var rec = new Rectangle(__x, __y, __w, __h);
	        $MP.setVideoDisplayArea(rec);
	        $MP.refresh();*/
			var videoRectangle = new Rectangle();
			videoRectangle.left = __x;
			videoRectangle.top = __y;
			videoRectangle.width = __w;
			videoRectangle.height= __h;
			$MP.setVideoDisplayArea(videoRectangle);
			$MP.refresh();
        }
	},
	stop:function(__type){
		if(this.$browser == "NGB") {
			$MP.stop();
			/*var ret = $MP.clearVideoOutput();//清帧
			iDebug("[MPlayer] clearVideo flag="+ret);*///返回值打印出来undefined  
			DVB.clearVideoLevel();
			if(__type == 1){
				var flag = $MP.unbindPlayerInstance(this.$MID);
				iDebug("[MPlayer] unbind flag="+flag+";;mediaId="+this.$MID);
			}
		}
	},
	pause:function(){
		if(this.$browser == "NGB") {
			$MP.pause();
		}
	},
	resume:function(){
		if(this.$browser == "NGB") {
			$MP.resume();
		}
	},
	setMute:function(){
		if(this.$browser == "NGB") {
			AudioSetting.mute();
		}
	},
	setUnmute:function(){
		if(this.$browser == "NGB") {
			AudioSetting.unMute();
		}
	},
	getMuteStatus:function(){
		if(this.$browser == "NGB") {
			return AudioSetting.isMute();
		}
	},
	setVolume:function(__vol){
		if(this.$browser == "NGB") {
			$MP.setVolume(__vol);
		}
	},
	getVolume:function(){
		if(this.$browser == "NGB") {
			return $MP.getVolume();
		}
	},
	getElapsed:function(){
		if(this.$browser == "NGB") {
			return $MP.getCurrentPlayTime();
		}
	},
	getDuration:function(){
		if(this.$browser == "NGB") {
			return $MP.getMediaDuration();
		}
	},
	seek:function(__sec){
		
	},
	setEventCallback:function(__eventCallback){
		
	}
};
/****************** 定义播放器-end *******************/

function exit(){
	stop();
}

function stop() {
	iDebug(">>>>subNode/index.htm stop video");
	MPlayer.stop(1);
	/*if (vodMode == "RTSPIP"){
		VOD.server.controlHeartbeatCycle = 300;
		VOD.server.heartbeatCycle = 300;
		VOD.server.heartbeatTimeout = 900;
		if(iPanel.eventFrame.cardType == "02"){
			VOD.changeServer("cisco_dmx","ip");
		}else{
			VOD.changeServer("cisco_dmx","dvb");
		}
	}*/
}

function play() {
	MPlayer.play();
}

function pause(){
	MPlayer.pause();
}

function resume() {
	MPlayer.resume();
}

var volume_timeout = -1;
var volumeShowFlag = false;
function changeVolume(__num){
	if(MPlayer.$browser == "NGB"){
		if(MPlayer.getMuteStatus()){//静音状态
			var tmpflag = MPlayer.setUnmute();//取消静音
			hideMute();
		}	
	}
	var tempVolume = MPlayer.getVolume();
	tempVolume = Math.floor((tempVolume+__num*4)/4);
	if(tempVolume>25){
		tempVolume = 25;
	}else if(tempVolume<0){
		tempVolume = 0;
	}
	iDebug("changeVolume tempVolume="+tempVolume);
	MPlayer.setVolume(tempVolume*4);
	parent.$("volumeValue").innerText = tempVolume*4;
	showVolumn(tempVolume);
	clearTimeout(volume_timeout);
	volume_timeout = setTimeout("hideVolume()", 3000);
}

/*显示音量值和进度条*/
function showVolumn(__num){
	volumeShowFlag = true;
	for(var i=0; i<25; i++){
		if(i<__num){
			parent.$("volume_icon"+i).src = "images/volume_bar2.png";
		}else{
			parent.$("volume_icon"+i).src = "images/volume_bar1.png";
		}
	}
	parent.$("volumeBox").style.visibility = "visible";
}


/*隐藏音量进度条*/
function hideVolume(){
	volumeShowFlag = false;
	parent.$("volumeBox").style.visibility = "hidden";
}

/*检测静音，是静音则恢复声音，不是静音则显示静音
*/
function firstLoadCheckMute(){
	var __tmpFlag = MPlayer.getMuteStatus();
	iDebug("firstLoadCheckMute  __tmpFlag="+__tmpFlag);
	if(__tmpFlag){
		showMute();
	}
}
	
function checkMute(){
	if(MPlayer.$browser == "NGB"){
		if(MPlayer.getMuteStatus()){//如果是静音，则恢复声音
			var tmpflag = MPlayer.setUnmute();//取消静音
			hideMute();
		}else{
			var tmpflag = MPlayer.setMute();//设置静音
			showMute();
		}
	}
}

function showMute(){
	if(volumeShowFlag){
		hideVolume();
	}	
	parent.$("mute").style.visibility = "visible";
}	

function hideMute(){
	parent.$("mute").style.visibility = "hidden";
}	

var timer_tip=-1;
function messageTips(key,flag) {
	var msg = "";
	switch(key) {
		case 13001:
			msg = "视频路径有效，开始播放";
			break;
		case 13002:
			msg = "播放地址无效，请联系管理员处理";
			break;
		case 13003:
			//msg = "视频播放成功";//注释，不提示
			break;
		case 13004:
			msg = "视频播放失败";
			break;
		case 13012:
			msg = "恢复视频播放失败";
			break;
		case 13013:
			//msg = "视频停止成功";
			break;
		case 13014:
			msg = "视频停止失败";
			break;
		default:
			break;
	}
	$("tips").innerHTML = msg;
	$("tips").style.visibility="visible";
	iDebug("[messageTips]msg="+msg);
	clearTimeout(timer_tip);
	if(flag)return;
	timer_tip = setTimeout(function(){
		$("tips").style.visibility="hidden";
	},3500);
}
