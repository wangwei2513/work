// ��װXMLHttpRequest����
if(typeof XMLHttpRequest == 'undefined')
    XMLHttpRequest = function(){
       		return new ActiveXObject(
            navigator.userAgent.indexOf('MSIE 5') >= 0 ?
            "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
        );    
};


// ��������Ajax�����
function ajax( options ){
    options = {
        // HTTP ��������
        type:        options.type || "GET",
        // ������ļ�����
        dataType:    options.dataType,
        // �����URL
        url:        options.url || "",
		//����ʽ��true�첽����falseͬ������
		requestType: options.requestType === false ? false:true,
        // ����ĳ�ʱʱ��
        timeout:    options.timeout || 7000,
        // ����ɹ�.ʧ�ܻ����(���۳ɹ�ʧ�ܶ������)ʱִ�еĺ���
        onComplete: options.onComplete || function(){},
        onError:    options.onError || function(){},
        onSuccess:    options.onSuccess || function(){},
        // ��������Ĭ�Ϸ��ص���������
        data:        options.data || "",
		post:        options.post || ""
    };

    // �����������
    var xml = new XMLHttpRequest();
    // ��ʼ���첽����
    xml.open(options.type, options.url, options.requestType); 
    // ����5�� �����ʱ�����
    var timeoutLength = options.timeout;

    // ��¼�����Ƿ�ɹ����
    var requestDone = false;

    // ��ʼ��һ��5���ִ�еĻص�����,����ȡ������
    setTimeout(function(){
        requestDone = true;
    }, timeoutLength);

    // �����ĵ�����״̬
    xml.onreadystatechange = function(){
        // ���ֵȴ� ֻ������ȫ������ ��û�г�ʱ
		
		//add("state:"+xml.readyState);
        if(xml.readyState == 4 && !requestDone){
            // ����Ƿ�����ɹ�
            if(httpSuccess(xml)){
                // �Է��������ص�������Ϊ����ִ�гɹ��ص�����
                options.onSuccess( httpData(xml, options.dataType ));
            }else{
                options.onError();
            }

            // ������ɺ�Ļص�����
            options.onComplete();
            // �����ڴ�й¶,�����ĵ�
            xml = null;
        }
    };
    
    // �����������������
	if(options.type=="GET"){
    	xml.send(null);
	}else{
		xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xml.send(options.post);	
	}


    // �ж�HTTP��Ӧ�Ƿ�ɹ�
    function httpSuccess( r ){
        try {
            // ����ò���������״̬,�������������󱾵��ļ�,����Ϊ�ɹ�
            return !r.status && location.protocol == "file:" ||
                    // ����200-300֮���״̬�� ��ʾ�ɹ�
					
                    (r.status >= 200 && r.status <= 300) ||                
                    // �ĵ�δ�޸�Ҳ��ɹ�
                    r.status == 304
                    // Safari���ĵ�δ�޸ĵ�ʱ�򷵻ؿ�״̬
                    navigator.userAgent.indexOf('Safari') >= 0
                        && typeof r.status == "undefined";    
        }catch(e){}
        
        // �����״̬ʧ��,��ٶ�������ʧ�ܵ�
        return false;
    }

    // ��HTTP��Ӧ�н�����ȷ����
    function httpData(r, type){
        // ��ȡcontent-type��ͷ��
        var ct = r.getResponseHeader("content-type");
        // ���û���ṩĬ������, �жϷ��������ص��Ƿ���XML��ʽ
        var data = "";
		// �����XML����XML���� ���򷵻��ı�����
		if (ct.indexOf('xml')>= 0){
        	data = r.responseXML	
		}else if(ct.indexOf('application/json')>= 0){
			data = r.responseText;
		}else {
			data = r.responseText;
		}
        // ���ָ��������script,����javascript��ʽִ�з����ı�
        if(type == "script"){
            eval.call(window, data);
        }
        // ������Ӧ����
        return data;
    }
}

// ���ݴ��л� ֧�����ֲ�ͬ�Ķ���
// - ������Ԫ�ص�����
// - ��/ ֵ ��Ӧ��ɢ�б�
// - ���ش��л�����ַ��� ��ʽ: name=john& password=test

function serialize(a) {
    // ���л�������
    var s = [];
    // �����������ʽ [{name: XX, value: XX}, {name: XX, value: XX}]
    if(a.constructor == Array){
        // ���л���Ԫ��
        for(var i = 0; i < a.length; i++){
            s.push(a[i].name + "=" + encodeURIComponent( a[i].value ));
        }
        // �ٶ��Ǽ�/ֵ����
    }else{
        for( var j in a ){
            s.push( j + "=" + encodeURIComponent( a[j] ));
        }
    }
    // ���ش��л����
    return s.join("&");
}