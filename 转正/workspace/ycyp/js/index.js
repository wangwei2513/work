var focusArea = getGlobalVar("focusArea") ? getGlobalVar("focusArea"):0; //焦点区域
var focusLeft = getGlobalVar("focusLeft") ? getGlobalVar("focusLeft"):0;//左侧焦点
var focusRight = getGlobalVar("focusRight") ? getGlobalVar("focusRight"):0;//右侧焦点
var focusTop = getGlobalVar("focusTop") ? getGlobalVar("focusTop"):0;//顶部焦点
var pageLen = 0;  //页数
var pageNum = 1;   //页码
var picLen = 6;//入口图片数量
var topArr = [];//top数据
var rightArr = [];//右侧数据
var npFlag = true;
var shFlag = false;
var ajaxObj = null;
var arr0,arr1,arr2,arr3,arr4,arr5,arr6;
window.onload = init();
/*初始化*/
function init(){
	initTime();    
	getTopData();
	frameChange();
	getRightarr();
	renderTop();
	initContent();
	
	topFocus();
}

/*初始化时间*/
function initTime() {
	var date = new Date()
    $("date").innerHTML = formatTime("yyyy-M-d",date) +" "+ formatTime("h:mm",date);
    setTimeout(initTime,1000);
}

function renderTop() {
	for(var i=0,len=topArr.length;i<len;i++){
		$("top_"+ i).src=topArr[i].focusImageUrl;
	}
}

/*获取顶部数据*/
function getTopData() {
	if(ajaxObj == null){
		ajaxObj = new ajaxClass();
		ajaxObj.charset = "gbk";
		ajaxObj.frame = window;
	}
	else{
		ajaxObj.requestAbort();
	}

	ajaxObj.url = "menu.js";
	ajaxObj.async = false;
	ajaxObj.successCallback = function(_xmlHttp){
		var getData = eval("("+_xmlHttp.responseText+")");
		topArr = getData;
	}

	ajaxObj.failureCallback = function(){
	}

	ajaxObj.requestData();
}

/*获取右侧数据细则*/
function getRightData(data) {
            if (data.shortName == 'lzs') {	
				var obj0 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl
            	}
             arr0 = [];
            if (obj0 !== "undefined") {
            	arr0.push(obj0);
            }
            
			}else if (data.shortName == 'bys') {	
				var obj1 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
             arr1 = [];
            if (obj1 !== "undefined") {
            	arr1.push(obj1);
            }
            
			}else if (data.shortName == 'jcs') {	
				var obj2 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
             arr2 = [];
            if (obj2 !== "undefined") {
            	 arr2.push(obj2);
            }
           
			}else if (data.shortName == 'qys') {	
				var obj3 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
             arr3 = [];
            if (obj3 !== "undefined") {
            	arr3.push(obj3);
            }
            
			}else if (data.shortName == 'pls') {	
				var obj4 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
            arr4 = [];
            if (obj4 !== "undefined") {
            	arr4.push(obj4);
            }
            
			}else if (data.shortName == 'tss') {	
				var obj5 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
            arr5 = [];
            if (obj5 !== "undefined") {
            	arr5.push(obj5);
            }
			}else if (data.shortName == 'dxs') {	
				var obj6 = {
                	subTitle : data.subTitle,
                	entryImage : data.entryImage.imageUrl,
            	}
            arr6 = [];
            if (obj6 != "undefined") {
            	arr6.push(obj6);
            }
            
			}
			
        }
        	
/*获取右侧总数据rightArr*/	
function frameChange(){
	var contentLoc = topArr[focusTop].enName + "/content.js";
		if(ajaxObj == null){
			ajaxObj = new ajaxClass();
			ajaxObj.charset = "gbk";
			ajaxObj.frame = window;
		}
		else{
			ajaxObj.requestAbort();
		}

		ajaxObj.url = contentLoc;
		ajaxObj.async = false;
		ajaxObj.successCallback = function(_xmlHttp){
			var getData = eval("("+_xmlHttp.responseText+")");
			data = getData;
			if(data && data.length > 0) {
	        for(var i=0,len=data.length;i<len;++i) {
					getRightData(data[i]) 
				}
	        }
		}

		ajaxObj.failureCallback = function(){
		}

		ajaxObj.requestData();


			
}

