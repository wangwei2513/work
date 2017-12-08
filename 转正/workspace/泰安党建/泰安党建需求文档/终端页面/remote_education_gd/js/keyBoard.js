function keyboardClass(_args) {
    this.keyValueArr = _args.keyValueArr; //按键值的数组
    this.keyPosArr = _args.keyPosArr; //按键位置的数组
    this.numPerLine = _args.numPerLine; //每行显示的按键数
    this.domIds = _args.domIds; //显示按键值的id值数组

    this.focusId = _args.focusId;
    this.frame = _args.frame || window;

    this.startPos = typeof(_args.startPos) == "undefined" ? 0 : _args.startPos; //起始位置

    this.focusPos = 0; //焦点位置
    this.focusDiv = null; //键盘焦点层
    this.focusPic = null; //焦点层图片对象
    this.currLineNum = 0; //键盘的行数，从 0 开始
    this.lineStartNum = []; //每行起始位置

    this.initData = function(_prePos) {
        for (var i = 0; i < this.domIds.length; i++) {
            this.$(this.domIds[i]).innerText = this.keyValueArr[i]
        }
        this.focusDiv = this.$(this.focusId);

        this.focusPos = this.startPos;
        this.lineStartNum = this.getLineStartNum();

        if (typeof(_prePos) != "undefined") {
            this.focusPos = _prePos[0];
            this.currLineNum = _prePos[1];
        }

        this.focusDiv.style.webkitTransitionDuration = "0ms";
        for (var key in this.keyPosArr[this.focusPos]) {
            this.focusDiv.style[key] = this.keyPosArr[this.focusPos][key];
        }
        this.focusDiv.style.webkitTransitionDuration = "300ms";
    };

    this.upDownMove = function(_num) {
        var oldlineNum = this.currLineNum;
        this.currLineNum += _num;
        var endlineNum = 0;
        var currPos = 0;
        if (typeof(this.lineStartNum[this.currLineNum]) != "undefined") {
            endlineNum = this.lineStartNum[this.currLineNum] + this.numPerLine[this.currLineNum] - 1;
        }
        if (_num > 0) {
            currPos = this.focusPos + this.numPerLine[oldlineNum] * _num;
        } else {
            currPos = this.focusPos + this.numPerLine[this.currLineNum] * _num;
        }
        if (this.currLineNum < 0 && _num < 0) {
            this.currLineNum = 0;
            currPos = this.focusPos;
        } else if (this.currLineNum > this.numPerLine.length - 1 && _num > 0) {
            this.currLineNum = this.numPerLine.length - 1;
            currPos = this.focusPos;
        } else if (currPos > endlineNum && _num > 0) {
            currPos = endlineNum;
        }
        this.focusPos = currPos;
        for (var key in this.keyPosArr[this.focusPos]) {
            this.focusDiv.style[key] = this.keyPosArr[this.focusPos][key];
        }
    };

    this.leftRightMove = function(_num) {
        this.focusPos += _num;
        if (this.focusPos < 0 && _num < 0 || this.focusPos > this.keyValueArr.length - 1 && _num > 0) {
            this.focusPos += -_num;
            return;
        } else {
            for (var key in this.keyPosArr[this.focusPos]) {
                this.focusDiv.style[key] = this.keyPosArr[this.focusPos][key];
            }
        }
        this.getCurrLineNum(this.focusPos);
    };

    this.getLineStartNum = function() { //每行起始的焦点位置
        var num = 0;
        var lineStartNum = [];
        for (var i = 0; i < this.numPerLine.length; i++) {
            lineStartNum[i] = num;
            num += this.numPerLine[i];
        }
        return lineStartNum;
    };

    this.getCurrLineNum = function(_currPos) { //获取起始点的行号
        for (var i = 0; i < this.numPerLine.length; i++) {
            if (_currPos < 0) {
                this.currLineNum = 0;
            } else if (_currPos > this.keyValueArr.length - 1) {
                this.currLineNum = this.keyValueArr.length - 1;
            } else if (_currPos >= this.lineStartNum[i] && _currPos < this.lineStartNum[i] + this.numPerLine[i]) {
                this.currLineNum = i;
                break;
            }
        }
    };

    this.$ = function(_id) {
        return this.frame.document.getElementById(_id);
    };
}

