
var imgArr = ["image/bg.gif"]; 
for (var i = 0; i < imgArr.length; i++) {
	var img = new Image();
	img.src = imgArr[i];
}
var areaPos = 0; //焦点区域 0：主菜单 1：子菜单
var menuPos = 0; //一级菜单焦点位置
var menuDataPos = 0;
var menuBox = null; //一级菜单移动对象
var subMenuTimer = -1; //子栏目显示计时器
var infoTimer = -1; //基本信息显示计时器

var cellWidth = 147; //单元格的宽度
var cellHeight = 124; //单元格的高度
var cellMargin = 10; //单元格之间间隙
var unitInfoList = []; //存放ID的数组 left\top\width\heigh
var area = 0; //焦点区域 0：一级栏目 1：子栏目
var subFocusPos = 0; //子栏目焦点位置
var menuInfo = null; //当前子栏目数据
var showTipsFlag = false; //消息提示框是否显示  false:未显示  true：显示
var showTipsTimer = -1; //消息提示框自动影藏计时器
var video_wdds = "";
//var video_wdsq = "http://10.191.69.201/ts/zjljz.mp4"; //我的社区对应的小视屏文件
//ar video_wdcs = "http://10.191.69.201/ts/lqljz.mp4"; //我的城市对应的小视屏文件

/*var mailAjaxObj = null; //邮件请求ajax对象
var mailList = []; //所有的邮件数据
var newMaillist = []; //未读的邮件数据*/
var caId = ""; //CA卡号
var marqueeText = "欢迎访问智慧潍坊"; //底部滚动内容

var menuMaxLen = menuData.length;// 主菜单div显示的数目
var menuMaxNum = 4;//一页最多显示主菜单个数，尽量不要更改，
var dateTimeout = -1;
var playVolume = 0;

document.onkeydown = eventHandler;

function eventHandler(key) {
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
	case 1:
	case 38:
	  if(!volumePlayFlag){
		if (area == 1) {
			findNextID("Z", -1);
		}
	  }
		return false;
		break;
	case 2:
	case 40:
	  if(!volumePlayFlag){
		if (area == 0) {
			area = 1;
			changeMenuFocus(2);
			ajustSubFocus();
			$("subMenuFocus").style.visibility = "visible";
		} else {
			findNextID("Z", 1);
		}
	  }
		return false;
		break;
	case 3:   //left
	case 37:
	  if(volumePlayFlag){
		   var volume =  iSTB.player.get_volume();
			if(volume <= 1){
				volume = 0;
			}else {
		      volume -= 1;
			}
		    iSTB.player.set_volume(volume);
			showVolume();
	  }else{
		if (area == 0) {
			changeMenu(-1);
		} else {
			findNextID("H", -1);
		}
		
	  }
		return false;
		break;
	case 4:
	case 39:
	   if(volumePlayFlag){
		   var volume =  iSTB.player.get_volume();
			if(volume >= 31){
				volume = 32;
			}else{
		        volume += 1;
			}
		    iSTB.player.set_volume(volume);
			showVolume();
	   }else{
		  if (area == 0) {
			  changeMenu(1);
		  } else {
			  findNextID("H", 1);
		  }
	   }
		return false;
		break;
	case 13:
		doSelect();
		return false;
		break;
	case 8:
		iSTB.browser.gotoSTB("menu");
		event.returnValue = false;
		return false;
		break;
	case 27:
	    //window.location.href = "http://10.191.69.201/selectUrl/index.htm";
	    iSTB.browser.gotoSTB("tv");
		event.returnValue = false;
		return false;
		break;
	case 48:  //按0键调出音量条
	case 66:
	   if(playVolume == 1){
		    playVolume = 0;
		    hideVolume();
	   }else if(playVolume == 0){
		    playVolume = 1;
		    showVolume();
	   }
	   return false;
		break;
	}
}