function getRightarr() {
	rightArr.push(arr0);
	rightArr.push(arr1);
	rightArr.push(arr2);
	rightArr.push(arr3);
	rightArr.push(arr4);
	rightArr.push(arr5);
	rightArr.push(arr6);
}

/*渲染右侧*/
function initContent() {
 	pageLen = Math.ceil(rightArr[focusLeft].length / picLen);
 	console.log(pageLen)
 	if (picLen > rightArr[focusLeft].length) {
 		picLen = rightArr[focusLeft].length
 	}
    for (var i = 0; i < picLen; i++) {
	  if (rightArr[focusLeft].length == 0) {
	    $('item_' + i).style.visibility = 'hidden';
	  } else {
	  	$('item_' + i).style.visibility = 'visible';
	    $('img_' + i).src = rightArr[focusLeft][parseInt((pageNum - 1) * picLen) + i].entryImage;
	    $('subTitle_' + i).innerHTML = subStr(rightArr[focusLeft][parseInt((pageNum - 1) * picLen) + i].subTitle, 15, '...');
	    $('current_page').innerHTML = pageNum;
	    $('total_page').innerHTML = pageLen;
	  }
	}
 } 

/*右侧焦点*/
function showRightFocus() {
	var imgUrl = $("rightFocus_" + focusRight).src;
	var changeImgUrl = imgUrl.split('.')[0]+'bg.png';
	$("rightFocus_" + focusRight).src = changeImgUrl;
}

/*清除右侧焦点*/
function clearRightFocus() {
	var imgUrl = $("rightFocus_" + focusRight).src;
	var changeImgUrl = imgUrl.split('bg.')[0]+'.png';
	$("rightFocus_" + focusRight).src = changeImgUrl;
}
/*左侧焦点切换*/
function leftFocusChange(num) {
		var topnum = parseInt($("focus").style.top.split("px")[0])+(57*num)+'px';
		$("focus").style.top = topnum;	
}

function showLeftFocus() {
	var imgUrl = $("focusImg").src;
	var changeImgUrl = imgUrl.split('2')[0]+'1.png';
	$("focusImg").src = changeImgUrl;
}

function hiddenLeftFocus() {
	var imgUrl = $("focusImg").src;
	var changeImgUrl = imgUrl.split('1')[0]+'2.png';
	$("focusImg").src = changeImgUrl;
}

/*焦点区域切换*/
function leftFocus() {
	var imgUrl = $("leftImg_" + focusLeft).src;
	var changeImgUrl = imgUrl.split('.')[0]+'bg.png';
	$("leftImg_" + focusLeft).src = changeImgUrl;
}
/*清除左侧焦点*/
function clearLeftFocus() {
	var imgUrl = $("leftImg_" + focusLeft).src;
	var changeImgUrl = imgUrl.split('bg.')[0]+'.png';
	$("leftImg_" + focusLeft).src = changeImgUrl;
}

function topFocus() {
	var imgUrl = $("top_" + focusTop).src;
	var changeImgUrl = imgUrl.split('.')[0]+'bg.png';
	$("top_" + focusTop).src = changeImgUrl;
	var num = (parseInt($("top_" + focusTop).parentNode.offsetWidth) - parseInt($("focusTop").offsetWidth))/2;
	var leftnum =parseInt(parseInt($("top_" + focusTop).parentNode.style.left.split('px')[0])+ num) +'px';
	$("focusTop").style.left = leftnum
}
function clearTopFocus() {
	var imgUrl = $("top_" + focusTop).src;
	var changeImgUrl = imgUrl.split('bg.')[0]+'.png';
	$("top_" + focusTop).src = changeImgUrl;
}

