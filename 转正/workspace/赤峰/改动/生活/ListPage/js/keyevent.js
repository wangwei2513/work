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
				case 16:
					code = "KEY_MENU";
					name = "�˵�";
					args.type = 1;
					break;
			}
		}
		return {code: code, args: args, name: name};
	}

};