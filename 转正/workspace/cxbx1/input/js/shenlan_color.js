var defaults = {
	outzIndex:999,
	outbgColor:"#0a3755",
	color:"#fffffd",//�����ڵĳ���ͷ�����������ɫ
	selectbgColor:"#ffca28",//���㱳����ɫ
	selectColor:"#020300",//�����ڵļ�ͷ��ɫ
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
globalColorConf.tdBgColor1 = "#07243c";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor2 = "#062d4d";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor3 = "#0a3755";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor4 = "#0d4d78";		//���뷨��ɫ����ɫ

globalColorConf.wordColor = "#ffffff";		//����ʱ���ֵ���ɫ
globalColorConf.inputValueColor = "#ffffff";//��������ʱ���������е���ĸ��ɫ

globalColorConf.selectColor = "#000000";//�������ڵط���������ɫ


globalColorConf.arrowColor = "#dcdcdc";//��ͷ��ɫ
globalColorConf.inputButtonColor = "#dcdcdc";//�ύ��ť������ɫ

globalColorConf.changeInputColor = "#598bb3";//���������л���ť��������ɫ
globalColorConf.cursorColor  ="#00fcff";//�����ɫ
globalColorConf.cursorSelectColor  ="#9e00ba";//��걻ѡ����ɫ