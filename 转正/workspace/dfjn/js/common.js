var DEBUG = 0;
var access_token = navigator.appName.indexOf("iPanel") != -1 ? iPanel.eventFrame.access_token : "TOKEN50001002";
var homed_id = navigator.appName.indexOf("iPanel") != -1 ? iPanel.eventFrame.home_id : "1234";
var deviceid = navigator.appName.indexOf("iPanel") != -1 ? (iPanel.eventFrame.device_id ? iPanel.eventFrame.device_id : 9999) : 9999;
var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1) ? "iPanel" : "other";
var user = null;
var ajaxObj = null;
var playurl = playAddress = "http://web.eis/homed/app/education/education_homed/newPlay/play.php" //德州教育专区版专用播放
var result_video_info = null; //事件流向下一层
var jyjyLabel = 7236;
var ajaxObjSeries = null;

function $(__id) {
    return document.getElementById(__id);
}
var defaultObj = [
    { "name": "运营集群", "addr": "192.168.35.101", "label": 7236 },
    { "name": "调试集群", "addr": "192.168.101.130", "label": 34147 },
    { "name": "开发集群", "addr": "192.168.36.101", "label": 34147 }
];
// getLabelByDns();

// function getLabelByDns() { //根据当前所在的集群，去选择对应的Label
//     //iDebug("yanch homedconfig---"+network.ethernets[0].DNSServers[0]);
//     var dns = network.ethernets[0].DNSServers[0];
//     for (var i = 0; i < defaultObj.length; i++) {
//         iDebug("yanch homedconfig defaultObj[i].addr=" + defaultObj[i].addr)
//         if (defaultObj[i].addr == dns) {
//             jyjyLabel = defaultObj[i].label;
//             iDebug("yanch homedconfig- jyjyLabel--" + jyjyLabel);
//             break;
//         }
//     }
// }
/*获取url中携带参数*/
function getParam(_type, _url) {
    var url = _url || window.location.href;
    if (new RegExp(".*\\b" + _type + "\\b(\\s*=([^&]+)).*", "gi").test(url)) {
        return RegExp.$2;
    } else {
        return "";
    }
}



