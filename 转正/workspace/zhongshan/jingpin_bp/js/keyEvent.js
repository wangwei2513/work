var EVENT = {};
var userAgent = navigator.userAgent.toLowerCase();	//浏览器版本，用于区分是3.0和还是其它
if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){
	EVENT = {STOP:0, DOWN:1, ADVECTED:2};
}else{
	EVENT = {STOP:false, DOWN:true, ADVECTED:true};
}

if(typeof(eventHandler) == "undefined"){
	eventHandler = function(){};
}
		
//document.onkeypress = function () {return  (eventHandler(Event.mapping(event), 1));};
//document.onirkeypress = function () {return (eventHandler(Event.mapping(event), 1));};
document.onkeydown = function () {return  (eventHandler(Event.mapping(event), 1));};
document.onsystemevent = function () {return (eventHandler(Event.mapping(event),2));};

var Event = {
		mapping: function(__event){
			var keycode = __event.which;
			var code = "";
			var args = {};
			iDebug("---mapping event frame keycode=====" + keycode);
			if(keycode < 58 && keycode > 47){ 
				args = { type: false ,value: (keycode - 48)};
				code = "KEY_NUMERIC";
			} else {
				var args = {modifiers: 0, type: EVENT.STOP , value: keycode};
				switch(__event.which){
					case 1://up	
					case 38://up
					case 87:
						code = "KEY_UP";
						break;
					case 2://down
					case 40://down
					case 83:		
						code = "KEY_DOWN";
						break;
					case 3://left	
					case 37://left
					case 65:
						code = "KEY_LEFT";
						break;
					case 4://right
					case 39://right
					case 68:
						code = "KEY_RIGHT";	
						break;					
					case 13://enter
						code = "KEY_SELECT";
						break;
					case 339:	
					case 27:
						code = "KEY_EXIT";
						break;
					case 340:	
					case 8:
						code = "KEY_BACK";
						break;
					case 110:
						code = "KEY_DOT";
						break;
					case 33:	
					case 306:
						code = "KEY_PAGE_UP";
						break;
					case 34:
					case 307:
						code = "KEY_PAGE_DOWN";
						break;
					case 513:	
					case 4098:
					case 4097:
						code = "KEY_MENU";
						args.type =  EVENT.DOWN;
						break;
					case 72: //中山主页键
						code = "KEY_HOMEPAGE";
						args.type = EVENT.DOWN;
						break;
					case 263:
						code = "KEY_PAUSEPLAY";
						break;
					case 264:
						code = "KEY_FAST_FORWARD";
						break;
					case 265:
						code = "KEY_FAST_REWIND";
						break;
					case 270:
						code = "KEY_STOPPLAY";
						break;
					case 271:
						code = "KEY_SEEK";
						break;
					case 514:
					case 4192: //EPG
					case 69:
						code = "KEY_EPG";
						break;
					case 517://VOD
					case 4211:
						code = "KEY_VOD";
						break;
					case 561://
						code = "KEY_IME";
						break;
					case 562://
						code = "KEY_BROADCAST";
						break;
					case 563://tv
					case 80:
						code = "KEY_TV";
						break;
					case 564://audio
						code = "KEY_AUDIO";
						break;
					case 268: //info
					case 73:
						code = "KEY_INFO";
						break;
					case 570://
						code = "KEY_FAVORITE";
						break;
					case 593:
					case 93:
						code = "KEY_CHANNEL_UP";		//频道加
						break;
					case 594:
					case 91:
						code = "KEY_CHANNEL_DOWN";		//频道减
						break;
					case 598://声道
						code = "KEY_AUDIO_MODE";
						break;
					case 259:
					case 595:
					case 4109://音量+
						code="KEY_VOLUME_UP";
						args.type = EVENT.DOWN;
						break;
					case 260:
					case 596:
					case 4110://音量-
						code="KEY_VOLUME_DOWN";
						args.type = EVENT.DOWN;
						break;
					case 261:
					case 597://静音
					case 4108://静音键
					case 67:
						code = "KEY_MUTE";
						args.type = EVENT.DOWN;
						break;
					case 262:
						code = "KEY_TRACK";
						break;
					case 286://
						code = "KEY_VOLUMNE";
						args.type = EVENT.DOWN;
						break;
					case 832:
					case 2305:
						code = "KEY_RED";
						args.type = EVENT.DOWN;
						break;
					case 833:
					case 2306:
						code = "KEY_GREEN";
						args.type = EVENT.DOWN;
						break;
					case 834:
					case 2307:
						code = "KEY_YELLOW";
						args.type = EVENT.DOWN;
						break;
					case 835://blue
					case 2308:
						code = "KEY_BLUE";
						args.type = EVENT.DOWN;
						break;	
					case 849:
						code = "KEY_FN";
						args.type = EVENT.DOWN;
						break;
					case 768:
					case 112: 
						code = "KEY_IPTV_EVENT";
						break;
					case 5202:
						code = "EIS_VOD_PREPAREPLAY_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 5203:
						code = "EIS_VOD_CONNECT_FAILED";
						break;
					case 5204:
						code = "EIS_VOD_DVB_SERACH_FAILED";
						break;
					case 5205:
						code = "EIS_VOD_PLAY_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 5206:
						code = "EIS_VOD_PLAY_FAILED";
						break;
					case 5209:
						code = "EIS_VOD_PROGRAM_BEGIN";
						break;
					case 5210:
						code = "EIS_VOD_PROGRAM_END";
						args.type = EVENT.DOWN;
						break;
					case 5211:
						code = "EIS_VOD_RELEASE_SUCCESS";
						break;
					case 5213:
						code = "EIS_VOD_TSTVREQUEST_FAILED";
						break;
					case 5222:
						code = "EIS_VOD_START_BUFF";
						args.modifiers = __event.modifiers;
						break;
					case 5223:
						code = "EIS_VOD_STOP_BUFF";
						break;
					case 5350://Ca_message_open
						code = "CA_MESSAGE_OPEN";
						args.type = EVENT.DOWN;
						break;
					case 5351://Ca_message_close
						code = "CA_MESSAGE_CLOSE";
						args.type = 1;
						break;
					case 5355:
						code = "CA_OSD_UP_OPEN";
						args.type = EVENT.DOWN;
						break;
					case 5356:
						code = "CA_OSD_UP_CLOSE";
						args.type = EVENT.DOWN;
						break;
					case 5360:
						code = "CA_OSD_BOTTOM_OPEN";
						args.type = EVENT.DOWN;
						break;
					case 5361:
						code = "CA_OSD_BOTTOM_CLOSE";
						args.type = EVENT.DOWN;
						break;
					case 5500:
						code = "EIS_IP_NETWORK_CONNECT";
						args.type = EVENT.DOWN;
						break;
					case 5501:
						code = "EIS_IP_NETWORK_DISCONNECT";
						args.type = EVENT.DOWN;
						break;
					case 5502:
						code = "EIS_IP_NETWORK_READY";
						args.type = EVENT.DOWN;
						break;
					case 5503:
						code = "EIS_IP_NETWORK_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 5504:
						code = "EIS_IP_NETWORK_DHCP_MODE";
						args.type = EVENT.DOWN;
						break;
					case 5511:
						code = "EIS_IP_NETWORK_NTP_TIMEOUT";
						args.type = EVENT.DOWN;
						break;
					case 5512:
						code = "EIS_IP_NETWORK_SET_NTP_SERVER_NOTIFY";
						args.type = EVENT.DOWN;
						break;
					case 5550:
						code = "DVB_CABLE_CONNECT_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 5551:
						code = "DVB_CABLE_CONNECT_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 5514:
						code = "EIS_IP_NETWORK_P2P_CONNECT";
						break;
					case 5410:
						code = "EIS_MP3_WORDS_DOWNLOAD_SUCCESS";
						break;
					case 5411:
						code = "EIS_MP3_WORDS_DOWNLOAD_FAILED";
						break;
					case 5412:
						code = "EIS_MP3_WORDS_SHOW";
						args.modifiers = __event.modifiers;
						break;
					case 6102:
						code = "EIS_USB_DELETE_FILE_SUCCESS";
						break;
					case 6103:
						code = "EIS_USB_DELETE_FILE_FAILED";
						break;
					
					case 5974:
						code = "EIS_MISC_HTML_OPEN_FINISHED";
						args.type = EVENT.DOWN;
						break;
					case 5975:
						code = "EIS_MISC_HTML_OPEN_START";
						args.type = EVENT.DOWN;
						break;
					case 8000:
						code = "DVB_BEGIN_TUNE_DELIVERY";
						break;
					case 8001:
						code = "DVB_TUNE_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 8002:
						code = "DVB_TUNE_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 8010:
						code = "DVB_SEARCH_FINISHED";
						break;
					case 8011:
						code = "DVB_SEARCH_FAILED";
						args.modifiers = __event.modifiers;
						break;
					case 8020:
						code = "DVB_SERVICE_READY";
						break;
					case 8040:
						code = "DVB_NIT_READY";
						break;
					case 8110:
						code = "DVB_EIT_PF_READY";
						args.type = EVENT.DOWN;
						break;
					case 8100:
						code = "DVB_EIT_SCHEDULE_READY";
						break;
					case 8101:
						code = "DVB_EIT_TIMEOUT";
						args.type = EVENT.DOWN;
						break;
					case 8103:
						code = "DVB_EIT_REFRESH_EVENT";
						args.type = EVENT.DOWN;
						break;
					case 8300:
						code = "DVB_CHANNEL_OPEN";
						args.type = EVENT.DOWN;
						break;
					case 8301:
						code = "DVB_CHANNEL_CLOSE";
						break;
					case 8302:
						code = "DVB_LOCKED_CHNANEL";
						args.type = EVENT.DOWN;
						break;
					case 8303:
						code = "DVB_CHANNEL_CHANGED";
						args.type = EVENT.DOWN;
						break;
					case 8306:
						code = "DVB_CHANNEL_INFO_CHECK_SUCCESS";
						break;
					case 8307:
						code = "DVB_CHANNEL_INFO_CHECK_FAILED";
						break;
					case 8330:
						code = "DVB_PROGRAM_READY_OPEN";
						args.type = EVENT.DOWN;
						break;
					/*********************应用自定义系统消息 guijj add 2012-2-23 add******************/
					case 9001:
						code = "CHANNEL_LIST_REFRESH";
						break;
					case 9002:
						code = "CHANNEL_NOT_FOUND";
						args.type = EVENT.DOWN;
						break;
					case 9003:
						code = "SHOW_APP_NOTE_MESSAGE";
						args.type = EVENT.DOWN;
						break;
					case 9004:
						code = "HIDE_APP_NOTE_MESSAGE";
						args.type = EVENT.DOWN;
						break;
					case 9005:
						code = "MANUAL_CHECK_APP_NOTE";
						args.type = EVENT.DOWN;
						break;
					case 8411:
						code = "EIS_DVB_APPMANAGER_DOWNLOAD_KEYAPPS_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 8412:
						code = "EIS_DVB_APPMANAGER_DOWNLOAD_IMPORT_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 8413:
						code = "EIS_DVB_APPMANAGER_DOWNLOAD_IMPORT_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 519:
					case 566:
					case 772://F5测试键
						code = "KEY_SET";
						break;
					/*wifi-----消息----begin*/
					case 6750://wifi设备已接入
						code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_CONNECT";
						args.type = EVENT.DOWN;
						break;
					case 6751://wifi设备断开
						code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_DISCONNECT";
						args.type = EVENT.DOWN;
						break;
					case 6752://网络连接就绪
						code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_READY";
						args.type = EVENT.DOWN;
						break;
					case 6753://网络连接失败
						code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_FAILED";
						args.type = EVENT.DOWN;
						break;
					case 6754://扫描成功
						code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_FINISH";
						args.type = EVENT.DOWN;
						break;
					case 6755://
						code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_TIMEOUT";
						args.type = EVENT.DOWN;
						break;
					case 5532:
						code="EIS_IP_NETWORK_PPPOE_CONNECT_SUCCESS";
						args.type = EVENT.DOWN;
						break;
					case 5533:
						code="EIS_IP_NETWORK_PPPOE_CONNECT_FAILED";
						args.type = EVENT.DOWN;
						break;
					/*****************************************************/
				}
			}
			return {code: code, args: args};
		}
	};