function init() {
	getPos();
	setTimeout(function() {
		preDownImage();
	},1000);
	changeMenuBg(menuDataPos);
	showDate();
	initMainMenu();
	
}
function getPos() {
	var pos = parseInt(sessionStorage.getItem("indexMainPos"), 10);
	if (pos != "" && pos != "undefined" && typeof(pos) != "undefined" && !isNaN(pos) && pos != null) {
		menuPos = parseInt(pos, 10);
	}
	var subPos = parseInt(sessionStorage.getItem("indexSubPos"), 10);
	if (subPos != "" && subPos != "undefined" && typeof(subPos) != "undefined" && !isNaN(subPos) && subPos != null) {
		subFocusPos = parseInt(subPos, 10);
	}
	var areaPos = parseInt(sessionStorage.getItem("indexAreaPos"), 10);
	if (areaPos != "" && areaPos != "undefined" && typeof(areaPos) != "undefined" && !isNaN(areaPos) && areaPos != null) {
		area = parseInt(areaPos, 10);
	}
	var tmpmenuDataPos = parseInt(sessionStorage.getItem("indexmenuDataPos"), 10);
	if (tmpmenuDataPos != "" && tmpmenuDataPos != "undefined" && typeof(tmpmenuDataPos) != "undefined" && !isNaN(tmpmenuDataPos) && tmpmenuDataPos != null) {
		 menuDataPos = parseInt(tmpmenuDataPos, 10);
	}
	//sessionStorage.setItem("indexmenuDataPos",menuDataPos);
	sessionStorage.removeItem("indexMainPos");
	sessionStorage.removeItem("indexSubPos");
	sessionStorage.removeItem("indexAreaPos");
	sessionStorage.removeItem("indexmenuDataPos");
}


function changeMenuBg(pos){
	if(pos == 3){
		$("video").style.background ="";
	}else {
		$("video").style.background ="url(image/video.jpg)";
	}
}

function showDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	month = month < 10 ? "0" + month: month;
	day = day < 10 ? "0" + day: day;
	hour = hour < 10 ? "0" + hour: hour;
	minute = minute < 10 ? "0" + minute: minute;
	second = second < 10 ? "0" + second: second;
	var result = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	$("time").innerText = result;
	clearTimeout(dateTimeout);
	dateTimeout = setTimeout(showDate, 1000);
}

/* 后面操作用到的图片,需在onload后下载下来. */
var imgObjArr = [];
function preDownImage() {
	for (var i = 0; i < menuData.length; i++) { //主菜单
		var imgObj = new Image();
		imgObj.src = menuData[i].blur;
		imgObjArr.push(imgObj);
		imgObj = new Image();
		imgObj.src = menuData[i].selected;
		imgObjArr.push(imgObj);
		imgObj = new Image();
		imgObj.src = menuData[i].focus;
		imgObjArr.push(imgObj);
	}
	for (var i = 0; i < menuData.length; i++) { // 子栏目
		for (var j = 0; j < menuData[i].pos.length; j++) {
			var imgObj = new Image();
			imgObj.src = menuData[i].pos[j].poster[0].src;
			imgObjArr.push(imgObj);
		}
	}
}


/**
* 动态生成一级菜单
*/
function initMainMenu() {
	var _left = 20;
	var step = 230;
	if (menuMaxLen <= menuMaxNum && menuMaxLen >= 5) {
	     step = Math.floor(900/menuMaxLen);
	}
	var mainMenuStr = "<div id=\"divMainMenu\" style=\"width:"+(menuMaxLen*step)+"px;position:absolute;\">";
	for (var i = 0 ,j = menuDataPos - menuPos; i < menuMaxNum; i++,j++) {
		var obj = menuData[i];
		if (i !== 0){ _left += step; }
		mainMenuStr += "<div style=\"left:";
		mainMenuStr += _left+"px;\" class=\"bg\"><img src=\"";
		mainMenuStr += obj.blur;
		mainMenuStr += "\" id=\"menu"+i;
		mainMenuStr += "\"/><div class=\"font\" id=\"menutitle"+i+"\">";
		mainMenuStr += "</div></div>";
	 }
	$("mainMenu").innerHTML = mainMenuStr;
	mainMenuStr=null;
	if(area == 0){
		changeMenuFocus(1);
	}
	checkMenuPosOver();
	showSubMenu();
}

function changeMenuFocus(_flag) {
	if (_flag == 0) {
		$("menu" + menuPos).src =  menuData[menuDataPos].blur;
	} else if (_flag == 1) {
		$("menu" + menuPos).src = menuData[menuDataPos].focus ;
	} else {
		$("menu" + menuPos).src =  menuData[menuDataPos].selected;
	}
}



