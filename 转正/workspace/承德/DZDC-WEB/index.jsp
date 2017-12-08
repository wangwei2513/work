<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="util.Util" %>
<title>无标题文档</title>
<%
	String url = Util.getValue("index_url");
	String image_url = Util.getValue("image_url");
	String home_url=Util.getValue("home_url");
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<style type="text/css">
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
	border:0px;
}
</style>

<script type="text/javascript" src="<%=basePath%>js/backIpanel.js"></script>
<script>
var httpurl = window.location.href;
var mid_position = GET("mid_position");//首页选中框
var down_position = 0;
var area = 0;
var top0 ="";
var top1 ="";
var topxx ="";
var btnArray = [	
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}/*, //退出
	{lose_f:"<%=basePath%>/images/main1.gif",get_f:"<%=basePath%>/images/main2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}, //主页
	{lose_f:"<%=basePath%>/images/help1.gif",get_f:"<%=basePath%>/images/help2.gif",url:""}//帮助	
	
	
	
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}, //退出
	{lose_f:"<%=basePath%>/images/main1.gif",get_f:"<%=basePath%>/images/main2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}, //主页
	{lose_f:"<%=basePath%>/images/help1.gif",get_f:"<%=basePath%>/images/help2.gif",url:""}//帮助	*/
];
var url=["<%=basePath%>lb.jsp?mid_position=0","<%=basePath%>lb.jsp?mid_position=1","<%=basePath%>lb.jsp?mid_position=2"];





document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
		case 1:		// up
		case 38:
		if(area == 1){
				area = 0;
				init_mid();
				clear_down();
			}
			return false;
			break;
		case 2:		// down
		case 40:
		if(area == 0){
				area = 1;
				init_down();
				clear_mid();
			}
			return false;
			break;
		case 3:		// left
		case 37:
			if(area == 0 && mid_position >0){
				change_mid(-1);
			}else if(area == 1 && down_position >0){
				change_down(-1);
			}
			return false;
			break;
		case 4:		// right
		case 39:
			if(area == 0 && mid_position <2){
				change_mid(1);
			}else if(area == 1 && down_position <btnArray.length-1){
				change_down(1);
			}
			return false;
			break;
		case 13:
			do_select();
			return false;
			break;
		case 340:
		case 8:
			goBackUrl();
			//window.location.href = "http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm";
			return false;
			break;
		case 339:
		case 27:
			goBackUrl();
			//window.location.href = "http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm";//exit to portal
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

	var m_json;
function ajax_js(){
	var url = '<%=url%>';
	//var url="js/index.js";
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.open('GET',url, false);
	oXmlHttp.onreadystatechange = function(){
		if ( oXmlHttp.readyState == 4 )  {
			if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {
			eval("m_json="+oXmlHttp.responseText);
			topxx = m_json.home_tagline;
			//alert(topxx);
			top0 = topxx.split("，")[0];
			top1 = topxx.split("，")[1];
			var maq = m_json.home_marquee;
			if(topxx != null && topxx.length > 0){
				$("top0").innerHTML = top0;
				$("top1").innerHTML = top1;
			}else{
				alert("0列表为空，请返回");
			}
			if(maq != null && maq.length> 0){
				$("maq").innerHTML = maq;
			}else{
				alert("1列表为空，请返回");
			}
			var len =  m_json.home_menu.length;
			if(len >0){
			for (var i=0; i< len;i++){
					$("text"+i).innerHTML= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+m_json.home_menu[i].home_content;
					$("img"+i).src='<%=image_url%>'+m_json.home_menu[i].home_pic;//将标题放入数组
			}
			}else{
				alert("2列表为空，请返回");
				}
									
			 } else { 
	
			 } 
		}
	} 
	oXmlHttp.send(null); 
}
function ajax_view(){
	var oXmlHttp1 = new XMLHttpRequest(); 
	oXmlHttp1.open('GET','<%=home_url%>',false);
	oXmlHttp1.send(null); 
}
function init_mid(){
	$("focus"+mid_position).style.visibility="visible";	
}
function clear_mid(){
	$("focus"+mid_position).style.visibility="hidden";	
}
function change_mid(num){
	clear_mid();
	mid_position+=num;
	init_mid();
}
function change_down(pos){
	clear_down();
	down_position=down_position+pos;
	init_down();
}
function init_down(){	
    $("btn"+down_position).src=btnArray[down_position].get_f;   
}
function clear_down(){	
    $("btn"+down_position).src=btnArray[down_position].lose_f;   
}
function do_select(){
	if(area == 0){
		window.location.href= url[mid_position];
	}else{
		window.location.href = btnArray[down_position].url;
	}
}

