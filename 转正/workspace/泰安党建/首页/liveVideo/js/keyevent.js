
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;	//判断是否是advance版本
var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var isChromeFlag = navigator.userAgent.toLowerCase().indexOf("chrome")>=0?true:false;
var returnFalseFlag = false;			//事件截止
var returnTrueFlag = true;				//事件流向下一层
var user = null;
var webkitFlag = true;
var EVENT = {STOP:false, DOWN:true, ADVECTED:true};	//控制消息流向 截止：EVENT.STOP  同层：EVENT.ADVECTED  下一层：EVENT.DOWN
var userAgent = navigator.userAgent.toLowerCase();
if(navigatorFlag == "iPanel"){
 	returnFalseFlag = isAdvanceFlag?false:0;
	returnTrueFlag = isAdvanceFlag?true:1;
	user		= users.currentUser;
	iPanel.eventFrame.ajaxErrorInfoFlag = true;
}
if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel 3.0
	webkitFlag = false;
	EVENT = {STOP:0, DOWN:1, ADVECTED:2};
}
if(webkitFlag){
	document.onkeydown = function () {return (eventHandler(eventMapping(event), 1));};
}
else{
	document.onkeypress = function () {return (eventHandler(eventMapping(event), 1));};
	document.onirkeypress = function () {return (eventHandler(eventMapping(event), 1));};
}
document.onsystemevent = function () {return (eventHandler(eventMapping(event), 1));};
/**
 * 按键键值和系统消息值的映射
 */
