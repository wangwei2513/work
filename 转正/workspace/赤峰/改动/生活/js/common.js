var access_token = "";
var Flag = 0;
var globalDomain = ".homed.me";

//测试点播id
//var testMacAddr = "00-27-1a-00-6b-2c";

var testMacAddr = "00-27-1a-00-6b-2c"//公司liancm测试需要 暂时保留
var deviceType = 1;//公司测试只能用mac  暂时保留//0：全部；1：机顶盒；2：CA卡；3：手机；4：pad；5：电脑 与上面testCardId对应

//现场实际的testMacAddr和deviceType --实际现场使用ca卡号登陆
if(typeof CAManager != "undefined"){
	testMacAddr = CAManager.cardSerialNumber;
	deviceType = 2;
}
//var slaveAddr = 'http://api.slave.homed.me:13160';
//var	accountAddr="http://access.homed.me";
var slaveAddr = "http://10.14.41.245:13160";//'http://api.slave.homed.me:13160',
var	accountAddr= "http://10.14.41.244:12690";//"http://access.homed.me
//var cfxwLabel = 136;
var cfxwLabel = 137;
function $(_id) {
    return document.getElementById(_id);
}
//打印测试
function iDebug(str) {
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.debug(str); //假如要看打印的时间，可以改：iPanel.debug(str, 2);
    } else if (navigator.appName.indexOf("Opera") != -1) {
        opera.postError(str);
    } else if (navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1) {
        console.log(str);
    }
}

function sendAjax(url, data, callback) {
    var xmlhttp;
    var isAsync = false;;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
            for (var i = 0, len = versions.length; i < len; i++) {
                try {
                    xmlhttp = new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                } catch (ex) {
                    //跳过
                    if (len - 1 == i) {
                        throw new Error("there is no xmlhttprequest object available");
                    }
                }
            }
        } else {
            xmlhttp = new ActiveXObject(arguments.callee.activeXString);
        }
    }
    xmlhttp.overrideMimeType("text/html; charset=UTF-8");
    xmlhttp.onreadystatechange = function() {
        iDebug("readyState:---------" + xmlhttp.readyState + "status:-----" + xmlhttp.status);
        if (xmlhttp.readyState == 4) {

            if (xmlhttp.status == 200 || xmlhttp.status == 0) {
                callback(xmlhttp.responseText);
            }
        }
    }
    if (data != null && typeof data != "undefined") {
        xmlhttp.open("POST", url, isAsync);
        xmlhttp.send(data);
    } else {
        xmlhttp.open("GET", url, isAsync);
        xmlhttp.send(null);
    }
}
/*----------------------------------------返回字符串汉字长度 英文或特殊字符两个相当于一个汉字---------------------------------------------------------*/
/*
 *str:传入的字符串
 *len:字符串的最大长度
 *返回截取的字符串
 */
function getStrChineseLen(str, len) {
    var w = 0;
    str = str.replace(/[ ]*$/g, "");
    if (getStrChineseLength(str) > len) {
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            var flag = 0;
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                w++;
                flag = 0;
            } else {
                w += 2;
                flag = 1;
            }
            if (parseInt((w + 1) / 2) > len) {
                if (flag == 1) return str.substring(0, i - 1) + ".."; //修改,sunny,防止换行...
                else return str.substring(0, i - 2) + "..";
                break;
            }

        }
    }
    return str;
}

function getStrChineseLength(str) {
    str = str.replace(/[ ]*$/g, "");
    var w = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            w++;
        } else {
            w += 2;
        }
    }
    var length = w % 2 == 0 ? (w / 2) : (parseInt(w / 2) + 1);
    return length;
}
//*******************************获取标准URL的参数 start************************//
/**
 * 获取标准URL的参数
 * @_key：字符串，不支持数组参数（多个相同的key）
 * @_url：字符串，（window）.location.href，使用时别误传入非window对象
 * @_spliter：字符串，参数间分隔符
 * 注意：
 * 	1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
 * 	2、非标准URL勿用
 * 	3、query（？）与hash（#）中存在键值一样时，以数组返回
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
        if (url.indexOf("?") != -1) urlParams = url.split("?")[1];
        else if (url.indexOf("#") != -1) urlParams = url.split("#")[1];
        else urlParams = url.split(spliter)[1];
        if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) { //可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
            var v = [];
            if (urlParams.indexOf(spliter_1) != -1) {
                v = urlParams.split(spliter_1);
                urlParams = [];
                for (var x = 0; x < v.length; x++) {
                    urlParams = urlParams.concat(v[x].split(spliter));
                }
            } else {
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

function setGlobalVar(_name, _value) { //设置全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.setGlobalVar(_name, _value);
    } else {
        var b1 = JSON.stringify(_value);
        sessionStorage.setItem(_name, b1);
    }
}

function getGlobalVar(_name) { //获取全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        return iPanel.getGlobalVar(_name);
    } else {
        return JSON.parse(sessionStorage.getItem(_name));
    }
}

function delGlobalVar(_name) { //删除全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.delGlobalVar(_name);
    } else {
        sessionStorage.removeItem(_name);
    }
}


function showTime() {
    //setInterval(function() {
    $("timer").innerHTML = new Date().Format("yyyy-MM-dd");
    //}, 1000);
}
Date.prototype.Format = function(fmt) {
    var o = {
        "y+": this.getYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};