
var imgArr = ["image/bg.gif"]; 
for (var i = 0; i < imgArr.length; i++) {
	var img = new Image();
	img.src = imgArr[i];
}
var areaPos = 0; //�������� 0�����˵� 1���Ӳ˵�
var menuPos = 0; //һ���˵�����λ��
var menuDataPos = 0;
var menuBox = null; //һ���˵��ƶ�����
var subMenuTimer = -1; //����Ŀ��ʾ��ʱ��
var infoTimer = -1; //������Ϣ��ʾ��ʱ��

var cellWidth = 147; //��Ԫ��Ŀ��
var cellHeight = 124; //��Ԫ��ĸ߶�
var cellMargin = 10; //��Ԫ��֮���϶
var unitInfoList = []; //���ID������ left\top\width\heigh
var area = 0; //�������� 0��һ����Ŀ 1������Ŀ
var subFocusPos = 0; //����Ŀ����λ��
var menuInfo = null; //��ǰ����Ŀ����
var showTipsFlag = false; //��Ϣ��ʾ���Ƿ���ʾ  false:δ��ʾ  true����ʾ
var showTipsTimer = -1; //��Ϣ��ʾ���Զ�Ӱ�ؼ�ʱ��
var video_wdds = "";
//var video_wdsq = "http://10.191.69.201/ts/zjljz.mp4"; //�ҵ�������Ӧ��С�����ļ�
//ar video_wdcs = "http://10.191.69.201/ts/lqljz.mp4"; //�ҵĳ��ж�Ӧ��С�����ļ�

/*var mailAjaxObj = null; //�ʼ�����ajax����
var mailList = []; //���е��ʼ�����
var newMaillist = []; //δ�����ʼ�����*/
var caId = ""; //CA����
var marqueeText = "��ӭ�����ǻ�Ϋ��"; //�ײ���������

var menuMaxLen = menuData.length;// ���˵�div��ʾ����Ŀ
var menuMaxNum = 4;//һҳ�����ʾ���˵�������������Ҫ���ģ�
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
	case 48:  //��0������������
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

/* ��������õ���ͼƬ,����onload����������. */
var imgObjArr = [];
function preDownImage() {
	for (var i = 0; i < menuData.length; i++) { //���˵�
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
	for (var i = 0; i < menuData.length; i++) { // ����Ŀ
		for (var j = 0; j < menuData[i].pos.length; j++) {
			var imgObj = new Image();
			imgObj.src = menuData[i].pos[j].poster[0].src;
			imgObjArr.push(imgObj);
		}
	}
}


/**
* ��̬����һ���˵�
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



/*�˵������ƶ�*/
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
	}, 200); //�ӳ�ȥ��������Ŀ
}
/*������˵������Ƿ�����β*/
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

/*�رյ�ǰҳ���С����*/
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
	for (var i = 0; i < len; i++) { //������ǰ��������Ŀ
		var drawMap = menuInfo.pos[i].grid; //��ȡÿ������Ŀ��λ��
		var poster = menuInfo.pos[i].poster;
		var imge = poster.length > 0 ? poster[0].src: "";
		count++;
		addUnitInfoList(drawMap, "unit" + count); //������ǰ�ÿ������ div����unitInfoList��
		drawUnit(drawMap, cellWidth, cellHeight, cellMargin, "unit" + count, "squareBox", imge); //�������������div
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
		 case "PLAYER_FINISH": // ���Ž���;
		     iSTB.player.stop();
			 iSTB.player.play(url);
			 break;
		  case "PLAYER_BUFFERING_END": // ���ſ�ʼ
			  break;
		  case "PLAYER_ERROR": // ���ų���
			  break;
		  case "EVENT_NETWORK_STATUS": //����Ͽ�
			
			  break;
		
	}
}

iSTB.evt.set_event_callback("eventCallback"); 

