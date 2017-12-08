var Event = {
    mapping: function(keycode) {
        var code = "";
        var name = "";
        var args = {};

        if (keycode < 58 && keycode > 47) { //���ּ�
            args = { value: (keycode - 48), type: 0, isGlobal: false };
            code = "KEY_NUMERIC";
            name = "����";
        } else {
            var args = { value: keycode, type: 0, isGlobal: false };
            switch (keycode) {
                case 1: //up
                case 38:
                    code = "KEY_UP";
                    name = "��";
                    break;
                case 2: //down
                case 40:
                    code = "KEY_DOWN";
                    name = "��";
                    break;
                case 3: //left
                case 37:
                    code = "KEY_LEFT";
                    name = "��";
                    break;
                case 4: //right
                case 39:
                    code = "KEY_RIGHT";
                    name = "��";
                    break;
                case 13: //enter
                    code = "KEY_SELECT";
                    name = "ȷ��";
                    break;
                case 27:
                case 339: //exit
                    code = "KEY_EXIT";
                    name = "�˳�";
                    break;
                case 8:
                case 340: //back
                    code = "KEY_BACK";
                    name = "����";
                    break;
                case 512:
                    code = "KEY_HOMEPAGE";
                    name = "��ҳ";
                    break;
                case 513:
                    code = "KEY_MENU";
                    name = "�˵�";
                    args.type = 1;
                    break;
                case 9991:
                    code = "EIS_SOCKET_BOUGHT_MESSAGE";
            }
        }
        return { code: code, args: args, name: name };
    }

};

function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
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