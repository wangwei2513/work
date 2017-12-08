/**
 * AJAXģ��ķ�װ   
*/
function AJAX_OBJ(_url, _successCallback, _failureCallback, _completeCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
    /**
     * AJAXͨ��GET��POST�ķ�ʽ�����첽��ͬ����������
     * ע�⣺
     *  1��������240 No Content�Ǳ�HTTP��׼��Ϊ����ɹ���
     *  2��Ҫʹ��responseXML�Ͳ�������_charset����Ҫֱ�Ӵ���null
     *  3��_frame������ʵ�����������ҳ������뾡����֤׼ȷ������������Խ��͵��쳣
     */
    /**
     * @param{string} _url: ����·��
     * @param{function} _successCallback: ����ɹ���ִ�еĻص���������һ������������չһ������new XMLHttpRequest()�ķ���ֵ
     * @param{function} _failureCallback: ����ʧ��/��ʱ��ִ�еĻص�����������ͬ�ɹ��ص�������.status��.statusText
     * @param{string} _urlParameters: ����·������Ҫ���ݵ�url����/����
     * @param{*} _callbackParams: �������ʱ�ڻص������д���Ĳ������Զ�������
     * @param{boolean} _async: �Ƿ��첽���ã�Ĭ��Ϊtrue���첽��false��ͬ��
     * @param{string} _charset: ���󷵻ص����ݵı����ʽ������iPanel�������IE6��֧�֣���Ҫ����XML����ʱ����ʹ��
     * @param{number} _timeout: ÿ�η��������೤ʱ����û�гɹ�����������Ϊ����ʧ�ܶ��������󣨳�ʱ��
     * @param{number} _frequency: ����ʧ�ܺ���೤ʱ����������һ��
     * @param{number} _requestTimes: ����ʧ�ܺ�����������ٴ�
     * @param{object} _frame: ���������Ҫ�ϸ���ƣ�������п��ܳ���ҳ���Ѿ������٣��ص���ִ�е����
     */
    this.url = _url || "";
    this.successCallback = _successCallback || function(_xmlHttp, _params) {
        //iDebug("[xmlHttp] responseText: " + _xmlHttp.responseText);
    };
    this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
        //iDebug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
    };
    this.completeCallback = _completeCallback || function(_xmlHttp, _params) {
        //iDebug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
    };
    this.urlParameters = _urlParameters || "";
    this.callbackParams = _callbackParams || null;
    this.async = typeof(_async) == "undefined" ? true : _async;
    this.charset = _charset || null;
    this.timeout = _timeout || 30000; //30s
    this.frequency = _frequency || 5000; //5s
    this.requestTimes = _requestTimes || 3;
    this.frame = _frame || window;

    this.timer = -1;
    this.counter = 0;

    this.method = "GET";
    this.headers = null;
    this.username = "";
    this.password = "";

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
        /**
         * @param{string} _method: �������ݵķ�ʽ��POST/GET
         * @param{string} _headers: �������ݵ�ͷ��Ϣ��json��ʽ
         * @param{string} _username: ��������Ҫ��֤ʱ���û���
         * @param{string} _password: ��������Ҫ��֤ʱ���û�����
         */
        this.frame.clearTimeout(this.timer);
        this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
        this.headers = typeof(_headers) == "undefined" ? null : _headers;
        this.username = typeof(_username) == "undefined" ? "" : _username;
        this.password = typeof(_password) == "undefined" ? "" : _password;

        var target = this;
        var data = null;
        this.xmlHttp.onreadystatechange = function() {
            target.stateChanged();
        };
        //iDebug("zhangjj [xmlHttp] this.method = "+this.method);
        if (this.method == "POST") { //encodeURIComponent
            var url = encodeURI(this.url);
            data = this.urlParameters;
            //iDebug("zhangjj requestData data = "+ data);
        } else {
            //var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
            var url = this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters);
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
            this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (this.charset != null) { //Ҫʹ��responseXML�Ͳ������ô�����
            this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
        }
        //iDebug("zhangjj xmlHttp.send(): " + this.method + " url: " + url + ", data: " + data);
        this.xmlHttp.send(data);
        this.timer = this.frame.setTimeout(function() {
            target.checkStatus();
        }, this.timeout);
    };
    
    this.stateChanged = function() { //״̬����
        if (this.xmlHttp.readyState < 2) {
            //iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
        } else {
            //iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
        }

        var target = this;
        if (this.xmlHttp.readyState == 2) {
            /*this.timer = this.frame.setTimeout(function() {
                target.checkStatus();
            }, this.timeout);*/
        } else if (this.xmlHttp.readyState == 3) {
            if (this.xmlHttp.status == 401) {
                //iDebug("[xmlHttp] Authentication, need correct username and pasword");
            }
        } else if (this.xmlHttp.readyState == 4) {
            //iDebug("zhangjj [xmlHttp] readyState = 4");
            this.frame.clearTimeout(this.timer);
            if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
                this.success();
            } else {
                this.failed();
            }
            this.complete();
        }
    };
    this.success = function() {
        //���ε����صĿ�����
        if (!this.xmlHttp.responseText) return;
        
        //���ж��Ƿ��Ǽ�Ȩʧ�ܣ�
        var res = eval("("+this.xmlHttp.responseText+")");
        
        //�ǵ�¼�ӿڵ�9021��9022����Ҫ��ת����¼��ҳ
        if ((res.ret == 9021 || res.ret == 9022) && this.url.indexOf("/account/login") == -1) {
            this.iDebug("9021---url="+this.url+"---result="+this.xmlHttp.responseText);
            
            if (navigator.appName.indexOf("iPanel") != -1) {
                if (iPanel.eventFrame.showDialogTimes == 0) {
                    iPanel.eventFrame.showDialogTimes = 1;
                    iPanel.eventFrame.showdialog("�����µ�¼��");
                    
                    //�յ�9021��9022������ʱ��������е�token
                    iPanel.misc.setGlobal(iPanel.eventFrame.da_id+"_token", "");
                    iPanel.misc.save();
                    
                    setTimeout(function () {
                        iPanel.eventFrame.showDialogTimes = 0;
                        
                        if(typeof top.httpInstance != "undefined" && top.httpInstance != null){
                            top.httpInstance.stop(1);
                            top.httpInstance.close();
                        }
                        
                        if (typeof gotoPage != "undefined") {
                            gotoPage(webclient+"/application/account/loginIndex.htm");
                        } else {
                            window.location.href = webclient+"/application/account/loginIndex.htm";
                        }
                    }, 1500);
                }
            }
        } else {
            if (this.callbackParams == null) {
                this.successCallback(this.xmlHttp, res);
            } else {
                this.successCallback(this.xmlHttp, this.callbackParams);
            }
            this.counter = 0;
        }
    };
    this.failed = function() {
        if (this.callbackParams == null) {
            this.failureCallback(this.xmlHttp);
        } else {
            this.failureCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.complete = function() {
        if (this.callbackParams == null) {
            this.completeCallback(this.xmlHttp);
        } else {
            this.completeCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.checkStatus = function() { //��ʱ����ָ��ʱ����û�гɹ�������Ϣ����ʧ�ܴ���
        if (this.xmlHttp.readyState != 4) {
            if (this.counter < this.requestTimes) {
                //iDebug("zhangjj [xmlHttp] requestAgain");
                this.requestAgain();
            } else {
                //iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
                this.failed();
                this.complete();
                this.requestAbort();
            }
        }
    };
    this.requestAgain = function() {
        this.requestAbort();
        var target = this;
        this.frame.clearTimeout(this.timer);
        this.timer = this.frame.setTimeout(function() {
            //iDebug("[xmlHttp] request again");
            target.counter++;
            target.requestData(target.method, target.headers, target.username, target.password);
        }, this.frequency);
    };
    this.requestAbort = function() {
        //iDebug("[xmlHttp] call abort");
        this.frame.clearTimeout(this.timer);
        this.xmlHttp.abort();
    };
    this.addParameter = function(_json) {
        /**
         * @param{object} _json: ���ݵĲ������ݴ���ֻ֧��json��ʽ
         */
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
    this.getResponseXML = function() { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
        if (this.xmlHttp.responseXML != null) {
            return this.xmlHttp.responseXML;
        } else if (this.xmlHttp.responseText.indexOf("<\?xml") != -1) {
            return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
        }
        return null;
    };
    this.iDebug = function (str) {
        if(navigator.appName.indexOf("iPanel") != -1){
            iPanel.debug(str);  //����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
        }else if(navigator.appName.indexOf("Opera") != -1){
            opera.postError(str);
        }else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
            console.log(str);
        }
    }
}
