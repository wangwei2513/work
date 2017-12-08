<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page pageEncoding="utf-8"%>
<%@ page contentType="text/html; charset=utf-8"%>
<title>提示</title>
<style type="text/css">
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
	border:0px;
}
</style>
<script>
var httpurl = window.location.href;
var mid_position = GET("mid_position");//首页选中框
var right_position = GET("right_position");//首页选中框
var questionId = GET("questionId");//问题id
var cu_page =GET("page");//问题条目页
var mark = 0;
var Request = new function(){    
	this.search=window.location.search;    	
	this.QueryString = new Array();    	
	var tmparray = this.search.substr(1,this.search.length).split("&")    
	for(var i = 0;i<tmparray.length;i++)    
	{    
		var tmpStr2 = tmparray[i].split("=");    
		this.QueryString[tmpStr2[0]] = tmpStr2[1];    
	}       
}
	
var tagline = Request.QueryString["tagline"];
var markq = Request.QueryString["mark"];
window.resizeTo(572,329);//width heigth
window.moveTo(400,222);
document.onkeypress = grabEvent;
document.onirkeypress = grabEvent;

function grabEvent(event){
	var keycode = event.which;
	switch(keycode){
		case 1://up	
			return false;
			break;
		case 2://down
			return false;
			break;
		case 3://left
			return false;
			break;
		case 4://right
			 low=1;
			 return false;
			 break;
		case 13://enter
			do_select();
			 return false;
			break;
		case 339://exit
			return false;
			break;
		case 340://back
			return false;
			break;
		case 372://page up
			return false;
			break;
		case 374:
		case 373://page down
			 return false;
			 break;
		case 375:
			return false;
			break;
		case 832://red
			return false;
			break;
		case 833://green
			return false;
			break;
		case 834://yellow
			return false;
			break;
		case 835://blue
			return false;
			break;
		case 800://KEY_A
			return false;
			break;
		case 801://KEY_B
			return false;
			break;
		case 561:
		case 802://KEY_C
			return false;
			break;
		case 803://KEY_D
			return false;
			break;
		case 512://KEY_HOME_PAGE  主页
			if(typeof gotoPortal != "undefined") gotoPortal();//强制重新打开一次
			  else window.location.href = iPanel.eventFrame.webUiUrl;
		    //window.location.href = "http://10.191.226.162:8080/routing/index.htm";
			return false;
			break;
		case 573:
			return false;//屏蔽列表键，防止误按，退出系统
			break;		
		default:
return false;
break;
	}
}
function GET(id){
	var url = httpurl.split("?");	
	if(typeof(url[1])=="undefined")return 0;
	var returl = url[1];	 
	var tt = returl.split("&");
	var ret = 0;
	for(var i=0;i< tt.length ;i++){
		var ta = tt[i].split("=");	
		if(ta[0]== id && ta[1] !="undefined"){
			ret = parseInt(ta[1]);
		}
	}	
	return ret ;
}
function $(id){
	return document.getElementById(id);
}
function do_select(){
	//alert(markq);
	window.location.href="jg.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId+"&mark="+markq;
	mark = 1;
	if(mark==1){
		//iPanel.overlayFrame.close();
	}
	
}
</script>
</head>

<body>
<div style="position:relative; width:573px; height:333px; background-image:url(images/1.png);margin:200px auto;"></div>
</body>
</html>
