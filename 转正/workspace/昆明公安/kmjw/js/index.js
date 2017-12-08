;
var dataAjaxPath = "menu.js";
var menuBox = null;
var ajaxObj = null;
var menuMaxSize = 4;
var menuLen = 4;
var menuPos = 0;
var backUrl = "";

var focusPosition = [
	{top:90,left:28,width:556,height:590},
	{top:90,left:444,width:556,height:366},
	{top:90,left:860,width:420,height:590},
	{top:314,left:444,width:556,height:366}
];
var tipShowFlag = false;
var tipTimeout = -1;

document.onkeydown = eventHandler;
document.onirkeydown = eventHandler;
function eventHandler(key){
  var e = key || event;
  var keycode = e.keyCode || e.which || e.charCode;
  iDebug("index.htm keycode="+keycode);
  switch (keycode) {
    case 1:   // up
    case 38:
	  if(tipTimeout) hideTips();
      changeUD(-1);
      return false;
      break;
    case 2:   // down
    case 40:
	  if(tipTimeout) hideTips();
      changeUD(1);
      return false;
      break;
    case 3:   // left
    case 37:
	  if(tipTimeout) hideTips();
	  changeLR(-1);
      return false;
      break;
    case 4:   // right
    case 39:
	  if(tipTimeout) hideTips();
	  changeLR(1);
      return false;
      break;
    case 13:
	  //if(tipTimeout) hideTips();
	  doSelect();
      return false;
      break;
    case 8:
	case 340:
	case 27:
	case 339:
	  if(tipTimeout) hideTips();
      goBack();
      return false;
      break;
  }
}

function goBack(){
	if(backUrl == "") return;
	window.location.href = backUrl;
}

function changeUD(_num){
	if(menuPos==0 || menuPos == 2)return;
	else if(menuPos==1)menuPos = 3;
	else if(menuPos==3)menuPos = 1;
    showFocus();	
    console.log(menuPos)
}

function changeLR(_num){
	if((menuPos==2)&&_num>0)menuPos = 0;
	else if(menuPos==0&&_num<0)menuPos = 2;
	else if(menuPos==3&&_num<0)menuPos = 0;
	else if(menuPos==3&&_num>0)menuPos = 2;
	else menuPos += _num;
    showFocus();
    console.log(menuPos)
}

function doSelect(){
	mySessionStorage.setItem("menuPos",menuPos);
	if(menuData[menuPos].linkUrl != ""){
		window.location.href = menuData[menuPos].linkUrl;
	}else{
		window.location.href = menuData[menuPos].enName + "/index.htm?random="+(Math.random()+"").substring(0,6);
	}	
}

function init(){
	getParms();
	ajaxMenuData();
	showFocus();
	//showTime();
}

function getParms(){
	menuPos = mySessionStorage.getItem("menuPos");
	iDebug("getParms>>>menuPos = "+menuPos+" typeof menuPos="+typeof menuPos);
	if(menuPos == 0) menuPos = menuPos+"";
	if(typeof menuPos != "undefined"  && menuPos != null && menuPos != "undefined" && menuPos != ""){
			
	}else{
		menuPos = 0;	
	}
	menuPos = parseInt(menuPos);
	iDebug("list.htm--menuPos="+menuPos);
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
	menuBox = new showList(menuLen,menuData.length,menuPos,28,window);
	menuBox.focusDiv = "menuFocus";
	menuBox.listSign = "left";
	menuBox.focusLoop = true;	
	menuBox.pageLoop = true;
	menuBox.haveData = function(_list){
		$("menu" + _list.idPos).src = menuData[_list.dataPos].focusImageUrl;
	};
	menuBox.notData = function(_list){
		$("menu" + _list.idPos).src = "";
	};
	menuBox.startShow();
	showFocus();
}

function noMenuData(){
	for(var i=0;i<menuLen;i++){
		$("menu"+i).src = "";
	}
}

function showFocus(){
	$("menuFocus").style.top = focusPosition[menuPos].top + "px";
	$("menuFocus").style.left = focusPosition[menuPos].left + "px";
	$("menuFocus").style.width = focusPosition[menuPos].width + "px";
	$("menuFocus").style.height = focusPosition[menuPos].height + "px";
}

function showTime(){
	var currTime = formatTime("hh:mm",new Date());
	$("time").innerText = currTime;
	setTimeout("showTime()",60000);
}

function showTips(){
	tipShowFlag = true;
	$("tips").style.visibility = "visible";
	clearTimeout(tipTimeout);
	tipTimeout = setTimeout(function (){
		hideTips();
	},3000);
}

function hideTips(){
	tipShowFlag = false;
	$("tips").style.visibility = "hidden";	
}