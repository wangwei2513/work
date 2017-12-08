function formatTime (formatter, d) {
  var weekdays = {
    chi: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    eng: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }

  if (!formatter || formatter == '') {
    formatter = 'yyyy-MM-dd hh:mm'
  }
  if (!d) {
    d = new Date()
  }
  var year = d.getFullYear().toString()
  var month = (d.getMonth() + 1).toString()
  var date = d.getDate().toString()
  var day = d.getDay()
  var hour = d.getHours().toString()
  var minute = d.getMinutes().toString()
  var second = d.getSeconds().toString()

  var yearMarker = formatter.replace(/[^y|Y]/g, '')
  if (yearMarker.length == 0) {
    year = ''
  }

  var monthMarker = formatter.replace(/[^M]/g, '')
  if (monthMarker.length > 1) {
    if (month.length == 1) {
      month = '0' + month
    }
  } else if (monthMarker.length == 0) {
    month = ''
  }

  var dateMarker = formatter.replace(/[^d|D]/g, '')
  if (dateMarker.length > 1) {
    if (date.length == 1) {
      date = '0' + date
    }
  } else if (dateMarker.length == 0) {
    date = ''
  }

  var hourMarker = formatter.replace(/[^h]/g, '')
  if (hourMarker.length > 1) {
    if (hour.length == 1) {
      hour = '0' + hour
    }
  } else if (hourMarker.length == 0) {
    hour = ''
  }

  var minuteMarker = formatter.replace(/[^m]/g, '')
  if (minuteMarker.length > 1) {
    if (minute.length == 1) {
      minute = '0' + minute
    }
  } else if (minuteMarker.length == 0) {
    minute = ''
  }

  var secondMarker = formatter.replace(/[^s]/g, '')
  if (secondMarker.length > 1) {
    if (second.length == 1) {
      second = '0' + second
    }
  } else if (secondMarker.length == 0) {
    second = ''
  }
}
function showList (__listSize, __dataSize, __position, __startplace, __f) {
  this.currWindow = typeof (__f) == 'undefined' ? iPanel.mainFrame : __f
  this.listSize = typeof (__listSize) == 'undefined' ? 0 : __listSize; // 列表显示的长度；
  this.dataSize = typeof (__dataSize) == 'undefined' ? 0 : __dataSize; // 所有数据的长度；
  this.position = typeof (__position) == 'undefined' ? 0 : __position; // 当前数据焦点的位置；
  this.focusPos = 0; // 当前列表焦点的位置；
  this.lastPosition = 0; // 前一个数据焦点的位置；
  this.lastFocusPos = 0; // 前一个列表焦点的位置；
  this.tempSize = 0; // 实际显示的长度；
  this.infinite = 0; // 记录数值，用来获取数据焦点的位置；

  this.pageStyle = 0; // 翻页时焦点的定位，0表示不变，1表示移到列表首部；
  this.pageLoop = null; // 是否循环翻页, true表示是，false表示否；
  this.showLoop = null; // 是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
  this.focusLoop = null; // 焦点是否首尾循环切换；
  this.focusFixed = null; // 焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
  this.focusVary = 1; // 当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
  this.focusStyle = 0; // 切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；

  this.showType = 1; // 呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式；	
  this.listSign = 0; // 0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
  this.listHigh = 30; // 列表中每个行的高度，可以是数据或者数组，例如：40 或 [40,41,41,40,42]
  this.listPage = 1; // 列表的总页数量；
  this.currPage = 1; // 当前焦点所在页数；

  this.focusDiv = -1; // 列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40)
  this.focusPlace = []; // 记录每行列表焦点的位置值；
  this.startPlace = typeof (__startplace) == 'undefined' ? 0 : __startplace; // 列表焦点Div开始位置的值；

  this.haveData = function () {}; // 在显示列表信息时，有数据信息就会调用该方法；
  this.notData = function () {}; // 在显示列表信息时，无数据信息就会调用该方法；
  // 调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；

  this.focusUp = function () {this.changeList(-1);}; // 焦点向上移动；
  this.focusDown = function () {this.changeList(1); }; // 焦点向下移动；
  this.pageUp = function () {this.changePage(-1);}; // 列表向上鄱页；
  this.pageDown = function () {this.changePage(1); }; // 列表向下鄱页；

  // 开始显示列表信息
  this.startShow = function () {
    this.initAttrib()
    this.setFocus()
    this.showList()
  }
  // 初始化所有属性；
  this.initAttrib = function () {
    if (typeof (this.listSign) == 'number') this.listSign = this.listSign == 0 ? 'top' : 'left'; // 把数值转换成字符串；
    if (typeof (this.focusDiv) == 'object') this.focusDiv.moveSign = this.listSign; // 设置滑动对象的方向值

    if (this.focusFixed == null || (this.focusFixed && this.showType == 0)) this.focusFixed = false; // 初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
    if (this.showLoop == null) this.showLoop = this.focusFixed ? true : false; // 初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false
    if (this.pageLoop == null) this.pageLoop = this.showLoop ? true : false; // 初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false
    if (this.focusLoop == null) this.focusLoop = this.showLoop ? true : false; // 初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false
    if (!this.focusFixed && this.dataSize < this.listSize) this.showLoop = false; // 如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；

    if (this.focusVary < 1) this.focusVary = 1
    if (this.focusPos >= this.listSize) this.focusPos = this.listSize - 1
    if (this.focusPos < 0) this.focusPos = 0
    if (this.position >= this.dataSize) this.position = this.dataSize - 1
    if (this.position < 0) this.position = 0
    this.lastPosition = this.infinite = this.position

    this.initPlace()
    this.initFocus()
    this.lastFocusPos = this.focusPos
  }
  // 初始化焦点位置；
  this.initFocus = function () {
    this.tempSize = this.dataSize < this.listSize ? this.dataSize : this.listSize
    if (this.showType == 0) { // 当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
      this.focusPos = this.position % this.listSize
    }else if (!this.focusFixed && !this.showLoop) { // 当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
      var tempNum = this.position - this.focusPos
      if (tempNum < 0 || tempNum > this.dataSize - this.tempSize) this.focusPos = this.position < this.tempSize ? this.position : this.tempSize - (this.dataSize - this.position)
    }
  }
  // 处理每行(列)所在的位置，并保存在数组里；
  this.initPlace = function () {
    var tmph = this.listHigh
    var tmpp = [this.startPlace]
    for (var i = 1; i < this.listSize; i++) tmpp[i] = typeof (tmph) == 'object' ? (typeof (tmph[i - 1]) == 'undefined' ? tmph[tmph.length - 1] + tmpp[i - 1] : tmph[i - 1] + tmpp[i - 1]) : tmph * i + tmpp[0]
    this.focusPlace = tmpp
  }
  // 切换焦点的位置
  this.changeList = function (__num) {
    if (this.dataSize == 0) return
    if ((this.position + __num < 0 || this.position + __num > this.dataSize - 1) && !this.focusLoop) return
    this.changePosition(__num)
    this.checkFocusPos(__num)
  }
  // 切换数据焦点的值
  this.changePosition = function (__num) {
    this.infinite += __num
    this.lastPosition = this.position
    this.position = this.getPos(this.infinite, this.dataSize)
  }
  // 调整列表焦点并刷新列表；
  this.checkFocusPos = function (__num) {
    if (this.showType == 0) {
      var tempNum = this.showLoop ? this.infinite : this.position
      var tempPage = Math.ceil((tempNum + 1) / this.listSize)
      this.changeFocus(this.getPos(tempNum, this.listSize) - this.focusPos)
      if (this.currPage != tempPage) { this.currPage = tempPage;this.showList(); }
    }else {
      if ((this.lastPosition + __num < 0 || this.lastPosition + __num > this.dataSize - 1) && !this.showLoop && !this.focusFixed) {
        this.changeFocus(__num * (this.tempSize - 1) * -1)
        this.showList()
        return
      }
      if (this.focusPos + __num < 0 || this.focusPos + __num > this.listSize - 1 || this.focusFixed) {
        this.showList()
      }else {
        this.changeFocus(__num)
      }
    }
  }
  // 切换列表焦点的位置
  this.changeFocus = function (__num) {
    this.lastFocusPos = this.focusPos
    this.focusPos += __num
    this.setFocus(__num)
  }
  // 设置调整当前焦点的位置；
  this.setFocus = function (__num) {
    if (typeof (this.focusDiv) == 'number') return; // 如果没定义焦点DIV，则不进行设置操作；
    var tempBool = this.focusStyle == 0 && (Math.abs(this.focusPos - this.lastFocusPos) > this.focusVary || (Math.abs(this.position - this.lastPosition) > 1 && !this.showLoop)); // 当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
    if (typeof (this.focusDiv) == 'string') { // 直接设置焦点位置；
      this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + 'px'
    }else if (typeof (__num) == 'undefined' || tempBool) { // 直接定位焦点；
      this.focusDiv.tunePlace(this.focusPlace[this.focusPos])
    }else if (__num != 0) { // 滑动焦点；
      this.focusDiv.moveStart(__num / Math.abs(__num), Math.abs(this.focusPlace[this.focusPos] - this.focusPlace[this.lastFocusPos]))
    }
  }
  // 切换页面列表翻页
  this.changePage = function (__num) {
    if (this.dataSize == 0) return
    var isBeginOrEnd = this.currPage + __num < 1 || this.currPage + __num > this.listPage; // 判断当前是否首页跳转尾页或尾页跳转首页
    if (this.showLoop) { // 如果内容是循环显示，则执行下面的翻页代码；
      if (isBeginOrEnd && !this.pageLoop) return
      var tempNum = this.listSize * __num
      if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) {
        this.changePosition(this.focusPos * -1)
        this.checkFocusPos(this.focusPos * -1)
      }
      this.changePosition(tempNum)
      this.checkFocusPos(tempNum)
    }else {
      if (this.dataSize <= this.listSize) return; // 如果数据长度小长或等于列表显示长度，则不进行翻页；
      if (this.showType == 0) {
        if (isBeginOrEnd && !this.pageLoop) return; // 如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
        var endPageNum = this.dataSize % this.listSize; // 获取尾页个数
        var isEndPages = (this.getPos(this.currPage - 1 + __num, this.listPage) + 1) * this.listSize > this.dataSize; // 判断目标页是否为尾页
        var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos + 1 - endPageNum : 0; // 判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；		
        var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize; // 判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
        overNum = this.pageStyle == 0 ? overNum : this.focusPos; // 判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
        tempNum = tempNum * __num - overNum
        this.changePosition(tempNum)
        this.checkFocusPos(tempNum)
      }else {
        var tempPos = this.position - this.focusPos; // 获取当前页列表首部的数据焦点；
        var tempFirst = this.dataSize - this.tempSize; // 获取尾页第一个数据焦点的位置；
        if (tempPos + __num < 0 || tempPos + __num > tempFirst) {
          if (!this.pageLoop) return; // 不循环翻页时跳出，否则获取翻页后的数据焦点
          tempPos = __num < 0 ? tempFirst : 0
        }else {
          tempPos += this.tempSize * __num
          if (tempPos < 0 || tempPos > tempFirst) tempPos = __num < 0 ? 0 : tempFirst
        }
        var tempNum = this.pageStyle == 0 || this.focusFixed ? this.focusPos : 0; // 判断当前翻页时焦点的style, 取得列表焦点位置；
        if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) this.changeFocus(this.focusPos * -1); // 如果this.focusPos不为0，则移动列表焦点到列表首部；
        this.changePosition(tempPos - this.position + tempNum)
        this.showList()
      }
    }
  }
  // 显示列表信息
  this.showList = function () {
    var tempPos = this.position - this.focusPos; // 获取当前页列表首部的数据焦点；
    for (var i = tempPos; i < tempPos + this.listSize; i++) {
      var tempObj = { idPos: i - tempPos, dataPos: this.getPos(i, this.dataSize) }; // 定义一个对象，设置当前列表焦点和数据焦点值；
      (i >= 0 && i < this.dataSize) || (this.showLoop && this.dataSize != 0) ? this.haveData(tempObj) : this.notData(tempObj); // 当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
    }
    this.currPage = Math.ceil((this.position + 1) / this.listSize)
    this.listPage = Math.ceil(this.dataSize / this.listSize)
  }
  // 清除列表信息
  this.clearList = function () {
    for (var i = 0; i < this.listSize; i++) this.notData({ idPos: i, dataPos: this.getPos(i, this.dataSize) })
  }
  this.getPos = function (__num, __size) {
    return __size == 0 ? 0 : (__num % __size + __size) % __size
  }
  this.$ = function (__id) {
    return this.currWindow.document.getElementById(__id)
  }
}

