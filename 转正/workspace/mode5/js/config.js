var debug= 0;  // 0 ���ز���  1 �ֳ�����
var rootPath=["http://192.168.36.154/app/test/hanrx/JXHY-3.0/testData/","http://10.65.255.118//JXHY/data/"][debug];
var requestUrl=rootPath;
var browserType = ["Google","iPanel"][debug]
function debugInfo(__str){
	if(browserType == "iPanel"){
		iPanel.debug(__str);	
	}else if(browserType == "Opera"){
		opera.postError(__str);
	}else if(browserType == "Google"){
		console.log(__str);
	}
}