//html中的部分
function subStr(_str, _bytes, _suffix) {
    /**
     * 以一个汉字为2个字母截取字母汉字混合字符串（临界字符是汉字的话，不返回这个汉字，所以返回长度可能少一字节）
     * iPanel.misc.interceptString(_str, _bytes) 接口有问题，在utf-8页面编码下，误把一个汉字当3 Byte处理
     * @_bytes：字节数
     */
    if (!_str) {
        return "";
    }
    if (!_bytes) {
        return _str;
    }
    var charLen = 0; //预期计数：中文2字节，英文1字节
    var tempStr = ""; //临时字串
    for (var i = 0; i < _str.length; i++) {
        if (_str.charCodeAt(i) > 255) { //按照预期计数增加2
            charLen += 2;
        } else {
            charLen++;
        }
        if (charLen > _bytes) { //如果增加计数后长度大于限定长度，就直接返回临时字符串
            if (_suffix) {
                return tempStr + _suffix;
            }
            return tempStr;
        }
        tempStr += _str.charAt(i); //将当前内容加到临时字符串
    }
    if (_suffix && charLen > _bytes) {
        return _str + _suffix;
    }
    return _str; //如果全部是单字节字符，就直接返回源字符串
}


var globalParams = {
    numPerLine: [[14, 13, 13, 4], [14, 13, 13, 4], [14, 14, 14, 4]],
    keyValueArr: [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "回退", "7", "8", "9", "a", "s", "d", "f", "g", "h", "j", "k", "l", "确定", "4", "5", "6", "z", "x", "c", "v", "b", "n", "m", "@", "_", "-", "1", "2", "3", "切换成大写", "空格", "0", "."], ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "回退", "7", "8", "9", "A", "S", "D", "F", "G", "H", "J", "K", "L", "确定", "4", "5", "6", "Z", "X", "C", "V", "B", "N", "M", "@", "_", "-", "1", "2", "3", "切换成字符", "空格", "0", "."], ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "/", "7", "8", "9", "?", "{", "}", "[", "]", ";", ":", "\"", "'", "|", "\\", "4", "5", "6", "~", "、", "￥", "《", "》", ".", ",", "=", "+", "_", "-", "1", "2", "3", "切换成小写", "空格", "0", "."]],
    keyPosArr: {
        word: [],
        char: [],
    },
    domIds: {
        word: [],
        char: []
    },

    inputTypeArr: [{
        name: "大写",
        posKey: "word"
    },
    {
        name: "小写",
        posKey: "word"
    },
    {
        name: "字符",
        posKey: "char"
    }],
    inputTypePos: 0, //当前输入法类型

    keyboardObj: null, //实例化对象
    inputObj: null, //显示输入值的input框
    WIN_OBJ: window,
    maxInputLen: 16, //默认的最大输入字节数为32个字节

    inputValue: "", //按键输入的值
    hideChar: "", //要覆盖真实值的字符

    isHide: false, //是否隐藏真实值
    closeBtnFocus: false
};


function setKeyPos() {
    var offsetX = 20;
    var offserY = 44;
    //word
    //line 1
    for (var i = 0; i < 11; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 0 + "px",
            top: offserY + 0 + "px",
            width: "59px"
        });
    }
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 0 + "px",
            width: "59px"
        });
    }
    //line 2
    for (var i = 0; i < 9; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 32 + "px",
            top: offserY + 60 + "px",
            width: "59px"
        });
    }
    globalParams.keyPosArr.word.push({
        left: offsetX + 571 + "px",
        top: offserY + 60 + "px",
        width: "90px"
    });
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 60 + "px",
            width: "59px"
        });
    }
    //line 3
    for (var i = 0; i < 10; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 60 + "px",
            top: offserY + 120 + "px",
            width: "59px"
        });
    }
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.word.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 120 + "px",
            width: "59px"
        });
    }
    //line 4
    globalParams.keyPosArr.word.push({
        left: offsetX + 0 + "px",
        top: offserY + 180 + "px",
        width: "204px"
    });
    globalParams.keyPosArr.word.push({
        left: offsetX + 205 + "px",
        top: offserY + 180 + "px",
        width: "455px"
    });
    globalParams.keyPosArr.word.push({
        left: offsetX + 675 + "px",
        top: offserY + 180 + "px",
        width: "120px"
    });
    globalParams.keyPosArr.word.push({
        left: offsetX + 796 + "px",
        top: offserY + 180 + "px",
        width: "59px"
    });

    //char
    //line 1
    for (var i = 0; i < 11; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 0 + "px",
            top: offserY + 0 + "px",
            width: "59px"
        });
    }
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 0 + "px",
            width: "59px"
        });
    }
    //line 2
    for (var i = 0; i < 11; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 0 + "px",
            top: offserY + 60 + "px",
            width: "59px"
        });
    }
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 60 + "px",
            width: "59px"
        });
    }
    //line 3
    for (var i = 0; i < 11; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 0 + "px",
            top: offserY + 120 + "px",
            width: "59px"
        });
    }
    for (var i = 0; i < 3; i++) {
        globalParams.keyPosArr.char.push({
            left: i * 60 + offsetX + 675 + "px",
            top: offserY + 120 + "px",
            width: "59px"
        });
    }
    //line 4
    globalParams.keyPosArr.char.push({
        left: offsetX + 0 + "px",
        top: offserY + 180 + "px",
        width: "204px"
    });
    globalParams.keyPosArr.char.push({
        left: offsetX + 205 + "px",
        top: offserY + 180 + "px",
        width: "455px"
    });
    globalParams.keyPosArr.char.push({
        left: offsetX + 675 + "px",
        top: offserY + 180 + "px",
        width: "120px"
    });
    globalParams.keyPosArr.char.push({
        left: offsetX + 796 + "px",
        top: offserY + 180 + "px",
        width: "59px"
    });
}


