
function $(id){
	return document.getElementById(id);
}

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//����Ҫ����ӡ��ʱ�䣬���Ըģ�iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}