function showList2D (listSize, dataSize, pos, time, f) {
  this.listSize = listSize
  this.dataSize = dataSize
  this.position = pos
  this.focusObj = null; // 焦点的对象{top:"10px",left:"10px",width:"10px",height:"10px"},{...}
  this.focusDiv = 'focusDiv'; // 移动的DIV
  this.haveData = function () {}
  this.noData = function () {}

  this.isLoop = false; // 是否数据循环

  // 属性
  this.currFocus = 0; // 0到this.listSize之间
  this.currPage = 0; // 当前页面
  this.maxPage = 0; // 最大页面
  this.pageLoop = null; // 是否循环翻页，true为是，false为否//_______________0624
  this.tempSize = 0; // 实际显示数据的长度//_______________0624
  this.time = typeof (time) == 'undefined' ? '200ms' : time
  // 内部属性
  this.listData = []
  this.startShow = function () {
    this.initAttrib() // _______________0624
    this.initData()
    if (this.dataSize == 0) {
      this.$(this.focusDiv).style.visibility = 'hidden'
    }else {
        console.log("295"+this.focusObj[this.currFocus].top)
      // this.currFocus = this.position % this.listSize
      // this.$(this.focusDiv).style.visibility="visible"
      this.$(this.focusDiv).style.webkitTransitionDuration = '0s'
      this.$(this.focusDiv).style.top = this.focusObj[this.currFocus].top
      this.$(this.focusDiv).style.left = this.focusObj[this.currFocus].left
      this.$(this.focusDiv).style.width = this.focusObj[this.currFocus].width
      this.$(this.focusDiv).style.height = this.focusObj[this.currFocus].height
    }
    this.showList()
  }

  this.initAttrib = function () { // _______________0624
    if (this.pageLoop == null) this.pageLoop = this.isLoop ? true : false
  }

  this.initData = function () { // 初始化数据
    this.listData = []
    if (this.dataSize == 0) return
    this.tempSize = this.dataSize < this.listSize ? this.dataSize : this.listSize // _______________0624
    // iPanel.debug("________eventsize"+this.dataSize)
    // iPanel.debug("________eventsize"+this.listSize)
    // iPanel.debug("________eventsize"+this.tempSize)
    if (this.dataSize < this.listSize) {
      if (this.position > this.dataSize) this.position = this.dataSize - 1

      for (var i = 0;i < this.dataSize; i++) {
        this.listData[i] = i
      }
      this.currFocus = this.position % this.listSize
    }else if ((this.position + this.listSize) > this.dataSize) { // 在最后
      if (this.position > this.dataSize) this.position = this.dataSize - 1

      var tempStartPos = this.dataSize - this.listSize
      this.currFocus = this.position - tempStartPos
      for (var i = 0,j = tempStartPos;j < this.dataSize; j++, i++) {
        this.listData[i] = j
      }
    }else { // 在数据中间
      this.currFocus = 0
      var tempStartPos = this.position
      var tempLength = this.position + this.listSize
      for (var i = 0,j = tempStartPos;j < tempLength; j++, i++) {
        this.listData[i] = j
      }
    }
  }

  this.getData = function (num) {
    var tempList = this.listData
    // //iPanel.debug("____event_listData"+tempList)
    var temp = 0
    if (num < 0) {
      for (var i = this.listData.length - 1; i > 0; i--) {
        this.listData[i] = this.listData[i - 1]
      }
      this.listData[0] = tempList[0] + num
    }else {
      for (var i = 0; i < this.listData.length - 1; i++) {
        this.listData[i] = this.listData[i + 1]
      }
      this.listData[this.listData.length - 1] = tempList[this.listData.length - 1] + num
    }
  }

  this.getPageData = function (__page) {
    // iPanel.debug("______event_currentPage"+this.currPage)
    var firstPos = 0
    var endPos = 0
    if (this.currPage == this.maxPage) {
      firstPos = this.dataSize - this.listSize
    // endPos = this.dataSize - 1 - firstPos
    // iPanel.debug("111111111")
    }else {
      firstPos = (this.currPage - 1) * listSize
    // endPos = firstPos + this.listSize - 1
    // iPanel.debug("222222")
    }
    endPos = firstPos + this.listSize - 1
    // var previousPosition = this.position
    this.currFocus = 0
    // //iPanel.debug("_____event_currFocus"+changeNum)
    this.position = firstPos
    this.changeFocus(0)
    // var firstPos = (this.currPage - 1) * listSize
    // iPanel.debug("_____event_firstPos"+firstPos)
    // iPanel.debug("_____event_endPos"+endPos)
    for (var i = firstPos,j = 0;i < endPos + 1;i++, j++) {
      this.listData[j] = i
    }
  // iPanel.debug("____event_listData"+this.listData)
  }

  this.changeList = function (num) { // 翻条
    if (this.dataSize == 0) return
    var tempEnd = this.dataSize
    // iPanel.debug("eventpage.htm--------this.changeList--num="+num+"----tempEnd="+tempEnd+";this.isLoop="+this.isLoop+";this.position="+this.position)
    if (!this.isLoop) {
      if ((this.position == 0 && num < 0) || (tempEnd - 1 == this.position && num > 0)) return

      this.position += num

      tempEnd = this.listData.length < parseInt(this.listSize) ? this.listData.length : parseInt(this.listSize)

      this.changeFocus(num)

      if (this.listData[0] > this.position || this.listData[tempEnd - 1] < this.position)
        this.getData(num)
      this.showList()
    }else {
      if (this.position == 0 && num < 0) {
        this.position = this.dataSize - 1
        tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize
        // iPanel.debug("------tempEnd="+tempEnd+";this.dataSize="+this.dataSize)
        this.currFocus = tempEnd - 1
        // iPanel.debug("-----aaa-tempEnd="+tempEnd+";this.dataSize="+this.dataSize)
        var tempStartPos = this.dataSize - this.listSize < 0 ? 0 : (this.dataSize - this.listSize)

        this.currFocus = this.position - tempStartPos
        for (var i = 0,j = tempStartPos;j < this.dataSize; j++, i++) {
          this.listData[i] = j
        }
        this.changeFocus(0)
      }else if (tempEnd - 1 == this.position && num > 0) {
        this.position = 0

        var tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize
        // iPanel.debug("----------tempEnd--="+tempEnd)
        for (var i = 0;i < tempEnd;i++)
          this.listData[i] = i
        this.currFocus = 0
        this.changeFocus(0)
      }else {
        this.position += num
        tempEnd = this.listData.length < parseInt(this.listSize) ? this.listData.length : parseInt(this.listSize)
        this.changeFocus(num)
        if (this.listData[0] > this.position || this.listData[tempEnd - 1] < this.position)
          this.getData(num)
      }
      this.showList()
    }
  }

  this.changeFocus = function (num) {
    var tempEnd = this.dataSize < this.listSize ? this.dataSize : this.listSize
    if ((this.currFocus == 0 && num < 0) || (this.currFocus == tempEnd - 1 && num > 0)) return
    this.currFocus += num
    //	this.$(this.focusDiv).style.webkitTransitionDuration = this.time 
    this.$(this.focusDiv).style.webkitTransitionDuration = '100ms'
    this.$(this.focusDiv).style.top = this.focusObj[this.currFocus].top
    this.$(this.focusDiv).style.left = this.focusObj[this.currFocus].left
    this.$(this.focusDiv).style.width = this.focusObj[this.currFocus].width
    this.$(this.focusDiv).style.height = this.focusObj[this.currFocus].height
  }

  this.changePage = function (__num) { // 翻页
    if (this.dataSize == 0) return
    var isBeginOrEnd = this.currPage + __num < 1 || this.currPage + __num > this.maxPage; // 判断当前是否首页跳转尾页或尾页跳转首页
    // iPanel.debug("______event_isBeginOrEnd"+isBeginOrEnd)
    if (isBeginOrEnd) return
    if (this.dataSize <= this.listSize) return
    // var currentPage = this.currPage;//当前页
    this.currPage += __num
    this.getPageData(this.currPage)
    this.showList()
  // var firstPos = (this.currPage - 1) * this.listSize;//每页的第一个数据焦点的位置
  // this.changePosition(pageSize)
  // this.initData()
  // this.showList()
  }

  this.showList = function () {
    if (this.dataSize == 0) return

    var tempLen = this.listData.length
    // iPanel.debug("class----showList---tempLen="+tempLen+";length="+this.listData.length+";this.listSize="+this.listSize)
    for (var i = 0;i < this.listSize; i++) {
      if (i < tempLen) {
        this.haveData({idPos: i,dataPos: this.listData[i]})
      }else {
        this.noData({idPos: i,dataPos: i})
      }
    }
    this.currPage = Math.ceil((this.position + 1) / this.listSize)
    this.maxPage = Math.ceil(this.dataSize / this.listSize)
  // iPanel.debug("_____event"+this.currPage)
  // iPanel.debug("_____event"+this.maxPage)
  }

  this.$ = function (id) {
    if (typeof (f) == 'object')
      return f.document.getElementById(id)
    else
      // return iPanel.mainFrame.document.getElementById(id)
      return window.document.getElementById(id)
  }
}

