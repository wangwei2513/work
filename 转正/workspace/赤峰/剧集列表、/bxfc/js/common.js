function $ (id) {
  return document.getElementById(id)
}
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
function iDebug (_str) {
  if (navigator.appName.indexOf('iPanel') > -1) {
    iPanel.debug(_str)
  } else if (navigator.appName.indexOf('Netscape') > -1 || navigator.appName.indexOf('Google') > -1) {
    console.log(_str)
  } else if (navigator.appName.indexOf('Opera') > -1) {
    opera.postError(_str)
  }
}
/*获取时间*/
// formatTime("YYYY年MM月DD日 hh:mm:ss W")
function formatTime (formatter, d) {
  var weekdays = {
    chi: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    eng: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }

  if (!formatter || formatter == '') {
    formatter = 'yyyy-MM-dd hh:mm'
  }
  if (!d) {
    d = new Date()
  }
  var year = d.getFullYear().toString()
  var month = (d.getMonth() + 1).toString()
  var date = d.getDate().toString()
  var day = d.getDay()
  var hour = d.getHours().toString()
  var minute = d.getMinutes().toString()
  var second = d.getSeconds().toString()

  var yearMarker = formatter.replace(/[^y|Y]/g, '')
  if (yearMarker.length == 0) {
    year = ''
  }

  var monthMarker = formatter.replace(/[^M]/g, '')
  if (monthMarker.length > 1) {
    if (month.length == 1) {
      month = '0' + month
    }
  } else if (monthMarker.length == 0) {
    month = ''
  }

  var dateMarker = formatter.replace(/[^d|D]/g, '')
  if (dateMarker.length > 1) {
    if (date.length == 1) {
      date = '0' + date
    }
  } else if (dateMarker.length == 0) {
    date = ''
  }

  var hourMarker = formatter.replace(/[^h]/g, '')
  if (hourMarker.length > 1) {
    if (hour.length == 1) {
      hour = '0' + hour
    }
  } else if (hourMarker.length == 0) {
    hour = ''
  }

  var minuteMarker = formatter.replace(/[^m]/g, '')
  if (minuteMarker.length > 1) {
    if (minute.length == 1) {
      minute = '0' + minute
    }
  } else if (minuteMarker.length == 0) {
    minute = ''
  }

  var secondMarker = formatter.replace(/[^s]/g, '')
  if (secondMarker.length > 1) {
    if (second.length == 1) {
      second = '0' + second
    }
  } else if (secondMarker.length == 0) {
    second = ''
  }

  var result = formatter.replace(yearMarker, year).replace(monthMarker, month).replace(dateMarker, date).replace(hourMarker, hour).replace(minuteMarker, minute).replace(secondMarker, second)

  var dayMarker = formatter.replace(/[^w|W]/g, '')
  if (dayMarker == 'W') { // 大写表示中文
    result = result.replace(dayMarker, weekdays['chi'][day])
  } else if (dayMarker == 'w') { // 小写表示英文
    result = result.replace(dayMarker, weekdays['eng'][day])
  }
  return result
}

