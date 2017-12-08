var defaults = {
	outzIndex:999,
	outbgColor:"#778f2d",
	color:"#fffffd",//焦点在的除箭头以外的文字颜色
	selectbgColor:"#f6c431",//焦点背景颜色
	selectColor:"#020300",//焦点在的箭头颜色
	inputValue:"",      //字符串数据
	intr:"",			//初始化文本框描叙符号
	dict:"",  			//词库
	type:0,   			//type为0则是字符串输入模式，为1是密码模式
	strLength:10000000, //字符串长度
	isEng:1,  			//0是英文，1是中文,2,笔画
	isWebkit:1,         //是否有需要2d元素，主要用户调用页面有2d元素，层级问题，1表示需要，0表示不需要 （可以去掉）
	duration:"100ms",
	htmlDom:null,
	reqIp:"",
	callback:function(){},
	backmethod:function(){}
};


var globalColorConf = {};
//颜色 深到浅
globalColorConf.tdBgColor1 = "#677c10";		//输入法各色块颜色
globalColorConf.tdBgColor2 = "#6e8412";		//输入法各色块颜色
globalColorConf.tdBgColor3 = "#7c931d";		//输入法各色块颜色
globalColorConf.tdBgColor4 = "#9bb336";		//输入法各色块颜色

globalColorConf.wordColor = "#344700";		//输入时汉字的颜色
globalColorConf.inputValueColor = "#ffffff";//正在输入时的输入行中的字母颜色

globalColorConf.selectColor = "#000000";//焦点所在地方的文字颜色


globalColorConf.arrowColor = "#f0f0f0";//上下翻页箭头颜色
globalColorConf.inputButtonColor = "#f0f0f0";//提交按钮文字颜色

globalColorConf.changeInputColor = "#b8cf94";//各种输入切换按钮的文字颜色
globalColorConf.cursorColor  ="#b1da3a";//光标颜色
globalColorConf.cursorSelectColor  ="#9e00ba";//光标被选择颜色