function showNextPageFocus() {
	if (shFlag) {
		shFlag = false;
		$("nextPreFocus").style.visibility = "hidden";
		
	}else{
		shFlag = true;
		$("nextPreFocus").style.visibility = "visible";
	}
	
}

function nextPageFocusChange() {
	if (npFlag) {
		npFlag = false;
		$("nextPreFocus").style.left = "1108px"
	}else{
		npFlag = true;
		$("nextPreFocus").style.left = "945px"
	}
}

/*焦点移动逻辑*/
function focusMove(step){
	if(focusArea === 0){
		if(step === -1 && focusTop > 0){
			clearTopFocus();
			focusTop--;
			topFocus();
			initContent();
		}
		else if(step === -1 && focusTop === 0){
			clearTopFocus();
			focusTop+=4;
			topFocus();
			initContent();
		}
		else if(step === 1 && focusTop < 4){
			clearTopFocus();
			focusTop++;
			topFocus();
			initContent();
		}
		else if( step === 1 && focusTop === 4){
			clearTopFocus();
			focusTop-=4;
			topFocus();
			initContent();
		}
	}
	else if(focusArea === 1){
		if(step === -1 && focusLeft !== 4 && focusLeft !== 0 ){
			focusLeft--;
			leftFocusChange(-1);
			initContent();
		}else if(step === 1 && focusLeft !== 3 && focusLeft !== 6){
			focusLeft++;
			leftFocusChange(1);
			initContent();
		}else if(step === 1 && focusLeft === 6){
			focusLeft = 0;
			leftFocusChange(1);
			initContent();
		}else if(step === -1 && focusLeft === 0){
			focusLeft = 6;
			leftFocusChange(-1);
			initContent();
		}
		else if( step === 1 && focusLeft === 3){
			focusLeft++;
			leftFocusChange(-6);
			initContent();
		}
	}else if (focusArea === 2) {
		if(step === -1 && focusRight > 0){
			clearRightFocus();
			focusRight--;
			showRightFocus();
		}else if(step === -1 && focusRight === 0 && pageNum !== 1){
			clearRightFocus();
			pageNum--;
			console.log(pageNum)
			focusRight = picLen - 1;
			initContent();
			showRightFocus();
		}else if(step === 1 && focusRight < 5){
			clearRightFocus();
			focusRight++;
			showRightFocus();
		}else if( step === 1 && focusRight === 5 && pageNum !== pageLen){
			clearRightFocus();
			pageNum++;
			console.log(pageNum)
			focusRight = 0;
			initContent();
			showRightFocus();
		}else if( step === -3 && focusRight < 3 && pageNum !== 1){
			clearRightFocus();
			pageNum--;
			console.log(pageNum)
			focusRight +=3;
			initContent();
			showRightFocus();
		}else if( step === -3 && focusRight > 2){
			clearRightFocus();
			focusRight -=3;
			showRightFocus();
		}else if( step === 3 && focusRight < 3){
			clearRightFocus();
			focusRight +=3;
			showRightFocus();
		}else if( step === 3 && focusRight > 2 && pageNum !== pageLen){
			clearRightFocus();
			pageNum++;
			console.log(pageNum)
			focusRight -=3;
			initContent();
			showRightFocus();
		}
	}
	
}
/*enter*/
function doSelect(){
	if (focusArea === 2 && !shFlag) {
		focusMemery();
        var url = topArr[focusTop].enName + '/index.htm';//subNode
        if (url){
          window.location.href = url;
          //window.location.href = "content.htm";
        }
	}else if (focusArea === 3) {
		window.location.href = "";//搜索页面
	}else if (shFlag) {
		if (npFlag && pageNum !== 1) {
			pageNum -=1;
			initContent();
		}else if (!npFlag && pageNum !== pageLen){
			pageNum +=1;
			initContent();
		}
	}
}

function showSearchBtn() {
	var imgUrl = $("searchBtn").src;
	var changeImgUrl = imgUrl.split('.')[0]+'bg.png';
	$("searchBtn").src = changeImgUrl;
}