function AJAX_OBJ (_url, _successCallback, _failureCallback, _completeCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
  this.url = _url || ''
  this.successCallback = _successCallback ||
  function (_xmlHttp, _params) {}
  this.failureCallback = _failureCallback ||
  function (_xmlHttp, _params) {}
  this.completeCallback = _completeCallback ||
  function (_xmlHttp, _params) {}
  this.urlParameters = _urlParameters || ''
  this.callbackParams = _callbackParams || null
  this.async = typeof (_async) == 'undefined' ? true : _async
  this.charset = _charset || null
  this.timeout = _timeout || 5000
  this.frequency = _frequency || 5000
  this.requestTimes = _requestTimes || 1
  this.frame = _frame || window
  this.timer = -1
  this.counter = 0
  this.method = 'GET'
  this.headers = null
  this.username = ''
  this.password = ''
  this.createXmlHttpRequest = function () {
    var xmlHttp = null
    try {
      xmlHttp = new XMLHttpRequest()
    } catch(exception) {
      try {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
      } catch(exception) {
        try {
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
        } catch(exception) {
          return false
        }
      }
    }
    return xmlHttp
  }
  this.xmlHttp = this.createXmlHttpRequest()
  this.requestData = function (_method, _headers, _username, _password) {
    this.frame.clearTimeout(this.timer)
    this.method = typeof (_method) == 'undefined' ? 'GET' : (_method.toLowerCase() == 'post') ? 'POST' : 'GET'
    this.headers = typeof (_headers) == 'undefined' ? null : _headers
    this.username = typeof (_username) == 'undefined' ? '' : _username
    this.password = typeof (_password) == 'undefined' ? '' : _password
    var target = this
    var data = null
    this.xmlHttp.onreadystatechange = function () {
      target.stateChanged()
    }
    if (this.method == 'POST') {
      var url = encodeURI(this.url)
      data = this.urlParameters
    } else {
      var url = this.url + (((this.urlParameters != '' && this.urlParameters.indexOf('?') == -1) && this.url.indexOf('?') == -1) ? ('?' + this.urlParameters) : this.urlParameters)
    }
    if (this.username != '') {
      this.xmlHttp.open(this.method, url, this.async, this.username, this.password)
    } else {
      this.xmlHttp.open(this.method, url, this.async)
    }
    var contentType = false
    if (this.headers != null) {
      for (var key in this.headers) {
        if (key.toLowerCase() == 'content-type') {
          contentType = true
        }
        this.xmlHttp.setRequestHeader(key, this.headers[key])
      }
    }
    if (!contentType) {
      this.xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (this.charset != null) {
      this.xmlHttp.overrideMimeType('text/html; charset=' + this.charset)
    }
    this.xmlHttp.send(data)
    this.timer = this.frame.setTimeout(function () {
      target.checkStatus()
    },
      this.timeout)
  }
  this.stateChanged = function () {
    if (this.xmlHttp.readyState < 2) {} else {}
    var target = this
    if (this.xmlHttp.readyState == 2) {} else if (this.xmlHttp.readyState == 3) {
      if (this.xmlHttp.status == 401) {}
    } else if (this.xmlHttp.readyState == 4) {
      this.frame.clearTimeout(this.timer)
      if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
        this.success()
      } else {
        this.failed()
      }
      this.complete()
    }
  }
  this.success = function () {
    if (!this.xmlHttp.responseText) return
    var res = eval('(' + this.xmlHttp.responseText + ')')
    if ((res.ret == 9021 || res.ret == 9022) && this.url.indexOf('/account/login') == -1) {
      this.iDebug('9021---url=' + this.url + '---result=' + this.xmlHttp.responseText)
      if (navigator.appName.indexOf('iPanel') != -1) {
        if (iPanel.eventFrame.showDialogTimes == 0) {
          iPanel.eventFrame.showDialogTimes = 1
          iPanel.eventFrame.showdialog('请重新登录！')
          iPanel.misc.setGlobal(iPanel.eventFrame.da_id + '_token', '')
          iPanel.misc.save()
          setTimeout(function () {
            iPanel.eventFrame.showDialogTimes = 0
            if (typeof top.httpInstance != 'undefined' && top.httpInstance != null) {
              top.httpInstance.stop(1)
              top.httpInstance.close()
            }
            if (typeof gotoPage != 'undefined') {
              gotoPage(userLoginAddr)
            } else {
              window.location.href = userLoginAddr
            }
          },
            1500)
        }
      }
    } else {
      if (this.callbackParams == null) {
        this.successCallback(this.xmlHttp, res)
      } else {
        this.successCallback(this.xmlHttp, this.callbackParams)
      }
      this.counter = 0
    }
  }
  this.failed = function () {
    if (this.callbackParams == null) {
      this.failureCallback(this.xmlHttp)
    } else {
      this.failureCallback(this.xmlHttp, this.callbackParams)
    }
    this.counter = 0
  }
  this.complete = function () {
    if (this.callbackParams == null) {
      this.completeCallback(this.xmlHttp)
    } else {
      this.completeCallback(this.xmlHttp, this.callbackParams)
    }
    this.counter = 0
  }
  this.checkStatus = function () {
    if (this.xmlHttp.readyState != 4) {
      if (this.counter < this.requestTimes) {
        this.requestAgain()
      } else {
        this.failed()
        this.complete()
        this.requestAbort()
      }
    }
  }
  this.requestAgain = function () {
    this.requestAbort()
    var target = this
    this.frame.clearTimeout(this.timer)
    this.timer = this.frame.setTimeout(function () {
      target.counter++
      target.requestData(target.method, target.headers, target.username, target.password)
    },
      this.frequency)
  }
  this.requestAbort = function () {
    this.frame.clearTimeout(this.timer)
    this.xmlHttp.abort()
  }
  this.addParameter = function (_json) {
    var url = this.url
    var str = this.urlParameters
    for (var key in _json) {
      if (url.indexOf('?') != -1) {
        url = ''
        if (str == '') {
          str = '&' + key + '=' + _json[key]
        } else {
          str += '&' + key + '=' + _json[key]
        }
        continue
      }
      if (str == '') {
        str += '?'
      } else {
        str += '&'
      }
      str += key + '=' + _json[key]
    }
    this.urlParameters = str
    return str
  }
  this.getResponseXML = function () {
    if (this.xmlHttp.responseXML != null) {
      return this.xmlHttp.responseXML
    } else if (this.xmlHttp.responseText.indexOf('<\?xml') != -1) {
      return typeof (DOMParser) == 'function' ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, 'text/xml') : (new ActivexObject('MSXML2.DOMDocument')).loadXML(this.xmlHttp.responseText)
    }
    return null
  }
  this.iDebug = function (str) {
    if (navigator.appName.indexOf('iPanel') != -1) {
      iPanel.debug(str)
    } else if (navigator.appName.indexOf('Opera') != -1) {
      opera.postError(str)
    } else if (navigator.appName.indexOf('Netscape') != -1 || navigator.appName.indexOf('Google') != -1) {
      console.log(str)
    }
  }
}

