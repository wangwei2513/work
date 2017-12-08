<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page pageEncoding="utf-8"%>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="util.Util" %>
<title>无标题文档</title>
<%
	String shdc_url = Util.getValue("shdc_url");
	String hzdc_url = Util.getValue("hzdc_url");
	String ghdc_url = Util.getValue("ghdc_url");
	String vote_url=Util.getValue("vote_url");
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";

		//request.setCharacterEncoding("utf-8");
		//String tagline = request.getParameter("tagline");
		//tagline=java.net.URLDecoder.decode(tagline,'utf-8');
		//tagline = new String(tagline.getBytes("iso-8859-1"),"utf-8");
		//String tagline1 = tagline.split("，")[0]+"&nbsp;&nbsp;&nbsp"+tagline.split("，")[1];

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

<script src="js/ajax.js"></script>
<script>
var httpurl = window.location.href;
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
	if(tmpCardId==null||tmpCardId=="")tmpCardId="";
	return tmpCardId;
};
var cu_page =GET("cu_page");//列表页数
var questionId;
var page = GET("page");//后面的页面
if(page == 0){
	page = 1;
}

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
var single = "";
var markposition = 0;
var markpage = 1;
var mark = new Array();
var mark1 = new Array();
var arr=[{title:"申诉系统",url:"ghdc_lb.jsp"},{title:"生活调查",url:"shdc_lb.jsp"},{title:"在线投票",url:"hzdc_lb.jsp"}];
var right_position = GET("right_position");//显示那个问题的选项 ====
var mid_position = GET("mid_position");//控制加载的js  穿首页用来选中框 贯穿所有页面  ===questionId
var position = 0;
var height = 0;
var topxx = 164;
var temp_position = 0;
var t_page = 0;
var start=0;
var end=0;
var posSize=0;  //每页有多少条栏目
var type = 1;
var down_position = 0;
var area = 0;
var btnArray = [	
	{lose_f:"<%=basePath%>/images/previous1.gif",get_f:"<%=basePath%>/images/previous2.gif",url:""}, //上一页
	{lose_f:"<%=basePath%>/images/next1.gif",get_f:"<%=basePath%>/images/next2.gif",url:""}, //下一页
	{lose_f:"<%=basePath%>/images/back1.gif",get_f:"<%=basePath%>/images/back2.gif",url:"lb.jsp?right_position="+right_position+"&page="+cu_page+"&mid_position="+mid_position},//返回
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}
	
	
	
	
	
