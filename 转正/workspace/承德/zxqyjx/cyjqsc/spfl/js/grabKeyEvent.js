
var haveBackUrl = false;
/*==============================���ؼ�����==============================================*/
function goExitBack(){
	var portalUlr = GP.getBackUrl();
	var appBackUrl  = GP.getBackUrl("appBackUrl");
	iDebug("3grid--grabKeyEvent.js--goExitBack--portalUlr="+portalUlr+"--appBackUrl="+appBackUrl+",haveBackUrl:"+haveBackUrl+",backUrl:"+backUrl+",typeof goPortal:"+(typeof goPortal));
	if(appBackUrl){
		if(typeof gotoPage != "undefined"){
			gotoPage(appBackUrl);
		}else {
			iPanel.mainFrame.location.href = appBackUrl;
		}
		GP.setBackUrl("appBackUrl","");
	}else if(portalUlr!=""){
		gotoPortal();
		 GP.setBackUrl(window.location.href,"");
	}if(haveBackUrl){
		window.location.href = backUrl;
	}else if(typeof goPortal=="function"){
		goPortal();
	}else{
		parent.goBack();
	}
}
/*==============================�˵�������==============================================*/
var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
function goExitMenu(){
	iDebug("==3grid--grabKeyEvent.js-=fun:goExitMenu()===navigatorFlag:"+navigatorFlag);	
	if(navigatorFlag == "iPanel"){
		if(navigator.appName.indexOf("iPanel") == -1){
			GP.getCookie("index_secNew_menuPos",0);
			GP.getCookie("index_secNew_menuDataPos",0);
			GP.getCookie("index_secNew_isBack","1");
			GP.getCookie("index_secNew_focusArea",1);
			GP.getCookie("index_secNew_topPos",0);
		}else{
			iPanel.eventFrame.index_secNew_menuPos = parseInt(0,10);
			iPanel.eventFrame.index_secNew_menuDataPos = parseInt(0,10);
			iPanel.eventFrame.index_secNew_isBack = parseInt(1,10);
			iPanel.eventFrame.index_secNew_focusArea = parseInt(1,10);
			iPanel.eventFrame.index_secNew_topPos = parseInt(0,10);
		}
		if(typeof gotoPortal != "undefined"){
			gotoPortal(iPanel.eventFrame.webUiUrl,true);
		}else{
			window.location.href = iPanel.eventFrame.webUiUrl;
		}
	}else{
		window.location.href = "http://webclient.dzcatv.com/application/browser/homedPortal/index.php";
	}
	return false;
}
/*
*@author: huangjm 2012.12.24
*@desc:	��Ҫ�ü�ȫ�ֱ�����iPanel����eventFrame���ǣ�webkit�ں���window.localStorage���ǣ�������cookie����
*/
(function(){
	//document.domain = "reheyun.cn";
	var globalPos=function(){
		this.index = "";
		/**************ȡ�õ�ǰ��������汾*******************/
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
		
		/**************����ȫ�ֱ���*******************/
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
					window.localStorage.setItem(index,value);
				}else{
					this.setCookie(index, value);
				}
			}
		};
		
		/**************��ȡȫ�ֱ���*******************/
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
					str = window.localStorage.getItem(index);
					if(str) tmp = str;
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
		
		/****************���ñ���*****************/
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
	
		/***********�趨Cookieֵ***************/
		this.setCookie=function(name, value){
			var expdate = new Date();
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : 5*12*30*24*60*60;
			var path = (argc > 3) ? argv[3] : "/";
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
			var  navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
			document.cookie = name + "=" + escape(value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
			+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
			+((secure == true) ? "; secure" : "");
		};
		
		/**********���Cookie������ֵ**************/
		this.getCookie=function(_name){
			var url = document.cookie;
			if(new RegExp(".*\\b"+_name+"\\b(\\s*=([^&;]+)).*", "gi").test(url)){
				return unescape(RegExp.$2);
			}else{
				return "";
			}
		}
	
		 /**********ɾ��Cookie**************/
		this.delCookie=function(name){
			var exp = new Date();
			exp.setTime (exp.getTime() - 1);
			var cval = this.getCookie(name);
			document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
		}
		this.setBackUrl=function(toUrl,currUrl){
			var startPos = toUrl.lastIndexOf("/")+1;
			var endPos = toUrl.indexOf("?");
			if(endPos<startPos) endPos = toUrl.length;
			this.set(toUrl.substring(startPos,endPos),currUrl);
			iDebug("setBackUrl()---name="+toUrl.substring(startPos,endPos)+",value="+currUrl);
		}
		this.getBackUrl=function(currUrl){
			if(!currUrl) currUrl = window.location.href;
			var startPos = currUrl.lastIndexOf("/")+1;



			var endPos = currUrl.indexOf("?");
			if(endPos<startPos) endPos = currUrl.length;
			var tmpUrl = this.get(currUrl.substring(startPos,endPos));
			iDebug("getBackUrl()---name="+currUrl.substring(startPos,endPos)+",backUrl="+tmpUrl);
			return tmpUrl;
		}
	};		
	
	GP = new globalPos();
})();
/**************** URL�ӽ����װ - end ******************/