/*菜单焦点移动*/
function changeMenu(_num) {
	changeMenuFocus(0);
	menuDataPos += _num;
	if (menuDataPos < 0) {
		menuDataPos = menuMaxLen - 1;
		menuPos = menuMaxNum - 1;
		initMainMenu();
	} else if (menuDataPos > (menuMaxLen - 1)) {
		menuDataPos = 0;
		menuPos = 0;
		initMainMenu();
	} else if ((menuPos == menuMaxNum - 1 && _num > 0) || (menuPos == 0 && _num < 0)) {
		initMainMenu();
	} else {
		menuPos += _num;
	}
	changeMenuFocus(1);	
	checkMenuPosOver();
	subFocusPos = 0;
	clearTimeout(subMenuTimer);
	subMenuTimer = setTimeout(function(){
		showSubMenu();
	}, 200); //延迟去加载子栏目
}
/*检测主菜单数据是否到了首尾*/
function checkMenuPosOver() {
	if (menuDataPos == 0) {
		$("arrowLeftDiv").style.visibility = "hidden";
		$("arrowRightDiv").style.visibility = "visible";
	} else if (menuDataPos == (menuData.length - 1)) {
		$("arrowLeftDiv").style.visibility = "visible";
		$("arrowRightDiv").style.visibility = "hidden";
	} else {
		$("arrowLeftDiv").style.visibility = "visible";
		$("arrowRightDiv").style.visibility = "visible";
	}
}

/*关闭当前页面的小视屏*/
function closeSmallVideo() {
	try {
		iSTB.player.stop();
	} catch(E) {}
	
}
var url = "";
function showSubMenu() {
	unitInfoList = [];
	$("squareBox").innerHTML = "";
	menuInfo = menuData[menuDataPos];
	var len = menuInfo.pos.length;
	//var menuIsvideo = menuData[menuDataPos].fixed[0].isvideo;
	var isvideo = "";
	var count = -1;
	closeSmallVideo();
	for (var i = 0; i < len; i++) { //遍历当前所有子栏目
		var drawMap = menuInfo.pos[i].grid; //获取每个子栏目的位置
		var poster = menuInfo.pos[i].poster;
		var imge = poster.length > 0 ? poster[0].src: "";
		count++;
		addUnitInfoList(drawMap, "unit" + count); //这里就是把每个面板的 div放在unitInfoList中
		drawUnit(drawMap, cellWidth, cellHeight, cellMargin, "unit" + count, "squareBox", imge); //这个画出来整个div
		//if(menuIsvideo == "1"){
			isvideo = menuInfo.pos[i].isvideo;
			if(isvideo == "1"){
				 url = poster[0].url;
				 //alert(url);
				 var width = unitInfoList[i].width;
				 var height = unitInfoList[i].height + 4;
				 var top = unitInfoList[i].top + 219  ;
				 var left = unitInfoList[i].left + 93 ;
				 //alert("width="+width+"||height=="+height+"||top=="+top+"||left=="+left);
				 //$("test").innerHTML = "width="+width+" height"+height+" top="+top+" left="+left;
				 try{
					 iSTB.player.play(url);
					 iSTB.player.set_video_window(left, top, width, height);
				 }catch(e){
					 
				 }
			}
		}
	//}
	
	if (area == 1) {
		//$("menu" + menuPos).src = menuPicArr[menuDataPos].onLeave;
		changeMenuFocus(2);
		ajustSubFocus();
		$("subMenuFocus").style.visibility = "visible";
	}
	changeMenuBg(menuDataPos);
}

function eventCallback(type, event_name, event_type, event_value){
	switch(event_name){
		 case "PLAYER_FINISH": // 播放结束;
		     iSTB.player.stop();
			 iSTB.player.play(url);
			 break;
		  case "PLAYER_BUFFERING_END": // 播放开始
			  break;
		  case "PLAYER_ERROR": // 播放出错
			  break;
		  case "EVENT_NETWORK_STATUS": //网络断开
			
			  break;
		
	}
}

iSTB.evt.set_event_callback("eventCallback"); 

