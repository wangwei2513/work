/**
*rojao js lib
*采集参数从si配置文件中读取，配置文件存放位置："/storage/storage0/siConfig/ServiceInfo.json"
*网络不通时，采集数据需要缓存到本地，缓存数据存放到："/storage/storage0/dataCollection/bCacheData.dat"
**/

var siConfigPath = "/storage/storage0/siConfig/ServiceInfo.json";
var cachePath = "/storage/storage0/dataCollection/bCacheData.dat";
var networkPath = "/storage/storage0/NetworkId.json";
var dataBuff = new Array();
//如果si配置表中给出缓存参数，则用配置表中的属性替换该定义
var maxBuffCount = 50;
var midVer = 1;
var dataCollectionUrl = "";
var networkId = "-1";

/**
 *格式化时间 
 */
function format(d,formatter) {
	if(!formatter || formatter == ""){
        formatter = "yyyy-MM-dd";
    }	
	var weekdays = {
		"chi": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		"eng": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	};
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    var date = d.getDate().toString();
    var day = d.getDay();
	var hour = d.getHours().toString();
	var minute = d.getMinutes().toString();
	var second = d.getSeconds().toString();

	var yearMarker = formatter.replace(/[^y|Y]/g,'');
	if(yearMarker.length == 2) {
		year = year.substring(2,4);
	} else if (yearMarker.length == 0) {
		year = "";
	}

	var monthMarker = formatter.replace(/[^M]/g,'');
	if(monthMarker.length > 1) {
		if(month.length == 1) {
			month = "0" + month;
		}
	} else if (monthMarker.length == 0) {
		month = "";
	}

	var dateMarker = formatter.replace(/[^d]/g,'');
	if(dateMarker.length > 1) {
		if(date.length == 1) {
			date = "0" + date;
		}
	} else if (dateMarker.length == 0) {
		date = "";
	}

	var hourMarker = formatter.replace(/[^h]/g, '');
	if(hourMarker.length > 1) {
		if(hour.length == 1) {
			hour = "0" + hour;
		}
	} else if (hourMarker.length == 0) {
		hour = "";
	}

	var minuteMarker = formatter.replace(/[^m]/g, '');
	if(minuteMarker.length > 1) {
		if(minute.length == 1) {
			minute = "0" + minute;
		}
	} else if (minuteMarker.length == 0) {
		minute = "";
	}

	var secondMarker = formatter.replace(/[^s]/g, '');
	if(secondMarker.length > 1) {
		if(second.length == 1) {
			second = "0" + second;
		}
	} else if (secondMarker.length == 0) {
		second = "";
	}
    
    var dayMarker = formatter.replace(/[^w]/g, '');
    var lang = "eng";
    var result = formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dateMarker,date).replace(hourMarker,hour).replace(minuteMarker,minute).replace(secondMarker,second); 
	if (dayMarker.length != 0) {
		result = result.replace(dayMarker,weekdays[lang][day]);
	}
    return result;
};      


/**
 *读取指定路径的JSON文件内容，并返回，如果返回null,则读取失败 
 */
function readJsonFileContent(filePath){
	var fileHandle = FileSystem.getFile(filePath);
	if(fileHandle == -1){
		return null;
	}
	else if(fileHandle == 0){
		return null;
	}
	
	var ret = fileHandle.open(1);
	if(ret == 0){
		return null;
	}
	
	ret = fileHandle.readAllfile();
	if(ret == 0){
		return null;
	}
	
	try {
		var result = JSON.parse(ret);
	} catch(e) {		
		return null;
	}
	
	ret = fileHandle.close();
	if(ret == -1){
		return null;
	}
	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return null;
		
	return result;
}

/**
 *尝试多次读取文件内容，filePath为文件路径，tryCount为尝试读取的次数，最好2～3次，防止只读一次失败的情况 
 */
function readJsonFile(filePath, tryCount){
	var ret = null;
	while(tryCount > 0 && (ret = readJsonFileContent(filePath)) == null)
	{
		--tryCount;
	}
	return ret;
}

/**
 * 读取指定路径的文本文件内容，并返回，如果返回null,则读取失败 
 */