function eventMapping(__event){
		var keycode = __event.which || __event.keyCode;	
		divDebug("eventMapping   keycode:"+keycode);
		var code = "";
		var name = "";
		var args = {};
		if(keycode < 58 && keycode > 47){//数字键
			args = {modifiers: __event.modifiers, value: (keycode - 48), type:returnFalseFlag, isGlobal: false};
			code = "KEY_NUMERIC";
			name = "数字";
		} else {
			var args = {modifiers: __event.modifiers, value: keycode, type:returnFalseFlag, isGlobal: false};
			divDebug("eventMapping   args:"+args.modifiers);
			switch(keycode){
				case 1://up
				case 38:
					code = "KEY_UP";
					name = "上";
					break;
				case 2://down
				case 40:
					code = "KEY_DOWN";
					name = "下";
					break;
				case 3://left
				case 37:
					code = "KEY_LEFT";
					name = "左";
					break;
				case 4://right
				case 39:
					code = "KEY_RIGHT";
					name = "右";
					break;
				case 13://enter
				case 1024://pause/play 和enter做同样的处理
					code = "KEY_SELECT";
					name = "确定";
					break;
				case 339://exit
				case 27:
					code = "KEY_EXIT";
					name = "退出";
					break;
				case 258:
					code="KEY_STANDBY";
					name = "待机";
					args.type = returnTrueFlag;
					break;
				case 340://back
				case 8:
					code = "KEY_BACK";
					name = "返回";
					break;
				case 519://set
					code = "KEY_SET";
					name = "设置";
					break;
				case 372://page up
				case 33:		//pc 上 pageUP
					code = "KEY_PAGE_UP";
					name = "上页";
					break;
				case 373://page down
				case 34:
					code = "KEY_PAGE_DOWN";
					name = "下页";
					break;
				case 512:		
				case 306:	//小房子那个键 
				case 4097:
				case 17: 	//PC 上ctrl
					code = "KEY_HOMEPAGE";
					name = "首页";
					args.type = returnTrueFlag;
					break;
					
				case 513://iPanel标志的键
				case 16:	//PC shift
				//case 4098:
					code = "KEY_MENU";
					name = "菜单";
					args.type = returnTrueFlag;
					break;
				case 114://兆恒广告,添加F3
					code = "KEY_F3";
					name = "F3";
					args.type = returnTrueFlag;
					break;
				case 514://EPG
				case 4192://德州EPG
					code = "KEY_EPG";
					name = "导视";
					break;
				case 515://help
					code = "KEY_HELP";
					name = "帮助";
					break;
				case 517://VOD 点播
					code = "KEY_VOD";
					break;
				case 518:
					code = "KEY_NVOD";
					name = "点播";
					break;
				case 771:
					code = "KEY_F4";
					break;
				case 520:
					code = "KEY_STOCK";
					name = "股票";
					break;
				case 769:
					code = "KEY_F2";
					break;
				case 770:
					code = "KEY_F3";
					break;
				case 768:
					code = "KEY_F1";
					break;
				case 515:
					code = "KEY_HELP";
					break;
				case 521:
					code="KEY_MAIL";
					break;
				case 561://输入法 FN
					code = "KEY_IME";
					name = "输入法";
					break;
				case 849://输入法
					code = "EIS_IRKEY_NUMBERSIGN";
					name = "输入法";
					break
				case 848://软键盘
					code = "EIS_IRKEY_ASTERISK";
					break;
				case 571://遥控器上的循环键
					code = "EIS_IRKEY_SWITCH";
					break;
				case 562://资讯
					code = "KEY_BROADCAST";
					name = "资讯";
					break;
				case 563://tv
					code = "KEY_TV";
					name = "电视";
					break;
				case 564://audio
					code = "KEY_AUDIO";
					name = "广播";
					break;
				case 567://info
				//case 561:	//湖南的 资讯键
					code = "KEY_INFO";
					name = "信息";
					args.type = returnTrueFlag;
					break;
				case 570://喜爱键
					code = "EIS_IRKEY_PLAYLIST";
					name = "喜爱";
					break;
				case 573://喜爱键，歌华的列表键
					code = "KEY_FAVORITE";
					name = "喜爱";
					break;
				case 574:	// 湖南的 频道键
					code = "EIS_IRKEY_PROGRAM_TYPE";
					break;
				case 595://音量+
				case 187:
				case 4109://德州项目
					code="KEY_VOLUME_UP";
					name = "音量+";
					args.type = returnTrueFlag;
					break;
				case 596://音量-
				case 189:
				case 4110://德州项目
					code="KEY_VOLUME_DOWN";
					name = "音量-";
					args.type = returnTrueFlag;
					break;
				case 593:
					code = "KEY_CHANNEL_UP";		//频道加
					name = "频道+";
					args.type = returnTrueFlag;
					break;
				case 594:
					code = "KEY_CHANNEL_DOWN";		//频道减
					name = "频道-";
					args.type = returnTrueFlag;
					break;
				case 597://静音键
				case 4108://德州项目
					code = "KEY_MUTE";
					name = "静音";
					args.type = returnTrueFlag;
					break;
				
				case 800:
					code = "EIS_IRKEY_FUNCTION_A";
					break;
				case 801:
					code = "EIS_IRKEY_FUNCTION_B";
					break;
				case 802:
					code = "EIS_IRKEY_FUNCTION_C";
					break;
				case 803:
					code = "EIS_IRKEY_FUNCTION_D";
					break;
				case 598:
					code = "KEY_AUDIO_MODE";
					name = "声道";
					args.type = returnTrueFlag;
					break;
				case 832://red
				case 82: //r
				case 2305:
					code = "KEY_RED";
					name = "红";
					break;
				case 833://green
				case 2306:
					code = "KEY_GREEN";
					name = "绿";
					break;
				case 834://yellow
				case 2307:
					code = "KEY_YELLOW";
					name = "黄";
					break;
				case 835://blue
				case 2308:
					code = "KEY_BLUE";
					name = "蓝";
					break;
				case 1027://VOD 或DVD录制键
					code = "EIS_IRKEY_RECORD";
					name = "蓝";
					break;
				case 8000:
					code = "DVB_BEGIN_TUNE_DELIVERY";
					break;
				case 8001:
					code = "DVB_TUNE_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 8002:
					code = "DVB_TUNE_FAILED";
					args.type = returnTrueFlag;
					break;
				case 8010:
					code = "DVB_SEARCH_FINISHED";
					break;
				case 8011:
					code = "DVB_SEARCH_FAILED";
					break;
				case 8020:
					code = "DVB_SERVICE_READY";
					break;
				case 8040:
					code = "DVB_NIT_READY";
					break;
				case 8041:
					code = "DVB_NIT_CHANGED";
					args.type = returnTrueFlag;
					break;
				case 8050:
					code = "DVB_PAT_TIMEOUT";
					break;
				case 8080:
					code = "DVB_TDT_READY";
					break;
				case 8081:
					code = "DVB_TDT_TIMEOUT";
					break;
				case 8100:
					code = "DVB_EIT_SCHEDULE_READY";
					break;
				case 8101:
					code = "DVB_EIT_TIMEOUT";
					break;
				case 8103:
					code = "DVB_EIT_REFRESH_EVENT";
					break;
				case 8110:
					code = "DVB_EIT_PF_READY";
					break;
				case 8122:
					code = "EIS_DVB_EIT_PROGRAM_SEARCH_FINISHED";
					break;
				case 8130:
					code = "DVB_NVOD_PF_FINISHED";
					break;
				case 8131:
					code = "DVB_EIT_NVOD_SCHEDULE_FINISHED";
					break;
				case 8280:
					code = "DVB_STARTUP_FINISH";
					break;
				case 8170:
					code = "DVB_DATA_NAVIGATE_CHANGE";
				    break;
				case 8175:
					code = "DVB_PROGRAM_INTERACTIVE";
				    break;
				case 8177:
					code = "EIS_DVB_PUSH_MAIL_NOTIFY";
					break;
				case 8300:
					code = "DVB_CHANNEL_OPEN";
					break;
				case 8301:
					code = "DVB_CHANNEL_CLOSE";
					break;
				case 8302:
					code = "DVB_LOCKED_CHNANEL";
					args.type = returnTrueFlag;
					break;
				case 8303:
					code = "DVB_CHANNEL_CHANGED";
					args.type = returnTrueFlag;
					break;
				case 8306:
					code = "DVB_CHANNEL_INFO_CHECK_SUCCESS";
					break;
				case 8307:
					code = "DVB_CHANNEL_INFO_CHECK_FAILED";
					break;
				case 8330:
					code = "DVB_PROGRAM_READY_OPEN";
					args.type = returnTrueFlag;
					break;
				case 4021://域名本身不存在
					code = "EIS_STD_DOMAIN_NOT_FOUND";
					break;
				case 4022://找不到DNS server
					code = "EIS_STD_NO_DNS_SERVER";
					break;
					
				case 5202://EIS_VOD_PREPAREPLAY_SUCCESS
					code = "EIS_VOD_PREPAREPLAY_SUCCESS";
					break;
				case 5203:
					code = "EIS_VOD_CONNECT_FAILED";
					break;
				case 5205:
					code = "EIS_VOD_PLAY_SUCCESS";
					break;
				case 5206:
					code = "EIS_VOD_PLAY_FAILED";
					break;
				case 5209:
					code = "EIS_VOD_PROGRAM_BEGIN";
					break;
				case 5210:
					code = "EIS_VOD_PROGRAM_END";
					break;
				case 5222:
					code = "EIS_VOD_START_BUFF";
					break;
				case 5225:
					code = "EIS_VOD_USER_EXCEPTION";
					break;
				case 5226:
					code = "EIS_VOD_GET_PARAMETER_SUCCESS";
					break;
				case 5227:
					code = "EIS_VOD_GET_PARAMETER_FAILED";
					break;
				case 6256:
					code = "EIS_APP_DOWNLOADMGR_PRESS";
					break;
			
				case 5500:
					code = "EIS_IP_NETWORK_CONNECT";
					args.type = returnTrueFlag;
					break;
				case 5501:
					code = "EIS_IP_NETWORK_DISCONNECT";
					args.type = returnTrueFlag;
					break;
				case 5502:
					code = "EIS_IP_NETWORK_READY";
					args.type = returnTrueFlag;
					break;
				case 5503:
					code = "EIS_IP_NETWORK_FAILED";
					args.type = returnTrueFlag;
					break;
				case 5504:
					code = "IP_NETWORK_DHCP_MODE";//当前已经是DHCP模式
					break;
					
				case 5512://EIS_IP_NETWORK_SET_NTP_SERVER_NOTIFY
					code = "EIS_IP_NETWORK_SET_NTP_SERVER_NOTIFY";
					break;
				case 5510://EIS_IP_NETWORK_NTP_READY
					code = "EIS_IP_NETWORK_NTP_READY";
					break;
				case 5511:
					code = "EIS_IP_NETWORK_NTP_TIMEOUT";
					break;	
				case 5550:
					code = "DVB_CABLE_CONNECT_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 5551:
					code = "DVB_CABLE_CONNECT_FAILED";
					args.type = returnTrueFlag;
					break;
				case 5560://CM已断开连接
					code = "EIS_CABLE_NETWORK_CM_DISCONNECTED ";
					args.type = returnTrueFlag;
					break;
				case 5561://CM已连接上
					code = "EIS_CABLE_NETWORK_CM_CONNECTED";
					args.type = returnTrueFlag;
					break;
				case 5300://插入智能卡
					code = "CA_INSERT_SMARTCARD";
					args.type = returnTrueFlag;
					break;
				case 5301://拔出智能卡
					code = "CA_EVULSION_SMARTCARD";
					args.type = returnTrueFlag;
					break;
				case 5350://Ca_message_open
					code = "CA_MESSAGE_OPEN";
					args.type = returnTrueFlag;
					break;
				case 5351://Ca_message_close
					code = "CA_MESSAGE_CLOSE";
					args.type = returnTrueFlag;
					break;
				case 5352:
					code = "EIS_CA_INFORMATION_UPDATE";
					break;
				case 5400:
					code = "EIS_MP3_DOWNLOAD_SUCCESS";//mp3下载成功
					break;
				case 5404:
					code = "EIS_MP3_PLAY_FINISH";//一首MP3播放成功
					break;
				case 5410:
					code = "EIS_MP3_WORDS_DOWNLOAD_SUCCESS";//mp3歌词下发成功
					break;
				case 5411:
					code = "EIS_MP3_WORDS_DOWNLOAD_FAILED";//mp3歌词息发失败
					break;
				case 5412:
					code = "EIS_MP3_WORDS_SHOW";//应用，应用收到该消息后显示下一句歌词。
					break;
				case 5720://iploader 强制升级
					code = "EIS_IPTV_UPGRADE_FORCE";
					args.type = returnTrueFlag;
					break;
				case 5721://iploader 手动升级	
					code = "EIS_IPTV_UPGRADE_MANUAL";
					args.type = returnTrueFlag;
					break;
				case 6750://wife插入
					code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_CONNECT";
					args.type = returnTrueFlag;
					break;
				case 6751://网络设备断开
					code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_DISCONNECT";
					args.type = returnTrueFlag;
					break;
				case 6752://wife连接成功
					code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_READY";
					args.type = returnTrueFlag;
					break;
				case 6753://网络连接失败
					code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_FAILED ";
					args.type = returnTrueFlag;
					break;
				case 6754://wife扫描成功
					code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_FINISH";
					args.type = returnTrueFlag;
					break;
				case 6755:	//扫描超时			
					code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_TIMEOUT";
					args.type = returnTrueFlag;
					break;
				case 6760:	//扫描超时			
					code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_TIMEOUT";
					args.type = returnTrueFlag;
					break;
				case 6761:	//获取关闭DHCP服务的结果。并通过P2值操作成功或失败		
					code = "EIS_IP_NETWORK_ROUTING_DHCP_CLOSE_RESULT";
					args.type = returnTrueFlag;
					break;
				case 6801://有新的UPnP设备
					code = "EIS_DLAN_DEVICE_ALIVE";
					args.type = returnTrueFlag;
					break;
				case 6802://设备离线
					code = "EIS_DLAN_DEVICE_BYEBYE";
					args.type = returnTrueFlag;
					break;
				case 6803://有设备离线
					code = "EIS_DMR_PLAYER_MESSAGE";
					args.type = returnTrueFlag;
					break;
				case 6804://控制点播放文件请求
					code = "EIS_DMR_PLAY";
					args.type = returnTrueFlag;
					break;
				case 6805://控制点停止播放文件请求
					code = "EIS_DMR_STOP";
					args.type = returnTrueFlag;
					break;
				case 6806://控制点暂停播放文件请求
					code = "EIS_DMR_PAUSE";
					args.type = returnTrueFlag;
					break;
				case 6807://控制点定位播放文件请求
					code = "EIS_DMR_SEEK";
					args.type = returnTrueFlag;
					break;
				case 8380://强制自动升级
					code = "EIS_DVB_UPGRADE_FORCE";
					args.type = returnTrueFlag;
					break;
				case 8381://case 5721://手动升级
					code = "EIS_DVB_UPGRADE_MANUAL";
					args.type = returnTrueFlag;
					break;
				case 8424:
					code = "DVB_APPMANAGER_MONITOR_UPDATE";
					args.type = returnTrueFlag;
					break;
				case 8430:
					code = "EIS_DVB_APPMANAGER_TMCONTENT_CHANGED";
					args.type = returnTrueFlag;
					break;
				case 8335://定时器提醒
					code = "EIS_DVB_ALARM_READY";
					args.type = returnTrueFlag;
					break;
				case 5974:
					code = "EIS_MISC_HTML_OPEN_FINISHED";
					args.type = returnTrueFlag;
					break;
				case 5975:
					code = "EIS_MISC_HTML_OPEN_START";
					args.type = returnTrueFlag;
					break;
				case 4404:
					code = "EIS_STDMESSAGE_NOT_FOUND";
					break;
				case 4408:
					code = "EIS_STDMESSAGE_REQUEST_TIMEOUT";
					break;
				
				case 9001:
					code = "CHANNEL_LIST_REFRESH";
					break;
				case 9002:
					code = "CHANNEL_NOT_FOUND";
					args.type = returnTrueFlag;
					break;
				case 9003:
					code = "SHOW_APP_NOTE_MESSAGE";
					args.type = returnTrueFlag;
					break;
				case 9004:
					code = "HIDE_APP_NOTE_MESSAGE";
					args.type = returnTrueFlag;
					break;
				case 9005:
					code = "MANUAL_CHECK_APP_NOTE";
					args.type = returnTrueFlag;
					break;
				case 8620:
					code = "EIS_SOUNDEFFECT_MESSAGE_OPEN";
					args.type = returnTrueFlag;
					break;
				case 9666:
					code = "EIS_POP_CLOSE";
					args.type = returnTrueFlag;
					break;
				case 8287:
					code = "DVB_AD_Play";
					args.type = returnTrueFlag;
					break;
				
				case 13101:
				case 13102:
				case 13104:
					args.type = returnTrueFlag;
					break;
				
				
				case 771:
					iPanel.mainFrame.location.reload();
					break;
					
				case 5711:
					code = "EIS_SPEECH_RECOGNITION_COMMAND";
					break;
				
				case 5710:
					code = "EIS_SPEECH_RECOGNITION_NOTIFY";
					break;
				
				//NGB的键值消息
			
				case 10001:
					code = "MSG_DVB_TUNE_SUCCESS";
					break;
				case 10002:
					code = "MSG_DVB_TUNE_FAILED";
					//args.type = returnTrueFlag;
					break;
				case 10003:
					code = "MSG_DVB_TUNE_SIGNAL_WEAK";
					args.type = returnTrueFlag;
					break;
				case 10004:
					code = "MSG_DVB_TUNE_SIGNAL_LOST";
					args.type = returnTrueFlag;
					break;
				case 10005:
					code = "MSG_DVB_TUNE_SIGNAL_RECOVER";
					args.type = returnTrueFlag;
					break;
				case 10025:
					code = "MSG_DVB_SCAN_START";
					//args.type = returnTrueFlag;
					break;
				case 10026:
					code = "MSG_DVB_SCAN_FINISHED";
					args.type = returnTrueFlag;
					break;
				case 10027:
					code = "MSG_DVB_SCAN_FAILED";
					args.type = returnTrueFlag;
					break;
				case 10028:
					code = "MSG_DVB_SCAN_FIND_SERVICES";
					break;
				case 10029:
					code = "MSG_DVB_SCAN_STOP_SUCCESS";
					break;
				case 10030:
					code = "MSG_DVB_SCAN_STOP_FAILED";
					break;
				case 11001:
					code = "MSG_DVB_NIT_CHANGE";
					args.type = returnTrueFlag;
					break;
				case 11002:
					code = "MSG_DVB_PAT_CHANGE";
					args.type = returnTrueFlag;
					break;
				case 11003:
					code = "MSG_DVB_BAT_CHANGE";
					args.type = returnTrueFlag;
					break;
			 case 11004:
			 	  code = "MSG_DVB_SECTION_DATA";
			 	  args.type = returnTrueFlag;
			 	  break		
		
			
				case 12001:
					code = "MSG_BROADBAND_SAVE_CFG_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 12002:
					code = "MSG_BROADBAND_SAVE_CFG_FAILED";
					args.type = returnTrueFlag;
					break;
				case 12003:
					code = "MSG_BROADBAND_SUBMIT_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 12004:
					code = "MSG_BROADBAND_SUBMIT_FAILED";
					args.type = returnTrueFlag;
					break;
				case 12015:
					code = "MSG_BROADBAND_DHCP_READY_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 12016:
					code = "MSG_BROADBAND_DHCP_TIMEOUT";
					args.type = returnTrueFlag;
					break;
				case 12056://网线断开
					code = "MSG_BROADBAND_DISCONNECTED";
					args.type = returnTrueFlag;
					break;
				case 12057://网线插上
					code = "MSG_BROADBAND_CONNECTED";
					args.type = returnTrueFlag;					
					break;
				case 12058://网络断开
					code = "MSG_BROADBAND_LAN_DISCONNECTED";
					args.type = returnTrueFlag;	
					break;
				case 12059://网络连接
					code = "MSG_BROADBAND_LAN_CONNECTED";
					args.type = returnTrueFlag;	
					break;
				case 12060:
					code = "MSG_BROADBAND_IP_RENEW";
					args.type = returnTrueFlag;	
					break;
			
				
				case 13001://媒体源路径有效
					code = "MSG_MEDIA_URL_VALID";
					args.type = returnTrueFlag;	
					break;
				case 13002://媒体源路径无效
					code = "MSG_MEDIA_URL_INVALID";
					args.type = returnTrueFlag;	
					break;
				case 13003://开始播放成功
					code = "MSG_MEDIA_PLAY_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13004://开始播放失败
					code = "MSG_MEDIA_PLAY_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13005://步长设置成功
					code = "MSG_MEDIA_SETPACE_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13006://步长设置失败
					code = "MSG_MEDIA_SETPACE_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13007://设置播放时间点成功
					code = "MSG_MEDIA_SEEK_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13008://设置播放时间点失败
					code = "MSG_MEDIA_SEEK_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13009://暂停播放成功
					code = "MSG_MEDIA_PAUSE_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13010://暂停播放失败
					code = "MSG_MEDIA_PAUSE_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13011://恢复播放成功
					code = "MSG_MEDIA_RESUME_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13012://恢复播放失败
					code = "MSG_MEDIA_RESUME_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13013://停止播放成功
					code = "MSG_MEDIA_STOP_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13014://停止播放失败
					code = "MSG_MEDIA_STOP_FAILED";
					args.type = returnTrueFlag;	
					break;
				case 13199://播放背景视频成功
					code = "MSG_BACKGROUND_VIDEO_PLAY_SUCCESS";
					args.type = returnTrueFlag;	
					break;
				case 13120://播放背景视频失败
					code = "MSG_BACKGROUND_VIDEO_PLAY_FAILED";
					args.type = returnTrueFlag;	
					break;

				case 14001://
					code = "MSG_SAVE_DATA_SUCCESS";
					break;
				case 14002:
					code = "MSG_SAVE_DATA_FAILED";
					break;
				case 14208:
					code = "MSG_DELETEFILE_SUCCESS";
					break;
				case 14209:
					code = "MSG_DELETEFILE_FAILED";
					break;
				case 14310:
					code = "MSG_DOWNLOAED_REMOTE_FILE_SUCCESS";
					break;
				case 14311:
					code = "MSG_DOWNLOAED_REMOTE_FILE_NOT_EXIST";
					break;
				case 14312:
					code = "MSG_DOWNLOAED_REMOTE_FILE_FAILED";
					break;
				case 14313:
					code = "MSG_DOWNLOAED_REMOTE_FILE_TIMEOUT";
					break;
				case 14314:
					code = "MSG_REMOTE_FILE_EXIST";
					break;
				
				case 17001:
					code = "MSG_APPLICATION_START";
					break;
				case 17002:
					code = "MSG_APPLICATION_STOP";
					break;
				case 17003:
					code = "MSG_APPLICATION_PAUSE";
					break;
				case 17004:
					code = "MSG_APPLICATION_RESUME";
					break;
				case 17006:
					code = "MSG_APPLICATION_INSTALL";
					break;
				case 17007:
					code = "MSG_APPLICATION_UNINSTALL";
					break;
				case 17008:
					code = "MSG_APPLICATION_UPGRADE";
					break;
				case 17501:
					code = "AUTODEPLOYER_XML_VERSION_CHANGE";
					break;
				case 17502:
					code = "AUTODEPLOYER_AUTODEPLOY_COMPLETE";
					break;
				case 17503:
					code = "AUTODEPLOYER_AUTODEPLOY_FAILED";
					break;

				
				case 18001:
					code = "MSG_EPG_SEARCH_SUCCESS";
					break;
				case 18002:
					code = "MSG_EPG_SEARCH_EXCEED_MAX_COUNT";
					break;
				case 18003:
					code = "MSG_EPG_SEARCH_REFRESH";
					break;
				case 18004:
					code = "MSG_EPG_SEARCH_TIMEOUT";
					break;
				case 18005:
					code = "MSG_EPG_RECEIVE_NVODREFERENCE_SUCCESS";
					break;
				case 18006:
					code = "MSG_EPG_RECEIVE_ALL_NVODREFERENCE_SUCCESS";
					break;
				case 18007:
					code = "MSG_EPG_RECEIVE_NVODREFERENCE_TIMEOUT";
					break;
				case 18008:
					code = "MSG_EPG_RECEIVE_NVODTIMESHIFT_SUCCESS";
					break;
				case 18009:
					code = "MSG_EPG_RECEIVE_NVODTIMESHIFT_TIMEOUT";
					break;
				case 23001:
					code = "MSG_AD_UPDATE";
					break;
					
				case 20005:
					code = "MSG_REMIND_EVENT_ORDERED_ABOUT_TO_PLAY";
					args.type = returnTrueFlag;
					break;
				case 20006:
					code = "MSG_REMIND_EVENT_ORDERED_START_PLAYING";
					args.type = returnTrueFlag;
					break;
				case 9999:	//websocket消息
					code = "EIS_SOCKET_MESSAGE";
					args.type = returnTrueFlag;
					break;
				case 9998:	//二维码登录
					code = "EIS_QRCODE_LOGIN";
					args.type = returnTrueFlag;
					break;
				case 9997:	//其他终端登录
					code = "EIS_TERMINAL_LOGIN";
					args.type = returnTrueFlag;
					break;
				case 22001:	//新媒体广告更新
					code = "MEDIA_AD_DOWNLOAD_SUCCESS";
					args.type = returnTrueFlag;
					break;
				case 9888:
					code = "EIS_CHANNEL_CHANGE";
					args.type = returnTrueFlag;
					break;	
				case 9991:
					code = "EIS_SOCKET_BOUGHT_MESSAGE";
					args.type = 1;
					break;		
				default:
					args.type = returnTrueFlag;
					break;
			}
		}
		return {code: code, args: args, name: name,keycode:keycode};
	}

