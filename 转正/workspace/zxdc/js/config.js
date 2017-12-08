var IS_DEBUG = 1; //0:���ز������ݣ�  1���ӿ���������
var HOST = ["../","http://172.18.254.19:8080/FoshanVOD/js/"][IS_DEBUG];
//var HOST = ["../","http://192.168.55.122:8080/FoshanVOD/js/"][IS_DEBUG];
var cardId = CA.icNo/*"8757002164818878"*/;
var accout = DataAccess.getInfo("UserInfo", "account")/*"FS721050"*/;    //������˻�ID

var column_menu = [HOST+"data/columnMenu.js",HOST+"getColumns.action?assetId={1}&account={2}&client={3}&flag={4}"][IS_DEBUG];//��Ŀ�˵�
var column_list = [HOST+"data/columnList.js",HOST+"getColumns.action?assetId={1}&account={2}&client={3}&flag={4}"][IS_DEBUG];//��Ŀ�˵�������б�
var column_detail = [HOST+"data/columnDetail.js",HOST+"getFilmDetail.action?titleAssetId={1}&account={2}&client={3}"][IS_DEBUG];//vod������
var play_url = [HOST+"data/playUrl.js",HOST+"authentication.action?titleAssetId={1}&account={2}&client={3}&serviceId={4}&portalId={5}"][IS_DEBUG];
var get_tele_play = [HOST+"data/getTeleplay.js",HOST+"getTeleplay.action?assetId={1}&account={2}&client={3}"][IS_DEBUG];//��ȡ�����缯��
var get_recommend = [HOST+"data/getRecommend.js",HOST+"getRecommend.action?account={1}&clientId={2}&targetLabel={3}&quickId={4}"][IS_DEBUG];//��ȡ���Ƽ�����Ƶ�б�
var save_praise = [HOST+"data/savePraise.js",HOST+"savePraise.action?quickId={1}&flag={2}"][IS_DEBUG];//�������
var do_save = [HOST+"data/save.js",HOST+"saveFavorite.action?titleAssetId={1}&folderAssetId={2}&clientId={3}&account={4}"][IS_DEBUG];//�����ղؽӿ�
var del_save = [HOST+"",HOST+"delFavorite.action?titleAssetId={1}&folderAssetId={2}&clientId={3}&account={4}"][IS_DEBUG];//ɾ���ղصĽӿ�
var save_list = [HOST+"data/getRecommend.js",HOST+"getFavoriteList.action?clientId={1}&account={2}&flag={3}"][IS_DEBUG];//��ȡ�ղ��б�

function getAjaxUrl(){
	var url = "";
	var args = arguments;
	switch (args[0]) {
		case "columnMenu":
		url = column_menu.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]);
		break;
		case "columnList":
		url = column_list.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]);
		break;
		case "columnDetail":
		url = column_detail.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]);
		break;
		case "playUrl":
		url = play_url.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]).replace(/\{5}/g, args[5]);
		break;
		case "getTeleplay":
		url = get_tele_play.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]);	
		break;
		case "getRecommend":
		url = get_recommend.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]);		
		break;
		case "savePraise":
		url = save_praise.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]);	
		break;
		case "doSave":
		url = do_save.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]);
		break;
		case "delSave":
		url = del_save.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]).replace(/\{4}/g, args[4]);
		break;
		case "saveList":
		url = save_list.replace(/\{1}/g, args[1]).replace(/\{2}/g, args[2]).replace(/\{3}/g, args[3]);	
		break;
	}
	return url;
}