function readTextFileContent(filePath){
	var fileHandle = FileSystem.getFile(filePath);
	if(fileHandle == -1){
		return null;
	}
	else if(fileHandle == 0){
		return null;
	}	
	var ret = fileHandle.open(1);
	if(ret == 0){
		return null;
	}	
	var result = fileHandle.readAllfile();
	if(result == 0){
		return null;
	}	
	ret = fileHandle.close();
	if(ret == -1){
		return null;
	}	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return null;		
	return result;
}

function readTextFile(filePath, tryCount){
	var ret = null;
	while(tryCount > 0 && (ret = readTextFileContent(filePath)) == null)
	{
		--tryCount;
	}
	return ret;
}

/**
 *写内容到指定的文件中，filePath为文件名，contentStr为要写入的内容 
 */
function saveContent2File(filePath, contentStr){
	var fileHandle = FileSystem.createFile();
	var ret = fileHandle.open(1);
	if(ret == 0){
		return false;
	}	
	ret = fileHandle.writeFile(contentStr);
	if(ret == 0){
		return false;
	}		
	ret = fileHandle.close();
	if(ret == -1){
		return false;
	}	
	var dirObj = FileSystem.createDirectory(filePath.substring(0, filePath.lastIndexOf('/')));
	if(dirObj == 0)
	{	
		return false;
	}
	ret = fileHandle.saveAs(filePath);
	if(ret == -1){
		return false;
	}
	else if(ret == 0){
		return false;
	}	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return false;
	if (typeof dirObj == "object") {
		ret = FileSystem.killObject(dirObj);
		if(ret == 0)
			return false;
	}		
	return true;
}

/**
 *通过尝试多次的方式保存文件，防止只写一次失败的情况。通常写1次即可 
 */
function saveFile(filePath, contentStr, count) {
	var ret = false;
	while (count > 0 && ( ret = saveContent2File(filePath, contentStr)) == false) {--count;
	}
	return ret;
}

/**
 *从本地读取之前的缓冲内容到内存中，并通过回车换行符分隔为数组返回 
 */
function initLocalBuff(cachePath){
	var localBuff = readTextFileContent(cachePath,3);
	
	if(localBuff == null){
		return null;
	}		
	return localBuff.split("\r\n");
}

/**
 *把字符串数组转换为通过回车换行符分隔的字符串 
 */
function strArrayToString(strArray){
	if(strArray == null){
		return null;
	}
	var i = 0;
	var len = strArray.length;
	var resultStr = "";
	for(i=0;i<len;i++){		
		resultStr += strArray[i]+"\r\n";		
	}
	return resultStr;
}

/**
 *判断一个对象是否是数组 
 */
function isArray(obj){ 
	return (typeof obj=='object')&&obj.constructor==Array; 
}

/**
 *写数据到flash。
 * 合并当前内存中缓存的数据到flash中已经写如的数据，然后只写入最新的50条数据。
 */
function writeData2Flash(){
	if(dataBuff.length > 0){
		var buff = initLocalBuff(cachePath);
		var filtedArr = filterRepeat(dataBuff);
		
		var tempBuff = null;
		if(buff){
			tempBuff = buff.concat(filtedArr);
		}
		else{
			tempBuff = filtedArr;
		}
		filtedArr = filterRepeat(tempBuff);
		var len = filtedArr.length;
		var start = 0,end = len+1;
		if(len > maxBuffCount){
			start = len - maxBuffCount;
		}
		var validData = filtedArr.slice(start,end);
		var dataStr = strArrayToString(validData);
		if(dataStr == null){
			return;
		}
		saveFile(cachePath,"",1);		
		saveFile(cachePath,dataStr,1);
		dataBuff = [];
	}
}

/**
 *定时监测本地是否有缓存数据，如果有，尝试发送到前端，如果发送成功，则清空本地缓存，否则继续保留缓存 
 */
function flushBuffer(){
	var buff = initLocalBuff(cachePath);		
    if(buff){    
    	buff = buff.concat(dataBuff);	
    	buff = filterRepeat(buff);
    } 
    else{
    	buff = [];
    }
	if(buff.length > 0){
		sendDataByPost(buff,true);
	}	
}

/**
 *把数据压入缓存 
 */
