var pos = 0，
	provinceData = [],
	cityData = [],



document.onkeydown = grabEvent;
document.onsystemevent = grabEvent;

function grabEvent(){
	var eventObj = Event.mapping(event);
	var keycode = eventObj.code;
    if(keycode == "KEY_EXIT" || keycode == "KEY_MENU") {
        window.location.href = returnUrl;
    	
		return EVENT.STOP;
    }
	switch(keycode){
		case "KEY_UP": //up
			keyUp();
			return EVENT.STOP;
			break;
		case "KEY_DOWN": //down
			keyDown();
			return EVENT.STOP;
			break;
		case "KEY_LEFT": //left
			keyLeft();
			return EVENT.STOP;
			break;
		case "KEY_RIGHT": //right
			keyRight();
			return EVENT.STOP;
			break;
		case "KEY_SELECT":
			doSelect();
			return EVENT.STOP;
			break;
		case "KEY_BACK":
			window.location.href = "index.htm" + location.search;
			return EVENT.STOP;
			break;
	}
}

function focusMove() {
	if (pos == 0) {
		$("province").style.border = "2px solid #ffa400";
		$("province").style.color = "#fff";
	}else if (pos == 1) {
		$("province").style.border = "";
		$("province").style.color = "#b1b0b0";
		$("city").style.border = "2px solid #ffa400";
		$("city").style.color = "#fff";
	}else if (pos == 2) {
		$("city").style.border = "";
		$("city").style.color = "#b1b0b0";
		$("name").style.border = "2px solid #ffa400";
		$("name").style.color = "#fff";
	}else if (pos == 3) {
		$("name").style.border = "";
		$("name").style.color = "#b1b0b0";
		$("man").style.border = "2px solid #ffa400";
		$("man").style.color = "#fff";
	}else if (pos == 4) {
		$("man").style.border = "";
		$("man").style.color = "#b1b0b0";
		$("woman").style.border = "2px solid #ffa400";
		$("woman").style.color = "#fff";
	}else if (pos == 5) {
		$("woman").style.border = "";
		$("woman").style.color = "#b1b0b0";
		$("year").style.border = "2px solid #ffa400";
		$("year").style.color = "#fff";
	}else if (pos == 6) {
		$("year").style.border = "";
		$("year").style.color = "#b1b0b0";
		$("month").style.border = "2px solid #ffa400";
		$("month").style.color = "#fff";
	}else if (pos == 7) {
		$("month").style.border = "";
		$("month").style.color = "#b1b0b0";
		$("day").style.border = "2px solid #ffa400";
		$("day").style.color = "#fff";
	}else if (pos == 8) {
		$("day").style.border = "";
		$("day").style.color = "#b1b0b0";
		$("kind").style.border = "2px solid #ffa400";
		$("kind").style.color = "#fff";
	}else if (pos == 9) {
		$("kind").style.border = "";
		$("kind").style.color = "#b1b0b0";
		$("idNum").style.border = "2px solid #ffa400";
		$("idNum").style.color = "#fff";
	}else if (pos == 10) {
		$("idNum").style.border = "";
		$("idNum").style.color = "#b1b0b0";
		$("phoneNum").style.border = "2px solid #ffa400";
		$("phoneNum").style.color = "#fff";
	}else if (pos == 11) {
		$("phoneNum").style.border = "";
		$("phoneNum").style.color = "#b1b0b0";
		$("clickBtn").style.border = "2px solid #ffa400";
		$("clickBtn").style.color = "#fff";
	}
}

function keyUp() {
	if (focusArea  == 0) {
		if (pos = 2 && pos == 3 && pos == 4) {
			pos = 0;
			focusMove();
		}else if (pos = 5 && pos == 6 && pos == 7) {
			pos = 2;
			focusMove();
		}else if (pos = 8) {
			pos = 5;
			focusMove();
		}else if (pos = 9) {
			pos = 8;
			focusMove();
		}else if (pos = 10) {
			pos = 9;
			focusMove();
		}else if (pos = 11) {
			pos = 10;
			focusMove();
		}
	}else if (focusArea == 1) {
		if (provincePos != provinceData.length) {
			provincePos--;
			provinceListMove(-1);
		}
	}else if (focusArea == 2) {
		if (cityPos != cityData.length) {
			cityPos -- ;
			cityListMove();
		}
	}else if (focusArea == 3) {

	}
	
}
var cityPos = 0;
function provinceListMove(num) {
	$("allProvince").style.top += 46*num + "px";
	$("provinceList" + provincePos).style.font-size = "22px";
	var prePos = provincePos - 1;
	var nextPos = provincePos + 1;
	$("provinceList" + prePos).style.font-size = "18px";
	$("provinceList" + nextPos).style.font-size = "18px";
}

function cityListMove(num) {
	$("allCity").style.top += 46*num + "px";
	$("cityList" + cityPos).style.font-size = "22px";
	var prePos = cityPos - 1;
	var nextPos = cityPos + 1;
	$("cityList" + prePos).style.font-size = "18px";
	$("cityList" + nextPos).style.font-size = "18px";
}