function hiddenSearchBtn() {
	var imgUrl = $("searchBtn").src;
	var changeImgUrl = imgUrl.split('bg.')[0]+'.png';
	$("searchBtn").src = changeImgUrl;
}

/*焦点记忆*/
function focusMemery() {
    setGlobalVar("focusLeft", focusLeft);
    setGlobalVar("focusTop", focusTop);
    setGlobalVar("focusRight", focusRight);
    setGlobalVar("focusArea", focusArea);
}
/*监听事件*/
document.onkeydown = eventHandler;
function eventHandler(eve){
	var e = eve || window.event;
	var keycode = e.keyCode || e.which || e.charCode;
 	switch(keycode){
 		case 1:   // up
	    case 38:
	    case 87:
	    	if (focusArea === 1 && focusLeft === 4) {
	    		focusArea = 0;
	    		hiddenLeftFocus();
	    	}else if (focusArea === 1 && focusLeft !== 4) {
	    		focusMove(-1);
	    	}else if (focusArea === 2 && focusRight < 3 && pageNum !== 1) {
	    		focusMove(-3);
	    	}else if (focusArea === 2 && focusRight < 3 && pageNum === 1 && !shFlag) {
	    		showNextPageFocus();
	    		console.log(shFlag)
	    		clearRightFocus();
	    	}else if (shFlag && focusArea === 2 && focusRight < 3 && pageNum === 1) {
	    		focusArea = 0;
	    		showNextPageFocus();
	    	}else if (focusArea === 2 && focusRight > 2) {
	    		focusMove(-3);
	    	}else if (focusArea === 0) {
	    		focusArea = 3;
	    		showSearchBtn();
	    	}			
	      
	      return false;
	      break;
	    case 2:   // down
	    case 40:
	    case 83:
	      	if (focusArea === 1 ) {
	    		focusMove(1);
	    	}else if (focusArea === 0) {
	    		focusArea = 1;
	    		showLeftFocus();
	    	}else if (focusArea === 2 && focusRight < 3 && picLen > 2 && !shFlag) {
	    		focusMove(3);
	    	}else if (focusArea === 2 && focusRight > 2 && pageNum !== pageLen && !shFlag) {
	    		focusMove(3);
	    	}else if (shFlag) {
	    		showNextPageFocus();
	    		showRightFocus();
	    	}else if (focusArea === 3) {
	    		focusArea = 0;
	    		hiddenSearchBtn();
	    	}
	      return false;
	      break;
	    case 3:   // left
	    case 37:
	    case 65:
	    	
	    	if (focusArea === 0) {
	    		focusMove(-1);
	    	}else if (focusArea === 2 && !shFlag && focusRight !== 0) {
	    		focusMove(-1);
	    	}else if (focusArea === 2 && focusRight === 0 && pageNum === 1 && !shFlag) {
	    		focusArea = 1;
	    		showLeftFocus();
	    		clearRightFocus();
	    	}else if (shFlag) {
	    		console.log(shFlag)
	    		nextPageFocusChange();
	    	}
	      	return false;
	      	break;
	    case 4:   // right
	    case 39:
	    case 68:
	    	
	    	if (focusArea === 0) {
	    		focusMove(1);
	    	}else if (focusArea === 1) {
	    		focusArea = 2;
	    		hiddenLeftFocus();
	    		showRightFocus();
	    	}else if (focusArea === 2 && !shFlag && focusRight+1 < picLen) {
	    		focusMove(1);
	    	}else if (shFlag) {
	    		console.log(shFlag)
	    		nextPageFocusChange();
	    	}   	
		  //rightFrame.focus();
	      return false;
	      break;
	    case 13:  //KEY_SELECT
	    	doSelect();
	      	return false;
	      	break;
	    case 8:  //KEY_BACK
	    	
	      	return false;
	      	break;
	    case 27:
	      return false;
	      break;
	}
}
