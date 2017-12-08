var mySessionStorage = new globalVar(); //用于管理全局变量
var showTipsFlag = false; //消息提示框是否显示  false:未显示  true：显示
var showTipsTimer = -1; //消息提示框自动影藏计时器
var needStopVideo = true; //卸载页面时是否需要执行停止视频的操作
var totalColumnNum = 0; //一级菜单的栏目个数
var area = 0; //焦点区域 0：一级栏目 1：子栏目
var menuPos = 0; //一级菜单焦点位置
var menuBox = null; //一级菜单移动对象
var subMenuTimer = -1; //子栏目显示计时器
var delayLoadTimer = -1; //延迟加载无关信息的计时器
var subImgArr = []; //所有的二级栏目图片,数组里每个元素均对应一个栏目的所有图片
var localVideoUrl = ""; //本地小视屏框播的文件路径
var videoInfoArr = []; //存放每个一级栏目的视频信息
var subHTMLReady = []; //每个栏目对一个的二级页面代码是否都已获取过了  1：获取过了 其它：未获取
var unitInfoListArr = []; //存放所有栏目对应的二级页面的模块坐标信息
var unitInfoList = []; //当前栏目二级页面的所有模块坐标信息 left\top\width\heigh
var subFocusPos = 0; //子栏目焦点位置
var messageId = 0; //底部滚动消息 当前是用的哪个div
var messagePos = 0; //底部滚动消息 当前显示的是第几条消息

//针对不同portal进行编辑
var pageMenuSize = 8; //默认当前可见主菜单个数
var menuStep = 132; //默认主菜单间距
var cellWidth = 147; //单元格的宽度
var cellHeight = 124; //单元格的高度
var cellMargin = 9; //单元格之间间隙
var cellMarginColor = "#CCCCCC"; //单元格之间间隙填充颜色,选择与背景色类似的颜色
var enableCellMarginColor = false; //true：单元格的间隙需要填充颜色 false:不需要填充颜色
var enableMainMenuFont = false; //是否允许编辑一级栏目名称
var enableSubMenuFont = false; //是否允许编辑二级栏目名称
var fontStyleArr = []; //二维数组，每个栏目下的每个div对应的字体属性设置，如不设置则将使用默认属性设置字体
var gotoTVTimer = null;


var marqueeShowStyle = 2; //底部消息的显示形式 1：传统的跑马灯形式 2：新的上下滚动形式             
var message = ["智慧社区魅力无限", "iPanel助力智慧社区，精彩由你掌控"]; //底部滚动消息，可以是多条

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
/*************************************** 消息的处理-end ************************************************/
document.onkeydown = grabEvent;