/*****************************************************************************************************
*主要用来记录共用按键的在页面中的处理，这里指的是相同的逻辑跳转处理,每个页面逻辑不同的未在这里处理。**
******************************************************************************************************/
var recodeFlag = false;
var recodeTimeout = -1;
function commonHandler(eventObj){
	switch(eventObj.code){
		case "KEY_SET"://系统设置
			iPanel.mainFrame.location.href = "ui://systemSetting.htm";
			break;
		case "KEY_AUDIO_MODE"://声道 功能暂时未实现
			iPanel.mainFrame.location.href = "ui://systemSetting.htm";//到系统设置中去设置声道
			break;
		case "KEY_RED"://直播		//iPanel.eventFrame.openPage(webclient+"/application/newPlay/play.php",{type:"play",frequency:null,serviceId:null});
			if(!recodeFlag){
				recodeFlag = true;	
				var tipWidget = iPanel.pageWidgets.getByName("tipWidget");
				tipWidget.show();
				var flag=media.ASR.open();
				iDebug("media.ASR.open()  return:==>"+flag);
				if(flag==1){
					tipWidget.showTip("初始化语音成功!");
					var flag1 = media.ASR.startRecognition();
					if (flag1 == 1){
						tipWidget.showTip("请开始录音");
					}else{
						tipWidget.showTip("调用出错,无法开始录音");
					}
				}else if(flag==0){
					tipWidget.showTip("初始化语音失败！");	
				}
			}else{
				recodeFlag = false;	
				media.ASR.stopRecognition();
				tipWidget.showTip("录音结束，正在匹配");
			}
			clearTimeout(recodeTimeout);
			recodeTimeout = setTimeout(function(){miniMizeTip();},60000);
			break;
		case "KEY_GREEN"://回看
			//iPanel.mainFrame.location.href = iPanel.eventFrame.webUiUrl;
			iPanel.mainFrame.location.href = iPanel.eventFrame.webUiUrl+"?backType=backTV&pageShow=ifr_1&chlId=PBCN00000659";
			break;
		case "KEY_YELLOW"://点播
			iPanel.mainFrame.location.href = iPanel.eventFrame.webUiUrl+"?pageShow=ifr_1&backType=vod";
			//iPanel.mainFrame.location.href = webclient+"/application/gridPortal/homed2013/account/manageUser.htm";
			break;
		case "KEY_BLUE"://系统设置 用户设置 
			//iPanel.mainFrame.location.href = "ui://systemSetting.htm";
			iPanel.mainFrame.location.href = webclient+"/application/homed_system/index.htm?navPos=1&selectNavPos=1";
			break;
		case "KEY_F1"://本地
			iPanel.mainFrame.location.href = "ui://systemSetting.htm";
			break;
		case "KEY_F4"://刷新
			iPanel.mainFrame.location.reload();
			break;
		case "EIS_SPEECH_RECOGNITION_COMMAND":		//5711
			var str = media.ASR.getRecordingData();
			var jsdata = eval("("+str+")");
			iDebug( "捷通华声识别结果为：" +jsdata.recresult);
			var _str = jsdata.data[0]["text"];					//data按定义可能存在多条，目前先只取一条做，后续有需求再处理
			var _type = jsdata.data[0]["apptype"];
			tipWidget.showTip("指令："+_str);
			var _value = returnCommondToValue(_str, _type);
			iDebug("str:"+_str+"  _type:"+_type+"  _value:"+_value);
			if(_value != -1) iPanel.sendSimulateEvent(2,_value,0);			//若是-1：表现为页面上处理的逻辑，不模拟事件
			break;
		case "EIS_QRCODE_LOGIN":	//9998 二维码登录
			iDebug("---EIS_QRCODE_LOGIN---P2="+eventObj.args.modifiers);
			if (eventObj.args.modifiers == 0) {
				var data = iPanel.eventFrame.loginData;
				qrcodeLoginIndex(data);
			}
			break;
		case "EIS_SPEECH_RECOGNITION_NOTIFY":		//5710
			iDebug("speech back error!---语音返回出错！");
			break;
	}
	return eventObj.args.type;
}

