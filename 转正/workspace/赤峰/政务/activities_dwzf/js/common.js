/*----------------------------------------------------------------键值映射----------------------------------------------------------------------*/
var Event = {
  mapping: function (__event) {
    __event = __event || event;
    var keycode = __event.which || __event.keyCode; //alert(keycode);
    iDebug("global.js keycode = " + keycode);
    var code = "";
    var args = {};
    //if(keycode < 327 && keycode > 336){//数码盒子的键值
    if (keycode < 58 && keycode > 47) { //数字键
      args = {
        modifiers: __event.modifiers,
        value: (keycode - 48),
        type: 0,
        isGlobal: false
      };
      //iPanel.debug("global.js_Event_code_args.value=="+args.value);
      code = "KEY_NUMERIC";
    } else {
      var args = {
        modifiers: __event.modifiers,
        value: keycode,
        type: 0,
        isGlobal: false
      };
      switch (keycode) {
        case 1:
        case 38:
        case 87:
          code = "KEY_UP";
          break;
        case 2:
        case 40:
        case 83:
          code = "KEY_DOWN";
          break;
        case 3:
        case 37:
        case 65:
        case 97:
          code = "KEY_LEFT";
          break;
        case 4:
        case 39:
        case 68:
        case 100:
          code = "KEY_RIGHT";
          break;
        case 13:
          code = "KEY_SELECT";
          break;
        case 339: //默认流下去给UI中的eventpage处理退出双向，在本应用中，如果要用到则需要return 0;截掉
        case 27:
          code = "KEY_EXIT";
          args.type = 1;
          break;
        case 340: //默认流下去，在本应用中，如果要用到则需要return 0;截掉
        case 283:
        case 8:
          code = "KEY_BACK";
          break;
        case 832:
        case 320:
          code = "KEY_RED";
          args.type = 1;
          break;
        case 45: //音量减
          code = "KEY_VOLUME_UP";
          break;
        case 61: //音量加
          code = "KEY_VOLUME_DOWN";
          break;
        case 835: //blue
        case 323:
          code = "KEY_BLUE";
          break;
        case 322:
          code = "KEY_YELLOW";
          args.type = 1;
          break;
        case 833:
          code = "KEY_GREEN";
          break;
        case 372:
        case 290:
        case 306:
        case 33:
          code = "KEY_PAGE_UP";
          break;
        case 373:
        case 291:
        case 307:
        case 34:
          code = "KEY_PAGE_DOWN";
          break;
        case 67:
        case 99:
          code = "KEY_MUTE";
          break;
        case 72: //默认流下去，在本应用中，如果要用到则需要return 0;截掉
        case 104:
          code = "KEY_HOMEPAGE";
          args.type = 1;
          break;
        case 513: //默认流下去，在本应用中，如果要用到则需要return 0;截掉
        case 104:
          code = "KEY_MENU";
          args.type = 1;
          break;
        case 10909:
          code = "NGOD_C1_ANNOUNCE";
          break;
        case 5500:
        case 12057:
          code = "IP_NETWORK_CONNECT";
          break;
        case 5501:
        case 12056:
          code = "IP_NETWORK_DISCONNECT";
          break;
        case 5502:
        case 12059:
          code = "IP_NETWORK_READY";
          break;
        case 5503:
        case 12058:
          code = "IP_NETWORK_FAILED";
          break;
        case 5551:
        case 10002:
          code = "CABLE_CONNECT_FAILED";
          break;
        case 5550:
        case 10001:
          code = "CABLE_CONNECT_SUCCESS";
          break;
        case 13001:
          code = "MSG_MEDIA_URL_VALID";
          break;
        case 13002:
          code = "MSG_MEDIA_URL_INVALID";
          break;
        case 13003:
          code = "MSG_MEDIA_PLAY_SUCCESS";
          break;
        case 13004:
          code = "MSG_MEDIA_PLAY_FAILED";
          break;
        case 13005:
          code = "MSG_MEDIA_SETPACE_SUCCESS";
          break;
        case 13006:
          code = "MSG_MEDIA_SETPACE_FAILED";
          break;
        case 13007:
          code = "MSG_MEDIA_SEEK_SUCCESS";
          break;
        case 13008:
          code = "MSG_MEDIA_SEEK_FAILED";
          break;
        case 13009:
          code = "MSG_MEDIA_PAUSE_SUCCESS";
          break;
        case 13010:
          code = "MSG_MEDIA_PAUSE_FAILED";
          break;
        case 13011:
          code = "MSG_MEDIA_RESUME_SUCCESS";
          break;
        case 13012:
          code = "MSG_MEDIA_RESUME_FAILED";
          break;
        case 13013:
          code = "MSG_MEDIA_STOP_SUCCESS";
          break;
        case 13014:
          code = "MSG_MEDIA_STOP_FAILED";
          break;
        default:
          code = "OTHER_EVENT";
          args.type = 1;
          break;
      }
    }
    return {
      code: code,
      args: args
    };
  }
};