/********************************************滚动条**************************************************/
/*
 * 滑动对象，用来显示当前位置占总位置的比例
 * @param id 可以滑动的模块
 * @param barId 控制滑动范围的模块
 */
function ScrollBar (id, barId, f) {
  this.obj = null
  this.barObj = null
  if (typeof (f) == 'object') {
    this.obj = f.document.getElementById(id)
    if (barId) {
      this.barObj = f.document.getElementById(barId)
    }
  }else {
    // this.obj = iPanel.mainFrame.document.getElementById(id)
    this.obj = document.getElementById(id)
    if (barId) {
      // this.barObj = iPanel.mainFrame.document.getElementById(barId)
      this.barObj = document.getElementById(barId)
    }
  }
}

ScrollBar.prototype.init = function (totalNum, pageSize, maxBarLength, startPos, type) {
  this.startPos = startPos
  var percent = 1
  if (totalNum > pageSize) {
    percent = pageSize / totalNum
  }
  var barLength = percent * maxBarLength
  if (typeof (type) != 'undefined') {
    if (this.barObj != null) {
      this.barObj.style.height = Math.round(barLength) + 'px'
    }else {
      this.obj.style.height = Math.round(barLength) + 'px'
    }
    this.endPos = this.startPos + (maxBarLength - barLength)
  }else {
    this.endPos = this.startPos + maxBarLength
  }
  if (totalNum > 1) {
    this.footStep = (this.endPos - this.startPos) / (totalNum - 1)
  }else {
    this.footStep = 0
  }
}

