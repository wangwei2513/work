
/**************************************************************************//*
@ 【设置菜单内容】-- start!
@  在应用的“load页面”时，导入该应用【菜单】键的菜单内容 */
//定义菜单内容的变量
var key_menuArr = [
	/*{name:"应用相关",fun:"showAppInfo",widget:["select"]},
	{name:"应用首页",fun:"goAppHome",widget:["appSet"]},
	{name:"退出应用",fun:"exitApp",widget:["detail"]}//销毁widget*/
	{name:"应用相关",fun:"showAppInfo",widget:[]},
	{name:"应用首页",fun:"goAppHome",widget:[]},
	{name:"退出应用",fun:"exitApp",widget:[]}//销毁widget
];
var key_backArr = [
	{name:"是",fun:"exitApp",widget:["select","detail"]},//确定,销毁widget
	{name:"否",fun:function(){}} //取消
];
var key_appInfo = ["<b>版权所有：</b>深圳茁壮网络股份有限公司<br /><b>联系方式：</b>www.iPanel.tv<br/> <b>开发团队：</b>iTime数字电视应用开发团队"];
//要加载的东西
/*--------------------------------------------------------------------------*/
var menuObj = null;
function initMenuObj(){
	menuObj = new  iTimeMenu(key_menuArr,key_backArr,key_appInfo);
	//初始化数据,不初始化就会使用默认的
	menuObj.initMenuArr();
//  menuObj.menuBackFun(function(){});//系统菜单 按返回时，附加函数，如暂停游戏，启动游戏等函数 【注意：参数为函数】
//  menuObj.backBackFun(function(){});//【返回菜单】按返回时，附加函数，如暂停游戏，启动游戏等函数
//  menuObj.showMenu(); //弹出系统菜单
//  menuObj.showBack(); //弹出[返回]菜单
}

function testFun(){
	$("test").style.left = "500px";
}

/*--------------------------------------------------------------------------**
@ 【角色定义】-- start!*/
var roleObj = null; //角色对象
var roleCompFlag = 0;//0：角色请求成功 1：角色请求成功 【注意：可以作为其他条件的flag,如widget创建是否成功】
//ajax请求角色信息
function robleAjax(){
	loadBar();
	//对接时，该函数用ajax函数替换
	//当前假设觉得两秒后请求成功
	setTimeout(function(){
		robleinit();
	},2000);
}
//角色初始化
function robleinit(){
	roleObj = new appRole(roleParam);
	roleObj.init();//初始化数据
	//roleObj.showRole();//显示角色列表  注：先不显示
	roleCompFlag = 1; //1：角色请求成功
}


/*--------------------------------------------------------------------------*/
//5974消息的函数  === > 页面加载
function pageLoading(){
	
	/**需要加载**/
	if(isLoading==1){
		//角色应用
		if(isRoleApp==1){
			if(roleCompFlag==0){//角色数据未请求到
				t0 = setTimeout("pageLoading()",100);
			}else {//角色数据请求完成
				for(var i=0;i<roleParam.info.length;i++){
					//角色图片添加到加载序列,[必须保持路径正确，如果你不确定，请先注释]
					loadRes.unshift(iPanel.eventFrame.roleUrl+roleParam.info[i].pic)
				}
				appsPreLoad(loadRes);//加载
			}
		}
		//非角色应用
		else{
			appsPreLoad(loadRes);//加载
		}
	}
	
	/**不需要加载**/
	else {
		if(isRoleApp==1){
			if(roleCompFlag==0){//角色数据未请求到
				t0 = setTimeout("pageLoading()",100);
			}else {
				roleObj.showRole();//显示角色列表
				focusArea = 1;
			}
		}else {
			gotoNextUrl();//非角色应用，直接调转到，应用首页
		}
	}
}

//5782消息的函数  === > 返回加载百分比
function materialLoading(_num){
	var num = parseInt(_num);
	loadBar(num);
	if(num==100){ //加载完——>开发角色列表			 	
		if(isRoleApp==1){//如果有角色
			//对接是该判断潜入到ajax函数中
			setTimeout(function(){
				$("jd").style.visibility = "hidden";
				$("bar").style.visibility = "hidden";
				roleObj.showRole();//显示角色列表
				focusArea = 1;
			},10);//如果是动画加载，那么修改10，为适当的时间
		}else {//如果没有角色
			gotoNextUrl(); //加载完跳转到下一个页面
		}
	}
}

//加载条函数
function loadBar(_num){
	if(isLoading==0)return;
	var L =Math.floor( _num/10)
	if(typeof _num=="undefined"){
		//$("barDiv1").style.visibility= "visible";
		setTimeout("loadBar("+_num+")",100);
	}
	//进入加载
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