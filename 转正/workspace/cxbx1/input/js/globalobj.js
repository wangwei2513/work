
/*
*@author: huangjm 2012.12.24
*@desc:	主要用记全局变量，iPanel是用eventFrame来记，webkit内核用window.localStorage来记，其它用cookie来记
*/
(function(){
	var globalPos=function(){
		this.index = "";
		/**************取得当前的浏览器版本*******************/
		this.getBrowser=function(){
			var tmp = "";
			var str = navigator.appName;
			if(str.indexOf("iPanel") != -1){
				tmp = "iPanel";
			}else if(str.indexOf("Miscrosoft") != -1){
				tmp = "Miscrosoft";
			}else if(str.indexOf("Google") != -1){
				tmp = "Google";
			}else if(str.indexOf("Netscape")!= -1){
				tmp = "Netscape";
			}else if(str.indexOf("Opera")!=-1){
				tmp="Opera";
			}
			return tmp;
		};
		
		/**************设置全局变量*******************/
		this.set = function(){
			var index = arguments[0]+"";
			var value = arguments[1]+"";
			value = value.replace("|", "#0#0#");
			//console.log("----index="+index+"--value="+value)
			this.index = index;
			if(this.getBrowser()=="iPanel"){
				if(typeof iPanel.eventFrame.__globalPos == "undefined"){
					iPanel.eventFrame.__globalPos={};
				}
				iPanel.eventFrame.__globalPos[index] = value;
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					storage[index]=value;
				}else{
					this.setCookie(index, value);
				}
			}
		};
		
		/**************获取全局变量*******************/
		this.get = function(){
			var index=arguments[0];
			var str = "";
			var tmp = "";
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					str = iPanel.eventFrame.__globalPos[index];	
					tmp = str;
				}
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					str = storage[index];
					if(typeof str != "undefined") tmp = str;
				}else{
					str= this.getCookie(index);
					if(str.indexOf("|") != -1){
					  tmp = str.replace("#0#0#", "|");
					}
					tmp = str;
				}
			}	
			//var tmp  = decodeURI(str);
			return tmp;
		};
		
		/****************重置变量*****************/
		this.reset=function(){
			var index=arguments[0];
			if(this.getBrowser()=="iPanel"){
				if(iPanel.eventFrame.__globalPos){
					iPanel.eventFrame.__globalPos[index] = "";	
				}
			}else{
				if(window.localStorage){
					var storage = window.localStorage;
					storage[index]="";
				}else{
					this.delCookie(index);
				}
			}	
		};
	
		/***********设定Cookie值***************/
		this.setCookie=function(name, value){
			var expdate = new Date();
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : null;
			var path = (argc > 3) ? argv[3] : "/";
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
			document.cookie = name + "=" + escape(value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
			+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
			+((secure == true) ? "; secure" : "");
		};
		
		/**********获得Cookie解码后的值**************/
		this.getCookie=function(_name){
			var url = document.cookie;
			if(new RegExp(".*\\b"+_name+"\\b(\\s*=([^&;]+)).*", "gi").test(url)){
				return unescape(RegExp.$2);
			}else{
				return "";
			}
		}
	
		 /**********删除Cookie**************/
		this.delCookie=function(name){
			var exp = new Date();
			exp.setTime (exp.getTime() - 1);
			var cval = this.getCookie(name);
			document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
		}
	};		
	
	GP = new globalPos();
})();