ScrollBar.prototype.scroll = function (currPos) {
  var tempPos = this.startPos + this.footStep * currPos
  iDebug('global.js_ScrollBar_this.startPos==' + this.startPos)
  iDebug('global.js_ScrollBar_this.footStep==' + this.footStep)
  iDebug('global.js_ScrollBar_currPos==' + currPos)
  iDebug('global.js_ScrollBar_tempPos==' + tempPos)
  // alert(Math.round(tempPos))
  this.obj.style.top = Math.round(tempPos) + 'px'
  iDebug('global.js_ScrollBar_this.obj.style.top==' + this.obj.style.top)
}

function showDateTime () {
  // iDebug("showDateTime()-----start")
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  $('time').innerHTML = (parseInt(hour, 10) < 10 ? '0' : '') + hour + ':' + (parseInt(minute, 10) < 10 ? '0' : '') + minute + ':' + (parseInt(second, 10) < 10 ? '0' : '') + second
  $('date').innerHTML = year + '\/' + (parseInt(month, 10) + 1 < 10 ? '0' : '') + (parseInt(month, 10) + 1) + '\/' + (parseInt(day, 10) < 10 ? '0' : '') + day
  setTimeout(function () {
    showDateTime()
  }, 1000)
}

function getStrChineseLen (str, len) {
  var w = 0
  str = str.replace(/[ ]*$/g, '')
  if (getStrChineseLength(str) > len) {
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i)
      var flag = 0
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        w++
        flag = 0
      }else {
        w += 2
        flag = 1
      }
      if (parseInt((w + 1) / 2) > len) {
        if (flag == 1)return str.substring(0, i - 1) + '..'; // 修改,sunny,防止换行...
        else return str.substring(0, i - 2) + '..'
        break
      }
    }
  }
  return str
}