function init(){
	ajax_js();
	init_mid();
	ajax_view();
}
</script>
</head>
<body style="width:1280px;height:720px; background-image:url(<%=basePath%>/images/index.jpg)" onload="init();">
<div style="position:absolute; width:380px; height:50px; left:843px; top:59px; vertical-align:middle; line-height:60px;">
  <font id="top0" style="color:#075ba8;font-size:34px; font-weight:900;"></font>&nbsp;&nbsp;&nbsp;&nbsp;<font id="top1" style="color:#075ba8;font-size:34px; font-weight:900;"></font></div>
<img id="focus0" src="<%=basePath%>/images/index_focus.png" style="position:absolute; top:133px; left:56px; visibility:hidden"/>
<img id="focus1" src="<%=basePath%>/images/index_focus.png" style="position:absolute; top:133px; left:451px; visibility:hidden"/>
<img id="focus2" src="<%=basePath%>/images/index_focus.png" style="position:absolute; top:133px; left:846px; visibility:hidden"/>

<img id="img0" src="<%=basePath%>/images/__.gif" style="position:absolute; top:225px; left:78px;"/>
<img id="img1" src="<%=basePath%>/images/__.gif" style="position:absolute; top:225px; left:473px;"/>
<img id="img2" src="<%=basePath%>/images/__.gif" style="position:absolute; top:225px; left:868px;"/>

<div style="position:absolute; width:327px; height:163px; left:79px; top:394px;line-height:43px; vertical-align:bottom;">
  <font id="text0" style="font-size:24px;"></font></div>


<div style="position:absolute; width:328px; height:163px; left:477px; top:394px;line-height:43px; vertical-align:bottom;">
  <font id="text1" style="font-size:24px;"></font></div>

<div style="position:absolute; width:330px; height:163px; left:871px; top:395px;line-height:43px; vertical-align:bottom;">
  <font id="text2" style="font-size:24px;"></font></div>

<div style="position:absolute; width:711px; height:39px; left:119px; top:630px; vertical-align:middle; line-height:39px; font-size:24px;">
  <marquee  id="maq" direction="left" width="720" scrollamount="2" behavior="scroll" scrolldelay="50"></marquee>
</div>
<div style="position:absolute; width:770px; height:51px; left:435px; top:623px;">
<table border="0" cellpadding="0" cellspacing="0" height="51px" width="770px" >
        <tr>
         <td width="181" align="right"><img/></td>
         <td width="139" align="right"><img/></td>
         <td width="111" align="right"><img/></td>
         <td width="113" align="right"><img id="btn0" src="<%=basePath%>/images/quit1.gif"></img></td><!--
         <td width="113" align="right"><img id="btn0" src="<%=basePath%>/images/quit1.gif"></img></td>
         <td width="112" align="right"><img id="btn1" src="<%=basePath%>/images/main1.gif"></img></td>

         <td width="114" align="right"><img id="btn2" src="<%=basePath%>/images/help1.gif"></img></td>-->
        </tr>
  </table>
</div>
<form method="post" id="formcommit" action="">
	<input type="hidden" id="title" name="title"/><br/><!--标题  -->
	<input type="hidden" id="img" name="img"/><br/><!--图片  -->
 	<input type="hidden" id="text" name="text"/><br/><!--简介 -->
</form>
</body>
</html>
