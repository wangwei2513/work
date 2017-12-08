var IPANEL30 = checkIPANEL30(); //是否为ipanel 3.0的浏览器
function setGlobalVar(_sName, _sValue) {
    try {
        _sValue = _sValue + "";
        if (Utility && Utility.setEnv) {
            Utility.setEnv(_sName, _sValue);
        } else if (iPanel && iPanel.setGlobalVar) {
            iPanel.setGlobalVar(_sName, _sValue);
        } else if (SysSetting && SysSetting.setEnv) {
            SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));
        }
    } catch (e) {
        document.cookie = escape(_sName) + "=" + escape(_sValue) + '; path=/';
    }
}


/**
 * @description 读cookie，获取全局参数
 * @param {string} _sName 全局参数名称（对应setGlobalVar方法中的_sName）
 * @return {string} result 返回值（对应setGlobalVar方法中的_sValue）
 */

function getGlobalVar(_sName) {
    var result = "";
    try {
        if (Utility && Utility.getEnv) {
            result = Utility.getEnv(_sName);
        } else if (iPanel && iPanel.getGlobalVar) {
            result = iPanel.getGlobalVar(_sName);
        } else if (SysSetting && SysSetting.getEnv) {
            result = decodeURIComponent(SysSetting.getEnv(_sName));
        }
        if (result == "undefined") {
            result = "";
        }
    } catch (e) {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (escape(_sName) == aCrumb[0]) {
                result = unescape(aCrumb[1]);
                break;
            }
        }
    }
    return result;
}
//检测当前是否为iPanel30浏览器
function checkIPANEL30() {
    var userAgent = navigator.userAgent.toLowerCase();
    var flag = false;
    if (userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1) { //ipanel3.0
        flag = true;
    }
    return flag;
}

function goPortal() { // 跳转到portal首页
    var backUrl = "";
    var backtoportal = window.name;
    if (backtoportal != null && backtoportal != "" && backtoportal != undefined) {
        backUrl = backtoportal;
    } else if (window.location.href.indexOf("?http") > -1 || window.location.href.indexOf("?file") > -1) {
        backUrl = window.location.href.split("?")[1];
    } else {
        var backtoportal2 = localStorage.getItem("portal");
        if (backtoportal2 != null && backtoportal2 != "" && backtoportal2 != undefined) {
            backUrl = backtoportal2;
        }
    }
    if (backUrl != "") {
        window.location.href = backUrl;
    }
}

/*全局变量封装（兼容ipanel3.0和其它浏览器）*/
var mySessionStorage = new globalVar();

function globalVar() {
    this.getItem = function(_str) {
        var val = "";
        if (IPANEL30) {
            val = iPanel.getGlobalVar(_str);
        } else {
            val = sessionStorage.getItem(_str);
        }
        if (val == "" || val == null || val == "undefined") val = "";
        return val;
    };
    this.removeItem = function(_str) {
        if (IPANEL30) {
            iPanel.delGlobalVar(_str);
        } else {
            sessionStorage.removeItem(_str);
        }
    }
    this.setItem = function(_key, _val) {
        if (IPANEL30) {
            iPanel.setGlobalVar(_key, _val);
        } else {
            sessionStorage.setItem(_key, _val);
        }
    }
}

function sendAjax(url, data, callback, type) {
    var xmlhttp;
    var isAsync = type ? true : false;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        //$("testCon").innerText = "readyState:---------"+xmlhttp.readyState+"status:-----"+xmlhttp.status;
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

function iDebug(str) {
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.debug(str); //假如要看打印的时间，可以改：iPanel.debug(str, 2);
    } else if (navigator.appName.indexOf("Opera") != -1) {
        opera.postError(str);
    } else if (navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1) {
        console.log(str);
    }
}

function $(id) {
    return document.getElementById(id);
}

function getByClass(className) {
    return document.getElementsByClassName(className);
}

function cutString(str, len) {
    if (typeof str != "string") {
        return false;
    }
    return str.substring(0, len);
}

function getUserId() {
    var userId;
    try {
        if (DataAccess.getInfo) { //广东省网用
            userId = DataAccess.getInfo("UserInfo", "account");
        }
    } catch (e) {
        userId = 0;
    }
    return userId;
}

/**
 * @description 写cookie，设置全局参数
 * @param {string} _sName 全局参数名称
 * @param {string} _sValue 全局参数名称对于的值
 */

