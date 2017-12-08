var debug = 2;		//0:现场本机测试  1:机顶盒 2:开发本地测试
var commynityName = "shengyuanxiaoqu";		//社区名全拼
var rootPath = ["http://192.168.1.205:96","http://10.191.85.205:96","file:///C:/Users/liuw/Desktop"][debug];
var requestUrl = rootPath + "/" + commynityName + "/data/"+ commynityName +"/";