//二维码登录
function qrcodeLoginIndex(res){
	iDebug("---"+location.href+"---result="+JSON.stringify(res));
	
	if(res.ret=="0"){  //登录成功进入
		GP.setCookie("input_ztID", res.style_id == 0 ? 0 : res.style_id-1);
		GP.setCookie("fgID", res.style_id == 0 ? 0 : res.style_id-1);
		GP.setCookie("ztID", res.style_id == 0 ? 0 : res.style_id-1);
		
		//发送登录成功消息
		var date = Math.round(new Date().getTime()/1000);
		if (typeof iPanel.eventFrame.lastuserid != "undefined") {
			var text = {
				"lastuserid": iPanel.eventFrame.lastuserid,
				"newuserid": res.user_id,
				"deviceid": res.device_id,
				"lasthomeid": iPanel.eventFrame.lasthomeid,
				"newhomeid": res.home_id,
				"actiontype": 99900,
				"actiontime": date
			};
		} else {
			var text = {
				"userid": res.user_id,
				"deviceid": res.device_id,
				"homeid": res.home_id,
				"actiontype": 10001,
				"actiontime": date
			};
		}
		text = "f00|"+JSON.stringify(text);
		iPanel.eventFrame.socketObj.sendMessage(text);
		
		iPanel.eventFrame.home_id = res.home_id;
		iPanel.eventFrame.da_id = res.user_id;
		iPanel.eventFrame.lastuserid = res.user_id;
		iPanel.eventFrame.lasthomeid = res.home_id;
		iPanel.eventFrame.access_token = res.access_token;
		iPanel.eventFrame.da_name = res.user_name;
		iPanel.eventFrame.da_nickname = res.nick_name;
		iPanel.eventFrame.is_super_user = res.is_super_user;
		if(iPanel.eventFrame.is_super_user == 1){
			iPanel.eventFrame.master_da_id  = res.user_id;
			iPanel.eventFrame.master_access_token  = res.access_token;
		}
		iPanel.eventFrame.is_first_login = res.is_first_login;
		iPanel.eventFrame.area_code = res.area_code;
		iPanel.eventFrame.device_id = res.device_id;
		iPanel.eventFrame.fmlyId = res.user_id;//应用小游戏里面需要用到账号
		iPanel.eventFrame.loginUserId = res.user_id;
		iPanel.eventFrame.userPic = res.icon_url;
		iPanel.eventFrame.portal_id = res.portal_id;
		iPanel.eventFrame.style_id = res.style_id;
		iPanel.eventFrame.webUiUrl = res.portal_url || iPanel.eventFrame.webUiUrl;
		
		if(typeof top.httpInstance != "undefined" && top.httpInstance != null){
			top.httpInstance.stop(1);
			top.httpInstance.close();
		}
		
		setOrderList();
		getInfoById(res.access_token);
		getSystemInfo(res.access_token);
	}
}