function grabEvent(event) {
    /*clearInterval(gotoTVTimer);
    gotoTV();*/
    if (showTipsFlag) { //有按键则将消息提示框影藏
        hideTips();
    }
    var keycode = event.which;
    iDebug(">>>smile_portal index.htm  grabEvent keycode=" + keycode);
    switch (keycode) {
        case 1:
        case 38:
            if (area == 1) {
                findNextID("Z", -1);
            }
            return EVENT.STOP;
            break;
        case 2:
        case 40:
            if (area == 0) {
                area = 1;
                //$("menuFocusDiv").style.visibility = "hidden";
                if (enableMainMenuFont) {
                    $("menuTitle" + menuBox.focusPos).style.color = "#127D94";
                }
                ajustSubFocus();
                $("subMenuFocus").style.visibility = "visible";
            } else {
                findNextID("Z", 1);
            }
            return EVENT.STOP;
            break;
        case 3:
        case 37:
            if (area == 0) {
                changeMenu(-1);
            } else {
                findNextID("H", -1);
            }
            return EVENT.STOP;
            break;
        case 4:
        case 39:
            if (area == 0) {
                changeMenu(1);
            } else {
                findNextID("H", 1);
            }
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
            history.back();
			event.preventDefault(); 
            return EVENT.STOP;
            break;
        case 595:
        case 4109: //volume +
            changeVolume(3);
            break;
        case 596:
        case 4110: //volume -
            changeVolume(-3);
            break;
        case 597:
        case 4108: //volume mute
            actionMute();
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

function init() {
    totalColumnNum = menuData.length;
    initMenuDiv();
    checkSubDiv();
    checkFontStyle();
    getAllImg();
    getPos();
    initMenu();
    //延迟显示次要信息以及预加载图片
    delayLoadTimer = setTimeout(function() {
        //initTime();
        //showMessage();
        //preLoadAllImg();
        preLoadAllSubDiv();
    }, 2000);
}

function gotoTV() {
    gotoTVTimer = setInterval(function() {
        iSTB.browser.gotoSTB("tv");
    }, 6 * 1000);
}

function getPos() {
    var pos = mySessionStorage.getItem("portalMainPos");
    if (pos != "" && pos != "undefined" && pos != null) {
        menuPos = parseInt(pos, 10);
    }
    var subPos = mySessionStorage.getItem("portalSubPos");
    if (subPos != "" && subPos != "undefined" && subPos != null) {
        subFocusPos = parseInt(subPos, 10);
    }
    var areaPos = mySessionStorage.getItem("portalAreaPos");
    if (areaPos != "" && areaPos != "undefined" && areaPos != null) {
        area = parseInt(areaPos, 10);
    }
    iDebug(">>>smile_portal index.htm getPos menuPos=" + menuPos + ",subFocusPos=" + subFocusPos + ",area=" + area);
    mySessionStorage.removeItem("portalMainPos");
    mySessionStorage.removeItem("portalSubPos");
    mySessionStorage.removeItem("portalAreaPos");
}

/*显示时间*/
function initTime() {
    $("timeTd").innerText = getTimeByFormat("hh:mm");
    $("weekSpan").innerText = getTimeByFormat("w", "chi");
    $("dateSpan").innerText = getTimeByFormat("YYYY/MM/dd");
    setTimeout(initTime, 3000); //每隔3s更新一次数据
}
/*显示底部滚动消息*/
function showMessage() {
    if (marqueeShowStyle == 1) { //传统的跑马灯形式，数据来源于menu.js
        var marqueeText = menuData[0].key;
        $("marqueeDiv").innerHTML = "<marquee>" + marqueeText + "</marquee>";
    } else { //多条数据上下滑动,数据来源于固定的message数组
        if (message.length > 0) {
            if (message.length == 1) {
                $("message0").innerText = message[0];
            } else {
                $("message" + (messageId + 1) % 2).style.webkitTransitionDuration = "0ms";
                $("message" + (messageId + 1) % 2).style.top = "-40px";
                $("message" + (messageId + 1) % 2).innerText = message[messagePos];
                $("message" + messageId).style.webkitTransitionDuration = "0ms";

                setTimeout(function() {
                    $("message" + messageId).style.webkitTransitionDuration = "300ms";
                    $("message" + messageId).style.top = "40px"; //往下滚动
                    $("message" + (messageId + 1) % 2).style.webkitTransitionDuration = "300ms";
                    $("message" + (messageId + 1) % 2).style.top = "0px"; //往下滚动
                    messageId = (messageId + 1) % 2;
                }, 5);
                messagePos = (messagePos + 1) % message.length;
                setTimeout(showMessage, 5000);
            }
        }
    }
}

//初始化一级栏目的div
function initMenuDiv() {
    if (totalColumnNum < pageMenuSize) {
        pageMenuSize = totalColumnNum;
        menuStep = Math.floor(924 / pageMenuSize);
    }
    var _left = 0;
    var mainMenuStr = "";
    if (enableMainMenuFont) {
        for (var i = 0; i < pageMenuSize; i++) {
            _left = i * menuStep + 114;
            mainMenuStr += "<div style=\"left:" + _left + "px;\" class=\"menuDiv\"><img src=\"\" id=\"menuImg" + i + "\"/><div class=\"menuTitle\" id=\"menuTitle" + i + "\"></div></div>"
        }
    } else {
        for (var i = 0; i < pageMenuSize; i++) {
            _left = i * menuStep + 114;
            mainMenuStr += "<div style=\"left:" + _left + "px;\" class=\"menuDiv\"><img src=\"\" id=\"menuImg" + i + "\"/></div>"
        }
    }

    $("mainMenuDiv").innerHTML = mainMenuStr;
}

/*检查二级栏目的div是否够用，默认只创建了10个div*/
function checkSubDiv() {
    if (totalColumnNum > 10) { //如果一级栏目超过10个则需要增加DIV
        for (var i = 10; i < totalColumnNum; i++) {
            var divObj = document.createElement("div");
            divObj.className = "subDiv";
            divObj.id = "squareBox" + i;
            $("subDiv").appendChild(divObj);
        }
    }
}

//初始化栏目字体设置
function checkFontStyle() {
    if (fontStyleArr.length == 0) { //没有特殊设置,需要置为空
        for (var i = 0; i < totalColumnNum; i++) {
            fontStyleArr[i] = [];
            var subLen = menuData[i].pos.length;
            for (var j = 0; j < subLen; j++) {
                fontStyleArr[i][j] = "";
            }
        }
    }
}

//获取所有栏目图片
function getAllImg() {
    subImgArr = [];
    var i = 0;
    var j = 0;
    var subData = [];
    var subLen = 0;
    var subImg = [];
    var currImg = "";
    iDebug(">>>smile_portal index.htm getAllImg totalColumnNum=" + totalColumnNum);
    for (; i < totalColumnNum; i++) { //遍历一级栏目
        subData = menuData[i].pos;
        subLen = subData.length;
        subImg = [];
        j = 0;
        iDebug(">>>smile_portal index.htm getAllImg subLen=" + subLen);
        for (; j < subLen; j++) { //遍历二级栏目
            if (subData[j].poster.length > 0) { //因为在portalcms后台进行预览时poster有可能为空，所以都需要判断下
                currImg = subData[j].poster[0].src;
                //iDebug(">>>smile_portal index.htm getAllImg j=" + j + ",currImg=" + currImg);
                if (currImg != "") {
                    subImg.push(currImg);
                }
            }
        }
        iDebug(">>>smile_portal index.htm getAllImg subImg.length=" + subImg.length + ",subImgArr.length=" + subImgArr.length);
        subImgArr[subImgArr.length] = subImg;
    }
}

//预加载所有栏目图片
function preLoadAllImg() {
    var i = 0;
    var j = 0;
    var currSubImg = [];
    var currSubLen = 0;
    for (; i < totalColumnNum; i++) {
        currSubImg = subImgArr[i];
        currSubLen = currSubImg.length;
        j = 0;
        for (; j < currSubLen; j++) {
            var img = new Image();
            img.src = currSubImg[j];
        }
    }
}

/*初始化一级菜单*/
function initMenu() {
    iDebug(">>>index initMenu pageMenuSize:" + pageMenuSize + " totalColumnNum:" + totalColumnNum);
    menuBox = new showList(pageMenuSize, totalColumnNum, menuPos, 183, window);
    //menuBox.focusDiv = "menuFocusDiv";
    menuBox.listSign = 1;
    menuBox.listHigh = menuStep;
    menuBox.focusLoop = true;
    menuBox.haveData = function(List) {
        if (List.idPos == menuBox.focusPos) {
            $("menuImg" + List.idPos).src = menuData[List.dataPos].focus;
            if (enableMainMenuFont) {
                $("menuTitle" + List.idPos).style.color = "#9E48ED";
                $("menuTitle" + List.idPos).innerText = menuData[List.dataPos].name;
            }
        } else {
            $("menuImg" + List.idPos).src = menuData[List.dataPos].blur;
            if (enableMainMenuFont) {
                $("menuTitle" + List.idPos).style.color = "#666";
                $("menuTitle" + List.idPos).innerText = menuData[List.dataPos].name;
            }
        }
    };
    menuBox.notData = function(List) {
        $("menuImg" + List.idPos).src = "";
        if (enableMainMenuFont) {
            $("menuTitle" + List.idPos).innerText = "";
        }
    };
    menuBox.startShow();
    //checkMenuPosOver();
    showSubMenu();
}

/*菜单焦点移动*/
function changeMenu(_num) {
    //切换背景
    $("menuImg" + menuBox.focusPos).src = menuData[menuPos].blur;
    if (enableMainMenuFont) {
        $("menuTitle" + menuBox.focusPos).style.color = "#666";
    }
    menuBox.changeList(_num);
    menuPos = menuBox.position;
    $("menuImg" + menuBox.focusPos).src = menuData[menuPos].focus;
    if (enableMainMenuFont) {
        $("menuTitle" + menuBox.focusPos).style.color = "#9E48ED";
    }
    subFocusPos = 0;
    clearTimeout(subMenuTimer);
    subMenuTimer = setTimeout(showSubMenu, 100); //延迟去加载子栏目
}

/*检测主菜单数据是否到了首尾*/
function checkMenuPosOver() {
    iDebug(">>>smile_portal index.htm checkMenuPosOver menuPos=" + menuPos + ",menuData.length=" + menuData.length);
    if (menuPos == 0) {
        $("arrowLeftDiv").style.visibility = "hidden";
    } else {
        $("arrowLeftDiv").style.visibility = "visible";
    }
    if (menuPos == (totalColumnNum - 1)) {
        $("arrowRightDiv").style.visibility = "hidden";
    } else {
        $("arrowRightDiv").style.visibility = "visible";
    }
}

//预加载其它栏目
function preLoadAllSubDiv() {
    for (var i = 0; i < totalColumnNum; i++) {
        if (subHTMLReady[i] != "1") {
            generalSubDiv(i);
        }
    }
}

//动态生成二级栏目div
function generalSubDiv(_menuPos) {
    var tmpUnitInfoList = [];
    $("squareBox" + _menuPos).innerHTML = "";
    var subInfo = menuData[_menuPos];
    var len = subInfo.pos.length;
    iDebug(">>>smile_portal index.htm  generalSubDiv subInfo.pos.length=" + len);
    var tmpObj = { "hasVideo": false, "videoUrl": "", "pos": {} }; //视频信息初始化对象
    var i = 0;
    for (; i < len; i++) { //遍历当前所有子栏目
        var drawMap = subInfo.pos[i].grid; //获取每个子栏目的位置
        var poster = subInfo.pos[i].poster;
        var imge = poster.length > 0 ? poster[0].src : "";
        var title = poster.length > 0 ? poster[0].title : "";
        var fontStyle = fontStyleArr[_menuPos][i];
        var currUnitInfo = drawUnit(drawMap, cellWidth, cellHeight, cellMargin, "unit" + i, "squareBox" + _menuPos, imge, title, fontStyle); //这个画出来整个div
        tmpUnitInfoList.push(currUnitInfo); //保存每个div的坐标
        //修改当前栏目的视频信息
        if (subInfo.pos[i].isVideo == "1") {
            tmpObj = { "hasVideo": true, "videoUrl": poster[0].url, "pos": { "left": currUnitInfo.left + 76, "top": currUnitInfo.top + 147, "width": currUnitInfo.width, "height": currUnitInfo.height } };
        }
    }
    videoInfoArr[_menuPos] = tmpObj; //存储当前栏目的视频信息
    subHTMLReady[_menuPos] = "1"; //当前栏目若已填充则置为1
    unitInfoListArr[_menuPos] = tmpUnitInfoList; //保存当前栏目全部div的坐标信息 
}

//显示当前二级栏目
function showSubMenu() {
    iDebug(">>>smile_portal index.htm  showSubMenu menuPos=" + menuPos + ",subHTMLReady.length=" + subHTMLReady.length);
    //切换需要显示的DIV
    for (var i = 0; i < totalColumnNum; i++) {
        $("squareBox" + i).style.visibility = "hidden";
    }
    $("squareBox" + menuPos).style.visibility = "visible";

    iDebug(">>>smile_portal index.htm  showSubMenu subHTMLReady[" + menuPos + "]=" + subHTMLReady[menuPos]);
    if (subHTMLReady[menuPos] == '1') { //已获取过，只需要显示对应的div，更新坐标变量即可
        unitInfoList = unitInfoListArr[menuPos];
        checkVideo();
    } else { //需要实时获取信息并画图
        preLoadCurrImg();
    }
}

//加载完当前栏目所有图片后再一起显示出来
function preLoadCurrImg() {
    var currImg = subImgArr[menuPos];
    var currImgLen = currImg.length;
    var count = 0;
    for (var i = 0; i < currImgLen; i++) {
        var img = new Image();
        img.onload = function() {
            count++;
            if (count == currImgLen) {
                initSubPic();
            }
        }
        img.onerror = function() {
            count++;
            if (count == currImgLen) {
                initSubPic();
            }
        }
        img.src = currImg[i];
    }
}

//初始化当前二级栏目的内容
function initSubPic() {
    generalSubDiv(menuPos);
    unitInfoList = unitInfoListArr[menuPos];
    iDebug(">>>smile_portal index.htm  showSubMenu area=" + area);
    if (area == 1) {
        //$("menuFocusDiv").style.visibility = "hidden";
        if (enableMainMenuFont) {
            $("menuTitle" + menuBox.focusPos).style.color = "#127D94";
        }
        ajustSubFocus();
        $("subMenuFocus").style.visibility = "visible";
    }
    checkVideo(); //检查是否需要播放视频
}

//检查是否需要播放小视屏
function checkVideo() {
    iDebug(">>>smile_portal index.htm  checkVideo menuPos=" + menuPos);
    closeSmallVideo();
    var tmpInfo = videoInfoArr[menuPos];
    if (tmpInfo.hasVideo) {
        localVideoUrl = tmpInfo.videoUrl;
        if (BrowserType == "iPanel") {
            media.video.setPosition(tmpInfo.pos.left, tmpInfo.pos.top, tmpInfo.pos.width, tmpInfo.pos.height);
            media.AV.open(localVideoUrl, "HTTP");
        } else if (BrowserType == "Inspur") {
            iSTB.player.play(localVideoUrl);
            iSTB.player.set_video_window(tmpInfo.pos.left, tmpInfo.pos.top, tmpInfo.pos.width, tmpInfo.pos.height);
        }
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

/**
 * 假设数据符合长方形规则，画出长方形的4个顶点
 * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
 */
function drawSkeleton(_drawMap) {
    //"grid":[[0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
    iDebug(">>>smile_portal index.htm  drawSkeleton in _drawMap=" + _drawMap);
    var wMax = _drawMap[0].length; // 几列
    var lMax = _drawMap.length; // 几行
    var squareInfo = {
        divId: 0,
        ws: -1, // 宽的起始横向下标  
        we: -1, // 宽的结束横向下标
        ls: -1, // 长的起始纵向下标  
        le: -1 // 长的结束纵向下标
    };
    // 遍历所有网格，从左上方第1个网格开始逐行读取
    for (var i = 0; i < lMax; i++) {
        for (var j = 0; j < wMax; j++) {
            // 第一次读取到1时，确定长方形左上方的顶点的坐标
            if (_drawMap[i][j] != 0 && squareInfo.ws == -1) { //查找左上
                squareInfo.ws = j;
                squareInfo.ls = i;
                // 从第一个顶点纵向读取，再读到0或者读到最大长度即可确定squareInfo.le，确定左下方顶点的坐标
                for (var k = i; k < lMax; k++) { //查找左下
                    if ((k < lMax - 1 && _drawMap[k + 1][j] == 0) || (k == lMax - 1 && _drawMap[k][j] > 0)) {
                        squareInfo.le = k;
                        break;
                    }
                }
                // 从第一个顶点横向读取，再读到0或者读到最大长度确定长方形的宽度，得到右上方和右下方顶点的坐标
            } else if (_drawMap[i][j] == 0 && squareInfo.ws != -1) { //查找右上
                squareInfo.we = j - 1;
                break;
            }
            if (j == wMax - 1 && _drawMap[i][j] != 0) { //如果  j已经走到了 最右边  并且 _drawMap[i][j] != 0  那么宽的结束坐标为整个布局的最右边
                squareInfo.we = j;
                break;
            }
        }
        if (squareInfo.le != -1) { //如果左下已经找到了就代表长方形的顶点已确认完毕
            break;
        }
    }
    iDebug(">>>smile_portal index.htm  drawSkeleton out squareInfo:ws=" + squareInfo.ws + ",we=" + squareInfo.we + ",ls=" + squareInfo.ls + ",le=" + squareInfo.le);
    return squareInfo;
}

/**
 * 在页面上画出图形
 * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
 * _width：最小单元格的宽
 * _hight：最小单元格的高
 * _cellHigh：单元格之间的间距
 * _objId : 画出的图形的id
 * _parentId : 要将图形添加到的组件的id
 * _img：该单元格对应的图片
 */
function drawUnit(_drawMap, _width, _hight, _cellHigh, _objId, _parentId, _img, _title, _fontStyle) {
    var squareInfo = drawSkeleton(_drawMap);
    var unitInfo = {
        id: _objId,
        ws: squareInfo.ws, // 宽的起始横向下标
        we: squareInfo.we, // 宽的结束横向下标
        ls: squareInfo.ls, // 长的起始纵向下标
        le: squareInfo.le, // 长的结束纵向下标

        left: squareInfo.ws * (_width + _cellHigh),
        top: squareInfo.ls * (_hight + _cellHigh),
        width: (squareInfo.we - squareInfo.ws + 1) * _width + (squareInfo.we - squareInfo.ws) * _cellHigh,
        height: (squareInfo.le - squareInfo.ls + 1) * _hight + (squareInfo.le - squareInfo.ls) * _cellHigh
    }

    iDebug(">>>smile_portal index.htm  drawUnit left:" + unitInfo.left + ",top:" + unitInfo.top + ",width:" + unitInfo.width + ",height:" + unitInfo.height + ",_img:" + _img);
    var _str = "<div id=\"" + _objId + "\" style=\"position:absolute; width:" + unitInfo.width + "px; height:" + unitInfo.height + "px; top:" + unitInfo.top + "px; left:" + unitInfo.left + "px;background-image: url(" + _img + ")\">";
    if (enableSubMenuFont && typeof(_title) != "undefined" && _title != "") { //需要通过文本输入子栏目的名称
        //如果文字有特殊设置就使用用户设置的class属性，否则用默认的字体属性
        if (typeof(_fontStyle) != "undefined" && _fontStyle != "") {
            _str += "<div class=\"font" + _fontStyle + "\" >" + _title + "</div>";
        } else {
            _str += "<div class=\"font" + (unitInfo.le - unitInfo.ls + 1) + (unitInfo.we - unitInfo.ws + 1) + "\" >" + _title + "</div>";
        }
    }
    _str += "</div>";
    if (enableCellMarginColor) { //需要填充间隙颜色
        //右侧空隙填充
        _str += "<div style=\"position:absolute; width:" + _cellHigh + "px; height:" + unitInfo.height + "px; top:" + unitInfo.top + "px; left:" + (unitInfo.left + unitInfo.width) + "px;background-color:" + cellMarginColor + ";\"></div>";
        //下侧空隙填充
        _str += "<div style=\"position:absolute; width:" + (unitInfo.width + _cellHigh) + "px; height:" + _cellHigh + "px; top:" + (unitInfo.top + unitInfo.height) + "px; left:" + unitInfo.left + "px;background-color:" + cellMarginColor + ";\"></div>";
    }
    document.getElementById(_parentId).innerHTML += _str; //画出当前的unit
    return unitInfo; //返回当前unit的坐标信息
}

function findNextID(__str, __num) {
    var origTemp = subFocusPos;
    var url = "";
    iDebug(">>>smile_portal index.htm findNextID in... subFocusPos=" + subFocusPos + ",__str=" + __str + ",__num=" + __num + ",unitInfoList.length=" + unitInfoList.length);
    if (__str == "H") { //横向 切换
        if (__num == 1) { //横向加
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) {
                    //这个是图片都在同一行的情况
                    subFocusPos = i;
                    break;
                }
            }
            if (origTemp == subFocusPos) { //上述情况不符合时
                for (var i = 0; i < unitInfoList.length; i++) {
                    if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws) { //这个是不再同一行的情况比如  第一个图片是 一行一列 第二个图片是  两行一列 起始位置都是第一行
                        subFocusPos = i;
                        break;
                    }
                }
            }

        } else {
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].ws - 1 == unitInfoList[i].we && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) {
                    subFocusPos = i;
                    break;
                }
            }
            if (origTemp == subFocusPos) {
                for (var i = 0; i < unitInfoList.length; i++) {
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
                if (unitInfoList[subFocusPos].le + 1 == unitInfoList[i].ls && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
                    subFocusPos = i;
                    break;
                }

            }
        } else {
            if (unitInfoList[subFocusPos].top == 0) { //上移到菜单栏
                area = 0;
                //$("menuFocusDiv").style.visibility = "visible";
                if (enableMainMenuFont) {
                    $("menuTitle" + menuBox.focusPos).style.color = "#9E48ED";
                }
                $("subMenuFocus").style.visibility = "hidden";
                return;
            }
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].ls - 1 == unitInfoList[i].le && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
                    subFocusPos = i;
                    break;
                }
            }
        }
    }
    iDebug(">>>smile_portal index.htm findNextID subFocusPos=" + subFocusPos);
    ajustSubFocus();
}