function kb_eventHandler(_keyCode) {
    switch (_keyCode) {
    case 1:   // up
    case 38:
        if (globalParams.keyboardObj.currLineNum == 0) {
            closeIt(1);
            break;
        }
        if (globalParams.inputTypePos == 2) {
            if (globalParams.keyboardObj.currLineNum == 3) {
                if (globalParams.keyboardObj.focusPos == 42) {
                    locateDiv(30, "char");
                } else if (globalParams.keyboardObj.focusPos == 43) {
                    locateDiv(38, "char");
                } else if (globalParams.keyboardObj.focusPos == 44) {
                    locateDiv(39, "char");
                } else if (globalParams.keyboardObj.focusPos == 45) {
                    locateDiv(41, "char");
                }
                break;
            }
            globalParams.keyboardObj.upDownMove(-1);
        } else {
            if (globalParams.keyboardObj.currLineNum == 1) {
                globalParams.keyboardObj.focusPos++;
            } else if (globalParams.keyboardObj.currLineNum == 3) {
                if (globalParams.keyboardObj.focusPos == 40) {
                    locateDiv(28, "word");
                } else if (globalParams.keyboardObj.focusPos == 41) {
                    locateDiv(36, "word");
                } else if (globalParams.keyboardObj.focusPos == 42) {
                    locateDiv(37, "word");
                } else if (globalParams.keyboardObj.focusPos == 43) {
                    locateDiv(39, "word");
                }
                break;
            }
            globalParams.keyboardObj.upDownMove(-1);
        }
        break;
    case 2:   // down
    case 40:
        if (globalParams.closeBtnFocus == true) {
            closeIt(0);
            break;
        }
        if (globalParams.inputTypePos == 2) {
            if (globalParams.keyboardObj.focusPos >= 28 && globalParams.keyboardObj.focusPos < 31) {
                globalParams.keyboardObj.focusPos = 28;
            } else if (globalParams.keyboardObj.focusPos >= 31 && globalParams.keyboardObj.focusPos < 39) {
                globalParams.keyboardObj.focusPos = 29;
            } else if (globalParams.keyboardObj.focusPos >= 39 && globalParams.keyboardObj.focusPos < 41) {
                globalParams.keyboardObj.focusPos = 30;
            } else if (globalParams.keyboardObj.focusPos == 41) {
                globalParams.keyboardObj.focusPos = 31;
            }
            globalParams.keyboardObj.upDownMove(1);
        } else {
            if (globalParams.keyboardObj.currLineNum == 0) {
                if (globalParams.keyboardObj.focusPos > 9) {
                    globalParams.keyboardObj.focusPos--;
                }
            } else if (globalParams.keyboardObj.currLineNum == 2) {
                if (globalParams.keyboardObj.focusPos >= 27 && globalParams.keyboardObj.focusPos < 29) {
                    globalParams.keyboardObj.focusPos = 27;
                } else if (globalParams.keyboardObj.focusPos >= 29 && globalParams.keyboardObj.focusPos < 37) {
                    globalParams.keyboardObj.focusPos = 28;
                } else if (globalParams.keyboardObj.focusPos >= 37 && globalParams.keyboardObj.focusPos < 39) {
                    globalParams.keyboardObj.focusPos = 29;
                } else {
                    globalParams.keyboardObj.focusPos = 30;
                }
            }
            globalParams.keyboardObj.upDownMove(1);
        }
        break;
    case 3:
    case 37:
        if (globalParams.closeBtnFocus == true) {
            break;
        }
        globalParams.keyboardObj.leftRightMove(-1);
        break;
    case 4:
    case 39:
        if (globalParams.closeBtnFocus == true) {
            break;
        }
        globalParams.keyboardObj.leftRightMove(1);
        break;
    case 13:
        if (globalParams.closeBtnFocus == true) {
            closeIt(2);
            break;
        }
        kb_doSelect();
        break;
    case 8:
    case 27:
    /*
        if (globalParams.closeBtnFocus == true) {
            globalParams.closeBtnFocus = false;
        }
    */
        exit(false);
        break;
    }
}

