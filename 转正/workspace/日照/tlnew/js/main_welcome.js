/******************************** 消息的处理-start ***********************************************/
var IPANEL30 = true; //true:iPanel 3.0; false:其它
var userAgent = navigator.userAgent.toLowerCase(); //浏览器版本，用于区分是3.0和还是其它
if (userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1) {
    IPANEL30 = true;
} else {
    IPANEL30 = false;
}
var EVENT = { STOP: 0, DOWN: 1, ADVECTED: 2 }; //消息/按键流向定义
if (!IPANEL30) {
    EVENT = { STOP: false, DOWN: true, ADVECTED: true };
}

//获取浏览器版本
var BrowserType = getBrowserType();

function getBrowserType() {
    var ua = navigator.userAgent.toLowerCase();
    return /ipanel/.test(ua) ? 'iPanel' : /enrich/.test(ua) ? 'EVM' : /wobox/.test(ua) ? 'Inspur' : window.ActiveXObject ? 'IE' : document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox' : window.openDatabase && !/chrome/.test(ua) ? 'Safari' : /opr/.test(ua) ? 'Opera' : window.MessageEvent && !document.getBoxObjectFor ? 'Chrome' : '';
}

document.onkeydown = grabEvent;

function grabEvent(event) {
    /*clearInterval(gotoTVTimer);
    gotoTV();*/

    var keycode = event.which;
    iDebug(">>>smile_portal index.htm  grabEvent keycode=" + keycode);
    switch (keycode) {
        case 1:
        case 38:
            moveUD(-1);
            return EVENT.STOP;
            break;
        case 2:
        case 40:
            moveUD(1);
            return EVENT.STOP;
            break;
        case 3:
        case 37:
            moveLR(-1);
            return EVENT.STOP;
            break;
        case 4:
        case 39:
            moveLR(1);
            return EVENT.STOP;
            break;
        case 13:
            doSelect();
            return EVENT.STOP;
            break;
        case 339:
        case 27:
            iSTB.browser.gotoSTB("tv");
            event.returnValue = false;
            return EVENT.STOP;
            break;
        case 340:
        case 8:
            if(mySessionStorage.getItem("platformUrl")){
                var backUrl = mySessionStorage.getItem("platformUrl");
                mySessionStorage.removeItem("platformUrl");
                window.location.href = backUrl;
            }
            else{
                iSTB.browser.gotoSTB("menu");
                event.returnValue = false;
            }
            return EVENT.STOP;
            break;
        case 595:
        case 4109: //volume +
            break;
        case 596:
        case 4110: //volume -
            break;
        case 597:
        case 4108: //volume mute
    }
    return EVENT.DOWN;
}

document.onsystemevent = grabSysEvent;

function grabSysEvent(event) {
    var keyval = event.which;
    iDebug(">>>smile_portal index.htm  grabSysEvent keyval=" + keyval);
    switch (keyval) {
        case 5202:
            media.AV.play();
            return EVENT.STOP;
            break;
        case 5210:
            media.AV.seek("00:00:00");
            return EVENT.STOP;
            break;
        case 5203:
        case 5205:
        case 5206:
        case 5209: //这些消息都要截掉，不然会流到UI里去处理
            return EVENT.STOP;
            break;

    }
}
/*************************************** 消息的处理-end ************************************************/

/*************************************** 焦点坐标-start ************************************************/
var posList = [[74,10],[240,10],[406,10],[406,305],[406,594],[406,890],[240,890],[74,890]];
var UDList = [[2,1],[0,2],[1,0],[8,8],[8,8],[6,7],[7,5],[5,6],[3,3]];
var LRList = [[7,8],[6,8],[5,3],[2,4],[3,5],[4,2],[8,1],[8,0],[0,7]];
var mySessionStorage = new globalVar();
var focusIndex = parseInt(mySessionStorage.getItem("zhdj_focus")) || 0;
/*************************************** 焦点坐标-end ************************************************/


/*************************************** 逻辑方法--start ************************************************/
function globalVar() {
    this.getItem = function(_str) {
        var val = "";
        if (IPANEL30) {
            val = iPanel.getGlobalVar(_str);
        } else {
            val = sessionStorage.getItem(_str);
        }
        iDebug(">>>smile mySessionStorage.getItem(" + _str + ") = " + val);
        return val;
    };
    this.removeItem = function(_str) {
        iDebug(">>>smile mySessionStorage.removeItem(" + _str + ")");
        if (IPANEL30) {
            iPanel.delGlobalVar(_str);
        } else {
            sessionStorage.removeItem(_str);
        }
    }
    this.setItem = function(_key, _val) {
        iDebug(">>>smile mySessionStorage.setItem(" + _key + ") = " + _val);
        if (IPANEL30) {
            iPanel.setGlobalVar(_key, _val);
        } else {
            sessionStorage.setItem(_key, _val);
        }
    }
}

