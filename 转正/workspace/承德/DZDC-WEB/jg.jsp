<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page pageEncoding="utf-8"%>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="util.Util" %>
<title>无标题文档</title>
<style type="text/css">
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px; 
	border:0px;
}
</style>
<script src="js/ajax.js"></script>
<script>
var httpurl = window.location.href;
var mid_position = GET("mid_position");//首页选中框
var right_position = GET("right_position");//首页选中框
var questionId = GET("questionId");//问题id
var cu_page =GET("page");//问题条目页
var tpage = 1;
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
//获取智能卡号
var CAID = function(){
	var tmpCardId = "";
	var browserType = getBrowserType();
	if(browserType == "iPanel"){
		tmpCardId = CA.card.serialNumber;
	}else if(browserType == "Inspur"){
		tmpCardId = iSTB.settings.get("sys:ca0:cardnumber");
	}	
	if(tmpCardId==null||tmpCardId=="")tmpCardId=8002088000222139;
	return tmpCardId;
};
var t_page = 0;
var down_position = 0;
var area = 0;
var que ="";
var temp = 0;
<%
String view_url = Util.getValue("view_url");
request.setCharacterEncoding("utf-8");
//String tagline = request.getParameter("tagline");
//tagline = new String(tagline.getBytes("iso-8859-1"),"utf-8");
//String tagline1 = tagline.split("，")[0]+"&nbsp;&nbsp;&nbsp"+tagline.split("，")[1];
%>
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
	
