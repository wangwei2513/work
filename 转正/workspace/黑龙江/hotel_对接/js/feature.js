/*****************************酒店特色*****************************/
function eventHandler(eventObj) {
	iDebug("[feature.js]__keycode=" + eventObj.code);
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
	if(focusArea == 2){
		if(menuBox.position == 0)return;
		focusArea = 1;
		if(menuBox.position == 1){//酒店指南
			showContent(1);
			$("title").innerHTML = "";
		}else if(menuBox.position == 2){//优惠活动
			showContent(3);
		}else{
			showContent(0);
			$("popup").style.display = "none";
			onFocus();
		}
	}else if (focusArea === 1) {
        loseFocus();
        focusArea = 0;
        if (imgArr.length>1) {
            $("pointBack").style.background = "rgba(0,0,0,0.7)";
            $("point" + imgPos).style.background = "#C4A17F";
        }
        onFocus();
    } else{
		window.location.href = BACK_URL;
	}
}

var columnPos = 2;			// 当前是首页的第2个栏目
var focusArea = 0;			// 焦点区域 0：左侧栏目 1：右侧内容 2：右侧内容的下一级
var menuPos = 0;			// 左侧栏目焦点位置
var menuIdx = 0;			// 左侧栏目数据索引
var maxMenuLen = 6;			// 左侧栏目可显示的个数

var currPage = 0;
var totalPage = 0;
var scroll_Bar1 = null;		// 图文滚动条对象
var scroll_Bar2 = null;		// 纯文字滚动条对象
var pageContent = 436; 		// 文章内容可视高度

var listIdx = 0;			// 右侧列表数据索引
var listPos = 0;			// 右侧列表焦点位置
var maxListLen = 7;			// 右侧列表可显示的个数
var wordSize = 70;

var imgArr = [];
var imgBigArr = [];
var btnPos = 0;				// 酒店指南右边按钮焦点
var imgPos = 0;				// 右侧为图文的图片为多个的图片索引

var menuList = [];			// 栏目数据
var contentList = [];		// 右侧内容
var ajaxObj = null;
var menuBox = null;

var categoryId = window.location.search.substring(1).split("&")[0].split("=")[1];
var hotelid = window.location.search.substring(1).split("&")[1].split("=")[1];
function init() {
	timeShow();
	getColumnList();
}

function changeUD(_num) {
	switch(focusArea){
		case 0: // 左侧栏目
			loseFocus();
			menuBox.changeList(_num);
			onFocus();
			currPage = 0;
			listIdx = 0;
			listPos = 0;
			getContent();
			break;
		case 1: // 右侧内容
			switch(menuBox.position){
				case 0://关于酒店
				case 3://餐厅酒吧
				case 4://客房设施
				case 5://会议设施
					currPage = (currPage+_num+totalPage)%totalPage;
					onFocus();
					scroll_Bar1.scroll(currPage);
					break;
				case 1://酒店指南
					break;
				case 2://优惠活动
					if(listIdx+_num<0||listIdx+_num>contentList.length-1)return;
					if((listPos>0&&_num<0)||(listPos<maxListLen-1&&_num>0)){
						loseFocus();
						listPos += _num;
						listIdx += _num;
						onFocus();
					}else{
						listIdx += _num;
						initContent(listIdx - listPos);
					}
					break;
			}
			break;
		case 2: // 右侧内容的下一级（电话簿）
			if(menuBox.position == 1){// 酒店指南
				if(btnPos == 1){//电话本

				}else{
					if(currPage+_num<0||currPage+_num>totalPage-1)return;
					currPage += _num;
					onFocus();
					scroll_Bar2.scroll(currPage);
				}
			}else if(menuBox.position == 2){// 优惠活动
				currPage = (currPage+_num+totalPage)%totalPage;
				onFocus();
				scroll_Bar2.scroll(currPage);
			}
			break;
	}
}