function getStrChineseLength (str) {
  str = str.replace(/[ ]*$/g, '..')
  var w = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      w++
    }else {
      w += 2
    }
  }
  var length = w % 2 == 0 ? (w / 2) : (parseInt(w / 2) + 1)
  return length
}

function getUrlArgs (_name, str) {
  var flag = new RegExp('.*\\b' + _name + '\\b(\\s*=([^&]+)).*', 'gi').test(str)
  if (flag) {
    return RegExp.$2
  }else {
    return ''
  }
}

function getUrlParams (_key, _url, _spliter) {
  if (typeof (_url) == 'object') {
    var url = _url.location.href
  } else {
    var url = _url ? _url : window.location.href
  }
  if (url.indexOf('?') == -1 && url.indexOf('#') == -1) {
    return ''
  }
  var spliter = _spliter || '&'
  var spliter_1 = '#'
  var haveQuery = false
  var x_0 = url.indexOf(spliter)
  var x_1 = url.indexOf(spliter_1)
  var urlParams
  if (x_0 != -1 || x_1 != -1 || url.indexOf('?') != -1) {
    if (url.indexOf('?') != -1) urlParams = url.split('?')[1]
    else if (url.indexOf('#') != -1) urlParams = url.split('#')[1]
    else urlParams = url.split(spliter)[1]
    if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) { // 可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
      var v = []
      if (urlParams.indexOf(spliter_1) != -1) {
        v = urlParams.split(spliter_1)
        urlParams = []
        for (var x = 0; x < v.length; x++) {
          urlParams = urlParams.concat(v[x].split(spliter))
        }
      }else {
        urlParams = urlParams.split(spliter)
      }
    } else {
      urlParams = [urlParams]
    }
    haveQuery = true
  } else {
    urlParams = [url]
  }
  var valueArr = []
  for (var i = 0, len = urlParams.length; i < len; i++) {
    var params = urlParams[i].split('=')
    if (params[0] == _key) {
      valueArr.push(params[1])
    }
  }
  if (valueArr.length > 0) {
    if (valueArr.length == 1) {
      return valueArr[0]
    }
    return valueArr
  }
  return ''
}

