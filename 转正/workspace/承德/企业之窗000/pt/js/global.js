var cpsyUrl = "http://192.168.17.94:8080/agriculture_dezhou/cpsy/index.htm";
/**
 * [initPage description]:页面基础方法和事件注册函数
 * @param  {[type]} _f:window对象,
 * @eventHandler [description]:在需初始化页面定义的事件绑定函数，接收两个参数，第一个是键值映射后的字符串eventObj，第二个是事件类型type，为1表示按键消息，为2表示是系统消息;返回值为eventObj.args.
 * @return {[type]}type，用于控制消息流程[description]
 */
function initPage(f) {
    var fDocument = f.document;

    f.$ = function(id) {
        return f.document.getElementById(id);
    };
    // f.user = users.currentUser;

    if(typeof(f.eventHandler) == "undefined"){
        f.eventHandler = function(){};
    }

    f.document.onkeydown = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
    // f.document.onkeypress = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
    f.document.onirkeypress = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
    f.document.onsystemevent = function () {return (f.eventHandler(Event.mapping(f.event), 2));};
}

/*键值映射函数，将消息键值转换对应的为字符串*/
//控制消息流向 截止：EVENT.STOP  同层：EVENT.ADVECTED  下一层：EVENT.DOWN
//检测当前是否为iPanel30浏览器
function checkIPANEL30(){
    var userAgent = navigator.userAgent.toLowerCase();
    var flag = false;   
    if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel3.0
        flag = true;
    }
    return flag;
}
var IPANEL30 = checkIPANEL30(); //是否为ipanel 3.0的浏览器
var EVENT = {STOP:0, DOWN:1, ADVECTED:2};
if(IPANEL30){
    EVENT = {STOP:0, DOWN:1, ADVECTED:2};   
}else{
    EVENT = {STOP:false, DOWN:true, ADVECTED:true}; 
}
var Event = {
    mapping: function(_event){
    	var keyCode = _event.which,
            code = "", //初始化键值映射后得到的字符串
            args = {};//消息处理时需要携带的其他内容
        // iPanel.debug("keyCode before eventMapping:" + keyCode);
        if (keyCode < 58 && keyCode > 47) {     //数字键
            args = {value: keyCode - 48, type: EVENT.STOP};
            code = "KEY_NUMERIC";
        }else{
        	var args = {modifiers: 0, value: keyCode, type: EVENT.STOP};
            switch (keyCode) {
                case 1://上
                case 38:
                    code = "KEY_UP";
                    break;
                case 2:  //下
                case 40:
                    code = "KEY_DOWN";
                    break;
                case 3:  //左
                case 37:
                    code = "KEY_LEFT";
                    break;
                case 4:  //右
                case 39:
                    code = "KEY_RIGHT";
                    break;
				case 33: //Standard
				case 372:
					code = "KEY_PAGE_UP";
					break;
				case 34: //Standard
				case 373:
					code = "KEY_PAGE_DOWN";
					break;
                case 13: //选择确定
                    code = "KEY_SELECT";
                    break;
                case 258://待机
                    code = "KEY_STANDBY";                   
                    args.type = EVENT.DOWN;
                    break;
                case 339://退出
				case 27:
                    code = "KEY_EXIT";
                    break;
                case 340://返回
                case 8:
                    code = "KEY_BACK";
                    break;           
                case 512://homepage
                    code = "KEY_HOMEPAGE";
					args.type = EVENT.DOWN;
                    break;
                case 513://菜单
                    code = "KEY_MENU";
                    args.type = EVENT.DOWN;
                    break;
                case 573://节目表
                    code = "KEY_PLAYLIST";
                    args.type = EVENT.DOWN;
                    break;      
                case 593://频道+
                    code = "KEY_CHANNEL_UP";
                    args.type = EVENT.DOWN;
                    break;  
                case 594://频道-
                    code = "KEY_CHANNEL_DOWN";
                    args.type = EVENT.DOWN;
                    break;
                case 567://信息
                    code = "KEY_INFO";
                    //args.type = EVENT.DOWN;
                    break;
                case 595://音量+
                    code="KEY_VOLUME_UP";
                    args.type = EVENT.DOWN;
                    break;
                case 596://音量-
                    code="KEY_VOLUME_DOWN";
                    args.type = EVENT.DOWN;
                    break;
                case 597://静音
                    code = "KEY_MUTE";
                    args.type = EVENT.DOWN;
                    break;
                case 833://绿键，预定
                    code = "KEY_GREEN";
                    break;
                /*系统消息*/
                case 5500://网络连接
                    code = "EIS_IP_NETWORK_CONNECT";
                    args.type = EVENT.DOWN;
                    break;
                case 5501://网络断开
                    code = "EIS_IP_NETWORK_DISCONNECT";
                    args.type = EVENT.DOWN;
                    break;
                case 5550://cable线连接
                    code = "EIS_CABLE_NETWORK_CONNECT";
                    args.type = EVENT.DOWN;
                    break;
                case 5551://cable线断开
                    code = "EIS_CABLE_NETWORK_DISCONNECT";
                    args.type = EVENT.DOWN;
                    break;
                case 5974://当前页面已经打开完成，发消息通知页面
	                 code = "EIS_MISC_HTML_OPEN_FINISHED";
	                 args.modifiers = _event.modifiers;
	                 break;
                case 8280://中间件启动结束
                    code = "EIS_DVB_STARTUP_FINISH";
                    break;
                case 8041://NIT发生变化
                    code = "EIS_DVB_NIT_CHANGED";
                    args.type = EVENT.DOWN;
                    break;
                case 8412://通知页面导入器准备好，可以打开
                    code = "DOWNLOAD_IMPORT_FAILED";
                    break;
                case 8413://导入器下载失败
                    code = "DOWNLOAD_IMPORT_SUCCESS";
                    args.modifiers = _event.modifiers;
                    break;
                /*注意是否有args*/
                case 8000://开始tune频点
                    code = "EIS_DVB_TUNE_START";
                    break;
                case 8040://当前频点下，搜索到NIT
                    code = "EIS_DVB_NIT_READY";
                    break;
                case 8303://自动搜索完毕，发现用户频道改变，发消息通知用户是否排序
                    code = "EIS_DVB_CHANNEL_CHANGED";
                    args.type = EVENT.DOWN;                    
                    break;
                case 8001://锁定频点成功
                    code = "EIS_DVB_TUNE_SUCCESS";
                    args.type = EVENT.DOWN;                     
                    break;
                case 8002://锁定频点失败
                    code = "EIS_DVB_TUNE_FAILED";
                    args.type = EVENT.DOWN;                       
                    break;
                case 8020://锁定频点成功后，此频点的信息搜索完毕，可以获取此频点下的service信息
                    code = "EIS_DVB_SEARCH_SERVICE_READY";
                    break;
                case 8010://自动搜索完毕
                    code = "EIS_DVB_SEARCH_FINISHED";
                    break;
                case 8011://自动和手动搜索失败
                    code = "EIS_DVB_SEARCH_FAILED";
                    break;
                case 8300://打开频道时向页面发的通知
                    code = "DVB_CHANNEL_OPEN";
                    args.modifiers = _event.modifiers;
                    args.type = EVENT.DOWN;                      
                    break;
                case 8302:
                    code = "DVB_LOCKED_CHNANEL";
                    args.type = EVENT.DOWN;
                    break;
                case 8110://当前频点收到actual P/F 或者other P/F event接收完毕，更新通知，P/F超时通知
                    code = "EIS_DVB_EIT_PF_READY";
                    args.modifiers = _event.modifiers;                    
                    break;
                case 8101://当前频点actual schedule接收EIT timeout,不指P/F timeout
                    code = "EIS_DVB_EIT_ACTUAL_SCHEDULE_TIMEOUT";
                    args.modifiers = _event.modifiers;                
                    break;
                case 8103://为配合页面分批刷新event信息的需要,发送此消息来通知页面刷新EVENT显示
                    code = "DVB_EIT_REFRESH_EVENT_INFO";
                    args.modifiers = _event.modifiers;                
                    break;
                case 9002://（应用自定义系统消息）频道找不到
                    code = "CHANNEL_NOT_FOUND";
                    args.type = EVENT.DOWN;
                    break;
                default:
                    code = "UNMAPPING_KEY";
                    args.type = EVENT.DOWN;
            }
        }
        return {
            code: code,
            args: args
        };
    }
}
/*公共方法--start*/
function doExit(){
	iPanel.eventFrame.exitToMenu();
}