function changeLR(_num) {
	switch(focusArea){
		case 0: // 左侧栏目
			if(_num>0){
				loseFocus();
                focusArea = 1;
                onFocus();
                console.log(focusArea)
			}
			break;
		case 1: // 右侧内容
			switch(menuBox.position){
				case 3://餐厅酒吧
				case 4://客房设施
				case 5://会议设施
					if(imgPos+_num>imgArr.length-1)return;
					loseFocus();
					if(imgPos+_num<0){
						focusArea = 0;
						$("pointBack").style.background = "rgba(0,0,0,0.7)";
						$("point" + imgPos).style.background = "#C4A17F";
					}else{
						imgPos += _num;
					}
					onFocus();
					break;
				case 1://酒店指南
					if(btnPos+_num>2)return;
					loseFocus();
					if(btnPos+_num<0){
						focusArea = 0;
					}else{
						btnPos += _num;
					}
					onFocus();
					break;
				case 0://关于酒店
				case 2://优惠活动
					loseFocus();
					focusArea = 0;
					onFocus();
					break;
			}
			break;
		case 2: // 右侧内容的下一级
			if(menuBox.position > 2){//弹出的放大图片
				if(imgPos+_num<0||imgPos+_num>imgArr.length-1)return;
				imgPos += _num;
				initBigImg();
			}
			break;
	}
}

function onFocus() {
	if(focusArea!=0){
		$("menuFocus").style.background = "url(images/listL_f3.png)";
	}
	switch(focusArea){
		case 0: // 左侧栏目
			$("menu"+menuBox.focusPos).style.color = "#000";
			$("menuFocus").style.background = "url(images/listL_f2.png)";
			break;
		case 1: // 右侧内容
			switch(menuBox.position){
				case 0://关于酒店
					if(totalPage<2){
						// focusArea = 0;
						return;
					}
					$("scrollBar0").src = "images/page02.png";
					$("contentTxt").style.top = 12-pageContent * currPage + "px";
					break;
				case 3://餐厅酒吧
				case 4://客房设施
				case 5://会议设施
					if(imgArr.length<1){
						// focusArea = 0;
						return;
					}
                    $("contentImg").src = imgArr[imgPos];
                    if (menuBox.position === 5) {
                        iDebug("$('contentImg').src====="+imgArr[imgPos]);
                    }
					$("point" + imgPos).style.background = "#000000";
                    $("pointBack").style.background = "#CEA062";
                    $("contentTxt").style.top = 12-pageContent * currPage + "px";
					break;
				case 1://酒店指南
					$("guideName" + btnPos).style.color = "#cea163";
					$("guideImg" + btnPos).src = "images/menu" + btnPos + "_1.png";
					break;
				case 2://优惠活动
					$("discountList" + listPos).style.color = "#000000";
					$("discountList" + listPos).style.background = "#cea163";
					var title = contentList[listIdx].name+"："+contentList[listIdx].nameDetail;
					if(tool.getCharacterLength(title)>wordSize){
						$("discountList" + listPos).innerHTML = "<marquee width='848'>"+title+"</marquee>";
					}
					break;
			}
			break;
		case 2: // 右侧内容的下一级
			if(menuBox.position == 1){// 酒店指南
				if(btnPos == 1){//电话本

				}else{
					$("scrollBar4").src = "images/page02.png";
					$("discountContent").style.top = 12-pageContent*currPage + "px";
				}
			}else if(menuBox.position == 2){
				$("scrollBar4").src = "images/page02.png";
				$("discountContent").style.top = 12-pageContent*currPage + "px";
			}
			break;
	}
}

function loseFocus() {
	switch(focusArea){
		case 0: // 左侧栏目
			$("menu"+menuBox.focusPos).style.color = "#c4a17f";
			break;
		case 1: // 右侧内容
			switch(menuBox.position){
				case 0://关于酒店
					$("scrollBar0").src = "images/page01.png";
					break;
				case 3://餐厅酒吧
				case 4://客房设施
				case 5://会议设施
					$("point" + imgPos).style.background = "#79614A";
					break;
				case 1://酒店指南
					$("guideName" + btnPos).style.color = "#b8ab94";
					$("guideImg" + btnPos).src = "images/menu" + btnPos + "_0.png";
					break;
				case 2://优惠活动
					$("discountList" + listPos).style.color = "#d5cab8";
					if(listPos%2 == 1){
						$("discountList" + listPos).style.background = "rgba(255,255,255,.05)";
					}else{
						$("discountList" + listPos).style.background = "transparent";
					}
					var title = contentList[listIdx].name+"："+contentList[listIdx].nameDetail;
					if(tool.getCharacterLength(title)>wordSize){
						title = title.substring(0,tool.getRealLength(title,wordSize-2))+"...";
					}
					$("discountList" + listPos).innerHTML = title;
					break;
			}
			break;
		case 2: // 右侧内容的下一级
			if(menuBox.position == 2){
				$("scrollBar4").src = "images/page01.png";
			}
			break;
	}
}

