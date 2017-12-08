 /**
 * AJAX模块的封装   
*/
var objPool = [];
objPool[0] = createXMLHttpRequest();
objPool[1] = createXMLHttpRequest();
objPool[2] = createXMLHttpRequest();
objPool[3] = createXMLHttpRequest();
objPool[4] = createXMLHttpRequest();
objPool[5] = createXMLHttpRequest();
//===========================================
//var ajax_url_0="http://192.168.36.65:8080/TVPhotosystem/";

function createXMLHttpRequest(){
	var xmlh = null;
	xmlh = new XMLHttpRequest();
	return xmlh;
}

function AJAX_OBJ(url, callback,otherInfo){
	this.xmlHttp = null;
	this.url = url;
	this.callback = callback;
	this.otherInfo = typeof(otherInfo) == "undefined"?-1:otherInfo;//这里用来实现在返回函数中添加参数
}

AJAX_OBJ.prototype.requestData = function(type,postStr){
	this.xmlHttp = this.getInstance();
	var request_url = this.url;
	var self = this;
	this.xmlHttp.onreadystatechange = function(){
		self.stateChanged();
	};
	if (typeof(type) != "undefined" && type == "true")
	{
		//iPanel.debug("requestData true");
		if (typeof(postStr) != "undefined")
		{
			this.xmlHttp.open("POST", request_url, true);//异步执行，不用等到服务器返回就可以继续执行接下来的语句
		}
		else
		{
			this.xmlHttp.open("GET", request_url, true);//异步执行，不用等到服务器返回就可以继续执行接下来的语句
		}
	}
	else
	{
		//iPanel.debug("requestData false");
		if (typeof(postStr) != "undefined")
		{
			this.xmlHttp.open("POST", request_url, false);//同步执行,收到服务器返回会才会继续执行接下来的语句
		}
		else
		{
			this.xmlHttp.open("GET", request_url, false);//同步执行,收到服务器返回会才会继续执行接下来的语句
		}
	}
	if (typeof(postStr) != "undefined")
	{
		this.xmlHttp.send(postStr);
	}
	else
	{
		this.xmlHttp.send(null);
	}
}

AJAX_OBJ.prototype.getInstance = function(){
	for (var i = 0; i < objPool.length; i ++)
	{
		if ( objPool[i].readyState == 4||objPool[i].readyState == 0)
		{
			return objPool[i];
		}
	}
	objPool[objPool.length] = createXMLHttpRequest();
	return objPool[objPool.length - 1];
}

AJAX_OBJ.prototype.stateChanged = function()
{
	//iPanel.debug("this.xmlHttp.readyState="+this.xmlHttp.readyState )
	if(this.xmlHttp.readyState == 4)
	{
		//iPanel.debug("this.xmlHttp.status="+this.xmlHttp.status )
		if(this.xmlHttp.status == 200)
		{
			//iPanel.debug("ok,come back")
			if(this.otherInfo == -1){
				this.callback(this.xmlHttp);
			}else{//这样可以实现在返回函数中添加参数,提高代码的共用度
				//iPanel.debug("this.otherInfo=="+this.otherInfo);
				this.callback(this.xmlHttp,this.otherInfo);
			}
		}else//error handling
		{
			//iPanel.debug("get date error and this.xmlHttp.status="+this.xmlHttp.status);
			//iPanel.overlayFrame.location.href = "request_error.htm?"+this.xmlHttp.status;
		}
	}
}
