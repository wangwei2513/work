
/**************************************************************************//*
@ �����ò˵����ݡ�-- start!
@  ��Ӧ�õġ�loadҳ�桱ʱ�������Ӧ�á��˵������Ĳ˵����� */
//����˵����ݵı���
var key_menuArr = [
	/*{name:"Ӧ�����",fun:"showAppInfo",widget:["select"]},
	{name:"Ӧ����ҳ",fun:"goAppHome",widget:["appSet"]},
	{name:"�˳�Ӧ��",fun:"exitApp",widget:["detail"]}//����widget*/
	{name:"Ӧ�����",fun:"showAppInfo",widget:[]},
	{name:"Ӧ����ҳ",fun:"goAppHome",widget:[]},
	{name:"�˳�Ӧ��",fun:"exitApp",widget:[]}//����widget
];
var key_backArr = [
	{name:"��",fun:"exitApp",widget:["select","detail"]},//ȷ��,����widget
	{name:"��",fun:function(){}} //ȡ��
];
var key_appInfo = ["<b>��Ȩ���У�</b>������׳����ɷ����޹�˾<br /><b>��ϵ��ʽ��</b>www.iPanel.tv<br/> <b>�����Ŷӣ�</b>iTime���ֵ���Ӧ�ÿ����Ŷ�"];
//Ҫ���صĶ���
/*--------------------------------------------------------------------------*/
var menuObj = null;
function initMenuObj(){
	menuObj = new  iTimeMenu(key_menuArr,key_backArr,key_appInfo);
	//��ʼ������,����ʼ���ͻ�ʹ��Ĭ�ϵ�
	menuObj.initMenuArr();
//  menuObj.menuBackFun(function(){});//ϵͳ�˵� ������ʱ�����Ӻ���������ͣ��Ϸ��������Ϸ�Ⱥ��� ��ע�⣺����Ϊ������
//  menuObj.backBackFun(function(){});//�����ز˵���������ʱ�����Ӻ���������ͣ��Ϸ��������Ϸ�Ⱥ���
//  menuObj.showMenu(); //����ϵͳ�˵�
//  menuObj.showBack(); //����[����]�˵�
}

function testFun(){
	$("test").style.left = "500px";
}

/*--------------------------------------------------------------------------**
@ ����ɫ���塿-- start!*/
var roleObj = null; //��ɫ����
var roleCompFlag = 0;//0����ɫ����ɹ� 1����ɫ����ɹ� ��ע�⣺������Ϊ����������flag,��widget�����Ƿ�ɹ���
//ajax�����ɫ��Ϣ
function robleAjax(){
	loadBar();
	//�Խ�ʱ���ú�����ajax�����滻
	//��ǰ����������������ɹ�
	setTimeout(function(){
		robleinit();
	},2000);
}
//��ɫ��ʼ��
function robleinit(){
	roleObj = new appRole(roleParam);
	roleObj.init();//��ʼ������
	//roleObj.showRole();//��ʾ��ɫ�б�  ע���Ȳ���ʾ
	roleCompFlag = 1; //1����ɫ����ɹ�
}


/*--------------------------------------------------------------------------*/
//5974��Ϣ�ĺ���  === > ҳ�����
function pageLoading(){
	
	/**��Ҫ����**/
	if(isLoading==1){
		//��ɫӦ��
		if(isRoleApp==1){
			if(roleCompFlag==0){//��ɫ����δ����
				t0 = setTimeout("pageLoading()",100);
			}else {//��ɫ�����������
				for(var i=0;i<roleParam.info.length;i++){
					//��ɫͼƬ��ӵ���������,[���뱣��·����ȷ������㲻ȷ��������ע��]
					loadRes.unshift(iPanel.eventFrame.roleUrl+roleParam.info[i].pic)
				}
				appsPreLoad(loadRes);//����
			}
		}
		//�ǽ�ɫӦ��
		else{
			appsPreLoad(loadRes);//����
		}
	}
	
	/**����Ҫ����**/
	else {
		if(isRoleApp==1){
			if(roleCompFlag==0){//��ɫ����δ����
				t0 = setTimeout("pageLoading()",100);
			}else {
				roleObj.showRole();//��ʾ��ɫ�б�
				focusArea = 1;
			}
		}else {
			gotoNextUrl();//�ǽ�ɫӦ�ã�ֱ�ӵ�ת����Ӧ����ҳ
		}
	}
}

//5782��Ϣ�ĺ���  === > ���ؼ��ذٷֱ�
function materialLoading(_num){
	var num = parseInt(_num);
	loadBar(num);
	if(num==100){ //�����ꡪ��>������ɫ�б�			 	
		if(isRoleApp==1){//����н�ɫ
			//�Խ��Ǹ��ж�Ǳ�뵽ajax������
			setTimeout(function(){
				$("jd").style.visibility = "hidden";
				$("bar").style.visibility = "hidden";
				roleObj.showRole();//��ʾ��ɫ�б�
				focusArea = 1;
			},10);//����Ƕ������أ���ô�޸�10��Ϊ�ʵ���ʱ��
		}else {//���û�н�ɫ
			gotoNextUrl(); //��������ת����һ��ҳ��
		}
	}
}

//����������
function loadBar(_num){
	if(isLoading==0)return;
	var L =Math.floor( _num/10)
	if(typeof _num=="undefined"){
		//$("barDiv1").style.visibility= "visible";
		setTimeout("loadBar("+_num+")",100);
	}
	//�������
	else {
		for(var i=0;i<L;i++){
			$("barDiv"+i).style.visibility= "visible";
		}
		if(i==10){
			$("barDiv10").style.visibility= "visible";
			$("barDiv11").style.visibility= "visible";
		}
	}
	
}