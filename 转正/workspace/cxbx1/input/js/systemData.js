// JavaScript Document
/*{
	nameFlag:每个对象的标志
	isSelect:是否能进行选择操作,0:不能选择操作此项，1：可以选择操作此项
	tipsType:0:弹出框类型，0：普通弹出框,2:IP弹出框,
	textFlag：0：直接显示此对象的值，1:butoon按钮的值，2:显示搜索进度条
	text：需要显示的名称，
    listText：直接用于输出显示的值
	value:此项设置的值，最后保存修改内容使用
	width:弹出框的宽度,由于根据长度计算出来的不准，这里使用给定宽度
	textArr:要显示内容的选择数组
	
	 ]    
}*/
var systemData = {0:{nameFlag:"alpha",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["菜单透明度","菜单透明度"],textArr:[["40%","50%","60%","70%","80%","90%","100%"],["40%","50%","60%","70%","80%","90%","100%"]],valueArr:[40,50,60,70,80,90,100],valueArrPos:0},
				  1:{nameFlag:"infoTimeout",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["提示时间","提示时间"],textArr:[["一直显示","1秒钟","2秒钟","3秒钟","4秒钟","5秒钟","6秒钟","7秒钟","8秒钟","9秒钟","10秒钟"],["一直显示","1秒钟","2秒钟","3秒钟","4秒钟","5秒钟","6秒钟","7秒钟","8秒钟","9秒钟","10秒钟"]],valueArr:["一直显示","1秒钟","2秒钟","3秒钟","4秒钟","5秒钟","6秒钟","7秒钟","8秒钟","9秒钟","10秒钟"],valueArrPos:0},	
				  2:{nameFlag:"language",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["语言设置","语言设置"],textArr:[["中文","English"],["中文","English"]],valueArr:["chi","eng"],valueArrPos:0},
				  3:{nameFlag:"timeZone",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["时区设置","时区设置"],textArr:[["GMT -12:00","GMT -11:00","GMT -10:00","GMT -09:00","GMT -08:00","GMT -07:00","GMT -06:00","GMT -05:00","GMT -04:00","GMT -03:00","GMT -02:00","GMT -01:00","GMT +00:00","GMT +01:00","GMT +02:00","GMT +03:00","GMT +04:00","GMT +05:00","GMT +06:00","GMT +07:00","GMT +08:00","GMT +09:00","GMT +10:00","GMT +11:00","GMT +12:00"],["GMT -12:00","GMT -11:00","GMT -10:00","GMT -09:00","GMT -08:00","GMT -07:00","GMT -06:00","GMT -05:00","GMT -04:00","GMT -03:00","GMT -02:00","GMT -01:00","GMT +00:00","GMT +01:00","GMT +02:00","GMT +03:00","GMT +04:00","GMT +05:00","GMT +06:00","GMT +07:00","GMT +08:00","GMT +09:00","GMT +10:00","GMT +11:00","GMT +12:00"]],valueArr:[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],valueArrPos:0},
				  4:{nameFlag:"backCon",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["回看小窗口","回看小窗口"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  5:{nameFlag:"vedioProportion",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["视频比例","视频比例"],textArr:[["拉长比例去掉黑边","不变"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  6:{nameFlag:"postName",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["海报名称显示","海报名称显示"],textArr:[["激活时显示","打开"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  7:{nameFlag:"fontSize",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["字体大小","字体大小"],textArr:[["标准","打开"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  8:{nameFlag:"searchFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["频道搜索","频道搜索"],textArr:[["自动搜索","手动搜索"],["自动搜索","手动搜索"]],valueArr:[0,1],valueArrPos:0},
				  9:{nameFlag:"serchHz",isSelect:0,tipsType:2,textFlag:1,value:"259",listText:"259 Mhz",text:["起始频率","起始频率"],valueArr:[2,5,9],pos:0,textArr:[0,1,2,3,4,5,6,7,8,9],valueArrPos:0},
				  10:{nameFlag:"symbolRate",isSelect:0,tipsType:2,textFlag:1,value:"68750",listText:"68750 Ks/s",text:["符号率","符号率"],valueArr:[6,8,7,5,0],pos:0,textArr:[0,1,2,3,4,5,6,7,8,9],valueArrPos:0},
				  11:{nameFlag:"modulation",isSelect:0,tipsType:0,textFlag:0,value:"64-QAM",listText:"",text:["调制方式","调制方式"],textArr:[["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"],["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"]],valueArr:["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"],valueArrPos:2},	
				  12:{nameFlag:"quality",isSelect:0,textFlag:2,text:["信号质量","信号质量"],listText:""},
				  13:{nameFlag:"signalLevel",isSelect:0,textFlag:2,text:["搜索进度","搜索进度"],listText:""},
				  14:{nameFlag:"serchBtton",isSelect:2,textFlag:3,listText:"自动频道搜索"},
				  15:{nameFlag:"openSoundFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["基本音效","基本音效"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  16:{nameFlag:"soundVolume",isSelect:1,tipsType:0,textFlag:0,value:10,listText:"",text:["音效音量","音效音量"],textArr:[[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100],[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100]],valueArr:[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100],valueArrPos:0},
				  17:{nameFlag:"soundFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["首页音量","首页音量"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  18:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["开机音效","开机音效"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  19:{nameFlag:"news",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["滚动英文字幕","滚动英文字幕"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  20:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["节目回看提醒","节目回看提醒"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  21:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["从头看功能","从头看功能"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  22:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["互动电视","互动电视"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  23:{nameFlag:"netFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["网络选择","网络选择"],textArr:[["有线连接","无线连接"],["有线连接","无线连接"]],valueArr:[0,1],valueArrPos:0},
				  24:{nameFlag:"DHCPEnable",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["自动获取","自动获取"],listText:"是",textArr:[["否","是"],["NO","YES"]],valueArr:[0,1],valueArrPos:1}, 
				  25:{nameFlag:"IP",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["IP地址","IP地址"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  26:{nameFlag:"mask",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["子网掩码","子网掩码"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  27:{nameFlag:"gateway",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["网关地址","网关地址"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  28:{nameFlag:"DNS",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["DNS地址","DNS地址"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  29:{nameFlag:"saveIpBotton",isSelect:2,textFlag:3,listText:"保存IP设置"},
                  30:{nameFlag:"videoMode",isSelect:1,tipsType:0,textFlag:0,value:"AUTO",listText:"",text:["制式选择","制式选择"],textArr:[["AUTO","NTSC","PAL"],["AUTO","NTSC","PAL"]],valueArr:["Auto","NTSC","PAL"],valueArrPos:0},
				  31:{nameFlag:"soundMode",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["默认声道","默认声道"],textArr:[["混合","立体","左声道","右声道"],["混合","立体","左声道","右声道"]],valueArr:["stereo","mix","left","right"],valueArrPos:0},
				  32:{nameFlag:"videoAspect",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["显示比例","显示比例"],textArr:[["自动","16:9","4:3"],["自动","16:9","4:3"]],valueArr:[1,2,4],valueArrPos:0},
				  33:{nameFlag:"videoOutputPort",isSelect:1,tipsType:1,textFlag:0,value:0,listText:"",text:["显示模式","显示模式"],textArr:[["HDMI","SPDIF"],["HDMI","SPDIF"]],valueArr:["HDMI","SPDIF"],valueArrPos:0},	
				  34:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["机顶盒密码","机顶盒密码"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  35:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["默认搜索模式","默认搜索模式"],textArr:[["关闭","开启"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  36:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["键盘设置","键盘设置"],textArr:[["字幕顺序","电脑键盘"],["字幕顺序","电脑键盘"]],valueArr:[0,1],valueArrPos:1},
                  37:{nameFlag:"botton",isSelect:2,textFlag:3,listText:"恢复出厂设置"},
				  38:{nameFlag:"STB",isSelect:0,textFlag:4,listText:"",text:["STB序列号","STB序列号"]},
				  39:{nameFlag:"hVersion",isSelect:0,textFlag:4,listText:"",text:["硬件版本","硬件版本"]},
				  40:{nameFlag:"sVersion",isSelect:0,textFlag:4,listText:"",text:["软件版本","软件版本"]},
				  41:{nameFlag:"bVersion",isSelect:0,textFlag:4,listText:"",text:["浏览器版本","浏览器版本"]},
				  42:{nameFlag:"flashBlock",isSelect:0,textFlag:4,listText:"",text:["存储空间","存储空间"]},
				  43:{nameFlag:"IP1",isSelect:0,textFlag:4,listText:"",text:["本地IP地址","本地IP地址"]},
				  44:{nameFlag:"MAC",isSelect:0,textFlag:4,listText:"",text:["MAC地址","MAC地址"]}
};  
					
           