function fifoPut(obj){
	if(isArray(obj)){		
    	var len = obj.length;
    	var buffSize = dataBuff.length;
    	
    	while((len+buffSize) >= maxBuffCount){    	
    		dataBuff.shift();
    		buffSize = dataBuff.length;
    	}
    	var i = 0;
    	for(i=0;i<len;i++){
    		dataBuff.push(obj[i]);
		}
	}
	else{
		if(dataBuff.length >= maxBuffCount){
			dataBuff.shift();
		}
		dataBuff.push(obj);
	}
	var filtedArr = filterRepeat(dataBuff);
	dataBuff = filtedArr;
}

function fifoPop(){
	return dataBuff.shift();
}

/**
 *通过post模式发送数据 
 */
function sendDataByPost(param,clearBuff){	
    if(dataCollectionUrl == ""){        	
        return;
    }
    var dataStr = "";
    if(isArray(param)){
    	dataStr = strArrayToString(param);
    }
    else{
    	dataStr = param;
    }
	//check midware version
	if(midVer == 2){
		//2.0,send servie data to DataCollectionApp by event				
		SysSetting.sendAppEvent(21005,dataStr,0,0);		
	}
	else{
		//1.0,send data by ajax or buffer data to flash when send failed			
		var ajax = new XMLHttpRequest();
		//callback
		ajax.onreadystatechange = function(){
			if (ajax.readyState == 4 ){
				if(ajax.status == 200){
					if(clearBuff == true){						
						saveFile(cachePath,"",3);
					}
				} else {
					//push service data into buffer
					if(clearBuff == false){
						fifoPut(param);
					}
				}
				ajax = null;
			}
		};		
		//set post method and 
		ajax.open("POST", dataCollectionUrl, true);
		//set request header encode
		ajax.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
		//send
		ajax.send(dataStr);
	}
}

/**
 *过滤掉数组中重复的内容 
 */
function filterRepeat(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

/**
 *检查某个函数是否定义 
 */
function checkFunction(funcName) {
	try {
		if ( typeof (eval(funcName)) == "function") {			
			return true;
		}
		else{
			return false;
		}
	} catch(e) {
	}	
	return false;	
}

/*********************** 数据采集对外接口 ********************************
 * 引入DataCollection.js
 * 通过DataCollection.collectData方式直接调用数据采集接口，参数为[]包围的逗号分隔的业务数据
 * 如[01,12345678,101]，完整的调用示例：
 * DataCollection.collectData([01,12345678,101]);
 * 
 *  */
(function(){
    var isWork = true;       
    var checkInterval = 30000;
    var checkBuffTimer = -1;    
    var writeDataTimer = -1;
    
    var DataCollection = function(){
    	if(checkFunction(SysSetting.sendAppEvent)){
    		midVer = 2;
    	}
    	else{
    		midVer = 1;
    	}    	
    	//just for test
    	//midVer = 1;
    	var networkStr = readJsonFile(networkPath,3);
    	if(networkStr && networkStr.NetworkId){
    		networkId = networkStr.NetworkId;
    	}
        var siConfig = readJsonFile(siConfigPath,3);     
        if(siConfig && siConfig.DataCollection){
            var serverInfo = siConfig.DataCollection;
            if(serverInfo.ServerAddress != ""){
                dataCollectionUrl = "http://" + serverInfo.ServerAddress + ":" + serverInfo.ServerPort + "/DataCollection";
               
            }
            else{
                isWork = false;
            }
        }
        else{
            isWork = false;
        }        
        if((isWork==true) && (midVer == 1)){            
            checkBuffTimer = setInterval("flushBuffer()",checkInterval);
            writeDataTimer = setInterval("writeData2Flash()",checkInterval);
        }           
    };   
    
    DataCollection.prototype.collectData = function(param){
		if (isWork==false) {
			return;
		}
        var clientType = "01";
		var clientId = CA.icNo || "";
		var regionCode = CA.regionCode;
		var createTime = format(new Date(),"yyyy-MM-ddThh:mm:ssZ");
		var baseInfo = clientType + "|" + clientId + "|" + regionCode +"|"+ networkId +"|" + createTime + "^";
		var serviceParam = param.join("^");
		var data = baseInfo + serviceParam+"\r\n";
		sendDataByPost(data,false);
    };
    window.DataCollection = new DataCollection();
})();
