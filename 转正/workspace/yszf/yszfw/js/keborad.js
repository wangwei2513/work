// JavaScript Document
/**
 * 按键键值和系统消息值的映射
 */
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced") >= 0 ? true : false; //判断是否是advance版本
var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1) ? "iPanel" : "other";
var isChromeFlag = navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 ? true : false;
var returnFalseFlag = false; //事件截止
var returnTrueFlag = true; //事件流向下一层

if (navigatorFlag == "iPanel") {
    returnFalseFlag = isAdvanceFlag ? false : 0;
    returnTrueFlag = isAdvanceFlag ? true : 1;
    iPanel.eventFrame.ajaxErrorInfoFlag = true;
}

var Event = {
    mapping: function(__event) {
        var keycode = __event.which || __event.keyCode;
        var code = "";
        var name = "";
        var args = {};
        if (keycode < 58 && keycode > 47) { //数字键
            args = { modifiers: __event.modifiers, value: (keycode - 48), type: returnFalseFlag, isGlobal: false };
            code = "KEY_NUMERIC";
            name = "数字";
        } else {
            var args = { modifiers: __event.modifiers, value: keycode, type: returnFalseFlag, isGlobal: false };
            switch (keycode) {
                case 1: //up
                case 38:
                    code = "KEY_UP";
                    name = "上";
                    break;
                case 2: //down
                case 40:
                    code = "KEY_DOWN";
                    name = "下";
                    break;
                case 3: //left
                case 37:
                    code = "KEY_LEFT";
                    name = "左";
                    break;
                case 4: //right
                case 39:
                    code = "KEY_RIGHT";
                    name = "右";
                    break;
                case 13: //enter
                case 1024: //pause/play 和enter做同样的处理
                    code = "KEY_SELECT";
                    name = "确定";
                    break;
                case 339: //exit
                    code = "KEY_EXIT";
                    name = "退出";
                    break;
                case 258:
                    code = "KEY_STANDBY";
                    name = "待机";
                    args.type = returnTrueFlag;
                    break;
                case 399:
                case 340: //back
                case 8:
                    code = "KEY_BACK";
                    name = "返回";
                    break;
                case 519: //set
                    code = "KEY_SET";
                    name = "设置";
                    break;
                case 372: //page up
                case 33: //pc 上 pageUP
                    code = "KEY_PAGE_UP";
                    name = "上页";
                    break;
                case 373: //page down
                case 34:
                    code = "KEY_PAGE_DOWN";
                    name = "下页";
                    break;
                case 374: //快进
                    code = "EIS_DO_FAST";
                    args.type = returnTrueFlag;
                    break;
                case 375: //快退
                    code = "EIS_DO_REMIND";
                    args.type = returnTrueFlag;
                    break;
                case 512:
                case 306: //小房子那个键 
                case 17: //PC 上ctrl
                    code = "KEY_HOMEPAGE";
                    name = "首页";
                    args.type = returnTrueFlag;
                    break;
                case 513: //iPanel标志的键
                case 16: //PC shift
                    code = "KEY_MENU";
                    name = "菜单";
                    args.type = returnTrueFlag;
                    break;
            }
        }
        return { code: code, args: args, name: name };
    }
};


//打印函数
function iDebug(str) {
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.debug(str); //假如要看打印的时间，可以改：iPanel.debug(str, 2);
    } else if (navigator.appName.indexOf("Opera") != -1) {
        opera.postError(str);
    } else if (navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1) {
        console.log(str);
    }
}