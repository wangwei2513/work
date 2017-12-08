<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page contentType="text/html; charset=utf-8"%>
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
<script>
<%
request.setCharacterEncoding("utf-8");
//String tagline = request.getParameter("tagline");
//tagline = new String(tagline.getBytes("iso-8859-1"),"utf-8");
//String tagline1 = tagline.split("，")[0]+"&nbsp;&nbsp;&nbsp"+tagline.split("，")[1];
String text = request.getParameter("text");
String title = request.getParameter("title");
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
var mark = Request.QueryString["mark"];
var httpurl = window.location.href;
var mid_position = GET("mid_position");//首页选中框
var right_position = GET("right_position");//首页选中框
//var page = GET("page");//列表页数
var cu_page =GET("page");//首页选中框
var tpage = 1;
var down_position = 0;
var area = 0;
var top0 ="";
var que ="";
var temp = 0;
var topxx ="";
var i = 0;
var k = 1;
var btnArray = [	
	{lose_f:"images/previous1.gif",get_f:"images/previous2.gif",url:""}, //上一页
	{lose_f:"images/next1.gif",get_f:"images/next2.gif",url:""}, //下一页
	{lose_f:"images/back1.gif",get_f:"images/back2.gif",url:"nr"+mark+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page},//返回
	{lose_f:"images/quit1.gif",get_f:"images/quit2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}
	
	/*
	{lose_f:"images/previous1.gif",get_f:"images/previous2.gif",url:""}, //上一页
	{lose_f:"images/next1.gif",get_f:"images/next2.gif",url:""}, //下一页
	{lose_f:"images/back1.gif",get_f:"images/back2.gif",url:"nr"+mark+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page},//返回
	{lose_f:"images/quit1.gif",get_f:"images/quit2.gif",url:"nr"+mark+".jsp?tagline="+tagline+"&mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+cu_page}, //退出
	{lose_f:"images/main1.gif",get_f:"images/main2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}, //主页
	{lose_f:"images/button1.gif",get_f:"images/button2.gif",url:"index.jsp?mid_position="+mid_position}, //首页
	{lose_f:"images/help1.gif",get_f:"images/help2.gif",url:""}//帮助*/
];
var arr = [{title:">生活调查>全文",img:"images/shdc.png"},{title:">在线投票>全文",img:"images/hzdc.png"},{title:">申诉系统>全文",img:"images/ghdc.png"}];
document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
		case 1://up	
		case 38://up	
			if(area == 0){
				area = 1;
				clear_down();
				if(tpage==t_page){
					$("btn1").src=btnArray[0].lose_f; 
				}else if(tpage<t_page){
					$("btn1").src=btnArray[1].lose_f; 
					$("btn0").src=btnArray[0].lose_f; 
				}
				$("cytp").src="images/tp_b.png";
			}
			return false;
			break;
		case 2://down
		case 40://down
			if(area == 1){
			$("cytp").src="images/tp_a.png";
				if( tpage<t_page && tpage!=1){
						$("btn0").src=btnArray[0].get_f;   
						down_position = 0;
					}else if(tpage == 1 && t_page!=1){
						$("btn1").src=btnArray[1].get_f;   
						down_position = 1;
					}else if(tpage == t_page && tpage!=1){
						$("btn1").src=btnArray[0].get_f;   
						down_position = 1;
					}else if(t_page == 1){
						down_position = 2;
						$("btn2").src=btnArray[2].get_f;   
					}
				area = 0;
				}
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
			window.location.href = btnArray[2].url;
			return false;
			break;
		case 340://back
		case 27://back
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
					show_page();
					show_text();
					
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
				show_page();
				show_text();
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
/**
function ajax_text(){
	if(mid_position == 0){
		var url = "js/shdc.js";
	}else if(mid_position == 1){
		var url = "js/hzdc.js";
	}else if(mid_position == 2){
		var url = "js/ghdc.js";
	}
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.open('GET',url, false);
	oXmlHttp.onreadystatechange = function() {
		if ( oXmlHttp.readyState == 4 )  {
			if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {
				eval("var m_json="+oXmlHttp.responseText);
				show_text(m_json);
			}else{ 
	
			} 
		} 
	} 
	oXmlHttp.send(null); 
}
*/
function show_time(){
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	h = (h > 9) ? h : "0" + h;
	m = (m > 9) ? m : "0" + m;
	s = (s > 9) ? s : "0" + s;
	var y = d.getYear();
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
function show_text(){
	que ='<%=title%>';
	if(que.length>22){
		$("que").innerHTML='<marquee  id="maq" direction="left" width="870" scrollamount="2" behavior="alternate" scrolldelay="50">'+que+'</marquee>';
	}else{
		$("que").innerHTML=que;
	}
	if(tpage == 1){
		////alert("0,296");
		$("text").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+'<%=text%>'.substring(0,296);
	}else if(tpage == 2){
		////alert((tpage-1)*296+"    "+parseInt(tpage*296+2));
		$("text").innerHTML='<%=text%>'.substring((tpage-1)*296,parseInt(tpage*296+2));
	}else{
		////alert(parseInt((tpage-1)*297+i)+"   "+parseInt(tpage*297+k));
		$("text").innerHTML='<%=text%>'.substring(parseInt((tpage-1)*297+i),parseInt(tpage*297+k));
		i++;
		k++;
	}
	show_page();
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
	if(area == 1){
		window.location.href =btnArray[2].url;
	}else if(area == 0){
		switch(down_position){
			case 0:
				if(tpage >0){
					tpage--;	
					temp=1;	
					show_page();
					show_text();
					if(tpage ==1){
						$("btn1").src=btnArray[1].get_f;
						$("btn0").src=btnArray[0].lose_f;
					}else{
						$("btn0").src=btnArray[0].get_f;
						$("btn1").src=btnArray[1].lose_f;
						down_position = 0;
					}
				}
			break;
			case 1:
				//alert(2);
				if(tpage<t_page){
					//alert(1);
					tpage++;
					temp=0;
					show_page();
					show_text();
					if(tpage ==t_page){
						$("btn1").src=btnArray[0].get_f;
						$("btn0").src=btnArray[0].lose_f;
						
					}else{
						$("btn1").src=btnArray[1].get_f;
						$("btn0").src=btnArray[0].lose_f;
					}
				}else if(tpage ==t_page){
					tpage--;	
					temp=1;
					show_page();
					show_text();
					if(tpage ==1){
							$("btn1").src=btnArray[1].get_f;
							down_position = 1;
						}else{
							$("btn0").src=btnArray[0].get_f;
							$("btn1").src=btnArray[1].lose_f;
							down_position = 0;
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
function show_page(){
	////alert("right_position==="+right_position);
	////alert("cu_page==="+cu_page);
	var tlength='<%=text%>'.length;
	//t_page = parseInt(tlength/301+1);
	//alert(parseInt(tlength)-296);
	if(tlength<296){
		t_page=1;
	}else if(parseInt(tlength)-296<298){		
		t_page = parseInt((tlength-296)/298)+2;
	}else if(parseInt(tlength)-296<298){
		t_page = parseInt((tlength-296)/298)+1;
	}
	show_button();
	if(tpage==1 && tpage<t_page){
		$("btn1").src=btnArray[1].get_f;
		//$("btn1").src=btnArray[1].lose_f;
	}else if(tpage!=1 && tpage<t_page){
		if(temp==0){
			$("btn0").src=btnArray[0].lose_f;
			$("btn1").src=btnArray[1].get_f;
			down_position=1;
		}else{
			$("btn0").src=btnArray[0].get_f;
			$("btn1").src=btnArray[1].lose_f;
			down_position=-0;
		}
	}else if(tpage!=1 && tpage==t_page){
		//$("btn0").src=btnArray[0].get_f;
		$("btn1").src=btnArray[0].get_f;
	}else if(t_page == 1){
		$("btn2").src=btnArray[2].get_f;
	}
	////alert("ddd=="+down_position);
	$("page").innerHTML="第"+tpage+"页/第"+t_page+"页";
}
function init(){
	//alert(mark);
	$("top0").innerHTML=tagline.split("，")[0]+"&nbsp;&nbsp;"+tagline.split("，")[1];//
	//ajax_text();
	//show_text();
	window.setTimeout("show_text();",1000);
	show_time();
	$("ttitle").innerHTML=arr[mid_position].title;
}
</script>
</head>

<body style="width:1280px;height:720px; background-image:url(images/nr.jpg)" onload="init();">

<img id="cytp"  src="images/tp_a.png" style="position:absolute; left:1013px; top:171px;"/>
<div style="position:absolute; width:380px; height:50px; left:843px; top:59px; vertical-align:middle; line-height:60px;">
  <font id="top0" style="color:#075ba8;font-size:34px; font-weight:900;"></font>&nbsp;&nbsp;&nbsp;&nbsp;<font id="top1" style="color:#075ba8;font-size:34px; font-weight:900;"></font></div>
<div style="position:absolute; height:28px; width:290px; top:83px; left:371px;">
<font id="ttitle" style="font-size:28px;"></font>
</div>
<div style="position:absolute; height:32px; width:893px; top:177px; left:104px;">
  <font id="que" style="font-size:32px;color:#168cc3"></font></div>
<div id="text" style="position:absolute; height:262px; width:1078px; top:252px; left:104px;  line-height:39px; font-size:24px;"></div>
<div style="position:absolute; height:24px; width:212px; top:541px; left:962px;">
  <font id="page" style="font-size:24px;color:#666"></font></div>

  <div style="position:absolute; width:883px; height:51px; left:319px; top:623px;">
<table border="0" cellpadding="0" cellspacing="0" height="51px" width="883px" >
        <tr>
         <td width="181" align="right"><img id="btn0" src="images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="images/back1.gif"></img></td>
         <td width="113" align="right"><img id="btn3" src="images/quit1.gif"></img></td><!--
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
</body>
</html>