var tmpAgent = navigator.userAgent.toLowerCase();
if (tmpAgent.indexOf("android") > -1) {
  tmpAgent = "android"; //android
} else if (tmpAgent.indexOf("coship") > -1) {
  tmpAgent = 'coship'; //同洲
} else if (tmpAgent.indexOf('hi3110') > -1 || tmpAgent.indexOf('i686') > -1) {
  tmpAgent = 'huawei'; //华为
} else if (tmpAgent.indexOf('ipad') > -1) {
  tmpAgent = 'suma_vision'; //数码视讯
} else if (tmpAgent.indexOf('gefo') > -1) {
  tmpAgent = 'cntv'; //CNTV
} else if (tmpAgent.indexOf('ipanel') > -1) {
  tmpAgent = 'ipanel'; //茁壮
} else if (tmpAgent.indexOf('firefox') > -1) {
  tmpAgent = 'dvn'; //天柏
} else {
  tmpAgent = 'suma_vision'; //默认数码视讯
}
switch (tmpAgent) {
  case 'coship':
  case 'huawei':
    document.onkeypress = function () {
      return eventHandler(Event.mapping(event), 1);
    };
    break;
  case 'ipanel':
  case 'suma_vision': //用google浏览器跑，获取到的是suma_vision
    //document.onkeypress = function () {console.log("onkeypress");return eventHandler(Event.mapping(event), 1);};//google跑触发事件是onkeydown
    document.onkeydown = function () {
      return eventHandler(Event.mapping(event), 1);
    };
    document.onirkeypress = function () {
      return eventHandler(Event.mapping(event), 1);
    };
    document.onsystemevent = function () {
      return eventHandler(Event.mapping(event), 2);
    };
    break;
  case 'cntv':
  case 'dvn':
    document.onkeydown = function () {
      return eventHandler(Event.mapping(event), 1);
    };
    break;
  default:
    document.onkeydown = function () {
      return eventHandler(Event.mapping(event), 1);
    };
    break;
}


function $(id) {
  return document.getElementById(id);
}

function List(listLen, dataSize, focusDiv, focusPos) {
  this.focusDiv = focusDiv || "focusDiv";
  this.dataSize = dataSize;
  this.listLen = listLen;
  this.listData = [];
  this.position = 0;
  this.currFocus = 0;
  this.focusPos = focusPos;
  this.haveData = function () {};
  this.noData = function () {};
}