/*******************获取单个用户信息********************/
function getInfoById(_access_token){
	var url =accountAddr + "/account/user/get_info?accesstoken="+_access_token;
	iDebug("---getInfoById---url:"+url);
	
	var ajaxObj = new AJAX_OBJ(url, function (_xhr) {
		iDebug("---getInfoById---responseText:"+_xhr.responseText);
		var res = eval('('+_xhr.responseText+')');
		if (res.ret == "0") {	
			iPanel.eventFrame.show_name = res.show_name;
		}
	});
	ajaxObj.async = false;
	ajaxObj.requestData();
}

//获取系统设置的中的信息
function getSystemInfo(_access_token){
	var globalSysInfo = {		
		alpha:100,				//菜单透明度 {["40%","50%","60%","70%","80%","90%","100%"]}
		infoTimeout:"一直显示",			//提示时间 {["一直显示","1秒钟","2秒钟","3秒钟","4秒钟","5秒钟","6秒钟","7秒钟","8秒钟","9秒钟","10秒钟"]}
		language:0,				//语言设置 {["中文","English"]}
		timeZone:isAdvanceFlag?8*3600:8,			//时区设置 {[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12]}
		
		isHasSmallVideo:1, 		//回看小窗口，点播小视频窗口预览开关，	  默认值 1，	     { 0：不显示小视频窗口， 1： 显示小视频窗口}
		isHasTVBlack: 1,		//视频比例，是否开启去电视黑边            默认值,1， 	     { 0：不去黑边，1：去黑边}
		postName:0,             //海报名称显示，                          默认值为0,         {0：激活显示， 1：全显示}
		//fontSize:0,             //字体大小，                              默认值为0,         {0：标准， 1：较大}
		isProgramListUpdate:0,             //节目列表更新区域，             默认值为0,         {0：关闭， 1：开启}
		remoteStyle:0, 		    //遥控器选择， 			                  默认值为0,	     {0:iPanel, 1:朝歌， 2：电信}
		
		openSoundFlag:1,		//基本音效  {["关闭","开启"]}      
		soundVolume:10,			//音效音量 [[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100]]
		soundFlag:1,			//首页音量 ["关闭","开启"]
		powerSound:1,			//开机音效 {["关闭","开启"]}
		
		news:1,                 //滚动新闻字幕[词条],                          默认值为0,         {0：关闭， 1：开启}
		reminder:1,             //节目回看提醒,                          默认值为0,         {0：关闭， 1：开启}
		isRebackTV:1, 			//从头看提醒，			                 默认值为0,  	    {0：关闭， 1：开启}
		isInteractiveTV:1,		//是否开启互动电视调查， 	                 默认值为1，    	{ 0：不开启， 1：开启}
		changeChannelStyle:0, 	//频道切换模式， 		                 默认值为0，	    { 0：十字架， 1：十字架+菜单 }
		
		videoMode:"AUTO",			//制式选择 {["AUTO","NTSC","PAL"]}
		soundMode:"stereo",			//默认声道 {["混合","立体","左声道","右声道"]}
		videoAspect:1,			//显示比例 {["自动","16:9","4:3"]}
		videoOutputPort:"HDMI",		//显示模式 {["HDMI","SPDIF"]}
		
		keyboardStyle:1, 		//键盘设置，			                 默认值为1，	    { 0：机械， 1：顺序 }
		keyboardLanguage:0, 	//键盘的默认输入形式， 	                 默认值为0， 	    { 0:中文， 1：英文, 2:笔画 }
		searchMode: 1,			//默认检索模式，	                     默认值为1，        { 0:文字列表， 1：图文列表 }
		listStyle:1,            //频道列表模式                           默认值为1，        { 0:马赛克，1:文字列表， 2：图文列表 }
		//isPassWord:0,         //机顶盒密码                            默认值为0，        {0：关闭， 1：开启}
		detailsPageStyle:0    //详情页风格                             默认值为0，        {0：1.0， 1：2.0}			
	};
	
	var url = slaveAddr+"/system/get?accesstoken="+_access_token+"&show=1";
	iDebug("---pj---getSystemInfo---url:"+url);
	
	var ajaxObj = new AJAX_OBJ(url, function (_xhr) {
		iDebug("---pj---getSystemInfo---responseText:"+_xhr.responseText);
		var res = eval('('+_xhr.responseText+')');
		if(res.ret=="0"){
			if (res.show == null) {
				//media.picture.alpha = 100;
				//media.picture.save();
			} else {
				globalSysInfo.alpha = typeof res.show.alpha!="undefined"?res.show.alpha:globalSysInfo.alpha;
				//media.picture.alpha = globalSysInfo.alpha;
				globalSysInfo.infoTimeout = typeof res.show.infoTimeout!= "undefined"?res.show.infoTimeout*1:globalSysInfo.infoTimeout;
				users.currentUser.infoTimeout = globalSysInfo.infoTimeout;
				globalSysInfo.language = typeof res.show.language != "undefined"?res.show.language:globalSysInfo.language;
				globalSysInfo.timeZone = typeof res.show.timeZone!= "undefined"?res.show.timeZone:globalSysInfo.timeZone;
				globalSysInfo.isHasSmallVideo = typeof res.show.isHasSmallVideo!= "undefined"?res.show.isHasSmallVideo:globalSysInfo.isHasSmallVideo;
				globalSysInfo.isHasTVBlack = typeof res.show.isHasTVBlack!= "undefined"?res.show.isHasTVBlack:globalSysInfo.isHasTVBlack;
				globalSysInfo.postName =  typeof res.show.postName!= "undefined"?res.show.postName:globalSysInfo.postName;
				globalSysInfo.isProgramListUpdate = typeof res.show.isProgramListUpdate!= "undefined"?res.show.isProgramListUpdate:globalSysInfo.isProgramListUpdate;
				globalSysInfo.remoteStyle = typeof res.show.remoteStyle!= "undefined"?res.show.remoteStyle:globalSysInfo.remoteStyle;
				globalSysInfo.openSoundFlag = typeof res.show.openSoundFlag!= "undefined"?res.show.openSoundFlag:globalSysInfo.openSoundFlag;
				globalSysInfo.soundVolume = typeof res.show.soundVolume!= "undefined"?res.show.soundVolume:globalSysInfo.soundVolume; 
				media.sound.value  = globalSysInfo.soundVolume;
				globalSysInfo.soundFlag = typeof res.show.soundFlag!= "undefined"?res.show.soundFlag:globalSysInfo.soundFlag;
				globalSysInfo.powerSound = typeof res.show.powerSound!= "undefined"?res.show.powerSound:globalSysInfo.powerSound;
				globalSysInfo.news = typeof res.show.news!= "undefined"?res.show.news:globalSysInfo.news;
				globalSysInfo.reminder = typeof res.show.reminder!= "undefined"?res.show.reminder:globalSysInfo.reminder;
				globalSysInfo.isRebackTV = typeof res.show.isRebackTV!= "undefined"?res.show.isRebackTV:globalSysInfo.isRebackTV;
				globalSysInfo.isInteractiveTV = typeof res.show.isInteractiveTV!= "undefined"?res.show.isInteractiveTV:globalSysInfo.isInteractiveTV;
				globalSysInfo.changeChannelStyle = typeof res.show.changeChannelStyle!= "undefined"?res.show.changeChannelStyle:globalSysInfo.changeChannelStyle;
				globalSysInfo.videoMode = typeof res.show.videoMode!= "undefined"?res.show.videoMode:globalSysInfo.videoMode;
				globalSysInfo.soundMode = typeof res.show.soundMode!= "undefined"?res.show.soundMode*1:globalSysInfo.soundMode;
				globalSysInfo.videoAspect = typeof res.show.videoAspect!= "undefined"?res.show.videoAspect:globalSysInfo.videoAspect;
				globalSysInfo.videoOutputPort = typeof res.show.videoOutputPort!= "undefined"?res.show.videoOutputPort*1:globalSysInfo.videoOutputPort;
				globalSysInfo.keyboardLanguage = typeof res.show.keyboardLanguage!= "undefined"?res.show.keyboardLanguage:globalSysInfo.keyboardLanguage;
				globalSysInfo.keyboardStyle = typeof res.show.keyboardStyle!= "undefined"?res.show.keyboardStyle:globalSysInfo.keyboardStyle;
				globalSysInfo.searchMode = typeof res.show.searchMode!= "undefined"?res.show.searchMode:globalSysInfo.searchMode;
				globalSysInfo.listStyle = typeof res.show.listStyle!= "undefined"?res.show.listStyle:globalSysInfo.listStyle;
				globalSysInfo.detailsPageStyle = typeof res.show.detailsPageStyle!= "undefined"?res.show.detailsPageStyle:globalSysInfo.detailsPageStyle;
				iPanel.eventFrame.globalSysInfo = globalSysInfo;
				var globalSysInfoStr = '{"alpha":'+globalSysInfo.alpha+',"infoTimeout":"'+globalSysInfo.infoTimeout+'","language":"'+globalSysInfo.language+'","timeZone":'+globalSysInfo.timeZone+',"isHasSmallVideo":'+globalSysInfo.isHasSmallVideo+',"isHasTVBlack": '+globalSysInfo.isHasTVBlack+',"postName":'+globalSysInfo.postName+',"isProgramListUpdate":'+globalSysInfo.isProgramListUpdate+',"remoteStyle":'+globalSysInfo.remoteStyle+',"openSoundFlag":'+globalSysInfo.openSoundFlag+',"soundVolume":'+globalSysInfo.soundVolume+',"soundFlag":'+globalSysInfo.soundFlag+',"powerSound":'+globalSysInfo.powerSound+',"news":'+globalSysInfo.news+',"reminder":'+globalSysInfo.reminder+',"isRebackTV":'+globalSysInfo.isRebackTV+',"isInteractiveTV":'+globalSysInfo.isInteractiveTV+',"changeChannelStyle":'+globalSysInfo.changeChannelStyle+',"videoMode":"'+globalSysInfo.videoMode+'","soundMode":"'+globalSysInfo.soundMode+'","videoAspect":"'+globalSysInfo.videoAspect+'","videoOutputPort":"'+globalSysInfo.videoOutputPort+'","keyboardStyle":'+globalSysInfo.keyboardStyle+',"keyboardLanguage":'+globalSysInfo.keyboardLanguage+',"searchMode":'+globalSysInfo.searchMode+',"listStyle":'+globalSysInfo.listStyle+',"detailsPageStyle":'+globalSysInfo.detailsPageStyle+'}';
				iPanel.misc.setGlobal("globalSysInfoStr",globalSysInfoStr);
				
				iDebug("-----keyevent.js-----globalSysInfoStr:"+iPanel.misc.getGlobal("globalSysInfoStr"));
			}
		}
		iPanel.eventFrame.loginFlag = false;
		iDebug("__iPanel.eventFrame.loginFlag=="+iPanel.eventFrame.loginFlag);
		
		iDebug("__iPanel.eventFrame.webUiUrl=="+iPanel.eventFrame.webUiUrl);
		if(typeof gotoPortal != "undefined") gotoPortal(iPanel.eventFrame.webUiUrl,true);//强制重新打开一次
		else window.location.href = iPanel.eventFrame.webUiUrl;
	});
	ajaxObj.failureCallback = function () {
		showdialog("服务器响应失败");
		
		iDebug("__iPanel.eventFrame.webUiUrl=="+iPanel.eventFrame.webUiUrl);
		if(typeof gotoPortal != "undefined") gotoPortal(iPanel.eventFrame.webUiUrl,true);//强制重新打开一次
		else window.location.href = iPanel.eventFrame.webUiUrl;
	};
	ajaxObj.requestData();
}

