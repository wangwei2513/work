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
function getRightData(obj,data) {
            if (data.id == 0) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr0 = [];
            arr0.push(obj);
			}else if (data.id == 1) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr1 = [];
            arr1.push(obj);
			}else if (data.id == 2) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr2 = [];
            arr2.push(obj);
			}else if (data.id == 3) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr3 = [];
            arr3.push(obj);
			}else if (data.id == 4) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr4 = [];
            arr4.push(obj);
			}else if (data.id == 5) {	
				var obj = {
                	content : data.content,
                	contentImage : data.contentImage.imageUrl,
                	title : data.title
            	}
            var arr5 = [];
            arr5.push(obj);
			}else if (data.id == 6) {	
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
	        for(var i=0,len=data.length;i<len;++i) {
	        	if (data[i].description === "推荐") {
					getRightData(rightArr0,data[i]) 
				}else if (data[i].description === "美食") {
					getRightData(rightArr1,data[i])
				}else if (data[i].description === "土特产") {
					getRightData(rightArr2,data[i])
				}else if (data[i].description === "旅游景点") {
					getRightData(rightArr3,data[i])
				}else if (data[i].description === "分类") {
					getRightData(rightArr4,data[i])
				}
	        }
	        contentData.push(rightArr0);
	        contentData.push(rightArr1);
	        contentData.push(rightArr2);
	        contentData.push(rightArr3);
	        contentData.push(rightArr4);
			};
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

function init() {
        showText();
      }

 /*文字页码变化*/
function changPageNum() {
  $("currPage").innerHTML = pageNum;
}

function Up() {
  if (parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight) {
    $("content").style.top = "0px";
    pageNum = 1;
    changPageNum();
    $("barDiv").style.top = "33px";
  } else {
    $("content").style.top = parseInt($("content").style.top.split("p")[0]) + $("content").parentNode.offsetHeight + "px";
    pageNum--;
    changPageNum();
    $("barDiv").style.top = 30 + pageNumMove * (pageNum - 1) + "px";
  }
}
/*下*/
function Down(){
  if($("content").offsetHeight + parseInt($("content").style.top.split("p")[0]) < $("content").parentNode.offsetHeight * 2) {
    $("content").style.top = $("content").parentNode.offsetHeight - $("content").offsetHeight + "px";
    $("barDiv").style.top = 30 + pageNumMove * (pageLen - 1) + "px";
    pageNum = pageLen;
    changPageNum
  } else {
    $("content").style.top = parseInt($("content").style.top.split("p")[0]) - $("content").parentNode.offsetHeight + "px";
    $("barDiv").style.top = 30 + pageNumMove * pageNum + "px";
    pageNum++;
    changPageNum
  }
}      
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
          
            return false;
            break;
          case 4: // right
          case 39:
           
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