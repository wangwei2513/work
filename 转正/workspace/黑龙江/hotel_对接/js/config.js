var debug = 1;//1��ʾ���ԣ�0��ʾʵ������
var host = "http://10.177.64.2:8080";//�ֳ�������ַ
var publicURL = "/ContentWS/services";	//�ӿ�ǰ������
var BACK_URL = "index.htm"; //��һ��ҳ���ַ

var playUrl = "http://10.0.10.35/application/player/play.htm";//����ҳ��
var useSimulationCard = false;
var areaSaveKey = "live_area_id";
//var stbId = useSimulationCard ? "8510010598733215" : getSmartCardId();
//var stbId = "HLJ17030841081517100424497";
var stbId = getSmartCardId();

/*���������ַ*/
var ajaxUrls = {
	"queryHotelInfoUrl":[host+publicURL+"/queryHotelInfo","data/queryHotelInfo.js"],//��ȡ�Ƶ���Ϣ
	"publicMenuUrl":[host+publicURL+"/queryPublicCategory","data/queryPublicCategory.js"],//��ȡ��ҳ������Ŀ
    "pubColumnUrl":[host+publicURL+"/queryPublicColumn","data/queryPublicColumn{1}.js"],//��Ŀ�ӿ�
    "priColumnUrl":[host+publicURL+"/queryPrivateColumn","data/queryPublicColumn{1}.js"],//������Ŀ�ӿ�
	"queryAppDataUrl":[host+publicURL+"/queryPrivateJson","data/queryPrivateJson{1}_{2}.js"],//��Ŀ�����ݽӿ�
	"privateColumn":[host+publicURL+"/queryPrivateColumn","data/queryPrivateColumn.js"]//��ȡ������Ŀ����û�õ�
};

function getSmartCardId(){
	//if(typeof CAManager != "undefined"){
  //      iDebug("CAManager.cardSerialNumber="+hardware.STB.serialNumber);
	//	return hardware.STB.serialNumber;
	//}	
	var stbid ="";
	// stbid = network.macAddress;
	// iDebug("CAManager.cardSerialNumber="+stbid);
	// return stbid;
}