function returnCommondToValue(str, type){
	
	return -1;
}

function miniMizeTip(){
	var tipWidget = iPanel.pageWidgets.getByName("tipWidget");
	tipWidget.minimize();
}


function initPage(f) {
	 f.$ = function(id) {
		 return f.document.getElementById(id);
	 }
	if(navigatorFlag == "iPanel"){
		user = users.currentUser;
		f.user = user;
		f.lang = (user.UILanguage == 'eng') ? 1:0;
	}
	if(typeof(f.eventHandler) == "undefined"){
		f.eventHandler = function(){};
	}
   // f.document.onkeypress = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
	f.document.onkeydown = function () {return (f.eventHandler(eventMapping(f.event), 1));};
    f.document.onirkeypress = function () {return (f.eventHandler(eventMapping(f.event), 1));};
    f.document.onsystemevent = function () {return (f.eventHandler(eventMapping(f.event), 2));};
	
	/*f.$ = function(id) {
		var element = document.getElementById(id);
		return extend(element,domMethod);
	}

	var domMethod = {//DOM扩展方法
		css:function(_opation){
			if(typeof(_opation)=="string"){
				return this.style[_opation];
			}else{
				extend(this.style,_opation);
			}
		},
		bg:function(_opation){
			if(/^#.+/.test(_opation)){//背景色
				this.style.backgroundColor = _opation;	
			}else{//背景图片
				this.style.backgroundImage = "url("+_opation+")";	
			}
		}
	}
	function extend(destination, source){//扩展对象
		for (var property in source){
			destination[property] = source[property];
		}
		return destination;	
	}*/
}

