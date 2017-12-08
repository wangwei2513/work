/*
 * @url: request url
 * @callback: callback function
 * @errorhandle: error handle function
 * @timer: request interval
 * @retrial: error request times(value=-1:infinity)
 */
var test=0;
var use=1;
var server=["http://192.168.18.184:12306","http://10.65.255.120:8080"][use];//"http://192.168.18.184:12306";//http://192.168.18.184:12306  http://10.65.255.120:8080
var slaveIPAddre = "http://slave.homed.me";
var objPool = [];
var getADAjaxObj=null;
var adData;
function nowTime(formatStr,language){ 
	var str = formatStr; 
	var date = new Date();
	var Week = {
		cn:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		en:['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
				
	}
	str=str.replace(/yyyy|YYYY/,date.getFullYear()); 
	str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100)); 
	str=str.replace(/MM/,(date.getMonth()+1)>9?(date.getMonth()+1).toString():'0' + (date.getMonth()+1)); 
	str=str.replace(/M/g,date.getMonth() + 1); 
	str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate()); 
	str=str.replace(/d|D/g,date.getDate()); 
	str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours()); 
	str=str.replace(/h|H/g,date.getHours()); 
	str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes()); 
	str=str.replace(/m/g,date.getMinutes()); 
	str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds()); 
	str=str.replace(/s|S/g,date.getSeconds()); 
	if(language=="en"){
		str=str.replace(/w|W/g,Week.en[date.getDay()]); 
	}
	else {
		str=str.replace(/w|W/g,Week.cn[date.getDay()]); 
	}
	return str; 
}
function getADList(){
	var url=serverIPAddre+"/auctionSystem/interface/getAdAndMarquee.action";
	getADAjaxObj=new AJAX_OBJ(url,getADSuc,getADFail);
	getADAjaxObj.requestData();
}
function getDisplayString(str,len,type){
	var totalLength=0;
	var toMarqueeFlag = false;
	var position=0;
	for(var i=0;i<str.length;i++){
		var intCode=str.charCodeAt(i);
		if((intCode >= 0x0001 && intCode <= 0x007e) || (0xff60<=intCode && intCode<=0xff9f)){
			totalLength+=1;//非中文单个字符长度加1
		}else{
			totalLength+=2;//中文字符长度则加2
		}
		if(totalLength > len){
			position = i;
			toMarqueeFlag = true;
			break;
		}
	}
	if(toMarqueeFlag)
		return str.substring(0,position);
		
	if(type == 1) return str;
	return "";
}
function priceToFomat(__str){
	
	var price=parseInt(__str,10);
	if(price<10000){
			price+="元";
	}else if(price>=10000){
		price=(price/10000).toString();
		if(price.indexOf(".")>-1){
			if(price.split(".")[1].length<2){
				price+="万元"
			}else price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"万元";
		}else price+=".00万元"
	}/*else if(price>=1000000&&price<10000000){
		price=(price/1000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"百万";
		else price+=".00百万"
	}else if(price>=10000000&&price<100000000){
		price=(price/10000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"千万";
		else price+=".00千万"
	}else if(price>=100000000){
		price=(price/100000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"亿";
		else price+=".00亿"
	}*/
	
	return price
}
function priceToFomat_no(__str){
	
	var price=parseInt(__str,10);
	if(price<10000){
		//price;
		price=(price).toString();
		if(price.indexOf(".")>-1){
			if(price.split(".")[1].length<2){
				price
			}else price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4);
		}else price+=".00"
	}else if(price>=10000){
		price=(price/10000).toString();
		if(price.indexOf(".")>-1){
			if(price.split(".")[1].length<2){
				price
			}else price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4);
		}else price+=".00"
	}/*else if(price>=1000000&&price<10000000){
		price=(price/1000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"百万";
		else price+=".00百万"
	}else if(price>=10000000&&price<100000000){
		price=(price/10000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"千万";
		else price+=".00千万"
	}else if(price>=100000000){
		price=(price/100000000).toString();
		if(price.indexOf(".")>-1) price=price.split(".")[0]+"."+(price.split(".")[1]+"000").substr(0,4)+"亿";
		else price+=".00亿"
	}*/
	
	return price
}
function $(_id){
  return document.getElementById(_id);
}
function getADSuc(xmlhttp){
	var str=xmlhttp.responseText;
	eval('var data='+str);
	if(data.code=="0"){
		adData=	data.data;
		
		/*if($("ad0")!="null"){
			$("ad0").src=adData.adLeft;
		}*/
		if($("ad1")!="null"){
			$("ad1").src=adData.adRight;
		}
		if($("marqueeTxt")!="null"){
			
			if(getDisplayString(adData.content,100)){
				$("marqueeTxt").innerHTML="<marquee>"+adData.content+"</marquee>";
			}else{
				$("marqueeTxt").innerHTML=adData.content;
			}
			
			
		
		}
		
	}else{
		getADFail()
	}
	
}
function getADFail(){
	
}
function AJAX_OBJ(url, callback, errorhandle, timer, retrial){
	this.xmlHttp = null;
	this.num = 0;
	this.url = url;
	this.urlParameters = "";
	this.callback = callback;
	this.errorhandle = errorhandle;

	this.timer = timer || 5000;
	this.timeout = -1;
	this.retrial = retrial || 1;
	this.requestInterval = 1000;
	
	this.postData = null;	//要发送的POST数据
	
	this.childnodes = null;
	
}
/*创建 XMLHttpRequest 对象，IE 浏览器使用 ActiveXObject，而其他的浏览器使用名为 XMLHttpRequest 的 JavaScript 内建对象。*/
AJAX_OBJ.prototype.createXMLHttpRequest = function(){
	

	var xmlh = null;
	if(window.ActiveXObject){
		xmlh = new ActiveXObject(
				navigator.userAgent.indexOf('MSIE 5') >= 0 ?
				"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
	}
	else if(window.XMLHttpRequest){
		xmlh = new XMLHttpRequest();
	}
	return xmlh;
}
/*获取一个XMLHttpRequest 对象*/
AJAX_OBJ.prototype.getInstance = function(){
	for (var i = 0; i < objPool.length; i ++){
		if (objPool[i].readyState == 0 || objPool[i].readyState == 4){// 返回已有的readyState属性值为0或者4的XMLHttpRequest对象，readyState=0，请求未初始化（在调用 open() 之前）；readyState=4，请求已完成（可以访问服务器响应并使用它）
			return objPool[i];
		}
	}
	objPool[objPool.length] = this.createXMLHttpRequest();//如果已有的XMLHttpRequest对象都属于非空闲状态，则创建返回一个新的XMLHttpRequest对象
	return objPool[objPool.length - 1];
}
/*请求数据*/
AJAX_OBJ.prototype.requestData = function(requestMethod,sendData){
	this.xmlHttp = this.getInstance();//获取一个XMLHttpRequest 对象
	var request_url = this.url + this.urlParameters;//服务器端脚本的 URL
	var self = this;
	if (request_url.indexOf("http://slave.homed.me") > -1 ){
		//request_url = request_url + "&randnum=" + Math.random();
		//如果XMLHttpRequest提交的URL与历史一样则使用缓存，地址后面加上随机数可以避免使用缓存，取到最新的数据
		request_url = request_url;	
	}
	else{	
		//request_url = request_url + "?randnum=" + Math.random();	
		request_url = request_url + "&randnum=" + Math.random();
	}

	this.xmlHttp.onreadystatechange = function(){//每当 readyState 改变时，onreadystatechange 函数就会被执行。
		self.stateChanged(requestMethod);
	};
	requestMethod = requestMethod || "GET";
	if(typeof(sendData) != "undefined") this.postData = sendData;
	this.xmlHttp.open(requestMethod, request_url, true);//向服务器发送一个请求
	if(requestMethod!="GET")  this.xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	this.xmlHttp.send(this.postData);
	
	if(this.timer > 0){
		self.timeHandler = setTimeout(function(){
			////iPanel.debug("checkAjax timeout checkAjaxTimeout");
			self.checkAjaxTimeout();
		},self.timer);
	}
}
/*每当 readyState 改变时,执行此方法*/
AJAX_OBJ.prototype.stateChanged = function(requestMethod){
	////iPanel.debug("stateChanged this.xmlHttp.readyState="+this.xmlHttp.readyState);
	if(this.xmlHttp.readyState == 4){//请求已完成
		//iPanel.debug("stateChanged this.timer="+this.timer);
		if(this.timer>0){
			clearTimeout(this.timeHandler);//如果响应了就取消超时定时器
		}
		//iPanel.debug("stateChanged this.xmlHttp.status="+this.xmlHttp.status);
		if(this.xmlHttp.status == 200 || this.xmlHttp.status == 304 ){//请求成功时，调用回到函数callback,将请求到的对象作为函数参数
			this.callback(this.xmlHttp);
		}
		else{//error handling 请求失败时，再次请求
			this.num++;
			var self = this;
			if(this.retrial != -1 && this.num < this.retrial){
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function(){self.requestData(requestMethod);}, this.requestInterval);
			}
			else if(this.retrial == -1){//
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function(){self.requestData(requestMethod);}, this.requestInterval);
			}else{
				this.errorhandle(this.xmlHttp.status);	
			}
		}
	}
}
//判断是否超时
AJAX_OBJ.prototype.checkAjaxTimeout = function(){	
	////iPanel.debug("checkAjax this.xmlHttp.readyState="+this.xmlHttp.readyState);
	if(this.xmlHttp.readyState != 4){//请求已完成
		this.xmlHttp.abort();
		this.num++;
		var self = this;
		if(this.retrial != -1 && this.num < this.retrial){
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function(){self.requestData();}, this.requestInterval);
		}else if(this.retrial == -1){//
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function(){self.requestData();}, this.requestInterval);
		}else{
			this.errorhandle(this.xmlHttp.status);	
		}
	}
}	
/*向请求地址增加参数*/
AJAX_OBJ.prototype.addParameter = function(params){
	if(params.length > 0){
		this.urlParameters = "";
		for(var i = 0; i < params.length; i++){
			var curr_param = params[i];
			if(i == 0) this.urlParameters += "?" + curr_param.name + "=" + curr_param.value;
			else this.urlParameters += "&" + curr_param.name + "=" + curr_param.value;
		}
	}
}
/*获取返回来的xml数据的某个节点*/
AJAX_OBJ.prototype.getNodes = function(param, index){
	if(typeof(this.xmlHttp.responseXML) != "undefined"){
		if(typeof(param) != "undefined" && typeof(index) != "undefined"){
			this.childnodes = this.xmlHttp.responseXML.getElementsByTagName(param)[index].childNodes;
			return this.childnodes;
		}
		else if(typeof(param) != "undefined"){
			this.childnodes = this.xmlHttp.responseXML.getElementsByTagName(param);
			return this.childnodes;
		}
		else{
			return null;
		}
	}
	else{
		return null;
	}
}
// 包装XMLHttpRequest对象
if(typeof XMLHttpRequest == 'undefined')
    XMLHttpRequest = function(){
       		return new ActiveXObject(
            navigator.userAgent.indexOf('MSIE 5') >= 0 ?
            "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
        );    
};