// 跑马灯
var marqueeContent = ['', '']
function getMarquee () {
  var Mar0_remember = sessionStorage.getItem('marqueeContent0')
  if (Mar0_remember != '' && Mar0_remember != 'undefined' && typeof (Mar0_remember) != 'undefined') {
    marqueeContent[0] = Mar0_remember
  }
  var Mar1_remember = sessionStorage.getItem('marqueeContent1')
  if (Mar1_remember != '' && Mar1_remember != 'undefined' && typeof (Mar1_remember) != 'undefined') {
    marqueeContent[1] = Mar1_remember
  }
}

var fly_marquee_id = 0; // 记录当前是哪个DIV正在显示中
var first_show = 1
function showMarquee () {
  if (first_show) { // 如是第一次
    first_show = 0
    $('marquee_ad' + fly_marquee_id).innerText = marqueeContent[fly_marquee_id]
  }else {
    $('marquee_ad' + (fly_marquee_id + 1) % 2).style.webkitTransitionDuration = '0ms'
    $('marquee_ad' + (fly_marquee_id + 1) % 2).style.top = '-30px'
    $('marquee_ad' + (fly_marquee_id + 1) % 2).innerText = marqueeContent[(fly_marquee_id + 1) % 2]
    $('marquee_ad' + fly_marquee_id).style.webkitTransitionDuration = '0ms'

    setTimeout(function () {
      $('marquee_ad' + fly_marquee_id).style.webkitTransitionDuration = '500ms'
      $('marquee_ad' + fly_marquee_id).style.top = '30px'; // 往下滚动
      $('marquee_ad' + (fly_marquee_id + 1) % 2).style.webkitTransitionDuration = '500ms'
      $('marquee_ad' + (fly_marquee_id + 1) % 2).style.top = '0px'; // 往下滚动
      fly_marquee_id = (fly_marquee_id + 1) % 2
    }, 5)
  }
  setTimeout('showMarquee();', 5000)
}

