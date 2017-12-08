/*本地假数据测试地址*/
var textAndImg = "js/menuData.js";
var img = "js/menuData_1.js";
var text = "js/menuData_2.js";
var idebug = 1;

/*本地数据测试地址*/
//var  PATH = "http://192.168.18.184:8090/py_crawler/getInfo";
//var  IMAGEPATH = "http://192.168.18.184:8090/py_crawler/image"

/*现场数据测试地址*/
var  PATH = "http://192.168.101.40:8091/py_crawler/getInfo";
var  IMAGEPATH = "http://192.168.101.40:8091/py_crawler/image"

function getAjaxUrl() {
	var url = "";
	var args = arguments;
	switch (args[0]) {
		case "getTextAndImg":    
			url = textAndImg;
			break;
		case "img":    
			url = img;
			break;	
		case "text":    
			url = text;
			break;
	}
	return url;
}



