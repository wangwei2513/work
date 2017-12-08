/*****************【音效合成】变量*******************/
//if(typeof(iPanel.eventFrame.globalvarObj)=="undefined"){
	//iPanel.eventFrame.globalvarObj = {};
//}

//iPanel.eventFrame.inputUrl = {
var inputUrl = {
	textarea:"/global/input/input1.0/input1.0.htm",//多行输入法
	input:"/global/input/input1.0/input1.1.htm",//单行输入法
	number:"/global/input/inputNum/inputNum.htm",//数字输入法
	psw:"/global/input/inputNum/inputNum.htm?1",//密码输入法
	counter:"/global/input/inputCounter/inputCounter.htm",//计算器输入法
	date:"/global/input/date/date.htm"//日期输入法
}

/***************** 角色 *******************/
var roleParam = {//
	initDivId:"roleDiv", //角色元素输出的DIV
	spacing:160, //角色间距
	txtColor:"#000000",//文本颜色
	info:[
		 {roleid:"00000101",name:"妈妈",pic:"fc_picHead0_1.png"}
		,{roleid:"00000102",name:"爸爸",pic:"fc_picHead0_2.png"}
		,{roleid:"00000103",name:"宝宝",pic:"fc_picHead0_3.png"}
	]
}

/*****************全局变量*******************/
//var keyReturnFlag = 0; //0 return 0    1 return 1;	//********************************默认的就是截止，要流下一层，把这个值设成1，比如menu键
var iPanelKeyFlag = 0; //==1屏蔽按键 
var ___menuBtnNums = 0;
var ___menuTime = 0;

//****************************系统消息事件处理*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	
	var keyReturnFlag = 0;		//根据返回值来判断要不要留至下一级
	var keycode = event.which;
	var p2 = event.modifiers;			//p2值，有些消息可能会传过来p2值，将p2值传给doOtherKey
	keyReturnFlag = doOtherKey(keycode, p2);
	return keyReturnFlag;
}

/*
*@fun  doBasicKey: 基本事件，包括上，下，左，右，退出，返回，menu键，确实键的按键消息。keyReturnFlag是根据doBasicKey的返回值来决定的，且它的默认值为0，表现为截止消息。
*
*@fun  doOtherKey:扩展事件  主要是系统发的那些消息，keyReturnFlag是根据doOtherKey的返回值来决定的，且它的默认值为1，表现为将消息留至下一级。
*/
//****************************普通按键消息事件处理*****************************
//document.onkeypress = grabEvent;
//document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;		//该句柄，是为了满足google的表现，加了此句柄
function grabEvent(event){
	//if(iPanelKeyFlag == 1) return 0;	//在满足某种情况时，需要把事件截止，比如，在滑动过程中，不触发事件，或者在创建widget
	var keyReturnFlag = 0;		//根据返回值来判断要不要留至下一级
	var keycode = event.which;
	var p2 = event.modifiers;			//p2值，有些消息可能会传过来p2值，将p2值传给doOtherKey
	if(keycode < 58 && keycode > 47){//数字键
		keyReturnFlag = numeric(keycode-48);
	}else{
		switch(keycode){
			case 1://up
			case 38:
				if(iPanelKeyFlag == 1) return 0;
				keyReturnFlag = doBasicKey("up",p2);
				break;
			case 2://down
			case 40:
				if(iPanelKeyFlag == 1) return 0;
				keyReturnFlag = doBasicKey("down",p2);
				break;
			case 3://left
			case 37:
				if(iPanelKeyFlag == 1) return 0;
				keyReturnFlag = doBasicKey("left",p2);
				break;
			case 4://right
			case 39:
				if(iPanelKeyFlag == 1) return 0;
				keyReturnFlag = doBasicKey("right",p2);
				break;
			case 13://enter
				if(iPanelKeyFlag == 1) return 0;
				keyReturnFlag = doBasicKey("enter",p2);
				break;
			case 340://返回
			case 8:
				keyReturnFlag = doBasicKey("back",p2);
				break;
			case 513://菜单
			case 36:
				keyReturnFlag = doBasicKey("menu");
				break;
			case 512://主页
			case 306:
			case 36:
				keyReturnFlag = doBasicKey("menu");
				//keyReturnFlag = doBasicKey("portal");
				break;
			case 595://音量+
				keyReturnFlag = doBasicKey("volUp");
				break;
			case 596://音量-
				keyReturnFlag = doBasicKey("volDown");
				break;
			default:
				break;
		}
	}
	return keyReturnFlag;
}