function getUrlParams(_key, _url, _spliter) {
    /**
     * 获取标准URL的参数
     * @_key：字符串，不支持数组参数（多个相同的key）
     * @_url：字符串，（window）.location.href，使用时别误传入非window对象
     * @_spliter：字符串，参数间分隔符
     * 注意：
     * 	1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
     * 	2、非标准URL勿用（hash部分除外）
     * 	3、query（？）与hash（#）中存在键值一样时，以数组返回
     */
    if (typeof(_url) == "object") {
        var url = _url.location.href;
    } else {
        var url = _url ? _url : window.location.href;
    }
    if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
        return "";
    }
    var spliter = _spliter || "&";
    var haveQuery = false;
    if (url.indexOf("?") != -1) {
        var urlParams = url.split("?")[1];
        if (urlParams.indexOf(spliter) != -1) {
            urlParams = urlParams.split(spliter);
        } else {
            urlParams = [urlParams];
        }
        haveQuery = true;
    } else {
        var urlParams = [url];
    }
    if (urlParams[urlParams.length - 1].indexOf("#") != -1) {
        var urlTemp = urlParams[urlParams.length - 1].split("#");
        urlParams[urlParams.length - 1] = urlTemp[0];
        var hash = urlTemp[1];
        if (hash.indexOf(spliter) != -1) {
            hash = hash.split(spliter);
        } else {
            hash = [hash];
        }
        if (haveQuery == true) {
            urlParams = urlParams.concat(hash);
        } else {
            urlParams = hash;
        }
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


var hashTableObj = new hashTableClass(200);
var tool = {
    isiPanel: (navigator.appName.indexOf("iPanel") != -1) ? true : false,
    checkTimes: 0,
    maxCheckTimes: 100,


    //字符串补位
    addZero: function(str, format) {
        str = str + "";
        var len = format.length;
        return format.substring(0, len - str.length) + str;
    },
    //获取汉字的长度，一个汉字算两个字节
    getCharacterLength: function(_str) {
        var _str = _str.replace(/[\(\)\-\\\[\]]/g, "0");
        if (this.isiPanel && !isAdvanceFlag) { //advance不走这里面
            var re = /[^\u2E80-\uFE4F]+/gi; //iPanel匹配中文不一样，要加个非判断
        } else {
            var re = /[\u2E80-\uFE4F]+/gi;
        }

        var bb = _str.match(re);
        if (typeof bb == "undefined" || bb == "null") {
            return _str.length;
        }
        var cc = "";
        if (bb != null) {
            cc = bb.join("");
        }
        var totalLen = _str.length;
        var chLen = cc.length;
        var engLen = totalLen - chLen;
        var tW = chLen * 2 + engLen;
        //1121 处理两个< >，在页面显示时，这两个括号其实一起是占两个中文字大小的
        /*var strLeft=_str.indexOf("<",0);
        if(strLeft!=-1){
        	tW+=1;
        }
        var strRight=_str.indexOf(">",0);
        if(strRight!=-1){
        	tW+=1;
        }*/

        //1222 W,M英文大写也算是一个汉字  数字: 48-57 小写字母: 97-122 大写字母: 65-90
        for (var i = 0; i < totalLen; i++) {
            if ((_str[i] == ">") || (_str[i] == "<") || (_str.charCodeAt(i) >= 65 && _str.charCodeAt(i) <= 90)) {
                tW += 1;
            }
        }
        return tW;
    },

    getRealLength: function(_str, _len) {
        if (_str.length <= _len / 2) return _str.length;
        var num = 0;
        //var re = /^[\u4e00-\u9fa5]*$/;
        for (var i = 0; i < _str.length; i++) {
            if (_str.charCodeAt(i) > 255 || (_str.charCodeAt(i) >= 65 && _str.charCodeAt(i) <= 90)) {
                num += 2; //>255认为是汉字
            } else {
                num++;
            }
            if (num >= _len) return i + 1; //超过的时候，只截取前面的部分。
        }
        return _str.length;
    },

    //截取字符串
    cutStr: function(stbr, len) {
        var char_length = 0;
        for (var i = 0; i < stbr.length; i++) {
            var son_str = stbr.charAt(i);
            encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
            if (char_length >= len) {
                var sub_len = char_length == len ? i + 1 : i;
                return stbr.substr(0, sub_len);
                break;
            }
        }

        return stbr.substr(0, len); //@pengjiao 2014/7/29 修改节目名称分析规则中为undefined
    },
    toDate: function(time) {
        iDebug("--yanch todate--init")
        var temp = time;
        //var temp=tmp+"";
        var mon = temp.substring(4, 6);
        var dat = temp.substring(6, 8);
        var str = mon + "-" + dat;
        return str;

    },
    //返回 2014-02-02或是 02-02
    changeToDate: function(time, flag) {
        var tmp = parseInt(time);
        //var newTmp = new Date().getTime()-tmp;
        var d = new Date(tmp);
        iDebug(d);
        var t0 = this.addZero((d.getMonth() + 1), "00");
        var t1 = this.addZero(d.getDate(), "00");
        //var str = /*d.getFullYear()+"-"*/+t0+"-"+t1+" "+this.addZero(d.getHours(),"00")+":"+this.addZero(d.getMinutes(),"00");
        if (typeof flag != "undefined") {
            var str = d.getFullYear() + "-" + t0 + "-" + t1;
        } else {
            var str = t0 + "-" + t1;
        }
        iDebug(str)
        return str;
    },
    //将毫秒数转换成date对象
    changeToFullDate: function(time) {
        var tmp = time || 0;
        var newTmp = new Date().getTime() - tmp;
        var d = new Date(newTmp);
        var str = d.getFullYear() + "-" + this.addZero((d.getMonth() + 1), "00") + "-" + this.addZero(d.getDate(), "00");
        return str;
    }
};




//返回字符串汉字长度 英文或特殊字符两个相当于一个汉字
/*
 *str:传入的字符串
 *len:字符串的最大长度,汉字的长度
 *返回截取的字符串
 */
function getStrChineseLen(str, len, suffix) {
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
                if (flag == 1) return str.substring(0, i - 1) + suffix; //修改,sunny,防止换行...
                else return str.substring(0, i - 1) + suffix;
                break;
            }

        }
    }
    return str;
}