var tagline = decodeURI(Request.QueryString["tagline"]);
var markq = Request.QueryString["mark"];
var btnArray = [	
            	{lose_f:"images/previous1.gif",get_f:"images/previous2.gif",url:""}, //上一页
            	{lose_f:"images/next1.gif",get_f:"images/next2.gif",url:""}, //下一页
            	{lose_f:"images/back1.gif",get_f:"images/back2.gif",url:"nr"+markq+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page},//返回
            	{lose_f:"images/quit1.gif",get_f:"images/quit2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}
				
				
            	/*{lose_f:"images/previous1.gif",get_f:"images/previous2.gif",url:""}, //上一页
            	{lose_f:"images/next1.gif",get_f:"images/next2.gif",url:""}, //下一页
            	{lose_f:"images/back1.gif",get_f:"images/back2.gif",url:"nr"+markq+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page},//返回
            	{lose_f:"images/quit1.gif",get_f:"images/quit2.gif",url:"nr"+markq+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page}, //退出
            	{lose_f:"images/main1.gif",get_f:"images/main2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}, //主页
            	{lose_f:"images/button1.gif",get_f:"images/button2.gif",url:"index.jsp?mid_position="+mid_position}, //首页
            	{lose_f:"images/help1.gif",get_f:"images/help2.gif",url:"http://172.16.252.163/helpAll/help/help.htm?"+location.href}//帮助	*/
            ];
var arr = [{title:">生活调查>内容页"},{title:">在线投票>内容页"},{title:">申诉系统>内容页"}];
document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
		case 1://up	
		case 38://up	
			return false;
			break;
		case 2://down
		case 40://down
			return false;
			break;
		case 3://left
		case 37://left
			if(area == 0){
				if(t_page==1){
					if(down_position >2){
						change_down(-1);
					}
				}else if(t_page>1&&tpage==1){
					if(down_position >1){
						change_down(-1);
					}
				}else if(tpage>1&&tpage!=t_page){
					if(down_position > 0){
						change_down(-1);
					}
				}else{
					if(down_position >1){
						change_down(-1);
						if(down_position==1){
						$("btn1").src=btnArray[0].get_f;   
						}
					}
				}
									
			}
		   return false;
			break;
		case 4://right
		case 39://right
			if(area == 0 && down_position <btnArray.length-1){
				if(tpage == t_page){
					change_down(1);
					$("btn1").src=btnArray[0].lose_f; 
				}else{	
					change_down(1);
				}
			}
		return false;
			break;
		case 13://enter
			do_select();
			break;
			return false;
		case 339://exit
		case 8://exit
			window.location.href =btnArray[2].url;
			return false;
			break;
		case 340://back
		case 27://exit
			window.location.href =btnArray[2].url;
			return false;
			break;
		case 372://page up
		case 374:
		case 33:
			if(tpage>1){
					tpage--;	
					temp=1;	
					clear_down();
					clear_list();
					show_list();	
				}
			return false;
			break;
		case 373://page down
		case 375:
		case 34:
			if(tpage<t_page){
				tpage++;
				temp=0;
				clear_down();
				clear_list();
				show_list();
			}
			return false;
			break;
		case 832://red
			window.location.href =btnArray[5].url;
			return false;
			break;
		case 833://green
			return false;
			break;
		case 834://yellow
			return false;
			break;
		case 835://blue
			window.location.href =btnArray[6].url;
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
			//window.location.href =btnArray[4].url;
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
function show_time(){
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	h = (h > 9) ? h : "0" + h;
	m = (m > 9) ? m : "0" + m;
	s = (s > 9) ? s : "0" + s;
	var y = d.getFullYear();
	var M = d.getMonth() + 1;
	var D = d.getDate();
	M = (M > 9) ? M : "0" + M;
	D = (D > 9) ? D : "0" + D;
	document.getElementById("Time").innerText = y + "-" + M + "-" + D + " " + h + ":" + m ;
	window.setTimeout("show_time();",60000);
}
function show_button(){//初始化按钮
		if(t_page==1){
			$("btn0").style.visibility="hidden";
			$("btn1").style.visibility="hidden";
			down_position=2;
		}else if(t_page>1&&tpage==1){
			down_position=1;
			$("btn0").style.visibility="hidden";
			$("btn1").style.visibility="visible";
		}else if(tpage>1&&tpage!=t_page){
				$("btn0").style.visibility="visible";
				$("btn1").style.visibility="visible";
		}else if(tpage==t_page && t_page!=1){
					down_position=1;
					$("btn0").style.visibility="hidden";
					$("btn1").style.visibility="visible";
					$("btn1").src=btnArray[0].lose_f;
		}
}
function clear_list(){
	for(var i=0;i<3;i++){
		$("option"+i).innerHTML="";
		$("num"+i).innerHTML="";
		$("percent"+i).innerHTML="";
		$("rate"+i).src="images/__.gif";
		$("mark"+i).src="images/__.gif";
	}
}

function toPercent(data){  
	var ret="";
	var strData = parseFloat(data)*1000; 
	strData = Math.round(strData); 
	strData=strData/10;
	if(strData.toString().indexOf(".")==-1){
		ret = strData.toString()+".0%";   
	}else{ 
		ret = strData.toString()+"%";
	}    
	return ret;
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
		switch (down_position){
			case 0:
				if(tpage >0){
					tpage-=1;
					clear_list();
					show_list();
					temp=1;
					if(tpage ==1){
						$("btn1").src=btnArray[1].get_f;
						$("btn0").src=btnArray[0].lose_f;
						down_position = 1;
					}else{
						$("btn0").src=btnArray[0].get_f;
						$("btn1").src=btnArray[1].lose_f;
						down_position = 0;
					}
				}
			break;
			case 1:
				if(tpage<t_page){
					tpage+=1;
					clear_list();
					show_list();
						if(tpage ==t_page){
							$("btn1").src=btnArray[0].get_f;//
							$("btn0").src=btnArray[0].lose_f;
							down_position = 1;
						}else{
							$("btn1").src=btnArray[1].get_f;
							$("btn0").src=btnArray[0].lose_f;
							down_position = 1;
						}
					}else if(tpage ==t_page){
					tpage-=1;
					clear_list();
					show_list();
					if(tpage!=1){
							$("btn1").src=btnArray[1].lose_f;
							$("btn0").src=btnArray[0].get_f;
							down_position = 0;
					}else{
							$("btn0").src=btnArray[0].lose_f;
							$("btn1").src=btnArray[1].get_f;
							down_position = 1;
					}
				}
			break;
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				window.location.href = btnArray[down_position].url;
			break;
		}
	}
}
function ajax_text(){
	//alert("questionId    =="+questionId);
	//var url = "http://192.168.212.122:8080/DZDC-Manage/viewResultAction.action?questionId="+questionId;
	var url = '<%=view_url%>'+"?questionId="+questionId+"&caId="+CAID();
	//alert(url);
	//var url = "js/jgjg.js";
	var Ajax = new AJAX_OBJ(url,complete);
	Ajax.requestData("true");
	
	//var oXmlHttp = new XMLHttpRequest(); 
	//oXmlHttp.open('GET',url, true);
	//oXmlHttp.onreadystatechange = function() {
		
		//if ( oXmlHttp.readyState == 4 )  {
				
			//if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {
		
				//eval("var m_json="+oXmlHttp.responseText);
			//	que =  m_json.question_title;
		
				//if(que.length>32){
					//$("que").innerHTML='<marquee  id="maq" direction="left" width="1068" scrolladapt="tailAPPEAR" startposition="100%" scrollamount="1" behavior="scroll" scrolldelay="60">'+que+'</marquee>';
			//	}else{
				//	$("que").innerHTML=que;
			//	}
				
			//	show_list(m_json);
		//	}else{ 
			
		//	} 
	//	}
		
	//} 
//	oXmlHttp.send(null); 
}
var m_json;
function complete(xmlResponse){
	eval("m_json="+xmlResponse.responseText);
		que =  m_json.question_title;
		
				if(que.length>32){
					$("que").innerHTML='<marquee  id="maq" direction="left" width="1068" scrolladapt="tailAPPEAR" startposition="100%" scrollamount="1" behavior="scroll" scrolldelay="60">'+que+'</marquee>';
				}else{
					$("que").innerHTML=que;
				}
				
				show_list(m_json);	
}
function show_list(){
	//alert(m_json);
	t_page=parseInt((m_json.option_list.length-1+3)/3);
	//alert(t_page);
	show_page(t_page);
    $("page").innerHTML="第&nbsp;"+tpage+"&nbsp;页/共&nbsp;"+t_page+"&nbsp;页";  
    if(tpage!=t_page){
		start=(tpage-1)*2+(tpage-1);
		end=(tpage-1)*2+2+(tpage-1);
	}else if(tpage==t_page){
	    start=(tpage-1)*2+(tpage-1);
		end=m_json.option_list.length-1; 
	}
	//alert("end:"+end+"star:"+start);

	posSize=end-start;
	//alert(posSize);
	for(var i=0;i<3 && start<=end;i++,start++){	
		//alert("i:"+i+"start:"+start);
		var t = m_json.option_list[start].option_vote;			
		$("option"+i).innerHTML = ((tpage-1)*3+1+i)+"."+m_json.option_list[start].option_content;
		$("num"+i).innerHTML=t;
		if(m_json.totleVote==0){		
			$("percent"+i).innerHTML="0.0%";
		}else{
			$("percent"+i).innerHTML=toPercent(t/(m_json.totleVote));
		}
		$("rate"+i).src="images/100.jpg";
		$("rate"+i).width=Math.ceil((t/(m_json.totleVote))*845);//如果用原图的宽度861当100%时会导致换行
		//alert(m_json.option_list[start].option_select);
		if(m_json.option_list[start].option_select==true){
			$("mark"+i).src="images/chack.png";
		}
	}
	
}
function show_page(t_page){
	show_button();
	if(tpage==1 && tpage!=t_page){
		$("btn1").src=btnArray[1].get_f;
		down_position=1;
	}else if(tpage!=1 && tpage<t_page){
		if(temp==0){
			$("btn0").src=btnArray[0].lose_f;
			$("btn1").src=btnArray[1].get_f;
			down_position=1;
		}else{
			$("btn0").src=btnArray[0].get_f;
			$("btn1").src=btnArray[1].lose_f;
			down_position=0;
		}
	}else if(tpage!=1 && tpage==t_page){
		//$("btn0").src=btnArray[0].get_f;
		$("btn1").src=btnArray[0].get_f;
		down_position=1;
	}else if(tpage==1 && tpage==t_page){
		$("btn2").src=btnArray[2].get_f;
		down_position=2;
	}
	////alert("ddd=="+down_position);
	$("page").innerHTML="第"+tpage+"页/第"+t_page+"页";
}
function init(){
	//alert(markq);
	ajax_text();
	show_time();
	$("title").innerHTML=arr[mid_position].title;
	$("top0").innerHTML=tagline.split("，")[0]+"&nbsp;&nbsp;"+tagline.split("，")[1];//
}
</script>
</head>