function getUrlParams (_key, _url, _spliter) {
  if (typeof (_url) == 'object') {
    var url = _url.location.href
  } else {
    var url = _url ? _url : window.location.href
  }
  if (url.indexOf('?') == -1 && url.indexOf('#') == -1) {
    return ''
  }
  var spliter = _spliter || '&'
  var spliter_1 = '#'
  var haveQuery = false
  var x_0 = url.indexOf(spliter)
  var x_1 = url.indexOf(spliter_1)
  var urlParams
  if (x_0 != -1 || x_1 != -1 || url.indexOf('?') != -1) {
    if (url.indexOf('?') != -1) urlParams = url.split('?')[1]
    else if (url.indexOf('#') != -1) urlParams = url.split('#')[1]
    else urlParams = url.split(spliter)[1]
    if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) { // 可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
      var v = []
      if (urlParams.indexOf(spliter_1) != -1) {
        v = urlParams.split(spliter_1)
        urlParams = []
        for (var x = 0; x < v.length; x++) {
          urlParams = urlParams.concat(v[x].split(spliter))
        }
      } else {
        urlParams = urlParams.split(spliter)
      }
    } else {
      urlParams = [urlParams]
    }
    haveQuery = true
  } else {
    urlParams = [url]
  }
  var valueArr = []
  for (var i = 0, len = urlParams.length; i < len; i++) {
    var params = urlParams[i].split('=')
    if (params[0] == _key) {
      valueArr.push(params[1])
    }
  }
  if (valueArr.length > 0) {
    if (valueArr.length == 1) {
      return valueArr[0]
    }
    return valueArr
  }
  return ''
}

