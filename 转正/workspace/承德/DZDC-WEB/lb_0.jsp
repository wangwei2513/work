<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="util.Util" %>
<title>无标题文档</title>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String url = Util.getValue("index_url");
	String shdc_url = Util.getValue("shdc_url");
	String hzdc_url = Util.getValue("hzdc_url");
	String ghdc_url = Util.getValue("ghdc_url");
	String image_url = Util.getValue("image_url");

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
<script>
var single ="";
var httpurl = window.location.href;
var mid_position = GET("mid_position");//控制加载的js  穿首页用来选中框  
var t_page = 0;
var page =GET("page");//从选项页返回选中问题页  传到选项页控制显示的 选项
if(page == 0){
	page = 1;
}
var topxx="";
var start=0;
var end=0;
var posSize=0;  //每页有多少条栏目
var total_item = 0;
var right_position = GET("right_position");//从选项页返回选中的问题条目   传到选项页控制显示的 选项  
var down_position = 0;
var area = 0;
var btnArray = [	
	{lose_f:"<%=basePath%>/images/previous1.gif",get_f:"<%=basePath%>/images/previous2.gif",url:""}, //上一页
	{lose_f:"<%=basePath%>/images/next1.gif",get_f:"<%=basePath%>/images/next2.gif",url:""}, //下一页
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}/*,//返回
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"<%=basePath%>index.jsp?mid_position="+mid_position}, //退出
	{lose_f:"<%=basePath%>/images/main1.gif",get_f:"<%=basePath%>/images/main2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}, //主页
	{lose_f:"<%=basePath%>/images/button1.gif",get_f:"<%=basePath%>/images/button2.gif",url:"<%=basePath%>index.jsp?mid_position="+mid_position}, //首页
	{lose_f:"<%=basePath%>/images/help1.gif",get_f:"<%=basePath%>/images/help2.gif",url:""}//帮助	*/
];

