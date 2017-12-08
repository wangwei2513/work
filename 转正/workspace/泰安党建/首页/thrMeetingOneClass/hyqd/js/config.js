// var cardNo = getCaNo(); /*本机的CA卡或者MAC地址*/
var cardNo = '00-27-1a-00-fd-77'
var domain = 'http://192.168.101.210:8088'; /*接口域名地址*/
var DEBUG = 0; /*0--接口模式  1--本地数据模式*/
/*获取历史会议接口*/
var historyUrl = [domain + '/PartyMemberEduBackoffice_taian/terminalController/queryMeetings?placeMaster=' + cardNo + '&type={type}' + '&timeType={timeType}' + '&isFinished=1' + '&page=1' + '&rows=20', 'js/data.js'][DEBUG]
/*获取签到情况接口*/
var signUrl = [domain + '/PartyMemberEduBackoffice_taian/terminalController/querySignList?placeMaster=' + cardNo + '&identifyValue={0}&status=3', 'js/signData.js'][DEBUG]
// http://ip:port/PartyMemberEduBackoffice/terminalController/querySignList
// http://ip:port/PartyMemberEduBackoffice/terminalController/queryHistoryMeeting
// http://ip:port/PartyMemberEduBackoffice/terminalController/queryMeetings