function setGlobalParms (kvJsonObj) {
  if (navigator.appName.indexOf('iPanel') != -1) {
    for (var key in kvJsonObj) {
      // iPanel.setGlobalVar(key+"",kvJsonObj[key])
      iPanel.misc.setGlobal(key + '', kvJsonObj[key] + '')
    }
    iPanel.misc.save()
  }else if (navigator.appName.indexOf('Netscape') != -1 || navigator.appName.indexOf('Google') != -1) {
    for (var key in kvJsonObj) {
      sessionStorage.setItem(key, kvJsonObj[key])
    // localStorage.setItem(key,kvJsonObj[key])
    }
  }
}

function getGlobalParms (key) {
  var value = ''
  if (navigator.appName.indexOf('iPanel') != -1) {
    // value = iPanel.getGlobalVar(key)
    value = iPanel.misc.getGlobal(key + '')
  }else if (navigator.appName.indexOf('Netscape') != -1 || navigator.appName.indexOf('Google') != -1) {
    value = sessionStorage.getItem(key)
  // var value = localStorage.getItem(key); 
  }
  // iDebug("getGlobalParms()--"+((typeof value)=="undefined")+"|"+(value == null)+"|"+(value == "")+"|value="+value)
  if ((typeof value) == 'undefined' || value == null || value == '')return ''
  else return value
}