function addUnitInfoList(_drawMap, __id) { //  把grid对应在正确的地方
	var squareInfo = drawSkeleton(_drawMap);
	var _width = cellWidth;
	var _hight = cellHeight;
	var _cellHigh = cellMargin;
	var unitInfo = {
		id: __id,
		ws: squareInfo.ws,
		// 宽的起始横向下标
		we: squareInfo.we,
		// 宽的结束横向下标
		ls: squareInfo.ls,
		// 长的起始纵向下标
		le: squareInfo.le,
		// 长的结束纵向下标
		left: squareInfo.ws * (_width + _cellHigh),
		top: squareInfo.ls * (_hight + _cellHigh),
		width: (squareInfo.we - squareInfo.ws + 1) * _width + (squareInfo.we - squareInfo.ws) * _cellHigh,
		height: (squareInfo.le - squareInfo.ls + 1) * _hight + (squareInfo.le - squareInfo.ls) * _cellHigh,
	}
	unitInfoList.push(unitInfo);
}
function findNextID(__str, __num) { //这里切换的思路是  横向的 就看 起始的纵坐标是否相同
	var origTemp = subFocusPos;
	
	if (__str == "H") { //横向 切换
		if (__num == 1) { //横向加
			for (var i = 0; i < unitInfoList.length; i++) {
				var poster = menuInfo.pos[i].poster;
				var url = poster.length > 0 ? poster[0].url: "";
				if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) { //这个是图片都在同一行的情况
					subFocusPos = i;
					break;
				}
			}
			if (origTemp == subFocusPos) { //上述情况不符合时
				for (var i = 0; i < unitInfoList.length; i++) {
					var poster = menuInfo.pos[i].poster;
					var url = poster.length > 0 ? poster[0].url: "";
					if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws) { //这个是不再同一行的情况比如  第一个图片是 一行一列 第二个图片是  两行一列 起始位置都是第一行
						subFocusPos = i;
						break;
					}
				}
			}
		} else {
			for (var i = 0; i < unitInfoList.length; i++) {
				var poster = menuInfo.pos[i].poster;
				var url = poster.length > 0 ? poster[0].url: "";
				if (unitInfoList[subFocusPos].ws - 1 == unitInfoList[i].we && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) {
					subFocusPos = i;
					break;
				}
			}
			if (origTemp == subFocusPos) {
				for (var i = 0; i < unitInfoList.length; i++) {
					var poster = menuInfo.pos[i].poster;
					var url = poster.length > 0 ? poster[0].url: "";
					if (unitInfoList[subFocusPos].we - 1 == unitInfoList[i].ws) {
						subFocusPos = i;
						break;
					}
				}
			}
		}
	} else if (__str == "Z") { //纵向切换
		if (__num == 1) {
			for (var i = 0; i < unitInfoList.length; i++) {
				var poster = menuInfo.pos[i].poster;
				var url = poster.length > 0 ? poster[0].url: "";
				if (unitInfoList[subFocusPos].le + 1 == unitInfoList[i].ls && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
					subFocusPos = i;
					break;
				}
			}
		} else {
			if (unitInfoList[subFocusPos].top == 0) { //上移到菜单栏
				area = 0;
				changeMenuFocus(1);
				//$("menu" + menuPos).src = menuPicArr[menuDataPos].onFocus;
				$("subMenuFocus").style.visibility = "hidden";
			}
			for (var i = 0; i < unitInfoList.length; i++) {
				var poster = menuInfo.pos[i].poster;
				var url = poster.length > 0 ? poster[0].url: "";
				if (unitInfoList[subFocusPos].ls - 1 == unitInfoList[i].le && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
					subFocusPos = i;
					break;
				}
			}
		}
	}
	
	ajustSubFocus();
}
/*调整焦点框位置*/
function ajustSubFocus() {
	//alert(unitInfoList[subFocusPos].top + "||" + unitInfoList[subFocusPos].left);
	$("subMenuFocus").style.top = (unitInfoList[subFocusPos].top + 221 - 24 - 6) + "px";
	$("subMenuFocus").style.left = (unitInfoList[subFocusPos].left + 94 - 35) + "px";
	$("subMenuFocus").style.width = (unitInfoList[subFocusPos].width + 92) + "px";
	$("subMenuFocus").style.height = (unitInfoList[subFocusPos].height + 92) + "px";
}
function doSelect() {
	var poster = menuInfo.pos[subFocusPos].poster;
	var url = poster.length > 0 ? poster[0].url: "";
	var key = poster.length > 0 ? poster[0].key: "";
	var isVideo = menuInfo.pos[subFocusPos].isvideo;
	var localVideoUrl = menuInfo.pos[subFocusPos].poster[0].url;
	menuPos = menuDataPos;

	if (url == "") {
		return; //showTips("栏目正在建设中!", 3000);
	}else if(url == "tv"){
		iSTB.browser.gotoSTB("menu");
	}else {
		savePos();
		if (isVideo == "1") {
			window.location.href = "fullPlay.htm?" + localVideoUrl;
	   }else{
			var portal = window.location.href;
			window.name=portal;
			localStorage.setItem("portal",portal);
			window.location.href = url;
	   }
	}
	if (menuPos == 2) {
		if (subFocusPos == 1) { //点点看
			iSTB.browser.gotoSTB('portal', 'type=A0201');
		}else if (subFocusPos == 2) { //文广点播
			iSTB.browser.gotoSTB('portal', 'type=A0203')
		}else if (subFocusPos == 3) { //广播频率
			iSTB.browser.gotoSTB('portal', 'type=A030301')
		}else if (subFocusPos == 5) {//华数点播
			iSTB.browser.gotoSTB('portal', 'type=A0204')
		}else if (subFocusPos == 6) { //文化教育
			iSTB.browser.gotoSTB('portal', 'type=A0302')
		}else if (subFocusPos == 7) {//电视音乐
			iSTB.browser.gotoSTB('portal', 'type=A0402')
		}else if (subFocusPos == 8) {//电视回看
			iSTB.browser.gotoSTB('portal', 'type=A0101')
		}else if (subFocusPos == 9) {//电视彩票
			iSTB.browser.gotoSTB('portal', 'type=A0403')
		}else if (subFocusPos == 10) {//电视阅读
			iSTB.browser.gotoSTB('portal', 'type=A040401')
		}else if (subFocusPos == 11) {//电视美术馆
			iSTB.browser.gotoSTB('portal', 'type=647')
		}
		savePos();
	}
}