function getStrChineseLength(str) {
    iDebug("yanch homedconfig getStrChineseLength str=" + str + ";type=" + typeof str)
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

function gotoUrl(_url) {
    window.location.href = _url;
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

function getBackUrl(currUrl) {
    if (!currUrl) currUrl = window.location.href;
    var startPos = currUrl.lastIndexOf("/") + 1;
    var endPos = currUrl.indexOf("?");
    if (endPos < startPos) endPos = currUrl.length;
    var tmpUrl = getGlobalVar(currUrl.substring(startPos, endPos));
    iDebug("getBackUrl()--clobalobj.js-name=" + currUrl.substring(startPos, endPos) + ",backUrl=" + tmpUrl);
    return tmpUrl;
}

/*
 *@author: huangjm 2012.12.24
 *@desc:	主要用记全局变量，iPanel是用eventFrame来记，webkit内核用window.localStorage来记，其它用cookie来记
 */
(function() {
    var globalPos = function() {
        this.index = "";
        /**************取得当前的浏览器版本*******************/
        this.getBrowser = function() {
            var tmp = "";
            var str = navigator.appName;
            if (str.indexOf("iPanel") != -1) {
                tmp = "iPanel";
            } else if (str.indexOf("Miscrosoft") != -1) {
                tmp = "Miscrosoft";
            } else if (str.indexOf("Google") != -1) {
                tmp = "Google";
            } else if (str.indexOf("Netscape") != -1) {
                tmp = "Netscape";
            } else if (str.indexOf("Opera") != -1) {
                tmp = "Opera";
            }
            return tmp;
        };

        /**************设置全局变量*******************/
        this.set = function() {
            var index = arguments[0] + "";
            var value = arguments[1] + "";
            value = value.replace("|", "#0#0#");
            //console.log("----index="+index+"--value="+value)
            this.index = index;
            if (this.getBrowser() == "iPanel") {
                if (typeof iPanel.eventFrame.__globalPos == "undefined") {
                    iPanel.eventFrame.__globalPos = {};
                }
                iPanel.eventFrame.__globalPos[index] = value;
            } else {
                if (window.localStorage) {
                    var storage = window.localStorage;
                    storage[index] = value;
                } else {
                    this.setCookie(index, value);
                }
            }
        };

        /**************获取全局变量*******************/
        this.get = function() {
            var index = arguments[0];
            var str = "";
            var tmp = "";
            if (this.getBrowser() == "iPanel") {
                if (iPanel.eventFrame.__globalPos) {
                    str = iPanel.eventFrame.__globalPos[index];
                    tmp = str;
                }
            } else {
                if (window.localStorage) {
                    var storage = window.localStorage;
                    str = storage[index];
                    if (typeof str != "undefined") tmp = str;
                } else {
                    str = this.getCookie(index);
                    if (str.indexOf("|") != -1) {
                        tmp = str.replace("#0#0#", "|");
                    }
                    tmp = str;
                }
            }
            //var tmp  = decodeURI(str);
            return tmp;
        };

        /****************重置变量*****************/
        this.reset = function() {
            var index = arguments[0];
            if (this.getBrowser() == "iPanel") {
                if (iPanel.eventFrame.__globalPos) {
                    iPanel.eventFrame.__globalPos[index] = "";
                }
            } else {
                if (window.localStorage) {
                    var storage = window.localStorage;
                    storage[index] = "";
                } else {
                    this.delCookie(index);
                }
            }
        };

        /***********设定Cookie值***************/
        this.setCookie = function(name, value) {
            var expdate = new Date();
            var argv = arguments;
            var argc = arguments.length;
            var expires = (argc > 2) ? argv[2] : 5 * 12 * 30 * 24 * 60 * 60;
            var path = (argc > 3) ? argv[3] : "/";
            var domain = (argc > 4) ? argv[4] : null;
            var secure = (argc > 5) ? argv[5] : false;
            if (expires != null) expdate.setTime(expdate.getTime() + (expires * 1000));
            var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1) ? "iPanel" : "other";
            document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expdate.toGMTString())) +
                ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) +
                ((secure == true) ? "; secure" : "");
        };

        /**********获得Cookie解码后的值**************/
        this.getCookie = function(_name) {
            var url = document.cookie;
            if (new RegExp(".*\\b" + _name + "\\b(\\s*=([^&;]+)).*", "gi").test(url)) {
                return unescape(RegExp.$2);
            } else {
                return "";
            }
        }

        /**********删除Cookie**************/
        this.delCookie = function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(name);
            document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
        }
        this.setBackUrl = function(toUrl, currUrl) {
            var startPos = toUrl.lastIndexOf("/") + 1;
            var endPos = toUrl.indexOf("?");
            if (endPos < startPos) endPos = toUrl.length;
            this.set(toUrl.substring(startPos, endPos), currUrl);
            iDebug("setBackUrl()---name=" + toUrl.substring(startPos, endPos) + ",value=" + currUrl);
        }
        this.getBackUrl = function(currUrl) {
            if (!currUrl) currUrl = window.location.href;
            var startPos = currUrl.lastIndexOf("/") + 1;

            var endPos = currUrl.indexOf("?");
            iDebug("getBackUrl()---currUrl=" + currUrl + ",startPos=" + startPos + ",endPos=" + endPos + ",startPos=" + startPos);
            if (endPos < startPos) endPos = currUrl.length;
            var tmpUrl = this.get(currUrl.substring(startPos, endPos));
            iDebug("getBackUrl()---name=" + currUrl.substring(startPos, endPos) + ",backUrl=" + tmpUrl);
            return tmpUrl;
        }
    };

    GP = new globalPos();
})();