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
		post:        options.post || ""
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
		
		//add("state:"+xml.readyState);
        if(xml.readyState == 4 && !requestDone){
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
		xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
        // 如果没有提供默认类型, 判断服务器返回的是否是XML形式
        var data = "";
		// 如果是XML则获得XML对象 否则返回文本内容
		if (ct.indexOf('xml')>= 0){
        	data = r.responseXML	
		}else if(ct.indexOf('application/json')>= 0){
			data = r.responseText;
		}else {
			data = r.responseText;
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