/**
 * 检测实际图形是否是长方形
 * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
 * 如果一个网格都没有画，本方法也会返回true
 */
function checkSquare(_drawMap) {
	var wMax = _drawMap[0].length;	//几列
	var lMax = _drawMap.length;		//几行
	var squareInfo = drawSkeleton(_drawMap);
	// 假设drawSkeleton所画的长方形是符合图形规范的，那么画布上的实际图形应该满足在长方形内的网格都为1，而其它都为0
	for (var i=0; i<lMax; i++) {
		for (var j=0; j<wMax; j++) {
			if ((((i < squareInfo.ls || i > squareInfo.le) || (j < squareInfo.ws || j >squareInfo.we)) && _drawMap[i][j] != 0) || 
				(((i >= squareInfo.ls && i <= squareInfo.le) && (j >= squareInfo.ws && j <= squareInfo.we)) && _drawMap[i][j] == 0)) {
				return false;
			}
		}
	}
	return true;
}

/**
 * 假设数据符合长方形规则，画出长方形的4个顶点
 * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
 */
function drawSkeleton(_drawMap) {
	//"grid":[[0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
	iDebug(">>>smile_lc_portal drawSkeleton in _drawMap=" + _drawMap);
	var wMax = _drawMap[0].length;	// 几列
	var lMax = _drawMap.length;		// 几行
	var squareInfo = {
		divId : 0,
		ws : -1,	// 宽的起始横向下标  
		we : -1,	// 宽的结束横向下标
		ls : -1,	// 长的起始纵向下标  
		le : -1		// 长的结束纵向下标
	};
	// 遍历所有网格，从左上方第1个网格开始逐行读取
	for (var i=0; i<lMax; i++) {
		for (var j=0; j<wMax; j++) {
			// 第一次读取到1时，确定长方形左上方的顶点的坐标
			if (_drawMap[i][j] != 0 && squareInfo.ws == -1) {//查找左上
				squareInfo.ws = j;     
				squareInfo.ls = i;     
				// 从第一个顶点纵向读取，再读到0或者读到最大长度即可确定squareInfo.le，确定左下方顶点的坐标
				for (var k = i; k<lMax; k++) {//查找左下
					if ((k < lMax-1 && _drawMap[k+1][j] == 0) || (k == lMax-1 && _drawMap[k][j] > 0)) {
						squareInfo.le = k;   
						break;
					} 
				}
			// 从第一个顶点横向读取，再读到0或者读到最大长度确定长方形的宽度，得到右上方和右下方顶点的坐标
			} else if (_drawMap[i][j] == 0 && squareInfo.ws != -1) { //查找右上
				squareInfo.we = j-1; 
				break;
			}
			if (j == wMax-1 && _drawMap[i][j] != 0) {//如果  j已经走到了 最右边  并且 _drawMap[i][j] != 0  那么宽的结束坐标为整个布局的最右边
				squareInfo.we = j;
				break;
			}
		}
		if (squareInfo.le != -1){//如果左下已经找到了就代表长方形的顶点已确认完毕
			break;
		}
	}
	iDebug(">>>smile_lc_portal drawSkeleton out squareInfo:ws=" + squareInfo.ws + ",we=" + squareInfo.we + ",ls=" + squareInfo.ls + ",le=" + squareInfo.le);		
	return squareInfo;
}

/**
 * 在页面上画出图形
 * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
 * _width：最小单元格的宽
 * _hight：最小单元格的高
 * _cellHigh：单元格之间的间距
 * _objId : 画出的图形的id
 * _parentId : 要将图形添加到的组件的id
 * _img：该单元格对应的图片
 */
function drawUnit(_drawMap,_width,_hight,_cellHigh, _objId, _parentId,_img) {
	var squareInfo = drawSkeleton(_drawMap);
	var unitInfo = {
		left : squareInfo.ws * (_width + _cellHigh),
		top : squareInfo.ls * (_hight + _cellHigh),
		width : (squareInfo.we - squareInfo.ws + 1) * _width + (squareInfo.we - squareInfo.ws) *_cellHigh,
		height : (squareInfo.le - squareInfo.ls + 1) *_hight + (squareInfo.le - squareInfo.ls) * _cellHigh
	}
	iDebug(">>>smile_lc_portal drawUnit left:"+unitInfo.left + ",top:"+unitInfo.top + ",width:" + unitInfo.width + ",height:"+unitInfo.height + ",_img:" + _img);
	var _str = "<div id=\"" + _objId + "\" style=\"position:absolute; width:" + unitInfo.width + "px; height:" + unitInfo.height + "px; top:" + unitInfo.top + "px; left:" + unitInfo.left + "px;background-image: url("+_img+")\"></div>";
	iDebug(">>>smile_lc_portal drawUnit _str=" + _str);
	document.getElementById(_parentId).innerHTML += _str;
}

