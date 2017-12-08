    var $$ = function (tagName, oParent) {return (oParent || document).getElementsByTagName(tagName)};

    var AutoPlay = function(id,inner) {
    	this.initialize(id,inner)
    };

    AutoPlay.prototype = {
    	initialize: function(id,inner) {
    		var oThis = this;
    		this.oBox = $(id);
    		this.oUl = $(inner);
    		this.aImg = $$("img", this.oBox);;
    		this.timer = null;
    		this.autoTimer = null;
    		this.iNow = 0;
    		this.creatBtn();
    		this.aBtn = $$("li", this.oCount);
    		this.toggle();
    		this.autoTimer = setInterval(function() {
    			oThis.next()
    		}, 3000);
    	},
    	creatBtn: function() {
    		this.oCount = document.createElement("ul");
    		this.oFrag = document.createDocumentFragment();
    		this.oCount.className = "count";
    		for (var i = 0; i < this.aImg.length; i++) {
    			var oLi = document.createElement("li");
    			oLi.innerHTML = "<img width='15' height='14' src='images/dian1.png'>";
    			this.oFrag.appendChild(oLi)
    		}
    		this.oCount.appendChild(this.oFrag);
    		this.oBox.appendChild(this.oCount)
    	},
    	toggle: function() {
    		for (var i = 0; i < this.aBtn.length; i++) {
    			this.aBtn[i].innerHTML = "<img width='15' height='14' src='images/dian1.png'>";
    		} //this.aBtn[i].className = "";
    		//this.aBtn[this.iNow].className = "current";
    		this.aBtn[this.iNow].innerHTML = "<img width='15' height='14' src='images/dian0.png'>";
    		this.doMove(-(this.iNow * this.aImg[0].offsetHeight))
    	},
    	next: function() {
    		this.iNow++;
    		this.iNow == this.aBtn.length && (this.iNow = 0);
    		this.toggle()
    	},
    	doMove: function(iTarget) {
    		var oThis = this;
    		clearInterval(oThis.timer);
    		oThis.timer = setInterval(function() {
    			var iSpeed = (iTarget - oThis.oUl.offsetTop) / 5;
    			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
    			oThis.oUl.offsetTop == iTarget ? clearInterval(oThis.timer) : (oThis.oUl.style.top = oThis.oUl.offsetTop + iSpeed + "px")
    		}, 50)
    	}
    };
