// JavaScript Document

	
/*parmObj = {
	pageDivId:"page",			//��ʾ������������DIV���� (page0 page1)
	focusId:"focus",			//����ID
	arrLength:dataArr.length,	//�����ܳ���
	row:3,						//��ʾ��������
	list:4,						//��ʾ��������		
	rowHeight:200,				//�и�
	listWidth:300,				//�п�
	leftArrowId:"leftArrow",	//��������߼�ͷ��ID
	rightArrowId:"rightArrow"	//�������ұ߼�ͷ��ID
	haveDotArea:1,				//�Ƿ���ҳ�룿 0û�С�1��	
	//���haveDotAreaΪ0 �±���Щ����Ҫ��*************����ҳ����Ϣ
	dotWidth:20,				//ҳ��СԲ���ȣ�ע��0-9��9�����ֵĿ��Ӧ��һ��
	dotHeight:16,				//СԲ��ĸ� ����ʹСԲ�㴹ֱ����
	dotAreaDivBg:"pageBg",		//д��ҳ��СԲ������ֱ���DIV��id����ҳ�����ı����Ľ����ͽ�����.û�пɲ�д����
	dotAreaDivID:"",			//д��ҳ��СԲ������ֵ�DIV��ID 
	//dotAreaDivBgImg:"images/dotAreaDivBgImg.png",	//ҳ����DIV�ı���ͼƬ·�� ���ڱ�𽹵���ı仯(������������ҳ����)
	leftArrowId:"leftArrow",	//ҳ������߼�ͷId
	rightArrowId:"rightArrow",	//ҳ�����ұ߼�ͷId
	dotImgSrc:"images/dotImg.png",	//СԲ���ͼƬ·��
    numImgName:"images/pageNum",		//ҳ�����ֵ�����	//"images/pageNum0.png"��"images/pageNum9.png"
	dotFocusId:"dotFocus",			//ҳ�����Ľ��㣨�ƶ���ȦȦ��
	focusScale:"1.1"					//���������������ҳ����ʱ��Ҫ��Ҫ���ŵ�Ч������дʱĬ��Ϊ1.1�ķŴ���
	**********************
}*/

