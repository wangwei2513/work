var VirtualKeyboard = function() {
	var I = this;
	I.$VERSION$ = "01.00.00.01";
	I.$AUTHOR$ = "chenyong";
	/* 当前语言设置，默认为中文 */
	I.lang = "zh_CN";
	/* 焦点id，默认焦点在·上 */
	I.lastFocus = "kb_b00";
	/* 设置输入框id和输入框类型 */
	I.inputId = "inputTopic";
	I.inputType = "div";
	/* 键盘状态,分为normal：正常状态，novkey：novkey：无按键，capsLK: 大写，shift：Shift按键 */
	I.inputMethod = "normal";
	/*返回外部键盘状态，状态分为open，close*/
	I.virtualKeyboardStatus = "close";
	I.keyboardPosition = [40,50];
	I.setvkPosition = false;
	/*初始化键盘*/
	I.initkeyboard = function() {
		if (I.virtualKeyboardStatus=="close") {/*虚拟键盘状态如果是关闭状态，函数不执行*/
			return;
		}
		initLanguage();
		initvirtualkeyboard();
		initFocus();
		initInputMehodStatus();
		setkeyboardposition(I.setvkPosition);
	};
	
	/*键盘焦点坐标*/
	var x = 0;
	var y = 0;
	/* 是否有显示中文选择框,默认状态下不显示 */
	var isShowSelectBox = false;
	/* 汉字字典 */
	var IObj = {};
	/* 英文对应汉字字符串 */
	var dataObj = "";
	/* 上次输入英文字符串 */
	var lastWord = "";
	/* 焦点移动所需className */
	var _focusClassName = "select";
	var _blurClassName = "Other";
	/* 汉字选择框当前页码和总页数 */
	var currPage = 1;
	var totalPage = 1;
	/*chiListTrId,selectBoxId,这两个参数，请不要更改*/
	/*汉字List所在tr的id*/
	var chiListTrId = "__chiListStr";
	/*汉字所在div的id*/
	var selectBoxId = "__selectBox";
	/*新添加div的id*/
	var myVirtualKeyboardId = "myVirtualKeyboard";
	/* 语言初始化 */
	function initLanguage() {
		var keyFlag = I.lang == "zh_CN";
		normalKEY = keyFlag ? vk_zh["normal"] : vk_en["normal"];
		shiftKEY = keyFlag ? vk_zh["shift"] : vk_en["shift"];
		IObj = keyFlag ? vk_zh["I"] : {};
	}
	/*初始化按键状态*/
	function initInputMehodStatus() {
		$("vk_div").className = I.inputMethod;
	}
	/*初始化虚拟键盘和中文选择框*/
	function initvirtualkeyboard() {
		if ($(myVirtualKeyboardId) == undefined) {
			var newDiv = document.createElement("div");
			newDiv.id = myVirtualKeyboardId;
			var __str = "<div id=\"initvirtualkeyboardId\"><div id=\""+selectBoxId+"\">"
					+ initSBox() + "</div>" + initVK() + "</div>";
			newDiv.innerHTML = __str;
			document.body.appendChild(newDiv);
		} else {
			var __str = "<div id=\"initvirtualkeyboardId\"><div id=\""+selectBoxId+"\">"
					+ initSBox() + "</div>" + initVK() + "</div>";
			$(myVirtualKeyboardId).innerHTML = __str;
		}
	}
	
	/*初始化焦点，当焦点与输入状态冲突时，会出现异常*/
	function initFocus() {
		y = hexToDecimal(I.lastFocus.substring(4,5));
		x = hexToDecimal(I.lastFocus.substring(5));
		setFocus1();
	}
	
	/*关闭键盘*/
	function closeKeyboard() {
		I.lastFocus = "kb_b00";
		I.isShowSelectBox = false;
		I.IObj = {};
		I.lastWord = "";
		I.inputMethod = "normal";
		$(I.inputId).removeAttribute("readonly");
		$(myVirtualKeyboardId).innerHTML = "";
		I.virtualKeyboardStatus = "close";
	}
	
	/* 键盘生成字符串 */
	var keyboardStr = "";
	var normalKEY = [];
	var shiftKEY = [];
	
	/*初始化汉字选择框*/
	function initSBox() {
		selectBoxStr = "<table id=\"chineseSelect\" class=\"chineseSelect\">";
		var tmp = "<tr id=\""+chiListTrId+"\"><td id=\"selectBoxStart\"><<</td>";
		for ( var i = 0; i < 10; i++) {
			tmp += "<td >" + i + ":<span id=\"zh_" + i + "\"></span></td>";
		}
		tmp += "<td id=\"selectBoxEnd\">>></td></tr>";
		selectBoxStr += tmp
				+ "<tr><td colspan=\"12\"><span id=\"currPage\">0</span>/<span id=\"totalPage\">0</span><span id=\"tips\" style=\"margin-left:200px;\">温馨提示：“*”往上翻页&nbsp;&nbsp;“#”往下翻页</span></td></tr></table>";
		return selectBoxStr;
	}
	
	/*初始化键盘按键*/
	function initVK() {
		keyboardStr = "<div id=\"vk_div\"><div id=\"vk_keyboard\">";
		for ( var i = 0; i < normalKEY.length; i++) {
			var tmpi = "<div id=\"vk_" + i + "\" class=\"line" + i + "\">";
			var nextLength = 0;
			switch (i) {
			case 0:
				nextLength = 15;
				break;
			case 1:
				nextLength = 14;
				break;
			case 2:
			case 3:
				nextLength = 13;
				break;
			case 4:
				nextLength = 7;
				break;
			}
			var tmpNormalIndex = normalKEY[i]["index"];
			var tmpShiftIndex = shiftKEY[i]["index"];
			var tmpNormalKey = normalKEY[i]["key"];
			var tmpShiftKey = shiftKEY[i]["key"];
			var tmpNormalLength = tmpNormalKey.length;
			var tmpShiftLength = tmpShiftKey.length;
			for ( var j = 0; j < nextLength; j++) {
				var tmpj = "<div id=\"kb_b" + i + decimalToHex(j) + "\">";
				var _tmpId = "";
				if (i == 0 && j == 0) {
					_tmpId = " id=\"spe0\"";
				}
				var tmpSpan0 = "";
				var tmpSpan1 = "";
				if (tmpShiftLength > 0 && j >= tmpShiftIndex
						&& j - tmpShiftIndex < tmpShiftLength) {
					tmpSpan0 = "<span" + _tmpId + " class=\"rightop\">"
							+ tmpShiftKey.charAt(j - tmpShiftIndex) + "</span>";
				}
				if (tmpNormalLength > 0 && j >= tmpNormalIndex
						&& j - tmpNormalIndex < tmpNormalLength) {
					tmpSpan1 = "<span class=\"center\">"
							+ normalKEY[i]["key"].charAt(j - tmpNormalIndex)
							+ "</span>";
				} else {
					tmpSpan1 = "";
				}
				if (i == 4 && j == 2) {
					tmpSpan1 = " ";
				}
				tmpj += tmpSpan0 + tmpSpan1;
				tmpi += tmpj + "</div>";
			}
			keyboardStr += tmpi + "</div>";
		}
		keyboardStr += "</div></div>";
		return keyboardStr;
	}
	/*十六进制转十进制*/
	function hexToDecimal(__hex) {
		return parseInt(__hex, 16);
	}
	/*十进制转十六进制*/
	function decimalToHex(__decimal) {
		return __decimal.toString(16);
	}

	function $(id) {
		return document.getElementById(id);
	}
	
	/*设置键盘位置*/
	function setkeyboardposition(setvkPosition) {
		var _left = 0;
		var _top = 0;
		if (setvkPosition) {
			_left = I.keyboardPosition[0];
			_top = I.keyboardPosition[1];
		} else {
			_left = $(I.inputId).offsetLeft;
			_top = $(I.inputId).offsetTop;
			if (_left > 550) {
				_left = 550;
			}
			if (_top > 500) {
				var tmpheight = $(I.inputId).style.height;
				if (tmpheight==undefined || tmpheight==null || tmpheight =="") {
					_top = 500;
				} else {
					_top -= parseInt(tmpheight.substring(0, tmpheight.length-2));
				}
			}
			_top += 48;
		}
		$(I.inputId).setAttribute("readonly", "true");
		$("initvirtualkeyboardId").style.marginTop = _top + "px";
		$("initvirtualkeyboardId").style.marginLeft = _left + "px";
	}
	

	I.hasMoreFocus = {
		kb_b1d : [ "kb_b1d", "kb_b2c" ],/* enter 是由两个div组成，获取或者失去焦点要同时设置两个div的class属性 */
		kb_b2c : [ "kb_b1d", "kb_b2c" ]//,
//		kb_b30 : [ "kb_b30", "kb_b3b" ],/* shift 是有两个div，获取或者失焦点要同时设置两个div的class属性 */
//		kb_b3b : [ "kb_b30", "kb_b3b" ],
//		kb_b40 : [ "kb_b40", "kb_b44" ],/* ctrl 是有两个div，获取或者失焦点要同时设置两个div的class属性 */
//		kb_b44 : [ "kb_b40", "kb_b44" ],
//		kb_b41 : [ "kb_b41", "kb_b43" ],/* alt 是有两个div，获取或者失焦点要同时设置两个div的class属性 */
//		kb_b43 : [ "kb_b41", "kb_b43" ]
	};

	/* 键盘焦点移动 */
	function changeFocus() {
		if (I.lastFocus in I.hasMoreFocus) {
			setFocus0(I.hasMoreFocus[I.lastFocus][0], I.hasMoreFocus[I.lastFocus][1]);
			if (I.lastFocus == "kb_b40" || I.lastFocus == "kb_b44"
					|| I.lastFocus == "kb_b41" || I.lastFocus == "kb_b43") {
				I.inputMethod = "normal";
				$("vk_div").className = "other";
			}
		} else {
			setFocus0();
		}
		I.lastFocus = "kb_b" + y + decimalToHex(x);
		if (I.lastFocus in I.hasMoreFocus) {
			setFocus1(I.hasMoreFocus[I.lastFocus][0], I.hasMoreFocus[I.lastFocus][1]);
		} else {
			setFocus1();
		}
	}

	function setFocus0(focus0, focus1) {
		var focusFlag = focus0 != null ? focus1 != null ? 0 : 1 : 2;
		if (focusFlag == 0) {
			$(focus0).className = _blurClassName;
			$(focus1).className = _blurClassName;
		} else {
			$(I.lastFocus).className = _blurClassName;
		}
	}

	function setFocus1(focus0, focus1) {
		var focusFlag = focus0 != null ? focus1 != null ? 0 : 1 : 2;
		if (focusFlag == 0) {
			$(focus0).className = _focusClassName;
			$(focus1).className = _focusClassName;
		} else {
			$(I.lastFocus).className = _focusClassName;
		}
	}
	

	this.eventHandler = function(keycode) {
		if (I.virtualKeyboardStatus=="close") {/*虚拟键盘状态如果是关闭状态，函数不执行*/
			return;
		}
		switch (keycode) {
		case 48:/* 0 */
			if (isShowSelectBox) {
				doChoose(0);
			} else {
				setInputValue(0);
			}
			return;
			break;
		case 49:/* 1 */
			if (isShowSelectBox) {
				doChoose(1);
			} else {
				setInputValue(1);
			}
			return;
			break;
		case 50:/* 2 */
			if (isShowSelectBox) {
				doChoose(2);
			} else {
				setInputValue(2);
			}
			return;
			break;
		case 51:/* 3 */
			if (isShowSelectBox) {
				doChoose(3);
			} else {
				setInputValue(3);
			}
			return;
			break;
		case 52:/* 4 */
			if (isShowSelectBox) {
				doChoose(4);
			} else {
				setInputValue(4);
			}
			return;
			break;
		case 53:/* 5 */
			if (isShowSelectBox) {
				doChoose(5);
			} else {
				setInputValue(5);
			}
			return;
			break;
		case 54:/* 6 */
			if (isShowSelectBox) {
				doChoose(6);
			} else {
				setInputValue(6);
			}
			return;
			break;
		case 55:/* 7 */
			if (isShowSelectBox) {
				doChoose(7);
			} else {
				setInputValue(7);
			}
			return;
			break;
		case 56:/* 8 */
			if (isShowSelectBox) {
				doChoose(8);
			} else {
				setInputValue(8);
			}
			return;
			break;
		case 57:/* 9 */
			if (isShowSelectBox) {
				doChoose(9);
			} else {
				setInputValue(9);
			}
			return;
			break;
		case 122:/* “*”号向上翻页 */
		case 33:
			if (isShowSelectBox) {
				if (currPage > 1) {
					currPage--;
					initCurrSelectBox();
				}
			}
			return;
			break;
		case 123:/* “#”号向上翻页 */
		case 34:
			if (isShowSelectBox) {
				if (currPage < totalPage) {
					currPage++;
					initCurrSelectBox();
				}
			}
			return;
			break;
		case 1:/* up */
		case 38:
			changeUp(-1);
			return;
			break;
		case 2:/* down */
		case 40:
			changeUp(1);
			return;
			break;
		case 3:/* left */
		case 37:
			changeLeft(-1);
			return;
			break;
		case 4:/* right */
		case 39:
			changeLeft(1);
			return;
			break;
		case 13:/* enter */
			doSelect();
			return;
			break;
		case 27:/* exit */
			return;
			break;
		case 8: /* back */
			event.returnValue = false;
			if (isShowSelectBox) {
				$(selectBoxId).style.display = "none";
				isShowSelectBox = false;
				return;
			} else if(getInputValue() != "") {
				delInputValue();
				return;
			} else {
				closeKeyboard();
				return;
			}
			break;
		default:
			return;
			break;
		}
	};

	function changeUp(__num) {
		if (__num == -1 && y == 0) {
			y = 5;
			switch (x) {
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				x = 2;
				break;
			case 7:
				x = 3;
				break;
			case 8:
			case 9:
				x = 4;
				break;
			case 10:
			case 11:
			case 12:
			case 13:
				x = 5;
				break;
			case 14:
				x = 6;
				break;
			default:
				break;
			}
		} else if (__num == -1 && y == 4) {
			switch (x) {
			case 3:
				x = 7;
				break;
			case 4:
				x = 8;
				break;
			case 5:
				x = 10;
				break;
			case 6:
				x = 12;
				break;
			}
		} else if (__num == 1 && y == 4) {
			y = -1;
			switch (x) {
			case 3:
				x = 7;
				break;
			case 4:
				x = 8;
				break;
			case 5:
				x = 10;
				break;
			case 6:
				x = 14;
				break;
			}
		} else if (__num == 1 && y == 3) {
			switch (x) {
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				x = 2;
				break;
			case 7:
				x = 3;
				break;
			case 8:
			case 9:
				x = 4;
				break;
			case 10:
			case 11:
				x = 5;
				break;
			case 12:
				x = 6;
				break;
			default:
				break;
			}
		} else if (__num == 1) {
			switch (y) {
			case 0:
				if (x == 14) {
					x--;
				}
				break;
			case 1:
				if (x == 13) {
					y++;
					x--;
				}
				break;
			}
		} else if (__num == -1) {
			;
			if (y == 2 && x == 12) {
				y--;
				x = 14;
			}
		}
		y += __num;
		changeFocus();
	}

	function changeLeft(__num) {
		if (__num == -1 && x == 0) {
			switch (y) {
			case 0:
				x = 15;
				break;
			case 1:
				x = 14;
				break;
			case 2:
			case 3:
				x = 13;
				break;
			case 4:
				x = 7;
				break;
			}
		} else if (__num == 1) {
			switch (y) {
			case 0:
				if (x == 14) {
					x = -1;
				}
				break;
			case 1:
				if (x == 13) {
					x = -1;
				}
				break;
			case 2:
			case 3:
				if (x == 12) {
					x = -1;
				}
				break;
			case 4:
				if (x == 6) {
					x = -1;
				}
				break;
			default:
				break;
			}
		}
		x += __num;
		changeFocus();
	}


	/* 获取焦点位置按键的值 */
	function getFocusValue() {
		var result = "";
		var tmp = $(I.lastFocus).getElementsByTagName("span");
		if (tmp.length > 0 && tmp[0].className != null
				&& tmp[0].className.indexOf("center") > -1) {
			result = tmp[0].innerHTML;
		} else if (tmp.length > 1 && tmp[1].className != null
				&& tmp[1].className.indexOf("center") > -1) {
			result = tmp[1].innerHTML;
		} else {
			result = $(I.lastFocus).innerHTML;
		}
		if (I.inputMethod == "shift" && result != "") {
			if (tmp.length > 0 && tmp[0].className != null
					&& tmp[0].className.indexOf("rightop") > -1) {
				result = tmp[0].innerHTML;
			} else if (tmp.length > 1 && tmp[1].className != null
					&& tmp[1].className.indexOf("rightop") > -1) {
				result = tmp[1].innerHTML;
			}
			result = result.toUpperCase();
			$("vk_div").className = "other";
			I.inputMethod = "normal";
		} else if (I.inputMethod == "capsLK") {
			result = result.toUpperCase();
		} else if (I.inputMethod == "no_vk") {
			result = "";
		}
		return result;
	}
	
	
	
	

	function showvbk() {
		if (!isShowSelectBox) {
			isShowSelectBox = true;
			$(selectBoxId).style.display = "block";
			$(selectBoxId).style.visibility = "visible";
		}
	}

	function doSelect() {
		var focusValue = getFocusValue();
		if (focusValue != null && focusValue != "") {
			if (I.lang == "en_US") {
				setInputValue(focusValue);
			} else {/* 汉字 */
				var charCode = focusValue.charCodeAt(0);
				if (I.inputMethod == "normal" && charCode >= 97 && charCode <= 122) {
					if (focusValue == "v") {
						focusValue = "ü";
					}

					if (lastWord == "q" || lastWord == "j" || lastWord == "y"
							|| lastWord == "x") {
						if (focusValue == "v") {
							focusValue = "u";
						}
					}

					if ((lastWord + focusValue) in IObj) {
						showvbk();
						lastWord = lastWord + focusValue;
						dataObj = IObj[lastWord];
						initCurrSelectBox();
						return;
					} else if (focusValue in IObj) {
						showvbk();
						lastWord = focusValue;
						if (isShowSelectBox) {
							doChoose(0);
						}
						dataObj = IObj[lastWord];
						initCurrSelectBox();
						return;
					} else {
						lastWord = "";
						if (isShowSelectBox) {
							doChoose(0);
						}
						setInputValue(focusValue);
						return;
					}
				} else {
					if (isShowSelectBox) {
						doChoose(0);
					}
					setInputValue(focusValue);
				}
			}
		} else {
			switch (I.lastFocus) {
			case "kb_b0e":/* Backspace删除,删除输入框中的值 */
				var tmp = getInputValue();
				if (tmp != null && tmp != "") {
					delInputValue();
				}
				doChoose(-1);
				return;
				break;
			case "kb_b10":/* tab */
				setInputValue("\t");
				doChoose(-1);
				return;
				break;
			case "kb_b1d":/* enter */
			case "kb_b2c":
				if (isShowSelectBox) {/* 如果有显示汉字，则输入汉字中第一个 */
					doChoose(0);
				}
				return;
				break;
			case "kb_b20":/* 大写键 */
				I.inputMethod = I.inputMethod != "capsLK" ? "capsLK" : "normal";
				initInputMehodStatus();
				doChoose(-1);
				return;
				break;
			case "kb_b30":
			case "kb_b3b":/* Shift */
				I.inputMethod = I.inputMethod != "shift" ? "shift" : "normal";
				initInputMehodStatus();
				doChoose(-1);
				return;
				break;
			case "kb_b3c":/* Del */
				delAllInputValue();
				doChoose(-1);
				return;
				break;
			case "kb_b40":/* Ctrl Alt */
			case "kb_b41":
			case "kb_b43":
			case "kb_b44":
				I.inputMethod = I.inputMethod != "novkey" ? "novkey" : "normal";
				initInputMehodStatus();
				doChoose(-1);
				return;
				break;
			case "kb_b45":/* 语言切换 */
				I.lang = I.lang != "zh_CN" ? "zh_CN" : "en_US";
				I.inputMethod = "normal";
				I.initkeyboard();
				return;
				break;
			case "kb_b46": /* 关闭虚拟键盘 */
				closeKeyboard();
				return;
				break;
			}
		}
	}

	/* 初始化汉字选择框当前页数据 */
	var selectBoxStr = "";
	function initCurrSelectBox() {
		var chiList = "<td><<</td>";
		isShowSelectBox = true;
		var length = dataObj.length;
		totalPage = Math.ceil(length / 10);
		for ( var i = 10 * (currPage - 1); i < length; i++) {
			var tmpIndex = i % 10;
			chiList += "<td>" + tmpIndex + ":<span id=\"zh_" + tmpIndex + "\">"
					+ dataObj.charAt(i) + "</span></td>";
			if (tmpIndex == 9) {
				break;
			}
			if (i == length - 1) {
				chiList += "<td colspan=\"" + (10 * currPage - length) + "\"></td>";
			}
		}
		chiList += "<td>>></td>";
		$(chiListTrId).innerHTML = chiList;
		$("currPage").innerHTML = currPage;
		$("totalPage").innerHTML = totalPage;
		$(selectBoxId).style.visibility = "visible";
	}
	
	/* 选择汉字 */
	function doChoose(_num) {
		if ($("zh_" + _num) != undefined) {
			currPage = 1;
			setInputValue($("zh_" + _num).innerHTML);
			isShowSelectBox = false;
			$(chiListTrId).innerHTML = "";
			$(selectBoxId).style.visibility = "hidden";
		} else if (_num == -1) {
			currPage = 1;
			isShowSelectBox = false;
			$(chiListTrId).innerHTML = "";
			$(selectBoxId).style.display = "none";
		}
	}

	/* 将内容输入到输入框中 */
	function setInputValue(content) {
		if (checkInputType() == 0) {
			$(I.inputId).value += content;
		} else {
			$(I.inputId).innerHTML += content;
		}
	}
	/* 删除输入框中的内容 */
	function delInputValue() {
		currPage = 1;
		var tmp = getInputValue();
		if (checkInputType() == 0) {
			$(I.inputId).value = tmp.substring(0, tmp.length - 1);
		} else {
			$(I.inputId).innerHTML = tmp.substring(0, tmp.length - 1);
		}
	}

	function delAllInputValue() {
		currPage = 1;
		if (checkInputType() == 0) {
			$(I.inputId).value = "";
		} else {
			$(I.inputId).innerHTML = "";
		}
	}

	/* 获取输入框中的汉字 */
	function getInputValue() {
		if (checkInputType() == 0) {
			return $(I.inputId).value;
		} else {
			return $(I.inputId).innerHTML;
		}
	}

	function checkInputType() {
		if (I.inputType == "input") {
			return 0;
		} else {
			return 1;
		}
	}

};

