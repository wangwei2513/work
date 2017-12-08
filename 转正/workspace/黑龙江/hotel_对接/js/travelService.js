/*****************************旅游服务*****************************/
function eventHandler(eventObj) {
    iDebug("[travelService.js]__keycode=" + eventObj.code);
    switch (eventObj.code) {
        case "KEY_UP": //up
            changeUD(-1);
            return EVENT.STOP;
            break;
        case "KEY_DOWN": //down
            changeUD(1);
            return EVENT.STOP;
            break;
        case "KEY_LEFT": //left
            changeLR(-1);
            return EVENT.STOP;
            break;
        case "KEY_RIGHT": //right
            changeLR(1);
            return EVENT.STOP;
            break;
        case "KEY_SELECT": //enter
            doSelect();
            return EVENT.STOP;
            break;
        case "KEY_BACK":
            goBack();
            return EVENT.STOP;
            break;
        case "KEY_HOMEPAGE":
            return EVENT.DOWN;
            break;
        default:
            return EVENT.STOP;
            break;
    }
}

function goBack() {
    if (isCode) {
        isCode = false;
        $("popup").style.display = "none";
        return;
    } else if (focusArea == 2) { //宫格详情返回到宫格
        focusArea = 1;
        showContent(1);
        onFocus();
        showScroll(currPage, totalPage);
    } else if (focusArea == 1) {
        loseFocus();
        focusArea = 0;
        onFocus();
    } else {
        window.location.href = BACK_URL;
    }
}

var columnPos = 4; // 当前是首页的第4个栏目
var focusArea = 0; // 焦点区域 0：左侧栏目 1：右侧内容 2：右侧内容的下一级
var menuPos = 0; // 左侧栏目焦点位置
var menuIdx = 0; // 左侧栏目数据索引
var maxMenuLen = 6; // 左侧栏目可显示的个数

var currPage = 0; // 宫格页
var currPage1 = 0; // 宫格下详情页
var totalPage = 0;
var totalPage1 = 0;
var pageSize = 6;
var listPos = 0; // 右侧列表焦点位置
var listIdx = 0; // 右侧列表数据索引
var maxListLen = 7; // 最多显示7行列表
var wordSize = 20;
var scroll_Bar = null; // 滚动条对象
var pageContent = 436; // 文章内容可视高度

var menuList = []; // 栏目数据
var contentList = []; // 右侧内容
var ajaxObj = null;
var menuBox = null;

var isCode = false; // 是否显示二维码

var categoryId = window.location.search.substring(1).split("&")[0].split("=")[1];
var hotelid = window.location.search.substring(1).split("&")[1].split("=")[1];

function init() {
    timeShow();
    getColumnList();
}

function changeUD(_num) {
    switch (focusArea) {
        case 0: // 左侧栏目
            loseFocus();
            menuBox.changeList(_num);
            onFocus();
            currPage = 0;
            currPage1 = 0;
            listPos = 0;
            getContent();
            break;
        case 1: // 右侧内容
            if (menuBox.position == 1) { // 景点购票
                if (listPos + _num * 3 < 0 || listPos + _num * 3 > pageSize - 1 || listPos + currPage * pageSize + _num * 3 > contentList.length - 1) {
                    loseFocus();
                    changePage(_num);
                } else {
                    loseFocus();
                    listPos += _num * 3;
                    onFocus();
                }
            } else {
                currPage = (currPage + _num + totalPage) % totalPage;
                scroll_Bar.scroll(currPage);
                if (menuBox.position == 0) {
                    fillGuideList();
                } else if (menuBox.position == 2) {
                    fillRouteList();
                } else if (menuBox.position == 3) {
                    fillFightList();
                }
            }
            break;
        case 2: // 右侧内容的下一级
            currPage1 = (currPage1 + _num + totalPage1) % totalPage1;
            scroll_Bar.scroll(currPage1);
            onFocus();
            break;
    }
}