//设置预定闹钟，由于每次登陆都要用到此函数，因此提取出来放到公共文件
function setOrderList () {
	//登陆成功将之前的alarm清空，在从数据库取出预定数据
	user.alarms.removeAll();
	
	var url = slaveAddr+"/media/event/get_order_list?accesstoken="+iPanel.eventFrame.access_token+"&pageidx=1&pagenum=10000";
	iDebug("---setOrderList---url:"+url);
	
	var ajaxObj = new AJAX_OBJ(url, function (_xhr) {
		iDebug("---get_order_list---responseText:"+_xhr.responseText);
		var res = eval('('+_xhr.responseText+')');
		if (res.ret == 0 && res.event_list != null) {
			var alarms = {},
				event = null,
				order_ahead_time = iPanel.eventFrame.order_ahead_time;
			
			for (var i = 0, len = res.event_list.length; i < len; i++) {
				event = res.event_list[i];
				var time = changeToDate(event.start_time-order_ahead_time);
				iDebug("-----order_start_time-----"+time);
				
				var alarm = new Alarm(time, 199);
				alarm.setStatus(1);
				var content = {
					chnl_id: event.chnl_id,
					order_time: event.start_time
				};
				alarm.content = JSON.stringify(content);
				iDebug("-----alarm.content-----"+alarm.content);
				var state = user.alarms.add(alarm);
				
				var key = event.chnl_id+"_"+event.start_time;
				iDebug("---add alarm---state="+state+"---key="+key);
				if (state == 1) {
					alarms[key] = {
						alarm_id: alarm.id,
						event_id: event.event_id,
						chnl_id: event.chnl_id,
						event_name: event.event_name,
						order_time: event.start_time
					};
				}
			}
			
			iDebug("-----user.alarms.length-----"+user.alarms.length);
			iPanel.eventFrame.alarms = alarms;
		}
	});
	ajaxObj.requestData();
}