function ajaxClass (_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
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
  this.url = _url || ''
  this.successCallback = _successCallback || function (_xmlHttp, _params) {
    // iPanel.debug("[xmlHttp] responseText: " + _xmlHttp.responseText)
  }
  this.failureCallback = _failureCallback || function (_xmlHttp, _params) {
    // iPanel.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText)
  }
  this.urlParameters = _urlParameters || ''
  this.callbackParams = _callbackParams || null
  this.async = typeof (_async) == 'undefined' ? true : _async
  this.charset = _charset || null
  this.timeout = _timeout || 30000 // 15s
  this.frequency = _frequency || 10000 // 10s
  this.requestTimes = _requestTimes || 0
  this.frame = _frame || window

  this.timer = -1
  this.counter = 0

  this.method = 'GET'
  this.headers = null
  this.username = ''
  this.password = ''

  this.checkTimeout = 500
  this.checkTimer = -1
  this.checkCount = -1

  this.createXmlHttpRequest = function () {
    var xmlHttp = null
    try { // Standard
      xmlHttp = new XMLHttpRequest()
    } catch (exception) { // Internet Explorer
      try {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
      } catch (exception) {
        try {
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
        } catch (exception) {
          return false
        }
      }
    }
    return xmlHttp
  }

  this.xmlHttp = this.createXmlHttpRequest()

  this.requestData = function (_method, _headers, _username, _password) {
    /**
     * @param{string} _method: 传递数据的方式，POST/GET
     * @param{string} _headers: 传递数据的头信息，json格式
     * @param{string} _username: 服务器需要认证时的用户名
     * @param{string} _password: 服务器需要认证时的用户密码
     */
    this.xmlHttp = this.createXmlHttpRequest()
    this.frame.clearTimeout(this.timer)
    this.method = typeof (_method) == 'undefined' ? 'GET' : (_method.toLowerCase() == 'post') ? 'POST' : 'GET'
    this.headers = typeof (_headers) == 'undefined' ? null : _headers
    this.username = typeof (_username) == 'undefined' ? '' : _username
    this.password = typeof (_password) == 'undefined' ? '' : _password

    var target = this
    this.xmlHttp.onreadystatechange = function () {
      target.stateChanged()
    }
    if (this.method == 'POST') { // encodeURIComponent
      var url = encodeURI(this.url)
      var data = this.urlParameters
    } else {
      // var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters))
      var url = encodeURI(encodeURI(this.url))
      // iPanel.debug("[xm] xmlHttp get url00="+url)
      var data = null
    }
    if (this.username != '') {
      this.xmlHttp.open(this.method, url, this.async, this.username, this.password)
    } else {
      console.log(url)
      this.xmlHttp.open(this.method, url, this.async)
    }
    var contentType = false
    if (this.headers != null) {
      for (var key in this.headers) {
        if (key.toLowerCase() == 'content-type') {
          contentType = true
        }
        this.xmlHttp.setRequestHeader(key, this.headers[key])
      }
    }
    if (!contentType) {
      this.xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (this.charset != null) { // 要使用responseXML就不能设置此属性
      this.xmlHttp.overrideMimeType('text/html; charset=' + this.charset)
    }
    // iPanel.debug("[xmlHttp] requestData " + this.method + " url: " + url + ", data: " + data)
    this.xmlHttp.send(data)
    this.checkReadyState()
    this.timer = this.frame.setTimeout(function () {
      target.checkStatus()
    }, this.timeout)
  }
  this.checkReadyState = function () {
    var target = this
    this.frame.clearTimeout(this.checkTimer)
    this.checkTimer = this.frame.setTimeout(function () {
      // iPanel.debug("global checkReadyState target.xmlHttp.readyState="+target.xmlHttp.readyState)
      // iPanel.debug("global checkReadyState target.xmlHttp.status="+target.xmlHttp.status)
      if (target.xmlHttp.readyState == 4 && (target.xmlHttp.status == 200 || target.xmlHttp.status == 204 || target.xmlHttp.status == 0)) {
        target.stateChanged()
      } else {
        target.checkCount++
        if ((target.checkCount * target.checkTimeout) >= target.timeout) {
          target.checkStatus()
        } else {
          target.checkReadyState()
        }
      }
    }, this.checkTimeout)
  }
  this.stateChanged = function () { // 状态处理
    // iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState)
    if (this.xmlHttp.readyState < 2) {
    } else {
      // iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status)
    }

    var target = this
    if (this.xmlHttp.readyState == 2) {
      /*this.timer = this.frame.setTimeout(function() {
      		target.checkStatus()
      	}, this.timeout); */
    } else if (this.xmlHttp.readyState == 3) {
      if (this.xmlHttp.status == 401) {
        // iPanel.debug("[xmlHttp] Authentication, need correct username and pasword")
      }
    } else if (this.xmlHttp.readyState == 4) {
      this.frame.clearTimeout(this.timer)
      this.frame.clearTimeout(this.checkTimer)
      if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0) {
        // iPanel.debug("[xmlHttp] this.xmlHttp.resposeText=" + this.xmlHttp.responseText)
        this.success()
      }
      /*else if(this.xmlHttp.status == 0){
      	iPanel.debug("global_stateChanged_this.xmlHttp.status==0--一般为0的状态是库里发的")
      }*/
      else {
        // iPanel.debug("global_stateChanged_this.xmlHttp.status=="+this.xmlHttp.status)
        this.failed()
      }
    }
  }
  this.success = function () {
    this.checkCount = -1
    this.frame.clearTimeout(this.checkTimer)
    if (this.callbackParams == null) {
      this.successCallback(this.xmlHttp)
    } else {
      this.successCallback(this.xmlHttp, this.callbackParams)
    }
    this.counter = 0
  }
  this.failed = function () {
    this.checkCount = -1
    this.frame.clearTimeout(this.checkTimer)
    if (this.callbackParams == null) {
      this.failureCallback(this.xmlHttp)
    } else {
      this.failureCallback(this.xmlHttp, this.callbackParams)
    }
    this.counter = 0
  }
  this.checkStatus = function () { // 超时处理，指定时间内没有成功返回信息按照失败处理
    if (this.xmlHttp.readyState != 4) {
      if (this.counter < this.requestTimes) {
        this.requestAgain()
      } else {
        this.failed()
        this.requestAbort()
      }
    }
  }
  this.requestAgain = function () {
    this.requestAbort()
    var target = this
    this.frame.clearTimeout(this.timer)
    this.timer = this.frame.setTimeout(function () {
      target.counter++
      target.requestData(target.method, target.headers, target.username, target.password)
    }, this.frequency)
  }
  this.requestAbort = function () {
    this.checkCount = -1
    this.frame.clearTimeout(this.timer)
    this.frame.clearTimeout(this.checkTimer)
    // iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp="+typeof this.xmlHttp)
    // iPanel.debug("[xmlHttp] call abort typeof this.xmlHttp.abort="+typeof this.xmlHttp.abort)
    // abort()方法可以停止一个XMLHttpRequest对象对HTTP的请求，把该对象恢复到初始状态
    this.xmlHttp.abort()
  }
  this.addParameter = function (_json) {
    /**
     * @param{object} _json: 传递的参数数据处理，只支持json格式
     */
    var url = this.url
    var str = this.urlParameters
    for (var key in _json) {
      if (url.indexOf('?') != -1) {
        url = ''
        if (str == '') {
          str = '&' + key + '=' + _json[key]
        } else {
          str += '&' + key + '=' + _json[key]
        }
        continue
      }
      if (str == '') {
        str += '?'
      } else {
        str += '&'
      }
      str += key + '=' + _json[key]
    }
    this.urlParameters = str
    return str
  }
  this.getResponseXML = function () { // reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
    if (this.xmlHttp.responseXML != null) {
      return this.xmlHttp.responseXML
    } else if (this.xmlHttp.responseText.indexOf('<?xml') != -1) {
      return typeof (DOMParser) == 'function' ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, 'text/xml') : (new ActivexObject('MSXML2.DOMDocument')).loadXML(this.xmlHttp.responseText)
    }
    return null
  }
}

