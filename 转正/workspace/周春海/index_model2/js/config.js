;
var device_id = navigator.appName.indexOf("iPanel") != -1?(iPanel.eventFrame.device_id || "50001002"):"50001002";
var access_token = navigator.appName.indexOf("iPanel") != -1?(iPanel.eventFrame.access_token || "TOKEN50000013"):"TOKEN50000013";
if(typeof iPanel == "undefined"){
	access_token = "TOKEN50001002";
}

if(typeof hardware != "undefined"){
	var stbId = hardware.STB.serialNumber.substr(0,14);
}else{
	var stbId = "100000000000FDC3";
}

if(typeof CA != "undefined"){
	var cardId = CA.card.serialNumber.replace(/\(|\)/g,"")
}else{
	var cardId = "123456";
}


var getTokenType = 0;//配制获取token的方式。0：表示通过游客方式获取；1：表示普通用户登录方式
var isDebugUrl = 0;//是否用调试地址。 1表示设置为用调试地址，0表示不用
var isDNS = 0;//用域名设置为0，用ip设置为1
var slaveAddr = ["http://slave.homed.me:13160","http://172.16.242.45:13160"][isDNS];
var webclient = ["http://webclient.homed.me","http://172.16.242.45"][isDNS];

var accessAddr = ["http://access.homed.me","http://172.16.242.45"][isDNS];
var streamSlave = ["stream.slave.96599.cn","172.16.242.45"];
var get_access_token_url = slaveAddr + "/account/get_access_token";
var refresh_access_token_url = slaveAddr + "/account/refresh_access_token";
var get_weather_Url = slaveAddr + "/application/weather/get_weather_forecast?code=440303&startday=0&days=1&accesstoken=";//公司code：440303；现场：0871
var programListUrl = slaveAddr+"/homed/program/get_list?pageidx=1&pagenum=1&label=818&accesstoken=";//公司测试lablel:102, ott:12081 ;现场label：597   
var vedioInfoUrl = slaveAddr+"/media/video/get_info?";
var seriesInfoUrl = slaveAddr+"/media/series/get_info?";

var userlist = accessAddr+"/account/user/get_list?deviceno={1}&devicetype={2}&pageidx={3}&pagenum={4}";
var userlogin = accessAddr+"/account/login?deviceno={1}&devicetype={2}&accounttype={3}&account={4}&accesstoken={5}&";
var registeruser = accessAddr+"/account/user/register?username={1}&type={2}&accounttype={3}&nickname={4}&iconid=1&pwd={5}&deviceno={6}&devicetype={7}";

/* vod && 播控 需要用到的 配置 start */
var protalUrl = [webclient + "/application/yunlinxf/index.htm","index.htm"][isDebugUrl],
	vodPlayAddr = [webclient + "/application/yunlinxf/vod/newPlay/vodPlay.htm","vod/newPlay/vodPlay.htm"][isDebugUrl],
	vodIndexAddr = [webclient + "/application/yunlinxf/vod/VOD/index.htm","vod/VOD/index.htm"][isDebugUrl],
	vodDetailAddr = [webclient + "/application/yunlinxf/vod/VOD/detail.htm","vod/VOD/detail.htm"][isDebugUrl],
	searchAddr = [webclient + "/application/yunlinxf/vod/homedPortal/search.htm","vod/homedPortal/search.htm"][isDebugUrl];

var hasPauseAd = true;		// 是否有暂停广告
var rootLabel = 597;		// 栏目根节点id
var vodMode = "IP";			// 播放模式设置
var posterUrlIP = "172.16.242.45";		// 海报不支持域名方式，页面自行换成IP
var streamIP = "172.16.242.45"	// 推流不支持域名方式，页面自行换成对应的IP

// 对接该首页，以CP方式进入，设置例子如下 ：
// var vodParam = {"isCP":true,"from":"index","cpObj":{"name":"gcw","labelId":296,"appId":1090519401,"type":1,"historyLabelId":0,"newsLabelId":0};
// iPanel.eventFrame.vodParam = vodParam;
// cpObj说明如下 ：
// type : 1 , 显示模式1，同广场舞显示模式一样，显示为 主栏目 + 推荐 + 列表
// type : 2 , 显示模式2，同春城视窗显示模式一样，只有列表
// type : 2 , 显示模式3，同天华影院显示模式一样，显示为 主栏目 + 列表
// historyLabelId : 是否有观看历史栏目
// newsLabelId ：是否有最新上线栏目

/* vod && 播控 需要用到的 配置 end */


/*****************************************************************************/
/* 党员教育-二级栏目，cp地址配制。
  如果接入cp地址，isHasCPData设置为true，另外labeId、appId、title都需要设置
  如果不接入cp地址，isHasCPData设置为false
  type:为2表示没有栏目，进去就是视频。为1表示有各个栏目，进去就是栏目加视频。
*/
var dyjy_cp_data = [
{name:"小视屏",isHasCPData:false,labelId:"",appId:"",title:"",type:1},
{name:"重要文件",isHasCPData:false,labelId:"",appId:"",title:"",type:1},
{name:"专题学习",isHasCPData:true,labelId:"682",appId:"1090519443",title:"",type:1},
{name:"咨询快递",isHasCPData:false,labelId:"",appId:"",title:"",type:1},
{name:"必修课件",isHasCPData:true,labelId:"686",appId:"1090519437",title:"",type:1},
{name:"全国远教",isHasCPData:true,labelId:"684",appId:"1090519441",title:"",type:1},
{name:"视频会议",isHasCPData:true,labelId:"683",appId:"1090519442",title:"",type:2},
{name:"图文资讯",isHasCPData:false,labelId:"",appId:"",title:"",type:1},
{name:"课件点播",isHasCPData:true,labelId:"686",appId:"1090519437",title:"",type:1}];


//我的用电--接口对接
var yuming = "http://172.16.242.53:8090/";
var yuming1 = "http://172.18.17.62:8080/";
var yuming2 = "http://172.18.17.62:8080/";
var yuming3 = "http://172.18.17.62:8080/";
//查询电费户号是否绑定的接口
var queryBindingInfo = [yuming+"KahukaTVP/service/queryBindingInfo","data/queryBindingInfo.js"][isDebugUrl];
//绑定盒子与账户
var binding = [yuming+"KahukaTVP/service/binding","data/binding.js"][isDebugUrl];
//解绑盒子与账户
var unbundling = [yuming+"KahukaTVP/service/unbundling","data/unbundling.js"][isDebugUrl];
//上报户号保存
var reportPowerBill = [yuming+"KahukaTVP/service/reportPowerBill","data/reportPowerBill.js"][isDebugUrl];
//网格经理信息
var GetJlInfoByYhbh = [yuming1+"GetJlInfoByYhbh?id=","data/GetJlInfoByYhbh.js"][isDebugUrl];
//停电信息
var GetTdList = [yuming2+"GetTdList","data/GetTdList.js"][isDebugUrl];

//电费信息查询
var kgele = [yuming3+"khkin/kin/kgele?mt=query&elejfnum=","data/kgele.js"][isDebugUrl];
   


