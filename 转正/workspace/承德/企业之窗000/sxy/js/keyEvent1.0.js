/*****************����Ч�ϳɡ�����*******************/
//if(typeof(iPanel.eventFrame.globalvarObj)=="undefined"){
	//iPanel.eventFrame.globalvarObj = {};
//}

//iPanel.eventFrame.inputUrl = {
var inputUrl = {
	textarea:"/global/input/input1.0/input1.0.htm",//�������뷨
	input:"/global/input/input1.0/input1.1.htm",//�������뷨
	number:"/global/input/inputNum/inputNum.htm",//�������뷨
	psw:"/global/input/inputNum/inputNum.htm?1",//�������뷨
	counter:"/global/input/inputCounter/inputCounter.htm",//���������뷨
	date:"/global/input/date/date.htm"//�������뷨
}

/***************** ��ɫ *******************/
var roleParam = {//
	initDivId:"roleDiv", //��ɫԪ�������DIV
	spacing:160, //��ɫ���
	txtColor:"#000000",//�ı���ɫ
	info:[
		 {roleid:"00000101",name:"����",pic:"fc_picHead0_1.png"}
		,{roleid:"00000102",name:"�ְ�",pic:"fc_picHead0_2.png"}
		,{roleid:"00000103",name:"����",pic:"fc_picHead0_3.png"}
	]
}

/*****************ȫ�ֱ���*******************/
//var keyReturnFlag = 0; //0 return 0    1 return 1;	//********************************Ĭ�ϵľ��ǽ�ֹ��Ҫ����һ�㣬�����ֵ���1������menu��
var iPanelKeyFlag = 0; //==1���ΰ��� 
var ___menuBtnNums = 0;
var ___menuTime = 0;

//****************************ϵͳ��Ϣ�¼�����*****************************
document.onsystemevent = grabSysEvent;
function grabSysEvent(event){
	
	var keyReturnFlag = 0;		//���ݷ���ֵ���ж�Ҫ��Ҫ������һ��
	var keycode = event.which;
	var p2 = event.modifiers;			//p2ֵ����Щ��Ϣ���ܻᴫ����p2ֵ����p2ֵ����doOtherKey
	keyReturnFlag = doOtherKey(keycode, p2);
	return keyReturnFlag;
}

/*
*@fun  doBasicKey: �����¼��������ϣ��£����ң��˳������أ�menu����ȷʵ���İ�����Ϣ��keyReturnFlag�Ǹ���doBasicKey�ķ���ֵ�������ģ�������Ĭ��ֵΪ0������Ϊ��ֹ��Ϣ��
*
*@fun  doOtherKey:��չ�¼�  ��Ҫ��ϵͳ������Щ��Ϣ��keyReturnFlag�Ǹ���doOtherKey�ķ���ֵ�������ģ�������Ĭ��ֵΪ1������Ϊ����Ϣ������һ����
*/
//****************************��ͨ������Ϣ�¼�����*****************************
//document.onkeypress = grabEvent;
//document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;		//�þ������Ϊ������google�ı��֣����˴˾��
function grabEvent(event){
	//if(iPanelKeyFlag == 1) return 0;	//������ĳ�����ʱ����Ҫ���¼���ֹ�����磬�ڻ��������У��������¼��������ڴ���widget
	var keyReturnFlag = 0;		//���ݷ���ֵ���ж�Ҫ��Ҫ������һ��
	var keycode = event.which;
	var p2 = event.modifiers;			//p2ֵ����Щ��Ϣ���ܻᴫ����p2ֵ����p2ֵ����doOtherKey
	if(keycode < 58 && keycode > 47){//���ּ�
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
			case 340://����
			case 8:
				keyReturnFlag = doBasicKey("back",p2);
				break;
			case 513://�˵�
			case 36:
				keyReturnFlag = doBasicKey("menu");
				break;
			case 512://��ҳ
			case 306:
			case 36:
				keyReturnFlag = doBasicKey("menu");
				//keyReturnFlag = doBasicKey("portal");
				break;
			case 595://����+
				keyReturnFlag = doBasicKey("volUp");
				break;
			case 596://����-
				keyReturnFlag = doBasicKey("volDown");
				break;
			default:
				break;
		}
	}
	return keyReturnFlag;
}