function doMenu(){
	iPanel.eventFrame.exitToMenu();
}
function $(_id){
    return window.document.getElementById(_id);
}
/*公共方法--end*/

/*
 *str:传入的字符串
 *len:字符串的最大长度，为汉字字符串长度，字母、符号的情况则换算为汉字长度
 *suffix:截取后的字符串结尾填充的字符串，如".."、"..."，不传则不填充，这里只考虑长度小于等于3的填充字符(不能为汉字)，或不传入的情况
 *返回截取的字符串
 */
function getStrChineseLen(str,len,suffix){
	if(typeof str != "string"){
		str = str.toString();
	}
	var w = 0;
	str = str.replace(/[ ]*$/g,"");
	var flag0 = 0;//上上个字符是否是双字节
	var flag1 = 0;//上个字符是否是双字节
	var flag2 = 0;//当前字符是否是双字节
	//iDebug("str:"+str+"--getStrChineseLength:"+getStrChineseLength(str))
	if(getStrChineseLength(str)>len){
		for (var i=0; i<str.length; i++) {
			 var c = str.charCodeAt(i);
			 flag0 = flag1;
			 flag1 = flag2;
			 //单字节加1
			 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			   w++;
			   flag2 = 0;
			 }else {
			   w+=2;
			   flag2 = 1;
			 }
			 if(parseInt((w+1)/2)>len){
				if(typeof(suffix) == "undefined"){
					return str.substring(0,i);
				}
				else if(suffix.length == 1){
					return str.substring(0,i-1)+suffix;
				}
				else if(suffix.length == 2){
					if (flag1 == 1)return str.substring(0,i-1)+suffix;
					else return str.substring(0,i-2)+suffix;
				}
				else{
					if (flag1 == 1)return str.substring(0,i-2)+suffix;
					else{
						var num = flag0 == 1 ? 2 : 3;
						return str.substring(0,i-num)+suffix;
					}
				}
				break;
			 }		 
		} 
	}
	return str; 
}