/*调整焦点框位置*/
function ajustSubFocus() {
    iDebug(">>>smile_portal index.htm ajustSubFocus in... subFocusPos=" + subFocusPos);
    //87，146是子栏目div的left和top

    $("subMenuFocus").style.top = (unitInfoList[subFocusPos].top + 221 - 45) + "px";
    $("subMenuFocus").style.left = (unitInfoList[subFocusPos].left + 94 - 50) + "px";
    $("subMenuFocus").style.width = (unitInfoList[subFocusPos].width + 95) + "px";
    $("subMenuFocus").style.height = (unitInfoList[subFocusPos].height + 95) + "px";
}

function doSelect() {
    var isVideo = menuData[menuPos].pos[subFocusPos].isvideo;
    iDebug(">>>smile_portal index.htm doSelect menuPos=" + menuPos + ",subFocusPos=" + subFocusPos + ",isVideo=" + isVideo);
    if (isVideo == 1) return; //视频位置不响应确定键
    var poster = menuData[menuPos].pos[subFocusPos].poster;
    var url = poster.length > 0 ? poster[0].url : "";
    iDebug(">>>smile_portal index.htm doSelect url=" + url);
    if (url == "") {
        showTips("栏目正在建设中!", 3000);
    } else {
        savePos();
        var newUrl = getSpecialUrl(url);
        if (newUrl != "noJump") {
            // 处理应用的返回
            var backUrl = window.location.href;
            window.name = backUrl;
            localStorage.setItem('portal', backUrl);
            window.location.href = url;
        }
    }
}