<body style="width:1280px;height:720px; background-image:url(images/jg.jpg)" onload="init();">
<div style="position:absolute; width:380px; height:50px; left:843px; top:59px; vertical-align:middle; line-height:60px;">
  <font id="top0" style="color:#075ba8;font-size:34px; font-weight:900;"></font>&nbsp;&nbsp;&nbsp;&nbsp;<font id="top1" style="color:#075ba8;font-size:34px; font-weight:900;"></font></div>
<div style="position:absolute; height:28px; width:290px; top:83px; left:371px;">
  <font id="title" style="font-size:28px;">>在线投票>全文</font>
</div>
<div style="position:absolute; height:32px; width:1101px; top:161px; left:104px;">
  <font id="que" style="font-size:32px;color:#168cc3"></font></div>
  
<div style="position:absolute; height:26px; width:1098px; top:228px; left:87px;">
 <font id="option0" style="font-size:26px;"></font>
</div>

<div style="position:absolute; height:38px; width:963px; top:277px; left:87px; line-height:38px; vertical-align:middle;">
 <img id="rate0"  width="10" height="38"  src="images/__.gif"/><font id="percent0" style="font-size:35px;color:#67a415;"></font></div>
 
<div style="position:absolute; height:38px; width:45px; top:279px; left:1148px; vertical-align:middle;"><img id="mark0" style="height:38px; width:45px;"  src="images/__.gif"/></div>
  
 <div style="position:absolute; height:26px; width:1098px; top:341px; left:87px;">
 <font id="option1" style="font-size:26px;"></font>
