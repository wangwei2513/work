(window.ue || (ue = {})).config = {

    //BO服务器配置
    boServer: {
        ip: '172.23.200.15',
        port: 554
    },

    //VOD服务器
    vodServerID: '172.23.200.21:8080',

    //机顶盒智能卡号  
    icNo:  TVUI.API.CA.icNo || '8002003789243255',  //  未授权:(icNo:8002003789220717  account:7543109)  已授权8002003789243255&account=760005716691）

    //用户名 
    account:  TVUI.API.DataAccess.info('UserInfo', 'account') || '760005716691',

    //后台服务器地址
    server: 'http://172.23.200.171',
    //server: 'http://127.0.0.1',

    //搜索推荐系统IP
    //rcmdServer:'http://172.16.244.80',
    rcmdServer:'',

    //一级菜单组
    menuArr: [
        {"name": "本地"},
        {"name": "直播"},
        {"name": "影视"},
        {"name": "应用"},
        {"name": "我+"}
    ],

    //接口清单
    api: {
        GetChannels: '/u1/GetChannels',
        GetAnn: '/u1/GetAnn',
        GetPrograms: '/u1/GetPrograms',
        GetRelateItem: '/uba-searchReseed/1.0/json/GetRelateItem',
        GetRelateContent: '/uba-searchReseed/1.0/json/GetRelateContent',
        Service: '/NewFrameWork/UE/mock/service.json',
        GetFolderContents: '/u1/GetFolderContents',
        getRecommendNew: '/u1/portalApi?service=rcmd',
        GetItemData: '/u1/GetItemData',
        GetAssociatedFolderContents: '/u1/GetAssociatedFolderContents',
        GetBookmarks: '/u1/GetBookmarks',
        AddBookmark: '/u1/AddBookmark',
        DeleteBookmark: '/u1/DeleteBookmark',
        ChannelSelectionStart: '/u1/ChannelSelectionStart',
        UserInfo : '/boss2_task/integrate/integate!bossRequest',//http://10.205.22.158
        ChannelProducts :'/appweb/service/service!handleRequest',//http://10.205.22.158
        Order :'http://10.205.22.158/appweb/service/service!postRequest',
        SelectionStart:'/u1/SelectionStart',
        GetSavedPrograms:'/u1/GetSavedPrograms',
        GetAccountInfo:'/appweb/login/login!checkLoginfoFromTV',//http://10.205.22.158
        ValidatePlayEligibility:'/u1/ValidatePlayEligibility',
        AddSavedProgram:'/u1/AddSavedProgram',
        GetRecommend:'/portal/demand/getRecommendNew.action',
        portalApi:'/u1/portalApi',
        getRecForVodAssociated:'/uba-online-mongodb/1.0/json/GetRecForVodAssociated'//从推荐系统获取vod关联推荐接口
    },


    //api请求超时时间
    timeout: 5000,

    //检测运行环境是否机顶盒
    isSTB: !!window.DataAccess,

    //本地频道数据存储路径
    localServiceInfoPath: '/storage/storage0/siConfig/ServiceInfo.json',

    //模拟本地频道数据接口, 仅在PC浏览器有效,运行在机顶盒无效
    mockServiceInfoPath: '/NewFrameWork/UE/mock/2016.07.01_original_ServiceInfo_GuangZhou.json',

    //保持在机顶盒本地的NetworkId文件路径
    localNetworkIdPath: '/storage/storage0/NetworkId.json',

    //默认的NetworkId
    defaultNetworkId: 223,

    //采集数据临时存储文件
    collectionCache: '/storage/storage0/dataCollection/bCacheData.dat',

    //默认IC卡 regionCode  
    regionCode:  TVUI.API.CA.regionCode || 101,

    //BOSS接口签名秘钥
    secretKey: '183F3364ED7564A9F5624DA2421EDEED'

};

function $(id) {
	return document.getElementById(id);
}
var browserType = getBrowserType();	//浏览器类型
var mySessionStorage = new globalVar();
function globalVar(){
	this.getItem = function(_str){
		var val = "";
		if(browserType == "iPanel"){
			val = iPanel.getGlobalVar(_str);
		}else{
			val = sessionStorage.getItem(_str);	
		}
		if(val == "" || val == null || val == "undefined" ) val = "";
		return val;
	};
	this.removeItem = function(_str){
		if(browserType == "iPanel"){
			iPanel.delGlobalVar(_str);
		}else{
			sessionStorage.removeItem(_str);	
		}
	}
	this.setItem = function(_key, _val){
		if(browserType == "iPanel"){
			iPanel.setGlobalVar(_key, _val);
		}else{
			sessionStorage.setItem(_key, _val);	
		}
	}
}