/*设置默认键盘语言，参数值可以是zh_CN,en_CN*/
VirtualKeyboard.prototype.setLanguage = function (lang) {
	this.lang = lang;
};


/*设置默认焦点位置*/
VirtualKeyboard.prototype.setFocus = function (x,y) {
	this.lastFocus = "kb_b" +y.toString(16)+ x.toString(16);
};


/*设置输入框id，必须设置*/
VirtualKeyboard.prototype.setInputBoxId = function(inputId) {
	this.inputId = inputId;
};


/*设置输入框类型，目前支持类型input,和Other*/
VirtualKeyboard.prototype.setInputBoxType = function(inputType) {
	this.inputType = inputType;
};


/*设置输入状态*/
VirtualKeyboard.prototype.setInputMehodStatus = function (inputMethod) {
	this.inputMethod = inputMethod;
};

/* 设置参数 */
VirtualKeyboard.prototype.setArgs = function(lang, inputId, inputType, inputMethod, focusPosition){
	if (lang != null && lang != "") {
		this.lang = lang;
	}
	
	if (inputId != null && inputId != "") {
		this.inputId = inputId;
	}
	
	if (inputType != null && inputType != "") {
		this.inputType = inputType;
	}

	if (inputMethod != null && inputMethod != "") {
		this.inputMethod = inputMethod;
	}

	if (focusPosition != null && focusPosition != {}) {
		this.lastFocus = "kb_b" + focusPosition[1].toString(16) + focusPosition[0].toString(16);
	}
};


