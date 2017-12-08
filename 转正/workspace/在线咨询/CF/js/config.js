var DEBUG = 1;		//0：真实数据，1：假数据

var isIP = 0;
var rootUrl = ["http://slave.homed.me",""][isIP];	//接口域名或IP

var ajaxUrls = {
	liveList:[rootUrl+"/room/user/get_list?accesstoken={1}&roomid={2}&pageidx={3}&pagenum={4}","data/liveList.js"][DEBUG],	// 直播列表
	liveDetail:[rootUrl+"/media/video/get_info?accesstoken={1}&videoid={2}","data/liveDetail.js"][0],//
	exportList:[rootUrl+"","data/exportList.js"][DEBUG],
};