function changeLR(_num) {
    switch (focusArea) {
        case 0: // 左侧栏目
            if ((menuBox.position == 1 && contentList.length < 1) || (menuBox.position != 1 && totalPage < 2)) return;
            if (_num > 0) {
                loseFocus();
                focusArea = 1;
                onFocus();
            }
            break;
        case 1: // 右侧内容
            if (menuBox.position == 1) {
                if (listPos % 3 == 2 && _num > 0) return;
                loseFocus();
                if (listPos % 3 == 0 && _num < 0) {
                    focusArea = 0;
                } else if (listPos + _num + currPage * 6 < contentList.length) {
                    listPos += _num;
                }
                onFocus();
            } else if (_num < 0) {
                loseFocus();
                focusArea = 0;
                onFocus();
            }
            break;
        case 2: // 右侧内容的下一级
            break;
    }
}

function changePage(_num) {
    if (totalPage < 2) {
        onFocus();
        return;
    } 
    currPage = (currPage + _num + totalPage) % totalPage;
    if (currPage * pageSize + listPos > contentList.length - 1) {
        listPos = contentList.length % pageSize - 1;
    }
    iDebug("[travelService.js]__currPage=" + currPage + "__listPos=" + listPos);
    scroll_Bar.scroll(currPage);
    fillList();
    onFocus();
}

function onFocus() {
    if (focusArea != 0) {
        $("menuFocus").style.background = "url(images/listL_f3.png)";
    }
    switch (focusArea) {
        case 0: // 左侧栏目
            $("menu" + menuBox.focusPos).style.color = "#000";
            $("menuFocus").style.background = "url(images/listL_f2.png)";
            break;
        case 1: // 右侧内容
            if (menuBox.position == 1) {
                $("listFocus").style.visibility = "visible";
                $("listFocus").style.left = 301 + listPos % 3 * 277 + "px";
                $("listFocus").style.top = 147 + Math.floor(listPos / 3) * 220 + "px";
                $("listName" + listPos).style.color = "#000000";
                $("listName" + listPos).style.background = "#CEA062";
                if (tool.getCharacterLength(contentList[currPage * pageSize + listPos].name) > wordSize) {
                    $("listName" + listPos).innerHTML = "<marquee width='250'>" + contentList[currPage * pageSize + listPos].name + "</marquee>";
                }
            } else {
                $("scrollBar").src = "images/page02.png";
            }
            break;
        case 2: // 右侧内容的下一级
            $("scrollBar").src = "images/page02.png";
            $("contentTxt").style.top = -pageContent * currPage1 + "px";
            break;
    }
}

function loseFocus() {
    switch (focusArea) {
        case 0: // 左侧栏目
            $("menu" + menuBox.focusPos).style.color = "#c4a17f";
            break;
        case 1: // 右侧内容
            if (menuBox.position == 1) {
                $("listFocus").style.visibility = "hidden";
                $("listName" + listPos).style.color = "#ffffff";
                $("listName" + listPos).style.background = "rgba(0,0,0,.7)";
                $("listName" + listPos).innerHTML = contentList[currPage * pageSize + listPos].name;
            } else {
                $("scrollBar").src = "images/page01.png";
            }
            break;
        case 2: // 右侧内容的下一级
            $("scrollBar").src = "images/page01.png";
            break;
    }
}

function doSelect() {
    if (isCode) {
        goBack();
        return;
    }
    switch (focusArea) {
        case 0: // 左侧栏目
            break;
        case 1: // 右侧内容
            if (menuBox.position == 1) {
                loseFocus();
                focusArea = 2;
                onFocus();
                initContent();
            }
            break;
        case 2: // 右侧内容的下一级
            isCode = true;
            $("popup").style.display = "block";
            break;
    }
}