function iDebug(str) {
    if(IPANEL30) {
        iPanel.debug(str);
    } else {
        console.log(str);
    }
}

function $(id) {
    return document.getElementById(id);
}


function moveUD(_num) {
    if(_num === -1) {
        focusIndex = UDList[focusIndex][0];
    } else {
        focusIndex = UDList[focusIndex][1];
    }
    setFocus();
}


function moveLR(_num) {
    if(_num === -1) {
        focusIndex = LRList[focusIndex][0];
    } else {
        focusIndex = LRList[focusIndex][1];
    }
    setFocus();
}

function setFocus() {
    if(focusIndex !== 8) {
        $("videoFocus").style.visibility = "hidden";
        $("menuFocus").style.visibility = "visible";
        $("menuFocus").style.top = posList[focusIndex][0] + "px";
        $("menuFocus").style.left = posList[focusIndex][1] + "px";
    } else {
        $("videoFocus").style.visibility = "visible";
        $("menuFocus").style.visibility = "hidden";
    }
}

function doSelect() {
    mySessionStorage.setItem("welcomeUrl",window.location.href);
    mySessionStorage.setItem("portalMainPos",menuData[focusIndex].portalPos);   
    mySessionStorage.setItem("zhdj_focus",focusIndex);
    window.location.href = menuData[focusIndex].linkUrl;
}

function initMenu() {
    for(var i=0,len=menuData.length;i<len;++i) {
        if(menuData[i]) {
            $("img"+i).src = menuData[i].imageUrl;
        }
    }
}

function init() {
    initMenu();
    initVideo();
    setFocus();
}

window.onload = init;
/*************************************** 逻辑方法--end ************************************************/

/*************************************** 视频调控--start ************************************************/
var muteDivId = ""; //静音图标所在的div
//调节音量
function changeVolume(__num) {
    if (media.sound.isMute == 1) { //静音状态
        media.sound.resume();
        hideMute(muteDivId);
    }
    var tempVolume = media.sound.value;
    tempVolume += __num;
    if (tempVolume > 100) {
        tempVolume = 100;
    } else if (tempVolume < 0) {
        tempVolume = 0;
    }
    media.sound.value = tempVolume;
}

//检查静音状态
function checkMute() {
    var status = media.sound.isMute;
    if (status == 1) { //静音
        showMute(muteDivId);
        return true;
    } else {
        hideMute(muteDivId);
        return false;
    }
}

//静音切换
function actionMute() {
    var status = media.sound.isMute;
    if (status == 1) { //静音
        media.sound.resume();
        hideMute(muteDivId);
    } else {
        media.sound.mute();
        showMute(muteDivId);
    }
}

//显示静音图标
function showMute() {
    if (muteDivId == "") return;
    $(muteDivId).style.visibility = "visible";
}

//影藏静音图标
function hideMute() {
    if (muteDivId == "") return;
    $(muteDivId).style.visibility = "hidden";
}

//播放小视屏
function initVideo() {
    //closeSmallVideo();
    var tmpInfo = videoData;
    localVideoUrl = videoData.videoUrl;
    if (BrowserType == "iPanel") {
        media.video.setPosition(tmpInfo.pos.left, tmpInfo.pos.top, tmpInfo.pos.width, tmpInfo.pos.height);
        media.AV.open(localVideoUrl, "HTTP");
    } else if (BrowserType == "Inspur") {
        iSTB.player.play(localVideoUrl);
        iSTB.player.set_video_window(tmpInfo.pos.left, tmpInfo.pos.top, tmpInfo.pos.width, tmpInfo.pos.height);
    }
}

//关闭当前页面的小视屏
function closeSmallVideo() {
    iDebug(">>>smile_portal index.htm  closeSmallVideo in...");
    if (BrowserType == "iPanel") {
        media.AV.stop();
        media.AV.close();
    } else if (BrowserType == "Inspur") {
        iSTB.player.stop();
    }
    iDebug(">>>smile_portal index.htm  closeSmallVideo out...");
}
/*************************************** 视频调控--end ************************************************/