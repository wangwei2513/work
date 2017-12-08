	function showList(__listSize, __dataSize, __position, __startplace, __f){
		this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
		this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //�б���ʾ�ĳ��ȣ�
		this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //�������ݵĳ��ȣ�
		this.position = typeof(__position)=="undefined" ? 0 : __position;  //��ǰ���ݽ����λ�ã�
		this.focusPos = 0;      //��ǰ�б����λ�ã�
		this.lastPosition = 0;  //ǰһ�����ݽ����λ�ã�
		this.lastFocusPos = 0;  //ǰһ���б����λ�ã�
		this.tempSize = 0;  //ʵ����ʾ�ĳ��ȣ�
		this.infinite = 0; //��¼��ֵ��������ȡ���ݽ����λ�ã�
		
		this.pageStyle  = 0;  //��ҳʱ����Ķ�λ��0��ʾ���䣬1��ʾ�Ƶ��б��ײ���
		this.pageLoop   = null;  //�Ƿ�ѭ����ҳ, true��ʾ�ǣ�false��ʾ��
		this.showLoop   = null;  //�Ƿ�ѭ����ʾ����,this.showLoop�������Ϊtrue,���Զ��򿪽�����βѭ����ѭ����ҳ��
		this.focusLoop  = null;  //�����Ƿ���βѭ���л���
		this.focusFixed = null;  //�����Ƿ�̶���this.focusFixed�������Ϊtrue,���Զ���ѭ����ʾ���ݣ�
		this.focusVary  = 1;  //�����㷢���ı�ʱ�����ǰ�󽹵��ľ���ֵ���ڴ�ֵʱ�������ٸ���this.focusStyle��ֵ�����ִ�����ֵ�������0������Ĭ��Ϊ1��
		this.focusStyle = 0;  //�л�����ʱ���б���ı�����ʽ��0��������1��ʾ������
		
		this.showType = 1; //���ֵ����ͣ�0��ʾ�ϵĳ��ַ�ʽ��1��ʾ�µĹ������ַ�ʽ��	
		this.listSign = 0; //0��ʾtop���ԣ�1��ʾleft����, Ҳ����ֱ����"top"��"left"��
		this.listHigh = 30;  //�б���ÿ���еĸ߶ȣ����������ݻ������飬���磺40 �� [40,41,41,40,42];
		this.listPage = 1;  //�б����ҳ������
		this.currPage = 1;  //��ǰ��������ҳ����
		
		this.listReverse = 1;
		
		this.focusDiv = -1;  //�б����ID���ƻ��߶���Ϊ�����������磺"focusDiv" �� new showSlip("focusDiv",0,3,40);
		this.focusPlace = new Array();  //��¼ÿ���б����λ��ֵ��
		this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;	 //�б���Div��ʼλ�õ�ֵ��
		
		this.haveData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
		this.notData = function(){}; //����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷�����
		//���������������������յ�����Ϊ{idPos:Num, dataPos:Num}�Ķ��󣬸ö�������idPosΪ�б����ֵ������dataPosΪ���ݽ����ֵ��
		
		this.focusUp  = function(){
			if(this.listReverse == 1){
				this.changeList(-1);
			}else{
				this.changeList(1);
			}
		}; //���������ƶ���
		this.focusDown= function(){
			iDebug("this.listReverse="+this.listReverse);
			if(this.listReverse == 1){
				this.changeList(1); 
			}else{
				this.changeList(-1); 
			}
		}; //���������ƶ���
		this.pageUp   = function(){this.changePage(-1);}; //�б�����۶ҳ��
		this.pageDown = function(){this.changePage(1); }; //�б�����۶ҳ��
		
		//��ʼ��ʾ�б���Ϣ
		this.startShow = function(){
			this.initAttrib();
			this.setFocus();
			this.showList();
		}
		//��ʼ���������ԣ�
		this.initAttrib = function(){	
			if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";  //����ֵת�����ַ�����
			if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;  //���û�������ķ���ֵ;
					
			if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;  //��ʼ�������Ƿ�̶�������û�û�ж��壬��Ĭ��Ϊfalse�������ǰshowType��0����ô���ù̶�����Ч�ģ�
			if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;  //��ʼ���Ƿ�ѭ����ʾ���ݣ�����û�û�ж��岢�ҽ���Ϊ�̶����ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע����ǽ���Ϊ�̶�ʱ����Ҫǿ�ƶ���Ϊfalse;
			if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;	//��ʼ���Ƿ�ѭ����ҳ������û�û�ж��岢��ѭ����ʾ���ݣ��ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע�����ѭ����ʾ����ʱ����Ҫǿ�ƶ���Ϊfalse;
			if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;   //��ʼ�������Ƿ���βѭ���л�������û�û�ж��岢��ѭ����ʾ���ݣ��ͻ��Զ���Ϊtrue������Ϊfalse, ��Ҫע�����ѭ����ʾ����ʱ����Ҫǿ�ƶ���Ϊfalse;
			if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;   //������㲻�̶����������ݳ���С���б���ʾ���ȣ���ǿ������ѭ����ʾ����Ϊ��
			
			if(this.focusVary<1) this.focusVary = 1;
			if(this.focusPos>=this.listSize) this.focusPos = this.listSize-1;
			if(this.focusPos<0) this.focusPos = 0;
			if(this.position>=this.dataSize) this.position = this.dataSize-1;
			if(this.position<0) this.position = 0;
			this.lastPosition = this.infinite = this.position;
			
			this.initPlace();
			this.initFocus();
			this.lastFocusPos = this.focusPos;
		}
		//��ʼ������λ�ã�
		this.initFocus = function(){
			this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
			if(this.showType == 0){  //��ǰshowTypeΪ0ʱ���û������б�������Ч�ģ�����ͨ�����ݽ�������ȡ��
				this.focusPos = this.position%this.listSize;
			}else if(!this.focusFixed&&!this.showLoop){  //��ǰshowTypeΪ1�����㲻�̶����Ҳ�ѭ����ʾ����ʱ���жϵ�ǰ�û�������б����Ƿ񳬳���Χ������������¶��壻
				var tempNum = this.position-this.focusPos;
				if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
			}
		}
		//����ÿ��(��)���ڵ�λ�ã��������������
		this.initPlace = function(){
			var tmph = this.listHigh;
			var tmpp = [this.startPlace];		
			for(var i=1; i<this.listSize; i++){
				//tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
				tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : (this.listReverse)*tmph*i+tmpp[0];
			}
			this.focusPlace = tmpp;
		}
		//�л������λ��
		this.changeList = function(__num){
			if(this.dataSize==0) return;
			if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) { return false; }
			this.changePosition(__num);
			this.checkFocusPos(__num);
		}
		//�л����ݽ����ֵ
		this.changePosition = function(__num){
			this.infinite += __num;
			this.lastPosition = this.position;	
			this.position = this.getPos(this.infinite, this.dataSize);
		}
		//�����б��㲢ˢ���б�
		this.checkFocusPos = function(__num){
			if(this.showType==0){	
				var tempNum  = this.showLoop ? this.infinite : this.position;
				var tempPage = Math.ceil((tempNum+1)/this.listSize);
				this.changeFocus(this.getPos(tempNum, this.listSize)-this.focusPos);
				if(this.currPage!=tempPage){ this.currPage = tempPage;this.showList(); }		
			}else{
				if((this.lastPosition+__num<0||this.lastPosition+__num>this.dataSize-1)&&!this.showLoop&&!this.focusFixed){
					this.changeFocus(__num*(this.tempSize-1)*-1);
					this.showList();
					return;
				}
				if(this.focusPos+__num<0||this.focusPos+__num>this.listSize-1||this.focusFixed){				
					this.showList();
					//getRecommend();
				}else{
					this.changeFocus(__num);
					//getRecommend();	
				}
			}		
		}
		//�л��б����λ��
		this.changeFocus = function(__num){
			this.lastFocusPos = this.focusPos;
			this.focusPos += __num;
			this.setFocus(__num);
		}
		//���õ�����ǰ�����λ�ã�
		this.setFocus = function(__num){
			if(typeof(this.focusDiv)=="number") return;  //���û���役��DIV���򲻽������ò�����
			var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));  //�����㷢���ı�ʱ������ǰ�󽹵��ľ���ֵ��focusStyle��ֵ�жϽ������Ч����
			if(typeof(this.focusDiv)=="string"){  //ֱ�����ý���λ�ã�
				this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
			}else if(typeof(__num)=="undefined"||tempBool){  //ֱ�Ӷ�λ���㣻
				this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
			}else if(__num!=0){  //�������㣻
				this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
			}
		}	
		//�л�ҳ���б�ҳ
		this.changePage = function(__num){	
			if(this.dataSize==0) return;
			var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;  //�жϵ�ǰ�Ƿ���ҳ��תβҳ��βҳ��ת��ҳ;
			if(this.showLoop){   //���������ѭ����ʾ����ִ������ķ�ҳ���룻
				if(isBeginOrEnd&&!this.pageLoop) return;
				var tempNum = this.listSize*__num;
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
					this.changePosition(this.focusPos*-1);
					this.checkFocusPos(this.focusPos*-1);
				}
				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				if(this.dataSize<=this.listSize) return;  //������ݳ���С��������б���ʾ���ȣ��򲻽��з�ҳ��
				if(this.showType==0){
					if(isBeginOrEnd&&!this.pageLoop) return;   //�������ҳ��תβҳ��βҳ��ת��ҳ, this.pageLoopΪ���򲻽��з�ҳ��
					var endPageNum = this.dataSize%this.listSize;  //��ȡβҳ����;
					var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;  //�ж�Ŀ��ҳ�Ƿ�Ϊβҳ;
					var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;	  //�ж�Ŀ��ҳ�Ƿ�Ϊβҳ������ǲ��ҵ�ǰ�б�����ڻ����βҳ���������ȡ����֮��Ĳ		
					var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize;  //�жϵ�ǰ�Ƿ���ҳ��תβҳ��βҳ��ת��ҳ������ǲ���βҳС��this.listSize�����ȡ��ǰҳ������Ŀ��ҳ����Ĳ�ֵ������ΪĬ��ҳ����ʾ������
					overNum = this.pageStyle==0 ? overNum : this.focusPos;  //�жϵ�ǰ��ҳʱ�����style, 0��ʾ���䣬1��ʾ�Ƶ��б��ײ���
					tempNum = tempNum*__num-overNum;				
					this.changePosition(tempNum);
					this.checkFocusPos(tempNum);
				}else{
					var tempPos   = this.position-this.focusPos;  //��ȡ��ǰҳ�б��ײ������ݽ��㣻
					var tempFirst = this.dataSize-this.tempSize;  //��ȡβҳ��һ�����ݽ����λ�ã�
					if(tempPos+__num<0||tempPos+__num>tempFirst){
						if(!this.pageLoop) return;  //��ѭ����ҳʱ�����������ȡ��ҳ������ݽ���;
						tempPos = __num<0 ? tempFirst : 0;
					}else{
						tempPos += this.tempSize*__num;
						if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
					}		
					var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;  //�жϵ�ǰ��ҳʱ�����style, ȡ���б���λ�ã�
					if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);  //���this.focusPos��Ϊ0�����ƶ��б��㵽�б��ײ���
					this.changePosition(tempPos-this.position+tempNum); 
					this.showList();
				}
			}
		}
		//��ʾ�б���Ϣ
		this.showList = function(){
			var tempPos = this.position-this.focusPos;	 //��ȡ��ǰҳ�б��ײ������ݽ��㣻
			for(var i=tempPos; i<tempPos+this.listSize; i++){		
				var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };  //����һ���������õ�ǰ�б�������ݽ���ֵ��
				( i >= 0 && i < this.dataSize)||(this.showLoop && this.dataSize !=0 ) ? this.haveData(tempObj) : this.notData(tempObj);  //��i��ֵ��this.dataSize�ķ�Χ�ڻ�����ѭ����ʾʱ��������ʾ���ݵĺ����������������ĺ�����
			}
			this.currPage = Math.ceil((this.position+1)/this.listSize);
			this.listPage = Math.ceil(this.dataSize/this.listSize);
		}
		//����б���Ϣ
		this.clearList = function(){
			for(var i=0; i<this.listSize; i++) this.notData( { idPos:i, dataPos:this.getPos(i, this.dataSize) } );
		}
		this.getPos = function(__num, __size){
			return __size==0 ? 0 : (__num%__size+__size)%__size;
		}
		this.$ = function(__id){
			return this.currWindow.document.getElementById(__id);
		}
	}
	function AjaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
	    this.url = _url || "";
	    this.successCallback = _successCallback || function(_xmlHttp, _params) {};
	    this.failureCallback = _failureCallback || function(_xmlHttp, _params) {};
	    this.urlParameters = _urlParameters || "";
	    this.callbackParams = _callbackParams || null;
	    this.async = typeof(_async) == "undefined" ? true : _async;
	    this.charset = _charset || null;
	    this.timeout = _timeout || 8000;
	    this.frequency = _frequency || 500;
	    this.requestTimes = _requestTimes || 0;//请求失败后自动再次请求的次数，默认不自动再次请求
	    this.frame = _frame || window;

	    this.timer = -1;
	    this.counter = 0;

	    this.method = "GET";
	    this.headers = null;
	    this.username = "";
	    this.password = "";
	    this.abortFlag = false;	//是否调用了abort接口，茁壮浏览器在调用abort后触发onreadystatechange，发送readyState为4，改变量是为了标示当前是中止导致发的4还是正常请求发的4

	    this.createXmlHttpRequest = function() {
	        var xmlHttp = null;
	        try { //Standard
	            xmlHttp = new XMLHttpRequest();
	        } catch (exception) { //Internet Explorer
	            try {
	                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (exception) {
	                try {
	                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	                } catch (exception) {
	                    return false;
	                }
	            }
	        }
	        return xmlHttp;
	    };
	    this.xmlHttp = this.createXmlHttpRequest();

	    this.requestData = function(_method, _headers, _username, _password) {
	        this.frame.clearTimeout(this.timer);
	        this.abortFlag = false;
	        this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
	        this.headers = typeof(_headers) == "undefined" ? null : _headers;
	        this.username = typeof(_username) == "undefined" ? "" : _username;
	        this.password = typeof(_password) == "undefined" ? "" : _password;
	        var target = this;
	        var url;
	        var data;
	        this.xmlHttp.onreadystatechange = function() {
	            target.stateChanged();
	        };
	        if (this.method == "POST") {
	            url = encodeURI(this.url);
	            data = this.urlParameters;
	        } else {
	            url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
	            data = null;
	        }
	        if (this.username != "") {
	            this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
	        } else {
	            this.xmlHttp.open(this.method, url, this.async);
	        }
	        var contentType = false;
	        if (this.headers != null) {
	            for (var key in this.headers) {
	                if (key.toLowerCase() == "content-type") {
	                    contentType = true;
	                }
	                this.xmlHttp.setRequestHeader(key, this.headers[key]);
	            }
	        }
	        if (!contentType) {
	            //this.xmlHttp.setRequestHeader("Content-type","application/xml");
	            //this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
	            this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	        }
	        if (this.charset != null) { //要使用responseXML就不能设置此属性
	            this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
	        }
	        this.xmlHttp.send(data);
	    };
	    this.stateChanged = function() { //状态处理
	        if (this.xmlHttp.readyState < 2) {
	            //iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ",this.url=" + this.url);
	        } else {
	            //iDebug(">>>smile common.js Ajax [xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + ",this.abortFlag=" + this.abortFlag + ",this.url=" + this.url);
	        }

	        var target = this;
	        if (this.xmlHttp.readyState == 1) {
	            this.timer = this.frame.setTimeout(function() {
	                target.checkStatus();
	            }, this.timeout);
	        }else if (this.xmlHttp.readyState == 4) {
	            this.frame.clearTimeout(this.timer);
	            if(this.abortFlag) return;	//如果是因为中止导致发的4，则不继续触发成功或者失败函数
	            if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204 || this.xmlHttp.status == 0){
	                //本地测试加上|| this.xmlHttp.status == 0;
	                this.success();
	            } else {
	                this.failed();
	            }
	        }
	    };
	    this.success = function() {
	        if (this.callbackParams == null) {
	            this.successCallback(this.xmlHttp);
	        } else {
	            this.successCallback(this.xmlHttp, this.callbackParams);
	        }
	        this.counter = 0;
	    };
	    this.failed = function() {
	        if (this.callbackParams == null) {
	            this.failureCallback(this.xmlHttp);
	        } else {
	            this.failureCallback(this.xmlHttp, this.callbackParams);
	        }
	        this.counter = 0;
	    };
	    this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
	        if (this.xmlHttp.readyState != 4) {
	            if (this.counter < this.requestTimes) {
	                this.requestAgain();
	            } else {
	                this.failed();
	                this.requestAbort();
	            }
	        }
	    };
	    this.requestAgain = function() {
	        this.requestAbort();
	        var target = this;
	        this.frame.clearTimeout(this.timer);
	        this.timer = this.frame.setTimeout(function() {
	            target.counter++;
	            target.requestData(target.method, target.headers, target.username, target.password);
	        }, this.frequency);
	    };
	    this.requestAbort = function() {
	        this.frame.clearTimeout(this.timer);
	        this.abortFlag = true;
	        this.xmlHttp.onreadystatechange = function() {
	            //abort会触发一个失败的状态，这里将这个置空，避免异常
	        };
	        this.xmlHttp.abort();
	    };
	    this.addParameter = function(_json) {
	        var url = this.url;
	        var str = this.urlParameters;
	        for (var key in _json) {
	            if (url.indexOf("?") != -1) {
	                url = "";
	                if (str == "") {
	                    str = "&" + key + "=" + _json[key];
	                } else {
	                    str += "&" + key + "=" + _json[key];
	                }
	                continue;
	            }
	            if (str == "") {
	                str += "?";
	            } else {
	                str += "&";
	            }
	            str += key + "=" + _json[key];
	        }
	        this.urlParameters = str;
	        return str;
	    };
	    this.getResponseXML = function() {
	        if (this.xmlHttp.responseXML != null) {
	            return this.xmlHttp.responseXML;
	        } else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
	            return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
	        }
	        return null;
	    };
	}
	var IPANEL30 = checkIPANEL30();
    function checkIPANEL30(){
        var userAgent = navigator.userAgent.toLowerCase();
        var flag = false;   
        if(userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1){//ipanel3.0
            flag = true;
        }
        return flag;
    }
    var mySessionStorage = new globalVar();
    function globalVar(){
        this.getItem = function(sName){
            var result = null;
			try {
				if(typeof GlobalVarManager != "undefined") {
					result = GlobalVarManager.getItemValue(sName);
					if(!isValid(result)) {
						result = GlobalVarManager.getItemStr(sName);
					}
				} else if(typeof iPanel != "undefined") {
					result = iPanel.getGlobalVar(sName);
				} else if(typeof Utility != "undefined"){
					result = Utility.getEnv(sName)
				} else {
					result = sessionStorage.getItem(sName);
				}
			} catch(e) {
				var aCookie = document.cookie.split("; ");
				for (var i = 0,num=aCookie.length; i < num; i++) {
					var aCrumb = aCookie[i].split("=");
					if(escape(sName) == aCrumb[0]) {
						result = unescape(aCrumb[1]);
						break;
					}
				}
			}
			return result;
        };
        this.removeItem = function(sName){
            try {
				if(typeof(GlobalVarManager) != "undefined") {
					GlobalVarManager.removeItem(sName);
				} else if(typeof iPanel != "undefined") {
					iPanel.delGlobalVar(sName);
				} else if(typeof Utility != "undefined"){//同洲
					Utility.setEnv(sName,"");
				} else {
					sessionStorage.removeItem(sName);
				}
			} catch(e) {
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval = getGlobalVar(sName);
				document.cookie = sName + "=" + cval + "; expires=" + exp.toGMTString();
			}
        }
        this.setItem = function(sName, sValue){
            try {
				if(typeof GlobalVarManager != "undefined") {
					if(typeof sValue == "string") {
						GlobalVarManager.setItemStr(sName,sValue);
					} else {
						GlobalVarManager.setItemValue(sName, sValue);
					}
				} else if(typeof iPanel != "undefined") {
					iPanel.setGlobalVar(sName, sValue);
				} else if(typeof Utility != "undefined"){//同洲
					Utility.setEnv(sName, sValue);
				} else {
					sessionStorage.setItem(sName, sValue);
				}
			} catch(e) {
				document.cookie = escape(sName) + "=" + escape(sValue);
			}
        }
    }
    function getStrLen(_str) {
		var len=0;
		for (var i = 0;i < _str.length;i++) {
			if(_str.charCodeAt(i) > 255){
				len += 2;
			} else len++;
		}
		return len;
    }
	function imgList_w(_data, _imgSize, _position, _startplace, _pre){
		this.preload 	= 1;//开启图片预加载功能
		this.preloadTime=1000;//预加载延迟时间
	 	this.imgStart 	= 0;//img标签id的下标
		this.focusDiv 	= -1;//焦点div
		this.imgDom 	= [];//dom缓存
		this.imgLoop	= 1;//是否循环显示图片
		this.imgHeight 	= 150;//焦点位置梯度，可以传数组
		this.changeType = 1;//焦点平滑移动方式
		this.imgSign 	= 1;//0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
		this.d 			= 70;//焦点滚动时缓动函数参数d
		this.moveTime 	= 5;//焦点滚动时焦点滑动interval参数
		this.moveFn 	= "easeOut";//焦点平滑滚动缓动函数 easeIn、easeOut、 easeInOut
		this.imgArr 	= _data || [];//操作图片数组
		this.pre 		= _pre || "img_";//dom里边img标签id的前缀
		this.startplace = _startplace || 0;//焦点开始绝对位置
		this.preLen 	= typeof _imgSize !== "undefined" ? parseInt(_imgSize[0]):0;//前预览图片数量
		this.midLen 	= typeof _imgSize !== "undefined" ? parseInt(_imgSize[1]):0;//中图片数量
		this.aftLen 	= typeof _imgSize !== "undefined" ? parseInt(_imgSize[2]):0;//后预览图片数量
		this.focusPos 	= typeof _position === "object"  ? _position[1] : _position||0;
		this.changeCallBack = function(){};
		this.setContent = function(){};
		this.startShow = function(){
			if(this.imgArr.length===0) return;
			this.focusPos = this.focusPos>this.preLen+this.midLen-1?this.preLen+this.midLen-1:this.focusPos<this.preLen-1?this.preLen-1:this.focusPos;
			this.imgLen = this.preLen + this.midLen + this.aftLen;
			this.appendImg = [];
			this.focusPlace = this.startplace+this.focusPos*this.imgHeight;
			this.startAppendPos = typeof __position==="object" && __position[0]>this.imgLen? __position[0]-this.focusPos : 0;
			this.position = this.startAppendPos+this.focusPos;
			this.lastPosition = this.position;
			this.lastFocusPos = this.focusPos;
			this.posIsArr = "[object Array]"===Object.prototype.toString.call(this.imgHeight);
			this.changeType = this.changeType==1||this.changeType.toString().toLowerCase()==="scroll"?1:0;
			this.imgSign= parseInt(this.imgSign)===1||this.imgSign.toString().toLowerCase()==="left"?1:0;
			this.initDom();
			this.initImg();
			var pos = this.posIsArr?this.imgHeight[this.focusPos]:this.imgHeight*this.focusPos+this.startplace;
			if(this.imgSign===1 && !!this.focusDiv) this.focusDiv.style.left =  pos + "px";
			else if(!!this.focusDiv) this.focusDiv.style.top = pos + "px";
		};
		this.showFocus = function(){
			if(this.changeType === 1) {
				var s=this,ag =s.posIsArr,h=s.imgHeight,p=s.focusPos,f=s.tmplastfocuspos,e=ag?h[p]-h[f]:(p-f)*h,o=new s.fn(s.moveFn),i=0,c=Math.abs(e),a=0,d=s.d,tm=s.focusPlace||h[f]||0,l=s.focusDiv.style,r;
	            clearInterval(s.intval);
	            s.focusPlace += e;
	            s.intval = setInterval(function(){
	                if(a < c || e == 0) {
	                    i++; a = parseInt(o(i,0,c*1.02,d));a = a > c ? c : a;r = tm + (e > 0 ? a : -a);
	                    if(s.imgSign) l.left = r + "px"; else l.top = r + "px";
	                    if(a === c)clearInterval(s.intval);
	                }
	            },s.moveTime);
			} else {
				var pos = this.posIsArr?this.imgHeight[this.focusPos]:this.imgHeight*this.focusPos+this.startplace;
				if(this.imgSign===1) this.focusDiv.style.left =  pos + "px";
				else this.focusDiv.style.top = pos + "px";
			}
		};
		this.initImg = function(){
			this.appendImg = [];
			var len1 = this.imgLen+this.startAppendPos<this.imgArr.length?this.imgLen:(this.imgArr.length-this.startAppendPos),
				len2 = this.imgLen - len1,self=this,tmp;
			for (var i = 0;i < len1;i++)this.appendImg.push(this.imgArr[this.startAppendPos+i]);
			for (var i = 0;i < len2;i++)this.appendImg.push(this.imgArr[i]);
			for (var i = 0;i < this.appendImg.length;i++) {
				tmp = this.appendImg[i]&&this.appendImg[i].src||this.appendImg[i]||"",dpos=this.startAppendPos+i>=this.imgArr.length?i+this.startAppendPos-this.imgArr.length:this.startAppendPos+i;
				if(!!this.imgDom[i]) this.imgDom[i].src = tmp;
				this.setContent({idPos:i,dataPos:dpos},tmp);
			}
			tmp = typeof this.appendImg[this.focusPos]==="object"?this.appendImg[this.focusPos].src:this.appendImg[this.focusPos];
			this.changeCallBack(tmp,this.position,this.focusPos,this.lastPosition,this.lastFocusPos);
			if(!!this.preload) setTimeout(function(){self.preloadImg(self.imgArr)},this.preloadTime);
		};
		this.changeFocus = function(_num){
			var len = this.imgArr.length-this.imgLen,tmp=0,postmp,foctmp;
			postmp = this.position;
			this.lastStartAppendPos = this.startAppendPos;
			this.position += _num;
			this.position=this.position>this.imgArr.length-1?!!this.imgLoop?0:this.imgArr.length-1:this.position<0?!!this.imgLoop?this.imgArr.length-1:0:this.position;
			if(postmp!==this.position) this.lastPosition = postmp;
			tmp = !!this.imgLoop?this.focusPos<=this.preLen&&_num<0||_num>0&&this.focusPos>=this.preLen+this.midLen-1?_num:0:this.position<this.startAppendPos+this.preLen?-1:this.position>this.startAppendPos+this.preLen+this.midLen-1?1:0;
			if(tmp!== 0) {
				this.startAppendPos += tmp;
				this.startAppendPos=this.startAppendPos<0?(!!this.imgLoop?this.imgArr.length-1:0):this.startAppendPos>len?(!!this.imgLoop?(this.startAppendPos>this.imgArr.length-1?0:this.startAppendPos):len):this.startAppendPos;
				this.initImg();
			}
			tmp = !!this.imgLoop?this.focusPos>=this.preLen&&this.focusPos<=(this.preLen+this.midLen)?_num:0:_num<0&&this.focusPos>this.preLen?-1:_num>0&&this.focusPos<this.preLen+this.midLen-1?1:this.position+this.aftLen>this.imgArr.length-1?1:this.position<this.preLen?-1:0;
			postmp = this.focusPos,this.tmplastfocuspos=this.focusPos;
			this.focusPos += tmp;
			foctmp = !!this.imgLoop?[this.preLen,this.preLen+this.midLen-1]:[0,this.imgLen-1];
			this.focusPos = this.focusPos<=foctmp[0]?foctmp[0]:this.focusPos>=foctmp[1]?foctmp[1]:this.focusPos;
			if(postmp!==this.focusPos) {
				this.lastFocusPos = postmp;
				this.showFocus();
				var tmp = this.appendImg[this.focusPos],  src = typeof tmp==="object"?tmp.src:tmp;
				this.changeCallBack(src,this.position,this.focusPos,this.lastPosition,this.lastFocusPos);
			}
		};
		this.initDom = function(){
			if(this.imgDom.length == 0) for (var i = this.imgStart;i < this.imgLen+this.imgStart;i++) this.imgDom.push(this.$(this.pre+i));
			this.focusDiv = this.$(this.focusDiv);
		};
		this.preloadImg = function(){
			if(this.imgArr.length === 0) return ;
			var self = this,
				imgLoad = function(i){
					if(self.imgArr.length-1<=i) return ;
					if(typeof self.imgArr[i] == "object") {
						imgLoad(++i);
						return ;
					}
					var img = new Image();
					img.src = self.imgArr[i];
					img.addEventListener("load",function(){
						self.imgArr[i] = img;
						imgLoad(++i);
					img.onerror = function(){imgLoad(++i);};
					},false);
				};
			imgLoad(0);
		};
		this.$ = function(id){return document.getElementById(id)}
		this.fn = function(_type){
	            var Fn =  {
	                easeInOut : function(t,b,c,d,a,p){ if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;  return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;},
	                easeOut : function(t,b,c,d){return (t==d) ? b+c : c * (-Math.pow(2, -10 * t /d) + 1) + b;},
	                easeIn: function(t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;},
	                none : function(t,b,c,d){return c;},
	            };
	            return  Fn[_type];
	         }
	}
	function scroll_w(_tag,_par,_stept) {
        this.stept      = parseInt(_stept) || 0;
        this.padding    = 0;//上下翻页时保存的上下页页面
        this.pHeight    = 0;
        this.moveType   = "top";
        this.moveFn     = "none";
        this.height     = 0;
        this.type       = "page";
        this.moveTime   = 20;
        this.currPage   = 1;
        this.loop       = !1;//是否循环
        this.d          = 20;//缓动函数参数d
        this.setPageTime= 200;
        this.currDiv    = "currPage";
        this.allDiv     = "allPage";
        this.start      = 0;
        this.lastPage   = 0;
        this.pageObj = {page:0};
        this.start = function(){
            this.tag = this.$(this.tag || _tag || "content");
            this.par = this.$(this.par || _par || "contentPad");
            this.currTag = this.$(this.currDiv);
            this.allTag = this.$(this.allDiv);
            if(!!!this.par || !!!this.tag) return ;
            if(this.moveType == "margin") this.tag.style.position = "relative";
            else this.tag.style.position = "absolute";
            if(this.pHeight===0) this.pHeight =  (this.type === "half" ? 0.5 : 1) * this.par.offsetHeight - this.padding * 2;
            this.stept = this.stept === 0 ? this.pHeight : this.stept;
            this.height = this.tag.offsetHeight;
            this.allPage = Math.ceil(this.height /(this.stept));
            var self = this;
        	this.setPage(this.currPage,this.allPage);
        	setInterval(function(){
                var tmp = self.tag.offsetHeight;
                if(tmp === self.height && tmp !== 0) return;
                self.height = tmp;
                self.allPage = Math.ceil(self.height /(self.stept));
                self.setPage(self.currPage,self.allPage);
            }, self.setPageTime);
        };
        this.setPage = function(){
    		if(this.currTag) {
        		this.currTag.innerHTML = this.currPage;
        	}
        	if(this.allTag) {
        		this.allTag.innerHTML = this.allPage;
        	}
        };
        this.pageDown = function(){this.scroll(1);}
        this.pageUp = function(){this.scroll(-1);}
        this.move = function () {
            var s=this,e=(s.currPage-s.lastPage)*s.stept-s.padding*2,o=new s.speed(s.moveFn),i=0,c=Math.abs(e),a=0;
            clearInterval(s.intval);
            s.intval = setInterval(function(){
                if(a < c || e == 0) {
                    i++;
                    a = parseInt(o(i,0,c*1.01,s.d));
                    a = a > c ? c : a;
                    var r = (s.lastPage - 1)*s.pHeight + (e > 0 ? a : -a);
                    if(s.moveType === "margin") s.tag.style.marginTop = -r+"px";
                    else s.tag.style.top = -r + "px";
                    if(a === c) clearInterval(s.intval);
                }
            },s.moveTime);
        }
        this.scroll = function(_num) {
            this.lastPage = this.currPage;
            if(this.currPage === this.allPage  && _num === 1) {this.currPage = !!this.loop === true ? 1 : this.allPage ;
            }else if(this.currPage === 1 && _num === -1) {this.currPage = !!this.loop === true ? this.allPage -1 : 1;
            }else{this.currPage += _num;}
            this.currPage = _num !== 1 && _num !== -1 ? _num : this.currPage;
            this.move();
            this.setPage(this.currPage,this.allPage);
        }
        //缓动函数
        this.speed = function(_type){
            var Fn =  {
                easeInOut : function(t,b,c,d,a,p){
                       if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;  
                       return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;},
                easeOut : function(t,b,c,d){return (t==d) ? b+c : c * (-Math.pow(2, -10 * t /d) + 1) + b;},
                easeIn: function(t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;},
                none : function(t,b,c,d){return c;}, 
            };
            return  Fn[_type];
         }
         this.$ = function(_id){return document.getElementById(_id)};
    }
    function scrollImage_w(_par,_imgArr) {
        this.par = typeof _par === "string" ? document.getElementById(_par) : _par;
        this.imgArr = _imgArr;
        this.type = 0;//0和1、分别为左和上,也可用left和top表示
        this.moveFn = "easeOut";
        this.timer = 4000;//自动播放下一张图时间间隔
        this.intTime = 5;//切图时时间间隔
        this.scrollId = "";//父标签内最外层div的id
        this.d = 500;//缓动函数d
        this.createDom = function(){
            var str = "",dw = ["width","height"][this.type];
            for (var i = 0,len = this.imgArr.length;i < len;i++) {
                str += "<div style=\"display:list-item;float:"+this.float+";width:"+this.imgWidth+"px;height:"+this.imgHeight+
                "px;\"><img src=\""+this.imgArr[i]+"\" width=100% height=100%/></div>";
            }
            this.par.innerHTML += "<div id=\""+this.scrollId+"\" style=\""+dw+":"+(this.imgArr.length*parseInt(this.parStyle.width))+"px;\">"+str+"</div>";
        };
        this.initAttrib = function(){
            var self = this;
            this.$ = function(_id){return document.getElementById(_id)}
            this.g = function(_tag){return getComputedStyle(typeof _tag =="object"?_tag:self.$(_tag))}
            this.type = this.type == 1 || this.type == 0 ? this.type : ["left","top"].indexOf(this.type);
            this.calS = ["marginLeft","marginTop"][this.type];
            this.parStyle = this.g(this.par);
            this.par.style.overflow = "hidden";
            this.pos = 0;
            this.last = -1;
            this.end = this.imgArr.length;
            this.float = ["left","none"][this.type];
            this.imgWidth  = this.imgWidth  || parseInt(this.parStyle.width)
            this.imgHeight = this.imgHeight || parseInt(this.parStyle.height);
            this.createId();
            this.createDom();
            this.moveTag = this.$(this.scrollId);
            this.moveTag.style.listStyle = "none";
        };
        this.createId = function(){
            if(this.scrollId != "") return ;
            var str = ",A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",sp = str.split(","),str = "";
            for (var i = 0;i < 20;i++) {str += sp[parseInt(Math.random()*26)];}
            this.scrollId = str;
        }
        this.startMove = function(t){
            t.last = t.pos;
            if(t.pos === t.end-1) t.pos = 0;
            else t.pos++;
            var a=0,i=0,o=new t.speed(t.moveFn),s=parseInt(t.g($(t.scrollId))[t.calS]),e=t.pos*parseInt([t.imgWidth,t.imgHeight][t.type])+s,ae=Math.abs(e);
            var interval = setInterval(function(){
                if(a < ae) {
                    var ea = parseInt(o(0,i,0,ae*1.01,t.d/2));
                    a = ea > ae ? ae : ea;
                    var r = -s - (e > 0 ? -a : a);
                    t.moveTag.style[t.calS] = -r +"px";
                    i++;
                    if(a === Math.abs(e)) clearInterval(interval);
                }
            },t.intTime);
        };
        this.start = function(){
            var self = this;
            self.initAttrib();
            if(self.end <= 1) return ;
            self.abort();
            self.interval = setInterval(function(){self.startMove(self);},self.timer);
        };
        this.abort = function(){clearInterval(this.interval);}
        this.move = function(){var self = this;self.interval = setInterval(function(){self.startMove(self);},self.timer);};
        this.speed = function(_type){
            var Fn =  {
                easeInOut : function (x, t, b, c, d) {if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2,10 * (t - 1)) + b;return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;},
                easeOut : function (x, t, b, c, d) {return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;},
                easeIn: function (x, t, b, c, d) {return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;},
                none : function(t,b,c,d){return c;},
            };
            return  Fn[_type];
         }
    }
    function getUrlParams(_key, _url, _spliter) {
		if (typeof(_url) == "object") {
			var url = _url.location.href;
		} else {
			var url = _url ? _url : window.location.href;
		}
		if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
			return "";
		}
		var spliter = _spliter || "&";
		var spliter_1 = "#";
		var haveQuery = false;
		var x_0 = url.indexOf(spliter);
		var x_1 = url.indexOf(spliter_1);
		var urlParams;
		if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
			if(url.indexOf("?") != -1) urlParams = url.split("?")[1];
			else if(url.indexOf("#") != -1) urlParams = url.split("#")[1];
			else urlParams = url.split(spliter)[1];
			if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//���ܳ��� url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2�������
				var v = [];
				if(urlParams.indexOf(spliter_1) != -1){
					v = urlParams.split(spliter_1);
					urlParams = [];
					for(var x = 0; x < v.length; x++){
						urlParams = urlParams.concat(v[x].split(spliter));
					}
				}else{
					urlParams = urlParams.split(spliter);
				}
			} else {
				urlParams = [urlParams];
			}
			haveQuery = true;
		} else {
			urlParams = [url];
		}
		var valueArr = [];
		for (var i = 0, len = urlParams.length; i < len; i++) {
			var params = urlParams[i].split("=");
			if (params[0] == _key) {
				valueArr.push(params[1]);
			}
		}
		if (valueArr.length > 0) {
			if (valueArr.length == 1) {
				return valueArr[0];
			}
			return valueArr;
		}
		return "";
	}