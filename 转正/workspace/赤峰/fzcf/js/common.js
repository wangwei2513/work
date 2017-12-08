var browserType = getBrowserType(); //浏览器类型
function $(id) {
    return document.getElementById(id);
}

function getUrlParam(key, url) {
    if (typeof url != "string") {
        return "";
    }
    var paramString = url.split("?")[1];
    var params = paramString.split("&");
    for (var i = 0; i < params.length; ++i) {
        var _key = params[i].split("=")[0];
        if (_key == key) {
            return params[i].split("=")[1];
        }
    }
    return "";
}



function selectionStart(assetId, providerId, serviceId, groupId, callback) {
    var config = ue.config;
    newsAjax({
        url: config.server + config.api.SelectionStart,
        type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data: {
            titleAssetId: assetId,
            serviceId: serviceId,
            //titleProviderId: providerId,
            folderAssetId: groupId,
            client: config.icNo,
            account: config.account,
            resultType: 'json'
        },
        success: function(json) {
            callback && callback(json);
        },
        error: function() {
            callback && callback([]);
        }
    });
}

function extend(target, source) {
    for (key in source) {
        target[key] = source[key];
    }
    return target;
}

function empty() {}

var accepts = {
    script: 'text/javascript, application/javascript, application/x-javascript',
    json: 'application/json',
    xml: 'application/xml, text/xml',
    html: 'text/html',
    text: 'text/plain'
};

function param(obj, sep, eq) {
    var i, arr = [],
        self = this;
    sep = sep || "&";
    eq = eq || "=";
    for (i in obj) {
        if (obj.hasOwnProperty(i) && obj[i] !== null) {
            arr.push(encodeURIComponent(i) + (obj[i] === "" ? "" : eq + encodeURIComponent(obj[i])));
        }
    }
    return arr.join(sep);
}

function appendQuery(url, query) {
    if (query === '') return url;
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

function newsAjax(options) {

    var settings = extend({
        type: 'GET',
        url: '',
        data: null,
        success: empty,
        error: empty,
        complete: empty,
        timeout: 0,
        cache: true,
        dataType: 'text',
        headers: null,
        async: true
    }, options || {});
    var abortTimeout,
        dataType = settings.dataType,
        //  hasPlaceholder = /\?.+=\?/.test(settings.url),
        mime = accepts[dataType],
        headers = {},
        setHeader = function(name, value) {
            headers[name.toLowerCase()] = [name, value];
        },
        xhr = new window.XMLHttpRequest(),
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        nativeSetHeader = xhr.setRequestHeader;

    if ((mime = settings.mimeType || mime)) {
        if (mime.indexOf(',') > -1) {
            mime = mime.split(',', 2)[0];
        }
        xhr.overrideMimeType && xhr.overrideMimeType(mime);
    }

    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')) {
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
    }

    if (settings.headers) {
        for (name in settings.headers) {
            setHeader(name, settings.headers[name]);
        }
    }


    if (typeof settings.data === 'object') {
        settings.data = param(settings.data);
    }

    if (settings.data && settings.type.toUpperCase() == 'GET') {
        settings.url = appendQuery(settings.url, settings.data);
        //delete settings.data;
    }

    if (settings.cache === false) {
        settings.url = appendQuery(settings.url, '_=' + (new Date()).getTime());
    }

    xhr.setRequestHeader = setHeader;

    xhr.onreadystatechange = function() {
        // iDebug("url:" + settings.url + "readyState:"+xhr.readyState);
        if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty;
            clearTimeout(abortTimeout);
            var result, error = false;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status === 0 && protocol == 'file:')) {

                dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                result = xhr.responseText;
                try {
                    // http://perfectionkills.com/global-eval-what-are-the-options/
                    if (dataType == 'script') {
                        eval(result + '');
                    } else if (dataType == 'xml') {
                        result = xhr.responseXML;
                    } else if (dataType == 'json') {
                        result = JSON.parse(result);
                    }
                } catch (err) {
                    error = err;
                }

                if (error) {
                    settings.error(error, 'parsererror', xhr, settings);
                } else {
                    settings.success(result, xhr, settings);
                }
                settings.complete(xhr.status, xhr, settings);

            } else {
                settings.error(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
                settings.complete(xhr.status, xhr, settings);
            }
        }

    };

    if (settings.timeout > 0) {
        abortTimeout = setTimeout(function() {
            xhr.onreadystatechange = empty;
            xhr.abort();
            settings.error(null, 'timeout', xhr, settings);
        }, settings.timeout);
    }

    xhr.open(settings.type, settings.url, settings.async, '', '');
    for (name in headers) {
        nativeSetHeader.apply(xhr, headers[name]);
    }


    try {
        xhr.send(settings.data ? settings.data : null);
    } catch (err) {}


    return xhr;

}

function getItemData(assetId, providerId, callback) {
    var config = ue.config;
    newsAjax({
        url: config.server + config.api.GetItemData,
        type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data: {
            client: config.icNo,
            account: config.account,
            titleAssetId: assetId,
            //titleProviderId: providerId,
            resultType: 'json'
        },
        success: function(json) {
            callback && callback(json);
        },
        error: function() {
            callback && callback([]);
        }
    });
}
//获取浏览器版本
function getBrowserType() {
    var ua = navigator.userAgent.toLowerCase();
    return /ipanel/.test(ua) ? 'iPanel' :
        /enrich/.test(ua) ? 'EVM' :
        /wobox/.test(ua) ? 'Inspur' :
        window.ActiveXObject ? 'IE' :
        document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox' :
        window.openDatabase && !/chrome/.test(ua) ? 'Safari' :
        /opr/.test(ua) ? 'Opera' :
        window.MessageEvent && !document.getBoxObjectFor ? 'Chrome' :
        '';
}

var mySessionStorage = new globalVar();

function globalVar() {
    this.getItem = function(_str) {
        var val = "";
        if (browserType == "iPanel") {
            val = iPanel.getGlobalVar(_str);
        } else {
            val = sessionStorage.getItem(_str);
        }
        if (val == "" || val == null || val == "undefined") val = "";
        return val;
    };
    this.removeItem = function(_str) {
        if (browserType == "iPanel") {
            iPanel.delGlobalVar(_str);
        } else {
            sessionStorage.removeItem(_str);
        }
    }
    this.setItem = function(_key, _val) {
        if (browserType == "iPanel") {
            iPanel.setGlobalVar(_key, _val);
        } else {
            sessionStorage.setItem(_key, _val);
        }
    }
}

function sendAjax(url, data, callback, charset, type) {
    var xmlhttp;
    var isAsync = type ? true : false;
    xmlhttp = new XMLHttpRequest();
    if (typeof charset !== 'undefined') {
        xmlhttp.overrideMimeType("text/html; charset=" + charset);
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            console.log("url:------" + url + "readyState:------" + xmlhttp.readyState);
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
        if (this.xmlHttp.readyState < 2) {
            console.log(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ",this.url=" + this.url);
        } else {
            console.log(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + ",this.abortFlag=" + this.abortFlag + ",this.url=" + this.url);
        }

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