

var Event = {
	mapping: function(keycode){
		var code = "";
		var name = "";
		var args = {};

		if(keycode < 58 && keycode > 47){//数字键
			args = {value: (keycode - 48), type: 0, isGlobal: false};
			code = "KEY_NUMERIC";
			name = "数字";
		} else {
			var args = {value: keycode, type: 0, isGlobal: false};
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
					code = "KEY_SELECT";
					name = "确定";
					break;
				case 82: //r
					code = "KEY_RED";
					name = "红";
					break;
				case 339://exit
					code = "KEY_EXIT";
					name = "退出";
					break;
				case 258:
					code="KEY_STANDBY";
					name = "待机";
					args.type = 1;
					break;
				case 340://back
					code = "KEY_BACK";
					name = "返回";
					break;
				/*case 372://page up
					code = "KEY_PAGE_UP";
					name = "上页";
					break;
				case 373://page down
					code = "KEY_PAGE_DOWN";
					name = "下页";
					break;*/
				case 512:
				case 771://F4测试键
				case 306:
					code = "KEY_HOMEPAGE";
					name = "首页";
					break;
				case 513:
				case 768:
					code = "KEY_MENU";
					name = "菜单";
					args.type = 1;
					break;
				case 514://EPG
					code = "KEY_EPG";
					name = "导视";
					args.type = 1;
					break;
				case 515://help
					code = "KEY_HELP";
					name = "帮助";
					break;
				case 517://VOD
					code = "KEY_VOD";
					break;
				case 518:
					code = "KEY_NVOD";
					name = "点播";
					args.type = 1;
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
				/*case 561://输入法
					code = "KEY_IME";
					name = "输入法";
					break;*/
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
				case 561:
					code = "KEY_INFO";
					name = "信息";
					args.type = 1;
					break;
				case 570://喜爱键
					code = "KEY_FAVORITE";
					name = "喜爱";
					break;
				case 595://音量+
					code="KEY_VOLUME_UP";
					name = "音量+";
					break;
				case 596://音量-
					code="KEY_VOLUME_DOWN";
					name = "音量-";
					break;
				case 593:
					code = "KEY_CHANNEL_UP";		//频道加
					name = "频道+";
					break;
				case 594:
					code = "KEY_CHANNEL_DOWN";		//频道减
					name = "频道-";
					break;
				case 597://静音键
					code = "KEY_MUTE";
					name = "静音";
					break;
				case 802:
				case 598:
					code = "KEY_AUDIO_MODE";
					name = "声道";
					break;
				case 832://red,直播
					code = "KEY_RED";
					name = "红";
					break;
				case 833://green,回看
					code = "KEY_GREEN";
					name = "绿";
					break;
				case 834://yellow,点播
					code = "KEY_YELLOW";
					name = "黄";
					break;
				case 835://blue
					code = "KEY_BLUE";
					name = "蓝";
					break;
				case 8000:
					code = "DVB_BEGIN_TUNE_DELIVERY";
					break;
				case 8001:
					code = "DVB_TUNE_SUCCESS";
					args.type = 1;
					break;
				case 8002:
					code = "DVB_TUNE_FAILED";
					args.type = 1;
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
					args.type = 1;
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
					args.type = 1;
					break;
				case 8103:
					code = "DVB_EIT_REFRESH_EVENT";
					args.type = 1;
					break;
				case 8110:
					code = "DVB_EIT_PF_READY";
					args.type = 1;
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
					args.type = 1;
					break;
				case 8301:
					code = "DVB_CHANNEL_CLOSE";
					break;
				case 8302:
					code = "DVB_LOCKED_CHNANEL";
					args.type = 1;
					break;
				case 8303:
					code = "DVB_CHANNEL_CHANGED";
					args.type = 1;
					break;
				case 8306:
					code = "DVB_CHANNEL_INFO_CHECK_SUCCESS";
					break;
				case 8307:
					code = "DVB_CHANNEL_INFO_CHECK_FAILED";
					break;
				case 8330:
					code = "DVB_PROGRAM_READY_OPEN";
					args.type = 1;
					break;
				case 5500:
					code = "EIS_IP_NETWORK_CONNECT";
					args.type = 1;
					break;
				case 5501:
					code = "EIS_IP_NETWORK_DISCONNECT";
					args.type = 1;
					break;
				case 5502:
					code = "EIS_IP_NETWORK_READY";
					args.type = 1;
					break;
				case 5503:
					code = "EIS_IP_NETWORK_FAILED";
					args.type = 1;
					break;
				case 5504:
					code = "IP_NETWORK_DHCP_MODE";//当前已经是DHCP模式
					break;
				case 5506:
					code = "EIS_IP_NETWORK_PING_DNS";
					args.type = 1;
					break;
				case 5520:
					code="EIS_IP_NETWORK_PING_RESPONSE";
					args.type = 1;
					break;
				case 5532:
					code="EIS_IP_NETWORK_PPPOE_CONNECT_SUCCESS";
					args.type=1;
					break;
					
				case 5533:
					code="EIS_IP_NETWORK_PPPOE_CONNECT_FAILED";
					args.type=1;
					break;
				case 5550:
					code = "DVB_CABLE_CONNECT_SUCCESS";
					args.type = 1;
					break;
				case 5551:
					code = "DVB_CABLE_CONNECT_FAILED";
					args.type = 1;
					break;
				case 5300://插入智能卡
					code = "CA_INSERT_SMARTCARD";
					args.type = 1;
					break;
				case 5301://拔出智能卡
					code = "CA_EVULSION_SMARTCARD";
					args.type = 1;
					break;
				case 5350://Ca_message_open
					code = "CA_MESSAGE_OPEN";
					args.type = 1;
					break;
				case 5351://Ca_message_close
					code = "CA_MESSAGE_CLOSE";
					args.type = 1;
					break;
				case 5352:
					code = "EIS_CA_INFORMATION_UPDATE";
					break;
				case 6001:
					code = "EIS_DEVICE_USB_INSERT";
					args.type = 1;
					break;
				case 6002:
					code = "EIS_DEVICE_USB_INSTALL";
					args.type = 1;
					break;	
				case 6003:
					code = "EIS_DEVICE_USB_DELETE";
					args.type = 1;
					break;	
				case 6004:
					code = "EIS_DEVICE_USB_UNAVAILABLE";
					args.type = 1;
					break;	
				case 8424:
					code = "DVB_APPMANAGER_MONITOR_UPDATE";
					args.type = 1;
					break;
				case 8430:
					code = "EIS_DVB_APPMANAGER_TMCONTENT_CHANGED";
					args.type = 1;
					break;
				case 8335://定时器提醒
					code = "EIS_DVB_ALARM_READY";
					args.type = 1;
					break;
				case 5974:
					code = "EIS_MISC_HTML_OPEN_FINISHED";
					args.type = 1;
					break;
				case 5975:
					code = "EIS_MISC_HTML_OPEN_START";
					args.type = 1;
					break;
				case 4404:
					code = "EIS_STDMESSAGE_NOT_FOUND";
					break;
				case 4408:
					code = "EIS_STDMESSAGE_REQUEST_TIMEOUT";
				case 4021:
				    code = "EIS_STD_SECURITY_RETRY";
				case 4022:
				    code = "EIS_STD_BOGUS_HEADER";
					break;
				case 5720://强制自动升级
					code = "FORCE_UPDATE";
					args.type = 1;
					break;
				case 5721://手动升级
					code = "MANUAL_UPDATE";
					args.type = 1;
					break;	
				case 5722://升级成功
					iPanel.debug("-----eventpage--升级成功");
					break;
				case 5723://升级失败
					iPanel.debug("------eventpage---------升级失败");
					break;
				/*wifi-----消息----begin*/
				case 6750://wifi设备已接入
					code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_CONNECT";
					args.type = 1;
					break;
				case 6751://wifi设备断开
					code = "EIS_IP_NETWORK_WIFI_DONGLE_PHYSICAL_DISCONNECT";
					args.type = 1;
					break;
				case 6752://网络连接就绪
					code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_READY";
					args.type = 1;
					break;
				case 6753://网络连接失败
					code = "EIS_IP_NETWORK_WIFI_DONGLE_NETWORK_FAILED";
					args.type = 1;
					break;
				case 6754://扫描成功
					code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_FINISH";
					args.type = 1;
					break;
				case 6755://扫描超时
					code = "EIS_IP_NETWORK_WIFI_DONGLE_SCAN_TIMEOUT";
					args.type = 1;
					break;
				case 6760://扫描超时
					code = "EIS_IP_NETWORK_ROUTING_DHCP_OPEN_RESULT";		//获取启动DHCP服务的结果
					args.type = 1;
					break;
				case 6761://扫描超时
					code = "EIS_IP_NETWORK_ROUTING_DHCP_CLOSE_RESULT";		//关闭DHCP服务的结果
					args.type = 1;
					break;
					/*wifi-----消息----end*/
					/*dlan-----消息----start*/
				case 6801://dlan设备上线
					code = "EIS_DLAN_DEVICE_ALIVE";
					break;
				case 6802://dlan设备下线
					code = "EIS_DLAN_DEVICE_BYEBYE";
					break;	
				case 6804:
					code = "EIS_DMR_PLAY";
					break;
				case 6803:
					code = "EIS_DMR_PLAYER_MESSAGE";
					break;
				case 6805:
					code = "EIS_DMR_STOP";
					args.type = 1;
					break;
				case 6806:
					code = "EIS_DMR_PAUSE";
					break;
				case 6807:
					code = "EIS_DMR_SEEK";
					break;
					/*dlan-----消息----end*/
				case 5202: 
					code = "EIS_VOD_PREPAREPLAY_SUCCESS";
					args.type = 1;
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
				case 5410:
					code = "EIS_MP3_WORDS_DOWNLOAD_SUCCESS";
				    break;
				case 5411:
					code = "EIS_MP3_WORDS_DOWNLOAD_FAILED";
				    break;
				case 5412:
					code = "EIS_MP3_WORDS_SHOW";
				break;
				/*********************应用自定义系统消息******************/
				case 9001:
					code = "CHANNEL_LIST_REFRESH";
					break;
				case 9002:
					code = "CHANNEL_NOT_FOUND";
					args.type = 1;
					break;
				case 9003:
					code = "SHOW_APP_NOTE_MESSAGE";
					args.type = 1;
					break;
				case 9004:
					code = "HIDE_APP_NOTE_MESSAGE";
					args.type = 1;
					break;
				case 9005:
					code = "MANUAL_CHECK_APP_NOTE";
					args.type = 1;
					break;
				case 8411:
					code = "EIS_DVB_APPMANAGER_DOWNLOAD_KEYAPPS_FAILED";
					args.type = 1;
					break;
				case 8412:
					code = "EIS_DVB_APPMANAGER_DOWNLOAD_IMPORT_FAILED";
					args.type = 1;
					break;
				case 8413:
					code = "EIS_DVB_APPMANAGER_DOWNLOAD_IMPORT_SUCCESS";
					args.type = 1;
					break;
				case 519:
				case 566:
				case 772://F5测试键
					code = "KEY_SET";
					break;
				/*****************************************************/
				
				case 771:
					iPanel.mainFrame.location.reload();
					break;
				/*三屏互动消息定义_start*/
				case 13101:  //移动终端向STB请求切屏
				iPanel.debug("-------------------STB_TO_MOBILE_CUT_RESP---------13101");
					code = "STB_TO_MOBILE_CUT_RESP";
					args.type = 1;
					break;
				case 13102:	 //移动终端向STB请求拉屏
					code = "STB_TO_MOBILE_CUT";
					args.type = 1;
					break;
				case 13103:  //移动终端应答失败
					code = "MOBILE_TO_STB_CUT";
					break;
				case 13104:  //移动终端请求EPG数据
					code = "STB_TO_MOBILE_EPG_RESP";
					args.type = 1;
					break;
				/*三屏互动消息定义_end*/
			}
		}
		return {code: code, args: args, name: name};
	}

}

