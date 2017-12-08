var Event = {
	mapping: function(keycode){
		var code = "";
		var name = "";
		var args = {};
		if(keycode < 58 && keycode > 47){//���ּ�
			args = {value: (keycode - 48), type: 0, isGlobal: false};
			code = "KEY_NUMERIC";
			name = "����";
		} else {
			var args = {value: keycode, type: 0, isGlobal: false};
			switch(keycode){
				case 1://up
				case 38:
					code = "KEY_UP";
					name = "��";
					break;
				case 2://down
				case 40:
					code = "KEY_DOWN";
					name = "��";
					break;
				case 3://left
				case 37:
					code = "KEY_LEFT";
					name = "��";
					break;
				case 4://right
				case 39:
					code = "KEY_RIGHT";
					name = "��";
					break;
				case 13://enter
					code = "KEY_SELECT";
					name = "ȷ��";
					break;
				case 27:
				case 339://exit
					code = "KEY_EXIT";
					name = "�˳�";
					break;
				case 8:
				case 340://back
					code = "KEY_BACK";
					name = "����";
					break;
				case 512:
					code = "KEY_HOMEPAGE";
					name = "��ҳ";
					break;
				case 513:
					code = "KEY_MENU";
					name = "�˵�";
					break;
				case 595://����+
				case 187://������+
					code="KEY_VOLUME_UP";
					name = "����+";
					break;
				case 596://����-
				case 189://������-
					code="KEY_VOLUME_DOWN";
					name = "����-";
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