var arr = [{title:">生活调查",img:"images/shdc.png"},{title:">在线投票",img:"images/hzdc.png"},{title:">申诉系统",img:"images/ghdc.png"}];
document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
		case 1://up	
		case 38://up	
			if(area == 1){
				area = 0;
				init_right();
				clear_down();
				if(page==t_page){
					$("btn1").src=btnArray[0].lose_f; 
				}else if(page<t_page){
					$("btn1").src=btnArray[1].lose_f; 
					$("btn0").src=btnArray[0].lose_f; 
				}
			}else if(area == 0 && right_position >0){
				change_right(-1);
			}
			return false;
			break;
		case 2://down
		case 40://down
			if(area == 0){
				if(right_position< posSize){
					change_right(1);
				}else{
					clear_right();
					if( page<t_page && page!=1){
							$("btn0").src=btnArray[0].get_f;   
							down_position = 0;
						}else if(page == 1 && t_page!=1){
							$("btn1").src=btnArray[1].get_f;   
							down_position = 1;
						}else if(page == t_page && page!=1){
							$("btn1").src=btnArray[0].get_f;   
							down_position = 1;
						}else if(t_page == 1){
							down_position = 2;
							$("btn2").src=btnArray[2].get_f;   
						}
					area = 1;
				}
			}
			return false;
			break;
		case 3://left
		case 37://left
			if(area == 1){
				if(t_page==1){
					if(down_position >2){
						change_down(-1);
					}
				}else if(t_page>1&&page==1){
					if(down_position >1){
						change_down(-1);
					}
				}else if(page>1&&page!=t_page){
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
			if(area == 1 && down_position <btnArray.length-1){
				if(page == t_page){
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
			window.location.href = btnArray[2].url;
			return false;
			break;
		case 372://page up
		case 374:
		case 33:
			 if(page > 1){
				area = 0;
				clear_down();
				clear_right();
				clear_list();
				right_position = 0;
				page-=1;
				show_list();
				init_right();
			}
			return false;
			break;
		case 373://page down
		case 375:
		case 34:
			if(page<t_page){
				clear_down();
				clear_right();
				clear_list();
				right_position = 0;
				page+=1;
				show_list();
				area = 0;
				init_right();
			}
			return false;
			break;
		case 832://red
			window.location.href = btnArray[2].url;
			return false;
			break;
		case 833://green
			return false;
			break;
		case 834://yellow
			return false;
			break;
		case 835://blue
			window.location.href = btnArray[6].url;
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
			window.location.href = "http://10.191.226.162:8080/routing/index.htm";
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
	if(typeof(url[1])=="undefined")return false;
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
function clear_list(){
	for(var i=0;i<7;i++){		
	  $("que"+i).innerHTML = "";	
	  $("new"+i).src = "<%=basePath%>/images/__.gif";	
	}
}
function $(id){
	return document.getElementById(id);
}
function ajax_js(){
	//var url = "js/home.js";
	//var url = "http://192.168.212.122:9393/dzdc/js/home.js";
	var url='<%=url%>'
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.open('GET',url, false);
	oXmlHttp.onreadystatechange = function() {
		if ( oXmlHttp.readyState == 4 )  {
			if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 || oXmlHttp.status == 0) {
			eval("var m_json1="+oXmlHttp.responseText);
			topxx = m_json1.home_tagline;
			var top0 = topxx.split("，")[0];
			var top1 = topxx.split("，")[1];
			if(topxx != null && topxx.length > 0){
				$("top0").innerHTML = top0;
				$("top1").innerHTML = top1;
			}else{
				alert("0列表为空，请返回");
			}
			var len =  m_json1.home_menu.length;
			if(len >0){
					$("text0").innerHTML= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+m_json1.home_menu[mid_position].home_content;
					$("img0").src='<%=image_url%>'+m_json1.home_menu[mid_position].home_pic;//将标题放入数组
			}else{
				alert("2列表为空，请返回");
				}
									
			 } else { 
	
			 } 
		} 
	} 
	oXmlHttp.send(null); 
}
function init_right(){
	$("listFocus"+right_position).style.visibility="visible";
	JudgeUnameLength(right_position);
}
function JudgeUnameLength(mid){
    if(m_json.question_list[mid+((page-1)*7)].question_title.length>27){
    	 $("que"+mid).innerHTML='<marquee startposition="95%" direction="left" width="640" scrollamount="1" behavior="scroll" scrolldelay="50">'+m_json.question_list[mid+((page-1)*7)].question_title+'</marquee>';
	}
}
function InterceptUnameLength(mid){
	if(m_json.question_list[mid+((page-1)*7)].question_title.length>27){
	  $("que"+mid).innerHTML=m_json.question_list[mid+((page-1)*7)].question_title.substring(0,27);
	}
}
function clear_right(){
	$("listFocus"+right_position).style.visibility="hidden";
	InterceptUnameLength(right_position);
}
function change_right(_num){
	clear_right();
	right_position += _num;
	init_right();
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
var m_json;
function ajax_right(){
	if(mid_position == 0){
		var url ='<%=shdc_url%>';
	}else if(mid_position == 1){
		var url ='<%=hzdc_url%>';
	}else if(mid_position == 2){
		var url ='<%=ghdc_url%>';
	}
	var oXmlHttp = new XMLHttpRequest(); 
	oXmlHttp.open('GET',url, false);
			oXmlHttp.onreadystatechange = function() {
						if ( oXmlHttp.readyState == 4 )  {
								if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {
									//iPanel.debug("oXmlHttp.responseText)=="+oXmlHttp.responseText);
									eval("m_json="+oXmlHttp.responseText);
									show_list(m_json);
									if(area == 0){
										JudgeUnameLength(right_position);
									}
								}else{ 
						
								} 
						} 
			} 
	
	oXmlHttp.send(null); 
}
//打印测试
function add(str,tag){//添加debug信息
	var tag = tag || 1;
	$("test").style.visibility = (tag==0)?"hidden":"visible";
	$("test").innerHTML += str+"<br>";
}
function show_button(){//初始化按钮
		if(t_page==1){
			$("btn0").style.visibility="hidden";
			$("btn1").style.visibility="hidden";
			down_position=2;
		}else if(t_page>1&&page==1){
			down_position=1;
			$("btn0").style.visibility="hidden";
			$("btn1").style.visibility="visible";
		}else if(page>1&&page!=t_page){
				$("btn0").style.visibility="visible";
				$("btn1").style.visibility="visible";
		}else if(page==t_page && t_page!=1){
					down_position=1;
					$("btn0").style.visibility="hidden";
					$("btn1").style.visibility="visible";
					$("btn1").src=btnArray[0].lose_f;
		}
}
function show_list(){//显示列表
	t_page=parseInt((m_json.question_list.length-1+7)/7);
	show_button();
    $("page").innerHTML="第&nbsp;"+page+"&nbsp;页/共&nbsp;"+t_page+"&nbsp;页";  
    if(page!=t_page){
		start=(page-1)*6+(page-1);
		end=(page-1)*6+6+(page-1);
	}else if(page==t_page){
	    start=(page-1)*6+(page-1);
		end=m_json.question_list.length-1; 
	}
	posSize=end-start;
	for(var i=0;i<7 && start<=end;i++,start++){				
		$("que"+i).innerHTML = m_json.question_list[start].question_title.substring(0,27);
		if(m_json.question_list[start].question_ifNew==true){
			$("new"+i).src="<%=basePath%>/images/new.png";	
		}		
	}
	
}
function do_select(){
	if(area == 1){
		switch (down_position){
			case 0:
				if(page >0){
					page-=1;
					right_position = 0;
					clear_list();
					show_list();
					if(page ==1){
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
				if(page<t_page){
					page+=1;
					clear_list();
					right_position = 0;
					show_list();
						if(page ==t_page){
							$("btn1").src=btnArray[0].get_f;
							$("btn0").src=btnArray[0].lose_f;
							
						}else{
							$("btn1").src=btnArray[1].get_f;
							$("btn0").src=btnArray[0].lose_f;
						}
					}else if(page ==t_page){
					page-=1;
					clear_list();
					right_position = 0;
					show_list();
					if(page ==1){
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
	}else if(area == 0){
		//alert(topxx);
		//alert(m_json.question_list[right_position+((page-1)*7)].question_title);
		single = m_json.question_list[right_position+((page-1)*7)].question_ifCheck+"";
		//alert(single);
		if(single=="true"){
			window.location.href = "<%=basePath%>nrd.jsp?mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+page+"&tagline="+topxx;
		}else{
			window.location.href = "<%=basePath%>nr.jsp?mid_position="+mid_position+"&right_position="+right_position+"&cu_page="+page+"&tagline="+topxx;
		}
	}
}
function init(){
	ajax_js();
	$("timage").src=arr[mid_position].img;
	$("ttext").innerHTML=arr[mid_position].title;
	ajax_right();
	show_time();
	init_right();
}
</script>
</head>

<body style="width:1280px;height:720px; background-image:url(<%=basePath%>/images/dzdc.jpg)" onload="init();">
<div style="position:absolute; width:380px; height:50px; left:843px; top:59px; vertical-align:middle; line-height:60px;">
  <font id="top0" style="color:#075ba8;font-size:34px; font-weight:900;"></font>&nbsp;&nbsp;&nbsp;&nbsp;<font id="top1" style="color:#075ba8;font-size:34px; font-weight:900;"></font></div>
<div style="position:absolute; height:385px; width:660px; top:156px; left:526px;">
    <table height="385px" width="660px" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td height="55px" valign="middle"><img id="listFocus0" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="listFocus1" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img src="<%=basePath%>/images/focus.png" id="listFocus2" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="listFocus3" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="listFocus4" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="listFocus5" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="listFocus6" src="<%=basePath%>/images/focus.png" style="visibility:hidden;"></img></td>
      </tr>
    </table>
</div>
<img id="timage" src="<%=basePath%>/images/__.gif" style="position:absolute; top:146px; left:67px;"/>
<img id="img0" src="<%=basePath%>/images/__.gif" style="position:absolute; top:225px; left:78px;"/>

<div style="position:absolute; height:28px; width:290px; top:83px; left:371px;">
<font id="ttext" style="font-size:28px;"></font>
</div>

<div id="text0" style="position:absolute; width:327px; height:163px; left:79px; top:394px;line-height:43px; vertical-align:bottom; font-size:24px;"></div>
  
<div style="position:absolute; height:385px; width:55px; top:156px; left:472px;">
    <table height="385px" width="55px" cellpadding="0" cellspacing="0" border="0" style="font-size:22px;">
      <tr>
        <td height="55px" valign="middle"><img id="new0"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="new1"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="new2"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="new3"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="new4"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td  height="55px" valign="middle"><img id="new5"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
      <tr>
        <td height="55px" valign="middle"><img id="new6"  src="<%=basePath%>/images/__.gif"/></td>
      </tr>
    </table>
</div>
<div style="position:absolute; height:385px; width:660px; top:156px; left:535px;">
    <table height="385px" width="660px" cellpadding="0" cellspacing="0" border="0" style="font-size:22px;">
      <tr>
        <td id="que0" height="55px" valign="middle">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que1" height="55px" valign="middle"></td>
      </tr>
      <tr>
        <td  id="que2" height="55px" valign="middle"></td>
      </tr>
      <tr>
        <td  id="que3" height="55px" valign="middle"></td>
      </tr>
      <tr>
        <td  id="que4" height="55px" valign="middle"></td>
      </tr>
      <tr>
        <td  id="que5" height="55px" valign="middle"></td>
      </tr>
      <tr>
        <td  id="que6" height="55px" valign="middle"></td>
      </tr>
    </table>
</div>

<div style="position:absolute; height:24px; width:266px; top:549px; left:970px;">
  <font id="page" style="font-size:24px;color:#666"></font></div>

  <div style="position:absolute; width:883px; height:51px; left:319px; top:623px;">
<table border="0" cellpadding="0" cellspacing="0" height="51px" width="883px" >
        <tr>
         <td width="181" align="right"><img id="btn0" src="<%=basePath%>/images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="<%=basePath%>/images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="<%=basePath%>/images/quit1.gif"></img></td><!--
         <td width="113" align="right"><img id="btn3" src="<%=basePath%>/images/quit1.gif"></img></td>
         <td width="112" align="right"><img id="btn4" src="<%=basePath%>/images/main1.gif"></img></td>
         <td width="113" align="right"><img id="btn5" src="<%=basePath%>/images/button1.gif"></img></td>
         <td width="114" align="right"><img id="btn6" src="<%=basePath%>/images/help1.gif"></img></td>-->
         
         
           <!--<td width="181" align="right"><img id="btn0" src="<%=basePath%>/images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="<%=basePath%>/images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="<%=basePath%>/images/back1.gif"></img></td>
         <td width="113" align="right"><img id="btn3" src="<%=basePath%>/images/quit1.gif"></img></td>
         <td width="112" align="right"><img id="btn4" src="<%=basePath%>/images/main1.gif"></img></td>
         <td width="113" align="right"><img id="btn5" src="<%=basePath%>/images/button1.gif"></img></td>
         <td width="114" align="right"><img id="btn6" src="<%=basePath%>/images/help1.gif"></img></td>-->
        </tr>
    </table>
</div>
<div style="position:absolute; width:248px; height:39px; left:77px; top:635px;">
      <table width="248" height="39"  border="0" cellpadding="0" cellspacing="0">
      <tr>
       <td id="Time" align="center"  valign="middle" style="font-size:24px;"></td>
     </tr>
  </table>
</div>
<div id="test"></div>
</body>
</html>

