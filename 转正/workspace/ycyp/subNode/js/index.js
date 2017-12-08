var contentDataUrl = "content.js";
var ajaxObj = null;
var contentData = [];	
var haveBackUrl = false;
var backUrl = "../index.htm";
var focusTop = getGlobalVar("focusTop");
var focusLeft = getGlobalVar("focusLeft");
var focusRight = getGlobalVar("focusRight");
var pageNumMove = 0;
var pageNum = 1;  //文字页码
var pageLen = 0;
var flag = false;
var url = ""//搜索页面地址
function getRightData(obj,data) {
            if (data.enName == 'lzs') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr0 = [];
            arr0.push(obj);
			}else if (data.enName == 'bys') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr1 = [];
            arr1.push(obj);
			}else if (data.enName == 'jcs') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr2 = [];
            arr2.push(obj);
			}else if (data.enName == 'qys') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr3 = [];
            arr3.push(obj);
			}else if (data.enName == 'pls') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr4 = [];
            arr4.push(obj);
			}else if (data.enName == 'tss') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr5 = [];
            arr5.push(obj);
			}else if (data.enName == 'dxs') {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr6 = [];
            arr6.push(obj);
			}
			obj.push(arr0);
			obj.push(arr1);
			obj.push(arr2);
			obj.push(arr3);
			obj.push(arr4);
			obj.push(arr5);
 }
        	
/*获取右侧总数据rightArr*/	
function getContentData(frameIndex){
	var contentLoc = "content.js";
		sendAjax(contentLoc,null,function(data){
			data = eval('('+data+')');	
			if(data && data.length > 0) {
        for (var i = 0;i<data.length;i++) {
          getRightData(rightArr0,data[i]) 
          getRightData(rightArr1,data[i])
          getRightData(rightArr2,data[i])
          getRightData(rightArr3,data[i])
          getRightData(rightArr4,data[i])
        }
			}
	        contentData.push(rightArr0);
	        contentData.push(rightArr1);
	        contentData.push(rightArr2);
	        contentData.push(rightArr3);
	        contentData.push(rightArr4);
		})
}

function showText() {
	$("title").innerHTML = contentData[focusTop][focusLeft][focusRight].title;
	$("content").innerHTML = contentData[focusTop][focusLeft][focusRight].content;
	$("contentImg").innerHTML = contentData[focusTop][focusLeft][focusRight].contentImage;
	pageLen = Math.ceil($("content").offsetHeight / $("content").parentNode.offsetHeight);
    pageNumMove = Math.floor(356 / (pageLen - 1));
    $("totalPage").innerHTML = pageLen;
    $("currPage").innerHTML = pageNum;
}

function Back(){
	window.location.href = backUrl;
}

function getContentData() {
	sendAjax(contentDataUrl,null,function(data){
		contentData = eval('('+data+')');
	});
	
}

function doSelect() {
  if (flag) {
    window.location.href = url;//跳转搜索页面
  }
}

function init() {
        showText();
      }

 /*文字页码变化*/
function changPageNum() {
  $("currPage").innerHTML = pageNum;
}

function showBtnFocus() {
  
}

function showBtnFocus() {
  var imgUrl = $("btnFocus").src;
  var changeImgUrl = imgUrl.split('.')[0]+'bg.png';
  $("btnFocus").src = changeImgUrl;
}
/**/
function clearBtnFocus() {
  var imgUrl = $("btnFocus").src;
  var changeImgUrl = imgUrl.split('bg.')[0]+'.png';
  $("btnFocus").src = changeImgUrl;
}

function Up() {
  if (-parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight) {
    $("content").style.top = "0px";
    pageNum = 1;
    changPageNum();
    $("barDiv").style.top = "125px";
  } else {
    $("content").style.top = parseInt($("content").style.top.split("p")[0]) + $("content").parentNode.offsetHeight + "px";
    pageNum--;
    changPageNum();
    $("barDiv").style.top = 125 + pageNumMove * (pageNum - 1) + "px";
  }
}
/*下*/
function Down(){

  if($("content").offsetHeight + parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight * 2) {
    $("content").style.top = parseInt($("content").parentNode.offsetHeight - $("content").offsetHeight) + "px";
    $("barDiv").style.top = 125 + pageNumMove * (pageLen - 1) + "px";
    pageNum = pageLen;
    changPageNum()
  } else {

    $("content").style.top = parseInt(parseInt($("content").style.top.split("p")[0]) - $("content").parentNode.offsetHeight) + "px";
    $("barDiv").style.top = 125 + pageNumMove * pageNum + "px";
    pageNum++;
    changPageNum()
  }
}      

function Left() {
  if (flag) {
    flag = false;
    clearBtnFocus();
  }else{
    flag = true;
    showBtnFocus();
  }
}

function Right() {
  if (flag) {
    flag = false;
    clearBtnFocus();
  }else{
    flag = true;
    showBtnFocus();
  }
}

document.onkeydown = eventHandler;
function eventHandler(keycode) {
        var e = keycode || event;
        var keycode = e.keyCode || e.which || e.charCode;
        switch (keycode) {
          case 1: // up
          case 38:
            Up();
            return false;
            break;
          case 2: // down
          case 40:
            Down();
            return false;
            break;
          case 3: // left
          case 37:
            Left()
            return false;
            break;
          case 4: // right
          case 39:
            Right();
            return false;
            break;
          case 8:
          case 27:
          case 32:
          case 340:
          case 640:
            return Back();
            break;
        }
      }