//转换utc时间为yyyy/mm/dd&hh:mm:ss
function changeToDate (utc) {
	var date 	= new Date(utc*1000);
	var year 	= date.getFullYear(),
		month	= addZero(date.getMonth()+1),
		day		= addZero(date.getDate()),
		hour	= addZero(date.getHours()),
		min		= addZero(date.getMinutes()),
		sec		= addZero(date.getSeconds());
	
	return year+"/"+month+"/"+day+"&"+hour+":"+min+":"+sec;
}

function addZero (num) {
	return num > 9 ? ""+num : "0"+num;
}

//登录错误提示
var loginTips = {
	9215: "您的家庭暂时还未激活，请激活后再登录！",
	9216: "您的账户已欠费，请及时缴费！",
	9217: "您的账户已停机，请及时到营业厅开通！",
	9218: "您的账户已销户，请及时到营业厅开通！"
};

//ajax请求失败提示
function ajaxErrorInfo (str1, str2, callback, hideTime) {
	iDebug("---ajaxErrorInfo---str1="+str1+"---str2="+str2);
	
	if (navigatorFlag == "iPanel" && iPanel.eventFrame.ajaxErrorInfoFlag) {
		//直到ajax请求widget销毁之前不允许再调用
		iPanel.eventFrame.ajaxErrorInfoFlag = false;
		
		var ajaxErrorWidget = iPanel.pageWidgets.getByName("ajaxErrorWidget");
		
		if(ajaxErrorWidget == undefined || ajaxErrorWidget == null){
			iPanel.pageWidgets.create("ajaxErrorWidget", webclient+"/application/commonJS/ajaxErrorWidget.htm");
			checkAjaxErrorWidget(str1, str2, callback, hideTime);
		}else{
			ajaxErrorWidget.show();
			ajaxErrorWidget.showAjaxErrorInfo(str1, str2, callback, hideTime);
		}
	}
}

function checkAjaxErrorWidget (str1, str2, callback, hideTime) {
	var ajaxErrorWidget = iPanel.pageWidgets.getByName("ajaxErrorWidget");
	iDebug("---ajaxErrorWidget="+ajaxErrorWidget);
	if(ajaxErrorWidget == undefined || ajaxErrorWidget == null){
		checkAjaxErrorWidgetTimer = setTimeout(function(){
			checkAjaxErrorWidget(str1, str2, callback, hideTime);
		}, 50);
	}else{
		ajaxErrorWidget.moveTo(0, 0);
		ajaxErrorWidget.resizeTo(1280, 720);
		ajaxErrorWidget.discardEvent = 1;
		ajaxErrorWidget.withoutFocus = 1;
		ajaxErrorWidget.show();
		ajaxErrorWidget.showAjaxErrorInfo(str1, str2, callback, hideTime);
		
		clearTimeout(checkAjaxErrorWidgetTimer);
	}
	
	//为了防止widget一直创建不成功或者销毁不成功导致标志位一直为false，5秒后自动把标志位置为true
	setTimeout(function () {
		iPanel.eventFrame.ajaxErrorInfoFlag = true;
		clearTimeout(checkAjaxErrorWidgetTimer);
	}, 5000);
}
function $(id) {
    return document.getElementById(id);
}
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug("---35---"+str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError("---35---"+str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log("---35---"+str);
	}
}

