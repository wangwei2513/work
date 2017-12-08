//接口前面的共同的部分
var commonPath  = "http://192.168.18.66:2070/hospital_interface/interface/";
//172.26.6.31:8080--现场的地址
//医院编号，先写死绍兴二院为001
var hosID = "001";
var isDebug = 1;//0正式地址，1调试地址

var labelId = 2676;//大栏目id
var isDns = 1;//0表示使用dns，1表示使用IP

var device_id = "50001002";//navigator.appName.indexOf("iPanel") != -1?iPanel.eventFrame.device_id:"50001002";
var access_token = navigator.appName.indexOf("iPanel") != -1?iPanel.ioctlRead("accessToken"):"TOKEN50001002";
var slaveAddr = ["http://slave.homed.me:13160","http://172.26.6.32:13160"][isDns];
var programTypeUrl = slaveAddr+"/homed/programtype/get_list?depth=1&vcontrol=0&label="+labelId+"&accesstoken="+access_token;
var programListUrl = slaveAddr+"/homed/program/get_list?vodsize=246x138&pagenum=8&pageidx={1}&label={2}&accesstoken="+access_token;