function doSelect() {
	switch(focusArea){
		case 0: // 左侧栏目
			break;
		case 1: // 右侧内容
			switch(menuBox.position){
				case 0://关于酒店
					break;
				case 3://餐厅酒吧
				case 4://客房设施
				case 5://会议设施
					loseFocus();
					focusArea = 2;
					$("popup").style.display = "block";
					initBigImg();
					break;
				case 1://酒店指南
				case 2://优惠活动
					focusArea = 2;
					initContent();
					break;
			}
			break;
		case 2: // 右侧内容的下一级
			break;
	}
}

function initBigImg() {
	$("leftArrow").style.display = "block";
	$("rightArrow").style.display = "block";
	if(imgPos == 0){
		$("leftArrow").style.display = "none";
	}
	if(imgPos == imgArr.length-1){
		$("rightArrow").style.display = "none";
	}
	$("bigImg").src = imgBigArr[imgPos];
}

// 获取左侧栏目数据
function getColumnList() {
	if(ajaxObj == null){
     	ajaxObj = new AJAX_OBJ();
    }else{
    	ajaxObj.requestAbort();
    }
    // ajaxObj.charset = "gbk";
    ajaxObj.successCallback = function(_xmlHttp) {
    	iDebug("[feature.js]__getColumnList__successCallback !");
      	var jsonData = eval('(' + _xmlHttp.responseText + ')');
      	if(typeof(jsonData) != "undefined" && jsonData != null){
		  	menuList = jsonData.data;
		  	menuList = QuickSort(menuList);
		  	initMenu();
		}else{
			iDebug("request menu data is null !"); 
		}
    }
    ajaxObj.failureCallback = function(_xmlHttp) {
      	iDebug("[feature.js]__getColumnList__failureCallback !");
    }
    var url = debug===1?ajaxUrls.priColumnUrl[debug].replace("{1}",columnPos):ajaxUrls.priColumnUrl[debug];
    ajaxObj.url = url + "?category=" + categoryId + "&hotelid=" + hotelid;
    ajaxObj.requestData();
}

function initMenu() {
	if(menuList.length == 0)return;	
	menuBox = new showList(maxMenuLen,menuList.length,0,0,window);
  	menuBox.focusDiv = "menuFocus";
	menuBox.listHigh = 67;
	menuBox.focusLoop = true;
	menuBox.pageLoop = true;
  	menuBox.haveData = function(_list){
    	$("menu"+_list.idPos).innerText = menuList[_list.dataPos].Name;
  	};
  	menuBox.notData = function(_list){
   		$("menu"+_list.idPos).innerText = "";
  	};
  	menuBox.startShow();
	getContent();
}

function covert2Json(thinfo,info) {
	var resultJson = [];
	for(var i = 0; i < info.length ; i++) {
		var tmpData = {};
		for(var __atrribute in thinfo[0]) {
			if(thinfo[0][__atrribute]) {
				tmpData[thinfo[0][__atrribute]] = decodeURIComponent(info[i][__atrribute]);
			}			
		}
		if(info[i]["subth"]) {//解析子节点
			tmpData["submenu"] = covert2Json(info[i]["subth"],info[i]["submenu"]);
		}
		resultJson.push(tmpData);
	}
	return resultJson;
}

// 获取右侧内容
function getContent() {
	if(ajaxObj == null){
     	ajaxObj = new AJAX_OBJ();
    }else{
    	ajaxObj.requestAbort();
    }
    // ajaxObj.charset = "gbk";
    ajaxObj.successCallback = function(_xmlHttp) {
    	iDebug("[feature.js]__getContent__successCallback !");
      	var jsonData = eval('(' + _xmlHttp.responseText + ')');
        contentList = covert2Json(jsonData.thinfo,jsonData.info);
        iDebug("JSON.stringify(subMenuList)menuBox.position=" + menuBox.position + "||" + JSON.stringify(contentList));
      	// iDebug(contentList);
      	initContent(listIdx - listPos);
		onFocus();
    }
    ajaxObj.failureCallback = function(_xmlHttp) {
      	iDebug("[feature.js]__getContent__failureCallback !");
    }
    var url = debug==1?ajaxUrls.queryAppDataUrl[debug].replace("{1}",columnPos).replace("{2}",menuBox.position):ajaxUrls.queryAppDataUrl[debug];
    ajaxObj.url = url+"?pid="+menuList[menuBox.position].ID;
    ajaxObj.requestData();
}