/*按键处理*/
VirtualKeyboard.prototype.eventHandler = function(keycode) {
	this.eventHandler(keycode);
};

/*设置多按键按钮*/
VirtualKeyboard.prototype.hasMoreFocus = function(hasMoreFocus) {
	this.hasMoreFocus = hasMoreFocus;
};

/*设置键盘状态*/
VirtualKeyboard.prototype.setVkStatus = function(virtualKeyboardStatus) {
	this.virtualKeyboardStatus = virtualKeyboardStatus;
};

/*获取键盘状态*/
VirtualKeyboard.prototype.getVkStatus = function() {
	return this.virtualKeyboardStatus;
};

/*设置键盘位置*/
VirtualKeyboard.prototype.setVkPosition = function(x,y) {
	this.keyboardPosition = [x,y];
	this.setvkPosition = true;
};

/*帮助熟悉*/
VirtualKeyboard.prototype.getHelp = function() {
	return "{\"functions\":[\"setLanguage\",\"setFocus\",\"setInputBoxId\",\"setInputBoxType\",\"setInputMehodStatus\",\"setArgs\"," +
			"\"eventHandler\",\"hasMoreFocus\",\"setVkStatus\",\"getVkStatus\",\"setVkPosition\"],\"version\":\""+this.$VERSION$+"\",\"author\":\""+this.$AUTHOR$+"\",\"instruction\":[" +
			"{\"function\":\"setLanguage\",\"args\":\"lang,参数值为zh_CN或en_US\",\"info\":\"键盘输入语言设置,分为中文输入和应为输入\"}," +
			"{\"function\":\"setFocus\",\"args\":\"(x,y),参数为按键在键盘的x和y坐标\",\"info\":\"设置焦点位置\"}," +
			"{\"function\":\"setInputBoxId\",\"args\":\"输入位置的id\",\"info\":\"用于确定输出文本到输入框\"}" +
			"{\"function\":\"setInputBoxType\",\"args\":\"输入位置的类型，目前设置为input表示input元素，或者其他\",\"info\":\"如果输出位置不为input元素，必须设置此参数\"}" +
			"{\"function\":\"setInputMehodStatus\",\"args\":\"键盘输入状态，参数值可能为normal，capsLK，shift，novkey\",\"info\":\"不建议设置成novkey\"}" +
			"{\"function\":\"setArgs\",\"args\":\"lang语言, inputId输出位置id, inputType输出位置类型, inputMethodStatus键盘输入状态, focusPosition简单位置{x,y}\",\"info\":\"如参数中说明\"}" +
			"{\"function\":\"eventHandler\",\"args\":\"keycode键值\",\"info\":\"用于键盘按键处理\"}" +
			"{\"function\":\"hasMoreFocus\",\"args\":\"有两个div的焦点位置，如ctrl，alt，shift，enter等\",\"info\":\"两个div同时显示，设置后默认值失效\"}" +
			"{\"function\":\"setVkStatus\",\"args\":\"设置键盘开关状态，参数值为open或者close\",\"info\":\"显示键盘必须设置键盘开关状态\"}" +
			"{\"function\":\"setVkPosition\",\"args\":\"参数为left和top值\",\"info\":\"设置键盘位置\"}" +
			"{\"function\":\"getVkStatus\",\"args\":\"无参数\",\"info\":\"获取键盘开关状态，用于外部判断键盘是否关闭\"}]}";
};


/*function $(__id){
	return document.getElementById(__id);
}
*/
