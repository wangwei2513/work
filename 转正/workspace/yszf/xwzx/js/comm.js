//获取时间并转化成年月日和星期
function getDayAngTime(){
  var date = new Date();
  var day = date.getDate();
  var mouth = date.getMonth() + 1;
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var weekday=new Array(7);
  if(hour < 10 ){
     hour = "0" + hour;
  }
  if(mouth < 10 ){
     mouth = "0" + mouth;
  }
  if(minutes < 10 ){
     minutes = "0" + minutes;
  }
  weekday[0]="星期日";
  weekday[1]="星期一";
  weekday[2]="星期二";
  weekday[3]="星期三";
  weekday[4]="星期四";
  weekday[5]="星期五";
  weekday[6]="星期六";
  $("timeInDay").innerText = hour + ":" + minutes;
  $("mouth").innerText = mouth + "月" + day + "日";
  $("week").innerText = weekday[date.getDay()];
}

//转换utc时间为yyyy/mm/dd&hh:mm:ss
function changeToDate (utc) {
  var date  = new Date(utc*1000);
  var year  = date.getFullYear(),
    month = addZero(date.getMonth()+1),
    day   = addZero(date.getDate()),
    hour  = addZero(date.getHours()),
    min   = addZero(date.getMinutes()),
    sec   = addZero(date.getSeconds());
  
  return year+"/"+month+"/"+day+"&"+hour+":"+min+":"+sec;
}

function getTimes(time,_type){
  var times = (parseInt(time)+24*3600)%(24*3600);
  var min = parseInt(times/60);
  var second = 0;
  var hour = 0;
  if(min>0){
    second = times%60;
    second = second.toString().length==1?"0"+second:second;
    hour = parseInt(min/60)%24;
    if(hour>0){
      min = min%60;
      min = min.toString().length==1?"0"+min:min;
      hour = hour.toString().length==1?"0"+hour:hour;
      if(_type == "nosecond") return hour+":"+min;
      return hour+":"+min+":"+second;
    }else{
      min = min.toString().length==1?"0"+min:min;
      if(_type == "nosecond") return "00:"+min;
      return "00:"+min+":"+second;
    }
  }else{
    second = times.toString().length==1?"0"+times:times;
    if(_type == "nosecond") return "00:00";
    return "00:00:"+second;
  }
}

