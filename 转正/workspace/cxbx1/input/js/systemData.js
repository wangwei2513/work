// JavaScript Document
/*{
	nameFlag:ÿ������ı�־
	isSelect:�Ƿ��ܽ���ѡ�����,0:����ѡ��������1������ѡ���������
	tipsType:0:���������ͣ�0����ͨ������,2:IP������,
	textFlag��0��ֱ����ʾ�˶����ֵ��1:butoon��ť��ֵ��2:��ʾ����������
	text����Ҫ��ʾ�����ƣ�
    listText��ֱ�����������ʾ��ֵ
	value:�������õ�ֵ����󱣴��޸�����ʹ��
	width:������Ŀ��,���ڸ��ݳ��ȼ�������Ĳ�׼������ʹ�ø������
	textArr:Ҫ��ʾ���ݵ�ѡ������
	
	 ]    
}*/
var systemData = {0:{nameFlag:"alpha",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["�˵�͸����","�˵�͸����"],textArr:[["40%","50%","60%","70%","80%","90%","100%"],["40%","50%","60%","70%","80%","90%","100%"]],valueArr:[40,50,60,70,80,90,100],valueArrPos:0},
				  1:{nameFlag:"infoTimeout",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["��ʾʱ��","��ʾʱ��"],textArr:[["һֱ��ʾ","1����","2����","3����","4����","5����","6����","7����","8����","9����","10����"],["һֱ��ʾ","1����","2����","3����","4����","5����","6����","7����","8����","9����","10����"]],valueArr:["һֱ��ʾ","1����","2����","3����","4����","5����","6����","7����","8����","9����","10����"],valueArrPos:0},	
				  2:{nameFlag:"language",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["��������","��������"],textArr:[["����","English"],["����","English"]],valueArr:["chi","eng"],valueArrPos:0},
				  3:{nameFlag:"timeZone",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["ʱ������","ʱ������"],textArr:[["GMT -12:00","GMT -11:00","GMT -10:00","GMT -09:00","GMT -08:00","GMT -07:00","GMT -06:00","GMT -05:00","GMT -04:00","GMT -03:00","GMT -02:00","GMT -01:00","GMT +00:00","GMT +01:00","GMT +02:00","GMT +03:00","GMT +04:00","GMT +05:00","GMT +06:00","GMT +07:00","GMT +08:00","GMT +09:00","GMT +10:00","GMT +11:00","GMT +12:00"],["GMT -12:00","GMT -11:00","GMT -10:00","GMT -09:00","GMT -08:00","GMT -07:00","GMT -06:00","GMT -05:00","GMT -04:00","GMT -03:00","GMT -02:00","GMT -01:00","GMT +00:00","GMT +01:00","GMT +02:00","GMT +03:00","GMT +04:00","GMT +05:00","GMT +06:00","GMT +07:00","GMT +08:00","GMT +09:00","GMT +10:00","GMT +11:00","GMT +12:00"]],valueArr:[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],valueArrPos:0},
				  4:{nameFlag:"backCon",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["�ؿ�С����","�ؿ�С����"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  5:{nameFlag:"vedioProportion",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["��Ƶ����","��Ƶ����"],textArr:[["��������ȥ���ڱ�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  6:{nameFlag:"postName",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["����������ʾ","����������ʾ"],textArr:[["����ʱ��ʾ","��"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  7:{nameFlag:"fontSize",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["�����С","�����С"],textArr:[["��׼","��"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  8:{nameFlag:"searchFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["Ƶ������","Ƶ������"],textArr:[["�Զ�����","�ֶ�����"],["�Զ�����","�ֶ�����"]],valueArr:[0,1],valueArrPos:0},
				  9:{nameFlag:"serchHz",isSelect:0,tipsType:2,textFlag:1,value:"259",listText:"259 Mhz",text:["��ʼƵ��","��ʼƵ��"],valueArr:[2,5,9],pos:0,textArr:[0,1,2,3,4,5,6,7,8,9],valueArrPos:0},
				  10:{nameFlag:"symbolRate",isSelect:0,tipsType:2,textFlag:1,value:"68750",listText:"68750 Ks/s",text:["������","������"],valueArr:[6,8,7,5,0],pos:0,textArr:[0,1,2,3,4,5,6,7,8,9],valueArrPos:0},
				  11:{nameFlag:"modulation",isSelect:0,tipsType:0,textFlag:0,value:"64-QAM",listText:"",text:["���Ʒ�ʽ","���Ʒ�ʽ"],textArr:[["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"],["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"]],valueArr:["16-QAM","32-QAM","64-QAM","128-QAM","256-QAM"],valueArrPos:2},	
				  12:{nameFlag:"quality",isSelect:0,textFlag:2,text:["�ź�����","�ź�����"],listText:""},
				  13:{nameFlag:"signalLevel",isSelect:0,textFlag:2,text:["��������","��������"],listText:""},
				  14:{nameFlag:"serchBtton",isSelect:2,textFlag:3,listText:"�Զ�Ƶ������"},
				  15:{nameFlag:"openSoundFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["������Ч","������Ч"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  16:{nameFlag:"soundVolume",isSelect:1,tipsType:0,textFlag:0,value:10,listText:"",text:["��Ч����","��Ч����"],textArr:[[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100],[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100]],valueArr:[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100],valueArrPos:0},
				  17:{nameFlag:"soundFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["��ҳ����","��ҳ����"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  18:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["������Ч","������Ч"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  19:{nameFlag:"news",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["����Ӣ����Ļ","����Ӣ����Ļ"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  20:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["��Ŀ�ؿ�����","��Ŀ�ؿ�����"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  21:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["��ͷ������","��ͷ������"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  22:{nameFlag:"powerSound",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["��������","��������"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:0},
				  23:{nameFlag:"netFlag",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["����ѡ��","����ѡ��"],textArr:[["��������","��������"],["��������","��������"]],valueArr:[0,1],valueArrPos:0},
				  24:{nameFlag:"DHCPEnable",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["�Զ���ȡ","�Զ���ȡ"],listText:"��",textArr:[["��","��"],["NO","YES"]],valueArr:[0,1],valueArrPos:1}, 
				  25:{nameFlag:"IP",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["IP��ַ","IP��ַ"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  26:{nameFlag:"mask",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["��������","��������"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  27:{nameFlag:"gateway",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["���ص�ַ","���ص�ַ"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],pos:0,textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  28:{nameFlag:"DNS",isSelect:0,tipsType:4,textFlag:1,value:"",listText:"000.000.000.000",text:["DNS��ַ","DNS��ַ"],valueArr:[0,0,0,".",0,0,0,".",0,0,0,".",0,0,0],textArr:[[0,1,2],[0,1,2,3,4,5],[0,1,2,3,4,5,6,7,8,9]],textArrPosX:0},
				  29:{nameFlag:"saveIpBotton",isSelect:2,textFlag:3,listText:"����IP����"},
                  30:{nameFlag:"videoMode",isSelect:1,tipsType:0,textFlag:0,value:"AUTO",listText:"",text:["��ʽѡ��","��ʽѡ��"],textArr:[["AUTO","NTSC","PAL"],["AUTO","NTSC","PAL"]],valueArr:["Auto","NTSC","PAL"],valueArrPos:0},
				  31:{nameFlag:"soundMode",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["Ĭ������","Ĭ������"],textArr:[["���","����","������","������"],["���","����","������","������"]],valueArr:["stereo","mix","left","right"],valueArrPos:0},
				  32:{nameFlag:"videoAspect",isSelect:1,tipsType:0,textFlag:0,value:0,listText:"",text:["��ʾ����","��ʾ����"],textArr:[["�Զ�","16:9","4:3"],["�Զ�","16:9","4:3"]],valueArr:[1,2,4],valueArrPos:0},
				  33:{nameFlag:"videoOutputPort",isSelect:1,tipsType:1,textFlag:0,value:0,listText:"",text:["��ʾģʽ","��ʾģʽ"],textArr:[["HDMI","SPDIF"],["HDMI","SPDIF"]],valueArr:["HDMI","SPDIF"],valueArrPos:0},	
				  34:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["����������","����������"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  35:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["Ĭ������ģʽ","Ĭ������ģʽ"],textArr:[["�ر�","����"],["NO","YES"]],valueArr:[0,1],valueArrPos:1},
				  36:{nameFlag:"reminder",isSelect:1,tipsType:0,textFlag:0,value:1,listText:"",text:["��������","��������"],textArr:[["��Ļ˳��","���Լ���"],["��Ļ˳��","���Լ���"]],valueArr:[0,1],valueArrPos:1},
                  37:{nameFlag:"botton",isSelect:2,textFlag:3,listText:"�ָ���������"},
				  38:{nameFlag:"STB",isSelect:0,textFlag:4,listText:"",text:["STB���к�","STB���к�"]},
				  39:{nameFlag:"hVersion",isSelect:0,textFlag:4,listText:"",text:["Ӳ���汾","Ӳ���汾"]},
				  40:{nameFlag:"sVersion",isSelect:0,textFlag:4,listText:"",text:["����汾","����汾"]},
				  41:{nameFlag:"bVersion",isSelect:0,textFlag:4,listText:"",text:["������汾","������汾"]},
				  42:{nameFlag:"flashBlock",isSelect:0,textFlag:4,listText:"",text:["�洢�ռ�","�洢�ռ�"]},
				  43:{nameFlag:"IP1",isSelect:0,textFlag:4,listText:"",text:["����IP��ַ","����IP��ַ"]},
				  44:{nameFlag:"MAC",isSelect:0,textFlag:4,listText:"",text:["MAC��ַ","MAC��ַ"]}
};  
					
           