//返回字符串长度，为汉字长度，即如果字符串为汉字如"字符"，则返回2，如为"zf"，则返回1，英文2个字符等同一个汉字的长度
function getStrChineseLength(str){
	if(typeof str != "string"){
		str = str.toString();
	}
	str = str.replace(/[ ]*$/g,"");
	var w = 0;
	for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
     //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       w++;
     }else {
       w+=2;
     }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
}

/*检查字符串是否为有效值*/
function checkStrNull(_str){
    var tmpStr = "";
    if(typeof(_str) == "undefined" || _str == "null" || _str == "undefined"){
        tmpStr = "";
    }else{
        tmpStr = _str;
    }   
    return tmpStr;
}
/*滚动字符串,长度为汉字的长度*/
function marqueeStr(_str,_len,_flag){
    var tmpStr = checkStrNull(_str);
    if(tmpStr == "") return tmpStr;
    var marqStr = _str;
    var len = getStrChineseLength(_str);
    if(len > _len){
        if(typeof(_flag) != "undefined"){//传参数表示需要设置marquee的width属性
            if(_flag.indexOf("px") != -1 || _flag.indexOf("%") != -1){
                marqStr = "<marquee width='" + _flag + "' >" + _str + "</marquee>"; 
            }else{
                marqStr = "<marquee>" + _str + "</marquee>";
            }
        }else{
            marqStr = "<marquee>" + _str + "</marquee>";    
        }
    }
    return marqStr;
}