function kb_doSelect() {
    var value = globalParams.keyValueArr[globalParams.inputTypePos][globalParams.keyboardObj.focusPos];
    if (value == "空格") {
        value = " ";
    } else if (value == "确定") {
        exit(true);
        return;
    } else if (value == "回退") {
        deleteChar();
        return;
    } else if (value.indexOf("切换") != -1) {
        changeInputStatus();
        return;
    }
    if (checkIsInput() == true) {
        globalParams.inputValue += value;
        showValue(true, false);
    }
}
function checkIsInput() {
    var byteCount = 0;
    var allowInput = true;
    for (var i = 0, len = globalParams.inputValue.length; i < len; i++) {
        byteCount = (globalParams.inputValue.charCodeAt(i) > 255) ? byteCount + 2 : byteCount + 1;
        if (byteCount >= globalParams.maxInputLen) { //must less than "globalParams.maxInputLen + 1" bytes
            globalParams.inputValue = subStr(globalParams.inputValue, globalParams.maxInputLen);
            allowInput = false; //超过不允许再输入
            break;
        }
    }
    return allowInput;
}


function deleteChar() {
    globalParams.inputValue.toString();
    globalParams.inputValue = globalParams.inputValue.substr(0, globalParams.inputValue.length - 1);
    showValue(true, false);
}

function changeInputStatus() {
    globalParams.inputTypePos++;
    if (globalParams.inputTypePos >= globalParams.inputTypeArr.length) {
        globalParams.inputTypePos = 0;
        showKeyBoard([globalParams.keyboardObj.focusPos - 2, globalParams.keyboardObj.currLineNum]); //keep focus
        return;
    }
    showKeyBoard([(globalParams.inputTypePos + 1 == globalParams.inputTypeArr.length) ? globalParams.keyboardObj.focusPos + 2 : globalParams.keyboardObj.focusPos, globalParams.keyboardObj.currLineNum]); //keep focus
}

function showValue(_set, _exec) {
    var value = "";
    if (globalParams.isHide == true) {
        if (_set == true) {
            for (var i = 0; i < globalParams.inputValue.length; i++) {
                value += globalParams.hideChar;
                if (typeof(globalParams.WIN_OBJ.setKeyboardHiddenValue) == "function") {
                    globalParams.WIN_OBJ.setKeyboardHiddenValue(globalParams.inputValue);
                }
            }
        }
    } else {
        value = globalParams.inputValue;
    }
    if (globalParams.inputObj != null) {
        globalParams.inputObj.innerText = value;
        //alert(globalParams.inputValue);
    }
    if (_set == true) {
        if (typeof(globalParams.WIN_OBJ.setKeyboardValue) == "function") {
            globalParams.WIN_OBJ.setKeyboardValue(value);
        }
    }
    if (_exec == true) {
        if (typeof(globalParams.WIN_OBJ.setKeyboardAction) == "function") {
            globalParams.WIN_OBJ.setKeyboardAction();
        }
    }
}