function addUnitInfoList(_drawMap, __id) { //  ��grid��Ӧ����ȷ�ĵط�
	var squareInfo = drawSkeleton(_drawMap);
	var _width = cellWidth;
	var _hight = cellHeight;
	var _cellHigh = cellMargin;
	var unitInfo = {
		id: __id,
		ws: squareInfo.ws,
		// �����ʼ�����±�
		we: squareInfo.we,
		// ��Ľ��������±�
		ls: squareInfo.ls,
		// ������ʼ�����±�
		le: squareInfo.le,
		// ���Ľ��������±�
		left: squareInfo.ws * (_width + _cellHigh),
		top: squareInfo.ls * (_hight + _cellHigh),
		width: (squareInfo.we - squareInfo.ws + 1) * _width + (squareInfo.we - squareInfo.ws) * _cellHigh,
		height: (squareInfo.le - squareInfo.ls + 1) * _hight + (squareInfo.le - squareInfo.ls) * _cellHigh,
	}
	unitInfoList.push(unitInfo);
}
function findNextID(__str, __num) { //�����л���˼·��  ����� �Ϳ� ��ʼ���������Ƿ���ͬ
	var origTemp = subFocusPos;
	
	if (__str == "H") { //���� �л�
		if (__num == 1) { //�����
			for (var i = 0; i < unitInfoList.length; i++) {
				var poster = menuInfo.pos[i].poster;
				var url = poster.length > 0 ? poster[0].url: "";
				if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) { //�����ͼƬ����ͬһ�е����
					subFocusPos = i;
					break;
				}
			}
			if (origTemp == subFocusPos) { //�������������ʱ
				for (var i = 0; i < unitInfoList.length; i++) {
					var poster = menuInfo.pos[i].poster;
					var url = poster.length > 0 ? poster[0].url: "";
					if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws) { //����ǲ���ͬһ�е��������  ��һ��ͼƬ�� һ��һ�� �ڶ���ͼƬ��  ����һ�� ��ʼλ�ö��ǵ�һ��
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
	} else if (__str == "Z") { //�����л�
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
			if (unitInfoList[subFocusPos].top == 0) { //���Ƶ��˵���
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
/*���������λ��*/
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
		return; //showTips("��Ŀ���ڽ�����!", 3000);
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
		if (subFocusPos == 1) { //��㿴
			iSTB.browser.gotoSTB('portal', 'type=A0201');
		}else if (subFocusPos == 2) { //�Ĺ�㲥
			iSTB.browser.gotoSTB('portal', 'type=A0203')
		}else if (subFocusPos == 3) { //�㲥Ƶ��
			iSTB.browser.gotoSTB('portal', 'type=A030301')
		}else if (subFocusPos == 5) {//�����㲥
			iSTB.browser.gotoSTB('portal', 'type=A0204')
		}else if (subFocusPos == 6) { //�Ļ�����
			iSTB.browser.gotoSTB('portal', 'type=A0302')
		}else if (subFocusPos == 7) {//��������
			iSTB.browser.gotoSTB('portal', 'type=A0402')
		}else if (subFocusPos == 8) {//���ӻؿ�
			iSTB.browser.gotoSTB('portal', 'type=A0101')
		}else if (subFocusPos == 9) {//���Ӳ�Ʊ
			iSTB.browser.gotoSTB('portal', 'type=A0403')
		}else if (subFocusPos == 10) {//�����Ķ�
			iSTB.browser.gotoSTB('portal', 'type=A040401')
		}else if (subFocusPos == 11) {//����������
			iSTB.browser.gotoSTB('portal', 'type=647')
		}
		savePos();
	}
}

/*��ʾ������*/
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


/*��ʾ��ʾ��Ϣ*/
function showTips(msg, flag) {
	showTipsFlag = true;
	$("tipsDiv").style.visibility = "visible";
	$("tipsDiv").innerText = msg;
	clearTimeout(showTipsTimer);
	if (typeof(flag) != "undefined") { // ����flagʱ��ʾ���Զ�Ӱ��
		showTipsTimer = setTimeout(hideTips, flag);
	}
}
/*Ӱ����ʾ��Ϣ*/
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
