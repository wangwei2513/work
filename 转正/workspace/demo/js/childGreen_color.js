var defaults = {
	outzIndex:999,
	outbgColor:"#778f2d",
	color:"#fffffd",//�����ڵĳ���ͷ�����������ɫ
	selectbgColor:"#f6c431",//���㱳����ɫ
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
globalColorConf.tdBgColor1 = "#677c10";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor2 = "#6e8412";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor3 = "#7c931d";		//���뷨��ɫ����ɫ
globalColorConf.tdBgColor4 = "#9bb336";		//���뷨��ɫ����ɫ

globalColorConf.wordColor = "#344700";		//����ʱ���ֵ���ɫ
globalColorConf.inputValueColor = "#ffffff";//��������ʱ���������е���ĸ��ɫ

globalColorConf.selectColor = "#000000";//�������ڵط���������ɫ


globalColorConf.arrowColor = "#f0f0f0";//���·�ҳ��ͷ��ɫ
globalColorConf.inputButtonColor = "#f0f0f0";//�ύ��ť������ɫ

globalColorConf.changeInputColor = "#b8cf94";//���������л���ť��������ɫ
globalColorConf.cursorColor  ="#b1da3a";//�����ɫ
globalColorConf.cursorSelectColor  ="#9e00ba";//��걻ѡ����ɫ