/* 跳转直播 */
function goPlay() {
    if (typeof(iPanel) != "undefined") {
        closeSmallVideo();
        needStopVideo = false;
        iPanel.eventFrame.open_OffChannel();
    }
}

/* 替换url中的特殊字符 */
function getSpecialUrl(_oldUrl, _keyArr) {
    var specialUrlPara = { //特殊字符的key以及对应的value或者处理函数,根据实际情况进行配置
        "TV": "function|goPlay()"
    };
    var newUrl = _oldUrl;
    var key = "";
    var keyValue;
    var funName = "";

    if (typeof(_keyArr) != "undefined" && _keyArr != null) { // 替换指定的key
        for (var i = 0, len = _keyArr.length; i < len; i++) {
            key = _keyArr[i];
            if (key in specialUrlPara) {
                keyValue = specialUrlPara[key];
                if (keyValue.indexOf("function|") == 0) { // 需要跳转到指定的处理函数
                    funName = keyValue.substring(9);
                    if (funName != "") {
                        try {
                            eval(funName);
                        } catch (error) {

                        }
                    }
                    newUrl = "noJump"; // 不需要处理跳转路径则返回字符noJump
                    break;
                } else {
                    newUrl = newUrl.replace("{" + key + "}", keyValue);
                }
            }
        }
    } else {
        for (key in specialUrlPara) {
            if (_oldUrl.indexOf("{" + key + "}") != -1) {
                keyValue = specialUrlPara[key];
                if (keyValue.indexOf("function|") == 0) { // 需要跳转到指定的处理函数
                    funName = keyValue.substring(9);
                    if (funName != "") {
                        try {
                            eval(funName + "()");
                        } catch (error) {

                        }
                    }
                    newUrl = "noJump"; // 不需要处理跳转路径则返回字符noJump
                    break;
                } else {
                    newUrl = newUrl.replace("{" + key + "}", keyValue);
                }
            }
        }
    }
    return newUrl;
}