function flip(_parmObj){
	this.$ = function(_id){return document.getElementById(_id)};
	this.focusPos = 0;								//����λ��
	this.dataPos = 0;								//����λ��
	this.pageDivId = _parmObj.pageDivId;			//��ʾ������������DIV���� (page0 page1)
	this.focusId = _parmObj.focusId || "";			//����ID
	this.arrLength = _parmObj.arrLength;			//�����ܳ���
	this.row = _parmObj.row;						//��ʾ��������
	this.list = _parmObj.list;						//��ʾ��������
	this.leftDivLeft = -720;						//��ʾ�������Ƴ���λ��
	this.rightDivLeft = 720;						//��ʾ�������Ƴ���λ��
	this.moveDuration = "top";
	this.duration = "0ms";
	this.rowHeight = _parmObj.rowHeight;			//�и�	
	this.listWidth = _parmObj.listWidth;			//�п�
	this.haveDotArea = _parmObj.haveDotArea || 0;	//�Ƿ���ҳ�룿 0û�С�1��
	this.focusX = this.focusId==""?0:parseInt($(this.focusId).style.left);		//�����leftֵ
	this.focusY = this.focusId==""?0:parseInt($(this.focusId).style.top);			//�����topֵ

	this.leftArrowId = _parmObj.leftArrowId || "";	//��߼�ͷId
	this.rightArrowId = _parmObj.rightArrowId || "";//�ұ߼�ͷId	
	
	this.pageSize = this.row*this.list;			//ÿҳ�ĳ���
	this.haveData = function(){}; 				//����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷���
	this.notData = function(){}; 					//����ʾ�б���Ϣʱ����������Ϣ�ͻ���ø÷���
	this.totlePage = 0;								//��ҳ��
	this.currPage = 1;								//��ǰҳ
	this.currPageDiv = 0;							//��¼��ǰҳ����ʾ��DIV 0Ϊ��ʼ��ʾ�� 1Ϊ��ʼ���ص�
	this.otherPageDiv = 1;							//���ص�DIV
	this.areaFlag = 0;								//��¼��ǰ������������������ҳ����
	this.firstDivLeft = parseInt(this.$(this.pageDivId+0).style.left);
	this.secondDivLeft = parseInt(this.$(this.pageDivId+1).style.left);
	this.leftArrowLeft = this.leftArrowId==""?0:parseInt(this.$(this.leftArrowId).style.left);
	this.rightArrowLeft = this.rightArrowId==""?0:parseInt(this.$(this.rightArrowId).style.left);
	this.timeout = [];				//��ʱ������
	this.flag = 0;					//�ƶ�ҳ��ʱҳ���Ƿ��Ѿ�ˢ��
	this.firstFresh = 0;			//�ƶ�ҳ��ʱ�Ƶ���һҳʱҳ���Ƿ��Ѿ�ˢ��
	this.lastFresh = 0;				//�ƶ�ҳ��ʱ�Ƶ����һҳʱҳ���Ƿ��Ѿ�ˢ��
	//ҳ�������е��ж���
	this.dotDiv = [];				//ҳ��СԲ�������
	this.DotFocusPos = 0;			//ҳ��������λ��
	this.DotFocusStartLeft = 0;		//ҳ����������ʼλ��
	this.DotFirstDivLeft = 0;		//��һ��DIV��λ��
	this.DotLeftDivLeft = 0; 		//�ƶ���DIV�������λ�ã�
	this.DotRightDivLeft = 0;		//�ƶ���DIV�������λ�ã�
	this.dotFocusId = _parmObj.dotFocusId || "";	//ҳ�����Ľ��㣨�ƶ���ȦȦ��
	/********��ʼ������Ϣ��������㶨λ********/
	this.init = function(){
		this.totlePage = Math.ceil(this.arrLength/this.pageSize);
		this.currPage = this.dataPos==0?1:Math.ceil(this.dataPos/this.pageSize);
		//���Ҽ�ͷ����
		this.changeArrow();
		/******��Ϣ��DIV��������******/
		/*ȥ������DIV�ͽ���Ľ���Ч��*/
		this.$(this.pageDivId+0).style.webkitTransitionDuration = "0ms";
		this.$(this.pageDivId+1).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		/*��ȡ��ǰӦ����ʾ�ĸ�DIV*/
		this.currPageDiv = (this.currPage-1)%2;
		/*��ȡ��Ҫ���ص�DIV*/
		this.otherPageDiv = this.currPageDiv==0?1:0;
		this.$(this.pageDivId+this.currPageDiv).style[this.moveDuration] = this.firstDivLeft+"px";
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = this.secondDivLeft+"px";
		
		/*��������DIV�ͽ���Ľ���Ч��*/
		this.$(this.pageDivId+0).style.webkitTransitionDuration = "300ms";
		this.$(this.pageDivId+1).style.webkitTransitionDuration = "300ms";
		/*�����Ϣ*/
		for(var i=0;i<this.pageSize;i++){
			if(this.dataPos-this.focusPos+i<this.arrLength){
				this.haveData(this.currPageDiv,i,this.dataPos-this.focusPos+i);
			}else{
				this.notData(this.currPageDiv,i,this.dataPos-this.focusPos+i);
			}
		}
		/*���㶨λ*/
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		this.$(this.focusId).style.webkitTransitionDuration = this.duration;
		
	}
	/*�ƶ����㺯��*/
	this.changeFocus = function(_num){
		if(this.dataPos+_num<this.arrLength&&this.dataPos+_num>=0){
			this.dataPos += _num
			this.focusPos += _num;
			if(this.dataPos<0)this.dataPos=0;
			else if(this.dataPos>this.arrLength)this.dataPos=this.arrLength-1;
			clearTimeout(this.timeout[5]);
			if((this.focusPos+this.list+1)%this.list==0&&_num==-1&&(this.dataPos-this.pageSize+1)>=0){	
				/*����ʱ�����Ƶ�����߲������������	���󻬶�*/
				this.focusPos -= _num;
				this.dataPos += _num*(this.pageSize-1);
				this.changePage(-1);
			}else if((this.focusPos+this.list+1)%this.list==0&&_num==-1&&(this.dataPos-this.pageSize+1)<0){	
				/*����ʱ�����Ƶ�����߲������û������*/
				this.focusPos -= _num;
				this.dataPos -= _num;
				this.onFocus();
			}else if(this.focusPos%this.list==0&&_num==1&&(this.dataPos+this.pageSize-this.focusPos)<this.arrLength){	
				/*����ʱ�����Ƶ����ұ����ұ�������	���ұ߻�*/
				if(this.arrLength-this.pageSize*this.currPage<this.pageSize&&this.arrLength%this.pageSize<this.focusPos){
					this.focusPos = this.arrLength%this.pageSize-1;
					this.dataPos = this.arrLength-1;
				}else{
					this.focusPos -= _num;
					this.dataPos += _num*(this.pageSize-1);
				}
				this.changePage(1);
			}else if(this.focusPos%this.list==0&&_num==1&&(this.dataPos+this.pageSize-this.focusPos)>=this.arrLength){
				/*����ʱ�����Ƶ����ұ߲����ұ�û������	�����������ƽ�Ч��*/
				this.focusPos -= _num;
				this.dataPos -= _num;
				this.onFocus();
			}else if(this.focusPos>this.pageSize-1 && _num==this.list){
				 var tempfocus = this.focusPos%(this.row*this.list);
				 this.focusPos = this.dataPos+tempfocus==this.arrLength?tempfocus-1:tempfocus;
				 this.changePage(1);
				 //this.onFocus();
			}else if(this.focusPos<0 && _num==-this.list){
				this.focusPos = this.dataPos%this.pageSize;
				this.changePage(-1);
			}else{}
			if(this.focusPos%this.list==0 && this.currPage>1){	//����ٽ��ʱ ���ͷ����
				this.arrowMove(this.leftArrowId,-1,this.areaFlag,1);
			}else if((this.focusPos+this.list+1)%this.list==0 && this.currPage<this.totlePage){		//�ұ��ٽ��ʱ �Ҽ�ͷ����
				this.arrowMove(this.rightArrowId,1,this.areaFlag,1);
			}
		}else if((this.dataPos+_num>=this.arrLength || this.dataPos+_num<0) && (_num==-1||_num==1)){
			this.onFocus();
		}
		
	}
	this.onFocus = function(){
		var self = this;
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.opacity = "0";
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		this.$(this.focusId).style.webkitTransitionDuration = this.duration;
		this.$(this.focusId).style.opacity = "1";
	}
	/*�ƶ�ҳDIV���� _numΪ-1�����ƶ� _numΪ1�����ƶ�*/
	this.changePage = function(_num){
		//���ؽ���ͼ�ͷ
		if(this.leftArrowId!=""){
			this.$(this.leftArrowId).style.visibility = "hidden";
			this.$(this.rightArrowId).style.visibility = "hidden";
		}
		this.$(this.focusId).style.webkitTransitionDuration = "0ms";
		this.$(this.focusId).style.opacity = "0";
		/*******�������ƽ���DIV�ȷŵ���߻����ұ߲����������Ϣ******/
		this.$(this.pageDivId+this.otherPageDiv).style.webkitTransitionDuration = "0ms";
		var moveLeft = _num==1?this.rightDivLeft:this.leftDivLeft;		//�ж��ǰѼ����ƶ���DIV��������߻����ұ�
		var hidLeft = _num==1?this.leftDivLeft:this.rightDivLeft;		//�ж��ǰѼ����ƶ���DIV��������߻����ұ�
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = moveLeft+"px";		//�ƶ�λ��
		for(var i=0;i<this.pageSize;i++){								//�����Ϣ
			if(this.dataPos-this.focusPos+i<this.arrLength){
				this.haveData(this.otherPageDiv,i,this.dataPos-this.focusPos+i);
			}else{
				this.notData(this.otherPageDiv,i,this.dataPos-this.focusPos+i);
			}
		}
		
		//��ԭ����
		this.$(this.pageDivId+this.currPageDiv).style.webkitTransitionDuration = this.duration;
		this.$(this.pageDivId+this.otherPageDiv).style.webkitTransitionDuration = this.duration;
		//�ƶ�����DIV
		this.$(this.pageDivId+this.currPageDiv).style[this.moveDuration] = hidLeft+"px";
		this.$(this.pageDivId+this.otherPageDiv).style[this.moveDuration] = this.firstDivLeft+"px";
		
		
		
		this.currPage += _num;
		if(this.currPage<1)this.currPage=1;
		else if(this.currPage>this.totlePage)this.currPage=this.totlePage;
		//��ǰ��ʾ�ĸ�DIV
		this.currPageDiv = (this.currPage-1)%2;
		//�����ĸ�DIV
		this.otherPageDiv = this.currPageDiv==0?1:0;
		
		this.dataPos = (this.currPage-1)*this.pageSize+this.focusPos>this.arrLength?this.arrLength-1:(this.currPage-1)*this.pageSize+this.focusPos;
		this.focusPos = (this.currPage-1)*this.pageSize+this.focusPos>this.arrLength?this.arrLength%this.pageSize-1:this.focusPos;
		
		//�������¶�λ
		this.$(this.focusId).style.left = this.focusX+parseInt(this.focusPos%this.list)*this.listWidth+"px";
		this.$(this.focusId).style.top = this.focusY+parseInt(this.focusPos/this.list)*this.rowHeight+"px";
		
		var self = this;
		this.timeout[5] = setTimeout(function(){
			self.$(self.focusId).style.webkitTransitionDuration = this.duration;
			self.$(self.focusId).style.opacity = "1";
			self.changeArrow();
		},500);
	}
	
	this.changeArrow = function(){
		//���Ҽ�ͷ����
		if(this.leftArrowId!="" && this.totlePage>1){
			if(this.currPage<2){
				clearInterval(this.timeout[1]);
				this.$(this.leftArrowId).style.left = this.leftArrowLeft + "px";
				this.$(this.leftArrowId).style.visibility = "hidden";
				this.$(this.rightArrowId).style.visibility = "visible";
			}else if(this.currPage>1 && this.currPage<this.totlePage){
				this.$(this.leftArrowId).style.visibility = "visible";
				this.$(this.rightArrowId).style.visibility = "visible";
			}else if(this.currPage>this.totlePage-1){
				clearInterval(this.timeout[1]);
				this.$(this.rightArrowId).style.left = this.rightArrowLeft + "px";
				this.$(this.leftArrowId).style.visibility = "visible";
				this.$(this.rightArrowId).style.visibility = "hidden";
			}
		}
	}
	this.arrowMove = function(_id,_pos,_areaFlag,_flag){
		if(this.leftArrowId!=""){
			clearInterval(this.timeout[1]);
			this.$(this.leftArrowId).style.left = this.leftArrowLeft + "px";
			this.$(this.rightArrowId).style.left = this.rightArrowLeft + "px";
			if(_areaFlag==0&&_flag==1){
				var tempLeft = parseInt(this.$(_id).style.left);
				this.timeout[1] = setInterval(function(){
					this.$(_id).style.left = parseInt(this.$(_id).style.left)+_pos*2+"px";
					if(parseInt(this.$(_id).style.left)>tempLeft+6 || parseInt(this.$(_id).style.left)<tempLeft-6)_pos = _pos==1?-1:1;
				},50)
			}
		}
	}
	//����һ����ǰ��������λ�õ�id
	this.currId = function(){
		var currId = {page:null,num:null};
		currId.page = this.currPageDiv;
		currId.num = this.focusPos;
		return currId;
	}
	this.hid = function(_id){
		this.$(_id).style.webkitTransform = "scale("+this.scale+")";
		this.$(_id).style.opacity = "0";
	}
	this.vis = function(_id){
		this.$(_id).style.visibility = "visible";
		this.$(_id).style.opacity = "1";
		this.$(_id).style.webkitTransform = "scale(1)";
	}
}