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
				case 27:
				case 339://exit
					code = "KEY_EXIT";
					name = "退出";
					break;
				case 8:
				case 340://back
					code = "KEY_BACK";
					name = "返回";
					break;
				case 512:
					code = "KEY_HOMEPAGE";
					name = "首页";
					break;
				case 513:
					code = "KEY_MENU";
					name = "菜单";
					break;
				case 595://音量+
				case 187://键盘上+
					code="KEY_VOLUME_UP";
					name = "音量+";
					break;
				case 596://音量-
				case 189://键盘上-
					code="KEY_VOLUME_DOWN";
					name = "音量-";
					break;
				case 13001:
					code = "MSG_MEDIA_URL_VALID";
					break;
				case 13002:
					code = "MSG_MEDIA_URL_INVALID";
					break;
				case 13003:
				case 13199:
					code = "MSG_MEDIA_PLAY_SUCCESS";
					break;
				case 13004:
					code = "MSG_MEDIA_PLAY_FAILED";
					break;
				case 5202 : 
					code = "EIS_VOD_PREPAREPLAY_SUCCESS";
					break;
			}
		}
		return {code: code, args: args, name: name};
	}
};