</div>

<div style="position:absolute; height:38px; width:963px; top:389px; left:87px; line-height:38px; vertical-align:middle;">
 <img  id="rate1"  width="10" height="38" src="images/__.gif"/><font id="percent1" style="font-size:35px;color:#67a415;"></font>
</div>
<div style="position:absolute; height:38px; width:45px; top:389px; left:1148px; vertical-align:middle;"><img id="mark1" style="height:38px; width:45px;"  src="images/__.gif"/></div>

<div style="position:absolute; height:26px; width:1098px; top:470px; left:87px;">
 <font id="option2" style="font-size:26px;"></font>
</div>

<div style="position:absolute; height:38px; width:963px; top:516px; left:87px; line-height:38px; vertical-align:middle;">
 <img id="rate2"  width="10" height="38" src="images/__.gif"/><font  id="percent2" style="font-size:35px;color:#67a415;"></font>
</div>
<div style="position:absolute; height:38px; width:45px; top:516px; left:1148px; vertical-align:middle;"><img id="mark2" style="height:38px; width:45px;"  src="images/__.gif"/></div>
<div style="position:absolute; height:24px; width:97px; top:288px; left:1059px;">
  <font id="num0" style="font-size:24px;color:#666"></font></div>

<div style="position:absolute; height:24px; width:97px; top:404px; left:1059px;">
  <font id="num1" style="font-size:24px;color:#666"></font>
</div>

<div style="position:absolute; height:24px; width:97px; top:534px; left:1059px;">
  <font id="num2" style="font-size:24px;color:#666"></font>
</div>

 <div style="position:absolute; width:883px; height:51px; left:319px; top:623px;">
<table border="0" cellpadding="0" cellspacing="0" height="51px" width="883px" >
        <tr>
         <td width="181" align="right"><img id="btn0" src="images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="images/back1.gif"></img></td>
         <td width="113" align="right"><img id="btn3" src="images/quit1.gif"></img></td>
         
        <!-- 
         <td width="181" align="right"><img id="btn0" src="images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="images/back1.gif"></img></td>
         <td width="113" align="right"><img id="btn3" src="images/quit1.gif"></img></td>
         <td width="112" align="right"><img id="btn4" src="images/main1.gif"></img></td>
         <td width="113" align="right"><img id="btn5" src="images/button1.gif"></img></td>
         <td width="114" align="right"><img id="btn6" src="images/help1.gif"></img></td>-->
        </tr>
   </table>
</div>
<div style="position:absolute; width:248px; height:39px; left:77px; top:629px;">
      <table width="248" height="39"  border="0" cellpadding="0" cellspacing="0">
      <tr>
       <td id="Time" align="center"  valign="middle" style="font-size:24px;"></td>
     </tr>
  </table>
</div>
<div style="position:absolute; height:24px; width:210px; top:591px; left:987px;">
  <font id="page" style="font-size:24px;color:#666"></font></div>
</body>
</html>