/*	{lose_f:"<%=basePath%>/images/previous1.gif",get_f:"<%=basePath%>/images/previous2.gif",url:""}, //上一页
	{lose_f:"<%=basePath%>/images/next1.gif",get_f:"<%=basePath%>/images/next2.gif",url:""}, //下一页
	{lose_f:"<%=basePath%>/images/back1.gif",get_f:"<%=basePath%>/images/back2.gif",url:"lb.jsp?right_position="+right_position+"&page="+cu_page+"&mid_position="+mid_position},//返回
	{lose_f:"<%=basePath%>/images/quit1.gif",get_f:"<%=basePath%>/images/quit2.gif",url:"lb.jsp?right_position="+right_position+"&page="+cu_page+"&mid_position="+mid_position}, //退出
	{lose_f:"<%=basePath%>/images/main1.gif",get_f:"<%=basePath%>/images/main2.gif",url:"http://10.191.226.162:8080/routing/index.htm"}, //主页
	{lose_f:"<%=basePath%>/images/button1.gif",get_f:"<%=basePath%>/images/button2.gif",url:"index.jsp?mid_position="+mid_position}, //首页
	{lose_f:"<%=basePath%>/images/help1.gif",get_f:"<%=basePath%>/images/help2.gif",url:""}//帮助	*/
];
var arr = [{title:">生活调查>内容页"},{title:">在线投票>内容页"},{title:">申诉系统>内容页"}];
var markArr = new Array();
var delArr = new Array();
var markArr1 = new Array();
var delArr1 = new Array();
document.onkeydown = eventHandler;
function eventHandler(key){
	var e = key || event;
	var keycode = e.keyCode || e.which || e.charCode;
	switch (keycode) {
		case 1://up	
		case 38://up	
			if(area == 3){
				area = 0;
				position = posSize;
				$("tpck").src="<%=basePath%>/images/tpck_a.png";
				if($("rad"+position).src=="<%=basePath%>/images/lb_focus_d.png"){
					type = 1;
				}else{
					type = 0;
				}
				init_right();
			}else if(area == 0 && position >0){
				if(type==1){
					$("rad"+position).src="<%=basePath%>/images/lb_focus_d.png";
				}
				topxx=topxx-height;
				$("bar").style.top = topxx+"px";
				$("foc"+position).style.visibility="hidden";
				position--;
				////alert($("rad"+position).src);
				if($("rad"+position).src=="<%=basePath%>/images/lb_focus_d.png"){
					////alert(222);
					type = 1;
				}else{
					////alert(111);
					type = 0;
				}
				init_right();
			}else if(area == 1){
				clear_down();
				$("tpck").src="<%=basePath%>/images/tpck_b.png";	
				area = 3;
				if(page==t_page){
					$("btn1").src=btnArray[0].lose_f; 
				}else if(page<t_page){
					$("btn1").src=btnArray[1].lose_f; 
					$("btn0").src=btnArray[0].lose_f; 
				}
			}
			return false;
			break;
		case 2://down
		case 40://down
			if(area == 0){
				if(position< posSize){
					topxx=height+topxx;
					$("bar").style.top = topxx+"px";
					if(type==1){
						$("rad"+position).src="<%=basePath%>/images/lb_focus_d.png";
					}
						$("foc"+position).style.visibility="hidden";
						position++;
						////alert("rad"+position);
						////alert($("rad"+position).src);
						if($("rad"+position).src=="<%=basePath%>/images/lb_focus_d.png"){
							////alert(111);
							type = 1;
						}else{
							////alert(222);
							type = 0;
						}
						init_right();
				}else{
					$("tpck").src="<%=basePath%>/images/tpck_b.png";	
					area = 3;	
					if(type==1){
						clear_right();
					}else{
						$("foc"+position).style.visibility="hidden";
					}
				}
			}else if(area == 3 || area == 2){
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
				$("tpck").src="<%=basePath%>/images/tpck_a.png";	
				$("ckqw").src="<%=basePath%>/images/ck_a.png";
			}
			return false;
			break;
		case 3://left
		case 37://left
			if(area == 0 || area == 3){
				//clear_right();
				if(type == 0){
					$("foc"+position).style.visibility="hidden";
				}else{
					clear_right();
				}
				
				$("ckqw").src="<%=basePath%>/images/ck_b.png";
				$("tpck").src="<%=basePath%>/images/tpck_a.png";	
				area = 2;
				
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
		   return false;
			break;
		case 4://right
		case 39://right
			if(area == 2){
				$("ckqw").src="<%=basePath%>/images/ck_a.png";
				$("tpck").src="<%=basePath%>/images/tpck_b.png";	
				area = 3;
			}else if(area == 1 && down_position <btnArray.length-1){
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
			window.location.href =btnArray[2].url;
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
			 if(page > 1){
				$("tpck").src="<%=basePath%>/images/tpck_a.png";	
				$("ckqw").src="<%=basePath%>/images/ck_a.png";
				area = 0;
				clear_down();
				clear_right();
				clear_list();
				page-=1;
				show_list();
				top=height*3*(page-1)+164;
				$("bar").style.top = topxx+"px";
				if(single=="true"){
					position = 0;
					init_right();
					$("foc"+position).style.visibility="visible";
					for(var i=0;i<markArr.length;i++){
						if(markArr1[i]<parseInt((page*3+1)) && markArr1[i]>parseInt(((page-1)*3))){
							mark.push(markArr[i]);//实际的选项id
							mark1.push(markArr1[i]);	//position
						}
					}
					for(var i=0;i<markArr.length;i++){
						if(markArr1[i]==parseInt((page-1)*3+1)){
							type = 0;
							break;
						}else{
							type = 1;
						}
					}
					for(var i = 0;i<mark.length;i++){
						$("rad"+parseInt((mark1[i]-(page-1)*3-1))).src="<%=basePath%>/images/lb_focus_f.png";
					}
					mark=[];
					mark1=[];
				}else{
					if(page==markpage){
						//position=markposition;
						$("rad"+markposition).src="<%=basePath%>/images/lb_focus_f.png";
						position = 0;
						init_right();
						if(markposition==0){
							$("foc"+markposition).style.visibility="visible";
							type=0;
						}else{
							//init_right();
							type=1;
						}
					}else{
						position = 0;
						init_right();
						type = 1;
					}
				}
				
			}
			return false;
			break;
		case 373://page down
		case 375:
		case 34:
			if(page<t_page){
				$("tpck").src="<%=basePath%>/images/tpck_a.png";	
				$("ckqw").src="<%=basePath%>/images/ck_a.png";
				clear_down();
				clear_right();
				clear_list();
				page+=1;
				show_list();
				area = 0;
				topxx=height*3*(page-1)+164;
				$("bar").style.top = topxx+"px";
				if(single=="true"){
					position = 0;
					init_right();
					for(var i=0;i<markArr.length;i++){
						if(markArr1[i]<parseInt((page*3+1)) && markArr1[i]>parseInt(((page-1)*3))){
							mark.push(markArr[i]);	
							mark1.push(markArr1[i]);	
						}
					}
					for(var i=0;i<markArr.length;i++){
						if(markArr1[i]==parseInt((page-1)*3+1)){
							type = 0;
							break;
						}else{
							type = 1;
						}
					}
					for(var i = 0;i<mark.length;i++){
						$("rad"+parseInt((mark1[i]-(page-1)*3-1))).src="<%=basePath%>/images/lb_focus_f.png";				
					}
					mark=[];
					mark1=[];
				}else{
					if(page==markpage){
						//position=markposition;
						$("rad"+markposition).src="<%=basePath%>/images/lb_focus_f.png";
						position = 0;
						init_right();
						if(markposition==0){
							$("foc"+markposition).style.visibility="visible";
							type=0;
						}else{
							//init_right();
							type=1;
						}
					}else{
						position = 0;
						init_right();
						type = 1;
					}
				}
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
function clear_list(){
	for(var i=0;i<3;i++){		
	  $("op"+i).innerHTML = "";	
	  $("foc"+i).style.visibility="hidden";
	  $("rad"+i).src = "<%=basePath%>/images/__.gif";
	}
}
function $(id){
	return document.getElementById(id);
}
function init_right(){
	$("foc"+position).style.visibility="visible";
	//$("rad"+position).src="<%=basePath%>/images/lb_focus_f.png";
}
function JudgeUnameLength(mid){	
    if(m_json.question_list[mid+((page-1)*7)].question_title.length>29){
    	 $("que"+mid).innerHTML='<marquee startposition="95%" direction="left" width="640" scrollamount="1" behavior="scroll" scrolldelay="50">'+m_json.question_list[mid+((page-1)*7)].question_title+'</marquee>';
	}
}
function InterceptUnameLength(mid){
	if(m_json.question_list[mid+((page-1)*7)].question_title.length>29){
	  $("que"+mid).innerHTML=m_json.question_list[mid+((page-1)*7)].question_title.substring(0,29);
	}
}
function clear_right(){
	$("foc"+position).style.visibility="hidden";
	//$("rad"+position).src="<%=basePath%>/images/lb_focus_d.png";
}
function change_right(_num){
	clear_right();
	position += _num;
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
			if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ||oXmlHttp.status==0) {
				eval("m_json="+oXmlHttp.responseText);
				show_list(m_json);
				//if(area == 0){
					//$("rad0").src="<%=basePath%>/images/lb_focus_f.png";
				//}
				single = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_ifCheck+"";
			}else{ 
	
			} 
		} 
	} 
	oXmlHttp.send(null); 
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
	t_page=parseInt((m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options.length-1+3)/3);
	show_button();
    $("page").innerHTML="第&nbsp;"+page+"&nbsp;页/共&nbsp;"+t_page+"&nbsp;页";  
    if(page!=t_page){
		start=(page-1)*2+(page-1);
		end=(page-1)*2+2+(page-1);
	}else if(page==t_page){
	    start=(page-1)*2+(page-1);
		end=m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options.length-1; 
	}
	posSize=end-start;
	for(var i=0;i<3 && start<=end;i++,start++){				
		$("op"+i).innerHTML = ((page-1)*3+i+1)+"."+m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[start].option_content;
		$("rad"+i).src="<%=basePath%>/images/lb_focus_d.png";
	}
	$("theme").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_theme.substring(0,110);
	var ll = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_title;
	if(ll.length>13){
		$("que").innerHTML='<marquee startposition="95%" direction="left" width="431" scrollamount="1" behavior="scroll" scrolldelay="50">'+ll+'</marquee>';
	}else{
		$("que").innerHTML = $("que").innerHTML = ll;
	}
	
	height = 340/(m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options.length);
	$("bar").style.height = height+"px";
	
}

function init(){

	show_time();
	ajax_right();
	init_right();
	$("top0").innerHTML=tagline.split("，")[0]+"&nbsp;&nbsp;"+tagline.split("，")[1];//
	$("tttile").innerHTML=arr[mid_position].title;
}
foreach = function (obj, insp){
    if(obj == null && obj.constructor != Array){
        return [];
    }
    var i=0, len = obj.length, r = [];
    while(i<len){
        var x = insp(obj[i], i);
        if (x !== null) {
            r[r.length] = x;
        }
       i++;
    }
    return r;
};

ArrayWithout = function(){
    if (arguments.length < 2) {//参数列表
        return arguments.length == 1 ? arguments[0] : null;
    }
    var results = [];
    var aa = arguments[0];
    if (aa === null || aa.constructor != Array) {
        return null;
    }
    if(arguments[1].constructor == Array){
        var args = [];
        args[0] = aa;
        foreach(arguments[1], function(v, i){
            args[i+1] = v;
        });
    }
    else{
        args = arguments;
    }
    for(var i = 0;i < aa.length; i ++){
        var isWithout = true;
        for(var j = 1; j < args.length ; j ++){
            if(aa[i] == args[j]){
                isWithout = false;
                break;
            }
        }
        if (isWithout) {
            results.push(aa[i]);
        }
    }
    return results;
};
function ajax_action(){
	var optionsurl = "";
	for(var i = 0;i<markArr.length;i++){
		optionsurl = "&options="+markArr[i]+optionsurl;
	}
	questionId = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_id;
	var ifCheck = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_ifCheck;
	var url = '<%=vote_url%>'+"?caId="+CAID()+"&questionId="+questionId+"&ifCheck="+ifCheck+optionsurl;
	var Ajax = new AJAX_OBJ(url,complete);
	Ajax.requestData("true");
}
function complete(xmlResponse){
	eval("var m_json="+xmlResponse.responseText);
				//alert(m_json.messageInfo);
		if(m_json.messageInfo == "0"){
			//投票失败
			window.location.href="tishi1.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId+"&mark=d";
		}else if(m_json.messageInfo == "1"){
			//投票成功
			window.location.href="jg.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId+"&mark=d";
		}else if(m_json.messageInfo == "2"){
			window.location.href="tishi.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId+"&mark=d";
		}else{
			window.location.href="jg.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId+"&mark=d";
		}
}
function do_select(){
	if(area == 1){
		switch(down_position){
			case 0:
				if(page > 1){
					clear_list();
					page-=1;
					show_list();
					topxx=height*3*(page-1)+164;
					$("bar").style.top = topxx+"px";if(page ==1){
						$("btn1").src=btnArray[1].get_f;
						$("btn0").src=btnArray[0].lose_f;
					}else{
						$("btn0").src=btnArray[0].get_f;
						$("btn1").src=btnArray[1].lose_f;
						down_position = 0;
					}
					if(single=="true"){//多选
						for(var i=0;i<markArr.length;i++){
							if(markArr1[i]<parseInt((page*3+1)) && markArr1[i]>parseInt(((page-1)*3))){
								mark.push(markArr[i]);//实际的选项id
								mark1.push(markArr1[i]);	//position
							}
						}
						for(var i=0;i<markArr.length;i++){
							if(markArr1[i]==parseInt((page-1)*3+1)){
								type = 0;
								break;
							}else{
								type = 1;
							}
						}
						for(var i = 0;i<mark.length;i++){
							$("rad"+parseInt((mark1[i]-(page-1)*3-1))).src="<%=basePath%>/images/lb_focus_f.png";
						}
						mark=[];
						mark1=[];
					}else{//单选
						if(page==markpage){
							//position=markposition;
							$("rad"+markposition).src="<%=basePath%>/images/lb_focus_f.png";
						}
					}
					
				}
			break;
			case 1:
				if(page<t_page){
					clear_list();
					page+=1;
					show_list();
					topxx=height*3*(page-1)+164;
					$("bar").style.top = topxx+"px";
					if(page ==t_page){
						$("btn1").src=btnArray[0].get_f;
						$("btn0").src=btnArray[0].lose_f;
						
					}else{
						$("btn1").src=btnArray[1].get_f;
						$("btn0").src=btnArray[0].lose_f;
					}
					if(single=="true"){
						for(var i=0;i<markArr.length;i++){
							if(markArr1[i]<parseInt((page*3+1)) && markArr1[i]>parseInt(((page-1)*3))){
								mark.push(markArr[i]);	
								mark1.push(markArr1[i]);	
							}
						}
						for(var i=0;i<markArr.length;i++){
							if(markArr1[i]==parseInt((page-1)*3+1)){
								type = 0;
								break;
							}else{
								type = 1;
							}
						}
						for(var i = 0;i<mark.length;i++){
							$("rad"+parseInt((mark1[i]-(page-1)*3-1))).src="<%=basePath%>/images/lb_focus_f.png";				
						}
						mark=[];
						mark1=[];
					}else{
						if(page==markpage){
							//position=markposition;
							$("rad"+markposition).src="<%=basePath%>/images/lb_focus_f.png";	
						}
					}
				}else if(page ==t_page){
						clear_list();
						page-=1;
						show_list();
						topxx=height*3*(page-1)+164;
						$("bar").style.top = topxx+"px";if(page ==1){
							$("btn1").src=btnArray[1].get_f;
							down_position = 1;
						}else{
							$("btn0").src=btnArray[0].get_f;
							$("btn1").src=btnArray[1].lose_f;
							down_position = 0;
						}
						if(single=="true"){
							for(var i=0;i<markArr.length;i++){
								if(markArr1[i]<parseInt((page*3+1)) && markArr1[i]>parseInt(((page-1)*3))){
									mark.push(markArr[i]);//实际的选项id
									mark1.push(markArr1[i]);	//position
								}
							}
							for(var i=0;i<markArr.length;i++){
								if(markArr1[i]==parseInt((page-1)*3+1)){
									type = 0;
									break;
								}else{
									type = 1;
								}
							}
							for(var i = 0;i<mark.length;i++){
								$("rad"+parseInt((mark1[i]-(page-1)*3-1))).src="<%=basePath%>/images/lb_focus_f.png";
							}
							mark=[];
							mark1=[];
						}else{
							if(page==markpage){
								$("rad"+markposition).src="<%=basePath%>/images/lb_focus_f.png";
							}
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
	}else if(area == 2){
		inner_form();
		var form =window.document.getElementById("formcommit");
        form.action="qw.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&mark=d";
        form.submit();
	}else if(area == 3){
		//var optionsurl = "";
		//for(var i = 0;i<markArr.length;i++){
			//optionsurl = "&options="+markArr[i]+optionsurl;
		//}
		//if(optionsurl==""){
			//iPanel.overlayFrame.location.href="tishi.jsp?mid_position="+mid_position+"&right_position="+right_position+"&tagline="+tagline+"&page="+cu_page+"&questionId="+questionId;
		//}else{
			ajax_action();
		//}
	}else if(area == 0){
		if(type==0){
				$("rad"+position).src="<%=basePath%>/images/lb_focus_d.png";
				delArr1.push((page-1)*3+position+1);
				delArr.push(m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+position].option_id);
				type = 1;
				if(single=="false"){//false是单选
					markposition=position;
					markpage=page;
				}
		}else if(type == 1){
				$("rad"+position).src="<%=basePath%>/images/lb_focus_f.png";
				markArr1.push((page-1)*3+position+1);
				//alert("mar="+m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+position].option_id);
				markArr.push(m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+position].option_id);
				type = 0;
				if(single=="false" && markposition!=position && markpage==page){
					$("rad"+markposition).src="<%=basePath%>/images/lb_focus_d.png";
					delArr1.push((page-1)*3+position+1);
					delArr.push(m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+markposition].option_id);
					markposition = position;
				}else if(single=="false" && markpage!=page){
					//alert("!=");
					markArr=[];
					delArr=[];
					markArr1=[];
					delArr1=[];
					$("rad"+position).src="<%=basePath%>/images/lb_focus_f.png";
					markArr1.push((page-1)*3+position+1);
					//alert("mar="+m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+position].option_id);
					markArr.push(m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_options[(page-1)*3+position].option_id);
					type = 0;
					markpage=page;
					markposition = position;
				}
		}

		markArr = ArrayWithout(markArr,delArr);
		markArr1 = ArrayWithout(markArr1,delArr1);
		delArr=[];
	}
}
function inner_form(){
	$("text").value = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_theme;
	$("title").value = m_json.question_list[parseInt(right_position+(cu_page-1)*7)].question_title;
}
</script>
</head>

<body style="width:1280px;height:720px; background-image:url(<%=basePath%>/images/lb.jpg)" onload="init();">
<div style="position:absolute; width:380px; height:50px; left:843px; top:59px; vertical-align:middle; line-height:60px;">
  <font id="top0" style="color:#075ba8;font-size:34px; font-weight:900;"></font>&nbsp;&nbsp;&nbsp;&nbsp;<font id="top1" style="color:#075ba8;font-size:34px; font-weight:900;"></font></div>
<img id="foc0"  src="<%=basePath%>/images/focus2.png" style="position:absolute; left:540px; top:167px; visibility:hidden"/>
<img id="foc1"  src="<%=basePath%>/images/focus2.png" style="position:absolute; left:540px; top:274px; visibility:hidden"/>
<img id="foc2"  src="<%=basePath%>/images/focus2.png" style="position:absolute; left:540px; top:380px; visibility:hidden"/>
<img id="rad0"  src="<%=basePath%>/images/__.gif" style="position:absolute; left:554px; top:198px;"/>
<img id="rad1"  src="<%=basePath%>/images/__.gif" style="position:absolute; left:554px; top:292px;"/>
<img id="rad2"  src="<%=basePath%>/images/__.gif" style="position:absolute; left:554px; top:404px;"/>
<img id="bar"  src="<%=basePath%>/images/gdt.png" style="position:absolute; left:1192px; top:164px; width:5px; height:0px;"/>
<img id="tpck"  src="<%=basePath%>/images/tpck_a.png" style="position:absolute; left:940px; top:524px;"/>
<img id="ckqw"  src="<%=basePath%>/images/ck_a.png" style="position:absolute; left:332px; top:531px;"/>

<div style="position:absolute; height:28px; width:326px; top:83px; left:371px;">
<font id="tttile" style="font-size:28px;"></font></div>

<div style="position:absolute; height:28px; width:431px; top:188px; left:66px;">
  <font id="que" style="font-size:28px;color:#168cc3"></font>
</div>

<div id="theme" style="position:absolute; width:430px; height:265px; left:67px; top:234px; line-height:40px; font-size:24px;">
</div>

<div id="op0" style="position:absolute; width:561px; height:61px; top:199px; left:584px; font-size:22px;">
</div>

<div id="op1" style="position:absolute; width:561px; height:61px; top:295px; left:584px; font-size:22px;"></div>

<div id="op2" style="position:absolute; width:561px; height:61px; top:408px; left:584px; font-size:22px;"></div>

<div style="position:absolute; width:883px; height:51px; left:319px; top:623px;">
<table border="0" cellpadding="0" cellspacing="0" height="51px" width="883px" >
        <tr>
         <td width="181" align="right"><img id="btn0" src="<%=basePath%>/images/previous1.gif" style="visibility:hidden"></img></td>
         <td width="139" align="right"><img id="btn1" src="<%=basePath%>/images/next1.gif" style="visibility:hidden"></img></td>
         <td width="111" align="right"><img id="btn2" src="<%=basePath%>/images/back1.gif"></img></td>
         <td width="113" align="right"><img id="btn3" src="<%=basePath%>/images/quit1.gif"></img></td>
         
         
      <!--   
         <td width="181" align="right"><img id="btn0" src="<%=basePath%>/images/previous1.gif" style="visibility:hidden"></img></td>
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
<div style="position:absolute; height:37px; width:299px; top:530px; left:561px;">
  <font id="page" style="font-size:24px;color:#666"></font></div>
<form method="post" id="formcommit" action="">
	<input type="hidden" id="title" name="title"/><br/><!--标题  -->
	<input type="hidden" id="text" name="text"/><br/><!--简介 -->
</form>
</body>
</html>