/*获取ca卡号*/
function getCAId(){
	var tmpCardId = "";
	if(BrowserType == "iPanel"){
		tmpCardId = CA.card.serialNumber;
	}else if(browserType == "Inspur"){
		tmpCardId = iSTB.settings.get("sys:ca0:cardnumber");
	}	
	if(tmpCardId == "undefined" || tmpCardId == null){
		tmpCardId = "";
	}
	return tmpCardId;	
}

//获取浏览器版本
function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? 'iPanel'
		: /enrich/.test(ua) ? 'EVM'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: ''
		;	
}

/*获取url参数*/
//getUrlParams("menuPos",window.location.href)
function getUrlParams(_key, _url, _spliter) {
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

function sendAjax(url,data,callback,charset,type) {
	var xmlhttp ;
	var isAsync = type?true:false;
	xmlhttp = new XMLHttpRequest();
	if(typeof charset !== 'undefined') {
		xmlhttp.overrideMimeType("text/html; charset=" + charset);
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 ){	
		    if (xmlhttp.status == 200 || xmlhttp.status == 0) {
		    	callback(xmlhttp.responseText);
		    }
	    }
	}
	if(data!=null && typeof data!="undefined") {
		xmlhttp.open("POST",url,isAsync);
		xmlhttp.send(data);
	}
	else {
		xmlhttp.open("GET",url,isAsync);
		xmlhttp.send(null);
	}
}

function cutString(str,len){
	if(typeof str != "string"){
		return false;
	}
	return str.substring(0,len);
}

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

function param(obj, sep, eq) {
    var i, arr = [], self = this;
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

function extend(target, source) {
    for (key in source) {
        target[key] = source[key];
    }
    return target;
}

var accepts = {
    script: 'text/javascript, application/javascript, application/x-javascript',
    json: 'application/json',
    xml: 'application/xml, text/xml',
    html: 'text/html',
    text: 'text/plain'
};

function empty() {}

function newsAjax(options) {

    var settings = extend({
        type: 'GET',
        url: '',
        data: null,
        success: empty,
        error: empty,
        complete: empty,
        timeout: 5000,
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
        setHeader = function (name, value) {
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

    xhr.onreadystatechange = function () {
    	iDebug("url:" + settings.url + "---readyState:"+xhr.readyState);
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
                    }
                    else if (dataType == 'xml') {
                        result = xhr.responseXML;
                    }
                    else if (dataType == 'json') {
                        result = JSON.parse(result);
                    }
                } catch (err) {
                    error = err;
                }

                if (error) {
                    settings.error(error, 'parsererror', xhr, settings);
                }
                else {
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
        abortTimeout = setTimeout(function () {
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
    } catch (err) {
    }


    return xhr;

}

function getFolderContents(assetId, folderAssetId, folderType, startAt, maxItems, profile, callback) {
    var config = ue.config;
    newsAjax({
    	url : config.server + config.api.GetFolderContents,
    	type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data : {
        	assetId: assetId,
        	client: config.icNo,
        	account: config.account,
        	folderAssetId: folderAssetId,
        	folderType: folderType,
        	startAt: startAt,
        	maxItems: maxItems,
        	profile: profile,
        	resultType: 'json'
        },
        success: function (json) {
            callback && callback(json);
        },
        error: function () {
            callback && callback([]);
        }
    });
}
function getPrograms(channelId, startTime, endTime, callback) {
	var config = ue.config;
	newsAjax({
    	url : config.server + config.api.GetPrograms,
    	type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data : {
        	client: config.icNo,
            account: config.account,
            regionCode: config.regionCode,
            channelIds: channelId,
            startDateTime: startTime,
            endDateTime: endTime,
            resultType: 'json'
        },
        success: function (json) {
            callback && callback(json);
        },
        error: function () {
           callback && callback([]);
        }
    });
}

function getItemData(assetId, providerId, callback) {
    var config = ue.config;
   	newsAjax({
    	url : config.server + config.api.GetItemData,
    	type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data : {
        	client: config.icNo,
            account: config.account,
            titleAssetId: assetId,
            titleProviderId: providerId,
            resultType: 'json'
        },
        success: function (json) {
            callback && callback(json);
        },
        error: function () {
           callback && callback([]);
        }
    });
}

function selectionStart(assetId,providerId,serviceId,groupId,callback){
    var config = ue.config;
    newsAjax({
    	url : config.server + config.api.SelectionStart,
    	type: "GET",
        dataType: 'json',
        timeout: config.timeout,
        data : {
        	titleAssetId:assetId,
            serviceId: serviceId,
            titleProviderId: providerId,
            folderAssetId:groupId,
            client: config.icNo,
            account: config.account,
            resultType: 'json'
        },
        success: function (json) {
            callback && callback(json);
        },
        error: function () {
           callback && callback([]);
        }
    });
}