/*显示提示信息*/
function showTips(msg, flag) {
    iDebug(">>>smile_portal index.htm showTips flag=" + flag + ",msg=" + msg);
    showTipsFlag = true;
    //$("tipsDiv").style.visibility = "visible";
    //$("tipsDiv").innerText = msg;
    clearTimeout(showTipsTimer);
    if (typeof(flag) != "undefined") { // 不传flag时表示不自动影藏
        showTipsTimer = setTimeout(hideTips, flag);
    }
}

/*影藏提示信息*/
function hideTips() {
    showTipsFlag = false;
    clearTimeout(showTipsTimer);
    //$("tipsDiv").style.visibility = "hidden";
    //$("tipsDiv").innerText = "";
}


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

function savePos() {
    iDebug(">>>smile_portal index.htm savePos menuPos=" + menuPos + ",subFocusPos=" + subFocusPos + ",area=" + area);
    mySessionStorage.setItem("portalMainPos", menuPos);
    mySessionStorage.setItem("portalSubPos", subFocusPos);
    mySessionStorage.setItem("portalAreaPos", area);
}

function doExit() {
    window.location.href = "";
}

function exitPage() {
    clearTimeout(delayLoadTimer);
    iDebug(">>>smile_portal index.htm exitPage needStopVideo=" + needStopVideo);
    if (needStopVideo) {
        closeSmallVideo();
    }
}