//marquee 删减显示的标题,标题滚动
function getDisplayString(str,len){
  var totalLength=0;
  var toMarqueeFlag = false;
  var position=0;
  for(var i=0;i<str.length;i++){
    var intCode=str.charCodeAt(i);//zhuswy--返回指定位置的字符的 Unicode 编码
    if(intCode>=0&&intCode<=128){
      totalLength+=1;//非中文单个字符长度加1
    }else{
      totalLength+=2;//中文字符长度则加2
    }
  
    if(totalLength > len){
      if(i%2==1){
        position = i-1;
      }else{
        position = i;
      }
      toMarqueeFlag = true;
      break;
    }
  }
  if(toMarqueeFlag)
    return str.substring(0,position);
    
  return "";
} 
/*获取url参数*/
//getUrlParams("menuPos",window.location.href)
function getUrlParams(_key, _url) {
  if (typeof(_url) == "object") {
    _url = _url.location.href;
  } else {
    _url = (typeof(_url) == "undefined" || _url == null || _url == "") ? window.location.href : _url;
  }
  if (_url.indexOf("?") == -1) {
    return "";
  }
  var params = [];
  _url = _url.split("?")[1].split("&");
  for (var i = 0, len = _url.length; i < len; i++) {
    params = _url[i].split("=");
    if (params[0] == _key) {
      return params[1];
    }
  }
  return "";
}
/*2D滚动效果*/
function listSlip_2D(_opation,__f){
  this.currWindow = typeof(__f)=="undefined" ? window : __f;
  this.$ = function(__id){
    return this.currWindow.document.getElementById(__id);
  }

  this.objName =  _opation.objName;//对象前缀名称String
  this.listSize = _opation.listSize;//行数num
  this.rowHeight = _opation.rowHeight;//行高num
  this.focusObj = _opation.focusObj;//焦点对象String
  this.focusTop = _opation.focusTop;//焦点在第一行时TOP值
  this.dataLength = _opation.dataLength;//数据长度num
  this.focusRange = _opation.focusRange || [0,this.listSize-1];//焦点的起始范围
  this.focusTime = _opation.focusTime || 300;//焦点2D动作时间
  this.focusPos = _opation.focusPos || 0; //焦点位置 [定焦可选]
  this.listPos = _opation.listPos || 0; //数据位置 [定焦可选]
  this.show = _opation.show;//显示一行数据
  this.clear = _opation.clear;//清空一行数据
  this.divs = [];//各DIV的顺序
  this.divTop = [-this.rowHeight];//DIV，TOP值
  for(var i = 0;i <= this.listSize; i++){
    this.divs.push(i);
    this.divTop.push(i * this.rowHeight);
  }
  this.divPos = 0; // div 层的实际位置
  this.currPage = 1;//当前显示的页面。
  this.allPage = 1;//当前总共有多少页码
  this.hide = 1;// 隐藏层的位置。
  this.end;//数据到了尾端
  this.top;//数据到了首端
  this.moveTimer = null;//移动定时器。
  this.direction = (typeof(_opation.direction)=="undefined") ? "top" : _opation.direction;//变化的方向。
  this.moveTimes = 100;//移动间隔时间。必须设置。否则连续按键处理会出现问题。单位 ms
  this.moveFlag = true;//移动间隔是否完毕标记位。
}
listSlip_2D.prototype = {
  initData : function(){//init初始数据输出
    if(this.dataLength - 2 < this.focusRange[1]) this.focusRange = [0,this.dataLength - 1];
    if(this.focusRange[1] > this.listSize - 1) this.focusRange[1] = this.listSize - 1;
    if(this.listPos > this.dataLength - 1){
      this.listPos = this.focusRange[0];
    }
    if(this.listPos == 0) this.focusRange[0] = 0;

    if(this.focusPos < 0) this.focusPos = 0;
    if(this.focusPos > this.listSize - 1) this.focusPos = this.listSize - 1;
    if(this.focusPos > this.listPos) this.focusPos = this.listPos;

    this.divPos = this.focusPos;
    var startPos = this.listPos - this.focusPos;
    this.top = this.listPos == 0 ? true : false;
    this.end = this.listPos == this.dataLength - 1 ? true : false;
    for(var i = 0; i <= this.listSize; i++){
      if(startPos + i < this.dataLength){
        this.show(this.divs[i],startPos+i);
      }else{
        this.clear(this.divs[i]);
      }
    }
    this.$(this.focusObj).style.webkitTransitionDuration = "0ms";
    this.$(this.focusObj).style[this.direction] = (this.focusTop + this.rowHeight*this.focusPos) + "px";
    this.$(this.focusObj).style.webkitTransitionDuration = this.focusTime + "ms";
    this.currPage = Math.ceil((this.listPos + 1) / this.listSize);
    this.allPage  = Math.ceil(this.dataLength / this.listSize);
  },
  changePage : function(_num){
    if((this.currPage <= 1 && _num < 0) || (this.currPage >= this.allPage && _num > 0)) return;
    //if(this.currPage == this.allPage && this.dataLength % this.listSize < this.focusRange[0]) return;
    this.currPage += _num;
    this.focusPos = this.focusRange[0];
    this.listPos = (this.currPage - 1) * this.listSize + this.focusRange[0];
    this.$(this.focusObj).style.webkitTransitionDuration = "0ms";
    this.$(this.focusObj).style.opacity = 0;
    this.$(this.focusObj).style[this.direction] = (this.focusTop + this.rowHeight*this.focusPos) + "px";
    var start = this.listPos - this.focusPos;
    start = this.hide ? start : start - 1;
    for(var i = 0; i <= this.listSize; i++){
      if(start + i < this.dataLength && start + i >= 0){
        this.show(this.divs[i],start+i);
      }else{
        this.clear(this.divs[i]);
      }
    }
    this.divPos = this.hide ? this.focusRange[0] : this.focusRange[0] + 1;
    this.$(this.focusObj).style.webkitTransitionDuration = this.focusTime+"ms";
    this.$(this.focusObj).style.opacity = 1;
    this.top = this.listPos == 0 ? true : false;
    this.end = this.listPos == this.dataLength - 1 ? true : false;
  },
  changeFocus : function(_num){
    if(this.dataLength == 0 || (this.top && _num < 0) || (this.end && _num > 0)) return;
    var self = this;
    if(!this.moveFlag) return;
    this.moveFlag = false;
    setTimeout(function(){self.moveFlag = true;},this.moveTimes);

    this.listPos += _num;
    this.focusPos += _num;
    this.divPos += _num;
    var needMove = false;
    var needChange = false;
    if(this.focusPos < this.focusRange[0] && _num < 0 && this.listPos > this.focusPos){
      needMove = true;
      this.focusPos = this.focusRange[0];
      if(this.hide == 1) needChange = true;
    }
    if(this.focusPos > this.focusRange[1] && _num > 0 && this.listPos < this.dataLength){
      needMove = true;
      this.focusPos = this.focusRange[1];
      if(this.hide == 0) needChange = true;
    }

    if(needChange){//改变隐藏层的位置
      if(this.hide){
        var obj = this.$(this.objName+this.divs[this.divs.length-1]);
        obj.style.webkitTransitionDuration = "0s";
        obj.style[this.direction] = (this.divTop[0]) + "px";
        var dataPos = this.listPos - this.focusPos;
        if(dataPos < this.dataLength) this.show(this.divs[this.divs.length - 1],dataPos);
        else this.clear(this.divs[this.divs.length - 1]);
        this.divs.moveBack();
        this.divPos++;
      }else{
        var obj = this.$(this.objName+this.divs[0]);
        obj.style.webkitTransitionDuration = "0s";
        obj.style[this.direction] = (this.divTop[this.divTop.length - 1]) + "px";
        var dataPos = this.listPos + this.listSize - 1 - this.focusRange[1];
        if(dataPos < this.dataLength) this.show(this.divs[0],dataPos);
        else this.clear(this.divs[0]);
        this.divs.movePre();
        this.divPos--;
      }
      this.hide = this.hide ? 0 : 1;
    }
    if(needMove){//改变普通DIV的坐标位置。
      if(this.moveTimer)clearTimeout(this.moveTimer);
      this.moveTimer = setTimeout(function(){
        for(var i = 0; i <= self.listSize; i++){
          self.$(self.objName+self.divs[i]).style.webkitTransitionDuration = self.focusTime+"ms";
          var n = _num > 0 ? i : i + 1;
          self.$(self.objName+self.divs[i]).style[self.direction] = (n * self.rowHeight + self.divTop[0]) + "px";
        }
        self.hide = _num > 0 ? 0 : 1;
      },100);
    }else{//只需要移动focus焦点框
      this.$(this.focusObj).style.webkitTransitionDuration = this.focusTime+"ms";
      this.$(this.focusObj).style[this.direction] = (this.focusTop + this.rowHeight * this.focusPos) + "px";
    }
    this.top = this.listPos == 0 ? true : false;
    this.end = this.listPos == this.dataLength - 1 ? true : false;
    this.currPage = Math.ceil((this.listPos + 1) / this.listSize);
  },
  resetSlip:function(){//复位所有数据
    this.divs = [];
    for(var i = 0;i <= this.listSize; i++){
      this.divs.push(i);
    }
    for(var i = 0;i < this.divs.length; i++){
      //this.clear(i);
      this.$(this.objName+i).style.webkitTransitionDuration = "0ms";
      this.$(this.objName+i).style[this.direction] = (this.rowHeight * i) + "px";
    }
    this.hide = 1;      // 隐藏层的位置。
  }
}
Array.prototype.movePre = function(){
  var tempFirst = this[0];
  this.shift();
  this.push(tempFirst);
  return this;
}
//数组所有成员向右移动，末个调至首部
Array.prototype.moveBack = function(){
  var tempLast = this[this.length-1];
  this.pop();
  this.unshift(tempLast);
  return this;
}

