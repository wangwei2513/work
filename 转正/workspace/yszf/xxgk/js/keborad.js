// JavaScript Document
/**
 * 按键键值和系统消息值的映射
 */
var isAdvanceFlag = navigator.userAgent.toLowerCase().indexOf("advanced")>=0?true:false;  //判断是否是advance版本
var navigatorFlag = (navigator.appName.indexOf("iPanel") != -1)?"iPanel":"other";
var isChromeFlag = navigator.userAgent.toLowerCase().indexOf("chrome")>=0?true:false;
var returnFalseFlag = false;      //事件截止
var returnTrueFlag = true;        //事件流向下一层

if(navigatorFlag == "iPanel"){
  returnFalseFlag = isAdvanceFlag?false:0;
  returnTrueFlag = isAdvanceFlag?true:1;
  iPanel.eventFrame.ajaxErrorInfoFlag = true;
}

var Event = {
  mapping: function(__event){
    var keycode = __event.which || __event.keyCode;    
    var code = "";
    var name = "";
    var args = {};
    if(keycode < 58 && keycode > 47){//数字键
      args = {modifiers: __event.modifiers, value: (keycode - 48), type:returnFalseFlag, isGlobal: false};
      code = "KEY_NUMERIC";
      name = "数字";
    }else{
      var args = {modifiers: __event.modifiers, value: keycode, type:returnFalseFlag, isGlobal: false};
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
        case 33:    //pc 上 pageUP
          code = "KEY_PAGE_UP";
          name = "上页";
          break;
        case 373://page down
        case 34:
          code = "KEY_PAGE_DOWN";
          name = "下页";
          break;
        case 374://快进
          code = "EIS_DO_FAST";
          args.type = returnTrueFlag;
          break;
        case 375://快退
          code = "EIS_DO_REMIND";
          args.type = returnTrueFlag;
          break;
        case 512:   
        case 306: //小房子那个键 
        case 17:  //PC 上ctrl
          code = "KEY_HOMEPAGE";
          name = "首页";
          args.type = returnTrueFlag;
          break;
        case 513://iPanel标志的键
        case 16:  //PC shift
          code = "KEY_MENU";
          name = "菜单";
          args.type = returnTrueFlag;
          break;
        case 514://EPG
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
        case 595://音量+
        case 187:
          code="KEY_VOLUME_UP";
          name = "音量+";
          args.type = returnTrueFlag;
          break;
        case 596://音量-
        case 189:
          code="KEY_VOLUME_DOWN";
          name = "音量-";
          args.type = returnTrueFlag;
          break;
        case 593:
          code = "KEY_CHANNEL_UP";    //频道加
          name = "频道+";
          args.type = returnTrueFlag;
          break;
        case 594:
          code = "KEY_CHANNEL_DOWN";    //频道减
          name = "频道-";
          args.type = returnTrueFlag;
          break;
        case 597://静音键
          code = "KEY_MUTE";
          name = "静音";
          args.type = returnTrueFlag;
          break;
        case 5202:
          code = "EIS_VOD_PREPAREPLAY_SUCCESS";//open success
          args.type = returnTrueFlag;
          break; 
        case 5203:
          code = "EIS_VOD_CONNECT_FAILED";//open fail
          args.type = returnTrueFlag;
          break;
        case 5205:
          code="EIS_VOD_PLAY_SUCCESS";//play success
          args.type = returnTrueFlag;
          break;
        case 5206:
          code="EIS_VOD_PLAY_FAILED";//play fail
          args.type = returnTrueFlag;
          break;
        case 5209:
          code="EIS_VOD_PROGRAM_BEGIN";//play to Start
          args.type = returnTrueFlag;
          break;
        case 5210:
          code="EIS_VOD_PROGRAM_END";//play to End
          args.type = returnTrueFlag;
          break;
        case 5211://play stop
          code="EIS_VOD_PROGRAM_STOP";//play to End
          args.type = returnTrueFlag;
          break;
        /*****************************************************/
        
        case 13001://媒体源路径有效
          code = "MSG_MEDIA_URL_VALID";
          break;
        case 13002://媒体源路径无效
          code = "MSG_MEDIA_URL_INVALID";
          break;
        case 13003://开始播放成功
          code = "MSG_MEDIA_PLAY_SUCCESS";
          break;
        case 13004://开始播放失败
          code = "MSG_MEDIA_PLAY_FAILED";
          break;
        case 13005://步长设置成功
          code = "MSG_MEDIA_SETPACE_SUCCESS";
          break;
        case 13006://步长设置失败
          code = "MSG_MEDIA_SETPACE_FAILED";
          break;
        case 13007://设置播放时间点成功
          code = "MSG_MEDIA_SEEK_SUCCESS";
          break;
        case 13008://设置播放时间点失败
          code = "MSG_MEDIA_SEEK_FAILED";
          break;
        case 13009://暂停播放成功
          code = "MSG_MEDIA_PAUSE_SUCCESS";
          break;
        case 13010://暂停播放失败
          code = "MSG_MEDIA_PAUSE_FAILED";
          break;
        case 13011://恢复播放成功
          code = "MSG_MEDIA_RESUME_SUCCESS";
          break;
        case 13012://恢复播放失败
          code = "MSG_MEDIA_RESUME_FAILED";
          break;
        case 13013://停止播放成功
          code = "MSG_MEDIA_STOP_SUCCESS";
          break;
        case 13014://停止播放失败
          code = "MSG_MEDIA_STOP_FAILED";
          break;
        case 13199://播放背景视频成功
          code = "MSG_BACKGROUND_VIDEO_PLAY_SUCCESS";
          break;
        case 13120://播放背景视频失败
          code = "MSG_BACKGROUND_VIDEO_PLAY_FAILED";
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

        /*********EPG********/
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
      }
    }
    return {code: code, args: args, name: name};
  }
};
function initPage(f) {
   f.$ = function(id) {
     return f.document.getElementById(id);
   }
  if(typeof(f.grabEvent) == "undefined"){
    f.grabEvent = function(){};
  }
  f.document.onkeypress = function () {return (f.grabEvent(Event.mapping(f.event), 1));};
  f.document.onkeydown = function () {return (f.grabEvent(Event.mapping(f.event), 1));};
  f.document.onirkeypress = function () {return (f.grabEvent(Event.mapping(f.event), 1));};
  f.document.onsystemevent = function () {return (f.grabEvent(Event.mapping(f.event), 2));};
}
//打印函数
function iDebug(str){
  if(navigator.appName.indexOf("iPanel") != -1){
    iPanel.debug(str);  //假如要看打印的时间，可以改：iPanel.debug(str, 2);
  }else if(navigator.appName.indexOf("Opera") != -1){
    opera.postError(str);
  }else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
    console.log(str);
  } 
}

