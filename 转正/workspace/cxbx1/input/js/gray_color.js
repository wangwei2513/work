var defaults = {
	outzIndex:999,
	outbgColor:"#474747",
	color:"#e5e3e3",//�����ڵĳ���ͷ�����������ɫ
	selectbgColor:"#ffca28",//���㱳����ɫ
	selectColor:"#000000",//�����ڵļ�ͷ��ɫ
	inputValue:"",      //�ַ�������
	intr:"",			//��ʼ���ı����������
	dict:"",  			//�ʿ�
	type:0,   			//typeΪ0�����ַ�������ģʽ��Ϊ1������ģʽ
	strLength:10000000, //�ַ�������
	isEng:1,  			//0��Ӣ�ģ�1������,2,�ʻ�
	isWebkit:1,         //�Ƿ�����Ҫ2dԪ�أ���Ҫ�û�����ҳ����2dԪ�أ��㼶���⣬1��ʾ��Ҫ��0��ʾ����Ҫ ������ȥ����
	duration:"100ms",
	htmlDom:null,
	reqIp:"",
	callback:function(){},
	backmethod:function(){}
};


var globalColorConf = {};
//��ɫ �ǳ
globalColorConf.tdBgColor1 = "#2f2f2f";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor2 = "#383838";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor3 = "#474747";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor4 = "#7f7f7f";		//���뷨��ɫ����ɫ



globalColorConf.wordColor = "#000000";		//����ʱ���ֵ���ɫ
globalColorConf.inputValueColor = "#ffffff";//��������ʱ���������е���ĸ��ɫ

globalColorConf.selectColor = "#000000";//�������ڵط���������ɫ


globalColorConf.arrowColor = "#e5e3e3";//��ͷ��ɫ
globalColorConf.inputButtonColor = "#e5e3e3";//�ύ��ť������ɫ


globalColorConf.changeInputColor = "#8e8e8e";//���������л���ť��������ɫ
globalColorConf.cursorColor  ="#a2a2a2";//�����ɫ
globalColorConf.cursorSelectColor  ="#9e00ba";//��걻ѡ����ɫ