function removeGlobalParms (keys) {
  if (typeof keys == 'undefined' || keys.length <= 0)return
  if (navigator.appName.indexOf('iPanel') != -1) {
    for (var i = 0,len = keys.length;i < len;i++) {
      // iPanel.delGlobalVar(keys[i]+"")
      iPanel.misc.deleteGlobal(keys[i] + '')
    }
    iPanel.misc.save()
  }else if (navigator.appName.indexOf('Netscape') != -1 || navigator.appName.indexOf('Google') != -1) {
    for (var i = 0,len = keys.length;i < len;i++) {
      sessionStorage.removeItem(keys[i] + '')
    // localStorage.removeItem(keys[i]+"")
    }
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

// ajax请求
function ajax_js (_url, fun, flag) {
  var oXmlHttp = null
  try { // Standard
    oXmlHttp = new XMLHttpRequest()
  } catch (exception) { // Internet Explorer
    try {
      oXmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
    } catch (exception) {
      try {
        oXmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
      } catch (exception) {
        return false
      }
    }
  }
  if (flag) {
    oXmlHttp.overrideMimeType('text/html; charset=gbk')
  }
  // oXmlHttp.overrideMimeType("text/html; charset=utf-8")

  oXmlHttp.onreadystatechange = function () {
    iDebug('oXmlHttp.readyState=' + oXmlHttp.readyState)
    // $('testConsole').innerText += "\noXmlHttp.readyState="+oXmlHttp.readyState
    // $('testConsole').innerText += "\noXmlHttp.status="+oXmlHttp.status
    if (oXmlHttp.readyState == 4) {
      if (oXmlHttp.status == 200 || oXmlHttp.status == 0) {
        iDebug('oXmlHttp.status=' + oXmlHttp.status)
        // $('testConsole').innerText += "\noXmlHttp.responseText="+oXmlHttp.responseText
        fun(oXmlHttp.responseText)
      }
    }
  }
  oXmlHttp.open('GET', _url, false)
  oXmlHttp.send(null)
}

function $ (id) {
  return document.getElementById(id)
}

function iDebug (_str) {
  if (navigator.appName.indexOf('iPanel') > -1) {
    iPanel.debug(_str)
  }else if (navigator.appName.indexOf('Netscape') > -1 || navigator.appName.indexOf('Google') > -1) {
    console.log(_str)
  }else if (navigator.appName.indexOf('Opera') > -1) {
    opera.postError(_str)
  }
}

function divDebug (_str) {
  var debugObj = document.getElementById('test')
  if (typeof debugObj != 'undefined' && debugObj != null) {
    debugObj.style.visibility = 'visible'
    debugObj.innerHTML += _str + '</br>'
  }
}
var navigatorFlag = getBrowserType()
function getCaNo () {
  var cardId = ''
  if (navigatorFlag == 'Inspur') {
    cardId = iSTB.settings.get('sys:ca0:cardnumber')
    cardId = cardId.toUpperCase()
  }else if (navigatorFlag == 'iPanel') {
    cardId = CA.card.cardId
  }else {
    cardId = '8538002343434353'
  }
  return cardId
}

function getBrowserType () {
  var ua = navigator.userAgent.toLowerCase()
  return /ipanel/.test(ua) ? 'iPanel' : /enrich/.test(ua) ? 'EVM' : /wobox/.test(ua) ? 'Inspur' : window.ActiveXObject ? 'IE' : document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox' : window.openDatabase && !/chrome/.test(ua) ? 'Safari' : /opr/.test(ua) ? 'Opera' : window.MessageEvent && !document.getBoxObjectFor ? 'Chrome' : ''
}

function getUrlParam (name) {
  var search = window.location.search.substring(1)
  var arr = search.split('&')
  for (var i = 0;i < arr.length;++i) {
    if (arr[i].split('=')[0] == name) {
      return arr[i].split('=')[1]
    }
  }
}
