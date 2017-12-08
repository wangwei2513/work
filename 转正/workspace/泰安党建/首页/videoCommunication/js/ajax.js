if(typeof XMLHttpRequest == 'undefined')
    XMLHttpRequest = function(){
       		return new ActiveXObject(
            navigator.userAgent.indexOf('MSIE 5') >= 0 ?
            "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
        );    
};


function ajax( options ){
    options = {
        type:        options.type || "GET",
        dataType:    options.dataType,
        url:        options.url || "",
 	requestType:options.requestType === false ? false:true,
        timeout:    options.timeout || 5000,
        onComplete: options.onComplete || function(){},
        onError:    options.onError || function(){},
        onSuccess:    options.onSuccess || function(){},
        data:        options.data || "",
        post:        options.post || ""
    };
    var xml = new XMLHttpRequest();
    ////iDebug("zhaoql:ajax--xml="+xml);
    xml.overrideMimeType("text/html; charset=gbk");//utf-8
    xml.open(options.type, options.url, true); 
    var timeoutLength = options.timeout;
    var requestDone = false; 
    setTimeout(function(){
        requestDone = true;
    }, timeoutLength);
  
    xml.onreadystatechange = function(){
	////iDebug(">>>zhaoql:ajax--statetChange--state="+xml.readyState+"|requestDone="+requestDone);
        if(xml.readyState == 4 && !requestDone){
	    ////iDebug(">>>zhaoql:ajax--httpSuccess(xml)="+httpSuccess(xml));
            if(httpSuccess(xml)){
		////iDebug(">>>zhaoql:ajax--response="+httpData(xml, options.dataType));
                options.onSuccess( httpData(xml, options.dataType ));
            }else{
                options.onError();
            }
            options.onComplete();
            xml = null;
        }
    };
   
    if(options.type=="GET"){
    	xml.send(null);
    }else{
	xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xml.send(options.post);	
}
function httpSuccess( r ){
        try {  
	////iDebug(">>>zhaoql:ajax--status="+r.status);
            return !r.status && location.protocol == "file:" || (r.status >= 200 && r.status <= 300) || r.status == 304 || navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status == "undefined";    
        }catch(e){}
        return false;
    }

function httpData(r, type){
        var ct = r.getResponseHeader("content-type");
	////iDebug(">>>zhaoql:ajax--ct="+ct);
        var data = !type && ct && ct.indexOf('xml') >= 0;
        data = type == "xml" || data ? r.responseXML : r.responseText;
	////iDebug(">>>zhaoql:ajax--responseText="+data);
        if(type == "script"){
            eval.call(window, data);
        }      
        return data;
    }
}

function serialize(a) {
    var s = [];
    if(a.constructor == Array){
        for(var i = 0; i < a.length; i++){
            s.push(a[i].name + "=" + encodeURIComponent( a[i].value ));
        }
    }else{
        for( var j in a ){
            s.push( j + "=" + encodeURIComponent( a[j] ));
        }
    }
    return s.join("&");
}