/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
function showList(__listSize, __dataSize, __position, __startplace, __f){
  this.currWindow = typeof(__f)     =="undefined" ? iPanel.mainFrame : __f;
  this.listSize = typeof(__listSize)=="undefined" ? 0 : __listSize;  //列表显示的长度；
  this.dataSize = typeof(__dataSize)=="undefined" ? 0 : __dataSize;  //所有数据的长度；
  this.position = typeof(__position)=="undefined" ? 0 : __position;  //当前数据焦点的位置；
  this.focusPos = 0;      //当前列表焦点的位置；
  this.lastPosition = 0;  //前一个数据焦点的位置；
  this.lastFocusPos = 0;  //前一个列表焦点的位置；
  this.tempSize = 0;  //实际显示的长度；
  this.infinite = 0; //记录数值，用来获取数据焦点的位置；
  
  this.pageStyle  = 0;  //翻页时焦点的定位，0表示不变，1表示移到列表首部；
  this.pageLoop   = null;  //是否循环翻页, true表示是，false表示否；
  this.showLoop   = null;  //是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
  this.focusLoop  = null;  //焦点是否首尾循环切换；
  this.focusFixed = null;  //焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
  this.focusVary  = 1;  //当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
  this.focusStyle = 0;  //切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；
  
  this.showType = 1; //呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式； 
  this.listSign = 0; //0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
  this.listHigh = 30;  //列表中每个行的高度，可以是数据或者数组，例如：40 或 [40,41,41,40,42];
  this.listPage = 1;  //列表的总页数量；
  this.currPage = 1;  //当前焦点所在页数；
  
  this.focusDiv = -1;  //列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40);
  this.focusPlace = new Array();  //记录每行列表焦点的位置值；
  this.startPlace = typeof(__startplace)=="undefined" ? 0 : __startplace;  //列表焦点Div开始位置的值；
  
  this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
  this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
  //调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；
  
  this.focusUp  = function(){this.changeList(-1);}; //焦点向上移动；
  this.focusDown= function(){this.changeList(1); }; //焦点向下移动；
  this.pageUp   = function(){this.changePage(-1);}; //列表向上鄱页；
  this.pageDown = function(){this.changePage(1); }; //列表向下鄱页；
  
  //开始显示列表信息
  this.startShow = function(){
    this.initAttrib();
    this.setFocus();
    this.showList();
  }
  //初始化所有属性；
  this.initAttrib = function(){ 
    if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";  //把数值转换成字符串；
    if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;  //设置滑动对象的方向值;
        
    if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;  //初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
    if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;  //初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false;
    if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false; //初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
    if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;   //初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
    if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;   //如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；
    
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
  //初始化焦点位置；
  this.initFocus = function(){
    this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
    if(this.showType == 0){  //当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
      this.focusPos = this.position%this.listSize;
    }else if(!this.focusFixed&&!this.showLoop){  //当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
      var tempNum = this.position-this.focusPos;
      if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
    }
  }
  //处理每行(列)所在的位置，并保存在数组里；
  this.initPlace = function(){
    var tmph = this.listHigh;
    var tmpp = [this.startPlace];   
    for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
    this.focusPlace = tmpp;
  }
  //切换焦点的位置
  this.changeList = function(__num){
    if(this.dataSize==0) return;
    if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
    this.changePosition(__num);
    this.checkFocusPos(__num);
  }
  //切换数据焦点的值
  this.changePosition = function(__num){
    this.infinite += __num;
    this.lastPosition = this.position;  
    this.position = this.getPos(this.infinite, this.dataSize);
  }
  //调整列表焦点并刷新列表；
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
      }else{
        this.changeFocus(__num);
      }
    }   
  }
  //切换列表焦点的位置
  this.changeFocus = function(__num){
    this.lastFocusPos = this.focusPos;
    this.focusPos += __num;
    this.setFocus(__num);
  }
  //设置调整当前焦点的位置；
  this.setFocus = function(__num){
    if(typeof(this.focusDiv)=="number") return;  //如果没定义焦点DIV，则不进行设置操作；
    var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));  //当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
    if(typeof(this.focusDiv)=="string"){  //直接设置焦点位置；
      this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
    }else if(typeof(__num)=="undefined"||tempBool){  //直接定位焦点；
      this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
    }else if(__num!=0){  //滑动焦点；
      this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
    }
  } 
  //切换页面列表翻页
  this.changePage = function(__num){  
    if(this.dataSize==0) return;
    var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;  //判断当前是否首页跳转尾页或尾页跳转首页;
    if(this.showLoop){   //如果内容是循环显示，则执行下面的翻页代码；
      if(isBeginOrEnd&&!this.pageLoop) return;
      var tempNum = this.listSize*__num;
      if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
        this.changePosition(this.focusPos*-1);
        this.checkFocusPos(this.focusPos*-1);
      }
      this.changePosition(tempNum);
      this.checkFocusPos(tempNum);
    }else{
      if(this.dataSize<=this.listSize) return;  //如果数据长度小长或等于列表显示长度，则不进行翻页；
      if(this.showType==0){
        if(isBeginOrEnd&&!this.pageLoop) return;   //如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
        var endPageNum = this.dataSize%this.listSize;  //获取尾页个数;
        var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;  //判断目标页是否为尾页;
        var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;   //判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；    
        var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize;  //判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
        overNum = this.pageStyle==0 ? overNum : this.focusPos;  //判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
        tempNum = tempNum*__num-overNum;        
        this.changePosition(tempNum);
        this.checkFocusPos(tempNum);
      }else{
        var tempPos   = this.position-this.focusPos;  //获取当前页列表首部的数据焦点；
        var tempFirst = this.dataSize-this.tempSize;  //获取尾页第一个数据焦点的位置；
        if(tempPos+__num<0||tempPos+__num>tempFirst){
          if(!this.pageLoop) return;  //不循环翻页时跳出，否则获取翻页后的数据焦点;
          tempPos = __num<0 ? tempFirst : 0;
        }else{
          tempPos += this.tempSize*__num;
          if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
        }   
        var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;  //判断当前翻页时焦点的style, 取得列表焦点位置；
        if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);  //如果this.focusPos不为0，则移动列表焦点到列表首部；
        this.changePosition(tempPos-this.position+tempNum); 
        this.showList();
      }
    }
  }
  //显示列表信息
  this.showList = function(){
    var tempPos = this.position-this.focusPos;   //获取当前页列表首部的数据焦点；
    for(var i=tempPos; i<tempPos+this.listSize; i++){   
      var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };  //定义一个对象，设置当前列表焦点和数据焦点值；
      ( i >= 0 && i < this.dataSize)||(this.showLoop && this.dataSize !=0 ) ? this.haveData(tempObj) : this.notData(tempObj);  //当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
    }
    this.currPage = Math.ceil((this.position+1)/this.listSize);
    this.listPage = Math.ceil(this.dataSize/this.listSize);
  }
  //清除列表信息
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

