
var testMacAddr = "00-27-1a-00-6b-2c"//公司liancm测试需要 暂时保留
var deviceType = 1;//公司测试只能用mac  暂时保留//0：全部；1：机顶盒；2：CA卡；3：手机；4：pad；5：电脑 与上面testCardId对应

//现场实际的testMacAddr和deviceType --实际现场使用ca卡号登陆
if(window.location.href.indexOf("videoId")>-1){
	testMacAddr = CAManager.cardSerialNumber;
	deviceType = 2;
}
var slaveAddr = "http://192.168.53.107:13160";//'http://api.slave.homed.me:13160',
var	accountAddr= "http://192.168.53.127:12690";//"http://access.homed.me