/*全局变量封装（兼容ipanel3.0和其它浏览器）
sessionStorage是基于frame的 不同的B窗口属于不同的frame，sessionStorage不能共用，
修改为ipanel浏览器走GlobalVar，其他浏览器走sessionStorage，方便本地测试
*/
var mySessionStorage = new globalVar();
function globalVar(){
	var userAgent = navigator.userAgent.toLowerCase();
    this.getItem = function(_str){
        var val = "";
        if(userAgent.indexOf("ipanel") != -1){//ipanel浏览器用这个
            val = iPanel.getGlobalVar(_str);
        }else{
            val = sessionStorage.getItem(_str); 
        }
        if(val == "" || val == null || val == "undefined" ) val = "";
        return val;
    };
    this.removeItem = function(_str){
        if(userAgent.indexOf("ipanel") != -1){
            iPanel.delGlobalVar(_str);
        }else{
            sessionStorage.removeItem(_str);    
        }
    }
    this.setItem = function(_key, _val){
        if(userAgent.indexOf("ipanel") != -1){
            iPanel.setGlobalVar(_key, _val);
        }else{
            sessionStorage.setItem(_key, _val); 
        }
    }
}
//*******************************获取标准URL的参数 start************************//
/**
 * 获取标准URL的参数
 * @_key：字符串，不支持数组参数（多个相同的key）
 * @_url：字符串，（window）.location.href，使用时别误传入非window对象
 * @_spliter：字符串，参数间分隔符
 * 注意：
 *  1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
 *  2、非标准URL勿用
 *  3、query（？）与hash（#）中存在键值一样时，以数组返回
 */
function getUrlParams(_key, _url, _spliter) {
    //iPanel.debug("common.js===getUrlParams====_url" + _url);
    if (typeof(_url) == "object") {
        var url = _url.location.href;
    } else {
        var url = _url ? _url : window.location.href;
    }
    if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
        return "";
    }
    var spliter = _spliter || "&";
    var spliter_1 = "#";
    var haveQuery = false;
    var x_0 = url.indexOf(spliter);
    var x_1 = url.indexOf(spliter_1);
    var urlParams;
    if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
        if(url.indexOf("?") != -1) urlParams = url.split("?")[1];
        else if(url.indexOf("#") != -1) urlParams = url.split("#")[1];
        else urlParams = url.split(spliter)[1];
        if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
            var v = [];
            if(urlParams.indexOf(spliter_1) != -1){
                v = urlParams.split(spliter_1);
                urlParams = [];
                for(var x = 0; x < v.length; x++){
                    urlParams = urlParams.concat(v[x].split(spliter));
                }
            }else{
                urlParams = urlParams.split(spliter);
            }
        } else {
            urlParams = [urlParams];
        }
        haveQuery = true;
    } else {
        urlParams = [url];
    }
    var valueArr = [];
    for (var i = 0, len = urlParams.length; i < len; i++) {
        var params = urlParams[i].split("=");
        if (params[0] == _key) {
            valueArr.push(params[1]);
        }
    }
    if (valueArr.length > 0) {
        if (valueArr.length == 1) {
            return valueArr[0];
        }
        return valueArr;
    }
    return "";
}

//打印函数
function iDebug(str){
    // return; // 现场反馈加这个打印会慢很多，所以放空
    if(navigator.appName.indexOf("iPanel") != -1){
        iPanel.debug(str);    
    }else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
        console.log(str);
    }
}