/*
  @param string str:要滚动的字符串
  @param string targerElementName:字符串要显示的地方的id，比如某个div或者td的id
  @param number curFonsize:字符串的文字大小
  @param number speed:滚动的速度，不传则默认为30
*/
function marqueeText(str,targerElementName,curFonsize,speed)
{   
    var timeFlag = 0;
    var txtSpan1 = "";
    var txtSpan2 = "";
    var windowDiv  = "";
    var topDiv =  "";
    var fontSize = curFonsize; //当前元素限定字体的大小
    var textLength = 0;
    var textSpeed = speed || 30; // 滚动的速度

    function createScrollDiv(divName,text)
    {
        initElement(divName,text);
        window.setInterval(Marquee,textSpeed);
    }
    function initElement(divName,text)
    {
      
        textLength = text.replace(/[^\x00-\xff]/g,"**").length;
        topDiv = document.getElementById(divName);
    topDiv.innerHTML = "";
        
        windowDiv = document.createElement("div");
        txtSpan1 = document.createElement("span");
        txtSpan2 = document.createElement("span");

        windowDiv.appendChild(txtSpan1);
        windowDiv.appendChild(txtSpan2);
        topDiv.appendChild(windowDiv);

        windowDiv.style.position = "relative";
    windowDiv.style.width = topDiv.offsetWidth + "px";
        windowDiv.style.height = topDiv.offsetHeight + "px";
        windowDiv.style.overflow = "hidden";
    windowDiv.style.textAlign = "center";

        txtSpan1.innerHTML = text;
        txtSpan1.style.float = "left";
        txtSpan1.style.textAlign="left";
        txtSpan1.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
    txtSpan1.style.height = topDiv.offsetHeight + "px";
    txtSpan1.style.lineHeight = topDiv.offsetHeight + "px";
        txtSpan1.style.display = "block";
        txtSpan1.style.wordWrap = "normal";
        txtSpan1.style.overflow = "hidden";

        txtSpan2.innerHTML = text;
        txtSpan2.style.position = "relative";
        txtSpan2.style.textAlign="left";
        txtSpan2.style.left = windowDiv.offsetWidth + "px";
        txtSpan2.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
    txtSpan2.style.height = topDiv.offsetHeight + "px";
    txtSpan2.style.lineHeight = topDiv.offsetHeight + "px";
        txtSpan2.style.display = "none";
    }
    function Marquee()
    {
        if(timeFlag == 0)
        {
            if(txtSpan1.offsetWidth - windowDiv.offsetWidth - windowDiv.scrollLeft<=0)
            {
                txtSpan1.style.display = "none";
                txtSpan2.style.display = "block"
                windowDiv.scrollLeft = 0;
                timeFlag = 1;
            }else
            {             
                windowDiv.scrollLeft++;
            }
        }else
        {
            if(txtSpan2.offsetWidth - windowDiv.scrollLeft<=0)
            {             
                windowDiv.scrollLeft = 0;
            }else
            {             
                windowDiv.scrollLeft++;
            }
        }
    }
  createScrollDiv(targerElementName,str);
}
