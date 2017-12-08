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
            if(isFullScreen) {
                var volume =  iSTB.player.get_volume();
                if(volume <= 1){
                    volume = 0;
                    isMute = 1;
                    showMute(muteDivId);
                }else{
                    if(isMute) {
                         isMute = 0;
                         hideMute(muteDivId);
                    }
                    volume -= 1;
                }
                iSTB.player.set_volume(volume);
                showVolume();
            }
            else if(volumePlayFlag) {
                var volume =  iSTB.player.get_volume();
                if(volume <= 1){
                    volume = 0;
                    isMute = 1;
                    showMute(muteDivId);
                }else{
                    if(isMute) {
                         isMute = 0;
                         hideMute(muteDivId);
                    }
                    volume -= 1;
                }
                iSTB.player.set_volume(volume);
                showVolume();
            } else {
                moveLR(-1);
            }     
            return EVENT.STOP;
            break;
        case 4:
        case 39:
            if(isFullScreen) {
                var volume =  iSTB.player.get_volume();
                volume = volume+1<32?volume+1:32;
                if(isMute) {
                     isMute = 0;
                     hideMute(muteDivId);
                }
                iSTB.player.set_volume(volume);
                showVolume();
                if(isMute){
                    hideMute();
                }
            }
            else if(volumePlayFlag) {
                var volume =  iSTB.player.get_volume();
                volume = volume+1<32?volume+1:32;
                if(isMute) {
                     isMute = 0;
                     hideMute(muteDivId);
                }
                iSTB.player.set_volume(volume);
                showVolume();
                if(isMute){
                    hideMute();
                }
            } else {
                moveLR(1);
            }
            return EVENT.STOP;
            break;
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
            if(isFullScreen){
                var tmpInfo = videoData;
                document.body.background = "images/bg-ch.png";
                $("content").style.display = "block";
                isFullScreen = false;
                try{
                    iSTB.player.set_video_window(tmpInfo.pos.left, tmpInfo.pos.top, tmpInfo.pos.width, tmpInfo.pos.height);
                }
                catch(e){}  
            } else {
               var backUrl = mySessionStorage.getItem("platformUrl");
                iDebug("[main_welcome.js]__backUrl1="+backUrl);
                if(backUrl!=""&&backUrl!=null){
                    mySessionStorage.removeItem("platformUrl");
                }else{
                    backUrl = "http://10.191.150.104/app/wldjpt/wldjpt/index.htm"
                }
                iDebug("[main_welcome.js]__backUrl2="+backUrl);
                window.location.href = backUrl;
            }         
            // event.preventDefault(); 
            return EVENT.STOP;
            break;
        case 48:
        case 66:
            if(!volumePlayFlag){
                showVolume();
            }
            else{
                hideVolume();
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
            actionMute();
            return EVENT.STOP;
            break;
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
var posList = [[176,48],[176,238],[176,428],[351,48],[351,238],[351,428],[178,618]];
var UDList = [[3,3],[4,4],[5,5],[0,0],[1,1],[2,2],[6,6]];
var LRList = [[2,1],[0,2],[1,6],[5,4],[3,5],[4,6],[2,6]];
var isFullScreen = false;
var mySessionStorage = new globalVar();
var focusIndex = parseInt(mySessionStorage.getItem("zhdj_focus")) || 0;
var downFlag = 0;
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
    if((_num === -1&&focusIndex === 2) || (_num === 1&& focusIndex === 1)) {
        LRList[8] = [1,2];
    } else if((_num === -1 && focusIndex === 6) || (_num === 1 && focusIndex === 5)) {
        LRList[8] = [5,6];
    }
    if(_num === -1) {
        focusIndex = LRList[focusIndex][0];
    } else {
        focusIndex = LRList[focusIndex][1];
    }
    setFocus();
}

function setFocus() {
    $("focus").style.top = posList[focusIndex][0] + "px";
    $("focus").style.left = posList[focusIndex][1] + "px";
    if(focusIndex === 6) {
        $("focus").style.width = "600px";
        $("focus").style.height = "380px";
    } else {
        $("focus").style.width = "220px";
        $("focus").style.height = "205px";
    }
}

function doSelect() {
    if(focusIndex != 6) {
        mySessionStorage.setItem("welcomeUrl",window.location.href);
        mySessionStorage.setItem("portalMainPos",menuData[focusIndex].portalPos);   
        mySessionStorage.setItem("zhdj_focus",focusIndex);
        window.location.href = menuData[focusIndex].linkUrl;
    } else {
        document.body.background = "";
        $("content").style.display = "none";
        isFullScreen = true;
        try{
            iSTB.player.set_video_window(0,0,1280,720);
        }
        catch(e){}
    }
}

function initMenu() {
    for(var i=0,len=menuData.length;i<len;++i) {
        if(menuData[i]) {
            $("item"+i).src = menuData[i].imageUrl;
        }
    }
}

function init() {
    mySessionStorage.setItem("portalFlag","2");
    initMenu();
    setFocus();
    initVideo();
}

window.onload = init;
/*************************************** 逻辑方法--end ************************************************/

/*************************************** 视频调控--start ************************************************/
var volumeTimeout = -1;
var volumePlayFlag = false;
var muteDivId = "mute_div"; //静音图标所在的div
var isMute = 0;

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
    volumeTimeout = setTimeout(hideVolume,7000);
}

function hideVolume(){
    volumePlayFlag = false;
    $("volBar").style.visibility = "hidden";
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
        hideMute();
    } else {
        media.sound.mute();
        showMute();
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