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
				case 16:
					code = "KEY_MENU";
					name = "菜单";
					args.type = 1;
					break;
			}
		}
		return {code: code, args: args, name: name};
	}

};