function $(_id) {
    return document.getElementById(_id);
}

//打印
function iDebug(str) {
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.debug(str, 2);
    } else if (navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1) {
        console.log(str);
    }
}

//获取浏览器版本
var BrowserType = getBrowserType();

function getBrowserType() {
    var ua = navigator.userAgent.toLowerCase();
    return /ipanel/.test(ua) ? 'iPanel' : /enrich/.test(ua) ? 'EVM' : /wobox/.test(ua) ? 'Inspur' : window.ActiveXObject ? 'IE' : document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox' : window.openDatabase && !/chrome/.test(ua) ? 'Safari' : /opr/.test(ua) ? 'Opera' : window.MessageEvent && !document.getBoxObjectFor ? 'Chrome' : '';
}

/*根据传入的时间格式返回当前时间*/
function getTimeByFormat(formatStr, language) {
    var str = formatStr;
    var date = new Date();
    var Week = {
        chi: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        eng: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']

    }
    str = str.replace(/yyyy|YYYY/, date.getFullYear());
    str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
    str = str.replace(/MM/, (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
    str = str.replace(/M/g, date.getMonth() + 1);
    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
    str = str.replace(/d|D/g, date.getDate());
    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    str = str.replace(/h|H/g, date.getHours());
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());
    str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
    str = str.replace(/s|S/g, date.getSeconds());
    if (language == "eng") {
        str = str.replace(/w|W/g, Week.eng[date.getDay()]);
    } else {
        str = str.replace(/w|W/g, Week.chi[date.getDay()]);
    }
    return str;
}

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

/***************************************showList  start*******************************/
function showList(__listSize, __dataSize, __position, __startplace, __f) {
    this.currWindow = __f;
    this.listSize = typeof(__listSize) == "undefined" ? 0 : __listSize; //列表显示的长度；
    this.dataSize = typeof(__dataSize) == "undefined" ? 0 : __dataSize; //所有数据的长度；
    this.position = typeof(__position) == "undefined" ? 0 : __position; //当前数据焦点的位置；
    this.focusPos = 0; //当前列表焦点的位置；
    this.lastPosition = 0; //前一个数据焦点的位置；
    this.lastFocusPos = 0; //前一个列表焦点的位置；
    this.tempSize = 0; //实际显示的长度；
    this.infinite = 0; //记录数值，用来获取数据焦点的位置；

    this.pageStyle = 0; //翻页时焦点的定位，0表示不变，1表示移到列表首部；
    this.pageLoop = null; //是否循环翻页, true表示是，false表示否；
    this.showLoop = null; //是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
    this.focusLoop = null; //焦点是否首尾循环切换；
    this.focusFixed = null; //焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
    this.focusVary = 1; //当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
    this.focusStyle = 0; //切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；

    this.showType = 1; //呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式；   
    this.listSign = 0; //0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
    this.listHigh = 30; //列表中每个行的高度，可以是数据或者数组，例如：40 或 [40,41,41,40,42];
    this.listPage = 1; //列表的总页数量；
    this.currPage = 1; //当前焦点所在页数；

    this.focusDiv = -1; //列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40);
    this.focusPlace = new Array(); //记录每行列表焦点的位置值；
    this.startPlace = typeof(__startplace) == "undefined" ? 0 : __startplace; //列表焦点Div开始位置的值；

    this.haveData = function() {}; //在显示列表信息时，有数据信息就会调用该方法；
    this.notData = function() {}; //在显示列表信息时，无数据信息就会调用该方法；
    //调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；

    this.focusUp = function() { this.changeList(-1); }; //焦点向上移动；
    this.focusDown = function() { this.changeList(1); }; //焦点向下移动；
    this.pageUp = function() { this.changePage(-1); }; //列表向上鄱页；
    this.pageDown = function() { this.changePage(1); }; //列表向下鄱页；

    //开始显示列表信息
    this.startShow = function() {
            this.initAttrib();
            this.setFocus();
            this.showList();
        }
        //初始化所有属性；
    this.initAttrib = function() {
            if (typeof(this.listSign) == "number") this.listSign = this.listSign == 0 ? "top" : "left"; //把数值转换成字符串；
            if (typeof(this.focusDiv) == "object") this.focusDiv.moveSign = this.listSign; //设置滑动对象的方向值;

            if (this.focusFixed == null || (this.focusFixed && this.showType == 0)) this.focusFixed = false; //初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
            if (this.showLoop == null) this.showLoop = this.focusFixed ? true : false; //初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false;
            if (this.pageLoop == null) this.pageLoop = this.showLoop ? true : false; //初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
            if (this.focusLoop == null) this.focusLoop = this.showLoop ? true : false; //初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
            if (!this.focusFixed && this.dataSize < this.listSize) this.showLoop = false; //如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；

            if (this.focusVary < 1) this.focusVary = 1;
            if (this.focusPos >= this.listSize) this.focusPos = this.listSize - 1;
            if (this.focusPos < 0) this.focusPos = 0;
            if (this.position >= this.dataSize) this.position = this.dataSize - 1;
            if (this.position < 0) this.position = 0;
            this.lastPosition = this.infinite = this.position;

            this.initPlace();
            this.initFocus();
            this.lastFocusPos = this.focusPos;
        }
        //初始化焦点位置；
    this.initFocus = function() {
            this.tempSize = this.dataSize < this.listSize ? this.dataSize : this.listSize;
            if (this.showType == 0) { //当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
                this.focusPos = this.position % this.listSize;
            } else if (!this.focusFixed && !this.showLoop) { //当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
                var tempNum = this.position - this.focusPos;
                if (tempNum < 0 || tempNum > this.dataSize - this.tempSize) this.focusPos = this.position < this.tempSize ? this.position : this.tempSize - (this.dataSize - this.position);
            }
        }
        //处理每行(列)所在的位置，并保存在数组里；
    this.initPlace = function() {
            var tmph = this.listHigh;
            var tmpp = [this.startPlace];
            for (var i = 1; i < this.listSize; i++) tmpp[i] = typeof(tmph) == "object" ? (typeof(tmph[i - 1]) == "undefined" ? tmph[tmph.length - 1] + tmpp[i - 1] : tmph[i - 1] + tmpp[i - 1]) : tmph * i + tmpp[0];
            this.focusPlace = tmpp;
        }
        //切换焦点的位置
    this.changeList = function(__num) {
            if (this.dataSize == 0) return;
            if ((this.position + __num < 0 || this.position + __num > this.dataSize - 1) && !this.focusLoop) return;
            this.changePosition(__num);
            this.checkFocusPos(__num);
        }
        //切换数据焦点的值
    this.changePosition = function(__num) {
            this.infinite += __num;
            this.lastPosition = this.position;
            this.position = this.getPos(this.infinite, this.dataSize);
        }
        //调整列表焦点并刷新列表；
    this.checkFocusPos = function(__num) {
            if (this.showType == 0) {
                var tempNum = this.showLoop ? this.infinite : this.position;
                var tempPage = Math.ceil((tempNum + 1) / this.listSize);
                this.changeFocus(this.getPos(tempNum, this.listSize) - this.focusPos);
                if (this.currPage != tempPage) {
                    this.currPage = tempPage;
                    this.showList();
                }
            } else {
                if ((this.lastPosition + __num < 0 || this.lastPosition + __num > this.dataSize - 1) && !this.showLoop && !this.focusFixed) {
                    this.changeFocus(__num * (this.tempSize - 1) * -1);
                    this.showList();
                    return;
                }
                if (this.focusPos + __num < 0 || this.focusPos + __num > this.listSize - 1 || this.focusFixed) {
                    this.showList();
                } else {
                    this.changeFocus(__num);
                }
            }
        }
        //切换列表焦点的位置
    this.changeFocus = function(__num) {
            this.lastFocusPos = this.focusPos;
            this.focusPos += __num;
            this.setFocus(__num);
        }
        //设置调整当前焦点的位置；
    this.setFocus = function(__num) {
            if (typeof(this.focusDiv) == "number") return; //如果没定义焦点DIV，则不进行设置操作；
            var tempBool = this.focusStyle == 0 && (Math.abs(this.focusPos - this.lastFocusPos) > this.focusVary || (Math.abs(this.position - this.lastPosition) > 1 && !this.showLoop)); //当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
            if (typeof(this.focusDiv) == "string") { //直接设置焦点位置；
                this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
            } else if (typeof(__num) == "undefined" || tempBool) { //直接定位焦点；
                this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
            } else if (__num != 0) { //滑动焦点；
                this.focusDiv.moveStart(__num / Math.abs(__num), Math.abs(this.focusPlace[this.focusPos] - this.focusPlace[this.lastFocusPos]));
            }
        }
        //切换页面列表翻页
    this.changePage = function(__num) {
            if (this.dataSize == 0) return;
            var isBeginOrEnd = this.currPage + __num < 1 || this.currPage + __num > this.listPage; //判断当前是否首页跳转尾页或尾页跳转首页;
            if (this.showLoop) { //如果内容是循环显示，则执行下面的翻页代码；
                if (isBeginOrEnd && !this.pageLoop) return;
                var tempNum = this.listSize * __num;
                if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) {
                    this.changePosition(this.focusPos * -1);
                    this.checkFocusPos(this.focusPos * -1);
                }
                this.changePosition(tempNum);
                this.checkFocusPos(tempNum);
            } else {
                if (this.dataSize <= this.listSize) return; //如果数据长度小长或等于列表显示长度，则不进行翻页；
                if (this.showType == 0) {
                    if (isBeginOrEnd && !this.pageLoop) return; //如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
                    var endPageNum = this.dataSize % this.listSize; //获取尾页个数;
                    var isEndPages = (this.getPos(this.currPage - 1 + __num, this.listPage) + 1) * this.listSize > this.dataSize; //判断目标页是否为尾页;
                    var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos + 1 - endPageNum : 0; //判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；      
                    var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize; //判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
                    overNum = this.pageStyle == 0 ? overNum : this.focusPos; //判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
                    tempNum = tempNum * __num - overNum;
                    this.changePosition(tempNum);
                    this.checkFocusPos(tempNum);
                } else {
                    var tempPos = this.position - this.focusPos; //获取当前页列表首部的数据焦点；
                    var tempFirst = this.dataSize - this.tempSize; //获取尾页第一个数据焦点的位置；
                    if (tempPos + __num < 0 || tempPos + __num > tempFirst) {
                        if (!this.pageLoop) return; //不循环翻页时跳出，否则获取翻页后的数据焦点;
                        tempPos = __num < 0 ? tempFirst : 0;
                    } else {
                        tempPos += this.tempSize * __num;
                        if (tempPos < 0 || tempPos > tempFirst) tempPos = __num < 0 ? 0 : tempFirst;
                    }
                    var tempNum = this.pageStyle == 0 || this.focusFixed ? this.focusPos : 0; //判断当前翻页时焦点的style, 取得列表焦点位置；
                    if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) this.changeFocus(this.focusPos * -1); //如果this.focusPos不为0，则移动列表焦点到列表首部；
                    this.changePosition(tempPos - this.position + tempNum);
                    this.showList();
                }
            }
        }
        //显示列表信息
    this.showList = function() {
            var tempPos = this.position - this.focusPos; //获取当前页列表首部的数据焦点；
            for (var i = tempPos; i < tempPos + this.listSize; i++) {
                var tempObj = { idPos: i - tempPos, dataPos: this.getPos(i, this.dataSize) }; //定义一个对象，设置当前列表焦点和数据焦点值；
                (i >= 0 && i < this.dataSize) || (this.showLoop && this.dataSize != 0) ? this.haveData(tempObj): this.notData(tempObj); //当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
            }
            this.currPage = Math.ceil((this.position + 1) / this.listSize);
            this.listPage = Math.ceil(this.dataSize / this.listSize);
        }
        //清除列表信息
    this.clearList = function() {
        for (var i = 0; i < this.listSize; i++) this.notData({ idPos: i, dataPos: this.getPos(i, this.dataSize) });
    }
    this.getPos = function(__num, __size) {
        return __size == 0 ? 0 : (__num % __size + __size) % __size;
    }
    this.$ = function(__id) {
        return this.currWindow.document.getElementById(__id);
    }
}
/***************************************showList  end*******************************/
