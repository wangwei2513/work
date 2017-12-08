var DEBUG = 1;		//0 获取本地数据 1 获取接口数据
var isTest = 1;		//0 测试环境 1 正式环境
var payIP = ["http://192.168.35.106:8080","http://192.168.35.106:8080"][isTest];	//支付接口ip
var otherIP = ["http://182.150.21.110:25555","http://jfmch.berbon.com"][isTest];	//第三方接口ip
var jykMerId = ["test000001","3000000059"][isTest];						//merId 测试id test000001 正式 3000000059
var jykKeyId = ["test000001","frkasoprkgo33ojofjas32fae"][isTest];		//key 测试id test000001 正式 frkasoprkgo33ojofjas32fae
var iPanelFlag = navigator.appName.indexOf("iPanel") != -1 ? 1 : 0;		//是否为iPanel浏览器
var zzJSONUrl = "http://113.98.233.214/getData/getJSON.php"; //中转PHP地址
var zzXMLUrl = "http://113.98.233.214/getData/getXML.php";	//中专PHP地址
var Api={
	getOrder:["",payIP + "/IPMGateway-DaLian/unifiedorder"][DEBUG],		//支付系统下单，返回支付二维码信息
	queryOrder:["",payIP + "/IPMGateway-DaLian/queryOrder"][DEBUG],		//查询订单支付结果
	pay:["",otherIP + "/b2b/orderInt.htm"][DEBUG]		//发送给倍棒充值请求
};