/*Ajax对象封装*/
function AjaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
    this.url = _url || "";
    this.successCallback = _successCallback || function(_xmlHttp, _params) {};
    this.failureCallback = _failureCallback || function(_xmlHttp, _params) {};
    this.urlParameters = _urlParameters || "";
    this.callbackParams = _callbackParams || null;
    this.async = typeof(_async) == "undefined" ? true : _async;
    this.charset = _charset || null;
    this.timeout = _timeout || 8000;
    this.frequency = _frequency || 500;
    this.requestTimes = _requestTimes || 0; //请求失败后自动再次请求的次数，默认不自动再次请求
    this.frame = _frame || window;

    this.timer = -1;
    this.counter = 0;

    this.method = "GET";
    this.headers = null;
    this.username = "";
    this.password = "";
    this.abortFlag = false; //是否调用了abort接口，茁壮浏览器在调用abort后触发onreadystatechange，发送readyState为4，改变量是为了标示当前是中止导致发的4还是正常请求发的4

    this.createXmlHttpRequest = function() {
        var xmlHttp = null;
        try { //Standard
            xmlHttp = new XMLHttpRequest();
        } catch (exception) { //Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (exception) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (exception) {
                    return false;
                }
            }
        }
        return xmlHttp;
    };
    this.xmlHttp = this.createXmlHttpRequest();

    this.requestData = function(_method, _headers, _username, _password) {
        this.frame.clearTimeout(this.timer);
        this.abortFlag = false;
        this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
        this.headers = typeof(_headers) == "undefined" ? null : _headers;
        this.username = typeof(_username) == "undefined" ? "" : _username;
        this.password = typeof(_password) == "undefined" ? "" : _password;
        var target = this;
        var url;
        var data;
        this.xmlHttp.onreadystatechange = function() {
            target.stateChanged();
        };
        if (this.method == "POST") {
            url = encodeURI(this.url);
            data = this.urlParameters;
        } else {
            url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
            data = null;
        }
        if (this.username != "") {
            this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
        } else {
            this.xmlHttp.open(this.method, url, this.async);
        }
        var contentType = false;
        if (this.headers != null) {
            for (var key in this.headers) {
                if (key.toLowerCase() == "content-type") {
                    contentType = true;
                }
                this.xmlHttp.setRequestHeader(key, this.headers[key]);
            }
        }
        if (!contentType) {
            //this.xmlHttp.setRequestHeader("Content-type","application/xml");
            //this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
            this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (this.charset != null) { //要使用responseXML就不能设置此属性
            this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
        }
        this.xmlHttp.send(data);
    };
    this.stateChanged = function() { //状态处理
        if (this.xmlHttp.readyState < 2) {} else {}

        var target = this;
        if (this.xmlHttp.readyState == 1) {
            this.timer = this.frame.setTimeout(function() {
                target.checkStatus();
            }, this.timeout);
        } else if (this.xmlHttp.readyState == 4) {
            this.frame.clearTimeout(this.timer);
            if (this.abortFlag) return; //如果是因为中止导致发的4，则不继续触发成功或者失败函数
            if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0) {
                //本地测试加上|| this.xmlHttp.status == 0;
                this.success();
            } else {
                this.failed();
            }
        }
    };
    this.success = function() {
        if (this.callbackParams == null) {
            this.successCallback(this.xmlHttp);
        } else {
            this.successCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.failed = function() {
        if (this.callbackParams == null) {
            this.failureCallback(this.xmlHttp);
        } else {
            this.failureCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
        if (this.xmlHttp.readyState != 4) {
            if (this.counter < this.requestTimes) {
                this.requestAgain();
            } else {
                this.failed();
                this.requestAbort();
            }
        }
    };
    this.requestAgain = function() {
        this.requestAbort();
        var target = this;
        this.frame.clearTimeout(this.timer);
        this.timer = this.frame.setTimeout(function() {
            target.counter++;
            target.requestData(target.method, target.headers, target.username, target.password);
        }, this.frequency);
    };
    this.requestAbort = function() {
        this.frame.clearTimeout(this.timer);
        this.abortFlag = true;
        this.xmlHttp.abort();
    };
    this.addParameter = function(_json) {
        var url = this.url;
        var str = this.urlParameters;
        for (var key in _json) {
            if (url.indexOf("?") != -1) {
                url = "";
                if (str == "") {
                    str = "&" + key + "=" + _json[key];
                } else {
                    str += "&" + key + "=" + _json[key];
                }
                continue;
            }
            if (str == "") {
                str += "?";
            } else {
                str += "&";
            }
            str += key + "=" + _json[key];
        }
        this.urlParameters = str;
        return str;
    };
    this.getResponseXML = function() {
        if (this.xmlHttp.responseXML != null) {
            return this.xmlHttp.responseXML;
        } else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
            return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
        }
        return null;
    };
}