// 获取左侧栏目数据
function getColumnList() {
    if (ajaxObj == null) {
        ajaxObj = new AJAX_OBJ();
    } else {
        ajaxObj.requestAbort();
    }
    // ajaxObj.charset = "gbk";
    ajaxObj.successCallback = function(_xmlHttp) {
        iDebug("[travelService.js]__getColumnList__successCallback !");
        var jsonData = eval('(' + _xmlHttp.responseText + ')');
        if (typeof(jsonData) != "undefined" && jsonData != null) {
            menuList = jsonData.data;
            menuList = QuickSort(menuList);
            initMenu();
        } else {
            iDebug("request menu data is null !");
        }
    }
    ajaxObj.failureCallback = function(_xmlHttp) {
        iDebug("[travelService.js]__getColumnList__failureCallback !");
    }
    var url = debug == 1 ? ajaxUrls.priColumnUrl[debug].replace("{1}", columnPos) : ajaxUrls.priColumnUrl[debug];
    ajaxObj.url = url + "?category=" + categoryId + "&hotelid=" + hotelid;
    ajaxObj.requestData();
}

function initMenu() {
    if (menuList.length == 0) return;
    menuBox = new showList(maxMenuLen, menuList.length, 0, 0, window);
    menuBox.focusDiv = "menuFocus";
    menuBox.listHigh = 67;
    menuBox.focusLoop = true;
    menuBox.pageLoop = true;
    menuBox.haveData = function(_list) {
        $("menu" + _list.idPos).innerText = menuList[_list.dataPos].Name;
    };
    menuBox.notData = function(_list) {
        $("menu" + _list.idPos).innerText = "";
    };
    menuBox.startShow();
    getContent();
}

function covert2Json(thinfo, info) {
    var resultJson = [];
    for (var i = 0; i < info.length; i++) {
        var tmpData = {};
        for (var __atrribute in thinfo[0]) {
            if (thinfo[0][__atrribute]) {
                tmpData[thinfo[0][__atrribute]] = decodeURIComponent(info[i][__atrribute]);
            }
        }
        if (info[i]["subth"]) { //解析子节点
            tmpData["submenu"] = covert2Json(info[i]["subth"], info[i]["submenu"]);
        }
        resultJson.push(tmpData);
    }
    return resultJson;
}

// 获取右侧内容
function getContent() {
    if (ajaxObj == null) {
        ajaxObj = new AJAX_OBJ();
    } else {
        ajaxObj.requestAbort();
    }
    // ajaxObj.charset = "gbk";
    ajaxObj.successCallback = function(_xmlHttp) {
        iDebug("[travelService.js]__getContent__successCallback !");
        var jsonData = eval('(' + _xmlHttp.responseText + ')');
        contentList = covert2Json(jsonData.thinfo, jsonData.info);
        iDebug("JSON.stringify(subMenuList)menuBox.position=" + menuBox.position + "||" + JSON.stringify(
            contentList));
        initContent();
        onFocus();
    }
    ajaxObj.failureCallback = function(_xmlHttp) {
        iDebug("[travelService.js]__getContent__failureCallback !");
    }
    var url = debug == 1 ? ajaxUrls.queryAppDataUrl[debug].replace("{1}", columnPos).replace("{2}", menuBox.position) : ajaxUrls.queryAppDataUrl[debug];
    ajaxObj.url = url + "?pid=" + menuList[menuBox.position].ID;
    ajaxObj.requestData();
}