/*显示音量条*/
var volumeTimeout = -1;
var volumePlayFlag = false;
function showVolume(){
	clearTimeout(volumeTimeout);
	$("volBar").style.visibility = "visible";
	volumePlayFlag = true;
	try{
		var currVolume = parseInt(iSTB.player.get_volume(), 10);
		$("volProcess").style.width = Math.floor(parseInt(currVolume,10)/32*547) + "px";
		$("volPoint").style.left = 90 + Math.floor(parseInt(currVolume,10)/32*547) + "px";
		$("volWidth").width = Math.floor(parseInt(currVolume,10)/32*547) - 20 + "px";
		$("volValue").innerText = currVolume;
	}catch(e){
		
	}
	volumeTimeout = setTimeout('hideVolume();',7000);
}

function hideVolume(){
	volumePlayFlag = false;
	$("volBar").style.visibility = "hidden";
}


/*显示提示信息*/
function showTips(msg, flag) {
	showTipsFlag = true;
	$("tipsDiv").style.visibility = "visible";
	$("tipsDiv").innerText = msg;
	clearTimeout(showTipsTimer);
	if (typeof(flag) != "undefined") { // 不传flag时表示不自动影藏
		showTipsTimer = setTimeout(hideTips, flag);
	}
}
/*影藏提示信息*/
function hideTips() {
	showTipsFlag = false;
	clearTimeout(showTipsTimer);
	$("tipsDiv").style.visibility = "hidden";
	$("tipsDiv").innerText = "";
}
function savePos() {
	sessionStorage.setItem("indexMainPos", menuPos);
	sessionStorage.setItem("indexmenuDataPos",menuDataPos);
	sessionStorage.setItem("indexSubPos", subFocusPos);
	sessionStorage.setItem("indexAreaPos", area);
}
function exitPage() {
	closeSmallVideo();
}