function getStrChineseLen (str, len) {
  var w = 0
  str = str.replace(/[ ]*$/g, '')
  if (getStrChineseLength(str) > len) {
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i)
      var flag = 0
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        w++
        flag = 0
      } else {
        w += 2
        flag = 1
      }
      if (parseInt((w + 1) / 2) > len) {
        if (flag == 1) return str.substring(0, i - 1) + '..'; // 修改,sunny,防止换行...
        else return str.substring(0, i - 2) + '..'
        break
      }
    }
  }
  return str
}

function getStrChineseLength (str) {
  str = str.replace(/[ ]*$/g, '..')
  var w = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      w++
    } else {
      w += 2
    }
  }
  var length = w % 2 == 0 ? (w / 2) : (parseInt(w / 2) + 1)
  return length
}

var browserType = getBrowserType()

function getBrowserType () {
  var ua = navigator.userAgent.toLowerCase()
  return /ipanel/.test(ua) ? 'iPanel' :
    /enrich/.test(ua) ? 'EVM' :
      /wobox/.test(ua) ? 'Inspur' :
        window.ActiveXObject ? 'IE' :
          document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox' :
            window.openDatabase && !/chrome/.test(ua) ? 'Safari' :
              /opr/.test(ua) ? 'Opera' :
                window.MessageEvent && !document.getBoxObjectFor ? 'Chrome' :
                  ''
}