function initContent(temp) {
	var title = "";
	switch(menuBox.position){
		case 0://关于酒店
		case 3://餐厅酒吧
		case 4://客房设施
		case 5://会议设施
            showContent(0);
            imgArr = [];
            imgBigArr = [];
            for (var i = 0; i < contentList.length; i++) {
                imgArr.push(contentList[i].picUrl)
                if (contentList[i].picUrlBig) {
                    imgBigArr.push(contentList[i].picUrlBig)
                }
            }
            // imgArr = contentList[0].picUrl.split(",");
            // if (contentList[0].picUrlBig) {
            //     imgBigArr = contentList[0].picUrlBig.split(",");
            // }
			$("contentImg").src = imgArr[0];
			$("contentTxt").innerHTML = contentList[0].intro;
			if(imgArr.length>1){
				$("pointBack").style.display = "block";
				$("pointBack").style.width = (34+18*(imgArr.length-1))+"px";
				$("pointBack").style.left = (313-$("pointBack").offsetWidth)/2 + "px";
				$("pointBack").innerHTML = "";
				for(var i=0;i<imgArr.length;i++){
					$("pointBack").innerHTML += '<div id="point'+i+'" style="position:absolute;left:'+(13+i*18)+'px;top:3px;width:8px;height:8px;border-radius:5px;background:#79614A;"></div>'
				}
				$("point" + imgPos).style.background = "#C4A17F";
			}else{
				$("pointBack").style.display = "none";
			}
			totalPage = Math.ceil($("contentTxt").offsetHeight/pageContent);
			if(totalPage>1){
				$("scrollBack0").style.display = "block";
			}else{
				$("scrollBack0").style.display = "none";
			}
			scroll_Bar1 = new ScrollBar("scrollBar0", null, window);
			scroll_Bar1.init(totalPage , totalPage , 395 , -6);
			scroll_Bar1.scroll(currPage);
			break;
		case 1://酒店指南
			if(focusArea == 2){
				if(btnPos == 1){//电话本
					showContent(2);
					fillTelList();
				}else{
					showContent(4);
					$("discountTitle").innerHTML = "";
					$("discountDetail").innerHTML = contentList[btnPos].intro;
					totalPage = Math.ceil($("discountDetail").offsetHeight/pageContent);
					if(totalPage>1){
						$("scrollBack4").style.display = "block";
					}else{
						$("scrollBack4").style.display = "none";
					}
					scroll_Bar2 = new ScrollBar("scrollBar4", null, window);
					scroll_Bar2.init(totalPage , totalPage , 395 , -6);
					scroll_Bar2.scroll(currPage);
				}
				$("title").innerHTML = " · " + contentList[btnPos].name;
			}else{
				showContent(1);
			}
			break;
		case 2://优惠活动
			if(focusArea == 2){
				showContent(4);
				$("discountTitle").innerHTML = contentList[listIdx].name;
				$("discountDetail").innerHTML = contentList[listIdx].intro+"</br></br>"+contentList[listIdx].clause;
				totalPage = Math.ceil($("discountDetail").offsetHeight/pageContent);
				if(totalPage>1){
					$("scrollBack4").style.display = "block";
				}else{
					$("scrollBack4").style.display = "none";
				}
				scroll_Bar2 = new ScrollBar("scrollBar4", null, window);
				scroll_Bar2.init(totalPage , totalPage , 395,-6);
				scroll_Bar2.scroll(currPage);
			}else{
				showContent(3);
				maxListLen = 7;
	  			for(var i=0;i<maxListLen;i++){
					if(contentList[i + temp]){
						if(i%2==1){
							$("discountList" + i).style.background = "rgba(255,255,255,.05)";
						}
						title = contentList[i + temp].name+"："+contentList[i + temp].nameDetail;
						if(tool.getCharacterLength(title)>wordSize){
							title = title.substring(0,tool.getRealLength(title,wordSize-2))+"...";
						}
						$("discountList" + i).innerHTML = title;
					}else{
						$("discountList" + i).innerHTML = "";
						$("discountList" + i).style.background = "transparent";
					}
				}
			}
  			break;
	}
}

function showContent(num) {
	for(var i=0;i<5;i++){
		$("content" + i).style.display = "none";
	}
	$("content" + num).style.display = "block";
}

// 填入电话列表
function fillTelList() {
	maxListLen = 14;
	for(var i=0;i<maxListLen;i++){
		if(contentList[btnPos]&&contentList[btnPos].submenu[i+currPage*maxListLen]){
			$("telList" + i).innerHTML = contentList[btnPos].submenu[i+currPage*maxListLen].name+"：&nbsp;&nbsp;"+contentList[btnPos].submenu[i+currPage*maxListLen].tel;
		}else{
			$("telList" + i).innerHTML = "";
		}
	}
}