function keyDown() {
	if (focusArea  == 0) {
		if (pos = 0 && pos == 1) {
			pos = 2;
			focusMove();
		}else if (pos = 2 && pos == 3 && pos == 4) {
			pos = 5;
			focusMove();
		}else if (pos = pos = 5 && pos == 6 && pos == 7) {
			pos = 8;
			focusMove();
		}else if (pos = 8) {
			pos = 9;
			focusMove();
		}else if (pos = 9) {
			pos = 10;
			focusMove();
		}else if (pos = 10) {
			pos = 11;
			focusMove();
		}
	}
}

function keyLeft() {
	if (focusArea  == 0) {
		if (pos == 1) {
			pos = 0;
			focusMove();
		}else if (pos = 4) {
			pos = 3;
			focusMove();
		}else if (pos = 3) {
			pos = 2;
			focusMove();
		}else if (pos = 6) {
			pos = 5;
			focusMove();
		}else if (pos = 7) {
			pos = 6;
			focusMove();
		}
	}
}

function keyRight() {
	if (focusArea  == 0) {
		if (pos == 0) {
			pos = 1;
			focusMove();
		}else if (pos = 3) {
			pos = 4;
			focusMove();
		}else if (pos = 2) {
			pos = 3;
			focusMove();
		}else if (pos = 5) {
			pos = 6;
			focusMove();
		}else if (pos = 6) {
			pos = 7;
			focusMove();
		}
	}
}

function doSelect() {
	if (focusArea == 0) {
		if (pos == 0) {
			focusArea = 1;
			provinceFocus();
		}else if (pos == 1) {
			focusArea = 2;
			cityFocus();
		}else if (pos == 2) {
			focusArea = 3;
			allKeyboardShow();
		}else if (pos == 3 || pos == 4) {
			sexChoose();
		}else if (pos == 5 || pos == 6 || pos == 7 || pos == 9 || pos == 10) {	
			focusArea = 4
			numKeyboardShow();
		}else if (pos == 8) {	
			focusArea = 5;
			kindTableShow();
		}
	}
}

var dataUrl = "http://japi.juhe.cn/carInsuranceGift/check";
var realname = "",
	mobile = "",
	gender = "",
	birth = "",
	product = "",
	idcard = "",
	key = "da11f7b2178848ad7bcc2ce19ae0a15c";

//http://japi.juhe.cn/carInsuranceGift/check?company=聚合数据&realname=魏**&mobile=1516152****&gender=M&birth=1989-01-02&product=WYCX&idcard=3203811989********&key=您申请的appKey

/*投票*/
function submite(){
	//alert(totalVotes);
	var ajaxObj = new ajaxClass();
			ajaxObj.url = dataUrl + "?company=聚合数据&realname="+ realname +"&mobile="+mobile+"&gender="+ gender+"&birth="+birth+"&product="+ product+"&idcard="+ idcard+"&key="+ key;
			ajaxObj.successCallback = function(_xmlHttp){
				var str = _xmlHttp.responseText;
				var data = eval("("+str+")");
				
				}
			};
			ajaxObj.failureCallback = function(_xmlHttp){
			
			};
			ajaxObj.requestData();
		}
}

function sexChoose() {
	if (pos == 3) {
		$("man").style.border = "2px solid #ffa400";
		gender = "男";
	}else if (pos == 4) {
		$("woman").style.border = "2px solid #ffa400";
		gender = "女";
	}
}

function ajaxList(){
	if(ajaxObj == null){
		ajaxObj = new ajaxClass();
		ajaxObj.charset = "gbk";
		ajaxObj.frame = window;
	}
	else{
		ajaxObj.requestAbort();
	}

	var url = file;
	ajaxObj.url = "cityData.js";

	ajaxObj.successCallback = function(_xmlHttp){
		var getData = eval("("+_xmlHttp.responseText+")");
		var allData = getData
			for(var i=0;i<allData.length;i++){
				provinceData.push(allData.[i].province)
			}
			for(var i=0;i<allData.length;i++){
				cityData.push(allData.[i].city)
			}
			renderProvince();
			renderCity();
		initMenu();
	}

	ajaxObj.failureCallback = function(){
		initMenu();
	}

	ajaxObj.requestData();
}

function renderProvince() {
	for(var i=0;i<provinceData.length;i++){
		$("allProvince").innerHTML += "<tr height="46">"+ "<td id=provinceList"+ i +"style=\"border:1px solid #ccc;  padding-left:20px; color:#b1b0b0;\">"+ provinceData[i] +"</td></tr>"
	}
}
function renderCity() {
	for(var i=0;i<cityData[provincePos].length;i++){
		$("allCity").innerHTML += "<tr height="46">"+ "<td id=cityList"+ i +"style=\"border:1px solid #ccc;  padding-left:20px; color:#b1b0b0;\">"+ cityData[provincePos][i] +"</td></tr>"
	}
}
/*显示隐藏的省列表*/
function provinceFocus() {
	$("provinceList").style.display = "block";
}

function provinceBlur() {
	$("provinceList").style.display = "none";
}

/*显示隐藏的市列表*/
function cityFocus() {
	$("cityList").style.display = "block";
}

function cityBlur() {
	$("cityList").style.display = "none";
}
/*保险列表显示与隐藏*/
function kindTableShow() {
	$("kindTable").style.display = "block";
}

function kindTableShow() {
	$("kindTable").style.display = "none";
}