List.prototype = {
  initList: function (startPos) {
    var shift = startPos || 0;
    for (var i = 0; i < this.listLen; ++i) {
      this.listData[i] = shift + i;
    }
  },
  initContent: function () {
    for (var i = 0; i < this.listLen; ++i) {
      if (this.listData[i] < this.dataSize) {
        this.haveData({
          idPos: i,
          dataPos: this.listData[i]
        });
      } else {
        this.noData({
          idPos: i
        });
      }
    }
  },
  changeFocus: function (num, type) {
    if (type == 0) {
      var tempEnd = Math.min(this.dataSize, this.listLen);
      this.currFocus = this.currFocus + num < 0 ? this.currFocus : (this.currFocus + num < tempEnd ? this.currFocus + num : tempEnd - 1);

      this.position = this.position + num < 0 ? this.position : (this.position + num < this.dataSize ? this.position + num : this.dataSize - 1);
      if (this.position < this.listData[0]) {
        this.initList(this.position);
        this.initContent();
      } else if (this.position > this.listData[this.listLen - 1]) {
        this.initList(this.position - this.listLen + 1);
        this.initContent();
      }
    } else if (type == 1) {
      var tempEnd = Math.min(this.dataSize, this.listLen);
      this.position = this.position + num < 0 ? this.position : (this.position + num < this.dataSize ? this.position + num : this.dataSize - 1);
      this.currFocus = this.position % this.listLen;
      if (this.position < this.listData[0]) {
        this.initList(this.position - this.listLen + 1);
        this.initContent();
      } else if (this.position > this.listData[this.listLen - 1]) {
        this.initList(this.position);
        this.initContent();
      }
    }


    if (this.focusPos[0]) {
      if (this.focusPos[this.currFocus].width) {
        $(this.focusDiv).style.width = this.focusPos[this.currFocus].width;
        $(this.focusDiv).style.height = this.focusPos[this.currFocus].height;
      }
      $(this.focusDiv).style.top = this.focusPos[this.currFocus].top;
      $(this.focusDiv).style.left = this.focusPos[this.currFocus].left;
    } else {
      $(this.focusDiv).style[this.focusPos.direction] = (this.focusPos.startPos + this.currFocus * this.focusPos.step) + "px";
    }


  }
}

function ScrollBox() {
  this.position = 0;
  this.scrollTimer = -1;
  this.scrollTimer1 = -2;
  this.scrollImgPos = 0;
}

ScrollBox.prototype = {
  init: function (data, maxSize, scrollImgArr, textBox, pointBox, pointImg) {
    this.data = data;
    this.maxSize = maxSize;
    this.imgBox = scrollImgArr;
    this.textBox = textBox;
    this.pointBox = pointBox;
    this.pointImg = pointImg;
    var pointHtml = "";
    for (var i = 0; i < maxSize; ++i) {
      pointHtml += '<img id="point' + i + '" src="' + pointImg.blur + '" width="10" height="11" />';
    }
    pointBox.innerHTML = pointHtml;
    var posRight = pointBox.offsetWidth;
    pointBox.style.right = "20px";
    this.imgBox[0].src = this.data[this.position].imgUrl;
    this.imgBox[1].src = this.data[(this.position + 1) % this.maxSize].imgUrl;
  },
  start: function () {

    clearTimeout(this.scrollTimer);
    this.setPointFocus();
    this.setData();
    var that = this;
    this.scrollTimer = setTimeout(function () {
      that.losePointFocus();
      that.position = (that.position + 1) % that.maxSize;
      that.scrollImgPos = that.scrollImgPos ? 0 : 1;
      that.setData();
      that.scroll();
      that.start();
    }, 5000);
  },
  stop: function () {

  },
  setData: function () {
    this.textBox.innerText = this.data[this.position].text;
  },
  scroll: function () {
    var that = this;
    this.scrollTimer1 = setTimeout(function () {

      var left = that.imgBox[that.scrollImgPos].offsetLeft;
      left -= 15;
      if (left <= 0) {
        that.imgBox[that.scrollImgPos].style.left = "0px";
        that.imgBox[that.scrollImgPos ? 0 : 1].style.left = "562px";
        that.imgBox[that.scrollImgPos ? 0 : 1].src = that.data[(that.position + 1) % that.maxSize].imgUrl;
        clearTimeout(that.scrollTimer1);
        clearTimeout(that.scrollTimer);
        that.start();
      } else {
        that.imgBox[that.scrollImgPos].style.left = left + "px";
        that.imgBox[that.scrollImgPos ? 0 : 1].style.left = (left - 562) + "px";
        clearTimeout(that.scrollTimer);
        that.scroll();
      }

    }, 20);
  },
  losePointFocus: function () {
    $("point" + this.position).src = this.pointImg.blur;
  },
  setPointFocus: function () {
    $("point" + this.position).src = this.pointImg.focus;
  }

}

function Clock() {
  this.nowTime = "";
  this.timer = -2;
}

Clock.prototype = {
  bind: function (ele) {
    this.element = ele;
  },
  start: function () {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    this.nowTime = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    this.element.innerText = this.nowTime;
    clearTimeout(this.timer);
    var that = this;
    this.timer = setTimeout(function () {
      that.start();
    }, 60000);
  }
}

