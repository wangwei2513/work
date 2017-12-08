var cardNo = getCaNo();		/*本机的CA卡或者MAC地址*/
var domain = "http://10.191.85.207:8888";		/*接口域名地址*/
var DEBUG = 0;			/*0--接口模式  1--本地数据模式*/
/*获取历史会议接口*/
var historyUrl = [domain+"/PartyMemberEduBackoffice_taian/terminalController/queryHistoryMeeting?placeMaster="+cardNo+"&timeType={0}","data.js"][DEBUG];
/*获取签到情况接口*/
var signUrl = [domain+"/PartyMemberEduBackoffice_taian/terminalController/querySignList?placeMaster="+cardNo+"&identifyValue={0}&status=3","signData.js"][DEBUG];
