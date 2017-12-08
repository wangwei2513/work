var focusArea = 0; //焦点区域
var focusLeft = 0;//左侧焦点记录
var focusRight = 0;//右侧焦点记录
var pageLen = 0;  //文字页数
var pageNum = 1;   //文字页码
var menuData = [];//数据
var contentData = [];
var ajaxObj = null;
var leftArrLen = '';
var flag = getGlobalVar("flag")?getGlobalVar("flag"):false;
/*初始化*/
function init(){
	getMenuData();
	getData();
	initRightList();
	initList();
	initTime();
	
	focus();
}
/*渲染栏目列表*/
function initList(){
	
	if (menuData.length > 0) {
		if (flag) {
			for(var i=0;i<5;++i){
				$("item_"+i).style.visibility = "visible";
					$("item_"+i).innerText = menuData[i].name;
				}
		}else{
			for(var i=0;i<5;++i){
				
				$("item_"+i).style.visibility = "visible";
				if (i === 1) {
					$("item_"+i).innerText = menuData[i].name + leftArrLen;
				}else {
					$("item_"+i).innerText = menuData[i].name;
				}
			}
		}
		
	}else{
		$("item_"+i).style.visibility = "hidden";
	}
}
/*获取栏目数据*/
function getMenuData() {
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
		menuData = getData;
	}

	ajaxObj.failureCallback = function(){
	}

	ajaxObj.requestData();
}
/*获取内容数据*/
function getData() {
	var contentLoc = menuData[focusLeft].enName+"/content.js";
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
		contentData = getData;
	}

	ajaxObj.failureCallback = function(){

	}

	ajaxObj.requestData();
}

/*文字内容编辑*/
function txtData(num,startNum) {
	var contentTxt = '';
	contentTxt = contentData[num].content;
	var arrRight = contentTxt.split("<\/p>");
	arrRight.pop();
	var innerTxt = '';
	var txtArr = [];
	console.log(txtArr)
	for (var i = 0; i<arrRight.length; i++) {
		txtArr.push(arrRight[i].split("<p>"))
	}
	leftArrLen = '('+arrRight.length+')';
	for (var i=0;i<txtArr.length;i++) {
		innerTxt += "<span>"+(i+startNum)+txtArr[i]+'</span><br>';
	}
	return innerTxt;
}

/*渲染右侧内容*/
function initRightList(){
	
	if (flag) {
		if (focusLeft === 1) {
			$("content").innerHTML = '您没有未读公告';
			$("subMenu").innerHTML = menuData[focusLeft].name;
		}else if (focusLeft === 2) {
			var contetntArr = contentData[0].content.split("<\/p>");
			contetntArr.pop();
			var pos = contetntArr.length;
			$("content").innerHTML = txtData(1,1) + txtData(2,pos);
			
			$("subMenu").innerHTML = menuData[focusLeft].name;
		}else{
			$("content").innerHTML = txtData(focusLeft,1);
			$("subMenu").innerHTML = menuData[focusLeft].name;
		}
		
	}else{
		$("content").innerHTML = txtData(focusLeft,1);
		$("subMenu").innerHTML = menuData[focusLeft].name;
	}
}
/*初始化时间*/
function initTime() { 
	var date = new Date();
    $("date").innerHTML = formatTime("yyyy-M-d",date) + "<br/>" + formatTime("hh:mm",date);
    setTimeout(initTime,1000);
}
/*栏目焦点*/
function focus() {
	$("item_"+focusLeft).style.background = "red";
	$("item_"+focusLeft).style.color = "#000";
	$("item_"+focusLeft).style.border = "9px solid green";
}
/*清除栏目焦点*/
function clearFocus() {
	$("item_"+focusLeft).style.background = "";
	$("item_"+focusLeft).style.color = "#ded9df";
	$("item_"+focusLeft).style.border = "";
}
/*显示焦点*/
function showLeftFocus() {
	$("item_"+focusLeft).style.background = "red";
}
/*隐藏焦点*/
function hideLeftFocus() {
	$("item_"+focusLeft).style.background = "#ccc";
}

/*焦点逻辑*/
function focusMove(step){
	if(focusArea === 0){
		if(step === -1 && focusLeft > 0){
			clearFocus();
			focusLeft--;
			initRightList();
			focus();
		}
		else if(step === -1 && focusLeft === 0){
			clearFocus();
			focusLeft+=4;
			initRightList();
			focus();
		}else if (step === 1 && focusLeft === 0 && flag == false) {
			clearFocus();
			focusLeft++;
			initRightList();
			flag = true;
			focus();
		}else if (step === 1 && focusLeft === 1 && flag == true) {
			clearFocus();
			$("item_"+focusLeft).innerText = menuData[focusLeft].name;
			focusLeft++;

			initRightList();
			focus();
		}
		else if(step === 1 && focusLeft < 4){
			
			clearFocus();
			focusLeft++;
			initRightList();
			focus();
		}
		else if( step === 1 && focusLeft === 4){
			clearFocus();
			focusLeft-=4;
			initRightList();
			focus();
		}
	}
	else if(focusArea === 1){
		if(step === -1){		
			if (parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight) {
	          $("content").style.top = "96px";
	        } else {
	          $("content").style.top = parseInt($("content").style.top.split("p")[0]) + $("content").parentNode.offsetHeight + "px";
	        }
		}
		else if(step === 1){
			if ($("content").offsetHeight < $("content").parentNode.offsetHeight) {

			}else{
				if ($("content").offsetHeight + parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight * 2) {
		          $("content").style.top = $("content").parentNode.offsetHeight - $("content").offsetHeight + "px";
		        } else {
		          $("content").style.top = parseInt($("content").style.top.split("p")[0]) - $("content").parentNode.offsetHeight + "px";
		        }
			}
			
		}
	}
	
}
/*事件监听*/
document.onkeydown = eventHandler;
function eventHandler(eve){
	var e = eve || window.event;
	var keycode = e.keyCode || e.which || e.charCode;
 	switch(keycode){
 		case 1:   // up
	    case 38:
	    case 87:
	      focusMove(-1);
	      return false;
	      break;
	    case 2:   // down
	    case 40:
	    case 83:
	      focusMove(1);
	      return false;
	      break;
	    case 3:   // left
	    case 37:
	    case 65:
	    	focusArea = 0;
	    	showLeftFocus();
	      	return false;
	      	break;
	    case 4:   // right
	    case 39:
	    case 68:
	    	if(contentData.length>0){
	    		focusArea = 1;
	    		hideLeftFocus();
		    	//focusMove(0);	
	    	}    	
		  //rightFrame.focus();
	      return false;
	      break;
	    case 13:  //KEY_SELECT
	    	doSelect();
	      	return false;
	      	break;
	    case 8:  //KEY_BACK
	      	window.location.href = "../index.htm";
	      	return false;
	      	break;
	    case 27:
	      return false;
	      break;
	}
}