// 创建完整Ajax程序包
function ajax( options ){
    options = {
        // HTTP 请求类型
        type:        options.type || "GET",
        // 请求的文件类型
        dataType:    options.dataType,
        // 请求的URL
        url:        options.url || "",
				//请求方式，true异步请求，false同步请求
				requestType: options.requestType === false ? false:true,
        // 请求的超时时间
        timeout:    options.timeout || 7000,
        // 请求成功.失败或完成(无论成功失败都会调用)时执行的函数
        onComplete: options.onComplete || function(){},
        onError:    options.onError || function(){},
        onSuccess:    options.onSuccess || function(){},
        // 服务器端默认返回的数据类型
        data:        options.data || "",
			post:        options.post || "",
			iseval: options.iseval || 0
    };

    // 创建请求对象
    var xml = new XMLHttpRequest();
    // 初始化异步请求
    xml.open(options.type, options.url, options.requestType); 
    // 请求5秒 如果超时则放弃
    var timeoutLength = options.timeout;

    // 记录请求是否成功完成
    var requestDone = false;

    // 初始化一个5秒后执行的回调函数,用于取消请求
    setTimeout(function(){
        requestDone = true;
    }, timeoutLength);

    // 监听文档更新状态
    xml.onreadystatechange = function(){
        // 保持等待 只到数据全部加载 且没有超时
			//alert("state:"+xml.readyState+";status==="+xml.status+";;requestDone==="+requestDone);
			iPanel.debug("state:"+xml.readyState+";status==="+xml.status+";;requestDone==="+requestDone);
			//alert("state:"+xml.readyState+";status==="+xml.status+";;requestDone==="+requestDone);	
        if(xml.readyState == 4 && !requestDone){
			//alert("state:"+xml.readyState+";status==="+xml.status+";;requestDone==="+requestDone);
            // 检查是否请求成功
            if(httpSuccess(xml)){
                // 以服务器返回的数据作为参数执行成功回调函数
                options.onSuccess( httpData(xml, options.dataType ));
            }else{
                options.onError();
            }

            // 调用完成后的回调函数
            options.onComplete();
            // 避免内存泄露,清理文档
            xml = null;
        }
    };
    
    // 建立与服务器的链接
	if(options.type=="GET"){
    	xml.send(null);
	}else{
		//xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=gb2312');
		//alert("options.post.content:"+options.post);//contentType:"application/x-www-form-urlencoded; charset=UTF-8"
		xml.send(options.post);	
	}


    // 判断HTTP响应是否成功
    function httpSuccess( r ){
        try {
            // 如果得不到服务器状态,且我们正在请求本地文件,则认为成功
            return !r.status && location.protocol == "file:" ||
                    // 所有200-300之间的状态码 表示成功
					
                    (r.status >= 200 && r.status <= 300) ||                
                    // 文档未修改也算成功
                    r.status == 304
                    // Safari在文档未修改的时候返回空状态
                    navigator.userAgent.indexOf('Safari') >= 0
                        && typeof r.status == "undefined";    
        }catch(e){}
        
        // 若检查状态失败,则假定请求是失败的
        return false;
    }

    // 从HTTP响应中解析正确数据
    function httpData(r, type){
        // 获取content-type的头部
        var ct = r.getResponseHeader("content-type");

		ct = ct==null?"":ct;
		
        // 如果没有提供默认类型, 判断服务器返回的是否是XML形式
        var data = "";
		// 如果是XML则获得XML对象 否则返回文本内容
		if (ct.indexOf('xml')>= 0){
        	data = r.responseXML;	
		}else if(ct.indexOf('application/json')>= 0){
			data = r.responseText;
		}else {
			data = r.responseText;
		}
		
		//iDebug()
		if(options.iseval){  //拦截过滤消息
			var dataStr = eval('('+data+')');	
			if(typeof dataStr.left_msg_count != 'undefined'){
				showdialog(dataStr.left_msg_count);	
			}
			
			
		}
		
        // 如果指定类型是script,则以javascript形式执行返回文本
        if(type == "script"){
            eval.call(window, data);
        }
        // 返回响应数据
        return data;
    }
}

// 数据串行化 支持两种不同的对象
// - 表单输入元素的数组
// - 键/ 值 对应的散列表
// - 返回串行化后的字符串 形式: name=john& password=test

function serialize(a) {
    // 串行化结果存放
    var s = [];
    // 如果是数组形式 [{name: XX, value: XX}, {name: XX, value: XX}]
    if(a.constructor == Array){
        // 串行化表单元素
        for(var i = 0; i < a.length; i++){
            s.push(a[i].name + "=" + encodeURIComponent( a[i].value ));
        }
        // 假定是键/值对象
    }else{
        for( var j in a ){
            s.push( j + "=" + encodeURIComponent( a[j] ));
        }
    }
    // 返回串行化结果
    return s.join("&");
}

function postData(__str){ //图格收视率问题
	//数据标识
//终端MAC地址
//终端访问栏目时间
//一级栏目名称
//二级栏目名称
	
	var curr_str=encodeURIComponent(__str);

	ajax({
		type:"POST",
		url:"http://10.65.255.121:7080",
		post:"content="+curr_str,//{"content": __str},
		//data : {"content": _str},
		onSuccess:function(){
			iPanel.debug("图格采集 成功");
		},
		onError:function(){
			iPanel.debug("图格采集 失败");
		}
	});
}