function initContent() {
    if (focusArea == 2) {
        showContent(2);
        // imgArr = contentList[listPos + currPage*pageSize].picUrl.split(",");
        $("contentImg").src = contentList[listPos + currPage * pageSize].picUrlBig;
        $("scenicName").innerHTML = contentList[listPos + currPage * pageSize].name;
        $("price").innerHTML = "成人票：" + contentList[listPos + currPage * pageSize].price;
        $("priceInfo").innerHTML = "；" + contentList[listPos + currPage * pageSize].priceInfo;
        $("openTime").innerHTML = "开放时间：" + contentList[listPos + currPage * pageSize].openTime;
        $("intro").innerHTML = contentList[listPos + currPage * pageSize].intro;
        $("QRcode").src = contentList[listPos + currPage * pageSize].QRcode;
        totalPage1 = Math.ceil($("contentTxt").offsetHeight / pageContent);
        showScroll(currPage1, totalPage1);
    } else {
        switch (menuBox.position) {
            case 0: // 聘请导游
                showContent(0);
                fillGuideList();
                totalPage = Math.ceil(contentList.length / maxListLen / 2);
                iDebug("[travelService.js]__totalPage0=" + totalPage);
                showScroll(currPage, totalPage);
                break;
            case 1: // 景点购票
                showContent(1);
                totalPage = Math.ceil(contentList.length / pageSize);
                iDebug("[travelService.js]__totalPage1=" + totalPage);
                fillList();
                showScroll(currPage, totalPage);
                break;
            case 2: // 旅游报名
                showContent(3);
                fillRouteList();
                totalPage = Math.ceil(contentList[0].submenu.length / pageSize);
                iDebug("[travelService.js]__totalPage2=" + totalPage);
                $("routeTitle").innerHTML = "旅游路线咨询及预订电话：" + contentList[0].tel;
                showScroll(currPage, totalPage);
                break;
            case 3: // 机票预订
                showContent(4);
                fillFightList();
                totalPage = Math.ceil(contentList[0].submenu.length / pageSize / 3);
                iDebug("[travelService.js]__totalPage3=" + totalPage);
                $("fightTitle").innerHTML = "机票路线咨询及预订电话：" + contentList[0].tel;
                showScroll(currPage, totalPage);
                break;
        }
    }
}

function showContent(num) {
    for (var i = 0; i < 5; i++) {
        $("content" + i).style.display = "none";
    }
    $("content" + num).style.display = "block";
}

function showScroll(num, total) {
    if (total > 1) {
        $("scrollBack").style.display = "block";
    } else {
        $("scrollBack").style.display = "none";
    }
    scroll_Bar = new ScrollBar("scrollBar", null, window);
    scroll_Bar.init(total, total, 395, -6);
    scroll_Bar.scroll(num);
}

// 填入宫格
function fillList() {
    wordSize = 20;
    for (var i = 0; i < pageSize; i++) {
        if (contentList[i + currPage * pageSize]) {
            $("list" + i).style.display = "block";
            $("listName" + i).innerHTML = contentList[i + currPage * pageSize].name;
            $("listImg" + i).src = contentList[i + currPage * pageSize].picUrl;
        } else {
            $("listName" + i).innerHTML = "";
            $("listImg" + i).src = "";
            $("list" + i).style.display = "none";
        }
    }
}

// 填入导游列表
function fillGuideList() {
    maxListLen = 14;
    for (var i = 0; i < maxListLen; i++) {
        if (contentList[i + currPage * maxListLen]) {
            $("guide" + i).innerHTML = contentList[i + currPage * maxListLen].language + contentList[i + currPage * maxListLen].sex + "导游:&nbsp;&nbsp;" + contentList[i + currPage * maxListLen].price + "元/天";
        }
    }
}

// 填入旅游路线
function fillRouteList() {
    var name = "";
    wordSize = 68;
    maxListLen = 6;
    for (var i = 0; i < maxListLen; i++) {
        if (contentList[0] && contentList[0].submenu[i + currPage * maxListLen]) {
            name = contentList[0].submenu[i + currPage * maxListLen].name;
            if (tool.getCharacterLength(name) > wordSize) {
                name = name.substring(0, tool.getRealLength(name, wordSize - 2)) + "...";
            }
            $("route" + i).innerHTML = (i + currPage * maxListLen + 1) + "、" + name;
        } else {
            $("route" + i).innerHTML = "";
        }
    }
}

// 填入机票预订列表
function fillFightList() {
    maxListLen = 18;
    var startPlace = "";
    var endPlace = "";
    iDebug(contentList[0].submenu)
    for (var i = 0; i < maxListLen; i++) {
        if (contentList[0] && contentList[0].submenu[i + currPage * maxListLen]) {
            startPlace = contentList[0].submenu[i + currPage * maxListLen].startPlace;
            endPlace = contentList[0].submenu[i + currPage * maxListLen].endPlace;
            $("fight" + i).innerHTML = startPlace + "-----" + endPlace;
        } else {
            $("fight" + i).innerHTML = "";
        }
    }
}