function setGlobalParms (kvJsonObj) {
  if (navigator.appName.indexOf('iPanel') != -1) {
    for (var key in kvJsonObj) {
      iPanel.setGlobalVar(key + '', kvJsonObj[key] + '')
    }
    iPanel.misc.save()
  } else {
    for (var key in kvJsonObj) {
      sessionStorage.setItem(key, kvJsonObj[key])
    }
  }
}

function getGlobalParms (key) {
  var value = ''
  if (navigator.appName.indexOf('iPanel') != -1) {
    value = iPanel.getGlobalVar(key + '')
  } else {
    var value = sessionStorage.getItem(key)
  }
  if ((typeof value) == 'undefined' || value == null || value == '') return ''
  else return value
}

function removeGlobalParms (keys) {
  if (typeof keys == 'undefined' || keys.length <= 0) return
  if (navigator.appName.indexOf('iPanel') != -1) {
    for (var i = 0, len = keys.length; i < len; i++) {
      iPanel.delGlobalVar(keys[i] + '')
    }
    iPanel.misc.save()
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      sessionStorage.removeItem(keys[i] + '')
    }
  }
}

/******************************获取剧集信息*********************
_id： 剧集id
_listLabel:所属栏目id
***************************************************************/
function getSeriseInfo (_id, _listLabel) {
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
function showSeriesPop (_res, _seriesid, _listLabel) {
  iDebug('yanch common showSeriesPop--init')
  var newFlag = 0; // 默认为连续剧格
  var epgInfoList = _res
  if (epgInfoList.video_list != null && typeof epgInfoList.video_list == 'undefined') return
  var popArr = []
  var leng = epgInfoList.video_list.length
  for (var i = 0;i < leng;i++) {
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
    }else if (epgInfoList.idx_type == 1 && typeof epgInfoList.extend_content != 'undefined' && epgInfoList.extend_content != '') {
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
    for (var i = 0;i < tempPopLen;i++, popLen--) {
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
    iDebug('==getSeries=0===epgInfoList.poster_list.list:' + epgInfoList.series_poster_list.list['320x400'])
    tmpData.posterPic = epgInfoList.series_poster_list.dir + epgInfoList.series_poster_list.list['320x400']
  }
  var listLabel = _listLabel || ''
  tmpData.totalNum = popArr.length
  tmpData.data = popArr
  var currUrl = top.window.location.href
  if (currUrl.indexOf('?') != -1) {currUrl = currUrl.split('?')[0];}
  iDebug('--------currUrl = ' + currUrl)
  if (typeof top.navPos != 'undefined') {
    var url = top.window.location.href
    if (url.indexOf('?') != -1) {url = url.split('?')[0];}
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
    window.showPop(_url, function (id) {
      iDebug('search.js 111111111111id =' + id)
      iDebug('search.js 111111111111tmpData =' + tmpData)
      iDebug('search.js 111111111111tmpData =' + JSON.stringify(tmpData))
      window.frames[id].modifyData(tmpData)
    })
  }else if (newFlag == 3) {
    var _url = 'popVariety_new.php'
    window.showPop(_url, function (id) {
      iDebug('search.js 33333333id =' + id)
      window.frames[id].modifyData(tmpData)
    })
  }
}