function initBoard(_id, _str, _maxLen, _win, _hideChar, _left, _top, _width, _height) { //be called by other pages
    var w = 916;
    var h = 306;
    var x = parseInt((1280 - w) / 2, 10);
    var y = parseInt((720 - h) / 2, 10);

    if (typeof(_str) != "undefined") globalParams.inputValue = _str;
    if (typeof(_maxLen) != "undefined") globalParams.maxInputLen = _maxLen;
    if (typeof(_win) != "undefined") globalParams.WIN_OBJ = _win;
    globalParams.inputObj = globalParams.WIN_OBJ.document.getElementById(_id);

    if (typeof(_hideChar) != "undefined") {
        globalParams.hideChar = _hideChar;
        globalParams.isHide = true;
        /*if (typeof(globalParams.WIN_OBJ.setKeyboardHiddenValue) == "function") {
            globalParams.WIN_OBJ.setKeyboardHiddenValue(globalParams.inputValue);
        }*/
    } else {
        globalParams.isHide = false;
    }

    if (typeof(_left) != "undefined") x = _left;
    if (typeof(_top) != "undefined") y = _top;
    if (typeof(_height) != "undefined") h = _height;
    if (typeof(_width) != "undefined") w = _width;
    //window.resizeTo(w, h);
    //window.moveTo(x, y);
    $("key_board").style.width = w+"px";
    $("key_board").style.height = h+"px";
    $("key_board").style.top = y+"px";
    $("key_board").style.left = x+"px";  

    globalParams.inputTypePos = 0; //每次显示widget时都要重新初始化输入法状态
    showKeyBoard([18, 1]);
}


function keyBoard_init() {
    setKeyPos();
    showKeyBoard([18, 1]);
}

function showKeyBoard(_prePos) {
    setDocumentIds();
    var posKey = globalParams.inputTypeArr[globalParams.inputTypePos].posKey;
    for (var key in globalParams.domIds) {
        if (key == posKey) {
            $(key).style.visibility = "visible";
        } else {
            $(key).style.visibility = "hidden";
        }
    }
    initData(_prePos);
}
function setDocumentIds() {
    var posKey = globalParams.inputTypeArr[globalParams.inputTypePos].posKey;
    for (var i = 0; i < globalParams.keyValueArr[globalParams.inputTypePos].length; i++) {
        globalParams.domIds[posKey][i] = posKey + "" + i;
    }
}
function initData(_prePos) {
    var posKey = globalParams.inputTypeArr[globalParams.inputTypePos].posKey;
    globalParams.keyboardObj = new keyboardClass({
        keyValueArr: globalParams.keyValueArr[globalParams.inputTypePos],
        keyPosArr: globalParams.keyPosArr[posKey],
        numPerLine: globalParams.numPerLine[globalParams.inputTypePos],
        domIds: globalParams.domIds[posKey],
        focusId: "focusDiv",
        frame: window
    });
    globalParams.keyboardObj.initData(_prePos);

    if (typeof(_prePos) == "undefined") {
        locateDiv(18, "word");
    }
}


function locateDiv(_id, _type) {
    $("focusDiv").style.left = globalParams.keyPosArr[_type][_id].left;
    $("focusDiv").style.top = globalParams.keyPosArr[_type][_id].top;
    $("focusDiv").style.width = globalParams.keyPosArr[_type][_id].width;
    globalParams.keyboardObj.focusPos = _id;
    globalParams.keyboardObj.getCurrLineNum(_id);
}

function exit(_type) {
    showValue(true, _type); 
    $("focusDiv").style.visibility = "hidden";
    $("key_board").style.visibility = "hidden";
    $("word").style.visibility = "hidden";
    kBShowFlag = false;
    /*
    if (typeof(globalParams.WIN_OBJ.resetKeyboardStyle) == "function") {
        globalParams.WIN_OBJ.resetKeyboardStyle();

    }
    */

}


/*------------------------------鼠标部分------------------------------*/
function mouseEvent(_obj, _sure) {
    if (typeof(_obj) == "string" || _sure == true) {
        kb_doSelect();
    } else {
        var word = _obj.id.indexOf("word") != -1;
        var idPos = word == true ? parseInt(_obj.id.split("word")[1], 10) : parseInt(_obj.id.split("char")[1], 10);
        var type = word == true ? "word" : "char";
        locateDiv(idPos, type);
    }
}

function closeIt(_btnStyle) {
    var btns = ["../images/key_close_0.png", "../images/key_close_1.png", "../images/key_close_2.png"];
    $("btnClose").style.backgroundImage = "url(" + btns[_btnStyle] + ")";
    if (_btnStyle == 0) {
        globalParams.closeBtnFocus = false;
        $("focusDiv").style.visibility = "visible";
    } else if (_btnStyle == 1) {
        globalParams.closeBtnFocus = true;
        $("focusDiv").style.visibility = "hidden";
    } else if (_btnStyle == 2) {
        globalParams.closeBtnFocus = false;
        $("focusDiv").style.visibility = "visible";
        $("btnClose").style.backgroundImage = "url(" + btns[0] + ")";
        exit(false);
    }
}