function iDebug(_str) {
  if (navigator.appName.indexOf("iPanel") > -1) {
    iPanel.debug(_str);
  } else if (navigator.appName.indexOf("Netscape") > -1 || navigator.appName.indexOf("Google") > -1) {
    console.log(_str);
  } else if (navigator.appName.indexOf("Opera") > -1) {
    opera.postError(_str);
  }
}

function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
  /**
   * AJAX通过GET或POST的方式进行异步或同步请求数据
   * 注意：
   * 	1、服务器240 No Content是被HTTP标准视为请求成功的
   * 	2、要使用responseXML就不能设置_charset，需要直接传入null
   * 	3、_frame，就是实例化本对象的页面对象，请尽量保证准确，避免出现难以解释的异常
   */
  /**
   * @param{string} _url: 请求路径
   * @param{function} _successCallback: 请求成功后执行的回调函数，带一个参数（可扩展一个）：new XMLHttpRequest()的返回值
   * @param{function} _failureCallback: 请求失败/超时后执行的回调函数，参数同成功回调，常用.status，.statusText
   * @param{string} _urlParameters: 请求路径所需要传递的url参数/数据
   * @param{*} _callbackParams: 请求结束时在回调函数中传入的参数，自定义内容
   * @param{boolean} _async: 是否异步调用，默认为true：异步，false：同步
   * @param{string} _charset: 请求返回的数据的编码格式，部分iPanel浏览器和IE6不支持，需要返回XML对象时不能使用
   * @param{number} _timeout: 每次发出请求后多长时间内没有成功返回数据视为请求失败而结束请求（超时）
   * @param{number} _frequency: 请求失败后隔多长时间重新请求一次
   * @param{number} _requestTimes: 请求失败后重新请求多少次
   * @param{object} _frame: 窗体对象，需要严格控制，否则会有可能出现页面已经被销毁，回调还执行的情况
   */
  this.url = _url || "";
  this.successCallback = _successCallback || function (_xmlHttp, _params) {
    //iPanel.debug("[xmlHttp] responseText: " + _xmlHttp.responseText);
  };
  this.failureCallback = _failureCallback || function (_xmlHttp, _params) {
    //iPanel.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
  };
  this.urlParameters = _urlParameters || "";
  this.callbackParams = _callbackParams || null;
  this.async = typeof (_async) == "undefined" ? false : _async;
  this.charset = _charset || "gbk";
  this.timeout = _timeout || 30000; //15s
  this.frequency = _frequency || 10000; //10s
  this.requestTimes = _requestTimes || 0;
  this.frame = _frame || window;

  this.timer = -1;
  this.counter = 0;

  this.method = "GET";
  this.headers = null;
  this.username = "";
  this.password = "";

  this.checkTimeout = 500;
  this.checkTimer = -1;
  this.checkCount = -1;

  this.successTime = 0;
  this.createXmlHttpRequest = function () {
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

  this.requestData = function (_method, _headers, _username, _password) {
    /**
     * @param{string} _method: 传递数据的方式，POST/GET
     * @param{string} _headers: 传递数据的头信息，json格式
     * @param{string} _username: 服务器需要认证时的用户名
     * @param{string} _password: 服务器需要认证时的用户密码
     */
    this.xmlHttp = this.createXmlHttpRequest();
    this.frame.clearTimeout(this.timer);
    this.method = typeof (_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
    this.headers = typeof (_headers) == "undefined" ? null : _headers;
    this.username = typeof (_username) == "undefined" ? "" : _username;
    this.password = typeof (_password) == "undefined" ? "" : _password;

    var target = this;
    this.xmlHttp.onreadystatechange = function () {
      target.stateChanged();
    };
    if (this.method == "POST") { //encodeURIComponent
      var url = this.url;
      var data = this.urlParameters;
    } else {
      //var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
      var url = this.url;
      //iPanel.debug("[xm] xmlHttp get url00="+url);
      var data = null;
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
    if (this.charset != null) { //要使用responseXML就不能设置此属性
      this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
    }
    //iPanel.debug("[xmlHttp] requestData " + this.method + " url: " + url + ", data: " + data);
    this.xmlHttp.send(data);
    this.checkReadyState();
    this.timer = this.frame.setTimeout(function () {
      target.checkStatus();
    }, this.timeout);
  };
  this.checkReadyState = function () {
    var target = this;
    this.frame.clearTimeout(this.checkTimer);
    this.checkTimer = this.frame.setTimeout(function () {
      //iPanel.debug("global checkReadyState target.xmlHttp.readyState="+target.xmlHttp.readyState);
      //iPanel.debug("global checkReadyState target.xmlHttp.status="+target.xmlHttp.status);
      if (target.xmlHttp.readyState == 4 && target.xmlHttp.status == 200) {
        target.stateChanged();
      } else {
        target.checkCount++;
        if ((target.checkCount * target.checkTimeout) >= target.timeout) {
          target.checkStatus();
        } else {
          target.checkReadyState();
        }
      }
    }, this.checkTimeout);
  };
  this.stateChanged = function () { //状态处理
    //iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
    if (this.xmlHttp.readyState < 2) {

    } else {
      //iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
    }

    var target = this;
    if (this.xmlHttp.readyState == 2) {
      /*this.timer = this.frame.setTimeout(function() {
      		target.checkStatus();
      	}, this.timeout); */
    } else if (this.xmlHttp.readyState == 3) {
      if (this.xmlHttp.status == 401) {
        //iPanel.debug("[xmlHttp] Authentication, need correct username and pasword");
      }
    } else if (this.xmlHttp.readyState == 4) {
      this.frame.clearTimeout(this.timer);
      this.frame.clearTimeout(this.checkTimer);
      if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0) {
        //iPanel.debug("[xmlHttp] this.xmlHttp.resposeText=" + this.xmlHttp.responseText);
        this.success();
      }
      /*else if(this.xmlHttp.status == 0){
      	iPanel.debug("global_stateChanged_this.xmlHttp.status==0--一般为0的状态是库里发的");
      }*/
      else {
        //iPanel.debug("global_stateChanged_this.xmlHttp.status=="+this.xmlHttp.status);
        this.failed();
      }
    }
  };
  this.success = function () {

    if (this.successTime == 0) {
      this.successTime++;
      this.checkCount = -1;
      this.frame.clearTimeout(this.checkTimer);
      if (this.callbackParams == null) {
        this.successCallback(this.xmlHttp);
      } else {
        this.successCallback(this.xmlHttp, this.callbackParams);
      }
      this.counter = 0;
    }

  };
  this.failed = function () {
    this.checkCount = -1;
    this.frame.clearTimeout(this.checkTimer);
    if (this.callbackParams == null) {
      this.failureCallback(this.xmlHttp);
    } else {
      this.failureCallback(this.xmlHttp, this.callbackParams);
    }
    this.counter = 0;
  };
  this.checkStatus = function () { //超时处理，指定时间内没有成功返回信息按照失败处理
    if (this.xmlHttp.readyState != 4) {
      if (this.counter < this.requestTimes) {
        this.requestAgain();
      } else {
        this.failed();
        this.requestAbort();
      }
    }
  };
  this.requestAgain = function () {
    this.requestAbort();
    var target = this;
    this.frame.clearTimeout(this.timer);
    this.timer = this.frame.setTimeout(function () {
      target.counter++;
      target.requestData(target.method, target.headers, target.username, target.password);
    }, this.frequency);
  };
  this.requestAbort = function () {
    this.checkCount = -1;
    this.frame.clearTimeout(this.timer);
    this.frame.clearTimeout(this.checkTimer);
    //iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp="+typeof this.xmlHttp);
    //iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp.abort="+typeof this.xmlHttp.abort);
    //abort()方法可以停止一个XMLHttpRequest对象对HTTP的请求，把该对象恢复到初始状态
    this.xmlHttp.abort();
  };
  this.addParameter = function (_json) {
    /**
     * @param{object} _json: 传递的参数数据处理，只支持json格式
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
  this.getResponseXML = function () { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
    if (this.xmlHttp.responseXML != null) {
      return this.xmlHttp.responseXML;
    } else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
      return typeof (DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
    }
    return null;
  };
}

function getUrlParam(name) {
  var search = window.location.search.substring(1);
  var arr = search.split("&");
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i].split("=")[0] == name) {
      return arr[i].split("=")[1];
    }
  }
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
var IPANEL30 = checkIPANEL30(); //是否为ipanel 3.0的浏览器

/*全局变量封装（兼容ipanel3.0和其它浏览器）*/
var mySessionStorage = new globalVar();

function globalVar() {
  this.getItem = function (_str) {
    var val = "";
    if (IPANEL30) {
      val = iPanel.getGlobalVar(_str);
    } else {
      val = sessionStorage.getItem(_str);
    }
    if (val == "" || val == null || val == "undefined") val = "";
    return val;
  };
  this.removeItem = function (_str) {
    if (IPANEL30) {
      iPanel.delGlobalVar(_str);
    } else {
      sessionStorage.removeItem(_str);
    }
  }
  this.setItem = function (_key, _val) {
    if (IPANEL30) {
      iPanel.setGlobalVar(_key, _val);
    } else {
      sessionStorage.setItem(_key, _val);
    }
  }
}


function registerKeyEvent() {
  if (typeof DRMPlayer != "undefined") { //如果是安卓apk跑的，需要支持回调
    DRMPlayer.setKeyEventCallback('keyCallback');
  }
}

/**注册安卓盒子的返回按键问题**/
function keyCallback(json) {
  var jsonObj = eval("(" + json + ")");
  if (jsonObj.code == 4 && jsonObj.action == "1") {
    goBack();
  }
}

registerKeyEvent();

function playVideo(url) {
  var content = '{"url":"' + url + '"}';
  if (typeof DRMPlayer != "undefined" && DRMPlayer != null) {
    DRMPlayer.setCallback('eventCallback');
    DRMPlayer.setDisplay('{"x":0, "y":0, "w":1280, "h":720}');
    DRMPlayer.open(content);
  }
  setTimeout(function () {
    if (typeof DRMPlayer != "undefined" && DRMPlayer != null) {
      var openFlag = DRMPlayer.isOpen();
      iDebug("openFlag==" + openFlag);
    }
  }, 2000);
}

function eventCallback(json) {
  DRMPlayer.log(json);
  var jsonObj = eval("(" + json + ")");
  iDebug("eventCallback type = " + jsonObj.type);
  if (jsonObj.type == 2) {
    var content = '{"url":"' + testUrl + '"}';
    DRMPlayer.open(content);
  }
}

/******************************获取剧集信息*********************
_id： 剧集id
_listLabel:所属栏目id
***************************************************************/
function getSeriseInfo(_id, _listLabel) {
  if (ajaxObjSeries == null) {
    ajaxObjSeries = new ajaxClass()
    ajaxObjSeries.frame = window
  } else {
    ajaxObjSeries.requestAbort()
  }
  ajaxObjSeries.frequency = 1000; // 请求失败后隔多长时间重新请求一次 
  ajaxObjSeries.requestTimes = 1; // 请求失败后重新请求多少次
  ajaxObjSeries.successCallback = function (_xmlHttp, _params) {
    iDebug('yanch getSeriseInfo success')
    var jsonData = _xmlHttp.responseText
    var result_data_info = eval('(' + jsonData + ')')
    showSeriesPop(result_data_info, _id, _listLabel)
  }
  ajaxObjSeries.failureCallback = function (_xmlHttp, _params) {
    iDebug('yanch getSeriseInfo fail')
  }
  // 修改字段名称
  ajaxObjSeries.url = [slaveAddr + '/media/series/get_info?accesstoken=' + access_token + '&pageidx=1&pagenum=200&postersize=320x400|500x280&&seriesid=' + _id, 'data/rec.js'][0]
  iDebug('common.js getSeriseInfo ajaxObjSeries.url =' + ajaxObjSeries.url)
  ajaxObjSeries.requestData('GET')
}
/******************************剧集弹出框*********************
_res： 点播剧集数据
_seriesid： 剧集id
_listLabel:所属栏目id
***************************************************************/
function showSeriesPop(_res, _seriesid, _listLabel) {
  iDebug('yanch common showSeriesPop--init')
  var newFlag = 0; // 默认为连续剧格
  var epgInfoList = _res
  if (epgInfoList.video_list != null && typeof epgInfoList.video_list == 'undefined') return
  var popArr = []
  var leng = epgInfoList.video_list.length
  for (var i = 0; i < leng; i++) {
    var tmpObj = epgInfoList.video_list[i]
    var tmp = popArr[i] = {
      id: tmpObj.video_id,
      program_id: tmpObj.video_id,
      // name:tmpObj.video_name,
      program_name: tmpObj.video_name,
      name: tmpObj.series_idx,
      num: tmpObj.series_idx,
      type: 'sd', // 不知道这个还有什么用
      start_time: '',
      end_time: '',
      is_view: tmpObj.is_view ? tmpObj.is_view : 0, // 是否看过这一集
      video_desc: tmpObj.video_desc ? tmpObj.video_desc : '',
      last_viewed_time: tmpObj.last_viewed_time ? tmpObj.last_viewed_time : 0, // 最后一次看的时间
      update_time: tmpObj.update_time ? tmpObj.update_time : 0, // 集数更新的时间
      url: tmpObj.video_url, // 这个是数组，后面考虑换掉
    }
    var tempdate = tmp.name + ''
    iDebug('comAjaxRequest.js---fun seriesGetInfo()----epgInfoList.idx_type:' + epgInfoList.idx_type)
    if (tempdate.length == 8) {
      iDebug('-------in---综艺期数-tempdate11:' + tempdate)
      // var str = tool.toDate(tempdate+"000")
      var temp = tempdate + '000'
      // var temp=tmp+""
      var mon = temp.substring(4, 6)
      var dat = temp.substring(6, 8)
      var str = mon + '-' + dat
      iDebug('---yanch str=' + str)
      tempdate = str
      tmp.name = tempdate
      iDebug('search.js-----kongwm---------tmp.name=' + tmp.name)
      newFlag = 3; // 点播中的综艺节目播放
    } else if (epgInfoList.idx_type == 1 && typeof epgInfoList.extend_content != 'undefined' && epgInfoList.extend_content != '') {
      iDebug('yanch getseries 1')
      var tempObj = eval('(' + epgInfoList.extend_content + ')')
      iDebug('yanch getseries 2 =' + tempObj)
      if (typeof tempObj != 'undefined' && tempObj != '' && typeof tempObj.showtype != 'undefined' && tempObj.showtype != '') { // 为该片花在视频上传中的媒资id
        iDebug('--myFav.htm---fun getAppDetail---tempObj.showtype:' + tempObj.showtype)
        var str = tempObj.showtype.substr(2)
        iDebug('yanch str str=' + str)
        tmp.name = '第' + tempdate + str
        iDebug('search.js111111111-----kongwm---------tmp.name=' + tmp.name)
        newFlag = 3; // 点播中的综艺节目播
      }
    }
    iDebug('comAjaxRequest.js---fun seriesGetInfo()-- tmp.name=' + tmp.name)
  }
  if (newFlag == 3) { // 将最新的一集放在第一个
    var tempPopLen = Math.ceil(popArr.length / 2)
    var popLen = popArr.length - 1
    for (var i = 0; i < tempPopLen; i++, popLen--) {
      // 交换位置
      var popTemp = popArr[i]
      popArr[i] = popArr[popLen]
      popArr[popLen] = popTemp
    }
  }
  var tmpData = {}
  tmpData.isType = 'vod', // pengjiao  vod里面的连续剧(判断是回看里面的连续剧还是vod里面的)
    tmpData.url = ''; // 不知道这个还有什么用
  tmpData.channelId = ''; // //不知道这个还有什么用
  tmpData.textArr = [epgInfoList.series_name, '']; // 数组里面为节目名，频道名			
  iDebug('===0===epgInfoList.series_desc:' + epgInfoList.series_desc)
  tmpData.programeDesc = epgInfoList.series_desc
  iDebug('=getSeries==0===epgInfoList.poster_list.dir:' + epgInfoList.series_poster_list.dir)
  iDebug('==getSeries=0===epgInfoList.poster_list.list:' + epgInfoList.series_poster_list.list['320x400'])
  tmpData.posterPic = ''
  tmpData.lastViewedIdx = epgInfoList.last_viewed_idx ? epgInfoList.last_viewed_idx : 0; // 最后一次看到的集数
  if (typeof epgInfoList.series_poster_list != 'undefined' && typeof epgInfoList.series_poster_list.dir != 'undefined' && epgInfoList.series_poster_list.dir != '' && typeof epgInfoList.series_poster_list.list != 'undefined') {
    iDebug('==getSeries=0===epgInfoList.poster_list.list:0' + epgInfoList.series_poster_list.list['320x400'])
    iDebug('==getSeries=0===epgInfoList.poster_list.list:' + epgInfoList.series_poster_list.list['320x400'])
    tmpData.posterPic = epgInfoList.series_poster_list.dir + "320x400_1.jpg" //epgInfoList.series_poster_list.list['320x400']
  }
  var listLabel = _listLabel || ''
  tmpData.totalNum = popArr.length
  tmpData.data = popArr
  var currUrl = top.window.location.href
  if (currUrl.indexOf('?') != -1) {
    currUrl = currUrl.split('?')[0];
  }
  iDebug('--------currUrl = ' + currUrl)
  if (typeof top.navPos != 'undefined') {
    var url = top.window.location.href
    if (url.indexOf('?') != -1) {
      url = url.split('?')[0];
    }
    iDebug('--detail.htm-2-classIsPurchasedAndAttribute--url:' + url)
    currUrl = url + '?navPos=' + top.navPos + '&selectNavPos=' + top.selectNavPos + '&focusPos=' + listObj.focusPos + '&dataPos=' + listObj.listPos
  }
  tmpData.backUrl = currUrl
  tmpData.seriesId = _seriesid
  tmpData.listLabel = listLabel
  iDebug('2017/6/16 comAjaxRequest.js ---showSeriesPop---- tmpData.listLabel =' + tmpData.listLabel)
  // 什么时候是新闻，什么时候是连续剧，什么时候是综艺 目前陈恋的接口定义按分类来判断。
  var _url = 'popTv.php'
  var isNewPortalFlag = navigatorFlag == 'iPanel' ? iPanel.eventFrame.isNewPortalFlag : 1
  if (newFlag == 0) {
    var _url = 'popTv_new.php'
    // window.
    showPop(_url, function (id) {
      iDebug('search.js 111111111111id =' + id)
      iDebug('search.js 111111111111tmpData =' + tmpData)
      iDebug('search.js 111111111111tmpData =' + JSON.stringify(tmpData))
      $("ifrDiv_0").style.visibility = "visible";
      console.log("window.frames[id]"+ typeof(id) )
      window.frames[id].modifyData(tmpData)
    })
  } else if (newFlag == 3) {
    var _url = 'popVariety_new.php'
    // window.
    showPop(_url, function (id) {
      iDebug('search.js 33333333id =' + id)
      window.frames[id].modifyData(tmpData)
    })
  }
}

function setGlobalParms(kvJsonObj) {
  if (navigator.appName.indexOf("iPanel") != -1) {
      for (var key in kvJsonObj) {
          iPanel.setGlobalVar(key + "", kvJsonObj[key] + "");
      }
      iPanel.misc.save();
  } else {
      for (var key in kvJsonObj) {
          sessionStorage.setItem(key, kvJsonObj[key]);
      }
  }
}

function getGlobalParms(key) {
  var value = "";
  if (navigator.appName.indexOf("iPanel") != -1) {
      value = iPanel.getGlobalVar(key + "");
  } else {
      var value = sessionStorage.getItem(key);
  }
  if ((typeof value) == "undefined" || value == null || value == "") return "";
  else return value;
}

function removeGlobalParms(keys) {
  if (typeof keys == "undefined" || keys.length <= 0) return;
  if (navigator.appName.indexOf("iPanel") != -1) {
      for (var i = 0, len = keys.length; i < len; i++) {
          iPanel.delGlobalVar(keys[i] + "");
      }
      iPanel.misc.save();
  } else {
      for (var i = 0, len = keys.length; i < len; i++) {
          sessionStorage.removeItem(keys[i] + "");
      }
  }
}
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";