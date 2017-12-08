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
<script type="text/javascript" src="<%=basePath%>js/backIpanel.js"></script>
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
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"http://10.191.182.41:8080/DZDC-WEB/index.jsp"}/*,//返回
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"<%=basePath%>index.jsp?mid_position="+mid_position}, //退出
	{lose_f:"<%=basePath%>/images/main1.gif",get_f:"<%=basePath%>/images/main2.gif",url:"http://webclient.homed.me/application/homedPortal/dzzhcs/secondMenu.htm"}, //主页
	{lose_f:"<%=basePath%>/images/button1.gif",get_f:"<%=basePath%>/images/button2.gif",url:"<%=basePath%>index.jsp?mid_position="+mid_position}, //首页
	{lose_f:"<%=basePath%>/images/help1.gif",get_f:"<%=basePath%>/images/help2.gif",url:""}//帮助	*/
];

var arr = [{title:">生活调查",img:"images/shdc.png"},{title:">在线投票",img:"images/hzdc.png"},{title:">申诉系统",img:"images/ghdc.png"}];

/******************************** 消息的处理-start ***********************************************/
var ipanelAdvanced = 0;						//0:iPanel 3.0; 1:其它
var userAgent = navigator.userAgent.toLowerCase();	//浏览器版本，用于区分是3.0和还是其它
if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){
	ipanelAdvanced = 0;
}else{
	ipanelAdvanced = 1;	
}
var EVENT = {STOP:0, DOWN:1, ADVECTED:2};			//消息/按键流向定义
if(ipanelAdvanced){
	EVENT = {STOP:false, DOWN:true, ADVECTED:true};
}
/******************************** 消息的处理-end ***********************************************/
document.onirkeypress = eventHandler;
document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	if(showTipsFlag){//有按键操作就关闭无交互按钮提示框
		hideTips();
		return EVENT.STOP;
	}
	switch (keycode) {
		case 1://up	
		case 38://up
			if(showPhoneTipsFlag){
				changePhoneTipsArea(-1);
			}else if(area == 1){
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
			return EVENT.STOP;
			break;
		case 2://down
		case 40://down
			if(showPhoneTipsFlag){
				changePhoneTipsArea(1);
			}else if(area == 0){
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
			return EVENT.STOP;
			break;
		case 3://left
		case 37://left
			if(showPhoneTipsFlag){
				changePhoneTipsBtn(-1);
			}else if(area == 0){//局方要求左右键可以进行翻页
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
			}else if(area == 1){
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
		   return EVENT.STOP;
			break;
		case 4://right
		case 39://right
			if(showPhoneTipsFlag){
				changePhoneTipsBtn(1);
			}else if(area == 0){//局方要求左右键可以进行翻页
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
			}else if(area == 1 && down_position <btnArray.length-1){
				if(page == t_page){
					change_down(1);
					$("btn1").src=btnArray[0].lose_f; 
				}else{	
					change_down(1);
				}
			}
		return EVENT.STOP;
			break;
		case 13://enter
			if(showPhoneTipsFlag){
				confimPhoneTips();
			}else{
				do_select();
			}
			break;
			return EVENT.STOP;
		case 339://exit
		case 27://exit
			//goBackUrl();
			window.location.href = btnArray[2].url;
			return EVENT.STOP;
			break;
		case 340://back
		case 8://back
			iDebug("lb.jsp====back==="+GP.getBackUrl("appBackUrl"));
			if(showPhoneTipsFlag && phoneTipsArea == 0){
				delPhoneNum();
			}else{
				window.location.href = btnArray[2].url;
			}
			return EVENT.STOP;
			break;
		case 372://page up
		case 374:
		case 33:
			if(showPhoneTipsFlag) return EVENT.STOP;
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
			return EVENT.STOP;
			break;
		case 373://page down
		case 375:
		case 34:
			if(showPhoneTipsFlag) return EVENT.STOP;
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
			return EVENT.STOP;
			break;
		case 832://red
			window.location.href = btnArray[2].url;
			return EVENT.STOP;
			break;
		case 833://green
			return EVENT.STOP;
			break;
		case 834://yellow
			return EVENT.STOP;
			break;
		case 835://blue
			window.location.href = btnArray[6].url;
			return EVENT.STOP;
			break;
		case 800://KEY_A
			return EVENT.STOP;
			break;
		case 801://KEY_B
			return EVENT.STOP;
			break;
		case 561:
		case 802://KEY_C
			return EVENT.STOP;
			break;
		case 803://KEY_D
			return EVENT.STOP;
			break;
		case 512://KEY_HOME_PAGE  主页
			if(typeof gotoPortal != "undefined") gotoPortal();//强制重新打开一次
			  else window.location.href = iPanel.eventFrame.webUiUrl;
			//window.location.href = "http://10.191.226.162:8080/routing/index.htm";
			return EVENT.STOP;
			break;
		case 573:
			return EVENT.STOP;//屏蔽列表键，防止误按，退出系统
			break;
		case 48:  //遥控器数字键0
		case 49:  //遥控器数字键1
		case 50:  //遥控器数字键2
		case 51:  //遥控器数字键3
		case 52:  //遥控器数字键4
		case 53:  //遥控器数字键5
		case 54:  //遥控器数字键6
		case 55:  //遥控器数字键7
		case 56:  //遥控器数字键8
		case 57:  //遥控器数字键9
			if(showPhoneTipsFlag && phoneTipsArea == 0){
				inputPhoneNum(keycode-48);	
			}
			return EVENT.STOP;
			break;		
		default:
			return EVENT.STOP;
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
	  $("time"+i).innerHTML = "";	
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
    if(m_json.question_list[mid+((page-1)*7)].question_title.length>19){
    	 $("que"+mid).innerHTML='<marquee startposition="95%" direction="left" width="500" scrollamount="1" behavior="scroll" scrolldelay="50">'+m_json.question_list[mid+((page-1)*7)].question_title+'</marquee>';
	}
}
function InterceptUnameLength(mid){
	if(m_json.question_list[mid+((page-1)*7)].question_title.length>19){
	  $("que"+mid).innerHTML=m_json.question_list[mid+((page-1)*7)].question_title.substring(0,19);
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
	var y = d.getFullYear();
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
		$("que"+i).innerHTML = m_json.question_list[start].question_title.substring(0,19);
		$("time"+i).innerHTML = m_json.question_list[start].question_addTime.substr(0,10);
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
		if(mid_position == 2){//申诉系统按确定键时提示用户输入手机号
			showPhoneTips();
			return;
		}
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

var showTipsFlag = false;		//是否显示了消息提示框
var showTipsTimer = -1;			//消息提示框计时器
var showPhoneTipsFlag = false;	//是否显示了输入手机号的弹出框 投诉系统需要用户输入手机号
var phoneNum = "";				//用户输入的手机号
var phoneTipsBtnPos = 0;		//0：提交 1：取消
var phoneTipsArea = 0;			//0:输入框 1：按钮框

function showPhoneTips(){
	showPhoneTipsFlag = true;
	phoneNum = "";
	phoneTipsArea = 0;
	phoneTipsBtnPos = 0;
	showPhoneTipsFocus();
	$("phoneText").innerText = "";
	$("phoneDiv").style.visibility = "visible";
}

function hidePhoneTips(){
	showPhoneTipsFlag = false;
	$("phoneDiv").style.visibility = "hidden";
	hidePhoneTipsFocus();
}

function changePhoneTipsArea(_num){
	if((phoneTipsArea ==0 && _num < 0) || (phoneTipsArea == 1 && _num > 0))return;
	hidePhoneTipsFocus();
	phoneTipsArea = phoneTipsArea == 0 ? 1 : 0;
	showPhoneTipsFocus();
}

function showPhoneTipsFocus(){
	if(phoneTipsArea == 0){
		$("phoneText").style.backgroundColor = "#FFFF33";
	}else if(phoneTipsArea == 1){
		$("phoneTipsBtn" + phoneTipsBtnPos).style.backgroundColor = "#FFFF33";
	}
}

function hidePhoneTipsFocus(){
	if(phoneTipsArea == 0){
		$("phoneText").style.backgroundColor = "#CCCCCC";
	}else if(phoneTipsArea == 1){
		$("phoneTipsBtn" + phoneTipsBtnPos).style.backgroundColor = "#CCCCCC";
	}
}

function changePhoneTipsBtn(_num){
	if(phoneTipsArea != 1) return;
	$("phoneTipsBtn" + phoneTipsBtnPos).style.backgroundColor = "#CCCCCC";
	phoneTipsBtnPos = (phoneTipsBtnPos + _num + 2)%2;
	$("phoneTipsBtn" + phoneTipsBtnPos).style.backgroundColor = "#FFFF33";
	
}

function confimPhoneTips(){
	if(phoneTipsArea != 1) return;
	if(phoneTipsBtnPos == 0){//提交
		if(phoneNum.length != 11){
			showTips("请输入正确的联系方式",3000);
		}else{
			hidePhoneTips();
			showTips("提交成功，我们会尽快与您联系！",3000);
		}
	}else{
		hidePhoneTips();
	}
}

function inputPhoneNum(_num){
	if(phoneNum.length == 11)return;
	phoneNum += _num;
	$("phoneText").innerText = phoneNum;
}

function delPhoneNum(){
	if(phoneNum.length == 0) return;
	phoneNum = phoneNum.substring(0,phoneNum.length-1);
	$("phoneText").innerText = phoneNum;
}

/*显示提示信息*/
function showTips(msg,flag){
	showTipsFlag = true;
	$("tipsDiv").style.visibility = "visible";
	$("tipsDiv").innerText = msg;
	clearTimeout(showTipsTimer);
	if(typeof(flag) != "undefined"){	// 不传flag时表示不自动隐藏
		showTipsTimer = setTimeout(hideTips,flag);
	}
}

/*影藏提示信息*/
function hideTips(){
	showTipsFlag = false;
	clearTimeout(showTipsTimer);
	$("tipsDiv").style.visibility = "hidden";
	$("tipsDiv").innerText = "";
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
<div style="position: absolute; height: 385px; width: 651px; top: 156px; left: 535px;">
    <table height="385px" width="650px" cellpadding="0" cellspacing="0" border="0" style="font-size:22px;">
      <tr>
        <td width="500" height="55px" valign="middle" id="que0">&nbsp;</td>
        <td width="150" height="55px" valign="middle" align="center" id="time0">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que1" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time1">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que2" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time2">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que3" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time3">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que4" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time4">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que5" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time5">&nbsp;</td>
      </tr>
      <tr>
        <td  id="que6" height="55px" valign="middle"></td>
        <td width="150" height="55px" valign="middle" align="center" id="time6">&nbsp;</td>
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

<div id="phoneDiv" style="position:absolute; left:323px; top:175px; width:530px; height:214px; background-color:#EEEEEE; text-align:center; font-size:30px; visibility:hidden;">
	<div style="position:absolute; left:17px; top:17px; width:492px; height:47px; line-height:47px;">请输入手机号，我们会主动与您联系</div>
	<div style="position:absolute; left:144px; top:79px; width:234px; height:47px; line-height:47px; background-color:FFFF33" id="phoneText">&nbsp;</div>
	<div style="position:absolute; left:87px; top:150px; width:142px; height:47px; line-height:47px; background-color:#CCCCCC;" id="phoneTipsBtn0">提交</div>
	<div style="position:absolute; left:293px; top:150px; width:142px; height:47px; line-height:47px; background-color:#CCCCCC;" id="phoneTipsBtn1">取消</div>
</div>

<div id="tipsDiv" style="position:absolute; left:323px; top:175px; width:559px; height:214px; background-color:#EEEEEE; text-align:center;font-size:36px; line-height:210px; z-index:10; visibility:hidden;">&nbsp;</div>

<div id="test"></div>
</body>
</html>

